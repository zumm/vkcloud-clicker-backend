import type { users } from 'src/db/schema'

export type CreateUserInput = Omit<typeof users.$inferInsert, 'createdAt'>
