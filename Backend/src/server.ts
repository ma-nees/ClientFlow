import { app } from "./app";
import { env } from "./config/env";

const PORT = env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running in ${env.NODE_ENV} mode on port ${PORT}`);
  console.log(`🌐 Accepting requests from ${env.FRONTEND_URL}`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully...");
  server.close(() => {
    console.log("Process terminated.");
    process.exit(0);
  });
});
