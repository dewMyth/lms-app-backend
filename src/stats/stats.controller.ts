import { Controller, Get } from '@nestjs/common';
import { StatsService } from './stats.service';

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('get-stats')
  getStats() {
    return this.statsService.getStats();
  }

  @Get('get-recent-logs')
  getRecentLogs() {
    return this.statsService.getRecentLogs();
  }
}
