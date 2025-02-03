import { RequestHandler } from "express";

export const LoginController: RequestHandler = (req, res) => {
  res.json(req.authInfo);
};
