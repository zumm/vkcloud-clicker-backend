import { getLogger } from '@logtape/logtape'
import { BadRequestException, Injectable } from '@nestjs/common'
import { Transactional, TransactionHost } from '@nestjs-cls/transactional'
import { BoostersService } from 'src/boosters/boosters.service'
import { type DbTransactionalAdapter } from 'src/db/db.provider'
import * as schema from 'src/db/schema'
import { EnvService } from 'src/env/env.service'
import { LedgerService } from 'src/ledger/ledger.service'
import { MilestonesService } from 'src/milestones/milestones.service'
import { UsersService } from 'src/users/users.service'
import type {
  CreateClickSessionInput,
  ProcessRawClickSessionOutput,
  RawClickSession,
} from './interfaces'

@Injectable()
export class ClickerService {
  private readonly logger = getLogger(['app', ClickerService.name])

  constructor(
    private readonly envService: EnvService,
    private readonly usersService: UsersService,
    private readonly boostersService: BoostersService,
    private readonly ledgerService: LedgerService,
    private readonly milestonesService: MilestonesService,
    private readonly txHost: TransactionHost<DbTransactionalAdapter>,
  ) {}

  @Transactional()
  async processRawClickSession(
    userId: number,
    session: RawClickSession,
  ): Promise<ProcessRawClickSessionOutput> {
    let sessionId: number
    try {
      this.validateRawClickSession(session)

      sessionId = await this.createClickSession({
        userId,
        ...session,
      })
    } catch (error) {
      this.logger.warn('Received invalid click session from user #{userId}', {
        userId,
        session,
        error,
      })

      throw error
    }

    const boostersSummary = await this.boostersService.getUserBoostersSummary(
      userId,
      session.startedAt,
      session.endedAt,
    )

    const clickPower = this.boostersService.calculateClickPower(boostersSummary)
    const reward = Math.floor(session.totalClicks * clickPower)

    const balance = await this.usersService.changeBalance(userId, reward)

    await this.ledgerService.createRecord({
      userId,
      sourceType: 'CLICKS',
      sourceId: sessionId,
      amount: reward,
    })

    const isMilestoneReached = await this.milestonesService.handleBalanceChange(
      userId,
      balance - reward,
      balance,
    )

    this.logger.info(
      'Click session #{sessionId} from user #{userId} processed',
      { userId, sessionId, session, reward },
    )

    return { reward, balance, isMilestoneReached }
  }

  private validateRawClickSession(session: RawClickSession): void {
    const startedAt = session.startedAt.valueOf()
    const endedAt = session.endedAt.valueOf()

    const durationMs = endedAt - startedAt

    const isExpired =
      startedAt + this.envService.get('MAX_CLOCK_SKEW_MS') <=
      Date.now() - this.envService.get('CLICK_SESSION_TTL') * 1000
    const isFromFuture =
      endedAt - this.envService.get('MAX_CLOCK_SKEW_MS') > Date.now()

    if (
      durationMs <= 0 ||
      durationMs > this.envService.get('CLICK_SESSION_MAX_DURATION_MS') ||
      isExpired ||
      isFromFuture
    ) {
      throw new BadRequestException('Invalid interval')
    }

    const cps = (session.totalClicks / durationMs) * 1000

    if (cps > this.envService.get('CLICK_SESSION_CPS_LIMIT')) {
      throw new BadRequestException('Clicks too fast')
    }
  }

  private async createClickSession(
    input: CreateClickSessionInput,
  ): Promise<number> {
    const [session] = await this.txHost.tx
      .insert(schema.clickSessions)
      .values(input)
      .returning({ id: schema.clickSessions.id })
      // TODO: specify target when it will be possible
      // https://github.com/drizzle-team/drizzle-orm/issues/2646
      .onConflictDoNothing()

    // relying on click_sessions_no_overlapping constraint for overlapping sessions prevention
    if (!session) {
      throw new BadRequestException('Overlapping interval')
    }

    return session.id
  }
}
