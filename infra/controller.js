import { InternalServerError, MethodError } from "infra/errors";
const onNoMatchHandler = async (req, res) => {
  const errorPublicHandle = new MethodError();
  return res.status(errorPublicHandle.statusCode).json(errorPublicHandle);
};
const onErrorHandler = (error, req, res) => {
  console.log("TESTE", error);
  console.log(error.statusCode);
  const publicError = new InternalServerError(error, error.statusCode);
  res.status(publicError.statusCode).json(publicError);
  console.error(error);
};

const controller = {
  onErrorHandler,
  onNoMatchHandler,
};

export default controller;
