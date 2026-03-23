import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { EnvService } from './env.service'
import { envSchema } from './schema'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (config) => envSchema.parse(config),
    }),
  ],
  providers: [EnvService],
  exports: [EnvService],
})
export class EnvModule {}
