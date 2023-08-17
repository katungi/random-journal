import { error } from '../utils/error';
import { NextFunction, Request, Response } from 'express';
import { db } from '../utils/prisma';
import { addDays } from 'date-fns';
import { distributeJournalEntries } from '../utils/smtp';

export async function createJot(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    console.log('Jot::', req.body);
    const journal = await db.journal.create({
      data: {
        title: req.body.title,
        content: req.body.content,
        user: {
          connect: {
            id: req.body.user,
          },
        },
      },
    });
    // distributeJournals();
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
    console.log('Jot::', req.params.id);
    const journal = await db.journal.findUnique({
      where: {
        id: Number(req.params.id),
      },
    });
    console.log(journal);
    res.status(200).json(journal);
  } catch (e) {
    error(res, 500, e.message);
  }
}

export async function distributeJournals() {
  const yesterday = addDays(new Date(), -1);

  // 1. Fetch all users who posted in the last 24 hours.
  const usersWithRecentJournals = await db.journal.findMany({
    where: {
      createdAt: {
        gte: yesterday,
      },
    },
    select: {
      userId: true,
    },
  });

  const userIds = [
    ...new Set(usersWithRecentJournals.map((journal) => journal.userId)),
  ];

  // 2. For each user, fetch the latest journal entry.
  const latestJournals: any = [];
  for (let userId of userIds) {
    const latestJournal = await db.journal.findFirst({
      where: {
        userId: userId,
        createdAt: {
          gte: yesterday,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: { id: true, userId: true, title: true, content: true },
    });
    console.log('Latest journal:', latestJournal)
    if (latestJournal) {
      latestJournals.push(latestJournal);
    }
  }

  // If there are less than 2 entries, distribution isn't possible
  if (latestJournals.length < 2) {
    return;
  }

  // 3. Shuffle the array of latest journal entries.
  const shuffledJournals = [...latestJournals].sort(() => 0.5 - Math.random());

  console.log('Shuffled journals:', shuffledJournals)
  // 4. Distribute each journal to a different user.
  for (let i = 0; i < latestJournals.length; i++) {
    const currentJournal = latestJournals[i];
    let recipientJournal = shuffledJournals[i];

    // Ensure the recipient journal isn't from the current user
    while (currentJournal.userId === recipientJournal.userId) {
      recipientJournal = shuffledJournals[(i + 1) % shuffledJournals.length];
    }

    sendJournalToUser(currentJournal, recipientJournal.userId);
  }
}

async function sendJournalToUser(journal: any, userId: number) {
  console.log('Sending journal to user with ID:', userId);
  const user = await db.user.findUnique({
    where: { id: userId },
  });
  const url = `${process.env.CLIENT_URL}/jots/${journal.id}`;
  const identifier = user?.email;
  const payload = { identifier, url };
  distributeJournalEntries(payload);
  console.log(
    `Sent journal titled "${journal.title}" to user with ID: ${userId}`
  );
}
