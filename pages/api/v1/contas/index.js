import { createRouter } from "next-connect";
import controller from "infra/controller";
import z from "zod";
import { ValidationError } from "infra/errors";
import authorization from "models/authorization";
import contas from "models/contas";

const router = createRouter();
router.use(authorization.middleware);
router.post(authorization.canAccess("create:contas"), async (req, res) => {
  const schema = z.object({
    nome: z
      .string()
      .min(3, "O nome da conta é obrigatório.")
      .max(70, "O nome da conta deve ter no máximo 70 caracteres.")
      .toUpperCase(),
    saldo_inicial: z
      .number({
        required_error: "O saldo inicial é obrigatório.",
        invalid_type_error: "O saldo inicial deve ser um número.",
      })
      .positive("O saldo inicial deve ser um número positivo."),
    conta_padrao: z.boolean().optional(),
  });

  const dataParsed = schema.safeParse(req.body);

  if (!dataParsed.success) {
    throw new ValidationError();
  }

  const { nome, saldo_inicial, conta_padrao } = dataParsed.data;

  const conta = await contas.create({ nome, saldo_inicial, conta_padrao });

  res.status(201).json(conta);
});
router.get(authorization.canAccess("read:contas"), async (req, res) => {
  const { nome, ordem } = req.query;
  const listContas = await contas.getAll({ nome, ordem });
  res.status(200).json(listContas);
});

export default router.handler({
  onNoMatch: controller.onNoMatchHandler,
  onError: controller.onErrorHandler,
});
