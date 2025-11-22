/**
 * Logger Utility
 * Use this instead of console.log for all logging operations
 */

import { CONFIG } from '../config/constants.js';

const LOG_LEVELS = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const currentLevel = LOG_LEVELS[CONFIG.LOG_LEVEL] || LOG_LEVELS.info;

/**
 * Format log message with timestamp and level
 * @param {string} level - Log level
 * @param {string} message - Log message
 * @param {object} meta - Additional metadata
 * @returns {string} Formatted log message
 */
const formatMessage = (level, message, meta = {}) => {
  const timestamp = new Date().toISOString();
  const metaStr = Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : '';
  return `[${timestamp}] [${level.toUpperCase()}] ${message}${metaStr}`;
};

/**
 * Log a debug message
 * @param {string} message - Message to log
 * @param {object} meta - Additional metadata
 */
export const debug = (message, meta = {}) => {
  if (currentLevel <= LOG_LEVELS.debug) {
    console.debug(formatMessage('debug', message, meta));
  }
};

/**
 * Log an info message
 * @param {string} message - Message to log
 * @param {object} meta - Additional metadata
 */
export const info = (message, meta = {}) => {
  if (currentLevel <= LOG_LEVELS.info) {
    console.info(formatMessage('info', message, meta));
  }
};

/**
 * Log a warning message
 * @param {string} message - Message to log
 * @param {object} meta - Additional metadata
 */
export const warn = (message, meta = {}) => {
  if (currentLevel <= LOG_LEVELS.warn) {
    console.warn(formatMessage('warn', message, meta));
  }
};

/**
 * Log an error message
 * @param {string} message - Message to log
 * @param {Error|object} error - Error object or metadata
 */
export const error = (message, error = {}) => {
  if (currentLevel <= LOG_LEVELS.error) {
    const meta = error instanceof Error
      ? { error: error.message, stack: error.stack }
      : error;
    console.error(formatMessage('error', message, meta));
  }
};

export default {
  debug,
  info,
  warn,
  error,
};

