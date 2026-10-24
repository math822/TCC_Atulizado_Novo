import type { CapacitorConfig } from "@capacitor/cli"

const config: CapacitorConfig = {
  appId: "com.ladavendinha.app",
  appName: "Lá da Vendinha",
  webDir: "capacitor-shell",
  server: {
    url: "https://ladavendinha-tcc.vercel.app",
    cleartext: false,
    allowNavigation: ["ladavendinha-tcc.vercel.app"],
  },
  android: {
    allowMixedContent: false,
  },
}

export default config
