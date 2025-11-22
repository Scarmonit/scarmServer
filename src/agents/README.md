# scarmServer Agents

This directory contains A2A (Agent-to-Agent) protocol implementations and agent definitions.

## Structure

- `bridge.js` - Main A2A protocol bridge for WebSocket-based communication
- Individual agent implementations go here

## Creating an Agent

Agents should follow the A2A protocol specification and implement:

- Lifecycle management (init, shutdown)
- Message handling
- State management
- Error handling with proper logging

## Example

```javascript
import { info, error } from '../utils/logger.js';

export class ExampleAgent {
  constructor(options = {}) {
    this.options = options;
  }

  async init() {
    try {
      info('Initializing ExampleAgent...');
      // Setup code here
    } catch (err) {
      error('Failed to initialize ExampleAgent', err);
      throw err;
    }
  }

  async handleMessage(message) {
    try {
      // Process message
      return { status: 'success' };
    } catch (err) {
      error('Message handling failed', err);
      throw err;
    }
  }

  async shutdown() {
    info('Shutting down ExampleAgent...');
    // Cleanup code here
  }
}
```
