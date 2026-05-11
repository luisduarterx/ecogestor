import { createRouter } from "next-connect";
import controller from "infra/controller";
import z from "zod";
import { ValidationError } from "infra/errors";
import authorization from "models/authorization";
import material from "models/materiais";

const router = createRouter();
router.use(authorization.middleware);
router.patch(authorization.canAccess("update:material"), async (req, res) => {
  const data = req.body;
  const id = Number(req.query.id);
  const idParsed = z.number().safeParse(id);
  if (!idParsed.success) {
    throw new ValidationError();
  }

  const dataSchema = z.object({
    nome: z.string().min(3).toUpperCase().optional(),
    categoria_id: z.number().optional(),
    preco_venda: z.number().positive().optional(),
    status: z.boolean().optional(),
  });
  // terminar de fazer a validacao dos dados
  const dataParsed = dataSchema.safeParse(data);

  if (!dataParsed.success) {
    throw new ValidationError();
  }

  const materialUpdated = await material.update(dataParsed.data, id);
  res.status(200).json(materialUpdated);
});
router.get(authorization.canAccess("read:material"), async (req, res) => {
  const id = Number(req.query.id);
  const idParsed = z.number().safeParse(id);
  if (!idParsed.success) {
    throw new ValidationError();
  }

  const materialFound = await material.findById(id);
  res.status(200).json(materialFound);
});
export default router.handler({
  onNoMatch: controller.onNoMatchHandler,
  onError: controller.onErrorHandler,
});
