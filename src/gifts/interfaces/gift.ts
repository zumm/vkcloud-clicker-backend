import type { gifts } from 'src/db/schema'

export type Gift = typeof gifts.$inferSelect
