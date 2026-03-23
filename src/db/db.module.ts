import { Module } from '@nestjs/common'
import { EnvModule } from 'src/env/env.module'
import { dbProvider } from './db.provider'

@Module({
  imports: [EnvModule],
  providers: [dbProvider],
  exports: [dbProvider],
})
export class DbModule {}
