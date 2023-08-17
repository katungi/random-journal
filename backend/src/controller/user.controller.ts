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
  console.log(req.body);
  try {
    const user = await db.user.findUnique({ where: { email: req.body.email } });
    console.log('User', user);
    if (user) {
      // const matches = await verifyPassword(req.body.password, user?.password);
      // if (!matches) return error(res, 401, 'Invalid credentials');
      const token = await generateAuthToken(user?.id);
      res.cookie('token', token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        path: '/',
      });
      res.status(200).json({ token, user });
    }
  } catch (e) {
    error(res, 500, e.message);
  }
}

export async function autoLogin(req: Request, res: Response) {
  const cookie = req.headers.cookie;
  if (!cookie || cookie === null) {
    return res.sendStatus(401);
  }
  return res.sendStatus(200);
}
