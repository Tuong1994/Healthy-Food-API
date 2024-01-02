/*
  Warnings:

  - You are about to drop the column `address_en` on the `customeraddress` table. All the data in the column will be lost.
  - You are about to drop the column `address_vn` on the `customeraddress` table. All the data in the column will be lost.
  - You are about to drop the column `fullAddress` on the `customeraddress` table. All the data in the column will be lost.
  - Added the required column `addressEn` to the `CustomerAddress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `addressVn` to the `CustomerAddress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fullAddressEn` to the `CustomerAddress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fullAddressVn` to the `CustomerAddress` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `customeraddress` DROP COLUMN `address_en`,
    DROP COLUMN `address_vn`,
    DROP COLUMN `fullAddress`,
    ADD COLUMN `addressEn` VARCHAR(191) NOT NULL,
    ADD COLUMN `addressVn` VARCHAR(191) NOT NULL,
    ADD COLUMN `fullAddressEn` VARCHAR(191) NOT NULL,
    ADD COLUMN `fullAddressVn` VARCHAR(191) NOT NULL;
