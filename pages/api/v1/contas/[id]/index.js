import { createRouter } from "next-connect";
import controller from "infra/controller";
import z from "zod";
import { ValidationError } from "infra/errors";
import authorization from "models/authorization";
import contas from "models/contas";

const router = createRouter();
router.use(authorization.middleware);

router.get(authorization.canAccess("read:contas"), async (req, res) => {
  const id = Number(req.query.id);
  const idParsed = z.number().safeParse(id);
  if (!idParsed.success) {
    throw new ValidationError();
  }
  const conta = await contas.findById(idParsed.data.id);

  res.status(200).json(conta);
});
router.patch(authorization.canAccess("update:contas"), async (req, res) => {
  const id = Number(req.query.id);
  const idParsed = z.number().safeParse(id);
  if (!idParsed.success) {
    throw new ValidationError();
  }
  const { nome, status } = req.body;

  const dataParsed = z
    .object({
      nome: z
        .string()
        .min(3, "O nome da conta é obrigatório.")
        .max(70, "O nome da conta deve ter no máximo 70 caracteres.")
        .toUpperCase()
        .optional(),
      status: z.boolean().optional(),
    })
    .safeParse({ nome, status });

  if (!dataParsed.success) {
    throw new ValidationError();
  }

  const conta = await contas.update({
    id: idParsed.data,
    nome: dataParsed.data.nome,
    status: dataParsed.data.status,
  });

  res.status(200).json(conta);
});

export default router.handler({
  onNoMatch: controller.onNoMatchHandler,
  onError: controller.onErrorHandler,
});
