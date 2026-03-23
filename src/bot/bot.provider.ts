import { type FactoryProvider, Inject } from '@nestjs/common'
import { Bot } from 'grammy'
import { EnvService } from 'src/env/env.service'

export { Bot }

export const BOT_PROVIDER = Symbol('DbProvider')

export const InjectBot = () => Inject(BOT_PROVIDER)

export const botProvider: FactoryProvider = {
  provide: BOT_PROVIDER,
  inject: [EnvService],
  useFactory: async (envService: EnvService) => {
    const bot = new Bot(envService.get('TG_BOT_TOKEN'))

    return bot
  },
}
