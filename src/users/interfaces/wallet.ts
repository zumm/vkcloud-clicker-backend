import type { wallets } from 'src/db/schema'

export type Wallet = typeof wallets.$inferSelect
