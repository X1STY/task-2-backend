import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthenticationModule } from './authentication/authentication.module';
import { JwtModule } from '@nestjs/jwt';
import { ActionModule } from './action/action.module';

@Module({
  imports: [
    AuthenticationModule,
    ActionModule,
    JwtModule.register({ global: true }),
    ActionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
