import { RequestHandler } from "express-serve-static-core";
import { createUser, deleteUser, editUser } from "../services/user";
import {
  userDeleteSchema,
  userEditSchema,
  userSchema,
} from "../schemas/user.schema";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { Prisma } from "@prisma/client";

export const CreateUserController: RequestHandler = async (req, res) => {
  const request = userSchema.safeParse(req.body);
  if (!request.success) {
    res.json({
      error: "Dados inválidos!",
    });
    return;
  }
  const { name, email, senha, telefone, rankID } = request.data;

  //Verificar dados Recebidos

  try {
    const user = await createUser({ name, email, senha, telefone, rankID });
    res.status(201).json(user);
  } catch (err) {
    console.log(err);
  }
};

export const EditUserController: RequestHandler = async (req, res) => {
  const request = userEditSchema.safeParse(req.body);

  if (!request.success) {
    res.json({ error: "nao conseguimos validar os dados enviados" });
    return;
  }
  console.log("Dados verificados com sucesso!");

  const { id, data } = request.data;

  try {
    const user = await editUser({ id, data });

    res.status(201).json({ sucess: user });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        res
          .status(400)
          .json({ error: "Já existe um usuario com esses dados cadastrados!" });
      }
      if (error.code === "P2003") {
        res.status(400).json({ error: "Erro no banco de dados" });
      }
      if (error.code === "P2025") {
        res.status(400).json("Usuario nao encontrado");
      }
    }

    res.json(error);
  }
};

export const DeleteUserController: RequestHandler = async (req, res) => {
  const validation = userDeleteSchema.safeParse(req.body.id);

  if (!validation.success) {
    res.json({ error: "nao conseguimos validar os dados enviados" });
    return;
  }
  try {
    const id = validation.data;

    const user = await deleteUser(id);
    if (!user) {
      console.log("n ada");
      throw new Error("Usuario nao encontrado");
    }
    res.json(user);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        res.json({ error: "O Usuario escolhido nao existe" });
      }
    }
    res.json("error");
  }
};
