/*
  Warnings:

  - You are about to drop the column `supplierId` on the `product` table. All the data in the column will be lost.
  - You are about to drop the `supplier` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `product` DROP FOREIGN KEY `Product_supplierId_fkey`;

-- DropIndex
DROP INDEX `Product_supplierId_fkey` ON `product`;

-- AlterTable
ALTER TABLE `product` DROP COLUMN `supplierId`;

-- AlterTable
ALTER TABLE `purchase` ADD COLUMN `supplierName` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `supplier`;
