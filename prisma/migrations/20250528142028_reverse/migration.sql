/*
  Warnings:

  - You are about to drop the `JewelryPhoto` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "JewelryPhoto" DROP CONSTRAINT "JewelryPhoto_transactionId_fkey";

-- DropTable
DROP TABLE "JewelryPhoto";
