import { createRouter } from "next-connect";
import controller from "infra/controller";
import user from "models/user";
import zod, { z } from "zod";
import { ValidationError } from "infra/errors";
const router = createRouter();
router.get(async (req, res) => {
  const id = req.query.id;

  const findUser = await user.findUserByID(id);

  res.status(200).json(findUser);
});
router.patch(async (req, res) => {
  const id = req.query.id;
  let userInputValues = req.body;

  const InputSchema = z.object({
    nome: z.string().optional(),
    email: z.email("Email Invalido").optional(),
    senha: z.string().optional(),
  });

  const data = InputSchema.safeParse(userInputValues);

  if (!data.success) {
    console.log("DATA ERROR:", data.error);
    throw new ValidationError();
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
