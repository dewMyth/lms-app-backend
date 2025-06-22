import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { Message, MessageSchema } from './schema/message.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Student, StudentSchema } from 'src/users/schemas/student.schema';
import {
  AdminChatMessage,
  AdminChatMessageSchema,
} from './schema/admin-chat-message.schema';
import {
  AdminChatThread,
  AdminChatThreadSchema,
} from './schema/admin-chat-thread.schema';
import { Admin, AdminSchema } from 'src/users/schemas/admin.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    MongooseModule.forFeature([{ name: Student.name, schema: StudentSchema }]),
    MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }]),
    MongooseModule.forFeature([
      { name: AdminChatThread.name, schema: AdminChatThreadSchema },
    ]),
    MongooseModule.forFeature([
      { name: AdminChatMessage.name, schema: AdminChatMessageSchema },
    ]),
  ],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
