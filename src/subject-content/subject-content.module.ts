import { Module } from '@nestjs/common';
import { SubjectContentService } from './subject-content.service';
import { SubjectContentController } from './subject-content.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Activity, ActivitySchema } from './schemas/activity.schema';
import { VideoLesson, VideoLessonSchema } from './schemas/video-lesson.schema';
import { UtilService } from 'src/util.service';
import { Log, LogSchema } from 'src/stats/schema/log.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Activity.name, schema: ActivitySchema },
    ]),
    MongooseModule.forFeature([
      { name: VideoLesson.name, schema: VideoLessonSchema },
    ]),
    MongooseModule.forFeature([{ name: Log.name, schema: LogSchema }]),
  ],
  controllers: [SubjectContentController],
  providers: [SubjectContentService, UtilService],
})
export class SubjectContentModule {}
