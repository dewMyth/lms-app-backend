import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AdminDocument = HydratedDocument<Admin>;

@Schema()
export class Admin {
  @Prop({ default: '' })
  username: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop({
    default:
      'https://efqjdnqbwlsrbzstvlbp.supabase.co/storage/v1/object/public/application-metadata//boy.png',
  })
  avatar: string;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
