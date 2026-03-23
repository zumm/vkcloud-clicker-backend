import { Controller, Get, UseGuards } from '@nestjs/common'
import { ApiBearerAuth } from '@nestjs/swagger'
import { ZodResponse } from 'nestjs-zod'
import { AuthGuard } from 'src/auth/auth.guard'
import { UserId } from 'src/auth/user-id.decorator'
import { BoostersService } from './boosters.service'
import { UserBoosterViewListDto } from './dto'

@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller()
export class BoostersController {
  constructor(private readonly boostersService: BoostersService) {}

  @Get('/me/active-boosters')
  @ZodResponse({ type: UserBoosterViewListDto })
  async getActiveBoosters(@UserId() userId: number) {
    const items = await this.boostersService.getActiveUserBoosters(userId)
    return { items }
  }
}
