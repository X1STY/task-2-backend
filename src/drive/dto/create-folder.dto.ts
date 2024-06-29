import { ApiProperty } from '@nestjs/swagger';
import { IsString, NotEquals } from 'class-validator';
import { FolderDto } from '../entities/folder.dto';

export class CreateFolderRequestDto {
  @IsString()
  @NotEquals('root')
  @ApiProperty({ example: 'Games' })
  name: string;

  @IsString()
  @ApiProperty({ example: 'V1StGXR8_Z5jdHi6B-myT' })
  parent_id: string;
  email: string;
}

export class CreateFolderResponseDto {
  @ApiProperty()
  folder: FolderDto;
}
