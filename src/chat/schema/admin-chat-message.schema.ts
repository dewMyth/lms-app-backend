import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export type AdminChatMessageDocument = AdminChatMessage & Document;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class AdminChatMessage {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    required: true,
    ref: 'ChatThread',
  })
  thread_id: Types.ObjectId;

  // Sender information
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true, ref: 'User' })
  sender_id: Types.ObjectId;

  @Prop({
    type: String,
    enum: ['student', 'parent', 'teacher', 'admin'],
    required: true,
  })
  sender_type: string;

  @Prop()
  sender_name: string;

  @Prop()
  sender_avatar: string;

  // Content
  @Prop()
  content: string;

  @Prop({
    type: String,
    enum: ['text', 'file', 'image', 'system'],
    default: 'text',
  })
  message_type: string;

  // Attachments
  @Prop([
    {
      file_id: { type: MongooseSchema.Types.ObjectId },
      file_name: String,
      file_url: String,
      file_type: String, // e.g., pdf, image, doc
      file_size: Number,
    },
  ])
  attachments: {
    file_id: Types.ObjectId;
    file_name: string;
    file_url: string;
    file_type: string;
    file_size: number;
  }[];

  // Message status
  @Prop({ default: false })
  is_read_by_admin: boolean;

  @Prop([
    {
      user_id: { type: MongooseSchema.Types.ObjectId, ref: 'User' },
      read_at: { type: Date, default: Date.now },
    },
  ])
  read_by: {
    user_id: Types.ObjectId;
    read_at: Date;
  }[];

  // Admin response (embedded)
  @Prop()
  admin_response: string;

  @Prop({ type: Date, default: Date.now })
  admin_response_timestamp;

  @Prop()
  deleted_at: Date;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Message' })
  parent_message_id: Types.ObjectId;

  @Prop({ type: Date, default: Date.now })
  created_at: Date;

  @Prop({ type: Date, default: Date.now })
  updated_at: Date;
}

export const AdminChatMessageSchema =
  SchemaFactory.createForClass(AdminChatMessage);

// Indexes
AdminChatMessageSchema.index({ thread_id: 1, created_at: 1 });
AdminChatMessageSchema.index({ sender_id: 1 });
AdminChatMessageSchema.index({ is_read_by_admin: 1 });
AdminChatMessageSchema.index({ created_at: -1 });
