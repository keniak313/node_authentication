import { Router } from "express";

export const indexRouter = Router();
import * as indexController from '../controllers/indexController.js'

indexRouter.get("/", indexController.indexGet)
indexRouter.post('/post-message', indexController.messagePost)
