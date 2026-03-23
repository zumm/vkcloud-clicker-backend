import { createZodDto } from 'nestjs-zod'
import { jackpotsSchema } from 'src/db/zod'

export const getJackpotResponseSchema = jackpotsSchema
  .omit({ createdAt: true })
  .meta({ id: 'GetJackpotResponseDto' })

export class GetJackpotResponseDto extends createZodDto(
  getJackpotResponseSchema,
) {}
