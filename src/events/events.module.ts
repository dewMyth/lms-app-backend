import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { EventsService } from './events.service';
import { EventSchema } from './schemas/event.schema';
import { EventsController } from './events.controller';
import {
  Activity,
  ActivitySchema,
} from 'src/subject-content/schemas/activity.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
    MongooseModule.forFeature([
      { name: Activity.name, schema: ActivitySchema },
    ]),
  ],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
