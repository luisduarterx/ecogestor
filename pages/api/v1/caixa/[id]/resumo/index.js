import { createRouter } from "next-connect";
import controller from "infra/controller";
import z from "zod";
import { ValidationError } from "infra/errors";
import authorization from "models/authorization";
import caixa from "models/caixa";

const router = createRouter();
router.use(authorization.middleware);

router.get(authorization.canAccess("consultar:caixa"), async (req, res) => {
  const id = Number(req.query.id);
  const idParsed = z.number().safeParse(id);
  if (!idParsed.success) {
    throw new ValidationError();
  }

  const resumo = await caixa.resumo({ id: idParsed.data });

  res.status(200).json(resumo);
});

export default router.handler({
  onNoMatch: controller.onNoMatchHandler,
  onError: controller.onErrorHandler,
});
