import asyncHandler from "express-async-handler";
import { CustomNotFoundError } from "../errors/CustomNotFoundError.js";
import { body, check, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import * as db from "../db/queries.js";
import passport from "passport";
import LocalStrategy from "passport-local";

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const getUser = await db.getUsername(username);
      const user = getUser[0];

      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: "Incorrect password" });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }),
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.getUserId(id);
    done(null, user[0]);
  } catch (err) {
    return done(err);
  }
});

const validateSignUp = [
  body("username")
    .notEmpty()
    .trim()
    .escape()
    .isAlphanumeric()
    .withMessage("Letters and numbers only")
    .custom(async (value) => {
      const isExist = await db.checkIfUserExists(value);
      if (isExist) {
        throw new Error(`${value} is already taken.`);
      }
    }),
  body(["password", "confirmPassword"])
    .notEmpty()
    .trim()
    .escape()
    .isLength({ min: 5, max: 20 })
    .withMessage("Password must be between 5 and 20 characters")
    .custom(async (value) => {
      console.log(value);
      if (value.password != value.confirmPassword) {
        throw new Error("Password does not match");
      }
    }),
];

const validateLogin = [
  body("username").trim().escape(),
  body("password").trim().escape(),
];

export const signUpPost = [
  validateSignUp,
  async (req, res) => {
    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
      return res.status(400).render("sign-up-form", { errors: errors.array() });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    await db.createUser(req.body.username, hashedPassword);
    res.redirect("/");
  },
];

export const signUpGet = (req, res) => {
  res.render("sign-up-form");
};

export const logInGet = async (req, res) => {
  let msgs = res.locals.messages;

  console.log(res.locals);
  res.render("auth", { user: req.user, errors: msgs });
};

export const logInPost = [
  validateLogin,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("auth", { errors: errors.array() });
    }
    next();
  },
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/auth/login",
    failureMessage: true,
    failWithError: true,
  }),
];

export const logOutGet = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};
