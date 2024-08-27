import express from 'express';
import {authMiddleware, isAdmin, isDriver, isResident} from '../middleware/authMiddleware.js';
import { addReview, deleteReview, getAllReviews, getUserReviews, updateReview,  } from '../controllers/rewardController.js';

const router = express.Router();

router.post('/review', authMiddleware, isResident, addReview);
router.get("/reviews", authMiddleware, isAdmin, getAllReviews);
router.put("/review/:reviewId", authMiddleware, isResident, updateReview);
router.delete("/review/:reviewId", authMiddleware, isResident, deleteReview);
router.get("/reviews/user", authMiddleware, isResident, getUserReviews);

export default router;