/*
  Warnings:

  - You are about to drop the column `clientSurname` on the `Transaction` table. All the data in the column will be lost.
  - Added the required column `factureNumber` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paiement` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "clientSurname",
ADD COLUMN     "factureNumber" TEXT NOT NULL,
ADD COLUMN     "paiement" TEXT NOT NULL;
