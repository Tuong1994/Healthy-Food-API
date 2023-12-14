/*
  Warnings:

  - A unique constraint covering the columns `[customerId]` on the table `Auth` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `customerId` to the `Auth` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `auth` ADD COLUMN `customerId` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Auth_customerId_key` ON `Auth`(`customerId`);

-- AddForeignKey
ALTER TABLE `Auth` ADD CONSTRAINT `Auth_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
