import { createRouter } from "next-connect";
import controller from "infra/controller";
import z from "zod";
import { ValidationError } from "infra/errors";
import authorization from "models/authorization";

import material from "models/materiais";

const router = createRouter();
router.use(authorization.middleware);
router.post(authorization.canAccess("create:material"), async (req, res) => {
  const data = req.body;

  const dataSchema = z.object({
    nome: z.string().min(3).toUpperCase(),
    preco_venda: z.number().positive(),
    categoria_id: z.number(),
  });

  const dataParsed = dataSchema.safeParse(data);

  if (!dataParsed.success) {
    throw new ValidationError();
  }

  const newMaterial = await material.create(dataParsed.data);
  res.status(201).json(newMaterial);
});
export default router.handler({
  onNoMatch: controller.onNoMatchHandler,
  onError: controller.onErrorHandler,
});
