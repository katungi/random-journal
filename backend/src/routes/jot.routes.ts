import express from 'express'
import { createJot, getJots, getJotById } from '../controller/jot.controller'

const router = express.Router()

router.post('/api/jot', createJot)

router.post('/api/jot/:id', getJotById)

router.get('/api/jot', getJots)

export default router