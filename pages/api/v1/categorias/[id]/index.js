import { createRouter } from "next-connect";
import controller from "infra/controller";
import z from "zod";
import { ValidationError } from "infra/errors";
import authorization from "models/authorization";
import categoria from "models/categorias";

const router = createRouter();
router.use(authorization.middleware);
router.put(authorization.canAccess("update:categorias"), async (req, res) => {
  const data = req.body;
  const id = Number(req.query.id);
  const idParsed = z.number().safeParse(id);
  if (!idParsed.success) {
    throw new ValidationError();
  }

  const dataSchema = z.object({
    nome: z.string().min(3).toUpperCase(),
    status: z.boolean().optional(),
  });

  // terminar de fazer a validacao dos dados
  const dataParsed = dataSchema.safeParse(data);

  if (!dataParsed.success) {
    throw new ValidationError();
  }

  const categoriaUpdated = await categoria.update(dataParsed.data, id);
  res.status(200).json(categoriaUpdated);
});
export default router.handler({
  onNoMatch: controller.onNoMatchHandler,
  onError: controller.onErrorHandler,
});
