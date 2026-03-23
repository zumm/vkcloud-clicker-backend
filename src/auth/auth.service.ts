import { getLogger } from '@logtape/logtape'
import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import {
  hashToken,
  type InitData,
  parse,
  validate,
} from '@tma.js/init-data-node'
import { EnvService } from 'src/env/env.service'
import { CreateUserInput } from 'src/users/interfaces'
import { UsersService } from 'src/users/users.service'
import { JwtPayload, SignInOutput } from './interfaces'

@Injectable()
export class AuthService {
  private readonly logger = getLogger(['app', AuthService.name])

  private hashedTgToken: Buffer<ArrayBufferLike>

  constructor(
    private envService: EnvService,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {
    this.hashedTgToken = hashToken(this.envService.get('TG_BOT_TOKEN'))
  }

  async signIn(initDataRaw: string): Promise<SignInOutput> {
    try {
      // @ts-expect-error seems like typing of @tma.js/init-data-node is incorrect
      // TODO: create issue
      validate(initDataRaw, this.hashedTgToken, {
        tokenHashed: true,
        expiresIn: this.envService.get('AUTH_REFRESH_TOKEN_TTL'),
      })
    } catch (error) {
      this.logger.error('Cannot validate initData', { error, initDataRaw })
      throw new UnauthorizedException()
    }

    const initData = parse(initDataRaw)

    if (!initData.user || initData.user.is_bot) {
      this.logger.warn('Invalid initData', { initData })
      throw new ForbiddenException()
    }

    const user = await this.usersService.findUserByTelegramId(initData.user.id)
    const userId = user
      ? user.id
      : await this.usersService.createUser(
          this.mapCreateUserInput(initData.user),
        )

    const jwtPayload: JwtPayload = { sub: userId }
    const token = await this.jwtService.signAsync(jwtPayload)

    this.logger.info('User #{userId} signed in', {
      userId,
      initData,
    })

    return { token }
  }

  private mapCreateUserInput(
    user: NonNullable<InitData['user']>,
  ): CreateUserInput {
    return {
      telegramId: user.id,
      name: user.username,
      photoUrl: user.photo_url,
      firstName: user.first_name,
      lastName: user.last_name,
    }
  }
}
