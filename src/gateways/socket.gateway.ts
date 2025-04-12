// src/gateway/online.gateway.ts
import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

interface OnlineUser {
  userId: string;
  socketId: string;
}

@WebSocketGateway(8900, {
  cors: {
    origin: 'http://localhost:5173',
  },
})
export class OnlineGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private onlineUsers: OnlineUser[] = [];

  handleConnection(client: Socket) {
    console.log('A user connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    this.removeUniqueUser(client.id);
    this.server.emit('onlineUserList', this.onlineUsers);
    console.log('A user disconnected:', client.id);
  }

  @SubscribeMessage('addUser')
  handleAddUser(
    @MessageBody() userId: string,
    @ConnectedSocket() client: Socket,
  ) {
    this.addUniqueUser(userId, client.id);
    this.server.emit('onlineUserList', this.onlineUsers);
  }

  private addUniqueUser(userId: string, socketId: string) {
    const exists = this.onlineUsers.some((user) => user.userId === userId);
    if (!exists) {
      this.onlineUsers.push({ userId, socketId });
    }
  }

  private removeUniqueUser(socketId: string) {
    this.onlineUsers = this.onlineUsers.filter(
      (user) => user.socketId !== socketId,
    );
  }
}
