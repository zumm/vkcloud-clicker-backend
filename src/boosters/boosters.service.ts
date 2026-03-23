import assert from 'node:assert/strict'
import { getLogger } from '@logtape/logtape'
import { Injectable } from '@nestjs/common'
import { TransactionHost } from '@nestjs-cls/transactional'
import { and, eq, gt, isNull, lte, or, sql } from 'drizzle-orm'
import { type DbTransactionalAdapter } from 'src/db/db.provider'
import * as schema from 'src/db/schema'
import {
  Booster,
  BoostersSummary,
  UserBooster,
  UserBoosterView,
} from './interfaces'

@Injectable()
export class BoostersService {
  private readonly logger = getLogger(['app', BoostersService.name])

  constructor(
    private readonly txHost: TransactionHost<DbTransactionalAdapter>,
  ) {}

  async applyBooster(userId: number, boosterId: number): Promise<number> {
    const [booster] = await this.txHost.tx
      .select({ duration: schema.boosters.duration })
      .from(schema.boosters)
      .where(eq(schema.boosters.id, boosterId))
      .limit(1)

    if (!booster) {
      this.logger.error(
        "Cannot apply booster #{boosterId} since it doesn't exist",
        {
          userId,
          boosterId,
        },
      )
      throw new Error('Invalid booster id')
    }

    const [userBooster] = await this.txHost.tx
      .insert(schema.userBoosters)
      .values({
        userId,
        boosterId,
        expiresAt: booster.duration
          ? sql`now() + ${booster.duration}`
          : undefined,
      })
      .returning({ id: schema.userBoosters.id })

    assert(userBooster)

    this.logger.info('Booster #{boosterId} applied to user #{userId}', {
      userId,
      boosterId,
    })

    return userBooster.id
  }

  async getUserBoostersSummary(
    userId: number,
    from: Date,
    to: Date,
  ): Promise<BoostersSummary> {
    // consider a booster active only if it was active for the entire time window
    const activeBoosters = await this.txHost.tx
      .select({
        type: schema.boosters.type,
        value: schema.boosters.value,
      })
      .from(schema.userBoosters)
      .innerJoin(
        schema.boosters,
        eq(schema.userBoosters.boosterId, schema.boosters.id),
      )
      .where(
        and(
          eq(schema.userBoosters.userId, userId),
          lte(schema.userBoosters.activatedAt, from),
          or(
            isNull(schema.userBoosters.expiresAt),
            gt(schema.userBoosters.expiresAt, to),
          ),
        ),
      )

    // TODO: replace with sql sum
    const result: BoostersSummary = {
      CLICK_ADDITIVE: 0,
      CLICK_MULTIPLIER: 1,
    }

    for (const booster of activeBoosters) {
      result[booster.type] += booster.value
    }

    return result
  }

  async getActiveUserBoosters(userId: number): Promise<UserBoosterView[]> {
    const rows = await this.txHost.tx
      .select({
        booster: schema.boosters,
        userBooster: schema.userBoosters,
      })
      .from(schema.userBoosters)
      .innerJoin(
        schema.boosters,
        eq(schema.userBoosters.boosterId, schema.boosters.id),
      )
      .where(
        and(
          eq(schema.userBoosters.userId, userId),
          or(
            isNull(schema.userBoosters.expiresAt),
            gt(schema.userBoosters.expiresAt, sql`now()`),
          ),
        ),
      )

    return rows.map(({ booster, userBooster }) =>
      this.mapUserBoosterView(booster, userBooster),
    )
  }

  calculateClickPower(boostersSummary: BoostersSummary): number {
    return (
      (1 + boostersSummary.CLICK_ADDITIVE) * boostersSummary.CLICK_MULTIPLIER
    )
  }

  private mapUserBoosterView(
    booster: Booster,
    userBooster: UserBooster,
  ): UserBoosterView {
    return {
      type: booster.type,
      value: booster.value,
      name: booster.name,

      userBoosterId: userBooster.id,
      activatedAt: userBooster.activatedAt,
      expiresAt: userBooster.expiresAt,
    }
  }
}
