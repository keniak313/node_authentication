import { Router } from "express";
import * as authController from '../controllers/authController.js'

export const authRouter = Router();

authRouter.get("/signup", authController.signUpGet);
authRouter.post("/signup", authController.signUpPost);

authRouter.get("/login", authController.logInGet);
authRouter.post('/login', authController.logInPost);

authRouter.get("/logout", authController.logOutGet);

