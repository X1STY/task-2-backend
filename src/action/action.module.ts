import { Module } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { ActionController } from './action.controller';
import { ActionService } from './action.service';

@Module({
  controllers: [ActionController],
  providers: [ActionService, PrismaService]
})
export class ActionModule {}
