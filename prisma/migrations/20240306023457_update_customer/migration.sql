-- AlterTable
ALTER TABLE `customer` ADD COLUMN `resetToken` VARCHAR(191) NULL,
    ADD COLUMN `resetTokenExpires` INTEGER NULL;
