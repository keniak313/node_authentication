import "dotenv/config";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { indexRouter } from "./routes/indexRouter.js";
import session from "express-session";
import passport from "passport";
import { authRouter } from "./routes/authRouter.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));

app.use(express.urlencoded({ extended: true }));

app.use(session({ secret: "cats", resave: false, saveUninitialized: false }));
app.use(passport.session());

//app.use(passport.authenticate("session"));

app.use((req, res, next) => {
  const msgs = req.session.messages || [];
  res.locals.messages = msgs;
  res.locals.currentUser = req.user;
  next();
});

app.use("/", indexRouter);
app.use("/auth", authRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Listening on: ${PORT}`);
});
