import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AccessGuard } from './authentication/guard/access.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(AccessGuard)
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
