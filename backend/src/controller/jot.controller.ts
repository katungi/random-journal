import { error } from '../utils/error';
import { NextFunction, Request, Response } from 'express';
import { db } from '../utils/prisma';

export async function createJot(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    console.log("Jot::", req.body)
    const journal = await db.journal.create({ data: {
      title: req.body.title,
      content: req.body.content,
      user: {
        connect: {
          id: req.body.user
        }
      }
    } });
    res.status(201).json(journal);
  } catch (e) {
    console.log("Can't create jot:", e);
     if (e.code === 'P2002' && e.meta?.target?.includes('userId')) {
       return res.status(400).json({ e: 'Invalid userId provided.' });
     }
    error(res, 500, e.message);
  }
}

export async function getJots(req: Request, res: Response, next: NextFunction) {
  try {
    const journals = await db.journal.findMany();
    console.log(journals);
    res.status(200).json(journals);
  } catch (e) {
    error(res, 500, e.message);
  }
}

export async function getJotById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const journal = await db.journal.findUnique({
      where: {
        id: Number(req.params.id),
      },
    });
    res.status(200).json(journal);
  } catch (e) {
    error(res, 500, e.message);
  }
}
