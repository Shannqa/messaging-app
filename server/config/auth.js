import passport from "passport";
import "dotenv/config";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import jsonwebtoken from "jsonwebtoken";
import LocalStrategy from "passport-local";
import bcrypt from "bcryptjs";
import User from "../models/userSchema.js";

/* Local strategy - username + password authentication */

// verify username + hashed password
const LocalAuth = new LocalStrategy(async (username, password, done) => {
  try {
    const user = await User.findOne({ username: username });
    if (!user) {
      return done(null, false, { message: "Incorrect username" });
    }
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return done(null, false, { message: "Incorrect password" });
    }
    const jwt = issueJWT(user);
    return done(null, user);
  } catch (err) {
    return done(err, { message: "error" });
  }
});

/* JSON Web Token Strategy - authorize using JWT */

// issue JWT
function issueJWT(user) {
  const _id = user._id;
  const expiresIn = "14d";
  const payload = {
    sub: _id,
    iat: Date.now(),
  };
  const signedToken = jsonwebtoken.sign(payload, process.env.RSA_PRIVATE_KEY, {
    expiresIn: expiresIn,
    algorithm: "RS256",
  });
  return {
    token: "Bearer " + signedToken,
    expires: expiresIn,
  };
}

// verify JWT
const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.RSA_PUBLIC_KEY,
  algorithms: ["RS256"],
};

const JwtAuth = new JwtStrategy(options, (payload, done) => {
  User.findOne({ _id: payload.sub })
    .then((user) => {
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    })
    .catch((err) => done(err, null));
});

const authJWT = passport.authenticate("jwt", { session: false });

export { LocalAuth, JwtAuth, issueJWT, authJWT };
