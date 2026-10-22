const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

const categorias = [
  { nome: "Alimentação", descricao: "Restaurantes, lanches e comidas", icone: "🍔" },
  { nome: "Beleza", descricao: "Salões, barbearias e estética", icone: "💈" },
  { nome: "Informática", descricao: "Assistência técnica e tecnologia", icone: "💻" },
  { nome: "Moda", descricao: "Roupas, calçados e acessórios", icone: "👗" },
  { nome: "Serviços", descricao: "Prestadores de serviço", icone: "🛠️" },
  { nome: "Artesanato", descricao: "Produtos artesanais", icone: "🧶" },
]

async function main() {
  for (const categoria of categorias) {
    await prisma.categoria.upsert({
      where: { nome: categoria.nome },
      update: { descricao: categoria.descricao, icone: categoria.icone },
      create: categoria,
    })
  }
  const total = await prisma.categoria.count()
  console.log(`Categorias no banco: ${total}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
