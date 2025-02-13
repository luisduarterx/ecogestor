import { Router } from "express";
import { LoginController } from "../controllers/login.controller";
import {
  CreateUserController,
  DeleteUserController,
  EditUserController,
} from "../controllers/user.controller";
import { prisma } from "../libs/prismaClient";
import { authLoginMiddleware } from "../libs/passport-local";
import { authenticateAcess } from "../controllers/authenticate.controller";
import { authenticateMiddleware } from "../libs/passport-jwt";
import { showUsersController } from "../controllers/showUsers.controller";

export const router = Router();
router.post("/user", CreateUserController);
router.get("/users", showUsersController);
router.put("/user", authenticateMiddleware, EditUserController);
router.delete("/user", DeleteUserController);

router.post("/login", authLoginMiddleware, LoginController);
router.get("/authenticate", authenticateMiddleware, authenticateAcess);
router.post("/rank", async (req, res) => {
  const rank = await prisma.rank.create({
    data: {
      name: req.body.name,
    },
  });
  res.json(rank);
});
