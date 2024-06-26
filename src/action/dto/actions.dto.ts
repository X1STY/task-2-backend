import { IsOptional, IsString, Matches, MinLength } from 'class-validator';

export class ActionQueryDto {
  @IsString()
  type: string;

  @IsString()
  token: string;
}

export class ActionBodyDto {
  @IsString()
  @IsOptional()
  @MinLength(8)
  @Matches(/^(?=.*[A-Z].*)(?=.*[a-z].*)(?=.*\d)(?=.*[!@#$%^&*()]).{8,}$/, {
    message:
      'Password should contain: at least one uppercase letter, one lowercase letter, one number and one special character',
  })
  newPassword: string;
}
