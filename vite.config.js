import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";

// Dev-only helper used while comparing the clone with the source site.
// POST the source document here to capture a local rendering copy.
function sourceMirrorCapture() {
  return {
    name: "source-mirror-capture",
    configureServer(server) {
      server.middlewares.use("/__capture", (req, res) => {
        if (req.method !== "POST") {
          res.statusCode = 405;
          res.end("POST only");
          return;
        }

        let body = "";
        req.on("data", (chunk) => {
          body += chunk;
        });
        req.on("end", () => {
          if (!body) {
            res.statusCode = 400;
            res.end("empty body");
            return;
          }
          fs.writeFileSync(
            path.resolve(server.config.root, "public/source-mirror.html"),
            body,
            "utf8"
          );
          res.statusCode = 204;
          res.end();
        });
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), sourceMirrorCapture()],
});
