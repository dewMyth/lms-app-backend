import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('create-msg')
  async createAMessage(@Body() chatData: any) {
    return this.chatService.createAMessage(chatData);
  }

  @Get('msg-students')
  async getStudents() {
    return this.chatService.getStudents();
  }

  @Get('get-all-chats')
  async getAllChats() {
    return this.chatService.getAllChats();
  }

  @Post('reply-to-msg')
  async updateTheTeacherResponse(@Body() chatData: any) {
    const { messageId, updatedContent } = chatData;
    if (!messageId || !updatedContent) {
      return { error: 'messageId and updatedContent are required' };
    }
    return this.chatService.updateTheTeacherResponse(messageId, updatedContent);
  }

  @Get('get-all-chat-by-user/:userId')
  async getAllChatByUser(@Param('userId') userId) {
    if (!userId) {
      return { error: 'userId is required' };
    }
    return this.chatService.getAllChatThreadsByUserId(userId);
  }
}
