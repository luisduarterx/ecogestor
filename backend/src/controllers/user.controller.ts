import { RequestHandler } from "express-serve-static-core";
import { createUser } from "../services/user";
import { userSchema } from "../schemas/user.schema";

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
