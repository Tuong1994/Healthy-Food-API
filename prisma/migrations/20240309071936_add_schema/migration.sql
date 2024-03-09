-- CreateTable
CREATE TABLE `CustomerPermission` (
    `id` VARCHAR(191) NOT NULL,
    `create` BOOLEAN NOT NULL,
    `update` BOOLEAN NOT NULL,
    `remove` BOOLEAN NOT NULL,
    `isDelete` BOOLEAN NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `customerId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `CustomerPermission_customerId_key`(`customerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CustomerPermission` ADD CONSTRAINT `CustomerPermission_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
