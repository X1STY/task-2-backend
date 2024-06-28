import { User } from '@prisma/client';

export class RegisterRootFolderDto implements Pick<User, 'email'> {
  email: string;
  constructor(email: string) {
    this.email = email;
  }
}
