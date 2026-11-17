/*
  Warnings:

  - A unique constraint covering the columns `[codigo]` on the table `produtos` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `codigo` to the `produtos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total` to the `produtos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `produtos` ADD COLUMN `codigo` INTEGER NOT NULL,
    ADD COLUMN `total` DECIMAL(10, 2) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `produtos_codigo_key` ON `produtos`(`codigo`);
