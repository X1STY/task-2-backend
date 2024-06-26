import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { PrismaService } from 'src/services/prisma.service';
import { MailService } from 'src/services/mail.service';

@Module({
  controllers: [AuthenticationController],
  providers: [AuthenticationService, PrismaService, MailService],
})
export class AuthenticationModule {}
