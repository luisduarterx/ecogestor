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
    tabela_id: z.number().positive().optional(),
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
router.get(authorization.canAccess("read:registro"), async (req, res) => {
  const { page, limit, search, tipo, status } = req.query;
  console.log("status desse", status);
  const pageNumber = parseInt(page);
  const limitNumber = parseInt(limit);

  if (
    isNaN(pageNumber) ||
    isNaN(limitNumber) ||
    pageNumber < 1 ||
    limitNumber < 1
  ) {
    throw new ValidationError("Parâmetros de paginação inválidos.");
  }

  const offset = (pageNumber - 1) * limitNumber;

  const registros = await registro.findAll({
    page,
    limit,
    search,
    tipo,
    status,
  });

  res.status(200).json(registros);
});

export default router.handler({
  onNoMatch: controller.onNoMatchHandler,
  onError: controller.onErrorHandler,
});
