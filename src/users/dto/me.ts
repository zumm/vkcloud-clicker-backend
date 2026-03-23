import { createZodDto } from 'nestjs-zod'
import { usersSchema, walletsSchema } from 'src/db/zod'
import * as z from 'zod'

const meSchema = z
  .object({
    id: usersSchema.shape.id,
    name: usersSchema.shape.name,
    photoUrl: usersSchema.shape.photoUrl,
    firstName: usersSchema.shape.firstName,
    lastName: usersSchema.shape.lastName,

    balance: walletsSchema.shape.balance,
    promocode: z.string().nullable(),
  })
  .meta({ id: 'MeDto' })

export class MeDto extends createZodDto(meSchema) {}
