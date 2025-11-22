/**
 * A2A Bridge Agent (Placeholder)
 * WebSocket-based agent communication bridge
 */

import { CONFIG } from '../config/constants.js';
import { info, error } from '../utils/logger.js';
import { WebSocketServer } from 'ws';
import { LLMRouter } from '../services/llm-router.js';

let wss; // keep reference for teardown
const router = new LLMRouter();

/**
 * Initialize the A2A Bridge
 */
export const startBridge = async () => {
  try {
    info('Starting A2A Bridge Agent...', { port: CONFIG.PORT + 1 });
    const PROTOCOL = {
      // request: { id, type: 'llm.generate', prompt, options }
      async handle(socket, msg) {
        const { id, type, prompt, options, model } = msg;
        if (!type || !id) {
          socket.send(JSON.stringify({ id: id || null, error: 'invalid_message' }));
          return;
        }
        const mockMode = CONFIG.BRIDGE_MOCK === 'true';
        const service = router.getService(model);
        try {
          switch (type) {
            case 'llm.generate': {
              const out = mockMode ? `MOCK:${model || service.client.model}:${prompt}` : await service.generate(prompt, options || {});
              socket.send(JSON.stringify({ id, data: out, model: model || service.client.model }));
              break;
            }
            case 'llm.stream': {
              if (mockMode) {
                const tokens = ['MO', 'CK', ':', (model || service.client.model), ':', prompt.slice(0, 5)];
                for (const t of tokens) socket.send(JSON.stringify({ id, chunk: t, model: model || service.client.model }));
                socket.send(JSON.stringify({ id, done: true, model: model || service.client.model }));
              } else {
                const stream = await service.generate(prompt, { ...(options || {}), stream: true });
                for await (const token of stream) {
                  socket.send(JSON.stringify({ id, chunk: token, model: model || service.client.model }));
                }
                socket.send(JSON.stringify({ id, done: true, model: model || service.client.model }));
              }
              break;
            }
            default:
              socket.send(JSON.stringify({ id, error: 'unknown_type' }));
          }
        } catch (err) {
          socket.send(JSON.stringify({ id, error: err.message || 'error' }));
        }
      },
    };

    const port = CONFIG.PORT + 1;
    wss = new WebSocketServer({ port });
    wss.on('connection', (ws) => {
      info('Bridge client connected');
      ws.on('message', async (raw) => {
        let msg;
        try { msg = JSON.parse(raw.toString()); } catch { ws.send(JSON.stringify({ id: null, error: 'invalid_json' })); return; }
        PROTOCOL.handle(ws, msg);
      });
      ws.on('close', () => info('Bridge client disconnected'));
      ws.on('error', (e) => error('Bridge socket error', e));
    });

    info('A2A Bridge Agent started successfully', { port });
  } catch (err) {
    error('Failed to start A2A Bridge Agent', err);
    throw err;
  }
};

export const stopBridge = async () => {
  if (wss) {
    await new Promise((resolve) => wss.close(() => resolve()));
    info('A2A Bridge Agent stopped');
    wss = null;
  }
};

// Auto-start if executed directly (not imported by tests)
if (process.argv[1] && process.argv[1].endsWith('bridge.js')) {
  startBridge();
}
