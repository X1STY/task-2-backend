import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { FileDto } from 'src/drive/entities/file.dto';

export class UploadFileDto {
  @IsString()
  @ApiProperty({ example: 'root' })
  parent_folder_id: string;

  email: string;
  file: Express.Multer.File;
}

export class UploadFileResponseDto {
  @ApiProperty()
  file: FileDto;
}
