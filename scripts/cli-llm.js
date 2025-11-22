#!/usr/bin/env node
// filepath: scripts/cli-llm.js
/**
 * CLI client for interacting with the WebSocket bridge.
 * Usage:
 *   node scripts/cli-llm.js generate "Your prompt" [--model modelName]
 *   node scripts/cli-llm.js stream "Your prompt" [--model modelName]
 */
import { WebSocket } from 'ws';
import { CONFIG } from '../src/config/constants.js';

const [, , command, ...rest] = process.argv;
if (!command || !['generate', 'stream'].includes(command)) {
  console.error('Usage: cli-llm.js <generate|stream> "prompt" [--model name]');
  process.exit(1);
}

let prompt = '';
let model;
for (let i = 0; i < rest.length; i++) {
  const arg = rest[i];
  if (arg === '--model') {
    model = rest[++i];
  } else if (!prompt) {
    prompt = arg;
  }
}

if (!prompt) {
  console.error('Prompt required.');
  process.exit(1);
}

const port = CONFIG.PORT + 1;
const url = `ws://localhost:${port}`;
const ws = new WebSocket(url);

ws.on('open', () => {
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  if (command === 'generate') {
    ws.send(JSON.stringify({ id, type: 'llm.generate', prompt, model }));
  } else {
    ws.send(JSON.stringify({ id, type: 'llm.stream', prompt, model }));
  }
});

ws.on('message', (raw) => {
  const msg = JSON.parse(raw.toString());
  if (msg.error) {
    console.error('Error:', msg.error);
    ws.close();
    process.exit(1);
  }
  if (msg.data) {
    console.log(msg.data);
    ws.close();
  } else if (msg.chunk) {
    process.stdout.write(msg.chunk);
  } else if (msg.done) {
    process.stdout.write('\n');
    ws.close();
  }
});

ws.on('close', () => {
  process.exit(0);
});

ws.on('error', (e) => {
  console.error('WebSocket error:', e.message);
  process.exit(1);
});

