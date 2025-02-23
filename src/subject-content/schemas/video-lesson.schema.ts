import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type VideoLessonDocument = HydratedDocument<VideoLesson>;

@Schema()
export class VideoLesson {
  @Prop()
  title: string;

  @Prop()
  video_link: string;

  @Prop()
  subject: string;

  @Prop()
  grade: string;
}

export const VideoLessonSchema = SchemaFactory.createForClass(VideoLesson);
