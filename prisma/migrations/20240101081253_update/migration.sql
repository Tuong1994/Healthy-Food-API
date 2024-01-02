/*
  Warnings:

  - Added the required column `isNew` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `category` ADD COLUMN `isDelete` BOOLEAN NULL;

-- AlterTable
ALTER TABLE `city` ADD COLUMN `isDelete` BOOLEAN NULL;

-- AlterTable
ALTER TABLE `comment` ADD COLUMN `isDelete` BOOLEAN NULL;

-- AlterTable
ALTER TABLE `customer` ADD COLUMN `isDelete` BOOLEAN NULL;

-- AlterTable
ALTER TABLE `customeraddress` ADD COLUMN `isDelete` BOOLEAN NULL;

-- AlterTable
ALTER TABLE `district` ADD COLUMN `isDelete` BOOLEAN NULL;

-- AlterTable
ALTER TABLE `image` ADD COLUMN `isDelete` BOOLEAN NULL;

-- AlterTable
ALTER TABLE `order` ADD COLUMN `isDelete` BOOLEAN NULL;

-- AlterTable
ALTER TABLE `orderitem` ADD COLUMN `isDelete` BOOLEAN NULL;

-- AlterTable
ALTER TABLE `product` ADD COLUMN `isDelete` BOOLEAN NULL,
    ADD COLUMN `isNew` BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE `rate` ADD COLUMN `isDelete` BOOLEAN NULL;

-- AlterTable
ALTER TABLE `shipment` ADD COLUMN `isDelete` BOOLEAN NULL;

-- AlterTable
ALTER TABLE `subcategory` ADD COLUMN `isDelete` BOOLEAN NULL;

-- AlterTable
ALTER TABLE `ward` ADD COLUMN `isDelete` BOOLEAN NULL;
