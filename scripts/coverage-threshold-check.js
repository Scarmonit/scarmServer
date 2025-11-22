#!/usr/bin/env node
/**
 * Coverage Threshold Check Script
 * Reads the c8 JSON summary and enforces minimum thresholds.
 */
import { readFile } from 'fs/promises';

const THRESHOLDS = {
  lines: 80,
  statements: 80,
  functions: 70,
  branches: 60,
};

const fail = (msg) => {
  console.error(`\n[coverage-threshold] FAIL: ${msg}`);
  process.exit(1);
};

async function main() {
  try {
    const summaryPath = './coverage/coverage-summary.json';
    const jsonRaw = await readFile(summaryPath, 'utf-8');
    const data = JSON.parse(jsonRaw);
    const totals = data.total;

    const results = {
      lines: totals.lines.pct,
      statements: totals.statements.pct,
      functions: totals.functions.pct,
      branches: totals.branches.pct,
    };

    let failed = false;
    for (const [metric, pct] of Object.entries(results)) {
      const min = THRESHOLDS[metric];
      if (pct < min) {
        console.error(`Metric ${metric} below threshold: ${pct}% < ${min}%`);
        failed = true;
      } else {
        console.log(`Metric ${metric} OK: ${pct}% >= ${min}%`);
      }
    }

    if (failed) {
      fail('Coverage thresholds not met.');
    } else {
      console.log('\n[coverage-threshold] All coverage thresholds satisfied.');
    }
  } catch (err) {
    fail(`Could not read coverage summary: ${err.message}`);
  }
}

main();
