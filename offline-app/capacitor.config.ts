import type { CapacitorConfig } from "@capacitor/cli"

// Fully OFFLINE config: the WebView loads the bundled `dist/` build locally.
// There is intentionally NO `server` block — the app needs no network at all.
const config: CapacitorConfig = {
  appId: "org.skppmm.community",
  appName: "SKPPMM",
  webDir: "dist",
  android: {
    backgroundColor: "#0B0F1A",
  },
}

export default config
