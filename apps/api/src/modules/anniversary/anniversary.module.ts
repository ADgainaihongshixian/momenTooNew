import { Module } from '@nestjs/common';
import { AnniversaryController } from './anniversary.controller';
import { AnniversaryService } from './anniversary.service';

@Module({
  controllers: [AnniversaryController],
  providers: [AnniversaryService],
  exports: [AnniversaryService],
})
export class AnniversaryModule {}
