#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');

// Read package.json
const packageJsonPath = path.join(rootDir, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const version = packageJson.version;

console.log(`Syncing version ${version} across all files...`);

// Files to update
const filesToUpdate = [
  {
    path: path.join(rootDir, 'deno.json'),
    type: 'json',
    field: 'version'
  },
  {
    path: path.join(rootDir, 'jsr.json'),
    type: 'json',
    field: 'version'
  },
  {
    path: path.join(rootDir, 'README.md'),
    type: 'markdown',
    patterns: [
      { regex: /npm install @maplat\/core@[\d.]+/g, replacement: `npm install @maplat/core@${version}` },
      { regex: /deno add @maplat\/core@[\d.]+/g, replacement: `deno add @maplat/core@${version}` },
      { regex: /npx jsr add @maplat\/core@[\d.]+/g, replacement: `npx jsr add @maplat/core@${version}` },
      { regex: /jsr:@maplat\/core@[\d.]+/g, replacement: `jsr:@maplat/core@${version}` },
      { regex: /npm:@maplat\/core@[\d.]+/g, replacement: `npm:@maplat/core@${version}` }
    ]
  },
  {
    path: path.join(rootDir, 'README.ja.md'),
    type: 'markdown',
    patterns: [
      { regex: /npm install @maplat\/core@[\d.]+/g, replacement: `npm install @maplat/core@${version}` },
      { regex: /deno add @maplat\/core@[\d.]+/g, replacement: `deno add @maplat/core@${version}` },
      { regex: /npx jsr add @maplat\/core@[\d.]+/g, replacement: `npx jsr add @maplat/core@${version}` },
      { regex: /jsr:@maplat\/core@[\d.]+/g, replacement: `jsr:@maplat/core@${version}` },
      { regex: /npm:@maplat\/core@[\d.]+/g, replacement: `npm:@maplat/core@${version}` }
    ]
  }
];

// Update files
filesToUpdate.forEach(({ path: filePath, type, field, patterns }) => {
  if (!fs.existsSync(filePath)) {
    console.warn(`File not found: ${filePath}`);
    return;
  }

  if (type === 'json') {
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    content[field] = version;
    fs.writeFileSync(filePath, JSON.stringify(content, null, 2) + '\n');
    console.log(`Updated ${filePath}`);
  } else if (type === 'markdown') {
    let content = fs.readFileSync(filePath, 'utf8');
    patterns.forEach(({ regex, replacement }) => {
      content = content.replace(regex, replacement);
    });
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${filePath}`);
  }
});

console.log('Version sync completed!');