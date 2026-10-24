import { NextResponse } from "next/server"

import { sessaoObrigatoria } from "../../lib/auth"

const TAMAXO_BYTES = 5 * 1024 * 1024
const BUCKET = process.env.SUPABASE_BUCKET || "midias"

// A Vercel tem sistema de arquivos somente-leitura, então o upload de imagem não pode
// viver em public/uploads: o arquivo vai para o Storage do mesmo Supabase do banco.
function urlObjeto(chave: string) {
  const base = (process.env.SUPABASE_URL || "").replace(/\/$/, "")
  return `${base}/storage/v1/object/public/${BUCKET}/${chave}`
}

async function garantirBucket(servidor: string, chave: string) {
  const resposta = await fetch(`${servidor}/storage/v1/bucket`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${chave}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ id: BUCKET, name: BUCKET, public: true })
  })

  // 409/400 = o bucket já existe, que é o caso normal depois do primeiro upload.
  return resposta.ok || resposta.status === 409
}

export async function POST(req: Request) {
  try {
    const sessao = await sessaoObrigatoria()
    if (sessao instanceof NextResponse) return sessao

    const servidor = process.env.SUPABASE_URL
    const chave = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!servidor || !chave) {
      return NextResponse.json(
        { error: "Upload indisponível: faltam SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY." },
        { status: 500 }
      )
    }

    const formData = await req.formData()
    const arquivo = formData.get("arquivo") as File | null

    if (!arquivo) {
      return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 })
    }

    if (!arquivo.type.startsWith("image/")) {
      return NextResponse.json({ error: "Envie apenas imagens." }, { status: 400 })
    }

    if (arquivo.size > TAMAXO_BYTES) {
      return NextResponse.json(
        { error: "A imagem precisa ter no máximo 5 MB." },
        { status: 400 }
      )
    }

    const extensao = (arquivo.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "")
    const nomeLimpo = arquivo.name.replace(/[^\w.-]/g, "").replace(/ /g, "-") || "imagem"
    const chaveObjeto = `${sessao.id_usuario}/${Date.now()}-${nomeLimpo}`

    await garantirBucket(servidor, chave)

    const envio = await fetch(`${servidor}/storage/v1/object/${BUCKET}/${chaveObjeto}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${chave}`,
        "Content-Type": arquivo.type,
        "x-upsert": "true"
      },
      body: await arquivo.arrayBuffer()
    })

    if (!envio.ok) {
      const detalhe = await envio.text().catch(() => "")
      console.log("ERRO STORAGE:", envio.status, detalhe)

      return NextResponse.json({ error: "Não foi possível salvar a imagem." }, { status: 502 })
    }

    return NextResponse.json({ url: urlObjeto(chaveObjeto) })
  } catch (error) {
    console.log("ERRO NO UPLOAD:", error)

    return NextResponse.json({ error: "Erro ao fazer upload" }, { status: 500 })
  }
}
