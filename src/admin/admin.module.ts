import { Module } from '@nestjs/common'
import { GiftsModule } from 'src/gifts/gifts.module'
import { UsersModule } from 'src/users/users.module'
import { AdminController } from './admin.controller'
import { AdminService } from './admin.service'

@Module({
  controllers: [AdminController],
  imports: [UsersModule, GiftsModule],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
