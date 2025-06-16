-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "agencyId" INTEGER;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "agencyId" INTEGER;

-- CreateTable
CREATE TABLE "Agency" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,

    CONSTRAINT "Agency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JewelryPhoto" (
    "id" SERIAL NOT NULL,
    "photoUrl" TEXT NOT NULL,
    "photoOrder" INTEGER NOT NULL DEFAULT 1,
    "description" TEXT,
    "transactionId" INTEGER NOT NULL,

    CONSTRAINT "JewelryPhoto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "JewelryPhoto_transactionId_idx" ON "JewelryPhoto"("transactionId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "Agency"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "Agency"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JewelryPhoto" ADD CONSTRAINT "JewelryPhoto_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;
