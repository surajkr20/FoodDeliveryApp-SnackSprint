
import express from "express";
const authRouter = express.Router();
import {signup, signin, signout, SendOtp, verifyOtp, resetPassword, googleAuth} from "../controllers/auth.controller.js";

authRouter.post('/signup', signup);
authRouter.post('/signin', signin);
authRouter.get('/signout', signout);
authRouter.post('/send-otp', SendOtp);
authRouter.post('/verify-otp', verifyOtp);
authRouter.post('/reset-password', resetPassword);
authRouter.post('/google-auth', googleAuth);

export default authRouter;