import type { jackpots } from 'src/db/schema'

export type Jackpot = typeof jackpots.$inferSelect
