#!/usr/bin/env node

/**
 * Test camera analysis functionality in TypeScript implementation
 */

import axios from 'axios';

async function testCameraAnalysis() {
  console.log('🧪 Testing Camera Analysis (TypeScript implementation)...\n');

  const deviceId = 342;
  const ollamaUrl = 'http://localhost:11434';
  const model = 'llama3.2-vision';

  try {
    // Simulate camera device properties
    const ip = '192.168.0.10';
    const jpgPath = '/image/jpeg.cgi';
    const username = 'admin';
    const password = 'dallas';
    const protocol = 'http';

    // Construct camera URL
    const cameraUrl = `${protocol}://${username}:${password}@${ip}${jpgPath}`;

    console.log(`📸 Fetching snapshot from camera ${deviceId} at ${ip}...`);
    const snapshotResponse = await axios.get(cameraUrl, {
      responseType: 'arraybuffer',
      timeout: 10000,
    });

    // Encode image to base64
    const imageBase64 = Buffer.from(snapshotResponse.data).toString('base64');
    console.log(`✅ Snapshot captured (${snapshotResponse.data.length} bytes)`);

    console.log(`🤖 Analyzing with Ollama (${model})...`);

    // Send to Ollama
    const ollamaPayload = {
      model: model,
      prompt: 'Describe what you see in this image in detail. Include any people, objects, buildings, landscape features, time of day, and weather conditions.',
      images: [imageBase64],
      stream: false,
    };

    const ollamaResponse = await axios.post(`${ollamaUrl}/api/generate`, ollamaPayload, {
      timeout: 120000,
    });

    const analysis = ollamaResponse.data.response || 'No response from Ollama';

    console.log('\n' + '='.repeat(60));
    console.log(`Camera Analysis for Device ${deviceId} (Hagekamera):`);
    console.log('='.repeat(60));
    console.log(`Camera IP: ${ip}`);
    console.log(`Model: ${model}`);
    console.log('='.repeat(60));
    console.log('\n' + analysis + '\n');

  } catch (error) {
    if (error.code === 'ECONNREFUSED' && error.message.includes('11434')) {
      console.error(`❌ Error: Could not connect to Ollama at ${ollamaUrl}`);
      console.error(`   Make sure Ollama is running (ollama serve) and the model '${model}' is installed (ollama pull ${model})`);
    } else if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
      console.error(`❌ Error: Could not connect to camera. ${error.message}`);
    } else {
      console.error(`❌ Error analyzing camera snapshot: ${error.message}`);
    }
    process.exit(1);
  }
}

testCameraAnalysis();
