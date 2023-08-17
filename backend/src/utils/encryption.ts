import jwt, { Secret } from 'jsonwebtoken';
import bcrypt from 'bcrypt';

/**
 * The function generates an authentication token using a payload and a secret key.
 * @param {number | undefined} id - The `id` parameter is a number that represents the user's ID. It is
 * optional and can be either a number or undefined.
 * @returns a JWT (JSON Web Token) as a string.
 */
export async function generateAuthToken(id: number | undefined) {
  const payload: string = `${Date.now()}-${id}`;
  const secret: Secret = process.env.JWT_SECRET || 'secret' + Math.random().toString();
  const token = jwt.sign(payload, secret);
  return token;
}

/**
 * The function `hashPassword` takes a password as input, generates a random number of rounds, and
 * returns the hashed password using bcrypt.
 * @param {string} password - The `password` parameter is a string that represents the password that
 * needs to be hashed.
 * @returns a promise that resolves to the hashed password.
 */
export async function hashPassword(password: string) {
  const round = Math.floor(Math.random() * 10) + 1;
  return bcrypt.hash(password, round);
}

/**
 * The function verifies if a given password matches a given hash using bcrypt.
 * @param {string} password - The `password` parameter is a string that represents the plain text
 * password that needs to be verified.
 * @param {string} hash - The `hash` parameter is a string that represents the hashed password. It is
 * typically generated using a hashing algorithm like bcrypt.
 * @returns the result of the bcrypt.compare() function, which is a Promise that resolves to a boolean
 * value indicating whether the password matches the hash.
 */
export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}
