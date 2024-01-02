/*
  Warnings:

  - You are about to drop the column `quanity` on the `cartitem` table. All the data in the column will be lost.
  - You are about to drop the column `account` on the `customer` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `customeraddress` table. All the data in the column will be lost.
  - You are about to drop the column `paymentType` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `quanity` on the `orderitem` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[categoryId]` on the table `Image` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[subCategoryId]` on the table `Image` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `quantity` to the `CartItem` table without a default value. This is not possible if the table is not empty.
  - Made the column `email` on table `customer` required. This step will fail if there are existing NULL values in that column.
  - Made the column `phone` on table `customer` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `address_en` to the `CustomerAddress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `address_vn` to the `CustomerAddress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentMethod` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `origin` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `supplier` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Customer_account_key` ON `customer`;

-- AlterTable
ALTER TABLE `cartitem` DROP COLUMN `quanity`,
    ADD COLUMN `quantity` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `customer` DROP COLUMN `account`,
    MODIFY `email` VARCHAR(191) NOT NULL,
    MODIFY `phone` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `customeraddress` DROP COLUMN `address`,
    ADD COLUMN `address_en` VARCHAR(191) NOT NULL,
    ADD COLUMN `address_vn` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `image` ADD COLUMN `categoryId` VARCHAR(191) NULL,
    ADD COLUMN `subCategoryId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `order` DROP COLUMN `paymentType`,
    ADD COLUMN `paymentMethod` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `orderitem` DROP COLUMN `quanity`,
    ADD COLUMN `quantity` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `product` ADD COLUMN `origin` INTEGER NOT NULL,
    ADD COLUMN `supplier` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Image_categoryId_key` ON `Image`(`categoryId`);

-- CreateIndex
CREATE UNIQUE INDEX `Image_subCategoryId_key` ON `Image`(`subCategoryId`);

-- AddForeignKey
ALTER TABLE `Image` ADD CONSTRAINT `Image_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Image` ADD CONSTRAINT `Image_subCategoryId_fkey` FOREIGN KEY (`subCategoryId`) REFERENCES `SubCategory`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
