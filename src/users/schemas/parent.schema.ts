import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ParentDocument = HydratedDocument<Parent>;

@Schema()
export class Parent {
  @Prop({ default: '' })
  username: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  students: string[];

  @Prop({
    default:
      'https://efqjdnqbwlsrbzstvlbp.supabase.co/storage/v1/object/public/application-metadata//man.png',
  })
  avatar: string;
}

export const ParentSchema = SchemaFactory.createForClass(Parent);
