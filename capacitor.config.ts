import type { CapacitorConfig } from "@capacitor/cli"

const config: CapacitorConfig = {
  appId: "com.ladavendinha.app",
  appName: "Lá da Vendinha",
  webDir: "capacitor-shell",
  server: {
    url: "https://ladavendinha-tcc.vercel.app",
    cleartext: false,
    // Pagina empacotada no APK mostrada quando o site nao carrega (sem internet).
    errorPath: "index.html",
    allowNavigation: ["ladavendinha-tcc.vercel.app"],
  },
  android: {
    allowMixedContent: false,
  },
}

export default config
