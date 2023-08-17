import { error } from '../utils/error';
import { NextFunction, Request, Response } from 'express';
import { db } from '../utils/prisma';
import { addDays } from 'date-fns';
import { distributeJournalEntries } from '../utils/smtp';

/**
 * The above function creates a new journal entry (jot) with the provided title, content, and user ID,
 * and returns the created journal entry as a JSON response.
 * @param {Request} req - The `req` parameter is an object that represents the HTTP request made to the
 * server. It contains information such as the request headers, request body, request method, and
 * request URL.
 * @param {Response} res - The `res` parameter is the response object that is used to send the response
 * back to the client. It contains methods and properties for manipulating the response, such as
 * setting the status code and sending JSON data.
 * @param {NextFunction} next - The `next` parameter is a function that is used to pass control to the
 * next middleware function in the request-response cycle. It is typically used in Express.js to handle
 * errors or to move on to the next middleware function in the chain.
 * @returns a JSON response with the created journal object if the creation is successful. If there is
 * an error, it will return an error response with a status code of 500 and the error message. If the
 * error code is 'P2002' and the target includes 'userId', it will return a 400 response with the
 * message 'Invalid userId provided.'
 */
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

/**
 * The function `getJots` retrieves all journals from the database and sends them as a JSON response.
 * @param {Request} req - The `req` parameter represents the HTTP request object, which contains
 * information about the incoming request such as headers, query parameters, and request body.
 * @param {Response} res - The `res` parameter is the response object that is used to send the response
 * back to the client. It contains methods and properties that allow you to set the response status,
 * headers, and body. In this code snippet, `res.status(200)` sets the response status to 200 (OK
 * @param {NextFunction} next - The `next` parameter is a function that is used to pass control to the
 * next middleware function in the request-response cycle. It is typically used when you want to
 * delegate the handling of the current request to the next middleware function.
 */
export async function getJots(req: Request, res: Response, next: NextFunction) {
  try {
    const journals = await db.journal.findMany();
    console.log(journals);
    res.status(200).json(journals);
  } catch (e) {
    error(res, 500, e.message);
  }
}

/**
 * The function `getJotById` retrieves a journal entry by its ID and sends it as a JSON response.
 * @param {Request} req - The `req` parameter represents the HTTP request object, which contains
 * information about the incoming request such as the request headers, query parameters, and request
 * body.
 * @param {Response} res - The `res` parameter is the response object that is used to send the response
 * back to the client. It contains methods and properties that allow you to control the response, such
 * as setting the status code and sending JSON data.
 * @param {NextFunction} next - The `next` parameter is a function that is used to pass control to the
 * next middleware function in the request-response cycle. It is typically used when you want to
 * delegate the handling of the current request to the next middleware function.
 */
export async function getJotById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    console.log('Jot::', req.params.id);
    const journal = await db.journal.findUnique({
      where: {
        id: parseInt(req.params.id),
      },
    });
    console.log(journal);
    res.status(200).json(journal);
  } catch (e) {
    error(res, 500, e.message);
  }
}


/**
 * The function `getJotsByUser` retrieves journals by user ID and sends them as a response.
 * @param {Request} req - The `req` parameter is an object that represents the HTTP request made to the
 * server. It contains information such as the request method, headers, query parameters, and request
 * body.
 * @param {Response} res - The `res` parameter is the response object that is used to send the response
 * back to the client. It contains methods and properties for manipulating the response, such as
 * setting the status code and sending JSON data.
 * @param {NextFunction} next - The `next` parameter is a function that is used to pass control to the
 * next middleware function in the request-response cycle. It is typically used when you want to
 * delegate the handling of the current request to the next middleware function.
 */
export async function getJotsByUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    console.log('Jot::', req.params.id);
    const journals = await db.journal.findMany({
      where: {
        userId: parseInt(req.params.id),
      },
    });
    console.log(journals);
    res.status(200).json(journals);
  } catch (e) {
    error(res, 500, e.message);
  }
}

/**
 * The `distributeJournals` function fetches the latest journal entries from users who posted in the
 * last 24 hours, shuffles the entries, and distributes each journal to a different user.
 * @returns The function does not explicitly return anything. If the condition `latestJournals.length <
 * 2` is met, the function will exit without returning anything.
 */

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

/**
 * The function sends a journal to a user by finding the user's email and generating a URL for the
 * journal, and then distributing the journal entries to the user.
 * @param {any} journal - The `journal` parameter is an object that represents a journal entry. It
 * contains properties such as `id` (the unique identifier of the journal), and `title` (the title of
 * the journal).
 * @param {number} userId - The `userId` parameter is the unique identifier of the user to whom the
 * journal will be sent.
 */
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
