import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { unlinkSync } from 'fs';
import { nanoid } from 'nanoid';
import { join } from 'path';
import { PrismaService } from 'src/services/prisma.service';
import { USER_REGISTERED_EVENT } from 'src/utils/constants';
import { DeleteFileDto } from './dto/file/delete-file.dto';
import { UploadFileDto, UploadFileResponseDto } from './dto/file/upload-file.dto';
import { CreateFolderRequestDto, CreateFolderResponseDto } from './dto/folder/create-folder.dto';
import { GetFolderRequestDto, GetFolderResponseDto } from './dto/folder/get-folder.dto';
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
        if (!folder) {
          return null;
        }
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
    parent_folder_id
  }: CreateFolderRequestDto): Promise<CreateFolderResponseDto> {
    if (parent_folder_id === 'root') {
      parent_folder_id = await this.prisma.folder
        .findFirst({
          where: {
            is_root: true,
            user_email: email
          }
        })
        .then((folder) => folder!.id);
    }
    const isFolderExists = await this.prisma.folder.findFirst({
      where: {
        name: name,
        user_email: email,
        parent_folder_id
      }
    });
    if (isFolderExists) {
      throw new BadRequestException(['Folder already exists']);
    }

    const isParentFolderValid = await this.prisma.folder.findFirst({
      where: {
        id: parent_folder_id
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
        parent_folder_id
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

  async changeFolder(
    { name, email, parent_folder_id }: Partial<CreateFolderRequestDto>,
    id: string
  ): Promise<CreateFolderResponseDto> {
    if (id === 'root') {
      throw new ForbiddenException(["Can't change root folder"]);
    }
    const folder = await this.prisma.folder.findFirst({
      where: {
        id: id
      },
      select: {
        user_email: true,
        parent_folder_id: true,
        id: true,
        name: true,
        ChildFolders: true
      }
    });
    if (!folder) {
      throw new BadRequestException(['Folder not found']);
    }
    if (folder.user_email !== email) {
      throw new ForbiddenException(["User don't have permission to access folder"]);
    }
    if (folder.parent_folder_id === folder.id) {
      throw new BadRequestException(['Can not change root folder']);
    }

    if (parent_folder_id) {
      const newParentFolder = await this.prisma.folder.findFirst({
        where: {
          id: parent_folder_id
        },
        select: {
          ChildFolders: true
        }
      });
      newParentFolder?.ChildFolders.map((child) => {
        if (child.name === folder.name)
          throw new BadRequestException(['Folder with same name already exists in parent']);
      });
    }
    if (name) {
      const parentFolder = await this.prisma.folder.findFirst({
        where: {
          id: folder.parent_folder_id
        },
        select: {
          ChildFolders: true
        }
      });
      parentFolder?.ChildFolders.map((child) => {
        if (child.name === name)
          throw new BadRequestException(['Folder with same name already exists']);
      });
    }

    const updatedFolder = await this.prisma.folder.update({
      where: {
        id: id
      },
      data: {
        name,
        parent_folder_id
      }
    });

    return {
      folder: {
        id: updatedFolder.id,
        name: updatedFolder.name,
        parent_folder_id: updatedFolder.parent_folder_id
      }
    };
  }

  async deleteFolder({ email, id }: GetFolderRequestDto) {
    if (id === 'root') {
      throw new ForbiddenException(["Can't delete root folder"]);
    }
    const folder = await this.prisma.folder.findFirst({
      where: {
        id: id
      }
    });
    if (!folder) {
      throw new BadRequestException(['Folder not found']);
    }
    if (folder.user_email !== email) {
      throw new ForbiddenException(["User don't have permission to access folder"]);
    }
    if (folder.parent_folder_id === folder.id) {
      throw new BadRequestException(['Can not delete root folder']);
    }
    const deleteFolderWithChild = async (folderId: string) => {
      const files = await this.prisma.file.findMany({
        where: {
          parent_folder_id: folderId
        }
      });
      for (const file of files) {
        await this.deleteFileFromEverywhere(file.id);
      }
      await this.prisma.file.deleteMany({
        where: {
          parent_folder_id: folderId
        }
      });
      const childFolders = await this.prisma.folder.findMany({
        where: {
          parent_folder_id: folderId
        }
      });
      for (const childFolder of childFolders) {
        await deleteFolderWithChild(childFolder.id);
      }
      await this.prisma.folder.delete({
        where: {
          id: folderId
        }
      });
    };
    await deleteFolderWithChild(id);
  }

  async uploadFile({
    email,
    parent_folder_id,
    file
  }: UploadFileDto): Promise<UploadFileResponseDto> {
    if (parent_folder_id === 'root') {
      parent_folder_id = await this.prisma.folder
        .findFirst({
          where: {
            is_root: true,
            user_email: email
          }
        })
        .then((folder) => folder!.id);
    }
    const folder = await this.prisma.folder.findFirst({
      where: {
        id: parent_folder_id
      }
    });
    if (!folder) {
      throw new BadRequestException(['Folder not found']);
    }
    if (folder.user_email !== email) {
      throw new ForbiddenException(["User don't have permission to access folder"]);
    }

    const uploadedFile = await this.prisma.file.create({
      data: {
        name: file.originalname,
        file_path: `/drive-storage/${file.filename}`,
        parent_folder_id,
        id: nanoid(),
        user_email: email
      }
    });
    return {
      file: {
        id: uploadedFile.id,
        name: uploadedFile.name,
        file_path: uploadedFile.file_path
      }
    };
  }

  async deleteFile({ email, id }: DeleteFileDto) {
    const file = await this.prisma.file.findFirst({
      where: {
        id: id
      }
    });
    if (!file) {
      throw new BadRequestException(['File not found']);
    }
    if (file.user_email !== email) {
      throw new ForbiddenException(["User don't have permission to access file"]);
    }
    await this.deleteFileFromEverywhere(id);
  }

  async deleteFileFromEverywhere(id: string) {
    const file = await this.prisma.file.delete({
      where: {
        id
      }
    });
    const filePath = file.file_path.split('/');
    const fullPath = join(__dirname, '../..', 'drive-storage', filePath[filePath.length - 1]);
    unlinkSync(fullPath);
  }

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
