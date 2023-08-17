import cors from 'cors';
import express from 'express';
import cron from 'node-cron';
import UserRoutes from './routes/user.routes';
import JournalRoutes from './routes/jot.routes';
import { distributeJournals } from './controller/jot.controller';

require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use(UserRoutes);
app.use(JournalRoutes);

cron.schedule('0 12 * * *', async () => {
  console.log('[CRON]: Running the journal distribution task...');
  try {
    await distributeJournals();
    console.log('[CRON]: Successfully distributed the journals.');
  } catch (error) {
    console.error('[CRON]: Error in distributing journals:', error);
  }
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
