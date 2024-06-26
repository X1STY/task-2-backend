import { IsString, IsEmail, MinLength, MaxLength } from 'class-validator';

export class SignInDto {
  @IsEmail()
  @MinLength(2)
  @MaxLength(255)
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}
