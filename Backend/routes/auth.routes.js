
import express from "express";
const authRouter = express.Router();
import {signup, signin, signout} from "../controllers/auth.controller.js";

authRouter.post('/signup', signup);
authRouter.post('/signin', signin);
authRouter.post('/signout', signout);

export default authRouter;