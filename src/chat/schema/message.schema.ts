// Removed duplicate code block
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MessageDocument = Message & Document;

@Schema({ _id: false }) // to embed inside the Message schema
export class TeacherResponse {
  @Prop({ required: true })
  teacherId: string;

  @Prop({ required: true })
  teacherName: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  timestamp: Date;
}

@Schema()
export class Message {
  @Prop({ required: true })
  studentId: string;

  @Prop({ required: true })
  studentName: string;

  @Prop({ required: true })
  studentGrade: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  timestamp: Date;

  @Prop({ default: false })
  isRead: boolean;

  @Prop({ type: [TeacherResponse], default: [] })
  teacherResponses: TeacherResponse[];
}

export const MessageSchema = SchemaFactory.createForClass(Message);
