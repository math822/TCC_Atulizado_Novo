/*
  Warnings:

  - You are about to drop the column `id_categoria` on the `negocio` table. All the data in the column will be lost.
  - You are about to drop the `negocio_categoria` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `negocio` DROP FOREIGN KEY `negocio_id_categoria_fkey`;

-- DropForeignKey
ALTER TABLE `negocio_categoria` DROP FOREIGN KEY `negocio_categoria_id_categoria_fkey`;

-- DropForeignKey
ALTER TABLE `negocio_categoria` DROP FOREIGN KEY `negocio_categoria_id_negocio_fkey`;

-- AlterTable
ALTER TABLE `negocio` DROP COLUMN `id_categoria`;

-- DropTable
DROP TABLE `negocio_categoria`;
