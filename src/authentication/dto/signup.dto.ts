import {
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  Matches,
  IsOptional,
} from 'class-validator';

export class SignUpDto {
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  name: string;

  @IsString()
  @MinLength(2)
  @MaxLength(255)
  surname: string;

  @IsString()
  @MinLength(2)
  @MaxLength(255)
  @IsOptional()
  middlename: string | null;

  @IsEmail()
  @MinLength(2)
  @MaxLength(255)
  email: string;

  @IsString()
  @MinLength(2)
  @MaxLength(15)
  @IsOptional()
  username: string | null;

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[A-Z].*)(?=.*[a-z].*)(?=.*\d)(?=.*[!@#$%^&*()]).{8,}$/, {
    message:
      'Password should contain: at least one uppercase letter, one lowercase letter, one number and one special character',
  })
  password: string;
}
