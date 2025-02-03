import { RequestHandler } from "express-serve-static-core";
import { createUser } from "../services/user";

export const CreateUserController: RequestHandler = async (req, res) => {
  const { name, email, senha, telefone, rankID } = req.body;
  //Verificar dados Recebidos

  try {
    const user = await createUser({ name, email, senha, telefone, rankID });
    res.status(201).json(user);
  } catch (err) {
    console.log(err);
  }
};
