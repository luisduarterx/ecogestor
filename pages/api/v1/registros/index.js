import { createRouter } from "next-connect";
import controller from "infra/controller";
import z from "zod";
import { ValidationError } from "infra/errors";
import authorization from "models/authorization";
import { tipo_registro } from "@prisma/client";
import user from "models/user";
import registro from "models/registros";
const router = createRouter();
router.use(authorization.middleware);
router.post(authorization.canAccess("create:registro"), async (req, res) => {
  const userInputValues = req.body;

  const schema = z.object({
    nome: z.string().min(1),
    cpf: z.string().max(11).min(11).optional(),
    email: z.string().email().optional(),
    tipo_registro: z.enum(["F", "J"]),
    data_nascimento: z.string().optional(),
    whatsapp: z.string().optional(),
    cnpj: z.string().max(14).min(14).optional(),
    ie: z.string().optional(),
    cep: z.string().max(8).min(8).optional(),
    logradouro: z.string().optional(),
    numero: z.string().optional(),
    complemento: z.string().optional(),
    bairro: z.string().optional(),
    cidade: z.string().optional(),
    estado: z.string().optional(),
  });

  const dataParsed = schema.safeParse(userInputValues);

  if (!dataParsed.success) {
    throw new ValidationError();
  }
  if (
    (dataParsed.data.tipo_registro === "F" && dataParsed.data.cnpj) ||
    (dataParsed.data.tipo_registro === "J" && dataParsed.data.cpf)
  ) {
    throw new ValidationError(
      "Não é permitido criar um registro com CPF e CNPJ preenchidos ao mesmo tempo.",
    );
  }

  const newRecord = await registro.create(dataParsed.data);

  res.status(201).json(newRecord);
});
export default router.handler({
  onNoMatch: controller.onNoMatchHandler,
  onError: controller.onErrorHandler,
});
