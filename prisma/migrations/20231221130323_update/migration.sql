/*
  Warnings:

  - You are about to alter the column `code` on the `city` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `code` on the `district` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `cityCode` on the `district` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `code` on the `ward` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `districtCode` on the `ward` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `city` MODIFY `code` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `district` MODIFY `code` INTEGER NOT NULL,
    MODIFY `cityCode` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `ward` MODIFY `code` INTEGER NOT NULL,
    MODIFY `districtCode` INTEGER NOT NULL;
