import type { clickSessions } from 'src/db/schema'

export type CreateClickSessionInput = Omit<
  typeof clickSessions.$inferInsert,
  'createdAt'
>
