import { ApiProperty } from '@nestjs/swagger';

export class BadRequestErrorDto {
  @ApiProperty({ example: 400 })
  statusCode: number;

  @ApiProperty({
    example: ['Email must be an email', 'Password must be a string', 'Invalid credentials']
  })
  message: string[];

  @ApiProperty({ example: 'Bad Request' })
  error: string;
}

export class UnauthorizedErrorDto {
  @ApiProperty({ example: 401 })
  statusCode: number;

  @ApiProperty({ example: ['Invalid token'] })
  message: string;

  @ApiProperty({ example: 'Unauthorized' })
  error: string;
}

export class ForbiddenErrorDto {
  @ApiProperty({ example: 403 })
  statusCode: number;

  @ApiProperty({ example: ['Forbidden'] })
  message: string;

  @ApiProperty({ example: 'Forbidden' })
  error: string;
}
