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
router.get(authorization.canAccess("read:users"), async (req, res) => {
  const { page, limit, perfil_id, search } = req.query;
  const data = {
    page: parseInt(page),
    limit: parseInt(limit),
    perfil_id: perfil_id ? parseInt(perfil_id) : undefined,
    search: search ? String(search) : undefined,
  };
  const schema = z.object({
    page: z.number().positive().optional(),
    limit: z.number().positive().optional(),
    perfil_id: z.number().positive().optional(),
    search: z.string().optional(),
  });

  const schemaParsed = schema.safeParse(data);
  if (!schemaParsed.success) {
    console.log("erro schema", schemaParsed.error);
    throw new ValidationError();
  }
  const users = await user.findAll(schemaParsed.data);

  res.status(200).json(users);
});
export default router.handler({
  onNoMatch: controller.onNoMatchHandler,
  onError: controller.onErrorHandler,
});
