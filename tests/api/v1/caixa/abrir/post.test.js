import { tipo_categoria } from "@prisma/client";
import status from "pages/api/v1/status";
import orchestrator from "tests/orchestrator";

beforeEach(async () => {
  await orchestrator.clearDatabase();
  await orchestrator.seedDatabase();
  await orchestrator.createPerfilWithoutPermissions();
  await orchestrator.waitForAllServices();
});

describe("POST /api/v1/caixa/abrir", () => {
  describe("Usuario autenticado", () => {
    test("Com dados obrigatórios válidos, sem entrada", async () => {
      const user = await orchestrator.createUser({
        nome: "ADMINISTRADOR",
      });
      const session = await orchestrator.createSession(user.id);
      const conta = await orchestrator.createConta({
        nome: "CONTA 01",
        saldo_inicial: 1000,
        conta_padrao: true,
      });
      const response = await fetch("http://localhost:3000/api/v1/caixa/abrir", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Cookie: `sid=${session.token}`,
        },
        body: JSON.stringify({
          observacao_abertura: "Caixa aberto com saldo atual  sem entrada",
        }),
      });

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        conta_id: conta.id,
        status: "ABERTO",
        usuario_abertura_id: user.id,
        saldo_inicial: conta.saldo_inicial,
        usuario_abertura: { id: user.id, nome: user.nome },
        aberto_em: responseBody.aberto_em,
        observacao_abertura: "Caixa aberto com saldo atual  sem entrada",
        movimentacoes: responseBody.movimentacoes,
      });
      expect(Array.isArray(responseBody.movimentacoes)).toBe(true);
      expect(responseBody.movimentacoes.length).toBe(0);
      expect(Date.parse(responseBody.aberto_em)).not.toBeNaN();

      expect(response.status).toBe(201);
    });
    test("Com dados obrigatórios válidos, com entrada ", async () => {
      const user = await orchestrator.createUser({
        nome: "ADMINISTRADOR",
      });
      const session = await orchestrator.createSession(user.id);
      const conta = await orchestrator.createConta({
        nome: "CONTA 01",
        saldo_inicial: 1000,
        conta_padrao: true,
      });
      const response = await fetch("http://localhost:3000/api/v1/caixa/abrir", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Cookie: `sid=${session.token}`,
        },
        body: JSON.stringify({
          entrada: 1000, // opcional, se não for enviado, não será criado uma movimentacao de entrada.
          observacao_abertura:
            "Caixa aberto com saldo atual  + entrada de 1000",
        }),
      });

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        conta_id: conta.id,
        status: "ABERTO",
        usuario_abertura_id: user.id,
        saldo_inicial: conta.saldo_inicial,
        usuario_abertura: { id: user.id, nome: user.nome },
        aberto_em: responseBody.aberto_em,
        observacao_abertura: "Caixa aberto com saldo atual  + entrada de 1000",
        movimentacoes: responseBody.movimentacoes,
      });
      expect(Array.isArray(responseBody.movimentacoes)).toBe(true);
      expect(responseBody.movimentacoes.length).toBe(1);

      expect(Date.parse(responseBody.aberto_em)).not.toBeNaN();

      expect(response.status).toBe(201);
    });
    test("Com dados obrigatórios válidos, com entrada negativa ", async () => {
      const user = await orchestrator.createUser({
        nome: "ADMINISTRADOR",
      });
      const session = await orchestrator.createSession(user.id);
      const conta = await orchestrator.createConta({
        nome: "CONTA 01",
        saldo_inicial: 1000,
        conta_padrao: true,
      });
      const response = await fetch("http://localhost:3000/api/v1/caixa/abrir", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Cookie: `sid=${session.token}`,
        },
        body: JSON.stringify({
          entrada: -1000, // opcional, se não for enviado, não será criado uma movimentacao de entrada.
          observacao_abertura:
            "Caixa aberto com saldo atual  + entrada de 1000",
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
    test("Com caixa já aberto", async () => {
      const user = await orchestrator.createUser({
        nome: "ADMINISTRADOR",
      });
      const session = await orchestrator.createSession(user.id);
      await orchestrator.createConta({
        nome: "CONTA 01",
        saldo_inicial: 1000,
        conta_padrao: true,
      });
      await orchestrator.createCaixa({
        observacao_abertura: "Caixa aberto primeiro",
      });
      const response = await fetch("http://localhost:3000/api/v1/caixa/abrir", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Cookie: `sid=${session.token}`,
        },
        body: JSON.stringify({
          usuario_abertura_id: user.id,
          entrada: 1000, // opcional, se não for enviado, não será criado uma movimentacao de entrada.
          observacao_abertura:
            "Caixa aberto com saldo atual  + entrada de 1000",
        }),
      });

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        message: "Já existe um caixa aberto.",
        name: "ApplicationError",
        status_code: 409,
        action: "Feche o caixa atual para abrir um novo caixa.",
      });

      expect(response.status).toBe(409);
    });
    test("Sem uma conta padrão ativada", async () => {
      const user = await orchestrator.createUser({
        nome: "ADMINISTRADOR",
      });
      const session = await orchestrator.createSession(user.id);
      await orchestrator.createConta({
        nome: "CONTA 01",
        saldo_inicial: 1000,
      });

      const response = await fetch("http://localhost:3000/api/v1/caixa/abrir", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Cookie: `sid=${session.token}`,
        },
        body: JSON.stringify({
          entrada: 1000, // opcional, se não for enviado, não será criado uma movimentacao de entrada.
          observacao_abertura:
            "Caixa aberto com saldo atual  + entrada de 1000",
        }),
      });

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        message:
          "É necessário ter uma conta padrão ativada para abrir o caixa.",
        name: "ApplicationError",
        status_code: 409,
        action:
          "Vá para as configurações de contas e ative uma conta como padrão para abrir o caixa.",
      });

      expect(response.status).toBe(409);
    });
    test("Com a conta padrão com saldo negativo", async () => {
      const user = await orchestrator.createUser({
        nome: "ADMINISTRADOR",
      });
      const session = await orchestrator.createSession(user.id);
      await orchestrator.createConta({
        nome: "CONTA 01",
        saldo_inicial: -1,
        conta_padrao: true,
      });

      const response = await fetch("http://localhost:3000/api/v1/caixa/abrir", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Cookie: `sid=${session.token}`,
        },
        body: JSON.stringify({}),
      });

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        message: "Não é permitido abrir um caixa com saldo negativo.",
        name: "ApplicationError",
        status_code: 409,
        action:
          "Verifique o saldo da conta padrão, se estiver negativo, corrija o saldo para um valor positivo para poder abrir o caixa.",
      });

      expect(response.status).toBe(409);
    });
  });

  describe("Usuario autenticado, sem permissao", () => {
    test("Com dados obrigatórios válidos", async () => {
      const user = await orchestrator.createUser({
        nome: "ADMINISTRADOR",
        perfil_id: 2,
      });
      const session = await orchestrator.createSession(user.id);

      const response = await fetch("http://localhost:3000/api/v1/caixa/abrir", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Cookie: `sid=${session.token}`,
        },
        body: JSON.stringify({
          nome: "Venda de sucata",
          tipo_categoria: "RECEITA",
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
  describe("Usuario não autenticado", () => {
    test("Com dados obrigatórios válidos", async () => {
      const response = await fetch("http://localhost:3000/api/v1/caixa/abrir", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          nome: "Venda de sucata",
          tipo_categoria: "RECEITA",
        }),
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
