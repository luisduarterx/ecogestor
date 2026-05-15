import { createRouter } from "next-connect";
import controller from "infra/controller";
import z from "zod";
import { ValidationError } from "infra/errors";
import authorization from "models/authorization";

import categoria from "models/categorias";
const router = createRouter();
router.use(authorization.middleware);
router.post(authorization.canAccess("create:categorias"), async (req, res) => {
  const inputValues = req.body;

  const schema = z.object({
    nome: z.string().min(3).max(100).toUpperCase(),
  });

  const dataParsed = schema.safeParse(inputValues);

  if (!dataParsed.success) {
    throw new ValidationError();
  }

  const newCategory = await categoria.create(dataParsed.data);

  res.status(201).json(newCategory);
});
router.get(authorization.canAccess("read:categorias"), async (req, res) => {
  const { nome, ordem } = req.query;
  const categorias = await categoria.findAll({ nome, ordem });
  res.status(200).json(categorias);
});

export default router.handler({
  onNoMatch: controller.onNoMatchHandler,
  onError: controller.onErrorHandler,
});
