import { Module } from '@nestjs/common'
import { BoostersModule } from 'src/boosters/boosters.module'
import { EnvModule } from 'src/env/env.module'
import { LedgerModule } from 'src/ledger/ledger.module'
import { MilestonesModule } from 'src/milestones/milestones.module'
import { UsersModule } from 'src/users/users.module'
import { ClickerController } from './clicker.controller'
import { ClickerService } from './clicker.service'

@Module({
  imports: [
    EnvModule,
    UsersModule,
    BoostersModule,
    LedgerModule,
    MilestonesModule,
  ],
  controllers: [ClickerController],
  providers: [ClickerService],
  exports: [ClickerService],
})
export class ClickerModule {}
