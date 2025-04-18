-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "fraudChecked" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isFraud" BOOLEAN NOT NULL DEFAULT false;
