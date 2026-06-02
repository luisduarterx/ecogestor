import { ApplicationError, NotFoundError, ValidationError } from "infra/errors";
import { prisma } from "infra/database";

const abrir = async ({ user_id, entrada, observacao_abertura, status }) => {
  const caixaAberto = await prisma.caixa.findFirst({
    where: {
      status: "ABERTO",
    },
  });
  if (caixaAberto) {
    throw new ApplicationError(
      "Já existe um caixa aberto.",
      "Feche o caixa atual para abrir um novo caixa.",
    );
  }

  const resultado = await prisma.$transaction(async (trx) => {
    const conta = await trx.conta_financeira.findFirst({
      where: {
        conta_padrao: true,
      },
    });
    if (!conta) {
      throw new ApplicationError(
        "É necessário ter uma conta padrão ativada para abrir o caixa.",
        "Vá para as configurações de contas e ative uma conta como padrão para abrir o caixa.",
      );
    }
    if (conta.saldo_atual < 0) {
      throw new ApplicationError(
        "Não é permitido abrir um caixa com saldo negativo.",
        "Verifique o saldo da conta padrão, se estiver negativo, corrija o saldo para um valor positivo para poder abrir o caixa.",
      );
    }
    const caixa = await trx.caixa.create({
      data: {
        conta_id: conta.id,
        usuario_abertura_id: user_id,
        saldo_inicial: conta.saldo_atual,
        observacao_abertura,
        status: status || "ABERTO",
      },
      include: {
        movimentacoes: true,
        usuario_abertura: {
          select: {
            id: true,
            nome: true,
          },
        },
      },
    });
    if (entrada) {
      const movimentacaoEntrada = await trx.movimentacoes_financeiras.create({
        data: {
          conta_id: conta.id,
          origem: "ABERTURA_CAIXA",
          origem_id: caixa.id,
          descricao: "Entrada de abertura de caixa",
          direcao: "ENTRADA",
          valor: entrada,
          saldo: Number(conta.saldo_atual) + Number(entrada),
          user_id,
          caixa_id: caixa.id,
        },
      });
      await trx.conta_financeira.update({
        where: {
          id: conta.id,
        },
        data: {
          saldo_atual: {
            increment: entrada,
          },
        },
      });
      caixa.movimentacoes.push(movimentacaoEntrada);
    }
    return caixa;
  });

  return {
    id: resultado.id,
    conta_id: resultado.conta_id,
    status: resultado.status,
    usuario_abertura_id: resultado.usuario_abertura_id,
    saldo_inicial: Number(resultado.saldo_inicial),
    observacao_abertura: resultado.observacao_abertura,
    aberto_em: resultado.aberto_em,
    movimentacoes: resultado.movimentacoes,
    usuario_abertura: resultado.usuario_abertura,
  };
};
const resumo = async ({ id }) => {
  const caixa = await prisma.caixa.findUnique({
    where: {
      id,
    },
    include: {
      usuario_abertura: {
        select: {
          id: true,
          nome: true,
        },
      },
      movimentacoes: true,
    },
  });
  if (caixa?.status === "FECHADO") {
    throw new ValidationError(
      "Não é possível consultar o resumo de um caixa fechado.",
      "Verifique os dados enviados e tente novamente.",
    );
  }
  if (!caixa) {
    throw new NotFoundError(
      "Caixa não encontrado.",
      "Verifique o ID do caixa e tente novamente.",
    );
  }

  const totalEntrada = caixa.movimentacoes
    .filter((mov) => mov.direcao === "ENTRADA")
    .reduce((acc, mov) => acc + Number(mov.valor), 0);

  const totalSaida = caixa.movimentacoes
    .filter((mov) => mov.direcao === "SAIDA")
    .reduce((acc, mov) => acc + Number(mov.valor), 0);

  const quantidadeMovimentacoes = caixa.movimentacoes.length;

  const saldoEsperado = Number(caixa.saldo_inicial) + totalEntrada - totalSaida;

  return {
    id: caixa.id,
    conta_id: caixa.conta_id,
    status: caixa.status,
    usuario_abertura_id: caixa.usuario_abertura_id,
    saldo_inicial: Number(caixa.saldo_inicial),
    observacao_abertura: caixa.observacao_abertura,
    aberto_em: caixa.aberto_em,
    usuario_abertura: caixa.usuario_abertura,
    relatorio: {
      total_entrada: totalEntrada,
      total_saida: totalSaida,
      quantidade_movimentacoes: quantidadeMovimentacoes,
    },
    saldo_esperado: saldoEsperado,
    movimentacoes: caixa.movimentacoes.map((mov) => ({
      id: mov.id,
      conta_id: mov.conta_id,
      origem: mov.origem,
      origem_id: mov.origem_id,
      descricao: mov.descricao,
      direcao: mov.direcao,
      valor: Number(mov.valor),
      saldo: Number(mov.saldo),
      user_id: mov.user_id,
      caixa_id: mov.caixa_id,
      criado_em: mov.criado_em,
    })),
  };
};
const fechar = async ({
  id,
  observacao_fechamento,
  saldo_final_informado,
  user_id,
}) => {
  const caixaFechado = await prisma.$transaction(async (trx) => {
    const caixa = await trx.caixa.findUnique({
      where: {
        id,
        status: "ABERTO",
      },
      include: {
        movimentacoes: true,
      },
    });
    if (!caixa) {
      throw new NotFoundError(
        "Caixa não encontrado.",
        "Verifique o ID do caixa e tente novamente.",
      );
    }
    if (caixa.status === "FECHADO") {
      throw new ValidationError(
        "O caixa já está fechado.",
        "Verifique os dados enviados e tente novamente.",
      );
    }

    const totalEntrada = caixa.movimentacoes
      .filter((mov) => mov.direcao === "ENTRADA")
      .reduce((acc, mov) => acc + Number(mov.valor), 0);

    const totalSaida = caixa.movimentacoes
      .filter((mov) => mov.direcao === "SAIDA")
      .reduce((acc, mov) => acc + Number(mov.valor), 0);

    const saldoCalculado =
      Number(caixa.saldo_inicial) + totalEntrada - totalSaida;

    if (saldo_final_informado !== saldoCalculado) {
      const movimentacaoCorrecao = await trx.movimentacoes_financeiras.create({
        data: {
          conta_id: caixa.conta_id,
          origem: "FECHAMENTO_CAIXA",
          origem_id: caixa.id,
          descricao: "Movimentação de correção no fechamento de caixa",
          direcao: saldo_final_informado > saldoCalculado ? "ENTRADA" : "SAIDA",
          valor: Math.abs(saldo_final_informado - saldoCalculado),
          saldo: saldo_final_informado,
          user_id,
          caixa_id: caixa.id,
        },
      });
    }

    const caixaAtualizado = await trx.caixa.update({
      where: {
        id,
      },
      data: {
        status: "FECHADO",
        observacao_fechamento,
        fechado_em: new Date(),
        usuario_fechamento: {
          connect: {
            id: user_id,
          },
        },
        saldo_final_informado: saldo_final_informado,
        saldo_final_sistema: saldoCalculado,
        diferenca: saldo_final_informado - saldoCalculado,
      },
      include: {
        usuario_abertura: {
          select: {
            id: true,
            nome: true,
          },
        },
        usuario_fechamento: {
          select: {
            id: true,
            nome: true,
          },
        },
        movimentacoes: true,
      },
    });

    return { ...caixaAtualizado, totalEntrada, totalSaida };
  });

  return {
    id: caixaFechado.id,
    conta_id: caixaFechado.conta_id,
    status: caixaFechado.status,
    usuario_abertura_id: caixaFechado.usuario_abertura_id,
    saldo_inicial: Number(caixaFechado.saldo_inicial),
    observacao_abertura: caixaFechado.observacao_abertura,
    aberto_em: caixaFechado.aberto_em,
    fechado_em: caixaFechado.fechado_em,
    observacao_fechamento: caixaFechado.observacao_fechamento,
    usuario_abertura: caixaFechado.usuario_abertura,
    usuario_fechamento: caixaFechado.usuario_fechamento,
    diferenca: Number(caixaFechado.diferenca),
    saldo_final_informado: Number(caixaFechado.saldo_final_informado),
    saldo_final_sistema: Number(caixaFechado.saldo_final_sistema),
    movimentacoes: caixaFechado.movimentacoes,
    relatorio: {
      quantidade_movimentacoes: caixaFechado.movimentacoes.length,
      total_entrada: caixaFechado.totalEntrada,
      total_saida: caixaFechado.totalSaida,
    },
  };
};
const caixa = {
  abrir,
  resumo,
  fechar,
};

export default caixa;
