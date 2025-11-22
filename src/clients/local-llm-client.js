// filepath: src/clients/local-llm-client.js
/**
 * LocalLLMClient - integrates with a local Ollama server (or similar) to avoid external API limits.
 * Uses streaming and non-streaming endpoints.
 */
import { CONFIG } from '../config/constants.js';
import { info, error, warn } from '../utils/logger.js';
import LLMClient from './llm-client.js';

/**
 * @typedef {object} CompletionOptions
 * @property {number} [maxTokens]
 * @property {number} [temperature]
 * @property {object} [extra] - provider specific options
 */

export class LocalLLMClient extends LLMClient {
  constructor(options = {}) {
    super({ provider: 'local', ...options });
    this.host = options.host || CONFIG.OLLAMA_HOST;
    this.model = options.model || CONFIG.OLLAMA_MODEL;
    this.maxTokens = options.maxTokens || CONFIG.MODEL_MAX_TOKENS;
    this.temperature = options.temperature || CONFIG.MODEL_TEMPERATURE;
  }

  /**
   * Basic HTTP POST wrapper
   * @param {string} path
   * @param {object} body
   * @returns {Promise<any>}
   */
  async _post(path, body) {
    const url = `${this.host}${path}`;
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Local LLM request failed (${res.status}): ${text}`);
      }
      return res.json();
    } catch (err) {
      error('Local LLM POST failed', { url, err: err.message });
      throw err;
    }
  }

  /**
   * Run a completion against the local model
   * @param {string} prompt
   * @param {CompletionOptions} options
   * @returns {Promise<string>}
   */
  async complete(prompt, options = {}) {
    try {
      const payload = {
        model: this.model,
        prompt,
        stream: false,
        options: {
          temperature: options.temperature ?? this.temperature,
          num_predict: options.maxTokens ?? this.maxTokens,
          ...options.extra,
        },
      };
      info('Local LLM completion request', { model: this.model, promptLength: prompt.length });
      const json = await this._post('/api/generate', payload);
      if (json.error) throw new Error(json.error);
      return json.response ?? json.output ?? '';
    } catch (err) {
      error('Local LLM completion failed', err);
      throw err;
    }
  }

  /**
   * Stream tokens from the local model
   * @param {string} prompt
   * @param {CompletionOptions} options
   * @returns {AsyncGenerator<string>}
   */
  async *stream(prompt, options = {}) {
    const url = `${this.host}/api/generate`;
    const controller = new AbortController();
    const payload = {
      model: this.model,
      prompt,
      stream: true,
      options: {
        temperature: options.temperature ?? this.temperature,
        num_predict: options.maxTokens ?? this.maxTokens,
        ...options.extra,
      },
    };
    info('Local LLM streaming request', { model: this.model, promptLength: prompt.length });
    let res;
    try {
      res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      if (!res.ok || !res.body) {
        const text = await res.text();
        throw new Error(`Local LLM stream failed (${res.status}): ${text}`);
      }
    } catch (err) {
      error('Local LLM streaming connect failed', err);
      throw err;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder('utf-8');
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        // Ollama style: each line is a JSON object
        const lines = chunk.split('\n').filter(Boolean);
        for (const line of lines) {
          try {
            const obj = JSON.parse(line);
            if (obj.error) {
              throw new Error(obj.error);
            }
            if (obj.response) {
              yield obj.response;
            }
            if (obj.done) {
              return;
            }
          } catch (e) {
            warn('Local LLM malformed stream line', { line });
          }
        }
      }
    } catch (err) {
      error('Local LLM streaming read failed', err);
      throw err;
    } finally {
      controller.abort();
    }
  }
}

export default LocalLLMClient;

