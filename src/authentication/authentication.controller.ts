import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
import { Response } from 'express';
import { RefreshGuard } from './guard/refresh.guard';
import { RequestWithEmail } from '@types';

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('signup')
  async signUp(@Body() credentials: SignUpDto) {
    return this.authenticationService.signUp(credentials);
  }

  @Post('signin')
  async signIn(@Body() credentials: SignInDto, @Res() res: Response) {
    const result = await this.authenticationService.signIn(credentials, res);
    res.send(result);
  }

  @UseGuards(RefreshGuard)
  @Post('refresh')
  async refreshTokens(@Res() res: Response, @Req() req: RequestWithEmail) {
    const result = await this.authenticationService.refreshTokens(res, req);
    return res.send(result);
  }
}
