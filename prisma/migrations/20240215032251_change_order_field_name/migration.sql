/*
  Warnings:

  - You are about to drop the column `recievedType` on the `order` table. All the data in the column will be lost.
  - Added the required column `receivedType` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `order` DROP COLUMN `recievedType`,
    ADD COLUMN `receivedType` INTEGER NOT NULL;
