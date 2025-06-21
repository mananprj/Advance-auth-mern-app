import express from 'express';
import { login, logout, signup, verifyemail, forgotpassword, resetpassword, checkauth } from '../controllers/auth.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

router.get('/check-auth', verifyToken, checkauth);

router.post('/signup', signup);

router.post('/login', login);

router.post('/logout', logout);

router.post('/verify-email', verifyemail);

router.post('/forgot-password', forgotpassword);

router.post('/reset-password/:token', resetpassword);

export { router as authRoutes };