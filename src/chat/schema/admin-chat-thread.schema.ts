import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export type AdminChatThreadDocument = AdminChatThread & Document;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class AdminChatThread {
  @Prop()
  subject: string;

  @Prop()
  participants: string[];

  @Prop({ enum: ['open', 'pending', 'resolved', 'closed'], default: 'open' })
  status: string;

  @Prop({ enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' })
  priority: string;

  @Prop({
    enum: ['technical', 'academic', 'administrative', 'general'],
    default: 'general',
  })
  category: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop()
  last_message_at: Date;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  last_message_by: Types.ObjectId;

  @Prop({ default: 0 })
  total_messages: number;

  @Prop({ default: 0 })
  unread_count_by_admin: number;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Assignment' })
  related_assignment_id: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Student' })
  related_student_id: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Class' })
  related_class_id: Types.ObjectId;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}

export const AdminChatThreadSchema =
  SchemaFactory.createForClass(AdminChatThread);

// Add indexes manually
AdminChatThreadSchema.index({ 'participants.user_id': 1 });
AdminChatThreadSchema.index({ status: 1 });
AdminChatThreadSchema.index({ last_message_at: -1 });
AdminChatThreadSchema.index({ created_at: -1 });
AdminChatThreadSchema.index({ category: 1 });
AdminChatThreadSchema.index({ priority: 1 });
