/**
 * Logger Utility Tests
 */

import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { info, error } from '../../src/utils/logger.js';

describe('Logger Utility', () => {
  let originalConsole;

  before(() => {
    // Capture console methods
    originalConsole = {
      log: console.log,
      info: console.info,
      warn: console.warn,
      error: console.error,
      debug: console.debug,
    };
  });

  after(() => {
    // Restore console methods
    Object.assign(console, originalConsole);
  });

  it('should format info messages correctly', () => {
    let loggedMessage = '';
    console.info = (msg) => {
      loggedMessage = msg;
    };

    info('Test message');

    assert.ok(loggedMessage.includes('INFO'));
    assert.ok(loggedMessage.includes('Test message'));
  });

  it('should include metadata in log messages', () => {
    let loggedMessage = '';
    console.info = (msg) => {
      loggedMessage = msg;
    };

    info('Test with meta', { userId: 123 });

    assert.ok(loggedMessage.includes('userId'));
    assert.ok(loggedMessage.includes('123'));
  });

  it('should handle error objects', () => {
    let loggedMessage = '';
    console.error = (msg) => {
      loggedMessage = msg;
    };

    const testError = new Error('Test error');
    error('Error occurred', testError);

    assert.ok(loggedMessage.includes('ERROR'));
    assert.ok(loggedMessage.includes('Error occurred'));
    assert.ok(loggedMessage.includes('Test error'));
  });
});
