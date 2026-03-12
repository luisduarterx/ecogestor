import { createRouter } from "next-connect";
import * as cookie from "cookie";
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
  const setCookie = cookie.serialize("sid", newSession.token, {
    path: "/",
    maxAge: session.expiration_in_miliseconds / 1000,
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  });
  console.log(newSession);
  res.setHeader("Set-Cookie", setCookie);
  res.status(201).json(newSession);
});
export default router.handler({
  onNoMatch: controller.onNoMatchHandler,
  onError: controller.onErrorHandler,
});
