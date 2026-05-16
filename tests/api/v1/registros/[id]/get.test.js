import { tipo_registro } from "@prisma/client";
import orchestrator from "tests/orchestrator";

beforeEach(async () => {
  await orchestrator.clearDatabase();
  await orchestrator.seedDatabase();
  await orchestrator.createPerfilWithoutPermissions();
  await orchestrator.waitForAllServices();
});

describe("GET /api/v1/registros", () => {
  describe("Usuario autenticado", () => {
    test("Busca registro valido", async () => {
      const user = await orchestrator.createUser({
        nome: "ADMINISTRADOR",
      });
      const session = await orchestrator.createSession(user.id);

      const registro1 = await orchestrator.createRegistro({
        nome: "Maria Alzira",
        tipo_registro: "F",
        cpf: "22233344455",
        email: "email@exemplo.com",
      });

      const response = await fetch(
        `http://localhost:3000/api/v1/registros/${registro1.id}`,
        {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            Cookie: `sid=${session.token}`,
          },
        },
      );

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        nome: "Maria Alzira",
        cpf: "22233344455",
        email: "email@exemplo.com",
        tipo_registro: "F",
        status: true,
        data_nascimento: responseBody.data_nascimento,
        whatsapp: responseBody.whatsapp,
        cnpj: null,
        ie: null,
        tabela_id: 1,
        cep: responseBody.cep,
        logradouro: responseBody.logradouro,
        numero: responseBody.numero,
        complemento: responseBody.complemento,
        bairro: responseBody.bairro,
        cidade: responseBody.cidade,
        estado: responseBody.estado,
        criado_em: responseBody.criado_em,
        atualizado_em: responseBody.atualizado_em,
      });
      expect(Date.parse(responseBody.criado_em)).not.toBeNaN();
      expect(Date.parse(responseBody.atualizado_em)).not.toBeNaN();

      expect(response.status).toBe(200);
    });
    test("Busca registro invalido", async () => {
      const user = await orchestrator.createUser({
        nome: "ADMINISTRADOR",
      });
      const session = await orchestrator.createSession(user.id);

      const registro1 = await orchestrator.createRegistro({
        nome: "Maria Alzira",
        tipo_registro: "F",
        cpf: "22233344455",
        email: "email@exemplo.com",
      });

      const response = await fetch(
        `http://localhost:3000/api/v1/registros/9999`,
        {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            Cookie: `sid=${session.token}`,
          },
        },
      );

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        message: "Registro não encontrado.",
        name: "NotFoundError",
        status_code: 404,
        action:
          "O registro que você está tentando acessar não existe ou foi removido.",
      });

      expect(response.status).toBe(404);
    });
    test("Busca registro com parametro invalido", async () => {
      const user = await orchestrator.createUser({
        nome: "ADMINISTRADOR",
      });
      const session = await orchestrator.createSession(user.id);

      const registro1 = await orchestrator.createRegistro({
        nome: "Maria Alzira",
        tipo_registro: "F",
        cpf: "22233344455",
        email: "email@exemplo.com",
      });

      const response = await fetch(
        `http://localhost:3000/api/v1/registros/wewe12cdsa@`,
        {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            Cookie: `sid=${session.token}`,
          },
        },
      );

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        message: "Um erro de validação ocorreu.",
        name: "ValidationError",
        status_code: 400,
        action: "Verifique os dados enviados e tente novamente.",
      });

      expect(response.status).toBe(400);
    });
  });

  describe("Usuario autenticado, sem permissao", () => {
    test("Tentativa de acesso", async () => {
      const user = await orchestrator.createUser({
        nome: "ADMINISTRADOR",
        perfil_id: 2,
      });
      const session = await orchestrator.createSession(user.id);

      const response = await fetch(
        "http://localhost:3000/api/v1/registros/999",
        {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            Cookie: `sid=${session.token}`,
          },
        },
      );

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        message: "Acesso não autorizado.",
        name: "UnAuthorizedError",
        status_code: 401,
        action: "Você não tem permissão para acessar esse recurso.",
      });

      expect(response.status).toBe(401);
    });
  });

  describe("Usuario não autenticado", () => {
    test("Tentativa de acesso", async () => {
      const response = await fetch(
        "http://localhost:3000/api/v1/registros/999",
        {
          method: "GET",
          headers: {
            "Content-type": "application/json",
          },
        },
      );

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        message: "Acesso não autorizado.",
        name: "UnAuthorizedError",
        status_code: 401,
        action: "Você precisa estar autenticado para acessar esse recurso.",
      });

      expect(response.status).toBe(401);
    });
  });
});
