import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthenticationModule } from './authentication/authentication.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [AuthenticationModule, JwtModule.register({ global: true })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
