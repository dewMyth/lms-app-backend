import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Student, StudentSchema } from './schemas/student.schema';
import { Parent, ParentSchema } from './schemas/parent.schema';
import { UtilService } from 'src/util.service';
import {
  Activity,
  ActivitySchema,
} from 'src/subject-content/schemas/activity.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Student.name, schema: StudentSchema }]),
    MongooseModule.forFeature([{ name: Parent.name, schema: ParentSchema }]),
    MongooseModule.forFeature([
      { name: Activity.name, schema: ActivitySchema },
    ]),
  ],

  controllers: [UsersController],
  providers: [UsersService, UtilService],
})
export class UsersModule {}
