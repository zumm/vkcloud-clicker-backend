import assert from 'node:assert/strict'
import { getLogger } from '@logtape/logtape'
import { Injectable } from '@nestjs/common'
import { Transactional, TransactionHost } from '@nestjs-cls/transactional'
import { Cached, InvalidateTags } from '@nestjs-redisx/cache'
import { and, eq, getColumns, gte, notInArray, sql } from 'drizzle-orm'
import { type DbTransactionalAdapter } from 'src/db/db.provider'
import * as schema from 'src/db/schema'
import { GiftsService } from 'src/gifts/gifts.service'
import { UsersService } from 'src/users/users.service'
import type { RaffleOutput, Settings } from './interfaces'

@Injectable()
export class AdminService {
  private readonly logger = getLogger(['app', AdminService.name])

  constructor(
    private readonly usersService: UsersService,
    private readonly giftsService: GiftsService,
    private readonly txHost: TransactionHost<DbTransactionalAdapter>,
  ) {}

  @Cached({
    key: 'settings',
    tags: ['settings'],
    ttl: 5,
  })
  // TODO: there should be dedicated service for settings
  async getSettings(): Promise<Settings> {
    const [settings] = await this.txHost.tx
      .select()
      .from(schema.settings)
      .limit(1)

    assert(settings)

    return settings
  }

  @InvalidateTags({ tags: ['settings'] })
  async toggleCampaign(
    campaignState: Settings['campaignState'],
  ): Promise<void> {
    await this.txHost.tx.update(schema.settings).set({ campaignState })

    this.logger.info('Campaign state toggled to {campaignState}', {
      campaignState,
    })
  }

  @Transactional()
  async resetUserByTelegramId(telegramId: number): Promise<number | undefined> {
    const user = await this.usersService.findUserByTelegramId(telegramId)
    if (!user) {
      return undefined
    }

    await this.usersService.setBalance(user.id, 0)
    await this.txHost.tx
      .delete(schema.clickSessions)
      .where(eq(schema.clickSessions.userId, user.id))
    await this.txHost.tx
      .delete(schema.userBoosters)
      .where(eq(schema.userBoosters.userId, user.id))
    await this.txHost.tx
      .delete(schema.ledger)
      .where(eq(schema.ledger.userId, user.id))
    await this.txHost.tx
      .update(schema.promocodes)
      .set({ userId: null, raffledAt: null })
      .where(eq(schema.promocodes.userId, user.id))

    this.logger.warn('User #{userId} has been reset.', { userId: user.id })

    return user.id
  }

  @Transactional()
  async rafflePromocodes(): Promise<RaffleOutput> {
    const promocodes = await this.txHost.tx
      .select()
      .from(schema.promocodes)
      .for('update')

    const unusedPromocodes = promocodes.filter(({ userId }) => userId === null)
    if (unusedPromocodes.length === 0) {
      return {
        promocodesLeft: 0,
        result: [],
      }
    }

    const gifts = await this.giftsService.getGifts()
    const balanceTheshold = Math.max(...gifts.map(({ target }) => target))

    const formerWinnersIds = promocodes
      .map(({ userId }) => userId)
      .filter((id) => id != null)

    const winners = await this.txHost.tx
      .select({
        ...getColumns(schema.users),
      })
      .from(schema.users)
      .innerJoin(schema.wallets, eq(schema.users.id, schema.wallets.userId))
      .where(
        and(
          notInArray(schema.users.id, formerWinnersIds),
          gte(schema.wallets.balance, balanceTheshold),
        ),
      )
      .orderBy(sql`RANDOM()`)
      .limit(unusedPromocodes.length)

    if (unusedPromocodes.length > winners.length) {
      this.logger.warn(
        'There are not enough users to raffle all promocodes among',
        {
          winnersCount: winners.length,
          promocodesCount: unusedPromocodes.length,
        },
      )
    }

    const raffledCount = Math.min(unusedPromocodes.length, winners.length)

    const result: RaffleOutput['result'] = []
    for (let index = 0; index < raffledCount; index++) {
      const promocode = unusedPromocodes[index]
      const user = winners[index]
      assert(promocode && user)

      await this.txHost.tx
        .update(schema.promocodes)
        .set({ userId: user.id, raffledAt: sql`now()` })
        .where(eq(schema.promocodes.id, promocode.id))

      result.push({ user, code: promocode.code })
    }

    this.logger.info('Raffled out {raffledCount} promocodes', {
      raffledCount,
      result,
    })

    return {
      promocodesLeft: unusedPromocodes.length - raffledCount,
      result,
    }
  }
}
