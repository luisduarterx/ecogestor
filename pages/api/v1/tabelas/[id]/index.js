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
router.put(authorization.canAccess("update:tabela"), async (req, res) => {
  const id = Number(req.query.id);
  const idParsed = z.number().safeParse(id);
  if (!idParsed.success) {
    throw new ValidationError();
  }

  const data = req.body;

  const dataSchema = z.object({
    nome: z.string().min(3).toUpperCase(),
    materiais: z
      .array(
        z.object({
          id: z.number(),
          preco_compra: z.number().positive(),
        }),
      )
      .optional(),
  });

  const dataParsed = dataSchema.safeParse(data);

  if (!dataParsed.success) {
    throw new ValidationError();
  }

  try {
    const updatedTabela = await tabela.update(dataParsed.data, id);
    res.status(200).json(updatedTabela);
  } catch (error) {
    if (error instanceof ValidationError) {
      res.status(400).json({ message: error.message, name: error.name });
      return;
    }
    throw error;
  }
});
router.delete(authorization.canAccess("delete:tabela"), async (req, res) => {
  const id = Number(req.query.id);
  const idParsed = z.number().safeParse(id);
  if (!idParsed.success) {
    throw new ValidationError();
  }

  try {
    await tabela.deleteTab(id);
    res.status(200).send({});
  } catch (error) {
    throw error;
  }
});
export default router.handler({
  onNoMatch: controller.onNoMatchHandler,
  onError: controller.onErrorHandler,
});
