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

    // Create Parent Object
    const newParent = {
      email: studentData.parents_email,
      password: hashedPassword,
      students: [studentData.email],
    };

    // Save the student data to the database
    await this.studentModel
      .create(newStudent)
      .then((res) => {
        // Save the parent data to the database
        this.parentModel.create(newParent);
      })
      .catch((err) => {
        throw new InternalServerErrorException(
          `Error while saving user. Reason: ${err.message}`,
        );
      });

    return {
      message: 'Student Account Created Successfully',
      student: newStudent,
      parent: newParent,
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
            'assignments.$.file_link':
              getPublicUrlofSubmittedAssignment.data.publicUrl,
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
}
