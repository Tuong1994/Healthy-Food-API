/*
  Warnings:

  - You are about to drop the column `langCode` on the `category` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `category` table. All the data in the column will be lost.
  - You are about to drop the column `langCode` on the `customeraddress` table. All the data in the column will be lost.
  - You are about to drop the column `langCode` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `langCode` on the `subcategory` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `subcategory` table. All the data in the column will be lost.
  - Added the required column `nameEn` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nameVn` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nameEn` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nameVn` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nameEn` to the `SubCategory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nameVn` to the `SubCategory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `category` DROP COLUMN `langCode`,
    DROP COLUMN `name`,
    ADD COLUMN `nameEn` VARCHAR(191) NOT NULL,
    ADD COLUMN `nameVn` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `customeraddress` DROP COLUMN `langCode`;

-- AlterTable
ALTER TABLE `product` DROP COLUMN `langCode`,
    DROP COLUMN `name`,
    ADD COLUMN `nameEn` VARCHAR(191) NOT NULL,
    ADD COLUMN `nameVn` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `subcategory` DROP COLUMN `langCode`,
    DROP COLUMN `name`,
    ADD COLUMN `nameEn` VARCHAR(191) NOT NULL,
    ADD COLUMN `nameVn` VARCHAR(191) NOT NULL;
