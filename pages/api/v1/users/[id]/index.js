import { createRouter } from "next-connect";
import controller from "infra/controller";
import user from "models/user";
import zod, { z } from "zod";
import { ValidationError } from "infra/errors";
const router = createRouter();
router.get(async (req, res) => {
  const id = req.query.id;
  const idParsed = z.number().safeParse(Number(id));

  if (!idParsed.success) {
    throw new ValidationError("ID do usuário inválido.");
  }
  const findUser = await user.findUserByID(Number(id));

  res.status(200).json(findUser);
});
router.patch(async (req, res) => {
  const id = Number(req.query.id);

  const idParsed = z.number().safeParse(id);

  if (!idParsed.success) {
    throw new ValidationError("ID do usuário inválido.");
  }

  let userInputValues = req.body;
  const InputSchema = z.object({
    nome: z.string().optional(),
    email: z.email("Email Invalido").optional(),
    senha: z.string().optional(),
  });

  const data = InputSchema.safeParse(userInputValues);

  if (!data.success) {
    console.log("DATA ERROR:", data.error);
    throw new ValidationError("Dados de entrada inválidos");
  }

  userInputValues = data.data;

  const updatedUser = await user.update(id, userInputValues);
  console.log("UPDATED: ", updatedUser);
  res.status(200).json(updatedUser);
});
export default router.handler({
  onNoMatch: controller.onNoMatchHandler,
  onError: controller.onErrorHandler,
});
