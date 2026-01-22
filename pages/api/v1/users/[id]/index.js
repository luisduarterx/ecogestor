import { createRouter } from "next-connect";
import controller from "infra/controller";
import user from "models/user";
const router = createRouter();
router.get(async (req, res) => {
  const id = req.query.id;

  const findUser = await user.findUserByID(id);

  res.status(200).json(findUser);
});
export default router.handler({
  onNoMatch: controller.onNoMatchHandler,
  onError: controller.onErrorHandler,
});
