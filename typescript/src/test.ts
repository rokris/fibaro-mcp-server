/**
 * Simple test script to verify TypeScript server works
 */

import { FibaroClient } from './fibaro-client.js';
import dotenv from 'dotenv';

dotenv.config();

async function testClient() {
  console.log('🧪 Testing Fibaro TypeScript Client...\n');

  const client = new FibaroClient(
    process.env.FIBARO_HOST || '',
    process.env.FIBARO_USERNAME || '',
    process.env.FIBARO_PASSWORD || '',
    process.env.FIBARO_USE_HTTPS === 'true'
  );

  try {
    // Test system info
    console.log('📊 Getting system info...');
    const info = await client.getSystemInfo();
    console.log(`✅ System: ${info.platform}`);
    console.log(`✅ Version: ${info.hcVersion}`);
    console.log(`✅ Serial: ${info.serialNumber}\n`);

    // Test devices
    console.log('📱 Getting devices...');
    const devices = await client.getDevices();
    console.log(`✅ Found ${devices.length} devices\n`);

    if (devices.length > 0) {
      console.log('First 3 devices:');
      devices.slice(0, 3).forEach((device) => {
        console.log(`  - ID: ${device.id}, Name: ${device.name}, Type: ${device.type}`);
      });
      console.log();
    }

    // Test rooms
    console.log('🏠 Getting rooms...');
    const rooms = await client.getRooms();
    console.log(`✅ Found ${rooms.length} rooms\n`);

    // Test scenes
    console.log('🎬 Getting scenes...');
    const scenes = await client.getScenes();
    console.log(`✅ Found ${scenes.length} scenes\n`);

    // Test getting a specific scene with LUA code
    if (scenes.length > 0) {
      const testSceneId = 99; // Tidstyrt utelys på
      console.log(`📋 Getting details for scene ${testSceneId}...`);
      const scene = await client.getScene(testSceneId);
      console.log(`✅ Scene: ${scene.name}`);
      console.log(`   Type: ${scene.type}`);
      console.log(`   Autostart: ${scene.autostart}`);
      console.log(`   Has LUA code: ${scene.lua ? 'Yes' : 'No'}\n`);
    }

    console.log('✅ All tests passed! TypeScript MCP server is working correctly.\n');
  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

testClient();
