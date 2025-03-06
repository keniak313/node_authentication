import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";
import * as db from "../db/queries.js";

const validateMsg = [body("message").isLength({ min: 1, max: 255 })];

export const indexGet = asyncHandler(async (req, res) => {
  const messages = await db.getAllMessages();
  res.render("index", { messages: messages });
});

export const messagePost = [
  validateMsg,
  async (req, res) => {
    const errors = validationResult(req);
    const messages = await db.getAllMessages();
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .render("index", { messages: messages, errors: errors.array() });
    }
    const userId = res.locals.currentUser.id;
    const message = req.body.message;
    const date = new Date();
    await db.createMessage(userId, message, date);
    res.redirect("/");
  },
];
