import database from "infra/database";
import { createRouter } from "next-connect";
import controller from "infra/controller";
import user from "models/user";
import z from "zod";
import { ValidationError } from "infra/errors";
import authorization from "models/authorization";
const router = createRouter();
router.use(authorization.middleware);
router.post(authorization.canAccess("create:user"), async (req, res) => {
  const userInputValues = req.body;

  const schema = z.object({
    nome: z.string(),
    email: z.email(),
    senha: z.string(),
  });

  const dataParsed = schema.safeParse(userInputValues);

  if (!dataParsed.success) {
    throw new ValidationError();
  }

  const newUser = await user.create(userInputValues);

  res.status(201).json(newUser);
});
export default router.handler({
  onNoMatch: controller.onNoMatchHandler,
  onError: controller.onErrorHandler,
});
