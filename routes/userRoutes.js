import express from 'express';
// import { authUser, googleAuthUser, sendRegisterMail, registerUser, logoutUser, getUserProfile, updateUserProfile, generateOTP, verifyOTP, generateSMSOTP, verifySMSOTP, resetPassword } from '../controllers/userController.js';
import {authUser, registerUser, logoutUser, getUserProfile, updateUserProfile, getAllUsers, deleteUser} from '../controllers/userController.js';
// import { protect } from '../middleware/authMiddleware.js'
// - **POST /api/users** - Register a user
// - **POST /api/users/auth** - Authenticate a user and get token
// - **POST /api/users/logout** - Logout user and clear cookie
// - **GET /api/users/profile** - Get user profile
// - **PUT /api/users/profile** - Update profile

const router = express.Router();


router.post('/', registerUser);
router.post('/auth', authUser);
router.post('/logout', logoutUser);
router.get('/profile/:id', getUserProfile);
router.put('/profile',  updateUserProfile);
router.get('/all-users', getAllUsers)
router.delete('/:id', deleteUser);
// router.post('/googleAuth', googleAuthUser);
// router.post('/', sendRegisterMail);
// router.post('/generateOTP', generateOTP);
// router.post('/verifyOTP', verifyOTP);
// router.post('/sms/generateOTP', generateSMSOTP);
// router.post('/sms/verifyOTP', verifySMSOTP);
// router.post('/resetPassword', resetPassword);


export default router;
