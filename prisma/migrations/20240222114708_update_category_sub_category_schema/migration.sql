/*
  Warnings:

  - Added the required column `status` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `SubCategory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `category` ADD COLUMN `status` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `subcategory` ADD COLUMN `status` INTEGER NOT NULL;
