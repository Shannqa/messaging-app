import express from "express";
import {
  login_post,
  check,
  signup_post,
  logout_get,
} from "../controllers/auth_controller.js";
import passport from "passport";
import { LocalAuth, JwtAuth, authJWT } from "../config/auth.js";
import User from "../models/userSchema.js";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";

const router = express.Router();

router.use(passport.session());
passport.use(LocalAuth);
passport.use(JwtAuth);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

router.post("/check", verifyToken, authJWT, check);
router.post("/login", login_post);
router.post("/signup", signup_post);
router.get("/logout", logout_get);

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
    res.sendStatus(403);
  }
}

export default router;
