import { Injectable } from '@nestjs/common'
import { Transactional, TransactionHost } from '@nestjs-cls/transactional'
import { Cached } from '@nestjs-redisx/cache'
import { and, gt, lte } from 'drizzle-orm'
import { BoostersService } from 'src/boosters/boosters.service'
import { type DbTransactionalAdapter } from 'src/db/db.provider'
import * as schema from 'src/db/schema'
import { Milestone } from './interfaces'

@Injectable()
export class MilestonesService {
  constructor(
    private readonly boostersService: BoostersService,
    private readonly txHost: TransactionHost<DbTransactionalAdapter>,
  ) {}

  @Cached({
    key: 'milestones',
    tags: ['milestones'],
    ttl: 60,
  })
  async getMilestones(): Promise<Milestone[]> {
    return this.txHost.tx
      .select()
      .from(schema.milestones)
      .orderBy(schema.milestones.target)
  }

  @Transactional()
  async handleBalanceChange(
    userId: number,
    oldBalance: number,
    newBalance: number,
  ): Promise<boolean> {
    // since balance is ever increasing duplicates shouldn't be possible
    const reachedMilestones = await this.txHost.tx
      .select()
      .from(schema.milestones)
      .where(
        and(
          gt(schema.milestones.target, oldBalance),
          lte(schema.milestones.target, newBalance),
        ),
      )

    for (const milestone of reachedMilestones) {
      await this.boostersService.applyBooster(userId, milestone.boosterId)
    }

    return reachedMilestones.length > 0
  }
}
