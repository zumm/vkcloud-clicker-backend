import type { clickSessions } from 'src/db/schema'

export type ClickSession = typeof clickSessions.$inferSelect
