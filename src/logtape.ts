import {
  configure,
  getConsoleSink,
  getLogger,
  jsonLinesFormatter,
} from '@logtape/logtape'
import { getPrettyFormatter } from '@logtape/pretty'
import { getSentrySink } from '@logtape/sentry'
import type { LoggerService } from '@nestjs/common'

// TODO: fix the mess
export class LogTapeLogger implements LoggerService {
  private logger = getLogger(['app', 'nestjs'])

  log(message: string, context?: string) {
    this.logger.info(this.escapeBraces(message), { context })
  }

  error(message: string, trace?: string, context?: string) {
    this.logger.error(this.escapeBraces(message), { trace, context })
  }

  warn(message: string, context?: string) {
    this.logger.warn(this.escapeBraces(message), { context })
  }

  debug(message: string, context?: string) {
    this.logger.debug(this.escapeBraces(message), { context })
  }

  verbose(message: string, context?: string) {
    this.logger.debug(this.escapeBraces(message), { context })
  }

  fatal(message: string, trace?: string, context?: string) {
    this.logger.fatal(this.escapeBraces(message), { trace, context })
  }

  private escapeBraces<T>(message: T): T | string {
    return typeof message === 'string'
      ? message.replaceAll('{', '{{').replaceAll('}', '}}')
      : message
  }
}

export const bootstrapLogtape = (format: 'pretty' | 'json') => {
  const formatter =
    format === 'json'
      ? jsonLinesFormatter
      : getPrettyFormatter({
          timestamp: 'time',
          properties: true,
        })

  configure({
    sinks: {
      console: getConsoleSink({ formatter }),
      sentry: getSentrySink({
        enableBreadcrumbs: true,
      }),
    },
    loggers: [
      { category: ['app'], sinks: ['console'], lowestLevel: 'debug' },
      { category: [], sinks: ['sentry'], lowestLevel: 'info' },
    ],
  })
}
