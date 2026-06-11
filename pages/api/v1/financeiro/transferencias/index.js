import { createRouter } from "next-connect";
import controller from "infra/controller";
import z from "zod";
import { ValidationError } from "infra/errors";
import authorization from "models/authorization";
import movFinanceiras from "models/mov-financeiras";

const router = createRouter();
router.use(authorization.middleware);
router.post(
  authorization.canAccess("create:financeiro:transferencia"),
  async (req, res) => {
    const data = req.body;

    const dataSchema = z.object({
      conta_origem_id: z.number(),
      conta_destino_id: z.number(),
      descricao: z.string().optional(),
      valor: z.number().min(0.01),
    });
    const user_id = req.user.id;
    const dataParsed = dataSchema.safeParse(data);

    if (!dataParsed.success) {
      throw new ValidationError();
    }

    const newTransferencia = await movFinanceiras.transferencia({
      user_id: Number(user_id),
      ...dataParsed.data,
    });
    res.status(201).json(newTransferencia);
  },
);
export default router.handler({
  onNoMatch: controller.onNoMatchHandler,
  onError: controller.onErrorHandler,
});
