import { Body, Controller, HttpCode, Post, Req, Res, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { RequestWithEmail } from '@types';
import { Response } from 'express';
import { BadRequestErrorDto, UnauthorizedErrorDto } from 'src/error/dto/error.dto';
import { AuthenticationService } from './authentication.service';
import { RefreshResponseDto } from './dto/refresh-token.dto';
import { SignInDto, SignInResponseDto } from './dto/signin.dto';
import { SignUpRequestDto, SignUpResponseDto } from './dto/signup.dto';
import { AccessGuard } from './guard/access.guard';
import { RefreshGuard } from './guard/refresh.guard';

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
