import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { SubjectContentService } from './subject-content.service';

@Controller('subject-content')
export class SubjectContentController {
  constructor(private readonly subjectContentService: SubjectContentService) {}

  // Get Video Lessons by Grade and Subject
  @Get('get-video-lessons/grade/:grade/subject/:subject')
  getVideoLessonsByGradeAndSubject(
    @Param('grade') grade: string,
    @Param('subject') subject: string,
  ) {
    return this.subjectContentService.getVideoLessonsByGradeAndSubject(
      grade,
      subject,
    );
  }

  @Get('get-activities/grade/:grade/subject/:subject')
  getActivityByGradeAndSubject(
    @Param('grade') grade: string,
    @Param('subject') subject: string,
  ) {
    return this.subjectContentService.getActivityByGradeAndSubject(
      grade,
      subject,
    );
  }

  @Post('create-activity')
  createActivity(@Body() activityData) {
    return this.subjectContentService.createActivity(activityData);
  }

  @Get('get-all-activities')
  getAllActivities() {
    return this.subjectContentService.getAllActivities();
  }

  @Post('create-video-lesson')
  createVideoLesson(@Body() videoLessonData) {
    return this.subjectContentService.createVideoLesson(videoLessonData);
  }

  @Get('get-all-video-lessons')
  getAllVideoLessons() {
    return this.subjectContentService.getAllVideoLessons();
  }
}
