import { BadRequestException, Injectable } from '@nestjs/common';
import { ActionType } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/services/prisma.service';
import { ActionBodyDto, ActionQueryDto } from './dto/actions.dto';

@Injectable()
export class ActionService {
  constructor(private readonly prisma: PrismaService) {}
  async handleAction(query: ActionQueryDto, body?: ActionBodyDto) {
    switch (query.type) {
      case ActionType.confirmEmail.toString():
        return this.handleEmailConfirmation(query);
      case ActionType.changePassword.toString():
        return this.handlePasswordReset(query, body);
      default: {
        console.log(query);
        throw new BadRequestException(['Requested action not found']);
      }
    }
  }

  async handleEmailConfirmation(query: ActionQueryDto) {
    const { email, isValid, action_id } = await this.validateToken(query.token);
    if (!isValid) {
      throw new BadRequestException(['Invalid credentials']);
    }

    await this.prisma.user.update({
      where: {
        email
      },
      data: {
        is_confirmed: true
      }
    });

    await this.prisma.actions.delete({
      where: {
        id: action_id
      }
    });
  }
  async handlePasswordReset(query: ActionQueryDto, body?: ActionBodyDto) {
    const { email, isValid, action_id } = await this.validateToken(query.token);
    if (!isValid) {
      throw new BadRequestException(['Invalid credentials']);
    }

    if (!body?.newPassword) {
      throw new BadRequestException(['New password is required']);
    }

    await this.prisma.user.update({
      where: {
        email
      },
      data: {
        password: await bcrypt.hash(body.newPassword, 10)
      }
    });

    await this.prisma.actions.delete({
      where: {
        id: action_id
      }
    });
  }

  async validateToken(token: string) {
    const action = await this.prisma.actions.findFirst({
      where: {
        token
      }
    });

    if (
      !action ||
      action.token !== token ||
      new Date(action.exp_date).getTime() < new Date().getTime()
    ) {
      return { isValid: false };
    }
    return {
      action_id: action.id,
      email: action.user_email,
      isValid: true
    };
  }
}
