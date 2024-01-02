/*
  Warnings:

  - You are about to drop the column `langCode` on the `city` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `city` table. All the data in the column will be lost.
  - You are about to drop the column `langCode` on the `district` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `district` table. All the data in the column will be lost.
  - You are about to drop the column `langCode` on the `ward` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `ward` table. All the data in the column will be lost.
  - Added the required column `nameEn` to the `City` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nameVn` to the `City` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nameEn` to the `District` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nameVn` to the `District` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nameEn` to the `Ward` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nameVn` to the `Ward` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `city` DROP COLUMN `langCode`,
    DROP COLUMN `name`,
    ADD COLUMN `nameEn` VARCHAR(191) NOT NULL,
    ADD COLUMN `nameVn` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `district` DROP COLUMN `langCode`,
    DROP COLUMN `name`,
    ADD COLUMN `nameEn` VARCHAR(191) NOT NULL,
    ADD COLUMN `nameVn` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `ward` DROP COLUMN `langCode`,
    DROP COLUMN `name`,
    ADD COLUMN `nameEn` VARCHAR(191) NOT NULL,
    ADD COLUMN `nameVn` VARCHAR(191) NOT NULL;
