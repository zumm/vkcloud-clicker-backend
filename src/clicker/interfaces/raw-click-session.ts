import type * as z from 'zod'
import type { SubmitClickSessionRequestDto } from '../dto'

export type RawClickSession = z.infer<
  typeof SubmitClickSessionRequestDto.schema
>
