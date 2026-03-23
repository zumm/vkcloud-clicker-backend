import { getLogger } from '@logtape/logtape'
import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import type { Request } from 'express'
import { JwtPayload } from './interfaces'

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = getLogger(['app', AuthGuard.name])

  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>()

    const token = this.extractTokenFromHeader(request)
    if (!token) {
      throw new UnauthorizedException()
    }

    try {
      const jwtPayload = await this.jwtService.verifyAsync<JwtPayload>(token)

      request.authContext = { jwtPayload }

      this.logger.info('Auth completed, payload = "{jwtPayload}"', {
        jwtPayload,
      })
    } catch (error) {
      this.logger.warn('Cannot verify jwt', { token, error })
      throw new UnauthorizedException()
    }

    return true
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }
}
