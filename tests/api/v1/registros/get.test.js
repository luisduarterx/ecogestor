import { tipo_registro } from "@prisma/client";
import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.clearDatabase();
  await orchestrator.seedDatabase();
  await orchestrator.createPerfilWithoutPermissions();
  await orchestrator.waitForAllServices();
});

describe("GET /api/v1/registros", () => {
  describe("Usuario autenticado", () => {
    test("Busca os registros com paginação por tipo de registro e nome", async () => {
      const user = await orchestrator.createUser({
        nome: "ADMINISTRADOR",
      });
      const session = await orchestrator.createSession(user.id);
      const registro1 = await orchestrator.createRegistro({
        nome: "Maria Alzira",
        tipo_registro: "F",
        cpf: "11145678211",
      });
      const registro2 = await orchestrator.createRegistro({
        nome: "Marlene Beze",
        tipo_registro: "J",
        cnpj: "12345878043199",
      });
      const registro3 = await orchestrator.createRegistro({
        nome: "Allison Argent",
        tipo_registro: "F",
        cpf: "98798487100",
      });

      const response = await fetch(
        "http://localhost:3000/api/v1/registros?page=1&limit=10&tipo=F&search=Al",
        {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            Cookie: `sid=${session.token}`,
          },
        },
      );

      const responseBody = await response.json();

      expect(Array.isArray(responseBody)).toBe(true);
      expect(responseBody).toHaveLength(2);

      expect(response.status).toBe(200);
    });
    test("Busca os registros com paginação, por tipo de registro", async () => {
      const user = await orchestrator.createUser({
        nome: "ADMINISTRADOR",
      });
      const session = await orchestrator.createSession(user.id);
      const registro1 = await orchestrator.createRegistro({
        tipo_registro: "F",
        cpf: "12345678211",
      });
      const registro2 = await orchestrator.createRegistro({
        tipo_registro: "J",
        cnpj: "12345678043199",
      });
      const registro3 = await orchestrator.createRegistro({
        tipo_registro: "F",
        cpf: "98765487100",
      });

      const response = await fetch(
        "http://localhost:3000/api/v1/registros?page=1&limit=10&tipo=J",
        {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            Cookie: `sid=${session.token}`,
          },
        },
      );

      const responseBody = await response.json();
      expect(Array.isArray(responseBody)).toBe(true);
      expect(responseBody).toHaveLength(2);

      expect(response.status).toBe(200);
    });
    test("Busca todos os registros com paginação", async () => {
      const user = await orchestrator.createUser({
        nome: "ADMINISTRADOR",
      });
      const session = await orchestrator.createSession(user.id);
      const registro1 = await orchestrator.createRegistro({
        tipo_registro: "F",
        cpf: "12345678901",
      });
      const registro2 = await orchestrator.createRegistro({
        tipo_registro: "J",
        cnpj: "12345678000199",
      });
      const registro3 = await orchestrator.createRegistro({
        tipo_registro: "F",
        cpf: "98765432100",
      });
      const registro4 = await orchestrator.createRegistro({
        tipo_registro: "J",
        cnpj: "98765432000188",
      });
      const registro5 = await orchestrator.createRegistro({
        tipo_registro: "F",
        cpf: "11122233344",
      });
      const registro6 = await orchestrator.createRegistro({
        tipo_registro: "J",
        cnpj: "11122233000177",
      });
      const registro7 = await orchestrator.createRegistro({
        tipo_registro: "F",
        cpf: "55566677788",
      });
      const registro8 = await orchestrator.createRegistro({
        tipo_registro: "J",
        cnpj: "55566677000166",
      });
      const registro9 = await orchestrator.createRegistro({
        tipo_registro: "F",
        cpf: "99988877766",
      });
      const registro10 = await orchestrator.createRegistro({
        tipo_registro: "J",
        cnpj: "99988877000155",
      });
      const registro11 = await orchestrator.createRegistro({
        tipo_registro: "F",
        cpf: "22233344455",
      });

      const response = await fetch(
        "http://localhost:3000/api/v1/registros?page=1&limit=10",
        {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            Cookie: `sid=${session.token}`,
          },
        },
      );

      const responseBody = await response.json();

      expect(Array.isArray(responseBody)).toBe(true);
      expect(responseBody).toHaveLength(10);

      expect(response.status).toBe(200);
    });
    test("Busca os registros com paginação e busca por nome", async () => {
      const user = await orchestrator.createUser({
        nome: "ADMINISTRADOR",
      });
      const session = await orchestrator.createSession(user.id);
      const registro1 = await orchestrator.createRegistro({
        nome: "Luis felipe carvalho",
        tipo_registro: "F",
        cpf: "12345678999",
      });
      const registro2 = await orchestrator.createRegistro({
        nome: "carlos luiz oliveira",
        tipo_registro: "J",
        cnpj: "12345678000129",
      });
      const registro3 = await orchestrator.createRegistro({
        nome: "Zhaneide Hularan",
        tipo_registro: "F",
        cpf: "98765432101",
      });
      const registro4 = await orchestrator.createRegistro({
        tipo_registro: "J",
        cnpj: "98765432000178",
      });

      const response = await fetch(
        "http://localhost:3000/api/v1/registros?page=1&limit=10&search=lui",
        {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            Cookie: `sid=${session.token}`,
          },
        },
      );

      const responseBody = await response.json();

      expect(Array.isArray(responseBody)).toBe(true);
      expect(responseBody).toHaveLength(2);

      expect(response.status).toBe(200);
    });
    test("Busca registro inexistente", async () => {
      const user = await orchestrator.createUser({
        nome: "ADMINISTRADOR",
      });
      const session = await orchestrator.createSession(user.id);

      const response = await fetch(
        "http://localhost:3000/api/v1/registros?page=1&limit=10&search=1231232124",
        {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            Cookie: `sid=${session.token}`,
          },
        },
      );

      const responseBody = await response.json();

      expect(Array.isArray(responseBody)).toBe(true);
      expect(responseBody).toHaveLength(0);

      expect(response.status).toBe(200);
    });
    test("Busca todos registro inativos", async () => {
      const user = await orchestrator.createUser({
        nome: "ADMINISTRADOR",
      });
      const session = await orchestrator.createSession(user.id);
      const registro1 = await orchestrator.createRegistro({
        nome: "Luis felipe carvalho",
        tipo_registro: "F",
        cpf: "12345678132",
        status: false,
      });

      const response = await fetch(
        "http://localhost:3000/api/v1/registros?page=1&limit=10&status=false",
        {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            Cookie: `sid=${session.token}`,
          },
        },
      );

      const responseBody = await response.json();

      expect(Array.isArray(responseBody)).toBe(true);
      expect(responseBody).toHaveLength(1);

      expect(response.status).toBe(200);
    });
  });

  describe("Usuario autenticado, sem permissao", () => {
    test("Tentativa de acesso", async () => {
      const user = await orchestrator.createUser({
        nome: "ADMINISTRADOR",
        perfil_id: 2,
      });
      const session = await orchestrator.createSession(user.id);

      const response = await fetch("http://localhost:3000/api/v1/registros", {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Cookie: `sid=${session.token}`,
        },
      });

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
      const response = await fetch("http://localhost:3000/api/v1/registros", {
        method: "GET",
        headers: {
          "Content-type": "application/json",
        },
      });

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
