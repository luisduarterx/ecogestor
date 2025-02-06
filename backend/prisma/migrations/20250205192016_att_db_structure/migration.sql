/*
  Warnings:

  - Added the required column `userID` to the `Movimentacao` table without a default value. This is not possible if the table is not empty.
  - Added the required column `value` to the `SaldoFinanceiro` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Movimentacao" ADD COLUMN     "userID" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "SaldoFinanceiro" ADD COLUMN     "value" DECIMAL(65,30) NOT NULL;

-- AddForeignKey
ALTER TABLE "ItemPedido" ADD CONSTRAINT "ItemPedido_materialID_fkey" FOREIGN KEY ("materialID") REFERENCES "Material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Movimentacao" ADD CONSTRAINT "Movimentacao_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
