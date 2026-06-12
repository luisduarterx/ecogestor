import orchestrator from "tests/orchestrator";

beforeEach(async () => {
  await orchestrator.clearDatabase();
  await orchestrator.seedDatabase();
  await orchestrator.createPerfilWithoutPermissions();
  await orchestrator.waitForAllServices();
});

describe("GET /api/v1/caixa/[id]/resumo", () => {
  describe("Usuario autenticado", () => {
    test("Consultar resumo de caixa antes de fechar", async () => {
      const user = await orchestrator.createUser({
        nome: "ADMINISTRADOR",
      });
      const session = await orchestrator.createSession(user.id);
      const conta = await orchestrator.createConta({
        nome: "CONTA 01",
        saldo_inicial: 1000,
        conta_padrao: true,
      });
      const conta_origem = await orchestrator.createConta({
        nome: "CONTA ORIGEM",
        saldo_inicial: 1000,
      });
      const caixa = await orchestrator.createCaixa({
        user_id: user.id,

        observacao_abertura: "Caixa aberto para teste de fechamento",
      });
      await orchestrator.createTransferencia({
        conta_origem_id: conta_origem.id,
        conta_destino_id: conta.id,
        valor: 1000,
        user_id: user.id,
        caixa_id: caixa.id,
        descricao: "Transferencia para teste de resumo",
      });
      const response = await fetch(
        `http://localhost:3000/api/v1/caixa/${caixa.id}/resumo`,
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
        conta_id: conta.id,
        status: "ABERTO",
        relatorio: {
          total_entrada: 1000,
          total_saida: 0,
          quantidade_movimentacoes: 1,
        },
        saldo_esperado: 2000,
        usuario_abertura_id: user.id,
        saldo_inicial: conta.saldo_inicial,
        usuario_abertura: { id: user.id, nome: user.nome },
        aberto_em: responseBody.aberto_em,
        observacao_abertura: "Caixa aberto para teste de fechamento",
        movimentacoes: responseBody.movimentacoes,
      });
      expect(Array.isArray(responseBody.movimentacoes)).toBe(true);
      expect(responseBody.movimentacoes.length).toBe(1);
      expect(Date.parse(responseBody.aberto_em)).not.toBeNaN();

      expect(response.status).toBe(200);
    });
    test("Consulta de resumo de caixa inexistente", async () => {
      const user = await orchestrator.createUser({
        nome: "ADMINISTRADOR",
      });
      const session = await orchestrator.createSession(user.id);

      const response = await fetch(
        "http://localhost:3000/api/v1/caixa/99999/resumo",
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
        message: "Caixa não encontrado.",
        name: "NotFoundError",
        status_code: 404,
        action: "Verifique o ID do caixa e tente novamente.",
      });

      expect(response.status).toBe(404);
    });
    test("Consulta de resumo de caixa fechado", async () => {
      const user = await orchestrator.createUser({
        nome: "ADMINISTRADOR",
      });
      const session = await orchestrator.createSession(user.id);
      const conta = await orchestrator.createConta({
        nome: "CONTA 01",
        saldo_inicial: 1000,
        conta_padrao: true,
      });
      const caixaFechado = await orchestrator.createCaixa({
        conta_id: conta.id,
        user_id: user.id,
        entrada: 1000,
        observacao_abertura: "Caixa aberto para teste de fechamento",
        status: "FECHADO",
      });
      const response = await fetch(
        `http://localhost:3000/api/v1/caixa/${caixaFechado.id}/resumo`,
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
        message: "Não é possível consultar o resumo de um caixa fechado.",
        name: "ValidationError",
        status_code: 400,
        action: "Verifique os dados enviados e tente novamente.",
      });

      expect(response.status).toBe(400);
    });
    test("Consulta de resumo de caixa inválido", async () => {
      const user = await orchestrator.createUser({
        nome: "ADMINISTRADOR",
      });
      const session = await orchestrator.createSession(user.id);

      const response = await fetch(
        "http://localhost:3000/api/v1/caixa/nao-valido/resumo",
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
    test("Com dados obrigatórios válidos", async () => {
      const user = await orchestrator.createUser({
        nome: "ADMINISTRADOR",
        perfil_id: 2,
      });
      const session = await orchestrator.createSession(user.id);

      const response = await fetch(
        "http://localhost:3000/api/v1/caixa/32/resumo",
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
    test("Com dados obrigatórios válidos", async () => {
      const response = await fetch(
        "http://localhost:3000/api/v1/caixa/32/resumo",
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
