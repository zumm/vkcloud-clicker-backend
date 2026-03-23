import { createZodDto } from 'nestjs-zod'
import * as z from 'zod'

export const signInRequestSchema = z.object({
  initData: z.string().min(1),
})

export class SignInRequestDto extends createZodDto(signInRequestSchema) {}

export const signInResponseSchema = z.object({
  token: z.string().min(1),
})

export class SignInResponseDto extends createZodDto(signInResponseSchema) {}
