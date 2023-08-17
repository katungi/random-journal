import jwt, { Secret } from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export async function generateAuthToken(id: number | undefined) {
  const payload: string = `${Date.now()}-${id}`;
  const secret: Secret = process.env.JWT_SECRET || 'secret' + Math.random().toString();
  const token = jwt.sign(payload, secret);
  return token;
}

export async function hashPassword(password: string) {
  const round = Math.floor(Math.random() * 10) + 1;
  return bcrypt.hash(password, round);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}
