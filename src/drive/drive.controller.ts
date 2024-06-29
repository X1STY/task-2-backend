import { Body, Controller, Get, HttpCode, Param, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiTags
} from '@nestjs/swagger';
import { RequestWithEmail } from '@types';
import { AccessGuard } from 'src/authentication/guard/access.guard';
import { BadRequestErrorDto, ForbiddenErrorDto } from 'src/error/dto/error.dto';
import { DriveService } from './drive.service';
import { CreateFolderRequestDto, CreateFolderResponseDto } from './dto/create-folder.dto';
import { GetFolderRequestDto, GetFolderResponseDto } from './dto/get-folder.dto';

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
  @HttpCode(201)
  @Post('folder')
  async createFolder(
    @Body() { name, parent_id }: CreateFolderRequestDto,
    @Req() request: RequestWithEmail
  ): Promise<CreateFolderResponseDto> {
    const { email } = request;
    return await this.driveService.createFolder({ name, parent_id, email });
  }
}
