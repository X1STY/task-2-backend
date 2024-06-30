import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  PartialType
} from '@nestjs/swagger';
import { RequestWithEmail } from '@types';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AccessGuard } from 'src/authentication/guard/access.guard';
import {
  BadRequestErrorDto,
  ForbiddenErrorDto,
  UnauthorizedErrorDto
} from 'src/error/dto/error.dto';
import { DriveService } from './drive.service';
import { DeleteFileDto } from './dto/file/delete-file.dto';
import { UploadFileDto, UploadFileResponseDto } from './dto/file/upload-file.dto';
import { CreateFolderRequestDto, CreateFolderResponseDto } from './dto/folder/create-folder.dto';
import { GetFolderRequestDto, GetFolderResponseDto } from './dto/folder/get-folder.dto';

@ApiTags('drive')
@Controller('drive')
export class DriveController {
  constructor(private readonly driveService: DriveService) {}

  @ApiBearerAuth()
  @UseGuards(AccessGuard)
  @ApiOkResponse({
    type: GetFolderResponseDto
  })
  @ApiForbiddenResponse({ type: ForbiddenErrorDto })
  @ApiBadRequestResponse({ type: BadRequestErrorDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedErrorDto })
  @HttpCode(200)
  @Get('folder/:id')
  async getFolderList(
    @Req() request: RequestWithEmail,
    @Param() query: GetFolderRequestDto
  ): Promise<GetFolderResponseDto> {
    return await this.driveService.getFolder({ id: query.id, email: request.email });
  }

  @ApiBearerAuth()
  @UseGuards(AccessGuard)
  @ApiCreatedResponse({ type: CreateFolderResponseDto })
  @ApiBadRequestResponse({ type: BadRequestErrorDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedErrorDto })
  @HttpCode(201)
  @Post('folder')
  async createFolder(
    @Body() { name, parent_id }: CreateFolderRequestDto,
    @Req() request: RequestWithEmail
  ): Promise<CreateFolderResponseDto> {
    const { email } = request;
    return await this.driveService.createFolder({ name, parent_id, email });
  }

  @UseGuards(AccessGuard)
  @ApiBearerAuth()
  @ApiBody({
    type: PartialType(CreateFolderRequestDto)
  })
  @ApiOkResponse({ type: CreateFolderResponseDto })
  @ApiForbiddenResponse({ type: ForbiddenErrorDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedErrorDto })
  @ApiBadRequestResponse({ type: BadRequestErrorDto })
  @HttpCode(200)
  @Patch('folder/:id')
  async changeFolder(
    @Req() request: RequestWithEmail,
    @Param() query: GetFolderRequestDto,
    @Body() body: Partial<CreateFolderRequestDto>
  ): Promise<CreateFolderResponseDto> {
    const { email } = request;
    return await this.driveService.changeFolder(
      { email: email, name: body.name, parent_id: body.parent_id },
      query.id
    );
  }

  @UseGuards(AccessGuard)
  @ApiBearerAuth()
  @ApiOkResponse()
  @ApiForbiddenResponse({ type: ForbiddenErrorDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedErrorDto })
  @ApiBadRequestResponse({ type: BadRequestErrorDto })
  @HttpCode(200)
  @Delete('folder/:id')
  async deleteFolder(@Req() request: RequestWithEmail, @Param() query: GetFolderRequestDto) {
    const { email } = request;
    return await this.driveService.deleteFolder({ email, id: query.id });
  }

  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        parent_folder_id: { type: 'string' },
        file: {
          type: 'string',
          format: 'binary'
        }
      }
    },
    required: true
  })
  @UseGuards(AccessGuard)
  @ApiOkResponse({ type: UploadFileResponseDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedErrorDto })
  @ApiForbiddenResponse({ type: ForbiddenErrorDto })
  @ApiBadRequestResponse({ type: BadRequestErrorDto })
  @HttpCode(200)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './drive-storage',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const fileName = `${uniqueSuffix}${ext}`;
          cb(null, fileName);
        }
      })
    })
  )
  @Post('file')
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Req() requset: RequestWithEmail,
    @Body() body: UploadFileDto
  ): Promise<UploadFileResponseDto> {
    return await this.driveService.uploadFile({
      email: requset.email,
      parent_folder_id: body.parent_folder_id,
      file
    });
  }

  @ApiBearerAuth()
  @UseGuards(AccessGuard)
  @ApiOkResponse()
  @ApiForbiddenResponse({ type: ForbiddenErrorDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedErrorDto })
  @ApiBadRequestResponse({ type: BadRequestErrorDto })
  @HttpCode(200)
  @Delete('file/:id')
  async deleteFile(@Req() requst: RequestWithEmail, @Param() query: DeleteFileDto) {
    return await this.driveService.deleteFile({ email: requst.email, id: query.id });
  }
}
