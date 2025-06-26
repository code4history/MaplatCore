#!/usr/bin/env node

/**
 * Temporary script to generate compiled data from map JSON files using @maplat/tin
 * This script will be removed once all maps have compiled data
 */

const fs = require('fs');
const path = require('path');
const { Tin } = require('@maplat/tin/dist/tin.cjs');

async function generateCompiledForMap(mapPath) {
  console.log(`\nProcessing: ${mapPath}`);
  
  try {
    // Read map data
    const mapData = JSON.parse(fs.readFileSync(mapPath, 'utf8'));
    
    // Skip if already has compiled data
    if (mapData.compiled) {
      console.log('  → Already has compiled data, skipping');
      return;
    }
    
    // Check if it has GCPs
    if (!mapData.gcps || mapData.gcps.length < 3) {
      console.log('  → No GCPs or too few GCPs, skipping');
      return;
    }
    
    console.log(`  → Found ${mapData.gcps.length} GCPs`);
    
    // Create Tin instance
    const tin = new Tin({
      yaxisMode: mapData.yaxisMode || 'invert'
    });
    
    // Set parameters
    if (mapData.width && mapData.height) {
      tin.setWh([mapData.width, mapData.height]);
    } else if (mapData.bounds) {
      tin.setBounds(mapData.bounds);
    } else {
      console.log('  → No width/height or bounds found, skipping');
      return;
    }
    
    tin.setStrictMode(mapData.strictMode || 'auto');
    tin.setVertexMode(mapData.vertexMode || 'plain');
    tin.setPoints(mapData.gcps);
    
    if (mapData.edges) {
      tin.setEdges(mapData.edges);
    }
    
    // Generate compiled data
    console.log('  → Generating compiled data...');
    await tin.updateTin();
    const compiled = tin.getCompiled();
    
    // Save compiled data to separate file
    const compiledDir = path.join(__dirname, '..', 'maps', 'compiled');
    if (!fs.existsSync(compiledDir)) {
      fs.mkdirSync(compiledDir, { recursive: true });
    }
    
    const mapName = path.basename(mapPath, '.json');
    const compiledPath = path.join(compiledDir, `${mapName}.compiled.json`);
    fs.writeFileSync(compiledPath, JSON.stringify(compiled, null, 2));
    
    console.log(`  → Compiled data saved to: ${compiledPath}`);
    
    // Also create a new map file with compiled data reference
    const newMapData = { ...mapData };
    delete newMapData.gcps; // Remove GCPs as they're now in compiled
    delete newMapData.edges; // Remove edges as they're now in compiled
    newMapData.compiledPath = `./compiled/${mapName}.compiled.json`;
    
    const newMapPath = path.join(path.dirname(mapPath), `${mapName}.compiled.json`);
    fs.writeFileSync(newMapPath, JSON.stringify(newMapData, null, 2));
    
    console.log(`  → New map file saved to: ${newMapPath}`);
    
  } catch (error) {
    console.error(`  → Error: ${error.message}`);
  }
}

async function main() {
  const mapsDir = path.join(__dirname, '..', 'maps');
  
  console.log('Generating compiled data for maps in:', mapsDir);
  
  // Get all JSON files in maps directory
  const files = fs.readdirSync(mapsDir)
    .filter(file => file.endsWith('.json') && !file.includes('.compiled.'))
    .map(file => path.join(mapsDir, file));
  
  console.log(`Found ${files.length} map files`);
  
  // Process each map
  for (const file of files) {
    await generateCompiledForMap(file);
  }
  
  console.log('\nDone!');
  console.log('\nNote: The generated .compiled.json map files reference the compiled data.');
  console.log('You may need to update your code to load the compiled data properly.');
}

// Run the script
main().catch(console.error);