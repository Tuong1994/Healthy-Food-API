/*
  Warnings:

  - The `resetTokenExpires` column on the `customer` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE `customer` DROP COLUMN `resetTokenExpires`,
    ADD COLUMN `resetTokenExpires` DATETIME(3) NULL;
