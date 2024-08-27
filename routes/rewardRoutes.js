import express from 'express';
import {authMiddleware, isAdmin, isDriver, isResident} from '../middleware/authMiddleware.js';
import { addReview } from '../controllers/rewardController.js';

const router = express.Router();

router.post('/review', authMiddleware, isResident, addReview);

export default router;