import { Body, Controller, HttpCode, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { SignUpRequestDto, SignUpResponseDto } from './dto/signup.dto';
import { SignInDto, SignInResponseDto } from './dto/signin.dto';
import { Response } from 'express';
import { RefreshGuard } from './guard/refresh.guard';
import { RequestWithEmail } from '@types';
import { AccessGuard } from './guard/access.guard';
import {
  ApiTags,
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiHeader,
  ApiBearerAuth
} from '@nestjs/swagger';
import { BadRequestErrorDto, UnauthorizedErrorDto } from 'src/error/dto/error.dto';
import { RefreshResponseDto } from './dto/refresh-token.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @HttpCode(201)
  @ApiCreatedResponse({ type: SignUpResponseDto })
  @ApiBadRequestResponse({ type: BadRequestErrorDto })
  @Post('signup')
  async signUp(@Body() credentials: SignUpRequestDto): Promise<SignUpResponseDto> {
    return this.authenticationService.signUp(credentials);
  }

  @ApiOkResponse({ type: SignInResponseDto })
  @ApiBadRequestResponse({ type: BadRequestErrorDto })
  @HttpCode(200)
  @Post('signin')
  async signIn(@Body() credentials: SignInDto, @Res() res: Response): Promise<SignInResponseDto> {
    const result = await this.authenticationService.signIn(credentials, res);
    res.send(result);
    return result;
  }
  @ApiOkResponse({ type: RefreshResponseDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedErrorDto })
  @ApiHeader({ name: 'Authorization', required: true, description: 'Bearer token' })
  @HttpCode(200)
  @UseGuards(RefreshGuard)
  @Post('refresh')
  async refreshTokens(
    @Res() res: Response,
    @Req() req: RequestWithEmail
  ): Promise<RefreshResponseDto> {
    const result = await this.authenticationService.refreshTokens(res, req);
    res.send(result);
    return result;
  }

  @ApiOkResponse()
  @ApiUnauthorizedResponse({ type: UnauthorizedErrorDto })
  @HttpCode(200)
  @UseGuards(AccessGuard)
  @ApiBearerAuth()
  @Post('change-password')
  async sendEmailToChangePassword(@Req() req: RequestWithEmail) {
    return this.authenticationService.sendEmailToChangePassword(req);
  }
}
