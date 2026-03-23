import { getLogger } from '@logtape/logtape'
import { InjectQueue } from '@nestjs/bullmq'
import { Cached } from '@nestjs-redisx/cache'
import { type Context, InlineKeyboard, type NextFunction } from 'grammy'
// biome-ignore lint/style/useImportType: _
import { AdminService } from 'src/admin/admin.service'
// biome-ignore lint/style/useImportType: _
import { EnvService } from 'src/env/env.service'
import { type Bot, InjectBot } from './bot.provider'
import type { TgPushQueue } from './interfaces'

const getStartMessage = () => `Жми «Играть» ⚡️
И погнали прокачивать память ☁️
`

const getWinMessage = (code: string) =>
  `<Тут должен быть какой-то текст о том что ты выиграл промокод "${code}">`

// TODO: reimplement using decorators
export class BotUpdate {
  private readonly logger = getLogger(['app', BotUpdate.name])

  constructor(
    private readonly envService: EnvService,
    private readonly adminService: AdminService,
    @InjectBot()
    private readonly bot: Bot,
    @InjectQueue('tgPush')
    private readonly tgPushQueue: TgPushQueue,
  ) {
    this.bot.command('start', this.onStart.bind(this))

    const adminGuard = this.adminGuard.bind(this)
    this.bot.command('resetme', adminGuard, this.onResetMe.bind(this))
    this.bot.command('raffle', adminGuard, this.onRaffle.bind(this))
    this.bot.command('toggle', adminGuard, this.onToggleCampaign.bind(this))
  }

  @Cached({
    key: 'bot-admin-ids',
    tags: ['bot-admin-ids'],
    ttl: 60,
  })
  private async getAdminIds(): Promise<Set<number>> {
    const settings = await this.adminService.getSettings()

    const fromDb = settings.botAdminIds as number[]
    const fromEnv = this.envService.get('TG_BOT_ADMIN_IDS')

    return new Set([...fromDb, ...fromEnv])
  }

  private async adminGuard(context: Context, next: NextFunction) {
    if (!this.envService.get('TG_BOT_PROTECTION_ENABLED')) {
      return next()
    }

    const adminIds = await this.getAdminIds()
    const telegramId = context.from?.id

    if (telegramId && adminIds.has(telegramId)) {
      this.logger.info('Sender #{telegramId} authorized as bot admin', {
        telegramId,
        command: context.message?.text,
      })

      return next()
    }

    this.logger.warn('Attempt to execute admin command without permissions', {
      telegramId,
      command: context.message?.text,
    })

    return context.reply('You do not have permissions to execute this command')
  }

  private async onStart(context: Context) {
    const keyboard = new InlineKeyboard().webApp(
      'Играть',
      this.envService.get('APP_URL'),
    )

    return context.reply(getStartMessage(), {
      reply_markup: keyboard,
    })
  }

  private async onResetMe(context: Context) {
    const telegramId = context.from?.id
    if (!telegramId) {
      return
    }

    const userId = await this.adminService.resetUserByTelegramId(telegramId)
    if (!userId) {
      return context.reply('Seems like you have not played our game yet')
    }

    return context.reply('You have been reset')
  }

  private async onRaffle(context: Context) {
    const { promocodesLeft, result } =
      await this.adminService.rafflePromocodes()

    if (promocodesLeft === 0 && result.length === 0) {
      return context.reply('There are no unused promocodes left')
    }

    let message = ''

    if (promocodesLeft > 0) {
      message += `There are not enough users to raffle all promocodes among. Promocodes left: ${promocodesLeft}\n`
    }

    if (result.length === 0) {
      return context.reply(message)
    }

    message += `Raffled promocodes:\n`
    message += result
      .map(({ user, code }) => `@${user.name} - ${code}`)
      .join('\n')

    const jobs = result.map(({ user, code }) => ({
      name: 'message' as const,
      data: {
        chatId: user.telegramId,
        message: getWinMessage(code),
      },
    }))
    await this.tgPushQueue.addBulk(jobs)

    return context.reply(message)
  }

  private async onToggleCampaign(context: Context) {
    const state = context.match
    if (state !== 'LIVE' && state !== 'OVER') {
      return context.reply('Campaign state must be either "LIVE" or "OVER"')
    }

    await this.adminService.toggleCampaign(state)

    return context.reply(`Campaign is ${state} now`)
  }
}
