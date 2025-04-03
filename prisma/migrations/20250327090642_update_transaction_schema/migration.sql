/*
  Warnings:

  - Added the required column `carats` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `designation` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unitPrice` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weight` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "carats" INTEGER NOT NULL,
ADD COLUMN     "designation" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "unitPrice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "weight" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "clientMail" DROP NOT NULL,
ALTER COLUMN "location" DROP NOT NULL;
