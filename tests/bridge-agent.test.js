// filepath: tests/bridge-agent.test.js
import assert from 'assert';
import { WebSocket } from 'ws';
import { CONFIG } from '../src/config/constants.js';

// Spawn the bridge in-process
import '../src/agents/bridge.js';

process.env.BRIDGE_MOCK = 'true';

const BRIDGE_PORT = CONFIG.PORT + 1;
const URL = `ws://localhost:${BRIDGE_PORT}`;

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

describe('BridgeAgent', () => {
  test('responds to llm.generate with data', async () => {
    const ws = new WebSocket(URL);
    const responses = [];
    await new Promise((resolve) => ws.once('open', resolve));
    ws.on('message', (data) => { responses.push(JSON.parse(data.toString())); });
    ws.send(JSON.stringify({ id: '1', type: 'llm.generate', prompt: 'Ping' }));
    await delay(200); // allow async processing
    ws.close();
    const msg = responses.find(r => r.id === '1');
    assert.ok(msg);
    assert.ok(typeof msg.data === 'string');
    assert.ok(msg.data.startsWith('MOCK:'));
  });

  test('streams llm.stream tokens and done', async () => {
    const ws = new WebSocket(URL);
    const chunks = [];
    await new Promise((resolve) => ws.once('open', resolve));
    ws.on('message', (data) => { chunks.push(JSON.parse(data.toString())); });
    ws.send(JSON.stringify({ id: 's1', type: 'llm.stream', prompt: 'Stream' }));
    await delay(300);
    ws.close();
    const doneMsg = chunks.find(c => c.id === 's1' && c.done);
    const chunkTokens = chunks.filter(c => c.chunk).map(c => c.chunk).join('');
    assert.ok(doneMsg, 'Should have received done message');
    assert.ok(chunkTokens.startsWith('MOCK:')); // mock prefix
  });
});
