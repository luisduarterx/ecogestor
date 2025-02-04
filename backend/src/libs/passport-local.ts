import { Strategy as localStrategy } from "passport-local";
import { findUserByEmailAndPassword, generateToken } from "../services/user";
import { Prisma, User } from "@prisma/client";
import { RequestHandler } from "express";
import passport from "passport";

type ResponseUser = {
  user: {
    id: number;
    name: string;
    senha: string;
    telefone: string;
    rankID: number;
  };
  auth: {
    token: string;
  };
};
export const estrategiaLocal = new localStrategy(
  { usernameField: "email", passwordField: "senha" },
  async (email, senha, done) => {
    try {
      const user = await findUserByEmailAndPassword({ email, senha });
      console.log(user);
      if (user) {
        const response: ResponseUser = {
          user,
          auth: {
            token: generateToken(user.id),
          },
        };
        return done(null, response);
      } else {
        return done(null, false);
      }
    } catch {
      return done(null, false);
    }
  }
);
export const authLoginMiddleware: RequestHandler = (req, res, next) => {
  const request = passport.authenticate(
    "local",
    (err: any, response: ResponseUser) => {
      if (response) {
        req.user = response.user;
        req.authInfo = response.auth;
        return next();
      } else {
        res.json({
          error: "Credenciais inválidas!",
        });
      }
    }
  );
  request(req, res, next);
};
