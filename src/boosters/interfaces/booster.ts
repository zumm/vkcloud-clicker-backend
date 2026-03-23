import type { boosters } from 'src/db/schema'

export type Booster = typeof boosters.$inferSelect
