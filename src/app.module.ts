import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { JwtModule } from '@nestjs/jwt';
import { ActionModule } from './action/action.module';

import { AuthenticationModule } from './authentication/authentication.module';
import { DriveModule } from './drive/drive.module';

@Module({
  imports: [
    AuthenticationModule,
    ActionModule,
    JwtModule.register({ global: true }),
    ActionModule,
    DriveModule,
    EventEmitterModule.forRoot()
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
