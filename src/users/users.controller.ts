import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Student } from './entities/student.entity';

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
