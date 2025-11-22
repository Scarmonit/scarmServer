/**
 * Validation Utilities
 * Input validation helpers
 */

import { ERROR_CODES } from '../config/constants.js';

/**
 * Custom validation error
 */
export class ValidationError extends Error {
  constructor(message, field = null) {
    super(message);
    this.name = 'ValidationError';
    this.code = ERROR_CODES.VALIDATION_ERROR;
    this.field = field;
  }
}

/**
 * Validate required string
 * @param {string} value - Value to validate
 * @param {string} fieldName - Field name for error messages
 * @throws {ValidationError} If validation fails
 */
export const validateRequired = (value, fieldName) => {
  if (value === null || value === undefined || value === '') {
    throw new ValidationError(`${fieldName} is required`, fieldName);
  }
};

/**
 * Validate string length
 * @param {string} value - Value to validate
 * @param {number} min - Minimum length
 * @param {number} max - Maximum length
 * @param {string} fieldName - Field name for error messages
 * @throws {ValidationError} If validation fails
 */
export const validateLength = (value, min, max, fieldName) => {
  if (typeof value !== 'string') {
    throw new ValidationError(`${fieldName} must be a string`, fieldName);
  }

  if (value.length < min || value.length > max) {
    throw new ValidationError(
      `${fieldName} must be between ${min} and ${max} characters`,
      fieldName,
    );
  }
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @param {string} fieldName - Field name for error messages
 * @throws {ValidationError} If validation fails
 */
export const validateEmail = (email, fieldName = 'email') => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    throw new ValidationError(`${fieldName} is not valid`, fieldName);
  }
};

/**
 * Validate object has required fields
 * @param {object} obj - Object to validate
 * @param {string[]} requiredFields - Required field names
 * @throws {ValidationError} If validation fails
 */
export const validateRequiredFields = (obj, requiredFields) => {
  for (const field of requiredFields) {
    if (!(field in obj) || obj[field] === null || obj[field] === undefined) {
      throw new ValidationError(`${field} is required`, field);
    }
  }
};

export default {
  ValidationError,
  validateRequired,
  validateLength,
  validateEmail,
  validateRequiredFields,
};
