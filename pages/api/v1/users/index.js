import database from "infra/database";
import { createRouter } from "next-connect";
import controller from "infra/controller";
import user from "models/user";
const router = createRouter();
router.post(async (req, res) => {
  const userInputValues = req.body;

  const newUser = await user.create(userInputValues);

  res.status(201).json(newUser);
});
export default router.handler({
  onNoMatch: controller.onNoMatchHandler,
  onError: controller.onErrorHandler,
});
