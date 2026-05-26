/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `PetCategory` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "PetCategory" ADD COLUMN     "name" TEXT NOT NULL DEFAULT '';

-- CreateIndex
CREATE UNIQUE INDEX "PetCategory_name_key" ON "PetCategory"("name");
