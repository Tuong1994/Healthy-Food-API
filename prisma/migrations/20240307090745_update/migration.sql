/*
  Warnings:

  - You are about to alter the column `resetTokenExpires` on the `customer` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.

*/
-- AlterTable
ALTER TABLE `customer` MODIFY `resetTokenExpires` INTEGER NULL;
