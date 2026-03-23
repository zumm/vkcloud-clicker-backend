import type * as z from 'zod'
import type { UserBoosterViewDto } from '../dto'

export type UserBoosterView = z.infer<typeof UserBoosterViewDto.schema>
