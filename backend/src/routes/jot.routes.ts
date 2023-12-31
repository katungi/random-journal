import express from 'express';
import {
  createJot,
  getJots,
  getJotById,
  distributeJournals,
} from '../controller/jot.controller';

const router = express.Router();

router.post('/api/jot', createJot);

router.get('/api/jot/:id', getJotById);

router.get('/api/jot', getJots);

router.get('/api/random', distributeJournals);

export default router;
