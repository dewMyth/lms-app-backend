import {
  BadRequestException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Student } from './schemas/student.schema';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Parent } from './schemas/parent.schema';
import * as bcrypt from 'bcrypt';
import { UtilService } from 'src/util.service';
import { Activity } from 'src/subject-content/schemas/activity.schema';
// import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';

import { createClient } from '@supabase/supabase-js';

@Injectable()
export class UsersService {
  private supabase;

  constructor(
    @InjectModel(Student.name) private studentModel: Model<Student>,
    @InjectModel(Parent.name) private parentModel: Model<Parent>,
    @InjectModel(Activity.name) private activityModel: Model<Activity>,
    private _utilService: UtilService,
  ) {
    this.supabase = createClient(
      'https://efqjdnqbwlsrbzstvlbp.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmcWpkbnFid2xzcmJ6c3R2bGJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA4NDU3NTEsImV4cCI6MjA1NjQyMTc1MX0.T718Ku2Rd17X8RyhT85SXt_KZOkO3smgbUMR8OSfh9M',
    );
  }

  // Create a Student Account w/ Parent Account
  async createStudentAccount(studentData) {
    // Hash the Password
    const { password } = studentData;
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a PIN
    const sixDigitCode = this._utilService.generateSixDigitCode();

    // Find a student with the same email
    const student = await this.studentModel.findOne({
      email: studentData.email,
    });

    if (student) {
      throw new InternalServerErrorException(
        'Student with the same email already exists',
      );
    }

    // Create Student Object
    const newStudent = {
      ...studentData,
      password: hashedPassword,
      pin: sixDigitCode,
    };

    // Search for parent
    let parent = await this.parentModel
      .findOne({
        email: studentData.parentEmail,
      })
      .lean()
      .exec();

    // Create Parent Object

    // Save the student data to the database
    await this.studentModel
      .create(newStudent)
      .then(async (res) => {
        console.log(res._id);

        // Save the parent data to the database
        if (!parent) {
          const newParent = {
            username: studentData.parentName,
            email: studentData.parentEmail,
            password: hashedPassword,
            students: [res._id],
          };

          this.parentModel.create(newParent);
        } else {
          await this.parentModel.updateOne(
            { _id: parent._id },
            { $push: { students: res._id } },
          );
        }
      })
      .catch((err) => {
        throw new InternalServerErrorException(
          `Error while saving user. Reason: ${err.message}`,
        );
      });

    return {
      message: 'Student Account Created Successfully',
      student: newStudent,
      // parent: newParent,
    };
  }

  // Login a Student
  async loginStudent(loginCredentials) {
    const { email, password } = loginCredentials;

    // Find the student with the email
    const student = await this.studentModel.findOne({ email }).lean().exec();
    const parent = await this.parentModel.findOne({ email }).lean().exec();

    if (!student && !parent) {
      throw new BadRequestException(
        `No Student or Parent with the relevant email`,
      );
    }

    let logggedUser: any = student ? student : parent;

    if (logggedUser) {
      // Password Validation
      const isMatched = await bcrypt.compare(password, logggedUser.password);

      if (!isMatched) {
        throw new BadRequestException(`Invalid Password`);
      }
    }

    // Generate a JWT Token
    const token = this._utilService.generateJWTToken(logggedUser);

    delete logggedUser.password;
    delete logggedUser.assignments;
    delete logggedUser.parents_email;

    logggedUser = {
      ...logggedUser,
      token,
      userType: student ? 'student' : 'parent',
    };

    return {
      status: HttpStatus.OK,
      message: `User - ${logggedUser.userName} : ${logggedUser.email} logged in successfully.`,
      user: logggedUser,
    };
  }

  async addActivityToAssignments(assignmentId, userId) {
    // Get User by User Id
    const user = await this.studentModel.findOne({ _id: userId }).lean().exec();

    // Get Assignment from Assignment Id
    const assignment = await this.activityModel
      .findOne({ _id: assignmentId })
      .lean()
      .exec();

    if (!assignment || !user) {
      throw new InternalServerErrorException();
    }

    // Add New Fields to Assignments Object
    assignment['your_marks'] = null;
    assignment['submitted'] = false;
    assignment['status'] = 'pending';
    assignment['started_datetime'] = Date.now();

    // Add the assignment to User object
    user.assignments?.push(assignment);

    // Save the updated user
    const res = await this.studentModel.updateOne({ _id: userId }, user);

    if (!res) {
      throw new InternalServerErrorException();
    }

    return {
      status: 200,
      message: 'Assignment added to the User successfully!',
    };
  }

  async getAllAssignmentsByUser(userId) {
    const student = await this.studentModel
      .findOne({ _id: userId })
      .lean()
      .exec();

    return student?.assignments;
  }

