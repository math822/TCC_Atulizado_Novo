import { NextResponse } from "next/server"
import prisma from "../../lib/prisma"
import { sessaoObrigatoria } from "../../lib/auth"
import bcrypt from "bcryptjs"

export async function PUT(req: Request) {
  try {
    const body = await req.json()

    const sessao = await sessaoObrigatoria(body.id_usuario)
    if (sessao instanceof NextResponse) return sessao

    const usuario = await prisma.usuario.findUnique({
      where: {
        id_usuario: sessao.id_usuario
      }
    })

    if (!usuario) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      )
    }

    let senhaHash = usuario.senha

    if (body.senhaAtual || body.novaSenha) {
      if (!body.senhaAtual || !body.novaSenha) {
        return NextResponse.json(
          { error: "Preencha a senha atual e a nova senha" },
          { status: 400 }
        )
      }

      const senhaCorreta = await bcrypt.compare(
        body.senhaAtual,
        usuario.senha
      )

      if (!senhaCorreta) {
        return NextResponse.json(
          { error: "Senha atual incorreta" },
          { status: 401 }
        )
      }

      senhaHash = await bcrypt.hash(body.novaSenha, 10)
    }

    const usuarioAtualizado = await prisma.usuario.update({
      where: {
        id_usuario: sessao.id_usuario
      },
      data: {
        nome: body.nome,
        email: body.email,
        senha: senhaHash,
        foto_perfil: body.foto_perfil || usuario.foto_perfil
      }
    })

    return NextResponse.json({
      message: "Perfil atualizado com sucesso",
      usuario: {
        id_usuario: usuarioAtualizado.id_usuario,
        nome: usuarioAtualizado.nome,
        email: usuarioAtualizado.email,
        tipo: usuarioAtualizado.tipo,
        foto_perfil: usuarioAtualizado.foto_perfil
      }
    })

  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao atualizar perfil" },
      { status: 500 }
    )
  }
}

// O frontend chama DELETE /api/perfil?id=<uuid>; o id vem da sessão, não da query.
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)

    const sessao = await sessaoObrigatoria(searchParams.get("id"))
    if (sessao instanceof NextResponse) return sessao

    // Os relacionamentos de Usuario têm onDelete: Cascade, então negócios,
    // produtos, avaliações, favoritos e conversas caem junto com a conta.
    await prisma.usuario.delete({
      where: {
        id_usuario: sessao.id_usuario
      }
    })

    const resposta = NextResponse.json({
      message: "Conta excluída com sucesso"
    })

    resposta.cookies.set("usuario", "", {
      path: "/",
      maxAge: 0
    })

    return resposta

  } catch (error) {
    console.log("ERRO EXCLUIR CONTA:", error)

    return NextResponse.json(
      { error: "Erro ao excluir conta" },
      { status: 500 }
    )
  }
}