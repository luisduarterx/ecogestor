import { tipo_registro } from "@prisma/client";
import orchestrator from "tests/orchestrator";
import { version as uuidVersion } from "uuid";

beforeAll(async () => {
  await orchestrator.clearDatabase();
  await orchestrator.seedDatabase();
  await orchestrator.createPerfilWithoutPermissions();
  await orchestrator.waitForAllServices();
});

describe("POST /api/v1/registros", () => {
  describe("Usuario autenticado", () => {
    describe("Pessoa física", () => {
      test("Com dados obrigatórios válidos", async () => {
        const user = await orchestrator.createUser({
          nome: "ADMINISTRADOR",
        });
        const session = await orchestrator.createSession(user.id);
        const response = await fetch("http://localhost:3000/api/v1/registros", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            Cookie: `sid=${session.token}`,
          },
          body: JSON.stringify({
            nome: "Luis CLaudio Duarte",
            cpf: "18282834577",
            tipo_registro: "F",
          }),
        });

        const responseBody = await response.json();

        expect(responseBody).toEqual({
          id: responseBody.id,
          nome: "Luis CLaudio Duarte",
          cpf: "18282834577",
          email: responseBody.email,
          tipo_registro: "F",
          status: true,
          data_nascimento: responseBody.data_nascimento,
          whatsapp: responseBody.whatsapp,
          cnpj: responseBody.cnpj,
          ie: responseBody.ie,
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
        expect(response.status).toBe(201);
      });
      test("Com dados completos", async () => {
        const user = await orchestrator.createUser({
          nome: "ADMINISTRADOR",
        });
        const session = await orchestrator.createSession(user.id);
        const response = await fetch("http://localhost:3000/api/v1/registros", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            Cookie: `sid=${session.token}`,
          },
          body: JSON.stringify({
            nome: "Luis CLaudio Duarte 2",
            cpf: "12345678901",
            tipo_registro: "F",
            email: "luis.claudio@duarte.com",
            data_nascimento: "2003-08-06",
            whatsapp: "11987654321",
            cep: "12345678",
            logradouro: "Rua Exemplo",
            numero: "123",
            complemento: "Apto 45",
            bairro: "Bairro Exemplo",
            cidade: "Cidade Exemplo",
            estado: "Estado Exemplo",
          }),
        });

        const responseBody = await response.json();

        expect(responseBody).toEqual({
          id: responseBody.id,
          nome: "Luis CLaudio Duarte 2",
          cpf: "12345678901",
          email: "luis.claudio@duarte.com",
          tipo_registro: "F",
          status: true,
          data_nascimento: "2003-08-06T00:00:00.000Z",
          whatsapp: "11987654321",
          cnpj: responseBody.cnpj,
          ie: responseBody.ie,
          cep: responseBody.cep,
          logradouro: "Rua Exemplo",
          numero: "123",
          complemento: "Apto 45",
          bairro: "Bairro Exemplo",
          cidade: "Cidade Exemplo",
          estado: "Estado Exemplo",
          criado_em: responseBody.criado_em,
          atualizado_em: responseBody.atualizado_em,
        });

        expect(Date.parse(responseBody.criado_em)).not.toBeNaN();
        expect(Date.parse(responseBody.atualizado_em)).not.toBeNaN();
        expect(response.status).toBe(201);
      });
      test("Registro já existente", async () => {
        const user = await orchestrator.createUser({
          nome: "ADMINISTRADOR",
        });
        const session = await orchestrator.createSession(user.id);
        const response = await fetch("http://localhost:3000/api/v1/registros", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            Cookie: `sid=${session.token}`,
          },
          body: JSON.stringify({
            nome: "Luis CLaudio Duarte",
            cpf: "18282834577",
            tipo_registro: "F",
          }),
        });

        const responseBody = await response.json();

        expect(responseBody).toEqual({
          name: "ValidationError",
          message: "O registro informado já existe.",
          action: "Verifique os dados enviados e tente novamente.",
          status_code: 400,
        });
        expect(response.status).toEqual(400);
      });
      test("Com cpf inválido", async () => {
        const user = await orchestrator.createUser({
          nome: "ADMINISTRADOR",
        });
        const session = await orchestrator.createSession(user.id);
        const response = await fetch("http://localhost:3000/api/v1/registros", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            Cookie: `sid=${session.token}`,
          },
          body: JSON.stringify({
            nome: "Luis CLaudio Duarte",
            cpf: "18282834577343",
            tipo_registro: "F",
          }),
        });

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
    describe("Pessoa jurídica", () => {
      test("Com dados obrigatórios válidos", async () => {
        const user = await orchestrator.createUser({
          nome: "ADMINISTRADOR",
        });
        const session = await orchestrator.createSession(user.id);
        const response = await fetch("http://localhost:3000/api/v1/registros", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            Cookie: `sid=${session.token}`,
          },
          body: JSON.stringify({
            nome: "Nova Empresa LTDA",
            tipo_registro: "J",
            cnpj: "43736082000140",
          }),
        });

        const responseBody = await response.json();

        expect(responseBody).toEqual({
          id: responseBody.id,
          nome: "Nova Empresa LTDA",
          cnpj: "43736082000140",
          email: responseBody.email,
          tipo_registro: "J",
          status: true,
          data_nascimento: responseBody.data_nascimento,
          whatsapp: responseBody.whatsapp,
          cpf: responseBody.cpf,
          ie: responseBody.ie,
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
        expect(response.status).toBe(201);
      });
      test("Com dados completos", async () => {
        const user = await orchestrator.createUser({
          nome: "ADMINISTRADOR",
        });
        const session = await orchestrator.createSession(user.id);
        const response = await fetch("http://localhost:3000/api/v1/registros", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            Cookie: `sid=${session.token}`,
          },
          body: JSON.stringify({
            nome: "Empresa Nova",
            cnpj: "12345678901234",
            tipo_registro: "J",
            email: "luis.claudio@duarte.com",
            ie: "123456789",
            whatsapp: "11987654321",
            cep: "12345678",
            logradouro: "Rua Exemplo",
            numero: "123",
            complemento: "Apto 45",
            bairro: "Bairro Exemplo",
            cidade: "Cidade Exemplo",
            estado: "Estado Exemplo",
          }),
        });

        const responseBody = await response.json();

        expect(responseBody).toEqual({
          id: responseBody.id,
          nome: "Empresa Nova",
          cpf: responseBody.cpf,
          email: "luis.claudio@duarte.com",
          tipo_registro: "J",
          status: true,
          data_nascimento: responseBody.data_nascimento,
          whatsapp: "11987654321",
          cnpj: "12345678901234",
          ie: "123456789",
          cep: "12345678",
          logradouro: "Rua Exemplo",
          numero: "123",
          complemento: "Apto 45",
          bairro: "Bairro Exemplo",
          cidade: "Cidade Exemplo",
          estado: "Estado Exemplo",
          criado_em: responseBody.criado_em,
          atualizado_em: responseBody.atualizado_em,
        });

        expect(Date.parse(responseBody.criado_em)).not.toBeNaN();
        expect(Date.parse(responseBody.atualizado_em)).not.toBeNaN();
        expect(response.status).toBe(201);
      });
      test("Registro já existente", async () => {
        const user = await orchestrator.createUser({
          nome: "ADMINISTRADOR",
        });
        const session = await orchestrator.createSession(user.id);
        const response = await fetch("http://localhost:3000/api/v1/registros", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            Cookie: `sid=${session.token}`,
          },
          body: JSON.stringify({
            nome: "Empresa Nova",
            cnpj: "12345678901234",
            tipo_registro: "J",
          }),
        });

        const responseBody = await response.json();

        expect(responseBody).toEqual({
          name: "ValidationError",
          message: "O registro informado já existe.",
          action: "Verifique os dados enviados e tente novamente.",
          status_code: 400,
        });
        expect(response.status).toEqual(400);
      });
      test("Com cnpj inválido", async () => {
        const user = await orchestrator.createUser({
          nome: "ADMINISTRADOR",
        });
        const session = await orchestrator.createSession(user.id);
        const response = await fetch("http://localhost:3000/api/v1/registros", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            Cookie: `sid=${session.token}`,
          },
          body: JSON.stringify({
            nome: "Nova Empresa LTDA",
            tipo_registro: "J",
            cnpj: "437360820001",
          }),
        });

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

    test("Envio de CPF e CNPJ juntos", async () => {
      const user = await orchestrator.createUser({
        nome: "ADMINISTRADOR",
      });
      const session = await orchestrator.createSession(user.id);
      const response = await fetch("http://localhost:3000/api/v1/registros", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Cookie: `sid=${session.token}`,
        },
        body: JSON.stringify({
          nome: "Luis CLaudio Duarte",
          cpf: "18282834577",
          tipo_registro: "F",
          email: "luis.claudio@duarte.com",
          data_nascimento: "2003-08-06",
          whatsapp: "11987654321",
          cnpj: "43736082000140",
          ie: "123456789",
          cep: "12345678",
          logradouro: "Rua Exemplo",
          numero: "123",
          complemento: "Apto 45",
          bairro: "Bairro Exemplo",
          cidade: "Cidade Exemplo",
          estado: "Estado Exemplo",
        }),
      });

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message:
          "Não é permitido criar um registro com CPF e CNPJ preenchidos ao mesmo tempo.",
        action: "Verifique os dados enviados e tente novamente.",
        status_code: 400,
      });
      expect(response.status).toEqual(400);
    });

    test("Sem body dentro da request", async () => {
      const user = await orchestrator.createUser({
        nome: "ADMINISTRADOR",
      });
      const session = await orchestrator.createSession(user.id);
      const response = await fetch("http://localhost:3000/api/v1/registros", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Cookie: `sid=${session.token}`,
        },
      });

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
    test("Com dados obrigatórios válidos", async () => {
      const user = await orchestrator.createUser({
        nome: "ADMINISTRADOR",
        perfil_id: 2,
      });
      const session = await orchestrator.createSession(user.id);
      const response = await fetch("http://localhost:3000/api/v1/registros", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Cookie: `sid=${session.token}`,
        },
        body: JSON.stringify({
          nome: "Luis CLaudio Duarte",
          tipo_registro: "F",
          cpf: "1828283457",
        }),
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
});
