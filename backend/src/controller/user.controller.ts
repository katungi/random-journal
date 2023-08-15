import { NextFunction, Request, Response } from 'express';
import { error } from '../utils/error';
import { db } from '../utils/prisma';
import { generateAuthToken, verifyPassword } from '../utils/encryption';

export async function register(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // we can do these using zod validation later
    const userExists = await db.user.findUnique({
      where: { email: req.body.email },
    });
    const usernameExists = await db.user.findUnique({
      where: { username: req.body.username },
    });

    if (userExists)
      return error(res, 400, 'User with this email already exists');
    if (usernameExists)
      return error(res, 400, 'User with this username already exists');

    const user = await db.user.create({
      data: req.body,
    });

    // generate a token
    const token = generateAuthToken(user.id);
    res.status(201).json({ token, user });
  } catch (error) {
    error(res, 500, error.message);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await db.user.findUnique({ where: { email: req.body.email } });
    if (user) {
      const matches = await verifyPassword(req.body.password, user?.password);
      if (!matches) return error(res, 401, 'Invalid credentials');
      const token = generateAuthToken(user?.id);
      res.status(200).json({ token, user });
    }
  } catch (e) {
    error(res, 500, e.message);
  }
}
