import { Module } from '@nestjs/common'
import { BoostersController } from './boosters.controller'
import { BoostersService } from './boosters.service'

@Module({
  providers: [BoostersService],
  controllers: [BoostersController],
  exports: [BoostersService],
})
export class BoostersModule {}
