import express from 'express';
import { sendNotifications } from '../controllers/notificationController.js';
// - **POST /api/cities** - Register a city
// - **GET /api/cities/district** - Get city list

const router = express.Router();


router.post('/', sendNotifications);

export default router;
