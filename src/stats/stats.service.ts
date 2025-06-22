import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Student } from 'src/users/schemas/student.schema';
import { Parent } from 'src/users/schemas/parent.schema';
import { Admin } from 'src/users/schemas/admin.schema';
import { Activity } from 'src/subject-content/schemas/activity.schema';
import { Teacher } from 'src/users/schemas/teacher.schema';
import { Log } from './schema/log.schema';
import { VideoLesson } from 'src/subject-content/schemas/video-lesson.schema';

@Injectable()
export class StatsService {
  constructor(
    @InjectModel(Student.name) private studentModel: Model<Student>,
    @InjectModel(Parent.name) private parentModel: Model<Parent>,
    @InjectModel(Admin.name) private adminModel: Model<Admin>,
    @InjectModel(Activity.name) private activityModel: Model<Activity>,
    @InjectModel(VideoLesson.name) private videoLessonModel: Model<VideoLesson>,
    @InjectModel(Teacher.name) private teacherModel: Model<Teacher>,
    @InjectModel(Log.name) private logModel: Model<Log>,
  ) {}

  async getStats() {
    // Output
    // const dashboardStats = {
    //   totalStudents: 1247,
    //   totalTeachers: 89,
    //   totalAssignments: 342,
    //   totalVideoLessons: 156,
    //   activeUsers: 892,
    //   completionRate: 78,
    // };

    // Input
    const totalStudents = await this.studentModel.countDocuments().exec();
    const totalTeachers = await this.teacherModel.countDocuments().exec();
    // const totalAssignments = await this.activityModel.countDocuments().exec();
    const totalVideoLessons = await this.videoLessonModel
      .countDocuments()
      .exec();
    const activeUsers = await this.studentModel.countDocuments().exec();

    // Calculate Completion Rate
    // Get All the Activities attached to the students as assignments
    const totalAssignments = await this.studentModel.aggregate([
      {
        $project: {
          assignments_count: { $size: '$assignments' },
        },
      },
      {
        $group: {
          _id: null,
          total_assignments: { $sum: '$assignments_count' },
        },
      },
    ]);

    // Get Status Completed Assingments attached to the students
    const pendingAssignments = await this.studentModel.aggregate([
      { $unwind: '$assignments' },
      { $match: { 'assignments.status': 'pending' } },
      { $count: 'total_pending_assignments' },
    ]);

    const completedAssignmentCount =
      totalAssignments[0].total_assignments -
      pendingAssignments[0].total_pending_assignments;
    const pendingAssignmentCount =
      pendingAssignments[0].total_pending_assignments;

    const completionRate =
      (completedAssignmentCount / totalAssignments[0].total_assignments) * 100;

    return {
      totalStudents,
      totalTeachers,
      totalVideoLessons,
      activeUsers,
      totalAssignments: totalAssignments[0].total_assignments,
      completedAssignmentCount,
      pendingAssignmentCount,
      completionRate,
    };

    // Calculate Completion Rate
  }

  async getRecentLogs() {
    // Sample Output
    // interface RecentActivity {
    //   id: number;
    //   type: string;
    //   message: string;
    //   time: string;
    // }

    const recentLogs = await this.logModel
      .find()
      .sort({ timestamp: -1 })
      .limit(4)
      .exec();

    return recentLogs.map((log) => {
      return {
        id: log._id,
        type: log.action,
        message: log.message,
        time: log.timestamp,
      };
    });
  }
}
