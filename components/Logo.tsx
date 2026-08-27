import Link from "next/link"

export default function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-3 min-w-fit hover:scale-105 transition"
    >
      <div className="w-14 h-14">
        <svg viewBox="0 0 64 64" className="w-full h-full">
          <rect
            x="18"
            y="26"
            width="28"
            height="23"
            rx="5"
            fill="#202020"
          />

          <rect
            x="15"
            y="18"
            width="34"
            height="10"
            rx="3"
            fill="#ff5a00"
          />

          <path
            d="M15 18h34l-4-9H19l-4 9z"
            fill="#ff6a00"
          />

          <circle
            cx="44"
            cy="46"
            r="11"
            fill="#202020"
          />

          <circle
            cx="44"
            cy="46"
            r="6"
            fill="#ff6a00"
          />

          <rect
            x="18"
            y="49"
            width="7"
            height="8"
            rx="3"
            fill="#202020"
          />

          <rect
            x="24"
            y="30"
            width="10"
            height="12"
            rx="2"
            fill="#ffffff"
          />
        </svg>
      </div>

      <div className="leading-none">
        <h1 className="text-2xl font-black text-[#202020]">
          Lá da
        </h1>

        <h1 className="text-3xl font-black text-orange-600">
          Vendinha
        </h1>

        <p className="text-[11px] text-gray-600 mt-1">
          — Onde tudo tem —
        </p>
      </div>
    </Link>
  )
}