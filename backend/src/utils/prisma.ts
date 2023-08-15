import { PrismaClient } from '@prisma/client';
{ /**
Creating a global instance of PrismaClient to avoid multiple instances of
 PrismaClient being created during hot-reloading
**/
}
let db: PrismaClient;

declare global {
  var __db: PrismaClient | undefined;
}

if (!global.__db) {
  global.__db = new PrismaClient();
}

db = global.__db;

export { db };
