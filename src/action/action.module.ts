import { Module } from '@nestjs/common';
import { ActionService } from './action.service';
import { ActionController } from './action.controller';
import { PrismaService } from 'src/services/prisma.service';

@Module({
  controllers: [ActionController],
  providers: [ActionService, PrismaService],
})
export class ActionModule {}
