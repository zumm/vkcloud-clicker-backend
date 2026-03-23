import type { Logger } from '@logtape/logtape'
import type { Context, NextFunction } from 'grammy'

export const ignoreOld = <T extends Context>(
  logger: Logger,
  thresholdMs = 5 * 60 * 1000,
) => {
  return (context: T, next: NextFunction) => {
    if (context.msg && Date.now() - context.msg.date * 1000 > thresholdMs) {
      logger.warn('Ignoring message #{messageId} since it is too old', {
        chatId: context.chat?.id,
        messageId: context.msg.message_id,
        sentAt: context.msg.date,
      })

      return
    }

    return next()
  }
}
