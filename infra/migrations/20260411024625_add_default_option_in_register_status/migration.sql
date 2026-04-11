-- CreateEnum
CREATE TYPE "tipo_registro" AS ENUM ('F', 'J');

-- CreateTable
CREATE TABLE "registros" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "tipo_registro" "tipo_registro" NOT NULL,
    "email" TEXT,
    "whatsapp" TEXT,
    "cpf" TEXT,
    "cnpj" TEXT,
    "ie" TEXT,
    "data_nascimento" TIMESTAMP(3),
    "cep" TEXT,
    "logradouro" TEXT,
    "numero" TEXT,
    "complemento" TEXT,
    "bairro" TEXT,
    "cidade" TEXT,
    "estado" TEXT,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "registros_pkey" PRIMARY KEY ("id")
);
