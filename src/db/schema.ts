import {
  bigint,
  index,
  interval,
  jsonb,
  pgEnum,
  pgTable,
  real,
  smallint,
  text,
  timestamp,
} from 'drizzle-orm/pg-core'

const bigintjs = () => bigint({ mode: 'number' })
const id = () => bigintjs().primaryKey().generatedAlwaysAsIdentity()
const tstz = () => timestamp({ withTimezone: true })

export const campaignState = pgEnum('campaign_state', ['LIVE', 'OVER'])

export const settings = pgTable('settings', {
  campaignState: campaignState().notNull().default('LIVE'),
  botAdminIds: jsonb().notNull().default([]),
  botTemplateStart: text().notNull().default(''),
  botTemplateJackpot: text().notNull().default(''),
})

export const users = pgTable('users', {
  id: id(),
  telegramId: bigintjs().notNull().unique(),
  name: text(),
  photoUrl: text(),
  firstName: text(),
  lastName: text(),
  createdAt: tstz().notNull().defaultNow(),
})

export const wallets = pgTable('wallets', {
  userId: bigintjs()
    .references(() => users.id)
    .primaryKey(),
  balance: bigintjs().notNull().default(0),
  updatedAt: tstz().notNull().defaultNow(),
})

export const ledgerSourceType = pgEnum('ledger_source_type', ['CLICKS'])

export const ledger = pgTable('ledger', {
  id: id(),
  userId: bigintjs()
    .notNull()
    .references(() => users.id),
  sourceType: ledgerSourceType().notNull(),
  sourceId: bigintjs(),
  amount: bigintjs().notNull().default(0),
  createdAt: tstz().notNull().defaultNow(),
})

// TODO: add no overlapping constraint when it will be possible in drizzle
// https://github.com/drizzle-team/drizzle-orm/issues/4939
// atm this constraint is added by custom migration:
// CREATE EXTENSION IF NOT EXISTS "btree_gist";
// ALTER TABLE "click_sessions" ADD CONSTRAINT "click_sessions_no_overlapping" EXCLUDE USING GIST ("user_id" WITH =, tstzrange("started_at", "ended_at", '[)') WITH &&);
export const clickSessions = pgTable('click_sessions', {
  id: id(),
  userId: bigintjs()
    .notNull()
    .references(() => users.id),
  totalClicks: smallint().notNull(),
  startedAt: tstz().notNull(),
  endedAt: tstz().notNull(),
  createdAt: tstz().notNull().defaultNow(),
})

export const boosterType = pgEnum('booster_type', [
  'CLICK_MULTIPLIER',
  'CLICK_ADDITIVE',
])

export const boosters = pgTable('boosters', {
  id: id(),
  name: text().notNull(),
  type: boosterType().notNull(),
  duration: interval(),
  value: real().notNull(),
  createdAt: tstz().notNull().defaultNow(),
})

export const userBoosters = pgTable(
  'user_boosters',
  {
    id: id(),
    userId: bigintjs()
      .notNull()
      .references(() => users.id),
    boosterId: bigintjs()
      .notNull()
      .references(() => boosters.id),
    activatedAt: tstz().notNull().defaultNow(),
    expiresAt: tstz(),
    createdAt: tstz().notNull().defaultNow(),
  },
  (table) => [index().on(table.userId, table.activatedAt, table.expiresAt)],
)

export const gifts = pgTable(
  'gifts',
  {
    id: id(),
    name: text().notNull(),
    url: text().notNull(),
    imageUrl: text(),
    target: bigintjs().notNull(),
    createdAt: tstz().notNull().defaultNow(),
  },
  (table) => [index().on(table.target.asc())],
)

export const jackpots = pgTable('jackpots', {
  id: id(),
  name: text().notNull(),
  imageUrl: text(),
  createdAt: tstz().notNull().defaultNow(),
})

export const promocodes = pgTable('promocodes', {
  id: id(),
  userId: bigintjs()
    .unique()
    .references(() => users.id),
  code: text().notNull(),
  raffledAt: tstz(),
  createdAt: tstz().notNull().defaultNow(),
})

export const milestones = pgTable(
  'milestones',
  {
    id: id(),
    target: bigintjs().notNull(),
    boosterId: bigintjs()
      .notNull()
      .references(() => boosters.id),
    createdAt: tstz().notNull().defaultNow(),
  },
  (table) => [index().on(table.target.asc())],
)
