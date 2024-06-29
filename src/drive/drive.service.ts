import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { nanoid } from 'nanoid';
import { PrismaService } from 'src/services/prisma.service';
import { USER_REGISTERED_EVENT } from 'src/utils/constants';
import { CreateFolderRequestDto, CreateFolderResponseDto } from './dto/create-folder.dto';
import { GetFolderRequestDto, GetFolderResponseDto } from './dto/get-folder.dto';
import { ChildFileDto } from './entities/file.dto';
import { ChildFolderDto } from './entities/folder.dto';

@Injectable()
export class DriveService {
  constructor(private readonly prisma: PrismaService) {}

  async getFolder({ email, id }: GetFolderRequestDto): Promise<GetFolderResponseDto> {
    const whereObj =
      id === 'root' ? { user_email: email, is_root: true } : { user_email: email, id: id };

    const folder = await this.prisma.folder
      .findFirst({
        where: whereObj,
        select: {
          ChildFolders: true,
          ChildFiles: true,
          id: true,
          name: true,
          parent_folder_id: true,
          user_email: true
        }
      })
      .then((folder) => {
        return {
          ...folder!,
          ChildFolders:
            folder?.ChildFolders.filter(
              (childFolder) => childFolder.id !== childFolder.parent_folder_id
            ) || []
        };
      });

    if (!folder) {
      throw new BadRequestException(['Folder not found']);
    }

    if (folder.user_email !== email) {
      throw new ForbiddenException(["User don't have permission to access folder"]);
    }

    return {
      folder: { id: folder.id, name: folder.name, parent_folder_id: folder.parent_folder_id },
      children: [
        ...folder.ChildFolders.map(
          (childFolder) =>
            ({
              id: childFolder.id,
              parent_folder_id: childFolder.parent_folder_id,
              name: childFolder.name,
              type: 'folder'
            }) as ChildFolderDto
        ),
        ...folder.ChildFiles.map(
          (childFile) =>
            ({
              id: childFile.id,
              file_path: childFile.file_path,
              name: childFile.name,
              type: 'file'
            }) as ChildFileDto
        )
      ]
    };
  }

  async createFolder({
    email,
    name,
    parent_id
  }: CreateFolderRequestDto): Promise<CreateFolderResponseDto> {
    const isFolderExists = await this.prisma.folder.findFirst({
      where: {
        name: name,
        user_email: email,
        parent_folder_id: parent_id
      }
    });
    if (isFolderExists) {
      throw new BadRequestException(['Folder already exists']);
    }

    const isParentFolderValid = await this.prisma.folder.findFirst({
      where: {
        id: parent_id
      }
    });

    if (!isParentFolderValid) {
      throw new BadRequestException(['Parent folder does not exist']);
    }

    const id = nanoid();
    const response = await this.prisma.folder.create({
      data: {
        name: name,
        user_email: email,
        id: id,
        parent_folder_id: parent_id
      }
    });

    return {
      folder: {
        id: response.id,
        name: response.name,
        parent_folder_id: response.parent_folder_id
      }
    };
  }

  async changeFolder({ email }: Partial<CreateFolderRequestDto>) {}

  @OnEvent(USER_REGISTERED_EVENT)
  async createRootFolder({ email }: { email: string }) {
    const id = nanoid();
    await this.prisma.folder.create({
      data: {
        name: 'root',
        user_email: email,
        id: id,
        parent_folder_id: id,
        is_root: true
      }
    });
  }
}
