import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';

export class UserDto implements Omit<User, 'password'> {
  @ApiProperty({ example: 'John' })
  name: string;

  @ApiProperty({ example: 'Doe' })
  surname: string;

  @ApiProperty({ type: String, nullable: true, example: null, required: false })
  middlename: string | null;

  @ApiProperty({ example: 'JohnDoe1221@example.com' })
  email: string;

  @ApiProperty({ type: String, nullable: true, example: null, required: false })
  username: string | null;

  @ApiProperty({ example: false })
  is_confirmed: boolean;
}
