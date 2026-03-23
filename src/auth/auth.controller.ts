import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { ZodResponse } from 'nestjs-zod'
import { AuthService } from './auth.service'
import { SignInRequestDto, SignInResponseDto } from './dto'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  @ZodResponse({ type: SignInResponseDto })
  signIn(@Body() dto: SignInRequestDto) {
    return this.authService.signIn(dto.initData)
  }
}
