import { createRouter } from "next-connect";
import controller from "infra/controller";
import z from "zod";
import { ValidationError } from "infra/errors";
import authorization from "models/authorization";
import registro from "models/registros";

const router = createRouter();
router.use(authorization.middleware);
router.put(authorization.canAccess("update:registro"), async (req, res) => {
  const data = req.body;
  const id = Number(req.query.id);
  const idParsed = z.number().safeParse(id);
  if (!idParsed.success) {
    throw new ValidationError();
  }

  console.log("params", id);
  const dataSchema = z.object({
    nome: z.string().min(1).optional(),
    email: z.string().email().optional(),
    data_nascimento: z.string().optional(),
    whatsapp: z.string().optional(),
    ie: z.string().optional(),
    cep: z.string().max(8).min(8).optional(),
    logradouro: z.string().optional(),
    numero: z.string().optional(),
    complemento: z.string().optional(),
    bairro: z.string().optional(),
    cidade: z.string().optional(),
    estado: z.string().optional(),
    status: z.boolean().optional(),
    cnpj: z.string().max(14).min(14).optional(),
    cpf: z.string().max(11).min(11).optional(),
  });
  // terminar de fazer a validacao dos dados
  const dataParsed = dataSchema.safeParse(data);

  if (!dataParsed.success) {
    console.log(dataParsed.error);
    throw new ValidationError();
  }

  const registroUpdated = await registro.update(dataParsed.data, id);
  res.status(200).json(registroUpdated);
});
export default router.handler({
  onNoMatch: controller.onNoMatchHandler,
  onError: controller.onErrorHandler,
});
