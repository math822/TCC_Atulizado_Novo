import type { Metadata } from "next"
import "./globals.css"
import { Toaster } from "react-hot-toast"
import { Providers } from "./providers"

export const metadata: Metadata = {
  title: "Lá da Vendinha",
  description: "Marketplace de negócios locais"
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body className="bg-white dark:bg-slate-950 transition-colors duration-300">
        <Providers>
          {children}

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