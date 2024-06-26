import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { Payload } from '../dto/jwt-payload.dto';

@Injectable()
export class RefreshGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request & { email?: string } = context
      .switchToHttp()
      .getRequest();
    const token = this.extractTokenFromCookie(request);
    if (!token) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    try {
      const payload: Payload = this.jwtService.verify(token, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
      request.email = payload.email;
    } catch (e) {
      Logger.error(e);
      throw new UnauthorizedException('Invalid refresh token');
    }
    return true;
  }
  private extractTokenFromCookie(request: Request): string | undefined {
    return request.headers.cookie?.split('refreshToken=')[1];
  }
}
