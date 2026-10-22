const { PrismaClient } = require("@prisma/client")
const bcrypt = require("bcryptjs")

const prisma = new PrismaClient()

const categorias = [
  {
    nome: "Alimentação",
    descricao: "Restaurantes, lanches e comidas",
    icone: "🍔",
    imagem: "/categorias/Comida.png",
    negocios: [
      ["Sabor da Vila", "Comida caseira preparada diariamente com ingredientes frescos.", "Cambuí", ["Prato executivo", 29.9], ["Marmita especial", 24.9]],
      ["Burger do Bairro", "Hambúrgueres artesanais, porções e combos para toda a família.", "Taquaral", ["X-Burger artesanal", 27.9], ["Combo da casa", 39.9]],
      ["Cantinho Mineiro", "Receitas mineiras tradicionais com aquele sabor de comida de família.", "Centro", ["Feijão tropeiro", 32.9], ["Frango com quiabo", 34.9]],
      ["Doce Encontro", "Bolos, doces e sobremesas feitos com muito carinho.", "Guanabara", ["Fatia de bolo", 12.9], ["Caixa de brigadeiros", 28.0]],
      ["Pizza da Praça", "Pizzas de fermentação natural com sabores clássicos e especiais.", "Barão Geraldo", ["Pizza margherita", 49.9], ["Pizza calabresa", 54.9]],
    ],
  },
  {
    nome: "Beleza",
    descricao: "Salões, barbearias e estética",
    icone: "💈",
    imagem: "/categorias/Beleza.png",
    negocios: [
      ["Studio Bella", "Cortes, escovas, coloração e cuidados completos para seus cabelos.", "Cambuí", ["Corte feminino", 65.0], ["Escova", 45.0]],
      ["Barbearia Central", "Corte masculino, barba e atendimento com hora marcada.", "Centro", ["Corte masculino", 40.0], ["Barba completa", 30.0]],
      ["Espaço Aurora", "Estética facial, massagens e tratamentos para renovar sua autoestima.", "Taquaral", ["Limpeza de pele", 90.0], ["Massagem relaxante", 110.0]],
      ["Nails & Cia", "Manicure, pedicure e nail art em um ambiente confortável.", "Bonfim", ["Manicure", 35.0], ["Alongamento em gel", 130.0]],
      ["Cachos da Lê", "Especialistas em cabelos cacheados, crespos e ondulados.", "Ouro Verde", ["Corte a seco", 75.0], ["Hidratação profunda", 85.0]],
    ],
  },
  {
    nome: "Informática",
    descricao: "Assistência técnica e tecnologia",
    icone: "💻",
    imagem: "/categorias/Informatica.png",
    negocios: [
      ["Tech Rápido", "Manutenção de computadores e notebooks com diagnóstico transparente.", "Centro", ["Formatação completa", 120.0], ["Limpeza preventiva", 90.0]],
      ["Cell Fix Campinas", "Conserto de celulares, troca de tela e acessórios.", "Cambuí", ["Troca de tela", 249.9], ["Película 3D", 35.0]],
      ["Byte Soluções", "Suporte de TI para pequenos negócios e profissionais autônomos.", "Taquaral", ["Suporte remoto", 80.0], ["Visita técnica", 150.0]],
      ["Gamer Lab", "Montagem, upgrade e manutenção de computadores gamer.", "Barão Geraldo", ["Montagem de PC", 250.0], ["Upgrade de memória", 180.0]],
      ["Info House", "Periféricos, acessórios e manutenção para sua rotina digital.", "Guanabara", ["Teclado sem fio", 89.9], ["Mouse ergonômico", 69.9]],
    ],
  },
  {
    nome: "Moda",
    descricao: "Roupas, calçados e acessórios",
    icone: "👗",
    imagem: "/categorias/Moda.png",
    negocios: [
      ["Boutique da Ana", "Moda feminina atual com peças selecionadas e atendimento personalizado.", "Cambuí", ["Vestido midi", 149.9], ["Blusa estampada", 79.9]],
      ["Estilo Urbano", "Roupas casuais e streetwear para todos os estilos.", "Centro", ["Camiseta oversized", 69.9], ["Calça cargo", 139.9]],
      ["Passo Certo", "Calçados confortáveis para o dia a dia e ocasiões especiais.", "Taquaral", ["Tênis casual", 189.9], ["Sandália feminina", 119.9]],
      ["Pequenos Encantos", "Moda infantil confortável, colorida e cheia de personalidade.", "Nova Europa", ["Conjunto infantil", 89.9], ["Vestido infantil", 99.9]],
      ["Acessórios da Vila", "Bolsas, bijuterias e acessórios para completar seu visual.", "Bonfim", ["Bolsa transversal", 109.9], ["Kit de brincos", 39.9]],
    ],
  },
  {
    nome: "Serviços",
    descricao: "Prestadores de serviço",
    icone: "🛠️",
    imagem: "/categorias/Servico.png",
    negocios: [
      ["Elétrica Segura", "Instalações e reparos elétricos residenciais com segurança.", "Jardim Chapadão", ["Visita técnica", 100.0], ["Instalação de tomada", 75.0]],
      ["Repara Fácil", "Pequenos reparos, montagem de móveis e manutenção residencial.", "Taquaral", ["Montagem de móvel", 120.0], ["Reparo hidráulico", 110.0]],
      ["Limpa Bem", "Limpeza residencial e comercial com equipe de confiança.", "Centro", ["Faxina residencial", 180.0], ["Limpeza pós-obra", 450.0]],
      ["Pet Feliz", "Banho, tosa e cuidados especiais para seu melhor amigo.", "Cambuí", ["Banho completo", 65.0], ["Banho e tosa", 95.0]],
      ["Foto Memória", "Fotografia de eventos, famílias, produtos e ensaios especiais.", "Guanabara", ["Ensaio externo", 350.0], ["Fotos de produto", 280.0]],
    ],
  },
  {
    nome: "Artesanato",
    descricao: "Produtos artesanais",
    icone: "🧶",
    imagem: "/categorias/Artesanato.png",
    negocios: [
      ["Ateliê da Nanda", "Peças exclusivas em crochê feitas à mão e sob encomenda.", "Barão Geraldo", ["Bolsa de crochê", 120.0], ["Amigurumi", 85.0]],
      ["Cerâmica Raiz", "Cerâmicas utilitárias e decorativas produzidas artesanalmente.", "Sousas", ["Caneca artesanal", 65.0], ["Vaso decorativo", 110.0]],
      ["Velas & Afeto", "Velas aromáticas artesanais para tornar cada ambiente especial.", "Cambuí", ["Vela aromática", 49.9], ["Kit presenteável", 89.9]],
      ["Madeira Viva", "Decoração e utensílios em madeira de origem responsável.", "Joaquim Egídio", ["Tábua artesanal", 95.0], ["Porta-chaves", 55.0]],
      ["Papel com Arte", "Papelaria personalizada para festas, presentes e momentos únicos.", "Taquaral", ["Caderno personalizado", 59.9], ["Kit festa", 149.9]],
    ],
  },
]

