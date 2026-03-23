import { Injectable } from '@nestjs/common'
import { TransactionHost } from '@nestjs-cls/transactional'
import { Cached } from '@nestjs-redisx/cache'
import { eq, gte } from 'drizzle-orm'
import { type DbTransactionalAdapter } from 'src/db/db.provider'
import * as schema from 'src/db/schema'
import { Gift, Jackpot } from './interfaces'

@Injectable()
export class GiftsService {
  constructor(
    private readonly txHost: TransactionHost<DbTransactionalAdapter>,
  ) {}

  @Cached({
    key: 'gifts',
    tags: ['gifts'],
    ttl: 60,
  })
  async getGifts(): Promise<Gift[]> {
    return this.txHost.tx
      .select()
      .from(schema.gifts)
      .orderBy(schema.gifts.target)
  }

  async getEarnedGifts(userId: number): Promise<Gift[]> {
    const userBalanceTuple = this.txHost.tx
      .select({
        0: schema.wallets.balance,
      })
      .from(schema.wallets)
      .where(eq(schema.wallets.userId, userId))

    return this.txHost.tx
      .select()
      .from(schema.gifts)
      .where(gte(userBalanceTuple, schema.gifts.target))
      .orderBy(schema.gifts.target)
  }

  @Cached({
    key: 'jackpot',
    tags: ['jackpot'],
    ttl: 60,
  })
  async getJackpot(): Promise<Jackpot | undefined> {
    const [jackpot] = await this.txHost.tx
      .select()
      .from(schema.jackpots)
      .limit(1)

    return jackpot
  }
}
