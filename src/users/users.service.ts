import assert from 'node:assert/strict'
import { Injectable } from '@nestjs/common'
import { Transactional, TransactionHost } from '@nestjs-cls/transactional'
import { eq, getColumns, sql } from 'drizzle-orm'
import { type DbTransactionalAdapter } from 'src/db/db.provider'
import * as schema from 'src/db/schema'
import type { CreateUserInput, User, UserWithDetails } from './interfaces'

@Injectable()
export class UsersService {
  constructor(
    private readonly txHost: TransactionHost<DbTransactionalAdapter>,
  ) {}

  @Transactional()
  async createUser(input: CreateUserInput): Promise<number> {
    const [user] = await this.txHost.tx
      .insert(schema.users)
      .values(input)
      .returning({ id: schema.users.id })

    assert(user)

    await this.txHost.tx.insert(schema.wallets).values({ userId: user.id })

    return user.id
  }

  async findUserWithDetailsById(
    userId: number,
  ): Promise<UserWithDetails | undefined> {
    const [user] = await this.txHost.tx
      .select({
        ...getColumns(schema.users),
        balance: schema.wallets.balance,
        promocode: schema.promocodes.code,
      })
      .from(schema.users)
      .innerJoin(schema.wallets, eq(schema.users.id, schema.wallets.userId))
      .leftJoin(
        schema.promocodes,
        eq(schema.users.id, schema.promocodes.userId),
      )
      .where(eq(schema.users.id, userId))

    return user
  }

  async findUserByTelegramId(telegramId: number): Promise<User | undefined> {
    const [user] = await this.txHost.tx
      .select()
      .from(schema.users)
      .where(eq(schema.users.telegramId, telegramId))

    return user
  }

  async changeBalance(userId: number, delta: number): Promise<number> {
    const [user] = await this.txHost.tx
      .update(schema.wallets)
      .set({
        balance: sql`${schema.wallets.balance} + ${delta}`,
        updatedAt: sql`now()`,
      })
      .where(eq(schema.wallets.userId, userId))
      .returning({ balance: schema.wallets.balance })

    if (!user) {
      throw new Error('Invalid user id')
    }

    return user.balance
  }

  async setBalance(userId: number, balance: number): Promise<void> {
    const [user] = await this.txHost.tx
      .update(schema.wallets)
      .set({
        balance,
        updatedAt: sql`now()`,
      })
      .where(eq(schema.wallets.userId, userId))
      .returning({ balance: schema.wallets.balance })

    if (!user) {
      throw new Error('Invalid user id')
    }
  }
}
