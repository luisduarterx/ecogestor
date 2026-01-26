export class InternalServerError extends Error {
  constructor(cause, statusCode) {
    super("Um erro interno não esperado aconteceu.", {
      cause,
    });
    this.name = "InternalServerError";
    this.action = "Entre em contato com o suporte.";
    this.statusCode = statusCode || 500;
    console.log(statusCode);
  }
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}
export class ServiceError extends Error {
  constructor(cause, message, action) {
    super(message, {
      cause,
    });
    this.name = "ServiceError";
    this.action = action || "Verifique se o serviço está disponível.";
    this.statusCode = 503;
  }
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}
export class MethodError extends Error {
  constructor(message, action) {
    super("Esse método não é permitido para esse endpoint.");
    this.name = "MethodNotAllowed";
    this.action =
      action ||
      "Verifique se o método HTTP enviado é válido para esse endpoint.";
    this.statusCode = 405;
  }
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}
export class ValidationError extends Error {
  constructor(message, action) {
    super(message || "Um erro de validação ocorreu.");
    this.name = "ValidationError";
    this.action = action || "Verifique os dados enviados e tente novamente.";
    this.statusCode = 400;
  }
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}
export class NotFoundError extends Error {
  constructor(message, action) {
    super(message || "Não conseguimos encontrar o que esta buscando.");
    this.name = "NotFoundError";
    this.action = action || "Verifique os dados enviados e tente novamente.";
    this.statusCode = 404;
  }
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}
