import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from './schema/message.schema';
import { Student } from 'src/users/schemas/student.schema';
import { AdminChatMessage } from './schema/admin-chat-message.schema';
import { AdminChatThread } from './schema/admin-chat-thread.schema';
import { Admin } from 'src/users/schemas/admin.schema';

@Injectable()
export class ChatService {
  constructor(
    //@InjectModel(Student.name) private studentModel: Model<Student>,
    @InjectModel(Message.name) private messageModel: Model<Message>,
    @InjectModel(Student.name) private studentModel: Model<Student>,
    @InjectModel(Admin.name) private adminModel: Model<Admin>,
    @InjectModel(AdminChatThread.name)
    private adminChatThreadModel: Model<AdminChatThread>,
    @InjectModel(AdminChatMessage.name)
    private adminChatMessageModel: Model<AdminChatMessage>,
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

  async createAdminChatThread(chatData: any) {
    // Sample Data
    //     {
    //   _id: "1",
    //   subject: "Assignment Submission Issue",
    //   participant_name: "Jimmy Smith",
    //   participant_type: "student",
    //   participant_avatar: "/placeholder.svg?height=40&width=40",
    //   last_message: "I'm having trouble submitting my math assignment",
    //   last_message_time: "2024-01-15T10:30:00Z",
    //   unread_count: 2,
    //   status: "open",
    //   messages: [
    //     {
    //       _id: "m1",
    //       content:
    //         "Hello, I'm having trouble submitting my math assignment. The upload button doesn't seem to work.",
    //       timestamp: "2024-01-15T09:00:00Z",
    //       sender_id: "s1",
    //       sender_name: "Jimmy Smith",
    //       sender_type: "student",
    //       sender_avatar: "/placeholder.svg?height=40&width=40",
    //       is_read: true,
    //       admin_response:
    //         "Hi Jimmy, I can help you with that. Can you tell me what browser you're using?",
    //       admin_response_timestamp: "2024-01-15T09:15:00Z",
    //     },
    //     {
    //       _id: "m2",
    //       content:
    //         "I'm using Chrome. I tried refreshing the page but it still doesn't work.",
    //       timestamp: "2024-01-15T10:30:00Z",
    //       sender_id: "s1",
    //       sender_name: "Jimmy Smith",
    //       sender_type: "student",
    //       sender_avatar: "/placeholder.svg?height=40&width=40",
    //       is_read: false,
    //     },
    //   ],
    // }

    const newChatThread = {
      subject: chatData.subject,
      participant_name: chatData.participant_name,
      participant_type: chatData.participant_type,
      participant_avatar: chatData.participant_avatar,
      participants: [chatData.participant_id],
      last_message_time: chatData.last_message_time,
    };

    const response = await this.adminChatThreadModel.create(newChatThread);

    if (response) {
      this.createAdminChatMessage({
        thread_id: response._id,
        content: chatData.last_message,
        sender_id: chatData.participant_id,
        sender_name: chatData.participant_name,
        sender_type: chatData.participant_type,
        sender_avatar: chatData.participant_avatar,
        is_read: true,
        attachments: [],
        read_by: [],
        admin_response: null,
        deleted_at: null,
        parent_message_id: null,
      });
    }

    // Return the created thread with the initial message
    return {
      _id: response._id,
      subject: response.subject,
      participant_name: chatData.participant_name,
      participant_type: chatData.participant_type,
      participant_avatar: chatData.participant_avatar,
      last_message: chatData.last_message,
      last_message_time: new Date(),
      unread_count: 0, // Initial unread count
      status: 'open', // Initial status
      messages: [
        {
          _id: null, // This will be set after the message is created
          content: chatData.last_message,
          timestamp: new Date(),
          sender_id: chatData.participant_id,
          sender_name: chatData.participant_name,
          sender_type: chatData.participant_type,
          sender_avatar: chatData.participant_avatar,
          is_read_by_admin: true, // Initial read status
          admin_response: null,
          admin_response_timestamp: null,
        },
      ],
    };
  }

  async createAdminChatMessage(chatData: any) {
    let newChatMessage;
    let response;
    let adminRespondedMessage;

    if (chatData.sender_type === 'admin') {
      // Find Admin details
      const admin = await this.adminModel
        .findById(chatData.sender_id)
        .lean()
        .exec();
      if (!admin) {
        throw new Error('Admin not found');
      }

      // Find the admin responded message from the message model
      adminRespondedMessage = await this.adminChatMessageModel.findOneAndUpdate(
        {
          _id: chatData.message_id, // Ensure we are updating the correct message
        },
        {
          $set: {
            admin_response: chatData.content,
            updated_at: new Date(),
            is_read_by_admin: true, // Mark as read by admin
            admin_response_timestamp: new Date(),
          },
        },
        { new: true },
      );

      if (!adminRespondedMessage) {
        throw new Error('Admin responded message not found');
      }

      // Update the chat message with updating admin_response
    } else {
      // For student or parent, we can assume the sender_type is 'student' or 'parent'
      newChatMessage = {
        thread_id: chatData.thread_id,
        content: chatData.content,
        created_at: new Date(),
        sender_id: chatData.sender_id,
        sender_name: chatData.sender_name,
        sender_type: chatData.sender_type,
        sender_avatar: chatData.sender_avatar,
        is_read_by_admin: false,
        attachments: [],
        read_by: [],
        admin_response: null,
        deleted_at: null,
      };

      response = await this.adminChatMessageModel.create(newChatMessage);
    }

    await this.adminChatThreadModel.findByIdAndUpdate(
      chatData.thread_id,
      {
        $inc: { total_messages: 1 },
        $set: {
          status: 'open', // Initial status
          last_message: chatData.last_message,
          last_message_time: new Date(),
        },
      },
      { new: true },
    );

    return {
      _id: response ? response._id : adminRespondedMessage?._id,
      content: chatData?.content,
      created_at: new Date(),
      sender_id: chatData?.sender_id,
      sender_name: chatData?.sender_name,
      sender_type: chatData?.sender_type,
      sender_avatar: chatData?.sender_avatar,
      is_read_by_admin: chatData?.is_read_by_admin || false,
      attachments: chatData?.attachments || [],
      read_by: chatData.read_by || [],
      admin_response: chatData?.admin_response || null,
      admin_response_timestamp:
        adminRespondedMessage?.admin_response_timestamp || null,
      deleted_at: chatData.deleted_at || null,
    };
  }

  async getAllChatThreadsWithMessages() {
    // Sample Output
    // [
    //   {
    //     _id: '1',
    //     subject: 'Assignment Submission Issue',
    //     participant_name: 'Jimmy Smith',
    //     participant_type: 'student',
    //     participant_avatar: '/placeholder.svg?height=40&width=40',
    //     last_message: "I'm having trouble submitting my math assignment",
    //     last_message_time: '2024-01-15T10:30:00Z',
    //     unread_count: 2,
    //     status: 'open',
    //     messages: [
    //       {
    //         _id: 'm1',
    //         content:
    //           "Hello, I'm having trouble submitting my math assignment. The upload button doesn't seem to work.",
    //         timestamp: '2024-01-15T09:00:00Z',
    //         sender_id: 's1',
    //         sender_name: 'Jimmy Smith',
    //         sender_type: 'student',
    //         sender_avatar: '/placeholder.svg?height=40&width=40',
    //         is_read: true,
    //         admin_response:
    //           "Hi Jimmy, I can help you with that. Can you tell me what browser you're using?",
    //         admin_response_timestamp: '2024-01-15T09:15:00Z',
    //       },
    //       {
    //         _id: 'm2',
    //         content:
    //           "I'm using Chrome. I tried refreshing the page but it still doesn't work.",
    //         timestamp: '2024-01-15T10:30:00Z',
    //         sender_id: 's1',
    //         sender_name: 'Jimmy Smith',
    //         sender_type: 'student',
    //         sender_avatar: '/placeholder.svg?height=40&width=40',
    //         is_read: false,
    //       },
    //     ],
    //   },
    //   {
    //     _id: '2',
    //     subject: 'Grade Inquiry',
    //     participant_name: 'John Smith (Parent)',
    //     participant_type: 'parent',
    //     participant_avatar: '/placeholder.svg?height=40&width=40',
    //     last_message: "Could you please explain my child's recent grade?",
    //     last_message_time: '2024-01-15T08:45:00Z',
    //     unread_count: 1,
    //     status: 'pending',
    //     messages: [
    //       {
    //         _id: 'm3',
    //         content:
    //           "Hello, I'm John Smith, Jimmy's father. Could you please explain his recent grade in Mathematics? He received a C+ and we'd like to understand what areas need improvement.",
    //         timestamp: '2024-01-15T08:45:00Z',
    //         sender_id: 'p1',
    //         sender_name: 'John Smith (Parent)',
    //         sender_type: 'parent',
    //         sender_avatar: '/placeholder.svg?height=40&width=40',
    //         is_read: false,
    //       },
    //     ],
    //   },
    // ];

    const threads = await this.adminChatThreadModel.find().lean().exec();
    const messages = await this.adminChatMessageModel.find().lean().exec();

    const threadWithMessages = threads.map((thread) => {
      const threadMessages = messages.filter(
        (message) => message.thread_id.toString() === thread._id.toString(),
      );
      return {
        // Sample output
        //     _id: '2',
        //     subject: 'Grade Inquiry',
        //     participant_name: 'John Smith (Parent)',
        //     participant_type: 'parent',
        //     participant_avatar: '/placeholder.svg?height=40&width=40',
        //     last_message: "Could you please explain my child's recent grade?",
        //     last_message_time: '2024-01-15T08:45:00Z',
        //     unread_count: 1,
        //     status: 'pending',
        //     messages: [
        //       {
        //         _id: 'm3',
        //         content:
        //           "Hello, I'm John Smith, Jimmy's father. Could you please explain his recent grade in Mathematics? He received a C+ and we'd like to understand what areas need improvement.",
        //         timestamp: '2024-01-15T08:45:00Z',
        //         sender_id: 'p1',
        //         sender_name: 'John Smith (Parent)',
        //         sender_type: 'parent',
        //         sender_avatar: '/placeholder.svg?height=40&width=40',
        //         is_read: false,
        //       },
        //     ],
        //   },

        _id: thread._id,
        subject: thread.subject,
        participant_name: threadMessages[0]?.sender_name,
        participant_type: threadMessages[0]?.sender_type,
        participant_avatar: threadMessages[0]?.sender_avatar,
        last_message: threadMessages[threadMessages.length - 1].content,
        last_message_time: threadMessages[threadMessages.length - 1].created_at,
        unread_count: threadMessages.filter((msg) => !msg.is_read_by_admin)
          .length,
        status: thread.status,
        messages: threadMessages.map((message) => {
          return {
            _id: message._id,
            content: message.content,
            timestamp: message.created_at,
            sender_id: message.sender_id,
            sender_name: message.sender_name,
            sender_type: message.sender_type,
            sender_avatar: message.sender_avatar,
            is_read: message.is_read_by_admin,
            admin_response: message.admin_response,
            admin_response_timestamp: message.admin_response_timestamp,
          };
        }),
      };
    });

    return threadWithMessages;
  }

  async getAllChatThreadsWithMessagesByUserId(userId: string) {
    const threads = await this.adminChatThreadModel
      .find({ participants: userId })
      .lean()
      .exec();

    const messages = await this.adminChatMessageModel.find().lean().exec();
    const threadWithMessages = threads.map((thread) => {
      const threadMessages = messages.filter(
        (message) => message.thread_id.toString() === thread._id.toString(),
      );
      return {
        _id: thread._id,
        subject: thread.subject,
        participant_name: threadMessages[0]?.sender_name,
        participant_type: threadMessages[0]?.sender_type,
        participant_avatar: threadMessages[0]?.sender_avatar,
        last_message: threadMessages[threadMessages.length - 1].content,
        last_message_time: threadMessages[threadMessages.length - 1].created_at,
        unread_count: threadMessages.filter((msg) => !msg.is_read_by_admin)
          .length,
        status: thread.status,
        messages: threadMessages.map((message) => {
          return {
            _id: message._id,
            content: message.content,
            timestamp: message.created_at,
            sender_id: message.sender_id,
            sender_name: message.sender_name,
            sender_type: message.sender_type,
            sender_avatar: message.sender_avatar,
            is_read: message.is_read_by_admin,
            admin_response: message.admin_response,
            admin_response_timestamp: message.admin_response_timestamp,
          };
        }),
      };
    });

    return threadWithMessages;
  }
}
