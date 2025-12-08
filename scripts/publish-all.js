#!/usr/bin/env node

import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');

// Get command line arguments
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');

console.log(`Starting ${isDryRun ? 'dry-run ' : ''}publish to npm...`);

try {
  if (isDryRun) {
    // Step 1: If this is a dry-run, do npm dry-run
    console.log('\n1. Running npm publish validation (dry-run)...');
    execSync('node scripts/publish-npm.js --dry-run', {
      stdio: 'inherit',
      cwd: rootDir
    });
    console.log('✓ npm validation passed');
    console.log('\n✓ Dry-run completed successfully!');
  } else {
    // Step 2: Publish to npm
    console.log('\n2. Publishing to npm...');
    execSync('node scripts/publish-npm.js', {
      stdio: 'inherit',
      cwd: rootDir
    });
    console.log('✓ Published to npm successfully');

    console.log('\n✓ Successfully published to npm!');
  }
} catch (error) {
  console.error('\n✗ Publish failed:', error.message);
  process.exit(1);
}