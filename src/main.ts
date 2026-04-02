import './instrument'

import { expressLogger } from '@logtape/express'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { EnvService } from './env/env.service'
import { bootstrapLogtape, LogTapeLogger } from './logtape'
import { bootstrapSwagger } from './swagger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  })

  const envService = app.get(EnvService)

  await bootstrapLogtape({
    format: envService.get('LOGGER_FORMAT'),
    logLevel: envService.get('LOGGER_LOG_LEVEL'),
    sentryLogLevel: envService.get('LOGGER_SENTRY_LOG_LEVEL'),
  })

  const nestLogger = new LogTapeLogger()
  app.useLogger(nestLogger)

  app.use(
    expressLogger({
      category: ['app', 'express'],
      level: 'debug',
      format: 'dev',
    }),
  )

  if (envService.get('SWAGGER_ENABLED')) {
    bootstrapSwagger(app)
  }

  app.enableCors()

  const port = envService.get('PORT')
  await app.listen(port)

  const appUrl = await app.getUrl()
  nestLogger.log(`🚀 App is running on: ${appUrl}`)
}
bootstrap()
