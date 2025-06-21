import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Activity } from './schemas/activity.schema';
import { VideoLesson } from './schemas/video-lesson.schema';
import { Model } from 'mongoose';
import { UtilService } from 'src/util.service';
import { Log } from 'src/stats/schema/log.schema';
import { LogAction } from 'src/stats/types/log-action.types';

@Injectable()
export class SubjectContentService {
  constructor(
    @InjectModel(Activity.name) private activityModel: Model<Activity>,
    @InjectModel(VideoLesson.name) private videoLessonModel: Model<VideoLesson>,
    @InjectModel(Log.name) private logModel: Model<Log>,
    private _utilService: UtilService,
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

    // Log the action
    await this.logModel.create({
      message: `New activity ${newActivity.title} created`,
      action: LogAction.CREATE_ACTIVITY,
    });
  }

  // Create a new Video Lesson
  async createVideoLesson(videoLessonData) {
    //     {
    //     "id": "1743265434908",
    //     "title": "sdsd",
    //     "videoLink": "http://sdsds.co",
    //     "grade": "Grade 1",
    //     "subject": "Science",
    //     "description": "sdssdsdsdsdsd",
    //     "thumbnail": "sdsds",
    //     "createdAt": "2025-03-29T16:23:54.908Z"
    // }

    // Create a new Video Lesson Object

    let videoThumbnailId;

    if (!videoLessonData.thumbnail || videoLessonData.thumbnail == '') {
      videoThumbnailId = this._utilService.getYouTubeId(
        videoLessonData.videoLink,
      );
    }

    const newVideoLesson = {
      title: videoLessonData.title,
      video_link: videoLessonData.videoLink,
      grade: videoLessonData.grade,
      subject: videoLessonData.subject,
      description: videoLessonData.description,
      thumbnail: `https://img.youtube.com/vi/${videoThumbnailId}/maxresdefault.jpg`,
    };

    // Save the video lesson data to the database
    const res = await this.videoLessonModel.create(newVideoLesson);

    if (res) {
      // Log the action
      await this.logModel.create({
        message: `New video lesson ${newVideoLesson.title} created`,
        action: LogAction.CREATE_VIDEO_LESSON,
      });

      return {
        status: HttpStatus.CREATED,
        message: `New Video Lesson Created!`,
      };
    }
  }

  // Get Activity by Grade and Subject
  async getActivityByGradeAndSubject(grade, subject) {
    return await this.activityModel.find({ grade, subject });
  }

  // Get Video lessons by Grade andSubject
  async getVideoLessonsByGradeAndSubject(grade, subject) {
    return await this.videoLessonModel.find({ grade, subject });
  }

  // Get All Video lessons
  async getAllVideoLessons() {
    const videoLessonsRaw = await this.videoLessonModel
      .find()
      .sort({ createdAt: -1 });

    const videoLessonsFormatted = videoLessonsRaw.map((videoLesson) => {
      return {
        id: videoLesson.id,
        title: videoLesson.title,
        videoLink: videoLesson.video_link,
        grade: videoLesson.grade,
        subject: videoLesson.subject,
        description: videoLesson.description,
        thumbnail: videoLesson.thumbnail,
        createdAt: videoLesson.createdAt,
      };
    });

    return videoLessonsFormatted;
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
