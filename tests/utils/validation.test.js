/**
 * Validation Tests
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  ValidationError,
  validateRequired,
  validateLength,
  validateEmail,
  validateRequiredFields,
} from '../../src/utils/validation.js';

describe('Validation Utilities', () => {
  describe('ValidationError', () => {
    it('should create a custom error with correct properties', () => {
      const error = new ValidationError('Test error', 'testField');

      assert.strictEqual(error.name, 'ValidationError');
      assert.strictEqual(error.message, 'Test error');
      assert.strictEqual(error.field, 'testField');
      assert.ok(error.code);
    });

    it('should be an instance of Error', () => {
      const error = new ValidationError('Test');
      assert.ok(error instanceof Error);
    });
  });

  describe('validateRequired', () => {
    it('should not throw for valid string values', () => {
      assert.doesNotThrow(() => validateRequired('test', 'field'));
      assert.doesNotThrow(() => validateRequired('a', 'field'));
    });

    it('should throw for null, undefined, or empty string', () => {
      assert.throws(() => validateRequired(null, 'field'), ValidationError);
      assert.throws(() => validateRequired(undefined, 'field'), ValidationError);
      assert.throws(() => validateRequired('', 'field'), ValidationError);
    });
  });

  describe('validateLength', () => {
    it('should not throw for strings within valid length', () => {
      assert.doesNotThrow(() => validateLength('test', 1, 10, 'field'));
      assert.doesNotThrow(() => validateLength('hello', 5, 5, 'field'));
    });

    it('should throw for strings outside valid length', () => {
      assert.throws(() => validateLength('a', 2, 10, 'field'), ValidationError);
      assert.throws(() => validateLength('very long string', 1, 5, 'field'), ValidationError);
    });

    it('should throw for non-string values', () => {
      assert.throws(() => validateLength(123, 1, 10, 'field'), ValidationError);
      assert.throws(() => validateLength(null, 1, 10, 'field'), ValidationError);
    });
  });

  describe('validateEmail', () => {
    it('should accept valid email addresses', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'first.last@subdomain.example.com',
        'user+tag@example.com',
      ];

      validEmails.forEach((email) => {
        assert.doesNotThrow(() => validateEmail(email));
      });
    });

    it('should reject invalid email addresses', () => {
      const invalidEmails = [
        'notanemail',
        '@example.com',
        'user@',
        'user name@example.com',
        'user@domain',
      ];

      invalidEmails.forEach((email) => {
        assert.throws(() => validateEmail(email), ValidationError);
      });
    });
  });

  describe('validateRequiredFields', () => {
    it('should not throw when all required fields are present', () => {
      const obj = {
        name: 'John',
        email: 'john@example.com',
        age: 30,
      };

      assert.doesNotThrow(() => validateRequiredFields(obj, ['name', 'email', 'age']));
    });

    it('should throw when required fields are missing', () => {
      const obj = {
        name: 'John',
      };

      assert.throws(() => validateRequiredFields(obj, ['name', 'email']), ValidationError);
    });

    it('should throw when required fields are null or undefined', () => {
      const obj = {
        name: 'John',
        email: null,
        age: undefined,
      };

      assert.throws(() => validateRequiredFields(obj, ['name', 'email']), ValidationError);
      assert.throws(() => validateRequiredFields(obj, ['name', 'age']), ValidationError);
    });

    it('should not throw for empty string values', () => {
      const obj = {
        name: '',
      };

      // Empty string is considered present (use validateRequired separately)
      assert.doesNotThrow(() => validateRequiredFields(obj, ['name']));
    });
  });
});
