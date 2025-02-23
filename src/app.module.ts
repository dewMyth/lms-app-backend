import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { SubjectContentModule } from './subject-content/subject-content.module';
import {
  Activity,
  ActivitySchema,
} from './subject-content/schemas/activity.schema';
import {
  VideoLesson,
  VideoLessonSchema,
} from './subject-content/schemas/video-lesson.schema';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://databaseUser:XdhrMmsfWYBhXtoK@cluster0.ikw0w.mongodb.net/',
    ),
    UsersModule,
    SubjectContentModule,
    MongooseModule.forFeature([
      { name: Activity.name, schema: ActivitySchema },
    ]),
    MongooseModule.forFeature([
      { name: VideoLesson.name, schema: VideoLessonSchema },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
