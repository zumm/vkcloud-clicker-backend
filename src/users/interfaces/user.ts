import type { users } from 'src/db/schema'
import type { Wallet } from './'

export type User = typeof users.$inferSelect
export type UserWithDetails = User &
  Pick<Wallet, 'balance'> & {
    promocode: string | null
  }
