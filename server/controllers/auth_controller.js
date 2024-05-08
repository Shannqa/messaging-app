import bcrypt from "bcryptjs";
import { body, validationResult } from "express-validator";
import User from "../models/userSchema.js";
import passport from "passport";
import { issueJWT } from "../config/auth.js";

/* Check if user is logged in */
const check = async (req, res) => {
  if (req.user) {
    res.status(200).json({
      success: true,
      user: req.user.username,
    });
  } else {
    res.status(401).json({ success: false, message: "failure" });
  }
};

/* Sign up form - post */
const signup_post = [
  body("username", "Username must be at least 3 characters long.")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("password", "Password must be at least 3 characters long.")
    .trim()
    .isLength({ min: 3 })
    .escape(),

  async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // there are errors
      res.status(400).json({
        username: req.body.username,
        password: req.body.password,
        errors: errors.array(),
      });
      return;
    } else {
      bcrypt.hash(req.body.password, 10, async (err, hash) => {
        if (err) {
          res.status(400).json({ success: false, message: "failure" });
        } else {
          try {
            const user = new User({
              username: req.body.username,
              password: hash,
              role: "user",
            });
            const result = await user.save();
            const jwt = issueJWT(user);
            res.status(200).json({
              success: true,
              message: "successful",
              user: user,
              jwt: jwt,
            });
          } catch (err) {
            res.status(400).json({ success: false, message: "failure" });
          }
        }
      });
    }
  },
];

/* Log in form - post */
const login_post = [
  body("username", "Username must be at least 3 characters long.")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("password", "Password must be at least 3 characters long.")
    .trim()
    .isLength({ min: 3 })
    .escape(),

  async (req, res, next) => {
    passport.authenticate(
      "local",
      { failureMessage: true },
      (err, user, info) => {
        if (err) {
          res.status(400).json({ success: false, message: info.message });
        } else if (!user) {
          res.status(400).json({ success: false, message: info.message });
        } else {
          const jwt = issueJWT(user);
          res.status(200).json({
            success: true,
            message: "successful",
            user: user,
            jwt: jwt,
          });
        }
      }
    )(req, res, next);
  },
];

/* Log out */
const logout_get = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/auth/check");
  });
};

export { login_post, signup_post, logout_get, check };
