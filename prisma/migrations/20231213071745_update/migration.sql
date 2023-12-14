/*
  Warnings:

  - You are about to drop the column `stockQuanity` on the `product` table. All the data in the column will be lost.
  - Added the required column `quanity` to the `OrderItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `orderitem` ADD COLUMN `quanity` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `product` DROP COLUMN `stockQuanity`;
