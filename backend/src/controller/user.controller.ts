import { NextFunction, Request, Response } from 'express';
import { error } from '../utils/error';
import { db } from '../utils/prisma';
import { generateAuthToken, verifyPassword } from '../utils/encryption';

/**
 * The `register` function is responsible for creating a new user in the database, checking if the
 * email and username already exist, and generating an authentication token for the user.
 * @param {Request} req - The `req` parameter represents the HTTP request object, which contains
 * information about the incoming request such as the request headers, request body, and request
 * parameters.
 * @param {Response} res - The `res` parameter is the response object that is used to send the response
 * back to the client. It contains methods and properties that allow you to set the response status,
 * headers, and body.
 * @param {NextFunction} next - The `next` parameter is a function that is used to pass control to the
 * next middleware function in the request-response cycle. It is typically used when you want to pass
 * control to the next middleware function after completing some operations in the current middleware
 * function.
 * @returns a JSON response with a token and user object if the registration is successful. If there is
 * an error, it will return an error response with a status code and error message.
 */
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

/**
 * The login function is an asynchronous function that handles user login by finding the user with the
 * provided email, generating an authentication token, and sending it back to the client along with the
 * user information.
 * @param {Request} req - The `req` parameter represents the HTTP request object, which contains
 * information about the incoming request such as headers, query parameters, and request body.
 * @param {Response} res - The `res` parameter is the response object that is used to send the response
 * back to the client. It contains methods and properties that allow you to set the response status,
 * headers, and body.
 * @param {NextFunction} next - The `next` parameter is a function that is used to pass control to the
 * next middleware function in the request-response cycle. It is typically used when you want to
 * delegate the handling of the request to the next middleware function.
 */
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

/**
 * The function `autoLogin` checks if a cookie is present in the request headers and returns a status
 * code of 200 if it exists, or 401 if it doesn't.
 * @param {Request} req - The `req` parameter is an object that represents the HTTP request made by the
 * client. It contains information such as the request headers, request method, request URL, request
 * body, etc. In this case, we are accessing the `headers` property of the `req` object to get the
 * value
 * @param {Response} res - The `res` parameter is an instance of the `Response` object, which
 * represents the HTTP response that will be sent back to the client. It is used to send the response
 * status code and any data or headers that need to be included in the response.
 * @returns a response with a status code of 401 if the cookie is missing or null, and a response with
 * a status code of 200 otherwise.
 */
export async function autoLogin(req: Request, res: Response) {
  const cookie = req.headers.cookie;
  if (!cookie || cookie === null) {
    return res.sendStatus(401);
  }
  return res.sendStatus(200);
}
