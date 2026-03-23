import { Controller, Get } from '@nestjs/common'
import { ZodResponse } from 'nestjs-zod'
import { GetMilestonesResponseDto } from './dto'
import { MilestonesService } from './milestones.service'

@Controller()
export class MilestonesController {
  constructor(private readonly milestonesService: MilestonesService) {}

  @Get('/milestones')
  @ZodResponse({ type: GetMilestonesResponseDto })
  async getMilestones() {
    const items = await this.milestonesService.getMilestones()
    return { items }
  }
}
