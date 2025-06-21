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
import { EventsModule } from './events/events.module';
import { OnlineGateway } from './gateways/socket.gateway';
import { ChatModule } from './chat/chat.module';
import { StatsModule } from './stats/stats.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://databaseUser:XdhrMmsfWYBhXtoK@cluster0.ikw0w.mongodb.net/',
    ),
    UsersModule,
    SubjectContentModule,
    EventsModule,
    MongooseModule.forFeature([
      { name: Activity.name, schema: ActivitySchema },
    ]),
    MongooseModule.forFeature([
      { name: VideoLesson.name, schema: VideoLessonSchema },
    ]),
    ChatModule,
    StatsModule,
  ],
  controllers: [AppController],
  providers: [AppService, OnlineGateway],
})
export class AppModule {}
