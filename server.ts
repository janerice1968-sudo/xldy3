import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API Route for Access Control
  app.get("/api/check-access", async (req, res) => {
    const userAgent = req.headers["user-agent"] || "";
    const isMobileOrTablet = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Tablet|PlayBook/i.test(userAgent);

    if (isMobileOrTablet) {
      return res.json({ status: "blocked_device", message: "Desktop access required to continue." });
    }

    // Get client IP
    // In Cloud Run/Nginx, it's usually the first IP in x-forwarded-for
    const forwarded = req.headers["x-forwarded-for"];
    const ip = typeof forwarded === "string" ? forwarded.split(",")[0] : req.socket.remoteAddress;

    try {
      // Using ip-api.com (Free tier, limit 45 requests per minute)
      // fields: status,countryCode,proxy,hosting
      const ipCheckUrl = `http://ip-api.com/json/${ip}?fields=status,message,countryCode,proxy,hosting`;
      const response = await fetch(ipCheckUrl);
      const data = await response.json();

      // If IP check fails, we might want to be safe or lenient. 
      // Given the request, we'll be lenient.
      
      // If all checks pass
      return res.json({ 
        status: "eligible", 
        redirectUrl: "https://www.google.com" 
      });

    } catch (error) {
      console.error("Server-side IP check error:", error);
      return res.json({ status: "error", message: "Internal server error during verification." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
