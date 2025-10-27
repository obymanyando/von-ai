import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import { registerRoutes } from "./routes";
import { mountDebugEnv } from "./debug-env";
import { setupVite, serveStatic, log } from "./vite";

// Configure WebSocket for Neon serverless in development
neonConfig.webSocketConstructor = ws;

const app = express();

// Trust proxy - required for secure cookies behind reverse proxy (like Replit deployment)
app.set("trust proxy", 1);

// Session configuration with PostgreSQL store
let sessionStore;
if (process.env.DATABASE_URL) {
  try {
    const PgSession = connectPgSimple(session);
    sessionStore = new PgSession({
      pool: new Pool({ connectionString: process.env.DATABASE_URL }),
      tableName: "session",
      createTableIfMissing: true,
      errorLog: (err) => console.error("Session store error:", err),
    });
    console.log("✅ PostgreSQL session store initialized");
  } catch (error) {
    console.error("❌ Failed to initialize PostgreSQL session store:", error);
    console.warn(
      "⚠️  Falling back to memory store (sessions will not persist)",
    );
  }
} else {
  console.warn(
    "⚠️  DATABASE_URL not set - using memory store (sessions will not persist in production)",
  );
}

app.use(
  session({
    store: sessionStore,
    secret: process.env.SESSION_SECRET || "dev-secret-change-in-production",
    resave: false,
    saveUninitialized: false,
    proxy: true, // Trust the reverse proxy
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Allow cross-site cookies in production
    },
  }),
);

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}
app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  try {
    console.log(
      `Starting server in ${process.env.NODE_ENV || "development"} mode`,
    );

    const server = await registerRoutes(app);
    mountDebugEnv(app);

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      console.error("Server error:", err);
      res.status(status).json({ message });
    });

    // importantly only setup vite in development and after
    // setting up all the other routes so the catch-all route
    // doesn't interfere with the other routes
    if (process.env.NODE_ENV === "development") {
      console.log("Setting up Vite dev server");
      await setupVite(app, server);
    } else {
      console.log("Serving static files from dist/public");
      serveStatic(app);
    }

    // ALWAYS serve the app on the port specified in the environment variable PORT
    // Other ports are firewalled. Default to 5000 if not specified.
    // this serves both the API and the client.
    // It is the only port that is not firewalled.
    const port = parseInt(process.env.PORT || "5000", 10);

    server.listen(
      {
        port,
        host: "0.0.0.0",
        reusePort: true,
      },
      () => {
        console.log(`✓ Server successfully started on port ${port}`);
        console.log(`✓ Environment: ${process.env.NODE_ENV || "development"}`);
        console.log(`✓ Listening on 0.0.0.0:${port}`);
        log(`serving on port ${port}`);
      },
    );

    server.on("error", (error: any) => {
      console.error("Server failed to start:", error);
      if (error.code === "EADDRINUSE") {
        console.error(`Port ${port} is already in use`);
      }
      process.exit(1);
    });
  } catch (error) {
    console.error("Fatal error during server initialization:", error);
    process.exit(1);
  }
})();
