import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Student } from './entities/student.entity';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create-student')
  createStudent(@Body() enteredStudentData: Student) {
    return this.usersService.createStudentAccount(enteredStudentData);
  }

  @Post('login')
  loginStudent(@Body() enteredStudentData) {
    return this.usersService.loginStudent(enteredStudentData);
  }

  @Post('edit-student')
  editStudent(@Body() updatedUserData) {
    return this.usersService.editStudent(updatedUserData);
  }

  @Post('add-assignment/:assignmentId/:userId')
  addActivityToAssignments(
    @Param('assignmentId') assignmentId: string,
    @Param('userId') userId: string,
  ) {
    return this.usersService.addActivityToAssignments(assignmentId, userId);
  }

  @Get('view-all-assignments/:userId')
  getAllAssignmentsByUser(@Param('userId') userId: string) {
    return this.usersService.getAllAssignmentsByUser(userId);
  }

  @Post('submission/:assignmentId/:userId')
  @UseInterceptors(FileInterceptor('file'))
  submitAssignment(
    @Param('assignmentId') assignmentId: string,
    @Param('userId') userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.usersService.submitAssignment(file, assignmentId, userId);
  }

  @Post('add-avatar/:userId')
  @UseInterceptors(FileInterceptor('file'))
  addAvatar(
    @Param('userId') userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.usersService.saveAvatar(file, userId);
  }

  @Get('all-user-details/:type/:userId')
  getAllUserDetails(
    @Param('type') userType: string,
    @Param('userId') userId: string,
  ) {
    return this.usersService.getAllUserData(userType, userId);
  }

  @Get('all-students-stats-by-parent/:parentId')
  getAllStudentsStatsByParent(@Param('parentId') parentId: string) {
    return this.usersService.getAllStudentsStatsByParent(parentId);
  }

  @Post('create-teacher')
  createTeacher(@Body() enteredTeacherData) {
    return this.usersService.createTeacherAccount(enteredTeacherData);
  }

  @Get('get-all-teachers')
  getAllTeachers() {
    return this.usersService.getAllTeachers();
  }

  @Get('get-all-submitted-assignments')
  getAllSubmittedAssignments() {
    return this.usersService.getAllSubmittedAssignmentsOfStudents();
  }

  @Post('grading/:assignmentId/:userId')
  grading(
    @Param('assignmentId') assignmentId: string,
    @Param('userId') userId: string,
    @Body() gradingData,
  ) {
    return this.usersService.gradeAssignment(assignmentId, userId, gradingData);
  }

  @Get('get-teachers-by-grade/:grade')
  getTeachersByGrade(@Param('grade') grade) {
    return this.usersService.getTeachersByGrade(grade);
  }

  @Post('login-admin')
  loginAdmin(@Body() loginCredentials) {
    return this.usersService.loginAdmin(loginCredentials);
  }

  @Post('create-admin')
  createAdmin(@Body() adminData) {
    return this.usersService.createAdminAccount(adminData);
  }

  @Get('get-all-students')
  getAllStudents() {
    return this.usersService.getAllStudents();
  }

  // @Get()
  // findAll() {
  //   return this.usersService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.usersService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(+id);
  // }
}
