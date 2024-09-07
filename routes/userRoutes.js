import express from 'express';
import {authUser, registerUser, logoutUser, getUserProfile, updateUserProfile, getAllUsers, deleteUser} from '../controllers/userController.js';
import {authMiddleware, isAdmin} from '../middleware/authMiddleware.js';
// - **POST /api/users** - Register a user
// - **POST /api/users/auth** - Authenticate a user and get token
// - **POST /api/users/logout** - Logout user and clear cookie
// - **GET /api/users/profile** - Get user profile
// - **PUT /api/users/profile** - Update profile

const router = express.Router();


router.post('/', registerUser);
router.post('/auth', authUser);
router.post('/logout', authMiddleware, logoutUser);
router.get('/profile/:id', authMiddleware, getUserProfile);
router.put('/profile',  authMiddleware, updateUserProfile);
router.get('/all-users', authMiddleware, isAdmin, getAllUsers)
router.delete('/:id', authMiddleware, deleteUser);
// router.post('/googleAuth', googleAuthUser);
// router.post('/', sendRegisterMail);
// router.post('/generateOTP', generateOTP);
// router.post('/verifyOTP', verifyOTP);
// router.post('/sms/generateOTP', generateSMSOTP);
// router.post('/sms/verifyOTP', verifySMSOTP);
// router.post('/resetPassword', resetPassword);


export default router;
