/*
  Warnings:

  - You are about to alter the column `wardCode` on the `customeraddress` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `districtCode` on the `customeraddress` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `cityCode` on the `customeraddress` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `customeraddress` MODIFY `wardCode` INTEGER NOT NULL,
    MODIFY `districtCode` INTEGER NOT NULL,
    MODIFY `cityCode` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `shipment` ADD COLUMN `shipmentNumber` VARCHAR(191) NULL;
