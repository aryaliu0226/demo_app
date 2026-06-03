-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "categoryId" TEXT;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "PetCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
