import { createRouter } from "next-connect";
import controller from "infra/controller";
import z from "zod";
import { ValidationError } from "infra/errors";
import authorization from "models/authorization";

import tabela from "models/tabelas";

const router = createRouter();
router.use(authorization.middleware);

router.get(authorization.canAccess("read:tabela"), async (req, res) => {
  const tabelaFound = await tabela.findAll();

  res.status(200).json(tabelaFound);
});
router.post(authorization.canAccess("create:tabela"), async (req, res) => {
  const data = req.body;
  if (data.base && data.materiais) {
    throw new ValidationError(
      "Não é permitido informar materiais quando uma tabela base é informada.",
    );
  }
  const dataSchema = z.object({
    nome: z.string().toUpperCase(),
    materiais: z
      .array(
        z.object({
          id: z.number().positive(),
          preco_compra: z.number().positive(),
        }),
      )
      .optional(),
    base: z.number().positive().optional(),
    porcentagem: z.number().optional(),
  });

  const dataParsed = dataSchema.safeParse(data);
  console.log("DADOS RECEBIDOS:", data);
  if (!dataParsed.success) {
    console.log("ERRO DE VALIDAÇÃO:", dataParsed.error);
    throw new ValidationError();
  }

  const newTabela = await tabela.create(dataParsed.data);
  res.status(201).json(newTabela);
});
export default router.handler({
  onNoMatch: controller.onNoMatchHandler,
  onError: controller.onErrorHandler,
});
