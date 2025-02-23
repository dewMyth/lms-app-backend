import { Module } from '@nestjs/common';
import { SubjectContentService } from './subject-content.service';
import { SubjectContentController } from './subject-content.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Activity, ActivitySchema } from './schemas/activity.schema';
import { VideoLesson, VideoLessonSchema } from './schemas/video-lesson.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Activity.name, schema: ActivitySchema },
    ]),
    MongooseModule.forFeature([
      { name: VideoLesson.name, schema: VideoLessonSchema },
    ]),
  ],
  controllers: [SubjectContentController],
  providers: [SubjectContentService],
})
export class SubjectContentModule {}
