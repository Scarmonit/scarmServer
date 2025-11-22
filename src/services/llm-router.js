// filepath: src/services/llm-router.js
/**
 * LLMRouter - provides per-model LLMService instances (lazy init + reuse).
 */
import { LLMService } from './llm-service.js';
import { LocalLLMClient } from '../clients/local-llm-client.js';
import { CONFIG } from '../config/constants.js';
import { info } from '../utils/logger.js';

export class LLMRouter {
  constructor() {
    this.services = new Map();
  }

  getService(model) {
    const targetModel = model || CONFIG.OLLAMA_MODEL;
    if (!this.services.has(targetModel)) {
      info('LLMRouter creating service', { model: targetModel });
      const client = new LocalLLMClient({ model: targetModel });
      this.services.set(targetModel, new LLMService({ client }));
    }
    return this.services.get(targetModel);
  }
}

export default LLMRouter;
