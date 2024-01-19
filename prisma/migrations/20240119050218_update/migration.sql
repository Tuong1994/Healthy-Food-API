-- AlterTable
ALTER TABLE `cart` ADD COLUMN `isDelete` BOOLEAN NULL;

-- AlterTable
ALTER TABLE `cartitem` ADD COLUMN `isDelete` BOOLEAN NULL;
