import database from "infra/database";
import { createRouter } from "next-connect";
import controller from "infra/controller";
import user from "models/user";
import { UnAuthorizedError } from "infra/errors";
import password from "models/password";
const router = createRouter();
router.post(async (req, res) => {
  const userInputValues = req.body;

  const usuario = await user.findUserByEmail(userInputValues.email);

  if (!usuario) {
    throw new UnAuthorizedError("Tente efetuar login com um email válido.");
  }
  console.log(usuario.senha);

  const comparacao = await password.compare({
    senha: userInputValues.senha,
    hash: usuario.senha,
  });
  console.log("COMPARE:  ", comparacao);

  if (!comparacao) {
    throw new UnAuthorizedError();
  }

  res.status(200).json(usuario);
});
export default router.handler({
  onNoMatch: controller.onNoMatchHandler,
  onError: controller.onErrorHandler,
});
