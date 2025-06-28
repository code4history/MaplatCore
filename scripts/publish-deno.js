#!/usr/bin/env node

import { execSync } from 'node:child_process';

try {
  // Get command line arguments
  const args = process.argv.slice(2);
  const isDryRun = args.includes('--dry-run');
  
  // Run deno publish with all passed arguments
  const extraArgs = isDryRun ? '--allow-dirty' : '';
  const publishCommand = `deno publish --no-check --allow-slow-types ${extraArgs} ${args.join(' ')}`;
  console.log(`Running: ${publishCommand}`);
  
  execSync(publishCommand, { stdio: 'inherit' });
  
  console.log(isDryRun ? 'Dry run completed successfully!' : 'Published successfully!');
} catch (error) {
  console.error('Publish failed:', error.message);
  process.exitCode = 1;
}