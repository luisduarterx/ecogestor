-- AlterTable
ALTER TABLE "registros" ADD COLUMN     "tabela_id" INTEGER NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE "tabela" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tabela_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "material_tabela" (
    "id" SERIAL NOT NULL,
    "tabela_id" INTEGER NOT NULL,
    "material_id" INTEGER NOT NULL,
    "preco_compra" DECIMAL(10,2) NOT NULL,
    "atualizado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "material_tabela_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "registros" ADD CONSTRAINT "registros_tabela_id_fkey" FOREIGN KEY ("tabela_id") REFERENCES "tabela"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "material_tabela" ADD CONSTRAINT "material_tabela_tabela_id_fkey" FOREIGN KEY ("tabela_id") REFERENCES "tabela"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "material_tabela" ADD CONSTRAINT "material_tabela_material_id_fkey" FOREIGN KEY ("material_id") REFERENCES "material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
