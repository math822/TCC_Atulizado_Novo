import { NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import path from "path"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()

    const arquivo = formData.get("arquivo") as File | null

    if (!arquivo) {
      return NextResponse.json(
        { error: "Nenhum arquivo enviado" },
        { status: 400 }
      )
    }

    const bytes = await arquivo.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const nomeArquivo = `${Date.now()}-${arquivo.name
      .replaceAll(" ", "-")
      .replace(/[^\w.-]/g, "")}`

    const pastaUploads = path.join(
      process.cwd(),
      "public",
      "uploads"
    )

    await mkdir(pastaUploads, { recursive: true })

    const caminhoArquivo = path.join(
      pastaUploads,
      nomeArquivo
    )

    await writeFile(caminhoArquivo, buffer)

    return NextResponse.json({
      url: `/uploads/${nomeArquivo}`
    })

  } catch (error) {
    console.log("ERRO NO UPLOAD:", error)

    return NextResponse.json(
      { error: "Erro ao fazer upload" },
      { status: 500 }
    )
  }
}