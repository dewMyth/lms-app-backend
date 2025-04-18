import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import {
  Activity,
  ActivitySchema,
} from 'src/subject-content/schemas/activity.schema';

export type EventDocument = HydratedDocument<Event>;

@Schema()
export class Event {
  @Prop()
  studentId: string;

  @Prop()
  title: string;

  @Prop({ default: new Date() })
  start: string;

  @Prop({
    default: () => new Date(new Date().setDate(new Date().getDate() + 1)),
  })
  end: string;

  @Prop({ default: false })
  allDay: boolean;

  @Prop({ default: '' })
  desc: string;

  @Prop({ default: '' })
  location: string;

  @Prop({ default: '' })
  type: string;

  @Prop({ default: '' })
  url: string;

  @Prop({ type: ActivitySchema }) // Embed Activity schema
  activity: Activity;

  @Prop({ default: new Date().toISOString().split('T')[0] }) // Embed Activity schema
  date: string;

  @Prop({ default: 'all' }) // Embed Activity schema
  grade: string;
}

export const EventSchema = SchemaFactory.createForClass(Event);
