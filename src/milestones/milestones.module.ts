import { Module } from '@nestjs/common'
import { BoostersModule } from 'src/boosters/boosters.module'
import { MilestonesController } from './milestones.controller'
import { MilestonesService } from './milestones.service'

@Module({
  imports: [BoostersModule],
  controllers: [MilestonesController],
  providers: [MilestonesService],
  exports: [MilestonesService],
})
export class MilestonesModule {}
