/*
  Warnings:

  - You are about to drop the column `data_avaliacao` on the `avaliacao` table. All the data in the column will be lost.
  - You are about to drop the column `descricao` on the `categoria` table. All the data in the column will be lost.
  - You are about to drop the column `data_comentario` on the `comentario` table. All the data in the column will be lost.
  - You are about to drop the column `latitude` on the `endereco` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `endereco` table. All the data in the column will be lost.
  - You are about to drop the column `descricao` on the `foto` table. All the data in the column will be lost.
  - You are about to drop the column `foto_principal` on the `foto` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `produto` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[nome]` on the table `categoria` will be added.
  - A unique constraint covering the columns `[cnpj]` on the table `usuario` will be added.
  - Made the column `preco` on table `produto` required.
*/

ALTER TABLE `avaliacao`
    DROP COLUMN `data_avaliacao`,
    ADD COLUMN `data` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

ALTER TABLE `categoria`
    DROP COLUMN `descricao`;

ALTER TABLE `comentario`
    DROP COLUMN `data_comentario`,
    ADD COLUMN `data` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

ALTER TABLE `endereco`
    DROP COLUMN `latitude`,
    DROP COLUMN `longitude`,
    ADD COLUMN `complemento` VARCHAR(191) NULL;

ALTER TABLE `favorito`
    ADD COLUMN `data` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

ALTER TABLE `foto`
    DROP COLUMN `descricao`,
    DROP COLUMN `foto_principal`,
    MODIFY `url` VARCHAR(191) NOT NULL;

ALTER TABLE `produto`
    DROP COLUMN `status`,
    ADD COLUMN `data_criacao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `imagem` VARCHAR(191) NULL,
    MODIFY `preco` DECIMAL(10, 2) NOT NULL;

ALTER TABLE `usuario`
    ADD COLUMN `cnpj` VARCHAR(191) NULL,
    ADD COLUMN `status_verificacao`
        ENUM('nao_solicitada', 'pendente', 'aprovado', 'rejeitado')
        NOT NULL DEFAULT 'nao_solicitada';

CREATE UNIQUE INDEX `categoria_nome_key`
    ON `categoria`(`nome`);

CREATE UNIQUE INDEX `Usuario_cnpj_key`
    ON `usuario`(`cnpj`);