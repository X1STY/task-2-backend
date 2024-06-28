import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { UserDto } from 'src/user/user.dto';
export class SignInDto {
  @IsEmail()
  @MinLength(2)
  @MaxLength(255)
  @ApiProperty({ example: 'as1as23d@asd.com' })
  email: string;

  @IsString()
  @MinLength(8)
  @ApiProperty({ example: 'asasddSs21321#' })
  password: string;
}

export class SignInResponseDto {
  @ApiProperty()
  user: UserDto;

  @ApiProperty()
  accessToken: string;
}
