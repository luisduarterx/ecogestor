import orchestrator from "tests/orchestrator";

beforeEach(async () => {
  await orchestrator.clearDatabase();
  await orchestrator.seedDatabase();
  await orchestrator.createPerfilWithoutPermissions();
  await orchestrator.waitForAllServices();
});

describe("POST /api/v1/caixa/[id]/fechar", () => {
  describe("Usuario autenticado", () => {
    test("Fechar caixa sem diferenca de valor", async () => {
      const user = await orchestrator.createUser({
        nome: "ADMINISTRADOR",
      });
      const session = await orchestrator.createSession(user.id);
      const conta = await orchestrator.createConta({
        nome: "CONTA 01",
        saldo_inicial: 1000,
        conta_padrao: true,
      });
      const caixa = await orchestrator.createCaixa({
        user_id: user.id,
        entrada: 1000,
        observacao_abertura: "Caixa aberto para teste de fechamento",
      });
      const response = await fetch(
        `http://localhost:3000/api/v1/caixa/${caixa.id}/fechar`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            Cookie: `sid=${session.token}`,
          },
          body: JSON.stringify({
            saldo_final_informado: 2000,
            observacao_fechamento: "Fechamento de caixa para teste",
          }),
        },
      );

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        conta_id: conta.id,
        status: "FECHADO",
        relatorio: {
          total_entrada: 1000,
          total_saida: 0,
          quantidade_movimentacoes: 1,
        },

        saldo_final_sistema: 2000,
        saldo_final_informado: 2000,
        diferenca: 0,
        fechado_em: responseBody.fechado_em,
        usuario_fechamento: { id: user.id, nome: user.nome },
        observacao_fechamento: "Fechamento de caixa para teste",
        usuario_abertura_id: user.id,
        saldo_inicial: conta.saldo_inicial,
        usuario_abertura: { id: user.id, nome: user.nome },
        aberto_em: responseBody.aberto_em,
        observacao_abertura: "Caixa aberto para teste de fechamento",
        movimentacoes: responseBody.movimentacoes,
      });
      expect(Array.isArray(responseBody.movimentacoes)).toBe(true);
      expect(responseBody.movimentacoes.length).toBe(1);
      expect(responseBody.movimentacoes.length).toBe(1);
      expect(Date.parse(responseBody.aberto_em)).not.toBeNaN();
      expect(Date.parse(responseBody.fechado_em)).not.toBeNaN();

      expect(response.status).toBe(201);
    });
    test("Fechar caixa com diferenca de valor a menos", async () => {
      const user = await orchestrator.createUser({
        nome: "ADMINISTRADOR",
      });
      const session = await orchestrator.createSession(user.id);
      const conta = await orchestrator.createConta({
        nome: "CONTA 01",
        saldo_inicial: 1000,
        conta_padrao: true,
      });
      const caixa = await orchestrator.createCaixa({
        user_id: user.id,
        entrada: 1000,
        observacao_abertura: "Caixa aberto para teste de fechamento",
      });
      const response = await fetch(
        `http://localhost:3000/api/v1/caixa/${caixa.id}/fechar`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            Cookie: `sid=${session.token}`,
          },
          body: JSON.stringify({
            saldo_final_informado: 1990,
            observacao_fechamento: "Fechamento de caixa para teste",
          }),
        },
      );

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        conta_id: conta.id,
        status: "FECHADO",
        relatorio: {
          total_entrada: 1000,
          total_saida: 0,
          quantidade_movimentacoes: 2,
        },

        saldo_final_sistema: 2000,
        saldo_final_informado: 1990,
        diferenca: -10,
        fechado_em: responseBody.fechado_em,
        usuario_fechamento: { id: user.id, nome: user.nome },
        observacao_fechamento: "Fechamento de caixa para teste",
        usuario_abertura_id: user.id,
        saldo_inicial: conta.saldo_inicial,
        usuario_abertura: { id: user.id, nome: user.nome },
        aberto_em: responseBody.aberto_em,
        observacao_abertura: "Caixa aberto para teste de fechamento",
        movimentacoes: responseBody.movimentacoes,
      });
      expect(Array.isArray(responseBody.movimentacoes)).toBe(true);
      expect(responseBody.movimentacoes.length).toBe(2);
      expect(Date.parse(responseBody.aberto_em)).not.toBeNaN();
      expect(Date.parse(responseBody.fechado_em)).not.toBeNaN();

      expect(response.status).toBe(201);
    });
    test("Fechar caixa com diferenca de valor a mais", async () => {
      const user = await orchestrator.createUser({
        nome: "ADMINISTRADOR",
      });
      const session = await orchestrator.createSession(user.id);
      const conta = await orchestrator.createConta({
        nome: "CONTA 01",
        saldo_inicial: 1000,
        conta_padrao: true,
      });
      const caixa = await orchestrator.createCaixa({
        user_id: user.id,
        entrada: 1000,
        observacao_abertura: "Caixa aberto para teste de fechamento",
      });
      const response = await fetch(
        `http://localhost:3000/api/v1/caixa/${caixa.id}/fechar`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            Cookie: `sid=${session.token}`,
          },
          body: JSON.stringify({
            saldo_final_informado: 2010,
            observacao_fechamento: "Fechamento de caixa para teste",
          }),
        },
      );

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        conta_id: conta.id,
        status: "FECHADO",
        relatorio: {
          total_entrada: 1000,
          total_saida: 0,
          quantidade_movimentacoes: 2,
        },

        saldo_final_sistema: 2000,
        saldo_final_informado: 2010,
        diferenca: 10,
        fechado_em: responseBody.fechado_em,
        usuario_fechamento: { id: user.id, nome: user.nome },
        observacao_fechamento: "Fechamento de caixa para teste",
        usuario_abertura_id: user.id,
        saldo_inicial: conta.saldo_inicial,
        usuario_abertura: { id: user.id, nome: user.nome },
        aberto_em: responseBody.aberto_em,
        observacao_abertura: "Caixa aberto para teste de fechamento",
        movimentacoes: responseBody.movimentacoes,
      });
      expect(Array.isArray(responseBody.movimentacoes)).toBe(true);
      expect(responseBody.movimentacoes.length).toBe(2);
      expect(Date.parse(responseBody.aberto_em)).not.toBeNaN();
      expect(Date.parse(responseBody.fechado_em)).not.toBeNaN();

      expect(response.status).toBe(201);
    });
    test("Fechar caixa sem ter um caixa aberto", async () => {
      const user = await orchestrator.createUser({
        nome: "ADMINISTRADOR",
      });
      const session = await orchestrator.createSession(user.id);

      const response = await fetch(
        "http://localhost:3000/api/v1/caixa/99999/fechar",
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            Cookie: `sid=${session.token}`,
          },
          body: JSON.stringify({
            saldo_final_informado: 2000,
            observacao_fechamento: "Fechamento de caixa para teste",
          }),
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
    test("Fechar caixa sem informar saldo final", async () => {
      const user = await orchestrator.createUser({
        nome: "ADMINISTRADOR",
      });
      const session = await orchestrator.createSession(user.id);

      const response = await fetch(
        "http://localhost:3000/api/v1/caixa/id-invalido/fechar",
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            Cookie: `sid=${session.token}`,
          },
          body: JSON.stringify({
            observacao_fechamento: "Fechamento de caixa para teste",
          }),
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
    test("Fechar caixa com saldo final inválido", async () => {
      const user = await orchestrator.createUser({
        nome: "ADMINISTRADOR",
      });
      const session = await orchestrator.createSession(user.id);

      const response = await fetch(
        "http://localhost:3000/api/v1/caixa/id-invalido/fechar",
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            Cookie: `sid=${session.token}`,
          },
          body: JSON.stringify({
            saldo_final_informado: "fe",
            observacao_fechamento: "Fechamento de caixa para teste",
          }),
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
    test("Fechar caixa com saldo final negativo", async () => {
      const user = await orchestrator.createUser({
        nome: "ADMINISTRADOR",
      });
      const session = await orchestrator.createSession(user.id);

      const response = await fetch(
        "http://localhost:3000/api/v1/caixa/id-invalido/fechar",
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            Cookie: `sid=${session.token}`,
          },
          body: JSON.stringify({
            saldo_final_informado: -1000,
            observacao_fechamento: "Fechamento de caixa para teste",
          }),
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
    test("Fechar caixa com id inválido", async () => {
      const user = await orchestrator.createUser({
        nome: "ADMINISTRADOR",
      });
      const session = await orchestrator.createSession(user.id);

      const response = await fetch(
        "http://localhost:3000/api/v1/caixa/id-invalido/fechar",
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            Cookie: `sid=${session.token}`,
          },
          body: JSON.stringify({
            saldo_final_informado: 2000,
            observacao_fechamento: "Fechamento de caixa para teste",
          }),
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
    test("Fechar caixa com id inexistente", async () => {
      const user = await orchestrator.createUser({
        nome: "ADMINISTRADOR",
      });
      const session = await orchestrator.createSession(user.id);

      const response = await fetch(
        "http://localhost:3000/api/v1/caixa/99999/fechar",
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            Cookie: `sid=${session.token}`,
          },
          body: JSON.stringify({
            saldo_final_informado: 2000,
            observacao_fechamento: "Fechamento de caixa para teste",
          }),
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
    // test("Fechar caixa com pedido em aberto", async () => {
    //   const user = await orchestrator.createUser({
    //     nome: "ADMINISTRADOR",
    //   });
    //   const session = await orchestrator.createSession(user.id);

    //   const response = await fetch(
    //     "http://localhost:3000/api/v1/caixa/99999/fechar",
    //     {
    //       method: "POST",
    //       headers: {
    //         "Content-type": "application/json",
    //         Cookie: `sid=${session.token}`,
    //       },
    //       body: JSON.stringify({
    //         saldo_final_informado: 2000,
    //         observacao_fechamento: "Fechamento de caixa para teste",
    //       }),
    //     },
    //   );

    //   const responseBody = await response.json();

    //   expect(responseBody).toEqual({
    //     message: "Caixa não encontrado.",
    //     name: "NotFoundError",
    //     status_code: 404,
    //     action: "Verifique o ID do caixa e tente novamente.",
    //   });

    //   expect(response.status).toBe(404);
    // });
  });

  describe("Usuario autenticado, sem permissao", () => {
    test("Com dados obrigatórios válidos", async () => {
      const user = await orchestrator.createUser({
        nome: "ADMINISTRADOR",
        perfil_id: 2,
      });
      const session = await orchestrator.createSession(user.id);

      const response = await fetch(
        "http://localhost:3000/api/v1/caixa/32/fechar",
        {
          method: "POST",
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
        "http://localhost:3000/api/v1/caixa/32/fechar",
        {
          method: "POST",
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
