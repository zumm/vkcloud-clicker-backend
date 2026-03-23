import type { INestApplication } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { apiReference } from '@scalar/nestjs-api-reference'
import { cleanupOpenApiDoc } from 'nestjs-zod'

// TODO: nestjs-zod names DTOs with _Output postfix, disable it somehow
export function bootstrapSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('VK Cloud Clicker API')
    .setOpenAPIVersion('3.1.0')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'Authorization',
      description: 'JWT token',
      in: 'header',
    })
    .build()

  const oad = cleanupOpenApiDoc(
    SwaggerModule.createDocument(app, config, {
      operationIdFactory: (_, methodKey) => methodKey,
    }),
  )

  SwaggerModule.setup('api', app, oad, { ui: false })
  app.use('/api', apiReference({ content: oad }))
}
