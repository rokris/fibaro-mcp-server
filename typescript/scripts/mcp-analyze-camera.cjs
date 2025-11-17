const path = require('path');
const process = require('process');
const sdkBase = path.resolve(__dirname, '..', 'node_modules', '@modelcontextprotocol', 'sdk', 'dist', 'cjs');
const { Client } = require(path.join(sdkBase, 'client', 'index.js'));
const { StdioClientTransport } = require(path.join(sdkBase, 'client', 'stdio.js'));

async function main() {
  const cwd = path.resolve(process.cwd());
  const serverPath = path.resolve(cwd, 'dist', 'index.js');
  console.log('Will spawn server:', process.execPath, serverPath);

  const fibaroEnv = {
    FIBARO_HOST: process.env.FIBARO_HOST || '',
    FIBARO_URL: process.env.FIBARO_URL || '',
    FIBARO_USERNAME: process.env.FIBARO_USERNAME || '',
    FIBARO_PASSWORD: process.env.FIBARO_PASSWORD || '',
    FIBARO_USE_HTTPS: process.env.FIBARO_USE_HTTPS || 'false',
  };

  const clientInfo = { name: 'mcp-analyze-camera', version: '0.1.0' };
  const client = new Client(clientInfo, { capabilities: { tools: {} } });
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [serverPath],
    env: fibaroEnv,
    stderr: 'pipe',
    cwd,
  });

  if (transport.stderr) {
    transport.stderr.on('data', (chunk) => {
      process.stderr.write('[server stderr] ' + chunk.toString());
    });
  }

  await client.connect(transport);
  console.log('Connected. Server version:', client.getServerVersion());

  // Choose a camera device id; adjust if needed
  const cameraDeviceId = parseInt(process.argv[2] || '341', 10);
  console.log('Calling analyze_camera_snapshot for device', cameraDeviceId);

  try {
    const res = await client.callTool({ name: 'analyze_camera_snapshot', arguments: { device_id: cameraDeviceId, prompt: 'Describe the scene in this image in detail.' } });
    console.log('Analyze result:');
    if (res.structuredContent) console.log('structuredContent:', JSON.stringify(res.structuredContent, null, 2));
    if (res.content) {
      for (const part of res.content) {
        if (part.type === 'text') console.log('[text]', part.text);
        if (part.type === 'image') console.log('[image]', part.url || part.description || '<image>');
        if (part.type === 'resource') console.log('[resource]', part.title || JSON.stringify(part, null, 2));
      }
    }
  } catch (e) {
    console.error('Analyze call failed:', e);
  }

  await client.close();
  await transport.close();
}

main().catch((err) => {
  console.error('Analyzer error:', err);
  process.exit(1);
});
