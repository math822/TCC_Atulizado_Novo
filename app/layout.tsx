import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "react-hot-toast"
import { Providers } from "./providers"
import SiteEffects from "../components/SiteEffects"
import Confirmar from "../components/Confirmar"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Lá da Vendinha",
  description: "Marketplace de negócios locais"
}

// Cor da barra de status no celular e no app Android (WebView).
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ea580c"
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body className={`${inter.variable} bg-white dark:bg-slate-950 text-gray-900 dark:text-gray-100 transition-colors duration-300 antialiased`}>
        <Providers>
          <SiteEffects />
          {children}

          <Confirmar />

          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: "#fff",
                color: "#111",
                borderRadius: "20px",
                padding: "16px",
                fontWeight: "700"
              },
              success: {
                iconTheme: {
                  primary: "#ea580c",
                  secondary: "#fff"
                }
              }
            }}
          />
        </Providers>
      </body>
    </html>
  )
}