import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type StudentDocument = HydratedDocument<Student>;

@Schema()
export class Student {
  @Prop()
  email: string;

  @Prop()
  username: string;

  @Prop()
  password: string;

  @Prop()
  parents_email: string;

  @Prop()
  pin_no: number;

  @Prop()
  assignments: object[];
}

export const StudentSchema = SchemaFactory.createForClass(Student);
