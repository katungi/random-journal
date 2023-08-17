import express from 'express';
import { autoLogin, login, register } from '../controller/user.controller';

const router = express.Router();

/* `router.post('/api/auth/register', register);` is defining a route for handling a POST request to
the '/api/auth/register' endpoint. When a POST request is made to this endpoint, the `register`
function from the 'user.controller' module will be called to handle the request. */
router.post('/api/auth/register', register);

/* `router.post('/api/auth/login', login);` is defining a route for handling a POST request to the
'/api/auth/login' endpoint. When a POST request is made to this endpoint, the `login` function from
the 'user.controller' module will be called to handle the request. */
router.post('/api/auth/login', login);

/* `router.get('/api/auth/autologin', autoLogin);` is defining a route for handling a GET request to
the '/api/auth/autologin' endpoint. When a GET request is made to this endpoint, the `autoLogin`
function from the 'user.controller' module will be called to handle the request. */
router.get('/api/auth/autologin', autoLogin);


export default router;
