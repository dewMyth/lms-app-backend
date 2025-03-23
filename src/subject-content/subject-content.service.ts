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
      title: activityData.title,
      file_link: activityData.fileLink,
      grade: activityData.grade,
      subject: activityData.subject,
      term: activityData.term,
      type: activityData.type,
      description: activityData.description,
      duration: activityData.duration,
      pass_marks: activityData.passMarks,
      createdAt: new Date().toISOString(),
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

  async getAllActivities() {
    const activitiesRaw = await this.activityModel.find();

    const activities = activitiesRaw.map((activity) => {
      return {
        id: activity._id.toString(),
        title: activity.title,
        fileLink: activity.file_link,
        grade: activity.grade,
        subject: activity.subject,
        term: activity.term,
        duration: activity.duration,
        description: '',
        activityType: activity.type,
        createdAt: activity.createdAt,
      };
    });

    return activities;
  }
}
