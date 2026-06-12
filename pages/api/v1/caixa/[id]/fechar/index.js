import { createRouter } from "next-connect";
import controller from "infra/controller";
import z from "zod";
import { ValidationError } from "infra/errors";
import authorization from "models/authorization";
import caixa from "models/caixa";

const router = createRouter();
router.use(authorization.middleware);

router.post(authorization.canAccess("fechar:caixa"), async (req, res) => {
  const id = Number(req.query.id);
  const idParsed = z.number().safeParse(id);
  if (!idParsed.success) {
    throw new ValidationError();
  }
  const schema = z.object({
    observacao_fechamento: z.string().optional(),
    saldo_final_informado: z.number().positive(),
    user_id: z.number(),
  });
  const bodyParsed = schema.safeParse({ ...req.body, user_id: req.user.id });
  if (!bodyParsed.success) {
    throw new ValidationError();
  }
  const { observacao_fechamento, saldo_final_informado, user_id } =
    bodyParsed.data;

  const caixaFechado = await caixa.fechar({
    observacao_fechamento,
    saldo_final_informado,
    id,
    user_id,
  });

  res.status(201).json(caixaFechado);
});

export default router.handler({
  onNoMatch: controller.onNoMatchHandler,
  onError: controller.onErrorHandler,
});
