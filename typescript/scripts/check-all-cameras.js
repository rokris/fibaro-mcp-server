#!/usr/bin/env node

/**
 * Check all cameras for unusual activity using MCP server
 */

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverPath = path.resolve(__dirname, '../dist/index.js');

// MCP client implementation
class MCPClient {
  constructor() {
    this.messageId = 1;
    this.responses = new Map();
  }

  async start() {
    return new Promise((resolve, reject) => {
      this.process = spawn('node', [serverPath], {
        stdio: ['pipe', 'pipe', 'inherit'],
        env: process.env
      });

      let buffer = '';
      
      this.process.stdout.on('data', (data) => {
        buffer += data.toString();
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';
        
        lines.forEach(line => {
          if (line.trim()) {
            try {
              const message = JSON.parse(line);
              if (message.id && this.responses.has(message.id)) {
                this.responses.get(message.id)(message);
              }
            } catch (err) {
              // Ignore parse errors
            }
          }
        });
      });

      this.process.on('error', reject);
      
      // Initialize
      this.sendRequest('initialize', {
        protocolVersion: '2024-11-05',
        capabilities: {},
        clientInfo: { name: 'camera-checker', version: '1.0.0' }
      }).then(() => {
        resolve();
      });
    });
  }

  sendRequest(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.messageId++;
      const request = {
        jsonrpc: '2.0',
        id,
        method,
        params
      };

      this.responses.set(id, (response) => {
        this.responses.delete(id);
        if (response.error) {
          reject(new Error(response.error.message));
        } else {
          resolve(response.result);
        }
      });

      this.process.stdin.write(JSON.stringify(request) + '\n');
      
      // Timeout after 300 seconds (5 minutes for multiple camera analysis)
      setTimeout(() => {
        if (this.responses.has(id)) {
          this.responses.delete(id);
          reject(new Error('Request timeout'));
        }
      }, 300000);
    });
  }

  async callTool(name, args) {
    return this.sendRequest('tools/call', { name, arguments: args });
  }

  close() {
    if (this.process) {
      this.process.kill();
    }
  }
}

async function main() {
  console.log('🎥 Checking all cameras for unusual activity...\n');
  
  const client = new MCPClient();
  
  try {
    await client.start();
    console.log('✅ Connected to MCP server\n');
    
    // Get home status which includes all camera analyses
    console.log('📊 Fetching home status with camera analyses...\n');
    const result = await client.callTool('get_home_status', {});
    
    if (result.content && result.content[0]) {
      const responseText = result.content[0].text;
      let content;
      
      try {
        content = JSON.parse(responseText);
      } catch (e) {
        // Response is plain text, not JSON
        console.log('='.repeat(70));
        console.log('HOME STATUS REPORT');
        console.log('='.repeat(70));
        console.log(responseText);
        console.log('='.repeat(70));
        return;
      }
      
      console.log('='.repeat(70));
      console.log('HOME STATUS REPORT');
      console.log('='.repeat(70));
      console.log(content.data.summary);
      console.log('\n' + '='.repeat(70));
      console.log('CAMERA ANALYSES');
      console.log('='.repeat(70) + '\n');
      
      if (content.data.cameraAnalyses && content.data.cameraAnalyses.length > 0) {
        content.data.cameraAnalyses.forEach((analysis, index) => {
          console.log(`\n📸 Camera ${index + 1}: ${analysis.data.deviceName} (ID: ${analysis.data.deviceId})`);
          console.log('-'.repeat(70));
          
          if (analysis.success) {
            console.log(`Status: ✅ Analysis successful`);
            console.log(`IP: ${analysis.data.cameraIP}`);
            console.log(`Model: ${analysis.data.model}`);
            
            if (analysis.data.peopleCount !== null && analysis.data.peopleCount > 0) {
              console.log(`⚠️  PEOPLE DETECTED: ${analysis.data.peopleCount} person(s)`);
            } else {
              console.log(`People: None detected`);
            }
            
            if (analysis.data.objects && analysis.data.objects.length > 0) {
              console.log(`Objects: ${analysis.data.objects.join(', ')}`);
            }
            
            if (analysis.data.weather) {
              console.log(`Weather: ${analysis.data.weather}`);
            }
            
            if (analysis.data.timeOfDay) {
              console.log(`Time of day: ${analysis.data.timeOfDay}`);
            }
            
            console.log(`\nDetailed Analysis:`);
            console.log(analysis.data.rawAnalysisText);
          } else {
            console.log(`Status: ❌ ${analysis.code}`);
            if (analysis.message) {
              console.log(`Reason: ${analysis.message}`);
            }
          }
        });
      } else {
        console.log('No cameras available for analysis.');
      }
      
      console.log('\n' + '='.repeat(70));
      console.log('✅ Camera check complete!');
      console.log('='.repeat(70));
      
    } else {
      console.error('❌ Unexpected response format');
    }
    
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  } finally {
    client.close();
  }
}

main();
