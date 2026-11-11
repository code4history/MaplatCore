#!/usr/bin/env node
/* global console, process */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');

// Get bump type from arguments
const bumpType = process.argv[2] || 'patch'; // major, minor, patch
if (!['major', 'minor', 'patch'].includes(bumpType)) {
  console.error('Invalid bump type. Use: major, minor, or patch');
  process.exit(1);
}

// Read package.json
const packageJsonPath = path.join(rootDir, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const currentVersion = packageJson.version;

// Calculate new version
// 版は prerelease（例 1.3.0-rc.1）を含めて読む。prerelease 付きから major/minor/patch を
// 上げるときは semver の慣習（prerelease は同じ版へ仕上げる。1.3.0-rc.1 への patch は 1.3.0）に合わせる。
const versionParts = /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$/.exec(currentVersion);
if (!versionParts) {
  console.error(`package.json の版の形が不正です: ${currentVersion}`);
  process.exit(1);
}
const major = Number(versionParts[1]);
const minor = Number(versionParts[2]);
const patch = Number(versionParts[3]);
const hasPrerelease = versionParts[4] !== undefined;
let newVersion;
switch (bumpType) {
  case 'major':
    // 1.0.0-5 は 1.0.0 へ、それ以外の prerelease は 2.0.0 へ
    newVersion = hasPrerelease && minor === 0 && patch === 0 ? `${major}.0.0` : `${major + 1}.0.0`;
    break;
  case 'minor':
    // 1.2.0-5 は 1.2.0 へ、それ以外の prerelease は 1.3.0 へ
    newVersion = hasPrerelease && patch === 0 ? `${major}.${minor}.0` : `${major}.${minor + 1}.0`;
    break;
  case 'patch':
    // prerelease は 1.2.0-5 → 1.2.0 と同じ版へ仕上げる
    newVersion = hasPrerelease ? `${major}.${minor}.${patch}` : `${major}.${minor}.${patch + 1}`;
    break;
}

console.log(`Bumping version from ${currentVersion} to ${newVersion}`);

// Update package.json
packageJson.version = newVersion;
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');

// Run sync-version to update other files
console.log('Syncing version across all files...');
execSync('node scripts/sync-version.js', { stdio: 'inherit', cwd: rootDir });

console.log(`Version bumped to ${newVersion}`);