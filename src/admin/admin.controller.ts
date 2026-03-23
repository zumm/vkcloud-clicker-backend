import { Controller, Get } from '@nestjs/common'
import { ZodResponse } from 'nestjs-zod'
import { AdminService } from './admin.service'
import { SettingsDto } from './dto'

@Controller()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('/settings')
  @ZodResponse({ type: SettingsDto })
  async getSettings() {
    return this.adminService.getSettings()
  }
}
