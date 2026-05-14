import { createRouter } from "next-connect";
import controller from "infra/controller";
import z from "zod";
import { ValidationError } from "infra/errors";
import authorization from "models/authorization";
import material from "models/materiais";
import tabela from "models/tabelas";

const router = createRouter();
router.use(authorization.middleware);

router.get(authorization.canAccess("read:tabela"), async (req, res) => {
  const id = Number(req.query.id);
  const idParsed = z.number().safeParse(id);
  if (!idParsed.success) {
    throw new ValidationError();
  }

  const tabelaFound = await tabela.findById(id);

  res.status(200).json(tabelaFound);
});
export default router.handler({
  onNoMatch: controller.onNoMatchHandler,
  onError: controller.onErrorHandler,
});
