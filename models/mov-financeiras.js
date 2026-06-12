import { prisma } from "infra/database";
import { ApplicationError, NotFoundError } from "infra/errors";
import caixa from "./caixa";
import { id } from "zod/locales";

const createWithTransaction = async (trx, dados) => {
  const caixaAberto = await trx.caixa.findFirst({
    where: {
      status: "ABERTO",
    },
  });

  const conta = await trx.conta_financeira.findUnique({
    where: { id: dados.conta_id },
  });
  if (!conta) {
    throw new NotFoundError("Conta não encontrada");
  }
  if (conta.conta_padrao && !caixaAberto) {
    throw new ApplicationError(
      "Não é possível movimentar a conta padrão sem um caixa aberto.",
      "Abra o caixa antes de realizar movimentações na conta padrão.",
    );
  }
  const caixa_id =
    caixaAberto?.conta_id === dados.conta_id ? caixaAberto.id : null;
  const contaAtualizada = await trx.conta_financeira.update({
    where: { id: dados.conta_id },
    data: {
      saldo_atual:
        dados.direcao === "ENTRADA"
          ? { increment: Number(dados.valor) }
          : { decrement: Number(dados.valor) },
    },
  });
  const movimentacao = await trx.movimentacoes_financeiras.create({
    data: {
      conta_id: dados.conta_id,

      descricao: dados.descricao || "",
      valor: dados.valor,
      direcao: dados.direcao,
      origem: dados.origem,
      origem_id: dados.origem_id || null,
      saldo: contaAtualizada.saldo_atual,
      caixa_id: caixa_id,
      user_id: dados.user_id,
      lancamento_id: dados.lancamento_id || null,
      transferencia_id: dados.transferencia_id || null,
      motivo_ajuste: dados.motivo_ajuste || null,
      estorno_de_id: dados.estorno_de_id || null,
    },
  });

  return movimentacao;
};
const create = async (data) => {
  return await prisma.$transaction(async (trx) => {
    return await createWithTransaction(trx, data);
  });
};
const transferencia = async (dados) => {
  return await prisma.$transaction(async (trx) => {
    const contaOrigem = await trx.conta_financeira.findUnique({
      where: { id: dados.conta_origem_id },
    });
    const contaDestino = await trx.conta_financeira.findUnique({
      where: { id: dados.conta_destino_id },
    });
    if (!contaOrigem || !contaDestino) {
      throw new NotFoundError(
        "Conta não encontrada",
        "A conta de origem ou destino não existe.",
      );
    }
    const transferencia = await trx.transferencias_financeiras.create({
      data: {
        conta_origem_id: dados.conta_origem_id,
        conta_destino_id: dados.conta_destino_id,
        descricao: dados.descricao || "",
        valor: dados.valor,
        caixa_id: dados.caixa_id || null,
        user_id: dados.user_id,
      },
    });

    const mov1 = await createWithTransaction(trx, {
      conta_id: dados.conta_destino_id,
      descricao: `TRANSFERENCIA RECEBIDA DE CONTA ID ${dados.conta_origem_id}`,
      valor: dados.valor,
      direcao: "ENTRADA",
      origem: `TRANSFERENCIA`,
      caixa_id: dados.caixa_id || null,
      user_id: dados.user_id,
      transferencia_id: transferencia.id,
    });
    const mov2 = await createWithTransaction(trx, {
      conta_id: dados.conta_origem_id,
      descricao: `TRANSFERENCIA ENVIADA PARA CONTA ID ${dados.conta_destino_id}`,
      valor: dados.valor,
      direcao: "SAIDA",
      origem: `TRANSFERENCIA`,
      caixa_id: dados.caixa_id || null,
      user_id: dados.user_id,
      transferencia_id: transferencia.id,
    });

    return {
      id: transferencia.id,
      conta_origem_id: transferencia.conta_origem_id,
      conta_destino_id: transferencia.conta_destino_id,
      descricao: transferencia.descricao,
      valor: Number(transferencia.valor),
      user_id: transferencia.user_id,
      caixa_id: transferencia.caixa_id,
      criado_em: transferencia.criado_em,
    };
  });
};

const movFinanceiras = {
  createWithTransaction,
  create,
  transferencia,
};
export default movFinanceiras;
