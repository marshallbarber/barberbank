import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import type { Express } from "express";
import type { Server } from "http";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function log(message: string, source = "express") {
  console.log(`${new Date().toLocaleTimeString()} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  const vite = await (
    await import("vite")
  ).createServer({
    server: { middlewareMode: true },
    appType: "custom",
    clearScreen: false,
    optimizeDeps: {
      include: ["react", "react-dom"],
    },
  });

  app.use(vite.ssrFixStacktrace);
  app.use(vite.middlewares);

  app.use("*", async (req, res, next) => {
    if (req.originalUrl.startsWith("/api")) {
      return next();
    }

    try {
      const url = req.originalUrl;
      let template = fs.readFileSync(
        path.resolve(__dirname, "..", "client", "index.html"),
        "utf-8",
      );

      template = await vite.transformIndexHtml(url, template);
      const { render } = await vite.ssrLoadModule("/client/src/main.tsx");
      const appHtml = await render(url);
      const html = template.replace(`<!--app-html-->`, appHtml);
      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "..", "dist");
  
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first.`,
    );
  }

  app.use(express.static(distPath));
  app.get("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
