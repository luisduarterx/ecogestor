/*
  Warnings:

  - A unique constraint covering the columns `[cpf]` on the table `registros` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cnpj]` on the table `registros` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "registros_cpf_key" ON "registros"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "registros_cnpj_key" ON "registros"("cnpj");
