import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { EventsService } from './events.service';
import { EventSchema } from './schemas/event.schema';
import { EventsController } from './events.controller';
import {
  Activity,
  ActivitySchema,
} from 'src/subject-content/schemas/activity.schema';
import { UtilService } from 'src/util.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
    MongooseModule.forFeature([
      { name: Activity.name, schema: ActivitySchema },
    ]),
  ],
  controllers: [EventsController],
  providers: [EventsService, UtilService],
})
export class EventsModule {}
