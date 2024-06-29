import { ApiProperty } from '@nestjs/swagger';
import { File } from '@prisma/client';

export class FileDto implements Omit<File, 'user_email' | 'parent_folder_id'> {
  @ApiProperty({ example: 'Y7tsXgR5_Z5jdHi6Bbaty' })
  id: string;
  @ApiProperty({ example: 'Path of Exile.exe' })
  name: string;
  @ApiProperty({ example: 'https://domain_name/folders/Path of Exile.exe' })
  file_path: string;
}

export class ChildFileDto extends FileDto {
  @ApiProperty({ example: 'file' })
  readonly type = 'file' as const;
}
