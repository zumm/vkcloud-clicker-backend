import { getLogger } from '@logtape/logtape'
import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq'
import { type Bot, InjectBot } from './bot.provider'
import type { MessageJob } from './interfaces'

@Processor('tgPush')
export class TgPushProcessor extends WorkerHost {
  private readonly logger = getLogger(['app', TgPushProcessor.name])

  constructor(
    @InjectBot()
    private readonly bot: Bot,
  ) {
    super()
  }

  async process(job: MessageJob): Promise<void> {
    await this.bot.api.sendMessage(job.data.chatId, job.data.message)

    this.logger.info('Message sent to {jobData.chatId}', {
      jobId: job.id,
      jobData: job.data,
    })
  }

  @OnWorkerEvent('failed')
  onFailed(job: MessageJob, error: unknown) {
    this.logger.error('Processing job #{jobId} failed', {
      jobId: job.id,
      jobData: job.data,
      error,
    })
  }
}
