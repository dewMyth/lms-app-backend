import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TeacherDocument = HydratedDocument<Teacher>;

@Schema()
export class Teacher {
  @Prop()
  email: string;

  @Prop()
  username: string;

  @Prop()
  password: string;

  @Prop()
  pin_no: number;

  @Prop({ default: '' })
  grade: string;

  @Prop()
  subject: string;

  @Prop({ default: '' })
  avatar: string;

  @Prop({ default: 'Teacher' })
  role: string;

  @Prop({ default: 'active' })
  status: string;
}

export const TeacherSchema = SchemaFactory.createForClass(Teacher);
