import { RequestHandler } from "express";
import { access } from "fs";

export const authenticateAcess: RequestHandler = (req, res) => {
  console.log("controller:", req.user);
  if (req.user) {
    res.status(200).send(req.user);
    return;
  } else {
    res.status(401).send({ acess: false });
    return;
  }
};
