import { UnAuthorizedError } from "infra/errors";
import password from "models/password";
import user from "./user";
const userAuth = async (emailEnviado, senhaEnviada) => {
  try {
    const usuarioArmazenado = await user.findUserByEmail(emailEnviado);

    if (!usuarioArmazenado) {
      throw new UnAuthorizedError("Erro durante a autenticação.");
    }

    const comparacao = await password.compare({
      senha: senhaEnviada,
      hash: usuarioArmazenado.senha,
    });
    if (!comparacao) {
      throw new UnAuthorizedError();
    }

    return usuarioArmazenado;
  } catch (error) {
    throw error;
  }
};
const createSession = async (userID) => {};
//usar comparePassword quando criar modulo para trocar senha
const comparePassword = async (senhaEnviada, senhaArmazenada) => {
  const comparacao = await password.compare({
    senha: senhaEnviada,
    hash: senhaArmazenada,
  });
  if (!comparacao) {
    throw new UnAuthorizedError(
      "A senha enviada, não confere com sua senha atual.",
    );
  }
};

const autentication = {
  userAuth,
  comparePassword,
};

export default autentication;
