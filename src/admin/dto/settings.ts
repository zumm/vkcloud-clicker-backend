import { createZodDto } from 'nestjs-zod'
import { settingsSchema } from 'src/db/zod'

const publicSettingsSchema = settingsSchema
  .pick({ campaignState: true })
  .meta({ id: 'SettingsDto' })

export class SettingsDto extends createZodDto(publicSettingsSchema) {}
