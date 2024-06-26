import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AccessGuard } from './authentication/guard/access.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(AccessGuard)
  @Get()
  @ApiBearerAuth()
  getHello(): string {
    return this.appService.getHello();
  }
}
