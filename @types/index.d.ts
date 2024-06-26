import { Request } from 'express';

type RequestWithEmail = Request & {
  email: string;
};
