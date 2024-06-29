import { ApiProperty } from '@nestjs/swagger';
import { Folder } from '@prisma/client';

export class FolderDto implements Omit<Folder, 'user_email' | 'is_root'> {
  @ApiProperty({ example: 'Y7tsXgR5_Z5jdHi6Bbaty' })
  id: string;
  @ApiProperty({ example: 'Games' })
  name: string;
  @ApiProperty({ example: 'V1StGXR8_Z5jdHi6B-myT' })
  parent_folder_id: string;
}

export class ChildFolderDto extends FolderDto {
  @ApiProperty({ example: 'folder' })
  readonly type = 'folder';
}
