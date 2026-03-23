import { createZodDto } from 'nestjs-zod'
import { stringToDate } from 'src/zod-codecs'
import * as z from 'zod'

export const submitClickSessionRequestSchema = z
  .object({
    totalClicks: z.number().int().positive(),
    startedAt: stringToDate,
    endedAt: stringToDate,
  })
  .meta({ id: 'SubmitClickSessionRequestDto' })

export class SubmitClickSessionRequestDto extends createZodDto(
  submitClickSessionRequestSchema,
  { codec: true },
) {}

export const submitClickSessionResponseSchema = z
  .object({
    balance: z.number().int().positive(),
    reward: z.number().positive(),
    isMilestoneReached: z.boolean(),
  })
  .meta({ id: 'SubmitClickSessionResponseDto' })

export class SubmitClickSessionResponseDto extends createZodDto(
  submitClickSessionResponseSchema,
) {}
