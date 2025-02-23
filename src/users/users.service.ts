import {
  BadRequestException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Student } from './schemas/student.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Parent } from './schemas/parent.schema';
import * as bcrypt from 'bcrypt';
import { UtilService } from 'src/util.service';
// import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Student.name) private studentModel: Model<Student>,
    @InjectModel(Parent.name) private parentModel: Model<Parent>,
    private _utilService: UtilService,
  ) {}

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
}
