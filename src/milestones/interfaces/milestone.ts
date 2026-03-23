import type { milestones } from 'src/db/schema'

export type Milestone = typeof milestones.$inferSelect
