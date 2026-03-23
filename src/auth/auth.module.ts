import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { EnvModule } from 'src/env/env.module'
import { EnvService } from 'src/env/env.service'
import { UsersModule } from 'src/users/users.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

@Module({
  imports: [
    EnvModule,
    UsersModule,
    JwtModule.registerAsync({
      global: true,
      imports: [EnvModule],
      inject: [EnvService],
      useFactory: (envService: EnvService) => ({
        secret: envService.get('AUTH_JWT_SECRET'),
        signOptions: { expiresIn: envService.get('AUTH_ACCESS_TOKEN_TTL') },
      }),
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
