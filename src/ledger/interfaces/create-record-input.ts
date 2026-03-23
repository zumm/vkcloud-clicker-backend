import type { ledger } from 'src/db/schema'

export type CreateRecordInput = Omit<typeof ledger.$inferInsert, 'createdAt'>
