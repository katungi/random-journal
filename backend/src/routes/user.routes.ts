import express from 'express';
import { autoLogin, login, register } from '../controller/user.controller';

const router = express.Router();

router.post('/api/auth/register', register);

router.post('/api/auth/login', login);

router.get('/api/auth/autologin', autoLogin);

router.get('/api/auth/logout', (req, res) => {
  console.log('logout');
});

export default router;
