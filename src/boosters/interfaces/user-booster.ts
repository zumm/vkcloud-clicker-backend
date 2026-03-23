import type { userBoosters } from 'src/db/schema'

export type UserBooster = typeof userBoosters.$inferSelect
