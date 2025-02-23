import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ActivityDocument = HydratedDocument<Activity>;

@Schema()
export class Activity {
  @Prop()
  title: string;

  @Prop()
  file_link: string;

  @Prop()
  grade: string;

  @Prop()
  subject: string;

  @Prop()
  term: string;

  @Prop()
  type: string;

  @Prop()
  dueDate: string;

  @Prop()
  pass_marks: string;
}

export const ActivitySchema = SchemaFactory.createForClass(Activity);
