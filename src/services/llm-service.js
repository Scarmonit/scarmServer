// filepath: src/services/llm-service.js
/**
 * LLMService - high-level wrapper around LocalLLMClient (or other LLM clients).
 * Responsibilities:
 *  - Input validation & normalization
 *  - Response caching (simple in-memory LRU)
 *  - Structured logging & metrics hooks
 *  - Unified interface for agents / HTTP layer
 */
import { LocalLLMClient } from '../clients/local-llm-client.js';
import { info, error } from '../utils/logger.js';
import { CONFIG } from '../config/constants.js';

/** Simple LRU Cache */
class LRUCache {
  constructor(limit = 100) {
    this.limit = limit;
    this.map = new Map();
  }
  get(key) {
    if (!this.map.has(key)) return undefined;
    const val = this.map.get(key);
    // refresh order
    this.map.delete(key);
    this.map.set(key, val);
    return val;
  }
  set(key, val) {
    if (this.map.has(key)) this.map.delete(key);
    this.map.set(key, val);
    if (this.map.size > this.limit) {
      // delete oldest (first inserted)
      const first = this.map.keys().next().value;
      this.map.delete(first);
    }
  }
}

/**
 * @typedef {object} GenerateOptions
 * @property {number} [temperature]
 * @property {number} [maxTokens]
 * @property {boolean} [stream]
 * @property {object} [extra]
 */

export class LLMService {
  constructor(opts = {}) {
    this.client = opts.client || new LocalLLMClient();
    this.cache = opts.cache || new LRUCache(opts.cacheLimit || 50);
    this.maxPromptLength = opts.maxPromptLength || 8000;
  }

  /** Validate prompt */
  _validatePrompt(prompt) {
    if (typeof prompt !== 'string') {
      throw new Error('Prompt must be a string');
    }
    if (prompt.length === 0) {
      throw new Error('Prompt cannot be empty');
    }
    if (prompt.length > this.maxPromptLength) {
      throw new Error('Prompt too long');
    }
  }

  /** Build cache key */
  _cacheKey(prompt, options) {
    return JSON.stringify({ p: prompt, m: this.client.model, o: options });
  }

  /**
   * Generate completion (cached if stream=false)
   * @param {string} prompt
   * @param {GenerateOptions} options
   * @returns {Promise<string|AsyncGenerator<string>>}
   */
  async generate(prompt, options = {}) {
    this._validatePrompt(prompt);
    const opts = {
      temperature: options.temperature ?? CONFIG.MODEL_TEMPERATURE,
      maxTokens: options.maxTokens ?? CONFIG.MODEL_MAX_TOKENS,
      stream: options.stream === true,
      extra: options.extra || {},
    };

    if (!opts.stream) {
      const key = this._cacheKey(prompt, opts);
      const cached = this.cache.get(key);
      if (cached) {
        info('LLMService cache hit', { model: this.client.model });
        return cached;
      }
      try {
        const out = await this.client.complete(prompt, {
          temperature: opts.temperature,
          maxTokens: opts.maxTokens,
          extra: opts.extra,
        });
        this.cache.set(key, out);
        return out;
      } catch (err) {
        error('LLMService generate failed', err);
        throw err;
      }
    } else {
      // streaming path
      info('LLMService streaming generate', { model: this.client.model });
      return this.client.stream(prompt, {
        temperature: opts.temperature,
        maxTokens: opts.maxTokens,
        extra: opts.extra,
      });
    }
  }
}

export default LLMService;
