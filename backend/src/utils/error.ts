import { Response } from 'express';

export const error = (res: Response, code: any, err: any) =>
  res.status(code).json({ message: err });

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SECRET: string;
      ENVIRONMENT?: string;
    }
  }
}
