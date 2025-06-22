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

  @Prop({
    default: '',
  })
  grade: string;

  @Prop({
    default:
      'https://efqjdnqbwlsrbzstvlbp.supabase.co/storage/v1/object/public/application-metadata//stylish-boy.png',
  })
  avatar: string;

  @Prop({
    default: '',
  })
  parent_id: string;
}

export const StudentSchema = SchemaFactory.createForClass(Student);
