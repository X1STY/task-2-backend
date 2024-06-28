import { Module } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { DriveController } from './drive.controller';
import { DriveService } from './drive.service';

@Module({
  controllers: [DriveController],
  providers: [DriveService, PrismaService]
})
export class DriveModule {}
