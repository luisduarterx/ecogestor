-- CreateEnum
CREATE TYPE "status_lancamento" AS ENUM ('ABERTO', 'PAGO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "tipo_lancamento" AS ENUM ('PAGAR', 'RECEBER');

-- CreateEnum
CREATE TYPE "origem_movimentacao" AS ENUM ('PEDIDO_COMPRA', 'PEDIDO_VENDA', 'TRANSFERENCIA', 'LANCAMENTO_PAGAR', 'LANCAMENTO_RECEBER', 'AJUSTE_MANUAL', 'ABERTURA_CAIXA', 'FECHAMENTO_CAIXA', 'ESTORNO');

-- CreateEnum
CREATE TYPE "direcao_financeira" AS ENUM ('ENTRADA', 'SAIDA');

-- CreateEnum
CREATE TYPE "tipo_categoria" AS ENUM ('RECEITA', 'DESPESA');

-- CreateEnum
CREATE TYPE "status_caixa" AS ENUM ('ABERTO', 'FECHADO');

-- AlterTable
ALTER TABLE "categorias" ALTER COLUMN "atualizado_em" DROP DEFAULT;

-- AlterTable
ALTER TABLE "material" ALTER COLUMN "atualizado_em" DROP DEFAULT;

-- AlterTable
ALTER TABLE "material_tabela" ALTER COLUMN "atualizado_em" DROP DEFAULT;

-- AlterTable
ALTER TABLE "perfis" ALTER COLUMN "atualizado_em" DROP DEFAULT;

-- AlterTable
ALTER TABLE "registros" ALTER COLUMN "atualizado_em" DROP DEFAULT;

-- AlterTable
ALTER TABLE "tabela" ALTER COLUMN "atualizado_em" DROP DEFAULT;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "atualizado_em" DROP DEFAULT;

-- CreateTable
CREATE TABLE "conta_financeira" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL UNIQUE,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,
    "saldo_atual" DECIMAL(10,2) NOT NULL,
    "saldo_inicial" DECIMAL(10,2) NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "conta_financeira_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categoria_lancamento" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tipo_categoria" "tipo_categoria" NOT NULL,

    CONSTRAINT "categoria_lancamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lancamentos_financeiros" (
    "id" SERIAL NOT NULL,
    "valor" DECIMAL(10,2) NOT NULL,
    "descricao" TEXT NOT NULL,
    "tipo" "tipo_lancamento" NOT NULL,
    "titulo" TEXT NOT NULL,
    "parcela" INTEGER,
    "status" "status_lancamento" NOT NULL,
    "categoria_id" INTEGER NOT NULL,
    "vencimento" TIMESTAMP(3) NOT NULL,
    "data_baixa" TIMESTAMP(3),
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,
    "desconto" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "acrescimo" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "user_id" INTEGER NOT NULL,
    "registro_id" INTEGER,

    CONSTRAINT "lancamentos_financeiros_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "movimentacoes_financeiras" (
    "id" SERIAL NOT NULL,
    "conta_id" INTEGER NOT NULL,
    "origem" "origem_movimentacao" NOT NULL,
    "origem_id" INTEGER NOT NULL,
    "descricao" TEXT NOT NULL,
    "direcao" "direcao_financeira" NOT NULL,
    "valor" DECIMAL(10,2) NOT NULL,
    "saldo" DECIMAL(10,2) NOT NULL,
    "user_id" INTEGER NOT NULL,
    "lancamento_id" INTEGER,
    "transferencia_id" INTEGER,
    "motivo_ajuste" TEXT,
    "estornada" BOOLEAN NOT NULL DEFAULT false,
    "estorno_de_id" INTEGER,
    "caixa_id" INTEGER NOT NULL,

    CONSTRAINT "movimentacoes_financeiras_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transferencias_financeiras" (
    "id" SERIAL NOT NULL,
    "conta_origem_id" INTEGER NOT NULL,
    "conta_destino_id" INTEGER NOT NULL,
    "valor" DECIMAL(10,2) NOT NULL,
    "descricao" TEXT NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" INTEGER NOT NULL,
    "caixa_id" INTEGER,

    CONSTRAINT "transferencias_financeiras_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "caixa" (
    "id" SERIAL NOT NULL,
    "conta_id" INTEGER NOT NULL,
    "usuario_abertura_id" INTEGER NOT NULL,
    "usuario_fechamento_id" INTEGER,
    "status" "status_caixa" NOT NULL DEFAULT 'ABERTO',
    "saldo_inicial" DECIMAL(10,2) NOT NULL,
    "saldo_final_sistema" DECIMAL(10,2),
    "saldo_final_informado" DECIMAL(10,2),
    "diferenca" DECIMAL(10,2),
    "aberto_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechado_em" TIMESTAMP(3),
    "observacao_abertura" TEXT,
    "observacao_fechamento" TEXT,

    CONSTRAINT "caixa_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "lancamentos_financeiros" ADD CONSTRAINT "lancamentos_financeiros_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "categoria_lancamento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lancamentos_financeiros" ADD CONSTRAINT "lancamentos_financeiros_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lancamentos_financeiros" ADD CONSTRAINT "lancamentos_financeiros_registro_id_fkey" FOREIGN KEY ("registro_id") REFERENCES "registros"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimentacoes_financeiras" ADD CONSTRAINT "movimentacoes_financeiras_conta_id_fkey" FOREIGN KEY ("conta_id") REFERENCES "conta_financeira"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimentacoes_financeiras" ADD CONSTRAINT "movimentacoes_financeiras_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimentacoes_financeiras" ADD CONSTRAINT "movimentacoes_financeiras_lancamento_id_fkey" FOREIGN KEY ("lancamento_id") REFERENCES "lancamentos_financeiros"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimentacoes_financeiras" ADD CONSTRAINT "movimentacoes_financeiras_transferencia_id_fkey" FOREIGN KEY ("transferencia_id") REFERENCES "transferencias_financeiras"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimentacoes_financeiras" ADD CONSTRAINT "movimentacoes_financeiras_estorno_de_id_fkey" FOREIGN KEY ("estorno_de_id") REFERENCES "movimentacoes_financeiras"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimentacoes_financeiras" ADD CONSTRAINT "movimentacoes_financeiras_caixa_id_fkey" FOREIGN KEY ("caixa_id") REFERENCES "caixa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transferencias_financeiras" ADD CONSTRAINT "transferencias_financeiras_conta_origem_id_fkey" FOREIGN KEY ("conta_origem_id") REFERENCES "conta_financeira"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transferencias_financeiras" ADD CONSTRAINT "transferencias_financeiras_conta_destino_id_fkey" FOREIGN KEY ("conta_destino_id") REFERENCES "conta_financeira"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transferencias_financeiras" ADD CONSTRAINT "transferencias_financeiras_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transferencias_financeiras" ADD CONSTRAINT "transferencias_financeiras_caixa_id_fkey" FOREIGN KEY ("caixa_id") REFERENCES "caixa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "caixa" ADD CONSTRAINT "caixa_conta_id_fkey" FOREIGN KEY ("conta_id") REFERENCES "conta_financeira"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "caixa" ADD CONSTRAINT "caixa_usuario_abertura_id_fkey" FOREIGN KEY ("usuario_abertura_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "caixa" ADD CONSTRAINT "caixa_usuario_fechamento_id_fkey" FOREIGN KEY ("usuario_fechamento_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
