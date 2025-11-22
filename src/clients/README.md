# LLM Clients

This directory contains LLM API client implementations.

## Supported Providers

- OpenAI
- Anthropic
- Custom providers

## Usage

```javascript
import { LLMClient } from './llm-client.js';

const client = new LLMClient({
  provider: 'openai',
  apiKey: process.env.OPENAI_API_KEY,
});

// Completion
const response = await client.complete('Your prompt here');

// Streaming
for await (const chunk of client.stream('Your prompt here')) {
  // Process chunk
}
```

## Adding a New Provider

1. Extend the `LLMClient` base class
2. Implement `complete()` and `stream()` methods
3. Add provider-specific configuration
4. Include proper error handling and logging
