const estilos: Record<string, { icone: string; cores: [string, string][] }> = {
  Alimentação: {
    icone: "🍔",
    cores: [["#f97316", "#fbbf24"], ["#dc2626", "#fb923c"], ["#ea580c", "#fde047"]],
  },
  Beleza: {
    icone: "✂️",
    cores: [["#db2777", "#c084fc"], ["#9333ea", "#f472b6"], ["#be185d", "#fb7185"]],
  },
  Informática: {
    icone: "💻",
    cores: [["#0284c7", "#22d3ee"], ["#2563eb", "#818cf8"], ["#0369a1", "#2dd4bf"]],
  },
  Moda: {
    icone: "👗",
    cores: [["#7c3aed", "#ec4899"], ["#4f46e5", "#a855f7"], ["#9333ea", "#f43f5e"]],
  },
  Serviços: {
    icone: "🛠️",
    cores: [["#059669", "#2dd4bf"], ["#0f766e", "#84cc16"], ["#047857", "#38bdf8"]],
  },
  Artesanato: {
    icone: "🧶",
    cores: [["#b45309", "#f59e0b"], ["#c2410c", "#fb7185"], ["#a16207", "#eab308"]],
  },
}

function escapar(texto: string) {
  return texto.replace(/[<>&"']/g, (caractere) => ({
    "<": "&lt;",
    ">": "&gt;",
    "&": "&amp;",
    '"': "&quot;",
    "'": "&apos;",
  })[caractere] || caractere)
}

function quebrarNome(nome: string) {
  if (nome.length <= 22) return [nome]
  const palavras = nome.split(" ")
  const metade = Math.ceil(palavras.length / 2)
  return [palavras.slice(0, metade).join(" "), palavras.slice(metade).join(" ")]
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const nome = escapar((searchParams.get("nome") || "Negócio local").slice(0, 50))
  const categoria = escapar((searchParams.get("categoria") || "Comércio local").slice(0, 30))
  const indice = Number(searchParams.get("indice") || 0)
  const estilo = estilos[categoria] || { icone: "🏪", cores: [["#ea580c", "#f59e0b"]] }
  const [cor1, cor2] = estilo.cores[Math.abs(indice) % estilo.cores.length]
  const linhas = quebrarNome(nome)

  const titulo = linhas.length === 1
    ? `<text x="92" y="475" fill="white" font-family="Arial, sans-serif" font-size="68" font-weight="900">${linhas[0]}</text>`
    : `<text x="92" y="435" fill="white" font-family="Arial, sans-serif" font-size="62" font-weight="900">${linhas[0]}</text><text x="92" y="505" fill="white" font-family="Arial, sans-serif" font-size="62" font-weight="900">${linhas[1]}</text>`

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="700" viewBox="0 0 1200 700">
    <defs>
      <linearGradient id="fundo" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${cor1}"/>
        <stop offset="1" stop-color="${cor2}"/>
      </linearGradient>
      <filter id="sombra"><feDropShadow dx="0" dy="18" stdDeviation="24" flood-opacity=".22"/></filter>
    </defs>
    <rect width="1200" height="700" fill="url(#fundo)"/>
    <circle cx="1060" cy="60" r="260" fill="white" opacity=".10"/>
    <circle cx="1100" cy="650" r="330" fill="white" opacity=".08"/>
    <circle cx="80" cy="40" r="140" fill="white" opacity=".07"/>
    <g filter="url(#sombra)">
      <rect x="72" y="65" width="1056" height="570" rx="52" fill="white" opacity=".14"/>
      <rect x="92" y="90" width="158" height="158" rx="42" fill="white" opacity=".92"/>
      <text x="171" y="194" text-anchor="middle" font-size="82">${estilo.icone}</text>
    </g>
    <rect x="92" y="285" width="290" height="54" rx="27" fill="white" opacity=".92"/>
    <text x="237" y="321" text-anchor="middle" fill="${cor1}" font-family="Arial, sans-serif" font-size="24" font-weight="800" letter-spacing="2">${categoria.toUpperCase()}</text>
    ${titulo}
    <text x="94" y="570" fill="white" opacity=".88" font-family="Arial, sans-serif" font-size="28" font-weight="600">Comércio local • Campinas, SP</text>
    <g transform="translate(895 335)">
      <path d="M0 48h220l-28-70H28z" fill="white" opacity=".95"/>
      <rect x="18" y="48" width="184" height="160" rx="18" fill="white" opacity=".88"/>
      <rect x="46" y="94" width="58" height="114" rx="8" fill="${cor1}" opacity=".75"/>
      <rect x="124" y="92" width="52" height="50" rx="8" fill="${cor2}" opacity=".70"/>
    </g>
  </svg>`

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  })
}
