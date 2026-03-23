import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth } from '@nestjs/swagger'
import { ZodResponse } from 'nestjs-zod'
import { AuthGuard } from 'src/auth/auth.guard'
import { UserId } from 'src/auth/user-id.decorator'
import { ClickerService } from './clicker.service'
import {
  SubmitClickSessionRequestDto,
  SubmitClickSessionResponseDto,
} from './dto'

@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller()
export class ClickerController {
  constructor(private readonly clickerService: ClickerService) {}

  @HttpCode(HttpStatus.OK)
  @Post('/click-session')
  @ZodResponse({ type: SubmitClickSessionResponseDto })
  async submitClickSession(
    @UserId() userId: number,
    @Body() dto: SubmitClickSessionRequestDto,
  ) {
    return this.clickerService.processRawClickSession(userId, dto)
  }
}
