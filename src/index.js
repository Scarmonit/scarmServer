/**
 * Main Entry Point
 * scarmServer - LLM Framework Server
 */

import http from 'http';
import { CONFIG } from './config/constants.js';
import { info, error } from './utils/logger.js';

let server; // HTTP server instance

/**
 * Initialize the application
 */
const init = async () => {
  try {
    info('Starting scarmServer...', {
      env: CONFIG.NODE_ENV,
      port: CONFIG.PORT,
    });

    // Create a minimal HTTP server (health, root)
    server = http.createServer((req, res) => {
      try {
        if (req.url === '/health') {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ status: 'ok' }));
          return;
        }
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('scarmServer running');
      } catch (e) {
        error('Request handler error', e);
        try {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'internal_error' }));
        } catch (_err) {
          // best effort - error already logged
        }
      }
    });

    await new Promise((resolve, reject) => {
      server.once('error', reject);
      server.listen(CONFIG.PORT, CONFIG.HOST, () => resolve());
    });

    info('scarmServer started successfully', {
      host: CONFIG.HOST,
      port: CONFIG.PORT,
    });
  } catch (err) {
    error('Failed to start scarmServer', err);
    process.exit(1);
  }
};

/**
 * Graceful shutdown handler
 */
const shutdown = async () => {
  try {
    info('Shutting down scarmServer...');

    await new Promise((resolve) => {
      if (server && server.listening) {
        server.close(() => resolve());
      } else {
        resolve();
      }
    });

    info('scarmServer shutdown complete');
    process.exit(0);
  } catch (err) {
    error('Error during shutdown', err);
    process.exit(1);
  }
};

// Register shutdown handlers
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

// Handle unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  error('Unhandled Rejection', { reason, promise });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  error('Uncaught Exception', err);
  process.exit(1);
});

// Start the application
init();
