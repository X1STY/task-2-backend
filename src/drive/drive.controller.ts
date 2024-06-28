import { Controller } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { nanoid } from 'nanoid';
import { PrismaService } from 'src/services/prisma.service';
import { USER_REGISTERED_EVENT } from 'src/utils/constants';
import { DriveService } from './drive.service';

@Controller('drive')
export class DriveController {
  constructor(
    private readonly driveService: DriveService,
    private readonly prisma: PrismaService
  ) {}

  @OnEvent(USER_REGISTERED_EVENT)
  async createRootFolder({ email }: { email: string }) {
    const id = nanoid();
    await this.prisma.folder.create({
      data: {
        name: 'root',
        user_email: email,
        id: id,
        parent_id: id
      }
    });
  }
}
