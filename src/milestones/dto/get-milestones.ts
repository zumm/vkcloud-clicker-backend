import { createZodDto } from 'nestjs-zod'
import { milestonesSchema } from 'src/db/zod'
import * as z from 'zod'

export const getMilestonesResponseSchema = z
  .object({
    items: z.array(milestonesSchema.omit({ createdAt: true })),
  })
  .meta({ id: 'GetMilestonesResponseDto' })

export class GetMilestonesResponseDto extends createZodDto(
  getMilestonesResponseSchema,
) {}
