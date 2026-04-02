import * as z from 'zod'

const MINUTE = 60
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR
const WEEK = 7 * DAY

const number = <Schema extends z.core.SomeType>(schema: Schema) =>
  z.preprocess((value) => {
    if (typeof value === 'string' && z.regexes.number.test(value)) {
      return Number(value)
    }

    return value
  }, schema)

const array = <Schema extends z.core.SomeType>(schema: Schema) =>
  z.preprocess((value) => {
    if (typeof value === 'string') {
      return value.split(',')
    }

    return value
  }, schema)

const LOG_LEVELS = [
  'trace',
  'debug',
  'info',
  'warning',
  'error',
  'fatal',
] as const

export const envSchema = z.object({
  PORT: number(z.int().nonnegative().max(65536).default(3000)),
  SWAGGER_ENABLED: z.stringbool().default(false),
  MAX_CLOCK_SKEW_MS: number(
    z
      .int()
      .positive()
      .default(MINUTE * 1000),
  ),

  LOGGER_FORMAT: z.enum(['pretty', 'json']).default('json'),
  LOGGER_LOG_LEVEL: z.enum(LOG_LEVELS).default('info'),
  LOGGER_SENTRY_LOG_LEVEL: z.enum(LOG_LEVELS).optional(),

  AUTH_JWT_SECRET: z.string().min(1),
  AUTH_ACCESS_TOKEN_TTL: number(z.int().positive().default(MINUTE)),
  AUTH_REFRESH_TOKEN_TTL: number(z.int().positive().default(WEEK)),

  SENTRY_DSN: z.url(),
  SENTRY_SAMPLE_RATE: number(z.number().min(0).max(1).default(1)),
  SENTRY_TRACE_SAMPLE_RATE: number(z.number().min(0).max(1).default(1)),

  APP_URL: z.url(),
  API_URL: z.url(),
  DB_URL: z.url(),
  REDIS_URL: z.url(),

  TG_BOT_TOKEN: z.string().min(1),
  TG_BOT_PROTECTION_ENABLED: z.stringbool().default(true),
  TG_BOT_ADMIN_IDS: array(z.array(number(z.int().positive()))).default([]),

  CLICK_SESSION_CPS_LIMIT: number(z.int().positive()),
  CLICK_SESSION_MAX_DURATION_MS: number(z.int().positive().default(10000)),
  CLICK_SESSION_TTL: number(z.int().positive().default(WEEK)),
})

export type Env = z.infer<typeof envSchema>
