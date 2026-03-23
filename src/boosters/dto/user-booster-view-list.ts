import { createZodDto } from 'nestjs-zod'
import * as z from 'zod'
import { UserBoosterViewDto } from './'

export const userBoosterViewListSchema = z
  .object({
    items: z.array(UserBoosterViewDto.schema),
  })
  .meta({ id: 'UserBoosterViewListDto' })

export class UserBoosterViewListDto extends createZodDto(
  userBoosterViewListSchema,
  { codec: true },
) {}
