import { Controller, Get, NotFoundException, UseGuards } from '@nestjs/common'
import { ApiBearerAuth } from '@nestjs/swagger'
import { ZodResponse } from 'nestjs-zod'
import { AuthGuard } from 'src/auth/auth.guard'
import { UserId } from 'src/auth/user-id.decorator'
import {
  GetEarnedGiftsResponseDto,
  GetGiftsResponseDto,
  GetJackpotResponseDto,
} from './dto'
import { GiftsService } from './gifts.service'

@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller()
export class GiftsController {
  constructor(private readonly giftsService: GiftsService) {}

  @Get('/gifts')
  @ZodResponse({ type: GetGiftsResponseDto })
  async getGifts() {
    const items = await this.giftsService.getGifts()
    return { items }
  }

  @Get('/me/earned-gifts')
  @ZodResponse({ type: GetEarnedGiftsResponseDto })
  async getEarnedGifts(@UserId() userId: number) {
    const items = await this.giftsService.getEarnedGifts(userId)
    return { items }
  }

  @Get('/jackpot')
  @ZodResponse({ type: GetJackpotResponseDto })
  async getJackpot() {
    const jackpot = await this.giftsService.getJackpot()

    if (!jackpot) {
      throw new NotFoundException()
    }

    return jackpot
  }
}
