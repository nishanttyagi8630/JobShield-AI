import app from './app.js';
import { config } from './config/env.js';
import { connectDB } from './config/db.js';

async function startServer() {
  console.log('🚀 [JobShield AI] Starting backend server initialization...');
  
  // Attempt MongoDB Connection (falls back safely if no Atlas URI or offline)
  await connectDB();

  const server = app.listen(config.port, () => {
    console.log(`🛡️ [JobShield AI Server] Running on http://localhost:${config.port}`);
    console.log(`📡 [Health Endpoint] http://localhost:${config.port}/api/health`);
    console.log(`🔒 [Environment] ${config.nodeEnv}`);
    console.log(`🤖 [AI Provider Mode] ${config.aiApiKey ? config.aiProvider : 'Deterministic Rule Engine Fallback'}`);
  });

  const shutdown = (signal) => {
    console.log(`\n🛑 [JobShield AI Server] Received ${signal}. Shutting down gracefully...`);
    server.close(() => {
      console.log('🏁 [JobShield AI Server] HTTP server closed.');
      process.exit(0);
    });
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

startServer().catch((err) => {
  console.error('❌ [Fatal Startup Error]:', err);
  process.exit(1);
});
