/*
  Warnings:

  - You are about to drop the column `address` on the `customer` table. All the data in the column will be lost.
  - You are about to drop the column `cityCode` on the `customer` table. All the data in the column will be lost.
  - You are about to drop the column `districtCode` on the `customer` table. All the data in the column will be lost.
  - You are about to drop the column `fullAddress` on the `customer` table. All the data in the column will be lost.
  - You are about to drop the column `langCode` on the `customer` table. All the data in the column will be lost.
  - You are about to drop the column `wardCode` on the `customer` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `customer` DROP COLUMN `address`,
    DROP COLUMN `cityCode`,
    DROP COLUMN `districtCode`,
    DROP COLUMN `fullAddress`,
    DROP COLUMN `langCode`,
    DROP COLUMN `wardCode`;

-- CreateTable
CREATE TABLE `CustomerAddress` (
    `id` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `wardCode` VARCHAR(191) NOT NULL,
    `districtCode` VARCHAR(191) NOT NULL,
    `cityCode` VARCHAR(191) NOT NULL,
    `fullAddress` VARCHAR(191) NOT NULL,
    `langCode` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `customerId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `CustomerAddress_customerId_key`(`customerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CustomerAddress` ADD CONSTRAINT `CustomerAddress_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
