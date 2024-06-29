import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { ChildFileDto } from '../../entities/file.dto';
import { ChildFolderDto, FolderDto } from '../../entities/folder.dto';

export class GetFolderRequestDto {
  @IsString()
  @ApiProperty({ example: 'V1StGXR8_Z5jdHi6B-myT' })
  id: string;

  email: string;
}

export class GetFolderResponseDto {
  @ApiProperty()
  folder: FolderDto;

  @ApiProperty({
    type: [ChildFolderDto, ChildFileDto],
    example: [
      {
        id: 'Y3kGXR8_Z5jdHi6B-myT',
        name: 'Games',
        parent_folder_id: 'SbkGXR8_Z5jdHi6B-myT',
        type: 'folder'
      } as ChildFolderDto,
      {
        file_path: 'https://domain_name/folders/file_name',
        id: 'Y3kGXR8_Z5jdHi6B-myT',
        name: 'file_name',
        parent_folder_id: 'SbkGXR8_Z5jdHi6B-myT',
        type: 'file'
      } as ChildFileDto
    ]
  })
  readonly children: (ChildFolderDto | ChildFileDto)[];
}
