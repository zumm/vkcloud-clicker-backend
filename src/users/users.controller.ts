import {
  Controller,
  Get,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth } from '@nestjs/swagger'
import { ZodResponse } from 'nestjs-zod'
import { AuthGuard } from 'src/auth/auth.guard'
import { UserId } from 'src/auth/user-id.decorator'
import { MeDto } from './dto'
import { UsersService } from './users.service'

@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/me')
  @ZodResponse({ type: MeDto })
  async getUser(@UserId() userId: number) {
    const user = await this.usersService.findUserWithDetailsById(userId)
    if (!user) {
      // shouldn't be possible under normal circumstances
      // only if user got deleted somehow
      throw new UnauthorizedException()
    }

    return user
  }
}
