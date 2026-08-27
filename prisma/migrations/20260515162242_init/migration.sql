-- CreateTable
CREATE TABLE `usuario` (
    `id_usuario` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `senha` VARCHAR(191) NOT NULL,
    `telefone` VARCHAR(191) NULL,
    `tipo` ENUM('cliente', 'empreendedor', 'admin') NOT NULL,
    `data_cadastro` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `usuario_email_key`(`email`),
    PRIMARY KEY (`id_usuario`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `negocio` (
    `id_negocio` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `descricao` TEXT NULL,
    `telefone` VARCHAR(191) NULL,
    `horario_funcionamento` TEXT NULL,
    `status` VARCHAR(191) NULL,
    `data_criacao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `media_avaliacao` DECIMAL(2, 1) NOT NULL DEFAULT 0.0,
    `id_usuario` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id_negocio`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `endereco` (
    `id_endereco` VARCHAR(191) NOT NULL,
    `rua` VARCHAR(191) NULL,
    `numero` VARCHAR(191) NULL,
    `bairro` VARCHAR(191) NULL,
    `cidade` VARCHAR(191) NULL,
    `estado` VARCHAR(191) NULL,
    `cep` VARCHAR(191) NULL,
    `latitude` DECIMAL(10, 8) NULL,
    `longitude` DECIMAL(11, 8) NULL,
    `id_negocio` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `endereco_id_negocio_key`(`id_negocio`),
    PRIMARY KEY (`id_endereco`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `categoria` (
    `id_categoria` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `descricao` TEXT NULL,

    PRIMARY KEY (`id_categoria`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `negocio_categoria` (
    `id_negocio` VARCHAR(191) NOT NULL,
    `id_categoria` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id_negocio`, `id_categoria`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `foto` (
    `id_foto` VARCHAR(191) NOT NULL,
    `url` TEXT NOT NULL,
    `descricao` TEXT NULL,
    `foto_principal` BOOLEAN NOT NULL DEFAULT false,
    `id_negocio` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id_foto`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `avaliacao` (
    `id_avaliacao` VARCHAR(191) NOT NULL,
    `nota` INTEGER NOT NULL,
    `comentario` TEXT NULL,
    `data_avaliacao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `id_usuario` VARCHAR(191) NOT NULL,
    `id_negocio` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id_avaliacao`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `favorito` (
    `id_favorito` VARCHAR(191) NOT NULL,
    `id_usuario` VARCHAR(191) NOT NULL,
    `id_negocio` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `favorito_id_usuario_id_negocio_key`(`id_usuario`, `id_negocio`),
    PRIMARY KEY (`id_favorito`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `comentario` (
    `id_comentario` VARCHAR(191) NOT NULL,
    `texto` TEXT NOT NULL,
    `data_comentario` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `id_usuario` VARCHAR(191) NOT NULL,
    `id_negocio` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id_comentario`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `produto` (
    `id_produto` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `descricao` TEXT NULL,
    `preco` DECIMAL(10, 2) NULL,
    `status` VARCHAR(191) NULL,
    `id_negocio` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id_produto`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `negocio` ADD CONSTRAINT `negocio_id_usuario_fkey` FOREIGN KEY (`id_usuario`) REFERENCES `usuario`(`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `endereco` ADD CONSTRAINT `endereco_id_negocio_fkey` FOREIGN KEY (`id_negocio`) REFERENCES `negocio`(`id_negocio`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `negocio_categoria` ADD CONSTRAINT `negocio_categoria_id_negocio_fkey` FOREIGN KEY (`id_negocio`) REFERENCES `negocio`(`id_negocio`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `negocio_categoria` ADD CONSTRAINT `negocio_categoria_id_categoria_fkey` FOREIGN KEY (`id_categoria`) REFERENCES `categoria`(`id_categoria`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `foto` ADD CONSTRAINT `foto_id_negocio_fkey` FOREIGN KEY (`id_negocio`) REFERENCES `negocio`(`id_negocio`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `avaliacao` ADD CONSTRAINT `avaliacao_id_usuario_fkey` FOREIGN KEY (`id_usuario`) REFERENCES `usuario`(`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `avaliacao` ADD CONSTRAINT `avaliacao_id_negocio_fkey` FOREIGN KEY (`id_negocio`) REFERENCES `negocio`(`id_negocio`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `favorito` ADD CONSTRAINT `favorito_id_usuario_fkey` FOREIGN KEY (`id_usuario`) REFERENCES `usuario`(`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `favorito` ADD CONSTRAINT `favorito_id_negocio_fkey` FOREIGN KEY (`id_negocio`) REFERENCES `negocio`(`id_negocio`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comentario` ADD CONSTRAINT `comentario_id_usuario_fkey` FOREIGN KEY (`id_usuario`) REFERENCES `usuario`(`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comentario` ADD CONSTRAINT `comentario_id_negocio_fkey` FOREIGN KEY (`id_negocio`) REFERENCES `negocio`(`id_negocio`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `produto` ADD CONSTRAINT `produto_id_negocio_fkey` FOREIGN KEY (`id_negocio`) REFERENCES `negocio`(`id_negocio`) ON DELETE CASCADE ON UPDATE CASCADE;
