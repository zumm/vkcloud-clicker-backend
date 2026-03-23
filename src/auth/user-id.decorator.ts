import {
  createParamDecorator,
  type ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common'
import type { Request } from 'express'

export const UserId = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): number | undefined => {
    const request = ctx.switchToHttp().getRequest<Request>()

    const authContext = request.authContext
    if (!authContext) {
      throw new UnauthorizedException()
    }

    return authContext.jwtPayload.sub
  },
)
