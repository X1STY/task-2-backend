import { ApiProperty } from '@nestjs/swagger';

import { IsEmail, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { UserDto } from 'src/user/user.dto';

export class SignUpRequestDto {
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  @ApiProperty({ example: 'John' })
  name: string;

  @IsString()
  @MinLength(2)
  @MaxLength(255)
  @ApiProperty({ example: 'Doe' })
  surname: string;

  @IsString()
  @MinLength(2)
  @MaxLength(255)
  @IsOptional()
  @ApiProperty({ type: String, nullable: true, example: null, required: false })
  middlename: string | null;

  @IsEmail()
  @MinLength(2)
  @MaxLength(255)
  @ApiProperty({ example: 'JohnDoe1221@example.com' })
  email: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(15)
  @ApiProperty({ type: String, nullable: true, example: null, required: false })
  username: string | null;

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[A-Z].*)(?=.*[a-z].*)(?=.*\d)(?=.*[!@#$%^&*()]).{8,}$/, {
    message:
      'Password should contain: at least one uppercase letter, one lowercase letter, one number and one special character'
  })
  @ApiProperty({ example: 'Qwerty123!' })
  password: string;
}

export class SignUpResponseDto {
  @ApiProperty()
  user: UserDto;
}
