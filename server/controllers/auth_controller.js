import bcrypt from "bcryptjs";
import { body, validationResult } from "express-validator";
import User from "../models/userSchema.js";
import passport from "passport";
import { issueJWT } from "../config/auth.js";

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

const auth_check = async (req, res) => {
  console.log(res);
  res.json({ message: "Hi!!!!!!" });
  // console.log(req.user);
  // if (typeof req.user === "undefined") {
  //   res.send("You are already logged out!");
  // } else {
  //   res.render("account", {
  //     title: "Your account",
  //     user: req.user || null,
  //   });
  // }
};

const prot = async (req, res) => {
  res.send("Protected route");
};

/* Sign up form - get */
const signup_get = async (req, res, next) => {
  res.render("signup_form", {
    title: "Sign Up",
    user: req.user || null,
  });
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
      res.render("signup_form", {
        title: "Sign Up",
        username: username,
        password: null,
        errors: errors.array(),
        user: req.user || null,
      });
      return;
    } else {
      bcrypt.hash(req.body.password, 10, async (err, hash) => {
        if (err) {
          next(err);
        } else {
          try {
            const user = new User({
              username: req.body.username,
              password: hash,
              role: "user",
            });
            const result = await user.save();
            const jwt = issueJWT(user);
            console.log(jwt.token);
            res.redirect("/auth/login");
          } catch (err) {
            return next(err);
          }
        }
      });
    }
  },
];

/* Log in form - get */
const login_get = async (req, res, next) => {
  res.render("login_form", {
    title: "Log In",
    user: req.user || null,
  });
};

/* Log in form - post */

const login_post = async (req, res, next) => {
  passport.authenticate("local", (err, user) => {
    if (err) {
      res.status(401).json({ success: false, message: "failure" });
    } else {
      const jwt = issueJWT(user);
      res.status(200).json({
        success: true,
        message: "successful",
        user: req.user,
        jwt: jwt,
      });
    }
  })(req, res, next);
};

/* Log out */
const logout_get = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/auth/check");
  });
};

function verifyToken(req, res, next) {
  // get auth header value
  const bearerHeader = req.headers["authorization"];
  // check if bearer is undefined
  if (typeof bearerHeader !== "undefined") {
    //split at the space
    const bearer = bearerHeader.split(" ");
    // get token from array
    const bearerToken = bearer[1];
    //set the token
    req.token = bearerToken;
    next();
  } else {
    //forbidden
    // res.sendStatus(403);
    res.end();
  }
}

export {
  login_get,
  login_post,
  signup_get,
  signup_post,
  logout_get,
  check,
  prot,
};
