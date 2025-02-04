import { RequestHandler } from "express";
import { showUsers } from "../services/user";
import { use } from "passport";

export const showUsersController: RequestHandler = async (req, res) => {
  try {
    const users = await showUsers();

    res.json(users);
  } catch (error) {}
};
