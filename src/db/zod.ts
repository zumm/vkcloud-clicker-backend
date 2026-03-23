import { createSelectSchema } from 'drizzle-orm/zod'
import * as schema from './schema'

export const settingsSchema = createSelectSchema(schema.settings)

export const usersSchema = createSelectSchema(schema.users)
export const walletsSchema = createSelectSchema(schema.wallets)

export const boostersSchema = createSelectSchema(schema.boosters)
export const userBoostersSchema = createSelectSchema(schema.userBoosters)

export const giftsSchema = createSelectSchema(schema.gifts)
export const jackpotsSchema = createSelectSchema(schema.jackpots)

export const milestonesSchema = createSelectSchema(schema.milestones)
