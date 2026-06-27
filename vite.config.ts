import { defineConfig, loadEnv, type Connect, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "@leadconnector/vibe-tagger";
import { fetchSquareCatalog, FALLBACK_PRODUCTS } from "./src/lib/squareCatalog";

/**
 * Serves the catalog at `/api/catalog` during `vite dev` and `vite preview` so the
 * browser talks to the same origin (no CORS) and the Square token stays server-side.
 * Production deployments should provide the equivalent via `api/catalog.ts`.
 */
function squareCatalogApi(token: string, apiBase: string): Plugin {
  const handler: Connect.SimpleHandleFunction = async (_req, res) => {
    res.setHeader("Content-Type", "application/json");
    try {
      if (!token) throw new Error("SQUARE_ACCESS_TOKEN is not set");
      const products = await fetchSquareCatalog(token, apiBase);
      res.end(JSON.stringify(products.length > 0 ? products : FALLBACK_PRODUCTS));
    } catch (error) {
      console.warn("[square] catalog fetch failed, serving fallback:", error);
      res.statusCode = 200;
      res.end(JSON.stringify(FALLBACK_PRODUCTS));
    }
  };

  return {
    name: "square-catalog-api",
    configureServer(server) {
      server.middlewares.use("/api/catalog", handler);
    },
    configurePreviewServer(server) {
      server.middlewares.use("/api/catalog", handler);
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    server: {
      host: "::",
      port: 8080,
      allowedHosts: [".modal.host"],
      hmr: {
        overlay: false,
      },
    },
    plugins: [
      react(),
      squareCatalogApi(env.SQUARE_ACCESS_TOKEN, env.SQUARE_API_BASE || "https://connect.squareupsandbox.com"),
      mode === "development" && componentTagger({ tailwindConfig: true }),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
