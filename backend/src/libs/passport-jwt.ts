import { ExtractJwt, Strategy as JWTStrategy } from "passport-jwt";
import { findUserByID } from "../services/user";
import { RequestHandler } from "express";
import passport from "passport";
import { User } from "@prisma/client";

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_KEY as string,
};
export const EstrategiaJWT = new JWTStrategy(options, async (payload, done) => {
  const { id } = payload;
  try {
    const user = await findUserByID(Number(id));

    if (!user) {
      return done(null, false);
    }
    console.log(user);
    return done(null, user);
  } catch (error) {
    return error;
  }
});

export const authenticateMiddleware: RequestHandler = (req, res, next) => {
  const request = passport.authenticate(
    "jwt",
    (err: any, user: User | false) => {
      if (user) {
        console.log("middleware:", user);
        req.user = user;
        return next();
      } else {
        res.status(401).json({ error: "nao autorizado" });
        return;
      }
    }
  );
  request(req, res, next);
};
