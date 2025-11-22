/**
 * LLM Client Base (Placeholder)
 * Base class for LLM API clients
 */

import { info, error } from '../utils/logger.js';

/**
 * Base LLM Client
 */
export class LLMClient {
  /**
   * Create an LLM Client
   * @param {object} options - Client options
   */
  constructor(options = {}) {
    this.options = options;
    info('LLM Client initialized', { provider: options.provider });
  }

  /**
   * Send a completion request
   * @param {string} prompt - The prompt to send
   * @param {object} options - Request options
   * @returns {Promise<string>} The completion response
   */
  async complete(prompt, options = {}) {
    try {
      info('Sending completion request', {
        promptLength: prompt.length,
        ...options,
      });
      throw new Error('Not implemented - use a concrete client (e.g., LocalLLMClient)');
    } catch (err) {
      error('Completion request failed', err);
      throw err;
    }
  }

  /**
   * Send a streaming completion request
   * @param {string} prompt - The prompt to send
   * @param {object} options - Request options
   * @returns {AsyncGenerator<string>} The streaming response
   */
  async *stream(prompt, options = {}) {
    try {
      // TODO: Implement streaming API call
      info('Starting streaming completion', {
        promptLength: prompt.length,
        ...options,
      });

      // Placeholder yield to satisfy generator function requirements
      yield 'Streaming not yet implemented - use a concrete client (e.g., LocalLLMClient)';

      throw new Error('Not implemented');
    } catch (err) {
      error('Streaming request failed', err);
      throw err;
    }
  }
}

export default LLMClient;
