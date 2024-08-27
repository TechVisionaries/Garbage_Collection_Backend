import express from 'express';
import {authMiddleware, isAdmin, isDriver, isResident} from '../middleware/authMiddleware.js';
import { addReview, getAllReviews,  } from '../controllers/rewardController.js';

const router = express.Router();

router.post('/review', authMiddleware, isResident, addReview);
router.get("/reviews", authMiddleware, isAdmin, getAllReviews);


export default router;