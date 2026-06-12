import { createRouter } from "next-connect";
import controller from "infra/controller";
import z from "zod";
import { ValidationError } from "infra/errors";
import authorization from "models/authorization";
import categoriaLancamento from "models/categorias-lancamento";

const router = createRouter();
router.use(authorization.middleware);
router.post(
  authorization.canAccess("create:categorias-lancamento"),
  async (req, res) => {
    const schema = z.object({
      nome: z
        .string()
        .min(3, "O nome da categoria é obrigatório.")
        .max(70, "O nome da categoria deve ter no máximo 70 caracteres.")
        .toUpperCase(),
      tipo_categoria: z.enum(["RECEITA", "DESPESA"], {
        errorMap: () => ({ message: "O tipo da categoria é obrigatório." }),
      }),
    });

    const dataParsed = schema.safeParse(req.body);

    if (!dataParsed.success) {
      throw new ValidationError();
    }

    const { nome, tipo_categoria } = dataParsed.data;

    const categoria = await categoriaLancamento.create({
      nome,
      tipo_categoria,
    });

    res.status(201).json(categoria);
  },
);
router.get(
  authorization.canAccess("read:categorias-lancamento"),
  async (req, res) => {
    const { nome } = req.query;
    const listCategorias = await categoriaLancamento.getAll({ nome });
    res.status(200).json(listCategorias);
  },
);

export default router.handler({
  onNoMatch: controller.onNoMatchHandler,
  onError: controller.onErrorHandler,
});
