// filepath: tests/llm-service.test.js
import assert from 'assert';
import { LLMService } from '../src/services/llm-service.js';
import { LocalLLMClient } from '../src/clients/local-llm-client.js';

// Mock client to avoid networking
class MockClient extends LocalLLMClient {
  constructor() {
    super({ host: 'http://localhost:9999', model: 'mock' });
    this.calls = 0;
  }
  async complete(prompt) {
    this.calls += 1;
    return `OUT:${prompt}`;
  }
  async *stream(prompt) {
    yield 'A';
    yield 'B';
    yield 'C';
  }
}

describe('LLMService', () => {
  test('caches non-stream results', async () => {
    const client = new MockClient();
    const service = new LLMService({ client, cacheLimit: 10 });
    const first = await service.generate('Hello');
    const second = await service.generate('Hello');
    assert.strictEqual(first, 'OUT:Hello');
    assert.strictEqual(second, 'OUT:Hello');
    assert.strictEqual(client.calls, 1); // cache hit
  });

  test('stream does not use cache', async () => {
    const client = new MockClient();
    const service = new LLMService({ client });
    const gen = await service.generate('Hello', { stream: true });
    const collected = [];
    for await (const chunk of gen) collected.push(chunk);
    assert.deepStrictEqual(collected, ['A', 'B', 'C']);
    assert.strictEqual(client.calls, 0); // streaming path
  });

  test('validation rejects empty prompt', async () => {
    const service = new LLMService({ client: new MockClient() });
    await assert.rejects(() => service.generate(''), /Prompt cannot be empty/);
  });
});

