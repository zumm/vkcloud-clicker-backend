import { BullModule } from '@nestjs/bullmq'
import { Module } from '@nestjs/common'
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'
import { ClsPluginTransactional } from '@nestjs-cls/transactional'
import { TransactionalAdapterDrizzleOrm } from '@nestjs-cls/transactional-adapter-drizzle-orm'
import {
  CachePlugin,
  MsgpackSerializer,
  SERIALIZER,
} from '@nestjs-redisx/cache'
import { RedisModule } from '@nestjs-redisx/core'
import { SentryGlobalFilter, SentryModule } from '@sentry/nestjs/setup'
import { ClsModule } from 'nestjs-cls'
import { ZodSerializerInterceptor, ZodValidationPipe } from 'nestjs-zod'
import { AuthModule } from './auth/auth.module'
import { BotModule } from './bot/bot.module'
import { ClickerModule } from './clicker/clicker.module'
import { DbModule } from './db/db.module'
import { DB_PROVIDER } from './db/db.provider'
import { EnvModule } from './env/env.module'
import { EnvService } from './env/env.service'
import { GiftsModule } from './gifts/gifts.module'
import { MilestonesModule } from './milestones/milestones.module'

@Module({
  imports: [
    SentryModule.forRoot(),
    EnvModule,
    DbModule,
    ClsModule.forRoot({
      global: true,
      plugins: [
        new ClsPluginTransactional({
          imports: [DbModule],
          adapter: new TransactionalAdapterDrizzleOrm({
            drizzleInstanceToken: DB_PROVIDER,
          }),
        }),
      ],
    }),
    // TODO: remove 'redis' package when issue resolved
    // https://github.com/nestjs-redisx/nestjs-redisx/issues/4
    RedisModule.forRootAsync({
      imports: [EnvModule],
      inject: [EnvService],
      // @ts-expect-error https://github.com/nestjs-redisx/nestjs-redisx/issues/6
      useFactory: (envService: EnvService) => {
        const redisUrl = new URL(envService.get('REDIS_URL'))
        return {
          clients: {
            host: redisUrl.hostname,
            port: redisUrl.port,
            password: redisUrl.password,
            db: parseInt(redisUrl.pathname.split('/')[1] ?? '0', 10),
          },
        }
      },
      plugins: [
        new CachePlugin({
          l1: {
            // TODO: enable when issue resolved
            // https://github.com/nestjs-redisx/nestjs-redisx/issues/5
            enabled: false,
          },
        }),
      ],
    }),
    BullModule.forRootAsync({
      imports: [EnvModule],
      inject: [EnvService],
      useFactory: (envService: EnvService) => ({
        connection: {
          url: envService.get('REDIS_URL'),
        },
      }),
    }),
    AuthModule,
    ClickerModule,
    GiftsModule,
    MilestonesModule,
    BotModule,
  ],
  providers: [
    {
      provide: SERIALIZER,
      useValue: new MsgpackSerializer(),
    },
    {
      provide: APP_FILTER,
      useClass: SentryGlobalFilter,
    },
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ZodSerializerInterceptor,
    },
  ],
})
export class AppModule {}
