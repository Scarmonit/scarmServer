/**
 * A2A Bridge Agent (Placeholder)
 * WebSocket-based agent communication bridge
 */

import { CONFIG } from '../config/constants.js';
import { info, error } from '../utils/logger.js';
import { WebSocketServer } from 'ws';
import { LLMService } from '../services/llm-service.js';

const service = new LLMService();

/**
 * Initialize the A2A Bridge
 */
const initBridge = async () => {
  try {
    info('Starting A2A Bridge Agent...', {
      port: CONFIG.PORT + 1,
    });

    const PROTOCOL = {
      // request: { id, type: 'llm.generate', prompt, options }
      async handle(socket, msg) {
        const { id, type, prompt, options } = msg;
        if (!type || !id) {
          socket.send(JSON.stringify({ id: id || null, error: 'invalid_message' }));
          return;
        }
        try {
          const mockMode = CONFIG.BRIDGE_MOCK === 'true';
          switch (type) {
            case 'llm.generate': {
              const out = mockMode ? `MOCK:${prompt}` : await service.generate(prompt, options || {});
              socket.send(JSON.stringify({ id, data: out }));
              break;
            }
            case 'llm.stream': {
              if (mockMode) {
                const tokens = ['MO', 'CK', ':', prompt.slice(0, 5)];
                for (const t of tokens) socket.send(JSON.stringify({ id, chunk: t }));
                socket.send(JSON.stringify({ id, done: true }));
              } else {
                const stream = await service.generate(prompt, { ...(options || {}), stream: true });
                for await (const token of stream) {
                  socket.send(JSON.stringify({ id, chunk: token }));
                }
                socket.send(JSON.stringify({ id, done: true }));
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
    const wss = new WebSocketServer({ port });
    wss.on('connection', (ws) => {
      info('Bridge client connected');
      ws.on('message', async (raw) => {
        let msg;
        try {
          msg = JSON.parse(raw.toString());
        } catch (e) {
          ws.send(JSON.stringify({ id: null, error: 'invalid_json' }));
          return;
        }
        PROTOCOL.handle(ws, msg);
      });
      ws.on('close', () => info('Bridge client disconnected'));
      ws.on('error', (e) => error('Bridge socket error', e));
    });

    info('A2A Bridge Agent started successfully', { port });
  } catch (err) {
    error('Failed to start A2A Bridge Agent', err);
    process.exit(1);
  }
};

// Start the bridge
initBridge();
