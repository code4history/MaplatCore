#!/usr/bin/env node

/**
 * Script to merge compiled data back into original map files
 * This creates complete map files with compiled data included
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function mergeCompiledData() {
  const mapsDir = path.join(__dirname, '..', 'maps');
  const compiledDir = path.join(mapsDir, 'compiled');
  
  console.log('Merging compiled data into original map files...\n');
  
  // Get all .with-compiled.json files
  const withCompiledFiles = fs.readdirSync(mapsDir)
    .filter(file => file.endsWith('.with-compiled.json'))
    .map(file => ({
      withCompiledPath: path.join(mapsDir, file),
      originalName: file.replace('.with-compiled.json', '.json'),
      baseName: file.replace('.with-compiled.json', '')
    }));
  
  for (const fileInfo of withCompiledFiles) {
    console.log(`Processing: ${fileInfo.baseName}`);
    
    try {
      // Read the .with-compiled.json file
      const mapData = JSON.parse(fs.readFileSync(fileInfo.withCompiledPath, 'utf8'));
      
      // Read the original file to get all attributes
      const originalPath = path.join(mapsDir, fileInfo.originalName);
      const originalData = JSON.parse(fs.readFileSync(originalPath, 'utf8'));
      
      // Read the compiled data
      if (mapData.compiledPath) {
        const compiledPath = path.join(mapsDir, mapData.compiledPath);
        const compiledData = JSON.parse(fs.readFileSync(compiledPath, 'utf8'));
        
        // Create merged data with all original attributes except GCPs
        const mergedData = { ...originalData };
        delete mergedData.gcps;  // Remove GCPs as they're now in compiled
        delete mergedData.edges; // Remove edges if present
        mergedData.compiled = compiledData; // Add compiled data
        
        // Backup original file
        const backupPath = path.join(mapsDir, `${fileInfo.baseName}.original.json`);
        fs.copyFileSync(originalPath, backupPath);
        console.log(`  → Backed up original to: ${backupPath}`);
        
        // Write merged data to original filename
        fs.writeFileSync(originalPath, JSON.stringify(mergedData, null, 2));
        console.log(`  → Updated: ${originalPath}`);
        
        // Clean up temporary files
        fs.unlinkSync(fileInfo.withCompiledPath);
        console.log(`  → Removed temporary file: ${fileInfo.withCompiledPath}`);
      }
      
    } catch (error) {
      console.error(`  → Error: ${error.message}`);
    }
  }
  
  console.log('\nDone! Original map files now contain compiled data.');
  console.log('Original files have been backed up with .original.json extension.');
}

// Run the script
mergeCompiledData().catch(console.error);