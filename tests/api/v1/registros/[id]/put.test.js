import { tipo_registro } from "@prisma/client";
import orchestrator from "tests/orchestrator";
import { version as uuidVersion } from "uuid";

beforeAll(async () => {
  await orchestrator.clearDatabase();
  await orchestrator.seedDatabase();
  await orchestrator.createPerfilWithoutPermissions();
  await orchestrator.waitForAllServices();
});

describe("PUT /api/v1/registros/id", () => {
  describe("Usuario autenticado", () => {
    describe("Pessoa física", () => {
      test("Altera todos dados possiveis", async () => {
        const user = await orchestrator.createUser({
          nome: "ADMINISTRADOR",
        });
        const session = await orchestrator.createSession(user.id);

        const registro = await orchestrator.createRegistro({
          nome: "REGISTRO01",
          cpf: "12345678900",
          tipo_registro: "F",
        });

        const response = await fetch(
          `http://localhost:3000/api/v1/registros/${registro.id}`,
          {
            method: "PUT",
            headers: {
              "Content-type": "application/json",
              Cookie: `sid=${session.token}`,
            },
            body: JSON.stringify({
              nome: "Luis CLaudio Duarte 2",
              cpf: "12345678900",
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
          },
        );

        const responseBody = await response.json();

        expect(responseBody).toEqual({
          id: responseBody.id,
          nome: "Luis CLaudio Duarte 2",
          cpf: "12345678900",
          email: "luis.claudio@duarte.com",
          tipo_registro: "F",
          status: true,
          data_nascimento: "2003-08-06T00:00:00.000Z",
          whatsapp: "11987654321",
          cnpj: responseBody.cnpj,
          ie: responseBody.ie,
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
        expect(response.status).toBe(200);
      });
      test("Registro não existente", async () => {
        const user = await orchestrator.createUser({
          nome: "ADMINISTRADOR",
        });
        const session = await orchestrator.createSession(user.id);
        const response = await fetch(
          "http://localhost:3000/api/v1/registros/99999999",
          {
            method: "PUT",
            headers: {
              "Content-type": "application/json",
              Cookie: `sid=${session.token}`,
            },
            body: JSON.stringify({
              nome: "Luis CLaudio Duarte",
              cpf: "18282834577",
              tipo_registro: "F",
            }),
          },
        );

        const responseBody = await response.json();

        expect(responseBody).toEqual({
          name: "ValidationError",
          message: "Registro não encontrado.",
          action: "Verifique os dados enviados e tente novamente.",
          status_code: 400,
        });
        expect(response.status).toEqual(400);
      });
      test("Registro já existente", async () => {
        const user = await orchestrator.createUser({
          nome: "ADMINISTRADOR",
        });
        const registro1 = await orchestrator.createRegistro({
          nome: "REGISTRO01",
          cpf: "12345678989",
          tipo_registro: "F",
        });
        const registro2 = await orchestrator.createRegistro({
          nome: "REGISTRO02",
          cpf: "12345678999",
          tipo_registro: "F",
        });

        const session = await orchestrator.createSession(user.id);
        const response = await fetch(
          `http://localhost:3000/api/v1/registros/${registro1.id}`,
          {
            method: "PUT",
            headers: {
              "Content-type": "application/json",
              Cookie: `sid=${session.token}`,
            },
            body: JSON.stringify({
              cpf: "12345678999",
            }),
          },
        );
        const responseBody = await response.json();
        expect(responseBody).toEqual({
          name: "ValidationError",
          message: "O CPF ou CNPJ informado já está em uso por outro registro.",
          action: "Verifique os dados enviados e tente novamente.",
          status_code: 400,
        });
        expect(response.status).toEqual(400);
      });
      //   test("Alterar CPF", async () => {
      //     const user = await orchestrator.createUser({
      //       nome: "ADMINISTRADOR",
      //     });
      //     const session = await orchestrator.createSession(user.id);
      //     const response = await fetch("http://localhost:3000/api/v1/registros/", {
      //       method: "POST",
      //       headers: {
      //         "Content-type": "application/json",
      //         Cookie: `sid=${session.token}`,
      //       },
      //       body: JSON.stringify({
      //         nome: "Luis CLaudio Duarte",
      //         cpf: "18282834577343",
      //         tipo_registro: "F",
      //       }),
      //     });

      //     const responseBody = await response.json();

      //     expect(responseBody).toEqual({
      //       message: "Um erro de validação ocorreu.",
      //       name: "ValidationError",
      //       status_code: 400,
      //       action: "Verifique os dados enviados e tente novamente.",
      //     });

      //     expect(response.status).toBe(400);
      //   });
    });
    describe("Pessoa jurídica", () => {
      test("Altera todos dados possiveis", async () => {
        const user = await orchestrator.createUser({
          nome: "ADMINISTRADOR",
        });
        const session = await orchestrator.createSession(user.id);
        const registro = await orchestrator.createRegistro({
          nome: "EMPRESA REGISTRO 01",
          cnpj: "12345098000120",
          tipo_registro: "J",
          ie: "123456789",
        });

        const response = await fetch(
          `http://localhost:3000/api/v1/registros/${registro.id}`,
          {
            method: "PUT",
            headers: {
              "Content-type": "application/json",
              Cookie: `sid=${session.token}`,
            },
            body: JSON.stringify({
              nome: "EMPRESA REGISTRO 01 LTDA",
              cnpj: "12345098000120",
              tipo_registro: "J",
              email: "luis.claudio@duarte.com",
              data_nascimento: "2003-08-06",
              ie: "123456790",
              whatsapp: "11987654321",
              cep: "12345678",
              logradouro: "Rua Exemplo",
              numero: "123",
              complemento: "Apto 45",
              bairro: "Bairro Exemplo",
              cidade: "Cidade Exemplo",
              estado: "Estado Exemplo",
            }),
          },
        );

        const responseBody = await response.json();

        expect(responseBody).toEqual({
          id: responseBody.id,
          nome: "EMPRESA REGISTRO 01 LTDA",
          cpf: responseBody.cpf,
          email: "luis.claudio@duarte.com",
          tipo_registro: "J",
          status: true,
          data_nascimento: "2003-08-06T00:00:00.000Z",
          whatsapp: "11987654321",
          cnpj: "12345098000120",
          ie: "123456790",
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
        expect(response.status).toBe(200);
      });

      test("Registro já existente", async () => {
        const user = await orchestrator.createUser({
          nome: "ADMINISTRADOR",
        });
        const registro2 = await orchestrator.createRegistro({
          nome: "EMPRESA REGISTRO 02",
          cnpj: "00000000000002",
          tipo_registro: "J",
          ie: "123457698",
        });
        const registro1 = await orchestrator.createRegistro({
          nome: "EMPRESA REGISTRO 01",
          cnpj: "00000000000001",
          tipo_registro: "J",
          ie: "123456789",
        });

        const session = await orchestrator.createSession(user.id);
        const response = await fetch(
          `http://localhost:3000/api/v1/registros/${registro1.id}`,
          {
            method: "PUT",
            headers: {
              "Content-type": "application/json",
              Cookie: `sid=${session.token}`,
            },
            body: JSON.stringify({
              cnpj: "00000000000002",
            }),
          },
        );
        const responseBody = await response.json();
        expect(responseBody).toEqual({
          name: "ValidationError",
          message: "O CPF ou CNPJ informado já está em uso por outro registro.",
          action: "Verifique os dados enviados e tente novamente.",
          status_code: 400,
        });
        expect(response.status).toEqual(400);
      });
    });

    test("Envio de CPF e CNPJ juntos", async () => {
      const user = await orchestrator.createUser({
        nome: "ADMINISTRADOR",
      });
      const registro = await orchestrator.createRegistro({
        nome: "REGISTRO01",
        cpf: "12345678890",
        tipo_registro: "F",
      });
      const session = await orchestrator.createSession(user.id);
      const response = await fetch(
        `http://localhost:3000/api/v1/registros/${registro.id}`,
        {
          method: "PUT",
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
        },
      );

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "Você não pode ter um registro com CPF e CNPJ ao mesmo tempo.",
        action: "Verifique os dados enviados e tente novamente.",
        status_code: 400,
      });
      expect(response.status).toEqual(400);
    });

    describe("Usuario autenticado, sem permissao", () => {
      test("Tenta alterar registro sem permissão", async () => {
        const user = await orchestrator.createUser({
          nome: "ADMINISTRADOR",
          perfil_id: 2,
        });
        const registro = await orchestrator.createRegistro({
          nome: "REGISTRO01",
          cpf: "12345673290",
          tipo_registro: "F",
        });
        const session = await orchestrator.createSession(user.id);
        const response = await fetch(
          `http://localhost:3000/api/v1/registros/${registro.id}`,
          {
            method: "PUT",
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
  });
  describe("Usuario não autenticado", () => {
    test("Com dados obrigatórios válidos", async () => {
      const response = await fetch(
        "http://localhost:3000/api/v1/registros/12",
        {
          method: "PUT",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            nome: "Luis CLaudio Duarte",
            tipo_registro: "F",
            cpf: "1828283457",
          }),
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
