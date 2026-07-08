import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/ws',
})
export class WsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  declare server: Server;

  private onlineUsers = new Map<string, string>();

  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token =
        client.handshake.auth?.token ||
        client.handshake.headers?.authorization?.replace('Bearer ', '');
      if (!token) {
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token);
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        include: { couple: true },
      });

      if (!user?.couple) {
        client.disconnect();
        return;
      }

      client.data = { userId: user.id, coupleId: user.couple.id };
      this.onlineUsers.set(user.id, client.id);

      await client.join(`couple:${user.couple.id}`);
      this.server.to(`couple:${user.couple.id}`).emit('userOnline', {
        userId: user.id,
        nickname: user.nickname,
      });
    } catch {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const { userId, coupleId } = client.data || {};
    if (userId) {
      this.onlineUsers.delete(userId);
      if (coupleId) {
        this.server.to(`couple:${coupleId}`).emit('userOffline', { userId });
      }
    }
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { content: string; type?: string },
  ) {
    const { userId, coupleId } = client.data;

    const message = await this.prisma.message.create({
      data: {
        content: payload.content,
        type: payload.type || 'TEXT',
        coupleId,
        senderId: userId,
      },
      include: {
        sender: { select: { id: true, nickname: true, avatar: true } },
      },
    });

    this.server.to(`couple:${coupleId}`).emit('newMessage', message);
    return message;
  }

  @SubscribeMessage('typing')
  handleTyping(@ConnectedSocket() client: Socket) {
    const { userId, coupleId } = client.data;
    client.to(`couple:${coupleId}`).emit('partnerTyping', { userId });
  }

  @SubscribeMessage('stopTyping')
  handleStopTyping(@ConnectedSocket() client: Socket) {
    const { userId, coupleId } = client.data;
    client.to(`couple:${coupleId}`).emit('partnerStopTyping', { userId });
  }

  @SubscribeMessage('readMessages')
  async handleReadMessages(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { messageIds: string[] },
  ) {
    const { userId, coupleId } = client.data;

    await this.prisma.message.updateMany({
      where: { id: { in: payload.messageIds }, read: false, senderId: { not: userId } },
      data: { read: true },
    });

    this.server.to(`couple:${coupleId}`).emit('messagesRead', {
      messageIds: payload.messageIds,
      readBy: userId,
    });
  }
}
