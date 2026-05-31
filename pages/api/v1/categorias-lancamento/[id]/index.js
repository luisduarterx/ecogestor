import { createRouter } from "next-connect";
import controller from "infra/controller";
import z from "zod";
import { ValidationError } from "infra/errors";
import authorization from "models/authorization";
import categoriaLancamento from "models/categorias-lancamento";

const router = createRouter();
router.use(authorization.middleware);

router.patch(
  authorization.canAccess("update:categorias-lancamento"),
  async (req, res) => {
    const id = Number(req.query.id);
    const idParsed = z.number().safeParse(id);
    if (!idParsed.success) {
      throw new ValidationError();
    }
    const { nome } = req.body;

    const dataParsed = z
      .object({
        nome: z
          .string()
          .min(3, "O nome da conta é obrigatório.")
          .max(70, "O nome da conta deve ter no máximo 70 caracteres.")
          .toUpperCase()
          .optional(),
      })
      .safeParse({ nome });

    if (!dataParsed.success) {
      throw new ValidationError();
    }

    const categoria = await categoriaLancamento.update({
      id: idParsed.data,
      nome: dataParsed.data.nome,
    });

    res.status(200).json(categoria);
  },
);

export default router.handler({
  onNoMatch: controller.onNoMatchHandler,
  onError: controller.onErrorHandler,
});
