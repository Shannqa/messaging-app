import createError from "http-errors";
import express from "express";
import session from "express-session";
import cors from "cors";
import path from "path";
import __dirname from "./utils/dirname.js";
import cookieParser from "cookie-parser";
import logger from "morgan";
import indexRouter from "./routes/indexRouter.js";
import authRouter from "./routes/authRouter.js";
import msgRouter from "./routes/msgRouter.js";
import usersRouter from "./routes/usersRouter.js";
import io from "./bin/www.js";
import connectDB from "./config/db.js";
import MongoStore from "connect-mongo";
import helmet from "helmet";
import RateLimit from "express-rate-limit";
const limiter = RateLimit({
  windowsMs: 1 * 60 * 1000, // 1 minute
  max: 20,
});
const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(helmet());
app.use(limiter);
connectDB();

const client =
  process.env.NODE_ENV === "development"
    ? process.env.FRONT_DEV
    : process.env.FRONT;

app.use(
  cors({
    origin: client,
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.DB_STRING }),
  })
);

// view engine setup
app.set("views", "views");
app.set("view engine", "ejs");

app.use("/api/auth", authRouter);
app.use("/api/", msgRouter);
app.use("/api/", usersRouter);
app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

export default app;
