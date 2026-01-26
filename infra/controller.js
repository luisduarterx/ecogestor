import {
  InternalServerError,
  MethodError,
  NotFoundError,
  ValidationError,
} from "infra/errors";
const onNoMatchHandler = async (req, res) => {
  const errorPublicHandle = new MethodError();
  return res.status(errorPublicHandle.statusCode).json(errorPublicHandle);
};
const onErrorHandler = (error, req, res) => {
  if (error instanceof ValidationError || NotFoundError) {
    console.log(error);
    res.status(error.statusCode).json(error);
  }
  console.log(error);
  const publicError = new InternalServerError(error, error.statusCode);
  res.status(publicError.statusCode).json(publicError);
};

const controller = {
  onErrorHandler,
  onNoMatchHandler,
};

export default controller;
