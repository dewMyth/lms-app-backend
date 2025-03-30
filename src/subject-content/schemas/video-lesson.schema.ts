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

  @Prop({ default: 'Grade ' })
  grade: string;

  @Prop({ default: 'Learn the basics of fractions and how to represent them.' })
  description: string;

  @Prop({
    default:
      'https://riggswealth.com/wp-content/uploads/2016/06/Riggs-Video-Placeholder.jpg',
  })
  thumbnail: string;

  @Prop({ default: () => new Date().toISOString() })
  createdAt: string;
}

export const VideoLessonSchema = SchemaFactory.createForClass(VideoLesson);
