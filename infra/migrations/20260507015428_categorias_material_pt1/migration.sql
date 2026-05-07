-- CreateTable
CREATE TABLE "categorias" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "categorias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "material" (
    "id" SERIAL NOT NULL,
    "categoria_id" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "preco_venda" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "material_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "material" ADD CONSTRAINT "material_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "categorias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
