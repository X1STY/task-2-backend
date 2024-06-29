import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class DeleteFileDto {
  @IsString()
  @ApiProperty({ example: 'V1StGXR8_Z5jdHi6B-myT' })
  id: string;
  email: string;
}
