/**
 * Start All Agents Script
 * Starts all system components in the correct order
 */

import { spawn } from 'node:child_process';
import { info, error } from '../src/utils/logger.js';

const processes = [];

/**
 * Spawn a process
 * @param {string} name - Process name
 * @param {string} command - Command to execute
 * @param {string[]} args - Command arguments
 */
const spawnProcess = (name, command, args = []) => {
  info(`Starting ${name}...`);

  const proc = spawn(command, args, {
    stdio: 'inherit',
    shell: true,
  });

  proc.on('error', (err) => {
    error(`Failed to start ${name}`, err);
  });

  proc.on('exit', (code) => {
    if (code !== 0) {
      error(`${name} exited with code ${code}`);
    }
  });

  processes.push({ name, proc });

  return proc;
};

/**
 * Graceful shutdown
 */
const shutdown = () => {
  info('Shutting down all processes...');

  processes.forEach(({ name, proc }) => {
    info(`Stopping ${name}...`);
    proc.kill('SIGTERM');
  });

  setTimeout(() => {
    process.exit(0);
  }, 5000);
};

// Register shutdown handlers
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

// Start all components
info('Starting scarmServer system...');

// Start components
spawnProcess('AI Bridge', 'node', ['src/agents/bridge.js']);
spawnProcess('Main Server', 'node', ['src/index.js']);

info('All components started');
