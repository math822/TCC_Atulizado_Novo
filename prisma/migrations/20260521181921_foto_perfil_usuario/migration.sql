-- AlterTable
ALTER TABLE `negocio` ADD COLUMN `id_categoria` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `usuario` ADD COLUMN `foto_perfil` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `negocio` ADD CONSTRAINT `negocio_id_categoria_fkey` FOREIGN KEY (`id_categoria`) REFERENCES `categoria`(`id_categoria`) ON DELETE SET NULL ON UPDATE CASCADE;
