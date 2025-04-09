/*
  Warnings:

  - Added the required column `adresse` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `codePostal` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ville` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "adresse" TEXT NOT NULL,
ADD COLUMN     "codePostal" INTEGER NOT NULL,
ADD COLUMN     "ville" TEXT NOT NULL,
ALTER COLUMN "factureNumber" SET DEFAULT 'N/A',
ALTER COLUMN "paiement" SET DEFAULT 'non spécifié';
