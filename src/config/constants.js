/**
 * Application Constants
 * Centralized configuration values - never hardcode these in source files
 */

import dotenv from 'dotenv';

dotenv.config();

export const CONFIG = {
  // Server Configuration
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT, 10) || 3000,
  HOST: process.env.HOST || 'localhost',

  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',

  // Session Management
  SESSION_TIMEOUT: parseInt(process.env.SESSION_TIMEOUT, 10) || 3600000,

  // Performance
  CACHE_TTL: parseInt(process.env.CACHE_TTL, 10) || 300000,
  POOL_SIZE: parseInt(process.env.POOL_SIZE, 10) || 10,
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  TIMEOUT: 'TIMEOUT',
};

export const PATHS = {
  LOGS: './logs',
  DATA: './data',
  CACHE: './cache',
};