  async submitAssignment(file: Express.Multer.File, assignmentId, userId) {
    const fileName = `${assignmentId}_${userId}_${Date.now()}_${file.originalname}`;

    const { data, error } = await this.supabase.storage
      .from('assignment-submissions')
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
      });

    if (error) {
      return error;
    }

    const getPublicUrlofSubmittedAssignment = await this.supabase.storage
      .from('assignment-submissions')
      .getPublicUrl(fileName);

    // Update user's assignment status
    const user = await this.studentModel.findById(userId).lean().exec();

    if (!user || !user.assignments) {
      throw new InternalServerErrorException('User or assignments not found');
    }

    let result;
    const assignmentObjectId = new mongoose.Types.ObjectId(assignmentId);

    try {
      result = await this.studentModel.updateOne(
        {
          _id: userId,
          'assignments._id': assignmentObjectId,
        },
        {
          $set: {
            'assignments.$.submitted': true,
            'assignments.$.submission_url':
              getPublicUrlofSubmittedAssignment.data.publicUrl,
            'assignments.$.submitted_datetime': Date.now(),
            'assignments.$.status': 'submitted',
          },
        },
      );
    } catch (error) {
      console.error('Error updating assignment:', error);
    }

    if (result.modifiedCount > 0) {
      return {
        status: HttpStatus.CREATED,
        message: 'Assignment Upload Successful!',
      };
    } else {
      return {
        staus: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Assignment upload not successful!',
      };
    }
  }

  async editStudent(updatedUserData) {
    const { userId } = updatedUserData;

    const updatedResponse = await this.studentModel
      .findByIdAndUpdate(userId, updatedUserData)
      .catch((e) => {
        throw new Error(`Updating user failed! due to : ${e.message}`);
      });

    if (!updatedResponse) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: `User - ${userId} update failed`,
      };
    }

    return {
      status: HttpStatus.OK,
      message: `User - ${userId} update successfully.`,
      user: updatedUserData,
    };
  }

  async saveAvatar(avatarImg: Express.Multer.File, userId) {
    const fileName = `${userId}_${Date.now()}_${avatarImg.originalname}`;

    const { data, error } = await this.supabase.storage
      .from('avatars')
      .upload(fileName, avatarImg.buffer, {
        contentType: avatarImg.mimetype,
      });

    if (error) {
      return error;
    }

    if (error) {
      return error;
    }

    const getPublicUrlofSubmittedAssignment = await this.supabase.storage
      .from('avatars')
      .getPublicUrl(fileName);

    // Update user's avatar link
    let user;
    const student = await this.studentModel.findById(userId).lean().exec();

    if (student) {
      user = student;
    } else {
      user = await this.parentModel.findById(userId).lean().exec();
    }

    if (!user) {
      throw new InternalServerErrorException('User not found');
    }

    let result;

    try {
      if (student) {
        result = await this.studentModel.updateOne(
          {
            _id: userId,
          },
          {
            $set: {
              avatar: getPublicUrlofSubmittedAssignment.data.publicUrl,
            },
          },
        );
      } else {
        result = await this.parentModel.updateOne(
          {
            _id: userId,
          },
          {
            $set: {
              avatar: getPublicUrlofSubmittedAssignment.data.publicUrl,
            },
          },
        );
      }
    } catch (error) {
      console.error('Error updating assignment:', error);
    }

    if (result.modifiedCount > 0) {
      return {
        status: HttpStatus.CREATED,
        message: 'Avatar updated Successfully!',
      };
    } else {
      return {
        staus: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Avatar update not successful!',
      };
    }
  }

  async getAllUserData(userType, userId) {
    let user;

    if (userType == 'student') {
      user = await this.studentModel.findById(userId).lean().exec();
    }

    if (userType == 'parent') {
      user = await this.parentModel.findById(userId).lean().exec();
    }

    if (!user) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: `No User found with the given userId`,
      };
    }

    return {
      status: HttpStatus.OK,
      userData: user,
    };
  }

  async getAllStudentsStatsByParent(parentId) {
    const parent = await this.parentModel.findById(parentId).lean().exec();

    const studentsStats = await Promise.all(
      parent?.students.map(async (student) => {
        const studentData = await this.studentModel
          .findById(student)
          .lean()
          .exec();

        // Setup Pending Tasks
        const pendingTasksRaw = studentData?.assignments?.filter(
          (assignment: { status: string }) => assignment.status === 'pending',
        );
        const pendingTasksFormatted = pendingTasksRaw?.map(
          (task: {
            _id: string;
            title: string;
            subject: string;
            started_datetime: string;
            status: string;
            type: string;
          }) => {
            return {
              id: task._id.toString(),
              title: task.title,
              subject: task.subject,
              dueDate: new Date(task.started_datetime + 24 * 60 * 60 * 1000)
                .toISOString()
                .split('T')[0],
              status: task.status,
              type: task.type,
            };
          },
        );

        // Setup Completed Tasks
        const completedTasksRaw = studentData?.assignments?.filter(
          (assignment: { status: string }) =>
            assignment.status == 'completed' ||
            assignment.status == 'submitted',
        );
        const completedTasksFormatted = completedTasksRaw?.map(
          (task: {
            _id: string;
            title: string;
            subject: string;
            started_datetime: string;
            status: string;
            type: string;
          }) => {
            return {
              id: task._id.toString(),
              title: task.title,
              subject: task.subject,
              // TODO - Need to get the completed date
              completedDate: new Date(1742620513370 + 24 * 60 * 60 * 1000)
                .toISOString()
                .split('T')[0],
              status: task.status,
              type: task.type,
            };
          },
        );

        return {
          id: studentData?._id.toString(),
          name: studentData?.username,
          grade: studentData?.grade,
          avatar: studentData?.avatar,
          subjects: ['Sinhala', 'Mathematics', 'Environment'],
          pendingTasks: pendingTasksFormatted,
          completedTasks: completedTasksFormatted,

          // TODO
          upcomingEvents: [
            {
              id: 'event1',
              title: 'Term Test - Sinhala',
              date: '2025-03-25',
              time: '9:00 AM',
              type: 'exam',
            },
            {
              id: 'event2',
              title: 'Science Exhibition',
              date: '2025-03-28',
              time: '10:00 AM',
              type: 'event',
            },
            {
              id: 'event3',
              title: 'Parent-Teacher Meeting',
              date: '2025-04-02',
              time: '3:30 PM',
              type: 'meeting',
            },
          ],
          progress: {
            sinhala: 75,
            mathematics: 68,
            environment: 82,
          },
          recentActivity: [
            {
              id: 'activity1',
              description: 'Completed Sinhala reading assignment',
              timestamp: '2025-03-15T14:30:00',
              type: 'completion',
            },
            {
              id: 'activity2',
              description: 'Watched 3 Mathematics video lessons',
              timestamp: '2025-03-14T16:45:00',
              type: 'learning',
            },
            {
              id: 'activity3',
              description: 'Started Environment project',
              timestamp: '2025-03-13T10:15:00',
              type: 'start',
            },
          ],
          messages: [
            {
              id: 'msg1',
              from: 'Ms. Kumari (Sinhala Teacher)',
              content:
                'Amal is showing great improvement in reading comprehension.',
              timestamp: '2025-03-15T09:30:00',
              read: false,
            },
            {
              id: 'msg2',
              from: 'Mr. Bandara (Principal)',
              content:
                'Reminder: School will be closed on March 24th for staff development.',
              timestamp: '2025-03-14T11:20:00',
              read: true,
            },
          ],
          // End TODO
        };
      }) || [],
    );

    return studentsStats;

    // return [
    //   {
    //     id: 'child1',
    //     name: 'Amal Perera',
    //     grade: 'Grade 3',
    //     avatar: '/placeholder.svg?height=40&width=40&text=AP',
    //     subjects: ['Sinhala', 'Mathematics', 'Environment'],
    //     pendingTasks: [
    //       {
    //         id: 'task1',
    //         title: 'පූර්ව භාෂා කුසලතා - ක්‍රියාකාරකම් පත්‍රිකාව',
    //         subject: 'Sinhala',
    //         dueDate: '2025-03-20',
    //         status: 'pending',
    //         type: 'assignment',
    //       },
    //       {
    //         id: 'task2',
    //         title: 'ගණිත ගැටළු විසඳීම - පිළිතුරු පත්‍රය',
    //         subject: 'Mathematics',
    //         dueDate: '2025-03-18',
    //         status: 'pending',
    //         type: 'worksheet',
    //       },
    //       {
    //         id: 'task3',
    //         title: 'පරිසර අධ්‍යයනය - ශාක වර්ග හඳුනා ගැනීම',
    //         subject: 'Environment',
    //         dueDate: '2025-03-22',
    //         status: 'pending',
    //         type: 'project',
    //       },
    //     ],
    //     completedTasks: [
    //       {
    //         id: 'task4',
    //         title: 'අකුරු ලිවීම - පුහුණු පත්‍රිකාව',
    //         subject: 'Sinhala',
    //         completedDate: '2025-03-15',
    //         grade: 'A',
    //         type: 'worksheet',
    //       },
    //       {
    //         id: 'task5',
    //         title: 'සංඛ්‍යා හඳුනා ගැනීම - පරීක්ෂණය',
    //         subject: 'Mathematics',
    //         completedDate: '2025-03-14',
    //         grade: 'B+',
    //         type: 'quiz',
    //       },
    //     ],
    //     upcomingEvents: [
    //       {
    //         id: 'event1',
    //         title: 'Term Test - Sinhala',
    //         date: '2025-03-25',
    //         time: '9:00 AM',
    //         type: 'exam',
    //       },
    //       {
    //         id: 'event2',
    //         title: 'Science Exhibition',
    //         date: '2025-03-28',
    //         time: '10:00 AM',
    //         type: 'event',
    //       },
    //       {
    //         id: 'event3',
    //         title: 'Parent-Teacher Meeting',
    //         date: '2025-04-02',
    //         time: '3:30 PM',
    //         type: 'meeting',
    //       },
    //     ],
    //     progress: {
    //       sinhala: 75,
    //       mathematics: 68,
    //       environment: 82,
    //     },
    //     recentActivity: [
    //       {
    //         id: 'activity1',
    //         description: 'Completed Sinhala reading assignment',
    //         timestamp: '2025-03-15T14:30:00',
    //         type: 'completion',
    //       },
    //       {
    //         id: 'activity2',
    //         description: 'Watched 3 Mathematics video lessons',
    //         timestamp: '2025-03-14T16:45:00',
    //         type: 'learning',
    //       },
    //       {
    //         id: 'activity3',
    //         description: 'Started Environment project',
    //         timestamp: '2025-03-13T10:15:00',
    //         type: 'start',
    //       },
    //     ],
    //     messages: [
    //       {
    //         id: 'msg1',
    //         from: 'Ms. Kumari (Sinhala Teacher)',
    //         content:
    //           'Amal is showing great improvement in reading comprehension.',
    //         timestamp: '2025-03-15T09:30:00',
    //         read: false,
    //       },
    //       {
    //         id: 'msg2',
    //         from: 'Mr. Bandara (Principal)',
    //         content:
    //           'Reminder: School will be closed on March 24th for staff development.',
    //         timestamp: '2025-03-14T11:20:00',
    //         read: true,
    //       },
    //     ],
    //   },
    //   {
    //     id: 'child2',
    //     name: 'Sithmi Perera',
    //     grade: 'Grade 1',
    //     avatar: '/placeholder.svg?height=40&width=40&text=SP',
    //     subjects: ['Sinhala', 'Mathematics', 'Environment'],
    //     pendingTasks: [
    //       {
    //         id: 'task6',
    //         title: 'අකුරු හඳුනා ගැනීම - පුහුණු පත්‍රිකාව',
    //         subject: 'Sinhala',
    //         dueDate: '2025-03-19',
    //         status: 'pending',
    //         type: 'worksheet',
    //       },
    //       {
    //         id: 'task7',
    //         title: 'සංඛ්‍යා ගණනය - ක්‍රියාකාරකම්',
    //         subject: 'Mathematics',
    //         dueDate: '2025-03-21',
    //         status: 'pending',
    //         type: 'activity',
    //       },
    //     ],
    //     completedTasks: [
    //       {
    //         id: 'task8',
    //         title: 'පාට හඳුනා ගැනීම - ක්‍රියාකාරකම්',
    //         subject: 'Environment',
    //         completedDate: '2025-03-16',
    //         grade: 'A',
    //         type: 'activity',
    //       },
    //     ],
    //     upcomingEvents: [
    //       {
    //         id: 'event4',
    //         title: 'Class Photo Day',
    //         date: '2025-03-26',
    //         time: '10:30 AM',
    //         type: 'event',
    //       },
    //       {
    //         id: 'event5',
    //         title: 'Reading Assessment',
    //         date: '2025-03-29',
    //         time: '9:00 AM',
    //         type: 'assessment',
    //       },
    //     ],
    //     progress: {
    //       sinhala: 65,
    //       mathematics: 70,
    //       environment: 80,
    //     },
    //     recentActivity: [
    //       {
    //         id: 'activity4',
    //         description: 'Completed color identification activity',
    //         timestamp: '2025-03-16T13:20:00',
    //         type: 'completion',
    //       },
    //       {
    //         id: 'activity5',
    //         description: 'Practiced writing letters',
    //         timestamp: '2025-03-15T11:30:00',
    //         type: 'learning',
    //       },
    //     ],
    //     messages: [
    //       {
    //         id: 'msg3',
    //         from: 'Ms. Dilhani (Class Teacher)',
    //         content: 'Sithmi is adapting well to the classroom environment.',
    //         timestamp: '2025-03-16T14:45:00',
    //         read: false,
    //       },
    //     ],
    //   },
    // ];
  }
}
