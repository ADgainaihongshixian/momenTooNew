import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { CoupleModule } from './modules/couple/couple.module';
import { MomentModule } from './modules/moment/moment.module';
import { DiaryModule } from './modules/diary/diary.module';
import { AnniversaryModule } from './modules/anniversary/anniversary.module';
import { MediaModule } from './modules/media/media.module';
import { WsModule } from './modules/ws/ws.module';
import { AiModule } from './modules/ai/ai.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    LoggerModule.forRoot({
      pinoHttp: {
        transport:
          process.env.NODE_ENV !== 'production'
            ? { target: 'pino-pretty', options: { colorize: true, singleLine: true } }
            : undefined,
      },
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    CoupleModule,
    MomentModule,
    DiaryModule,
    AnniversaryModule,
    MediaModule,
    WsModule,
    AiModule,
  ],
})
export class AppModule {}
