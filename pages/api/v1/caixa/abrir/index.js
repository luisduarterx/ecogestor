import { createRouter } from "next-connect";
import controller from "infra/controller";
import z from "zod";
import { ValidationError } from "infra/errors";
import authorization from "models/authorization";
import caixa from "models/caixa";

const router = createRouter();
router.use(authorization.middleware);

router.post(authorization.canAccess("abrir:caixa"), async (req, res) => {
  const schema = z.object({
    observacao_abertura: z.string().optional(),
  });
  const schemaParsed = schema.safeParse(req.body);

  if (!schemaParsed.success) {
    throw new ValidationError();
  }

  const { observacao_abertura } = schemaParsed.data;

  const novoCaixa = await caixa.abrir({
    user_id: req.user.id,

    observacao_abertura,
  });

  return res.status(201).json(novoCaixa);
});

export default router.handler({
  onNoMatch: controller.onNoMatchHandler,
  onError: controller.onErrorHandler,
});
