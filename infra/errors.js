export class InternalServerError extends Error {
  constructor(cause, message, action) {
    super(message, {
      cause,
    });
    this.name = "InternalServerError";
    this.action = action || "Entre em contato com o suporte.";
    this.statusCode = 500;
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
    this.action = action || "Este serviço está indisponivel no momento.";
    this.statusCode = 500;
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
