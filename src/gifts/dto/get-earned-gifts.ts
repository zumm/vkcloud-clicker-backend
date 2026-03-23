import { createZodDto } from 'nestjs-zod'
import { giftsSchema } from 'src/db/zod'
import * as z from 'zod'

const giftSchema = giftsSchema
  .omit({ createdAt: true })
  .meta({ id: 'EarnedGiftViewDto' })

export const getEarnedGiftsResponseSchema = z
  .object({
    items: z.array(giftSchema),
  })
  .meta({ id: 'GetEarnedGiftsResponseDto' })

export class GetEarnedGiftsResponseDto extends createZodDto(
  getEarnedGiftsResponseSchema,
) {}
