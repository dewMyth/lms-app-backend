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

  @Prop({ default: '' })
  description: string;

  @Prop({ default: 24 })
  duration: number;

  @Prop({ default: 50 })
  pass_marks: number;

  @Prop({ default: () => new Date().toISOString() })
  createdAt: string;
}

export const ActivitySchema = SchemaFactory.createForClass(Activity);
