import { createZodDto } from 'nestjs-zod'
import { giftsSchema } from 'src/db/zod'
import * as z from 'zod'

const giftSchema = giftsSchema
  .omit({ url: true, createdAt: true })
  .meta({ id: 'GiftViewDto' })

export const getGiftsResponseSchema = z
  .object({
    items: z.array(giftSchema),
  })
  .meta({ id: 'GetGiftsResponseDto' })

export class GetGiftsResponseDto extends createZodDto(getGiftsResponseSchema) {}
