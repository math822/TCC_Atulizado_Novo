"use client"

import { useEffect, useState } from "react"
import Logo from "../../components/Logo"

// Helper: Aceitar APENAS números no input
const apenasNumeros = (val: string) => val.replace(/\D/g, "")

// Helper: Formatar telefone -> (99) 99999-9999 ou (99) 9999-9999
const formatarTelefone = (val: string) => {
  const nums = val.replace(/\D/g, "").slice(0, 11)
  if (nums.length <= 10) {
    return nums.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3").trim()
  }
  return nums.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3").trim()
}

// Helper: Formatar CEP -> 00000-000
const formatarCEP = (val: string) => {
  const nums = val.replace(/\D/g, "").slice(0, 8)
  if (nums.length <= 5) return nums
  return nums.replace(/(\d{5})(\d{0,3})/, "$1-$2")
}

export default function CadastrarNegocio() {
  const [usuario, setUsuario] = useState<any>(null)
  const [categorias, setCategorias] = useState<any[]>([])
  const [idCategoria, setIdCategoria] = useState("")
  const [nome, setNome] = useState("")
  const [descricao, setDescricao] = useState("")
  const [telefone, setTelefone] = useState("")
  const [horario, setHorario] = useState("")
  const [rua, setRua] = useState("")
  const [numero, setNumero] = useState("")
  const [bairro, setBairro] = useState("")
  const [cidade, setCidade] = useState("")
  const [estado, setEstado] = useState("")
  const [cep, setCep] = useState("")
  const [imagem, setImagem] = useState<File | null>(null)
  const [preview, setPreview] = useState("")
  const [mensagem, setMensagem] = useState("")
  const [carregando, setCarregando] = useState(false)

  // Estados e Cidades da API do IBGE
  const [estadosIBGE, setEstadosIBGE] = useState<{ sigla: string; nome: string }[]>([])
  const [cidadesIBGE, setCidadesIBGE] = useState<{ nome: string }[]>([])

  useEffect(() => {
    const usuarioStorage = localStorage.getItem("usuario")

    if (usuarioStorage) {
      setUsuario(JSON.parse(usuarioStorage))
      buscarCategorias()
    }

    // Carrega lista de estados do IBGE em ordem alfabética
    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome")
      .then((res) => res.json())
      .then((data) => setEstadosIBGE(data))
      .catch((err) => console.log("Erro ao buscar estados:", err))
  }, [])

  // Atualiza as Cidades sempre que o Estado for alterado manualmente
  useEffect(() => {
    if (!estado) {
      setCidadesIBGE([])
      return
    }

    fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estado}/municipios?orderBy=nome`)
      .then((res) => res.json())
      .then((data) => setCidadesIBGE(data))
      .catch((err) => console.log("Erro ao buscar cidades:", err))
  }, [estado])

  async function buscarCep(valorInput: string) {
    const cepFormatado = formatarCEP(valorInput)
    setCep(cepFormatado)

    const cepLimpo = valorInput.replace(/\D/g, "")
    if (cepLimpo.length !== 8) return

    try {
      const resposta = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`)
      const dados = await resposta.json()

      if (dados.erro) return

      setRua(dados.logradouro || "")
      setBairro(dados.bairro || "")

      if (dados.uf) {
        setEstado(dados.uf)
        // Busca cidades diretamente para garantir que a opção existe no <select> antes de selecionar
        const resCidades = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${dados.uf}/municipios?orderBy=nome`)
        const listaCidades = await resCidades.json()
        setCidadesIBGE(listaCidades)
        setCidade(dados.localidade || "")
      }
    } catch (error) {
      console.log("Erro ao buscar CEP", error)
    }
  }

  async function buscarCategorias() {
    const resposta = await fetch("/api/categorias")
    const dados = await resposta.json()

    if (resposta.ok) {
      setCategorias(dados)

      if (dados.length > 0) {
        setIdCategoria(dados[0].id_categoria)
      }
    }
  }

  async function cadastrarNegocio(e: React.FormEvent) {
    e.preventDefault()
    setCarregando(true)
    setMensagem("")

    if (!usuario) {
      setMensagem("Você precisa fazer login antes de cadastrar um negócio.")
      setCarregando(false)
      return
    }

    let urlImagem = ""

    if (imagem) {
      const formData = new FormData()
      formData.append("arquivo", imagem)

      const upload = await fetch("/api/upload", {
        method: "POST",
        body: formData
      })

      const uploadDados = await upload.json()

      if (upload.ok) {
        urlImagem = uploadDados.url
      }
    }

    const resposta = await fetch("/api/negocios", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id_usuario: usuario.id_usuario,
        nome,
        descricao,
        telefone,
        horario_funcionamento: horario,
        rua,
        numero,
        bairro,
        cidade,
        estado,
        cep,
        imagem: urlImagem,
        id_categoria: idCategoria
      })
    })

    const dados = await resposta.json()

    if (resposta.ok) {
      setMensagem("Negócio cadastrado com sucesso!")

      setNome("")
      setDescricao("")
      setTelefone("")
      setHorario("")
      setRua("")
      setNumero("")
      setBairro("")
      setCidade("")
      setEstado("")
      setCep("")
      setImagem(null)
      setPreview("")
    } else {
      setMensagem(dados.error || "Erro ao cadastrar negócio.")
    }

    setCarregando(false)
  }

  return (
    <main className="min-h-screen bg-[#fff7ed] dark:bg-slate-950 py-20 px-6">
      <div className="max-w-5xl mx-auto mb-6">
        <Logo />
      </div>

      <div className="max-w-5xl mx-auto bg-white rounded-[40px] shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-orange-600 to-orange-400 p-12 text-white">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-3xl bg-white/20 flex items-center justify-center text-5xl">
              🏪
            </div>

            <div>
              <h1 className="text-5xl font-black">Cadastre seu negócio</h1>
              <p className="text-orange-100 mt-2 text-lg">
                Divulgue sua empresa para milhares de clientes.
              </p>
            </div>
          </div>
        </div>

        {!usuario && (
          <div className="m-10 bg-red-50 border border-red-200 text-red-700 rounded-2xl p-5 font-bold">
            Você precisa estar logado para cadastrar um negócio.
            <a href="/login?redirect=/cadastrar-negocio" className="ml-2 underline">
              Entrar agora
            </a>
          </div>
        )}

        <form onSubmit={cadastrarNegocio} className="p-10 space-y-6">
          <div>
            <label className="font-bold text-gray-700">Foto principal do negócio</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const arquivo = e.target.files?.[0]
                if (arquivo) {
                  setImagem(arquivo)
                  setPreview(URL.createObjectURL(arquivo))
                }
              }}
              className="w-full mt-2 border border-orange-100 rounded-2xl p-4 outline-none focus:border-orange-500"
            />

            {preview && (
              <div className="mt-4 overflow-hidden rounded-3xl border border-orange-100">
                <img src={preview} alt="Preview" className="w-full h-72 object-cover" />
              </div>
            )}

            {imagem && (
              <p className="mt-2 text-sm text-orange-600 font-bold">
                Imagem selecionada: {imagem.name}
              </p>
            )}
          </div>

          <div>
            <label className="font-bold text-gray-700">Nome do negócio</label>
            <input
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Lanche do Zé"
              className="w-full mt-2 border border-orange-100 rounded-2xl p-4 outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="font-bold text-gray-700">Categoria do negócio</label>
            <select
              required
              value={idCategoria}
              onChange={(e) => setIdCategoria(e.target.value)}
              className="w-full mt-2 border border-orange-100 rounded-2xl p-4 outline-none focus:border-orange-500 bg-white text-gray-800"
            >
              <option value="">Selecione uma categoria</option>
              {categorias.map((categoria) => (
                <option key={categoria.id_categoria} value={categoria.id_categoria}>
                  {categoria.nome}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-bold text-gray-700">Descrição</label>
            <textarea
              required
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Fale sobre seu negócio..."
              className="w-full mt-2 border border-orange-100 rounded-2xl p-4 h-36 outline-none focus:border-orange-500"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="font-bold text-gray-700">Telefone</label>
              <input
                required
                type="text"
                value={telefone}
                onChange={(e) => setTelefone(formatarTelefone(e.target.value))}
                placeholder="(19) 99999-9999"
                maxLength={15}
                className="w-full mt-2 border border-orange-100 rounded-2xl p-4 outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="font-bold text-gray-700">Horário de funcionamento</label>
              <input
                value={horario}
                onChange={(e) => setHorario(e.target.value)}
                placeholder="Ex: Segunda a sábado, 10h às 22h"
                className="w-full mt-2 border border-orange-100 rounded-2xl p-4 outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div className="border-t border-orange-100 pt-8">
            <h2 className="text-3xl font-black text-orange-600 flex items-center gap-3">
              📍 Endereço do negócio
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="font-bold text-gray-700 text-sm">CEP</label>
              <input
                required
                type="text"
                value={cep}
                onChange={(e) => buscarCep(e.target.value)}
                placeholder="00000-000"
                maxLength={9}
                className="w-full mt-1 border border-orange-100 rounded-2xl p-4 outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="font-bold text-gray-700 text-sm">Número</label>
              <input
                required
                type="text"
                value={numero}
                onChange={(e) => setNumero(apenasNumeros(e.target.value))}
                placeholder="Ex: 123"
                className="w-full mt-1 border border-orange-100 rounded-2xl p-4 outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="font-bold text-gray-700 text-sm">Rua</label>
              <input
                required
                value={rua}
                onChange={(e) => setRua(e.target.value)}
                placeholder="Rua"
                className="w-full mt-1 border border-orange-100 rounded-2xl p-4 outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="font-bold text-gray-700 text-sm">Bairro</label>
              <input
                required
                value={bairro}
                onChange={(e) => setBairro(e.target.value)}
                placeholder="Bairro"
                className="w-full mt-1 border border-orange-100 rounded-2xl p-4 outline-none focus:border-orange-500"
              />
            </div>

            {/* Select Dinâmico de Estado (IBGE) */}
            <div>
              <label className="font-bold text-gray-700 text-sm">Estado</label>
              <select
                required
                value={estado}
                onChange={(e) => {
                  setEstado(e.target.value)
                  setCidade("") // Reseta a cidade ao trocar o estado manualmente
                }}
                className="w-full mt-1 border border-orange-100 rounded-2xl p-4 outline-none focus:border-orange-500 bg-white text-gray-800"
              >
                <option value="">Selecione o Estado</option>
                {estadosIBGE.map((est) => (
                  <option key={est.sigla} value={est.sigla}>
                    {est.nome} ({est.sigla})
                  </option>
                ))}
              </select>
            </div>

            {/* Select Dinâmico de Cidade (IBGE) */}
            <div>
              <label className="font-bold text-gray-700 text-sm">Cidade</label>
              <select
                required
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
                disabled={!estado}
                className="w-full mt-1 border border-orange-100 rounded-2xl p-4 outline-none focus:border-orange-500 bg-white text-gray-800 disabled:bg-gray-100"
              >
                <option value="">
                  {estado ? "Selecione a Cidade" : "Selecione um Estado primeiro"}
                </option>
                {cidadesIBGE.map((cid) => (
                  <option key={cid.nome} value={cid.nome}>
                    {cid.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            disabled={carregando || !usuario}
            className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 transition text-white font-black py-5 rounded-2xl text-xl shadow-xl"
          >
            {carregando ? "Cadastrando..." : "Cadastrar negócio"}
          </button>

          {mensagem && (
            <p className="text-center font-bold text-orange-700">
              {mensagem}
            </p>
          )}
        </form>
      </div>
    </main>
  )
}