import { createZodDto } from 'nestjs-zod'
import { boostersSchema, userBoostersSchema } from 'src/db/zod'
import { stringToDate } from 'src/zod-codecs'
import * as z from 'zod'

const userBoosterViewSchema = z
  .object({
    type: boostersSchema.shape.type,
    value: boostersSchema.shape.value,
    name: boostersSchema.shape.name,

    userBoosterId: userBoostersSchema.shape.id,
    activatedAt: stringToDate.nullable(),
    expiresAt: stringToDate.nullable(),
  })
  .meta({ id: 'UserBoosterViewDto' })

export class UserBoosterViewDto extends createZodDto(userBoosterViewSchema, {
  codec: true,
}) {}
