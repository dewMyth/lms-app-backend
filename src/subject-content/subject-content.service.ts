import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Activity } from './schemas/activity.schema';
import { VideoLesson } from './schemas/video-lesson.schema';
import { Model } from 'mongoose';

@Injectable()
export class SubjectContentService {
  constructor(
    @InjectModel(Activity.name) private activityModel: Model<Activity>,
    @InjectModel(VideoLesson.name) private videoLessonModel: Model<VideoLesson>,
    // private _utilService: UtilService,
  ) {}

  // Create a new Activity
  async createActivity(activityData) {
    // Create a new Activity Object
    const newActivity = {
      ...activityData,
    };

    // Save the activity data to the database
    await this.activityModel.create(newActivity).then((res) => {
      return res;
    });
  }

  // Create a new Video Lesson
  async createVideoLesson(videoLessonData) {
    // Create a new Video Lesson Object
    const newVideoLesson = {
      ...videoLessonData,
    };

    // Save the video lesson data to the database
    await this.videoLessonModel.create(newVideoLesson).then((res) => {
      return res;
    });
  }

  // Get Activity by Grade and Subject
  async getActivityByGradeAndSubject(grade, subject) {
    return await this.activityModel.find({ grade, subject });
  }

  // Get Video lessons by Grade andSubject
  async getVideoLessonsByGradeAndSubject(grade, subject) {
    return await this.videoLessonModel.find({ grade, subject });
  }
}
