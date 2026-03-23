import { getLogger } from '@logtape/drizzle-orm'
import { type FactoryProvider, Inject } from '@nestjs/common'
import type { TransactionalAdapterDrizzleOrm } from '@nestjs-cls/transactional-adapter-drizzle-orm'
import { sql } from 'drizzle-orm'
import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { EnvService } from 'src/env/env.service'
import { relations } from './relations'
import type * as schema from './schema'

export type Db = NodePgDatabase<typeof schema, typeof relations>
export type DbTransactionalAdapter = TransactionalAdapterDrizzleOrm<Db>

export const DB_PROVIDER = Symbol('DbProvider')

export const InjectDb = () => Inject(DB_PROVIDER)

export const dbProvider: FactoryProvider = {
  provide: DB_PROVIDER,
  inject: [EnvService],
  useFactory: async (envService: EnvService) => {
    const pool = new Pool({
      connectionString: envService.get('DB_URL'),
      ssl: false,
    })

    const db = drizzle({
      client: pool,
      relations,
      casing: 'snake_case',
      logger: getLogger({
        category: ['app', 'drizzle-orm'],
      }),
    })

    // check connection before starting up
    await db.execute(sql`select 23`)

    return db
  },
}
