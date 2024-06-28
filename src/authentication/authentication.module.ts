import { Module } from '@nestjs/common';
import { MailService } from 'src/services/mail.service';
import { PrismaService } from 'src/services/prisma.service';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';

@Module({
  controllers: [AuthenticationController],
  providers: [AuthenticationService, PrismaService, MailService]
})
export class AuthenticationModule {}
