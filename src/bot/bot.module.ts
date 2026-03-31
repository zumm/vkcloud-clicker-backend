import { getLogger } from '@logtape/logtape'
import { BullModule } from '@nestjs/bullmq'
import {
  type MiddlewareConsumer,
  Module,
  type NestModule,
} from '@nestjs/common'
import { webhookCallback } from 'grammy'
import { AdminModule } from 'src/admin/admin.module'
import { EnvModule } from 'src/env/env.module'
// biome-ignore lint/style/useImportType: _
import { EnvService } from 'src/env/env.service'
import { TgPushProcessor } from './bot.processor'
import { type Bot, botProvider, InjectBot } from './bot.provider'
import { BotUpdate } from './bot.update'
import { ignoreOld } from './middlewares'

@Module({
  imports: [
    EnvModule,
    BullModule.registerQueue({
      name: 'tgPush',
      defaultJobOptions: {
        attempts: 8,
        backoff: {
          type: 'exponential',
          delay: 3000,
          jitter: 0.5,
        },
      },
    }),
    AdminModule,
  ],
  providers: [botProvider, BotUpdate, TgPushProcessor],
  exports: [botProvider],
})
export class BotModule implements NestModule {
  private readonly logger = getLogger(['app', BotModule.name])

  constructor(
    @InjectBot()
    private readonly bot: Bot,
    private readonly envService: EnvService,
  ) {
    this.bot.use(ignoreOld(this.logger))
  }

  async configure(consumer: MiddlewareConsumer) {
    const webhookUrl = new URL(
      '/webhooks/tg',
      this.envService.get('API_URL'),
    ).toString()

    try {
      await this.bot.api.setWebhook(webhookUrl)
    } catch (error) {
      this.logger.error('Unnable to set bot webhook', { error })
    }

    consumer
      .apply(webhookCallback(this.bot, 'express'))
      .forRoutes('/webhooks/tg')

    this.logger.info('Bot initialized', {
      webhookUrl,
    })
  }
}
