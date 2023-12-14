/*
  Warnings:

  - Added the required column `paymentStatus` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `order` ADD COLUMN `paymentStatus` INTEGER NOT NULL;