function slug(texto) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ".")
    .replace(/^\.|\.$/g, "")
}

async function main() {
  const senha = await bcrypt.hash("Senai1234", 10)
  const categoriasSalvas = new Map()

  for (const categoria of categorias) {
    const salva = await prisma.categoria.upsert({
      where: { nome: categoria.nome },
      update: { descricao: categoria.descricao, icone: categoria.icone },
      create: {
        nome: categoria.nome,
        descricao: categoria.descricao,
        icone: categoria.icone,
      },
    })
    categoriasSalvas.set(categoria.nome, salva)
  }

  const avaliadores = []
  for (let i = 1; i <= 5; i++) {
    const usuario = await prisma.usuario.upsert({
      where: { email: `cliente.teste${i}@ladavendinha.com` },
      update: { senha, nome: `Cliente Teste ${i}`, tipo: "cliente" },
      create: {
        nome: `Cliente Teste ${i}`,
        email: `cliente.teste${i}@ladavendinha.com`,
        senha,
        telefone: `(19) 98888-00${String(i).padStart(2, "0")}`,
        tipo: "cliente",
      },
    })
    avaliadores.push(usuario)
  }

  const proprietarios = []
  let indice = 0

  for (const categoria of categorias) {
    for (const dados of categoria.negocios) {
      indice++
      const [nome] = dados
      const email = `${slug(nome)}@ladavendinha.com`
      const proprietario = await prisma.usuario.upsert({
        where: { email },
        update: {
          nome: `Responsável ${nome}`,
          senha,
          tipo: "empreendedor",
          status_verificacao: "aprovado",
        },
        create: {
          nome: `Responsável ${nome}`,
          email,
          senha,
          telefone: `(19) 9${String(80000000 + indice).padStart(8, "0")}`,
          tipo: "empreendedor",
          cnpj: String(10000000000000 + indice),
          status_verificacao: "aprovado",
        },
      })
      proprietarios.push(proprietario)
    }
  }

  await prisma.negocio.deleteMany({
    where: { id_usuario: { in: proprietarios.map((usuario) => usuario.id_usuario) } },
  })

  indice = 0
  for (const categoria of categorias) {
    const categoriaSalva = categoriasSalvas.get(categoria.nome)

    for (const dados of categoria.negocios) {
      const [nome, descricao, bairro, produto1, produto2] = dados
      const proprietario = proprietarios[indice]
      const conjuntosDeNotas = [
        [5, 5, 5],
        [5, 5, 4],
        [5, 4, 4],
        [5, 5, 5],
        [5, 5, 4],
      ]
      const notas = conjuntosDeNotas[indice % conjuntosDeNotas.length]
      const media = notas.reduce((total, nota) => total + nota, 0) / notas.length
      indice++
      const imagemNegocio = `/api/imagem-negocio?nome=${encodeURIComponent(nome)}&categoria=${encodeURIComponent(categoria.nome)}&indice=${indice}&v=2`

      const negocio = await prisma.negocio.create({
        data: {
          nome,
          descricao,
          telefone: proprietario.telefone,
          horario_funcionamento: "Segunda a sábado, das 9h às 19h",
          status: "ativo",
          media_avaliacao: Number(media.toFixed(1)),
          id_usuario: proprietario.id_usuario,
          id_categoria: categoriaSalva.id_categoria,
          endereco: {
            create: {
              cep: "13010-001",
              rua: `Rua ${nome}`,
              numero: String(100 + indice),
              bairro,
              cidade: "Campinas",
              estado: "SP",
            },
          },
          fotos: { create: [{ url: imagemNegocio }] },
          produtos: {
            create: [
              {
                nome: produto1[0],
                descricao: `Produto em destaque do ${nome}.`,
                preco: produto1[1],
                status: "disponivel",
                imagem: imagemNegocio,
              },
              {
                nome: produto2[0],
                descricao: `Uma das opções mais procuradas no ${nome}.`,
                preco: produto2[1],
                status: "disponivel",
                imagem: imagemNegocio,
              },
            ],
          },
        },
      })

      await prisma.avaliacao.createMany({
        data: notas.map((nota, avaliadorIndex) => ({
          nota,
          comentario: nota === 5 ? "Atendimento excelente, recomendo!" : "Ótima experiência e bom atendimento.",
          id_usuario: avaliadores[avaliadorIndex].id_usuario,
          id_negocio: negocio.id_negocio,
        })),
      })
    }
  }

  console.log("Seed concluído:")
  console.log(`- ${await prisma.categoria.count()} categorias`)
  console.log(`- ${await prisma.negocio.count()} negócios no total`)
  console.log(`- ${await prisma.produto.count()} produtos no total`)
  console.log(`- ${await prisma.avaliacao.count()} avaliações no total`)
  console.log("Senha padrão das contas fictícias: Senai1234")
}

main()
  .catch((erro) => {
    console.error(erro)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
