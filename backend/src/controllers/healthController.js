import { getDBStatus } from '../config/db.js';
import { config } from '../config/env.js';

const startTime = Date.now();

export const healthController = {
  getHealth(req, res) {
    const dbStatus = getDBStatus();
    const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);

    return res.status(200).json({
      status: 'healthy',
      service: 'JobShield AI Backend Service',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      uptimeSeconds,
      database: dbStatus,
      aiProvider: config.aiApiKey ? config.aiProvider : 'rule-engine (deterministic fallback)',
      environment: config.nodeEnv
    });
  }
};
