/*
  Warnings:

  - You are about to drop the column `descricao` on the `produtos` table. All the data in the column will be lost.
  - You are about to drop the column `estoque` on the `produtos` table. All the data in the column will be lost.
  - You are about to drop the column `usuarioId` on the `produtos` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `produtos` DROP FOREIGN KEY `produtos_usuarioId_fkey`;

-- DropIndex
DROP INDEX `produtos_usuarioId_fkey` ON `produtos`;

-- AlterTable
ALTER TABLE `produtos` DROP COLUMN `descricao`,
    DROP COLUMN `estoque`,
    DROP COLUMN `usuarioId`,
    ADD COLUMN `quantidade` INTEGER NOT NULL DEFAULT 0;
