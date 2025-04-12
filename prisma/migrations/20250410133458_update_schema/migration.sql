/*
  Warnings:

  - You are about to drop the column `carats` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `unitPrice` on the `Transaction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "carats",
DROP COLUMN "unitPrice",
ALTER COLUMN "designation" DROP NOT NULL;

-- CreateTable
CREATE TABLE "TransactionItem" (
    "id" SERIAL NOT NULL,
    "designation" TEXT NOT NULL,
    "carats" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "unitPrice" DOUBLE PRECISION NOT NULL,
    "subtotal" DOUBLE PRECISION NOT NULL,
    "transactionId" INTEGER NOT NULL,

    CONSTRAINT "TransactionItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TransactionItem" ADD CONSTRAINT "TransactionItem_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;
