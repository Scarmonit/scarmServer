// filepath: tests/local-llm-client.test.js
import assert from 'assert';
import { LocalLLMClient } from '../src/clients/local-llm-client.js';
import { CONFIG } from '../src/config/constants.js';

// Smoke tests without requiring a running Ollama instance.
// We mock fetch when needed.

const originalFetch = global.fetch;

/** Mock fetch helper */
function mockFetchSequence(responses) {
  let call = 0;
  global.fetch = async () => {
    const r = responses[call++] || responses[responses.length - 1];
    return {
      ok: r.ok,
      status: r.status,
      body: r.body,
      json: async () => r.json,
      text: async () => JSON.stringify(r.json),
    };
  };
}

describe('LocalLLMClient', () => {
  afterEach(() => {
    global.fetch = originalFetch;
  });

  test('should initialize with defaults', () => {
    const client = new LocalLLMClient();
    assert.strictEqual(client.host, CONFIG.OLLAMA_HOST);
    assert.strictEqual(client.model, CONFIG.OLLAMA_MODEL);
  });

  test('complete returns response text', async () => {
    mockFetchSequence([
      {
        ok: true,
        status: 200,
        json: { response: 'Hello world' },
      },
    ]);
    const client = new LocalLLMClient();
    const out = await client.complete('Hi');
    assert.strictEqual(out, 'Hello world');
  });

  test('complete throws on error', async () => {
    mockFetchSequence([
      {
        ok: true,
        status: 200,
        json: { error: 'model failed' },
      },
    ]);
    const client = new LocalLLMClient();
    await assert.rejects(() => client.complete('Hi'), /model failed/);
  });

  test('stream yields tokens and ends', async () => {
    const encoder = new TextEncoder();
    const lines = [
      JSON.stringify({ response: 'Hel' }),
      JSON.stringify({ response: 'lo', done: false }),
      JSON.stringify({ response: '!', done: true }),
    ].join('\n');
    const body = {
      getReader() {
        let done = false;
        return {
          async read() {
            if (done) return { done: true };
            done = true;
            return { done: false, value: encoder.encode(lines) };
          },
        };
      },
    };
    mockFetchSequence([
      { ok: true, status: 200, body },
    ]);
    const client = new LocalLLMClient();
    const received = [];
    for await (const chunk of client.stream('Hello')) {
      received.push(chunk);
    }
    assert.deepStrictEqual(received, ['Hel', 'lo', '!']);
  });
});

