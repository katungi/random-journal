import express from 'express';
import {
  createJot,
  getJots,
  getJotById,
  distributeJournals,
  getJotsByUser,
} from '../controller/jot.controller';

const router = express.Router();

/* `router.post('/api/jot', createJot);` is defining a route for handling HTTP POST requests to the
'/api/jot' endpoint. When a POST request is made to this endpoint, the `createJot` function from the
`jot.controller` module will be called to handle the request. */
router.post('/api/jot', createJot);

/* `router.get('/api/jot/:id', getJotById);` is defining a route for handling HTTP GET requests to the
'/api/jot/:id' endpoint. */
router.get('/api/jot/:id', getJotById);

/* `router.get('/api/jot/user/:id', getJotsByUser);` is defining a route for handling HTTP GET requests
to the '/api/jot/user/:id' endpoint. */
router.get('/api/jot/user/:id', getJotsByUser);

/* `router.get('/api/jot', getJots);` is defining a route for handling HTTP GET requests to the
'/api/jot' endpoint. When a GET request is made to this endpoint, the `getJots` function from the
`jot.controller` module will be called to handle the request. */
router.get('/api/jot', getJots);

/* `router.get('/api/random', distributeJournals);` is defining a route for handling HTTP GET requests
to the '/api/random' endpoint. When a GET request is made to this endpoint, the `distributeJournals`
function from the `jot.controller` module will be called to handle the request. */
router.get('/api/random', distributeJournals);

export default router;
