// TODO: find better way or add dotenv/config to deps
import 'dotenv/config'
import assert from 'node:assert/strict'
import * as Sentry from '@sentry/nestjs'

assert.ok(process.env.SENTRY_DSN, 'Env var SENTRY_DSN is required')

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  enableLogs: true,
  sampleRate: parseFloat(process.env.SENTRY_SAMPLE_RATE ?? '1.0'),
  tracesSampleRate: parseFloat(process.env.SENTRY_TRACE_SAMPLE_RATE ?? '1.0'),
  sendDefaultPii: true,
  integrations: [Sentry.postgresIntegration()],
})
