import { BadRequestException, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { JwtService } from '@nestjs/jwt';
import { ActionType } from '@prisma/client';
import { RequestWithEmail } from '@types';
import * as bcrypt from 'bcrypt';
import * as cookie from 'cookie';
import { Response } from 'express';
import { nanoid } from 'nanoid';
import { RegisterRootFolderDto } from 'src/drive/dto/folder/register-root-folder.dto';
import { MailService } from 'src/services/mail.service';
import { PrismaService } from 'src/services/prisma.service';
import { USER_REGISTERED_EVENT } from 'src/utils/constants';
import { RefreshResponseDto } from './dto/refresh-token.dto';
import { SignInDto, SignInResponseDto } from './dto/signin.dto';
import { SignUpRequestDto, SignUpResponseDto } from './dto/signup.dto';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly mailService: MailService,
    private eventEmitter: EventEmitter2
  ) {}

  async signUp(payload: SignUpRequestDto): Promise<SignUpResponseDto> {
    const user = await this.prisma.user.findFirst({
      where: {
        email: payload.email
      }
    });
    if (user) {
      throw new BadRequestException(['User with this email already exists']);
    }

    const hashedPassword = await bcrypt.hash(payload.password, 10);

    const newUser = await this.prisma.user.create({
      data: {
        name: payload.name,
        surname: payload.surname,
        middlename: payload.middlename,
        email: payload.email,
        username: payload.username,
        password: hashedPassword
      }
    });

    await this.sendEmailOnRegister(payload.email);

    this.eventEmitter.emit(USER_REGISTERED_EVENT, new RegisterRootFolderDto(payload.email));

    return {
      user: {
        email: newUser.email,
        name: newUser.name,
        surname: newUser.surname,
        middlename: newUser.middlename,
        username: newUser.username,
        is_confirmed: newUser.is_confirmed
      }
    };
  }

  async signIn(payload: SignInDto, response: Response): Promise<SignInResponseDto> {
    const { email, password } = payload;
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new BadRequestException(['Invalid credentials']);
    }
    const { accessToken, refreshToken } = this.generateTokens(email);

    response.cookie('refreshToken', refreshToken, {
      expires: new Date(new Date().getTime() + 30 * 1000),
      sameSite: 'strict',
      httpOnly: true
    });

    response.setHeader(
      'Set-Cookie',
      cookie.serialize('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 3,
        path: '/'
      })
    );

    return {
      user: {
        email: user.email,
        name: user.name,
        surname: user.surname,
        middlename: user.middlename,
        username: user.username,
        is_confirmed: user.is_confirmed
      },
      accessToken
    };
  }

  async refreshTokens(response: Response, requset: RequestWithEmail): Promise<RefreshResponseDto> {
    const email = requset.email;
    const { accessToken, refreshToken } = this.generateTokens(email);
    response.setHeader(
      'Set-Cookie',
      cookie.serialize('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 3,
        path: '/'
      })
    );
    return {
      accessToken
    };
  }

  private generateTokens(email: string) {
    const accessToken = this.jwt.sign(
      { email },
      { expiresIn: '1h', secret: process.env.JWT_ACCESS_SECRET }
    );
    const refreshToken = this.jwt.sign(
      { email },
      { expiresIn: '3d', secret: process.env.JWT_REFRESH_SECRET }
    );

    return {
      accessToken,
      refreshToken
    };
  }

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        email
      }
    });
    if (!user) {
      return null;
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return null;
    }
    return { ...user, password: undefined };
  }

  async sendEmailOnRegister(to: string) {
    const type = ActionType.confirmEmail;
    const token = nanoid(64);

    const previosRequest = await this.prisma.actions.findFirst({
      where: {
        action_type: type,
        user_email: to
      }
    });

    if (previosRequest) {
      await this.prisma.actions.delete({
        where: {
          id: previosRequest?.id
        }
      });
    }

    await this.prisma.actions.create({
      data: {
        action_type: type,
        token,
        user_email: to,
        exp_date: new Date(Date.now() + 1000 * 60 * 15)
      }
    });

    await this.mailService.sendRegistrationConfirmEmail(to, token, type);
  }

  async sendEmailToChangePassword(requset: RequestWithEmail) {
    const email = requset.email;
    const type = ActionType.changePassword;
    const token = nanoid(64);
    const previosRequest = await this.prisma.actions.findFirst({
      where: {
        action_type: type,
        user_email: email
      }
    });
    if (previosRequest) {
      await this.prisma.actions.delete({
        where: {
          id: previosRequest?.id
        }
      });
    }
    await this.prisma.actions.create({
      data: {
        action_type: type,
        token,
        user_email: email,
        exp_date: new Date(Date.now() + 1000 * 60 * 15)
      }
    });
    await this.mailService.sendPasswordResetEmail(email, token, type);
  }
}
