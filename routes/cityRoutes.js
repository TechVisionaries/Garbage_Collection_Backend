import express from 'express';
import {createCity, getallcities} from '../controllers/cityController.js';
// - **POST /api/cities** - Register a city
// - **GET /api/cities/district** - Get city list

const router = express.Router();


router.post('/', createCity);
router.get('/citylist/:district', getallcities);

export default router;
