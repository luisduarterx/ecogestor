import { UnAuthorizedError } from "infra/errors";
import session from "./session";
import user from "./user";

const middleware = async (req, res, next) => {
  if (!req.cookies?.sid) {
    throw new UnAuthorizedError(
      "Acesso não autorizado.",
      "Você precisa estar autenticado para acessar esse recurso.",
    );
  }
  const userValid = await session.validateAndReturnUser(req.cookies.sid);
  if (!userValid) {
    throw new UnAuthorizedError(
      "Acesso não autorizado.",
      "Você precisa estar autenticado para acessar esse recurso.",
    );
  }
  req.user = userValid; // alterar o que retorna nesse usuario

  return next();
};

const canAccess = (requiredPermission) => {
  return (req, res, next) => {
    console.log("USER", req.user);
    if (!req.user) {
      throw new UnAuthorizedError(
        "Acesso não autorizado.",
        "Você precisa estar autenticado para acessar esse recurso.",
      );
    }

    const permissoes = req.user.perfil.permissoes || [];

    if (!permissoes.includes(requiredPermission)) {
      throw new UnAuthorizedError(
        "Acesso não autorizado.",
        "Você não tem permissão para acessar esse recurso.",
      );
    }

    return next();
  };
};

const authorization = {
  middleware,
  canAccess,
};

export default authorization;
