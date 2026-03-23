// TODO: find better way or add dotenv/config to deps
import 'dotenv/config'
import assert from 'node:assert/strict'
import { defineConfig } from 'drizzle-kit'

assert.ok(process.env.DB_URL, 'Env var DB_URL is required')

export default defineConfig({
  out: './migrations',
  schema: ['./src/db/schema.ts'],
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DB_URL,
  },
  casing: 'snake_case',
  breakpoints: false,
})
