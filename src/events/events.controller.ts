import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  // Get Video Lessons by Grade and Subject
  @Post('create-event')
  getVideoLessonsByGradeAndSubject(@Body() eventData) {
    return this.eventsService.createEvent(eventData);
  }

  @Get('get-all-events/:userId')
  getAllEventsByUserId(@Param('userId') userId) {
    return this.eventsService.getAllEventsByStudentId(userId);
  }

  @Get('get-all-teacher-events')
  getAllEventsForTeacher() {
    return this.eventsService.getAllEventsForTeacher();
  }
}
