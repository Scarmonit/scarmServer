/**
 * Constants Tests
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { CONFIG, HTTP_STATUS, ERROR_CODES, PATHS } from '../../src/config/constants.js';

describe('Constants Module', () => {
  describe('CONFIG', () => {
    it('should have default values when env vars are not set', () => {
      assert.ok(CONFIG.NODE_ENV);
      assert.ok(CONFIG.PORT);
      assert.ok(CONFIG.HOST);
      assert.ok(CONFIG.LOG_LEVEL);
    });

    it('should have numeric values for ports and timeouts', () => {
      assert.strictEqual(typeof CONFIG.PORT, 'number');
      assert.strictEqual(typeof CONFIG.SESSION_TIMEOUT, 'number');
      assert.strictEqual(typeof CONFIG.CACHE_TTL, 'number');
      assert.strictEqual(typeof CONFIG.POOL_SIZE, 'number');
    });

    it('should have valid port number', () => {
      assert.ok(CONFIG.PORT > 0 && CONFIG.PORT < 65536);
    });
  });

  describe('HTTP_STATUS', () => {
    it('should have standard HTTP status codes', () => {
      assert.strictEqual(HTTP_STATUS.OK, 200);
      assert.strictEqual(HTTP_STATUS.CREATED, 201);
      assert.strictEqual(HTTP_STATUS.BAD_REQUEST, 400);
      assert.strictEqual(HTTP_STATUS.NOT_FOUND, 404);
      assert.strictEqual(HTTP_STATUS.INTERNAL_SERVER_ERROR, 500);
    });

    it('should have all common status codes defined', () => {
      const requiredCodes = [
        'OK',
        'CREATED',
        'BAD_REQUEST',
        'UNAUTHORIZED',
        'NOT_FOUND',
        'INTERNAL_SERVER_ERROR',
      ];

      requiredCodes.forEach((code) => {
        assert.ok(code in HTTP_STATUS, `Missing status code: ${code}`);
      });
    });
  });

  describe('ERROR_CODES', () => {
    it('should have standard error codes', () => {
      assert.ok(ERROR_CODES.VALIDATION_ERROR);
      assert.ok(ERROR_CODES.NOT_FOUND);
      assert.ok(ERROR_CODES.UNAUTHORIZED);
      assert.ok(ERROR_CODES.INTERNAL_ERROR);
    });

    it('should use UPPER_SNAKE_CASE format', () => {
      Object.keys(ERROR_CODES).forEach((key) => {
        assert.match(key, /^[A-Z_]+$/);
      });
    });
  });

  describe('PATHS', () => {
    it('should have all required paths defined', () => {
      assert.ok(PATHS.LOGS);
      assert.ok(PATHS.DATA);
      assert.ok(PATHS.CACHE);
    });

    it('should use relative paths', () => {
      Object.values(PATHS).forEach((path) => {
        assert.ok(path.startsWith('./'));
      });
    });
  });
});
