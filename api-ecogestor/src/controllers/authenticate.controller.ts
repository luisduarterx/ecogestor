import { RequestHandler } from "express";
import { access } from "fs";

export const authenticateAcess: RequestHandler = (req, res) => {
  console.log("controller:", req.user);
  if (req.user) {
    res.send({ access: true });
    return;
  } else {
    res.send({ acess: false });
    return;
  }
};
