import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from './schema/message.schema';
import { Student } from 'src/users/schemas/student.schema';

@Injectable()
export class ChatService {
  constructor(
    //@InjectModel(Student.name) private studentModel: Model<Student>,
    @InjectModel(Message.name) private messageModel: Model<Message>,
    @InjectModel(Student.name) private studentModel: Model<Student>,
  ) {}
  /**
 * 
 *   {
    id: "m1",
    studentId: "s1",
    studentName: "Alex Johnson",
    studentGrade: "Grade 3",
    content:
      "Hello Ms. Johnson, I'm having trouble with the math homework. Can you help me understand problem #5?",
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    isRead: true,
    teacherResponses: [
      {
        teacherId: "t1",
        teacherName: "Sarah Johnson",
        content:
          "Hi Alex, I'd be happy to help. Problem #5 is about fractions. You need to find the common denominator first. Let me know if you need more specific guidance.",
        timestamp: new Date(Date.now() - 1000 * 60 * 2), // 2 minutes ago
      },
    ],
  },
 */

  createAMessage(chatData: any) {
    const newMessage = {
      studentId: chatData.studentId,
      studentName: chatData.studentName,
      studentGrade: chatData.studentGrade,
      content: chatData.content,
      timestamp: new Date(),
      isRead: false,
      teacherResponses: [],
    };
    return this.messageModel.create(newMessage).then((message) => {
      return message;
    });
  }

  getAllChats() {
    return this.messageModel.find().then((messages) => {
      return messages.map((message) => {
        return {
          id: message._id,
          studentId: message.studentId,
          studentName: message.studentName,
          studentGrade: message.studentGrade,
          content: message.content,
          timestamp: message.timestamp,
          isRead: message.isRead,
          teacherResponses: message.teacherResponses?.map((response) => {
            return {
              teacherId: response.teacherId,
              teacherName: response.teacherName,
              content: response.content,
              timestamp: response.timestamp,
            };
          }),
        };
      });
    });
  }

  getStudents() {
    //     id: "s1",
    //     name: "Alex Johnson",
    //     grade: "Grade 3",
    //     avatar: "/placeholder.svg?height=32&width=32",
    //     isOnline: true,
    //   },

    return this.studentModel.find().then((students) => {
      return students.map((student) => {
        return {
          id: student._id,
          name: student.username,
          grade: student.grade,
          avatar: '/placeholder.svg?height=32&width=32',
          isOnline: true,
        };
      });
    });
  }

  async updateTheTeacherResponse(messageId, updatedContent) {
    //         {
    //   teacherId: user._id,
    //   teacherName: user.username,
    //   content: values.message,
    //   timestamp: new Date(),
    // },

    // Get Assignment from Assignment Id
    // const assignment = await this.messageModel
    //   .findOne({ _id: assignmentId })
    //   .lean()
    //   .exec();

    // if (!assignment || !user) {
    //   throw new InternalServerErrorException();
    // }

    const response = await this.messageModel.findByIdAndUpdate(
      messageId,
      {
        $push: {
          teacherResponses: {
            teacherId: updatedContent.teacherId,
            teacherName: updatedContent.teacherName,
            content: updatedContent.content,
            timestamp: new Date(),
          },
        },
      },
      { new: true },
    );

    console.log(response);
  }

  // Get All chat threads by user
  async getAllChatThreadsByUserId(userId: string) {
    return this.messageModel.find({ studentId: userId }).then((messages) => {
      return messages.map((message) => {
        return {
          id: message._id,
          studentId: message.studentId,
          studentName: message.studentName,
          studentGrade: message.studentGrade,
          content: message.content,
          timestamp: message.timestamp,
          isRead: message.isRead,
          teacherResponses: message.teacherResponses?.map((response) => {
            return {
              teacherId: response.teacherId,
              teacherName: response.teacherName,
              content: response.content,
              timestamp: response.timestamp,
            };
          }),
        };
      });
    });
  }
}
