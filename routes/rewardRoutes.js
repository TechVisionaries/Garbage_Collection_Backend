import express from 'express';
import {authMiddleware, isAdmin, isDriver, isResident} from '../middleware/authMiddleware.js';
import { addReview, deleteReview, getAllDriverPoints, getAllReviews, getDriverPoints, getUserReviews, resetDriverPoints, updateReview,  } from '../controllers/rewardController.js';

const router = express.Router();

//Resident
router.post("/review", authMiddleware, isResident, addReview);
router.get("/reviews", authMiddleware, isAdmin, getAllReviews);
router.put("/review/:reviewId", authMiddleware, isResident, updateReview);
router.delete("/review/:reviewId", authMiddleware, isResident, deleteReview);
router.get("/reviews/user", authMiddleware, isResident, getUserReviews);

//Admin
router.get("/drivers/points", authMiddleware, isAdmin, getAllDriverPoints);
router.put("/drivers/resetpoints", authMiddleware, isAdmin, resetDriverPoints);

//driver
router.get("/driver/points", authMiddleware, isDriver, getDriverPoints);

export default router;