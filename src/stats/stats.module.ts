import { Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Student, StudentSchema } from 'src/users/schemas/student.schema';
import { Parent, ParentSchema } from 'src/users/schemas/parent.schema';
import { Admin, AdminSchema } from 'src/users/schemas/admin.schema';
import {
  Activity,
  ActivitySchema,
} from 'src/subject-content/schemas/activity.schema';
import { TeacherSchema } from 'src/users/schemas/teacher.schema';
import { Log, LogSchema } from './schema/log.schema';
import { VideoLesson } from 'src/subject-content/schemas/video-lesson.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Student.name, schema: StudentSchema }]),
    MongooseModule.forFeature([{ name: Parent.name, schema: ParentSchema }]),
    MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }]),
    MongooseModule.forFeature([
      { name: VideoLesson.name, schema: ActivitySchema },
    ]),
    MongooseModule.forFeature([
      { name: Activity.name, schema: ActivitySchema },
    ]),
    MongooseModule.forFeature([{ name: 'Teacher', schema: TeacherSchema }]),
    MongooseModule.forFeature([{ name: Log.name, schema: LogSchema }]),
  ],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}
