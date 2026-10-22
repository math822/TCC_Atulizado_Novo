-- CreateEnum
CREATE TYPE "TipoUsuario" AS ENUM ('cliente', 'empreendedor', 'admin');

-- CreateEnum
CREATE TYPE "StatusVerificacao" AS ENUM ('nao_solicitada', 'pendente', 'aprovado', 'rejeitado');

-- CreateTable
CREATE TABLE "Usuario" (
    "id_usuario" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "telefone" TEXT,
    "tipo" "TipoUsuario" NOT NULL,
    "cnpj" TEXT,
    "status_verificacao" "StatusVerificacao" NOT NULL DEFAULT 'nao_solicitada',
    "foto_perfil" TEXT,
    "data_cadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id_usuario")
);

CREATE TABLE "negocio" (
    "id_negocio" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "telefone" TEXT,
    "horario_funcionamento" TEXT,
    "status" TEXT,
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "media_avaliacao" DECIMAL(2,1) NOT NULL DEFAULT 0.0,
    "id_usuario" TEXT NOT NULL,
    CONSTRAINT "negocio_pkey" PRIMARY KEY ("id_negocio")
);

CREATE TABLE "endereco" (
    "id_endereco" TEXT NOT NULL,
    "cep" TEXT,
    "rua" TEXT,
    "numero" TEXT,
    "complemento" TEXT,
    "bairro" TEXT,
    "cidade" TEXT,
    "estado" TEXT,
    "id_negocio" TEXT NOT NULL,
    CONSTRAINT "endereco_pkey" PRIMARY KEY ("id_endereco")
);

CREATE TABLE "categoria" (
    "id_categoria" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    CONSTRAINT "categoria_pkey" PRIMARY KEY ("id_categoria")
);

CREATE TABLE "foto" (
    "id_foto" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "id_negocio" TEXT NOT NULL,
    CONSTRAINT "foto_pkey" PRIMARY KEY ("id_foto")
);

CREATE TABLE "avaliacao" (
    "id_avaliacao" TEXT NOT NULL,
    "nota" INTEGER NOT NULL,
    "comentario" TEXT,
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_usuario" TEXT NOT NULL,
    "id_negocio" TEXT NOT NULL,
    CONSTRAINT "avaliacao_pkey" PRIMARY KEY ("id_avaliacao")
);

CREATE TABLE "favorito" (
    "id_favorito" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_usuario" TEXT NOT NULL,
    "id_negocio" TEXT NOT NULL,
    CONSTRAINT "favorito_pkey" PRIMARY KEY ("id_favorito")
);

CREATE TABLE "comentario" (
    "id_comentario" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_usuario" TEXT NOT NULL,
    "id_negocio" TEXT NOT NULL,
    CONSTRAINT "comentario_pkey" PRIMARY KEY ("id_comentario")
);

CREATE TABLE "produto" (
    "id_produto" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "preco" DECIMAL(10,2) NOT NULL,
    "status" TEXT DEFAULT 'ativo',
    "imagem" TEXT,
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_negocio" TEXT NOT NULL,
    CONSTRAINT "produto_pkey" PRIMARY KEY ("id_produto")
);

CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");
CREATE UNIQUE INDEX "Usuario_cnpj_key" ON "Usuario"("cnpj");
CREATE UNIQUE INDEX "endereco_id_negocio_key" ON "endereco"("id_negocio");
CREATE UNIQUE INDEX "categoria_nome_key" ON "categoria"("nome");
CREATE UNIQUE INDEX "favorito_id_usuario_id_negocio_key" ON "favorito"("id_usuario", "id_negocio");

ALTER TABLE "negocio" ADD CONSTRAINT "negocio_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "endereco" ADD CONSTRAINT "endereco_id_negocio_fkey" FOREIGN KEY ("id_negocio") REFERENCES "negocio"("id_negocio") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "foto" ADD CONSTRAINT "foto_id_negocio_fkey" FOREIGN KEY ("id_negocio") REFERENCES "negocio"("id_negocio") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "avaliacao" ADD CONSTRAINT "avaliacao_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "avaliacao" ADD CONSTRAINT "avaliacao_id_negocio_fkey" FOREIGN KEY ("id_negocio") REFERENCES "negocio"("id_negocio") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "favorito" ADD CONSTRAINT "favorito_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "favorito" ADD CONSTRAINT "favorito_id_negocio_fkey" FOREIGN KEY ("id_negocio") REFERENCES "negocio"("id_negocio") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "comentario" ADD CONSTRAINT "comentario_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "comentario" ADD CONSTRAINT "comentario_id_negocio_fkey" FOREIGN KEY ("id_negocio") REFERENCES "negocio"("id_negocio") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "produto" ADD CONSTRAINT "produto_id_negocio_fkey" FOREIGN KEY ("id_negocio") REFERENCES "negocio"("id_negocio") ON DELETE CASCADE ON UPDATE CASCADE;
