import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { ThemeProvider } from "next-themes"
import { LanguageProvider } from "@/lib/language-context"
import { installLocalApi } from "@/api/local-api"
import App from "./App"
import "@/styles/globals.css"

// Route all /api/* fetches to the on-device Dexie database before anything renders.
installLocalApi()

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </ThemeProvider>
  </StrictMode>,
)
