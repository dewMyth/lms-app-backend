import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('/')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('create-activities')
  createActivities() {
    return this.appService.addInitialActivityData();
  }

  @Get('create-video-lessons')
  createVideoLessons() {
    return this.appService.addInitialVideoLessonData();
  }
}
