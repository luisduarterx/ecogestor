import { createRouter } from "next-connect";
import controller from "infra/controller";
import autentication from "models/authentication";
import session from "models/session";
const router = createRouter();
router.post(async (req, res) => {
  const userInputValues = req.body;

  const usuario = await autentication.userAuth(
    userInputValues.email,
    userInputValues.senha,
  );

  const newSession = await session.create(usuario.id);

  console.log(newSession);

  res.status(201).json(newSession);
});
export default router.handler({
  onNoMatch: controller.onNoMatchHandler,
  onError: controller.onErrorHandler,
});
