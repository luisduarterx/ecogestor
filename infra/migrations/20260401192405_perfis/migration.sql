/*
  Warnings:

  - Added the required column `perfil_id` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "perfil_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "perfis" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "permissoes" TEXT[],
    "atualizado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "perfis_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_perfil_id_fkey" FOREIGN KEY ("perfil_id") REFERENCES "perfis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
