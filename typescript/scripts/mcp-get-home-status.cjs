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
    OLLAMA_URL: process.env.OLLAMA_URL || 'http://localhost:11434',
  };

  const client = new Client({ name: 'mcp-home-status-test', version: '0.1.0' }, { capabilities: { tools: {} } });
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

  try {
    const timeoutMs = parseInt(process.env.HOME_STATUS_TEST_TIMEOUT || '180000', 10);
    const res = await client.callTool({ name: 'get_home_status', arguments: {} }, undefined, { timeout: timeoutMs });
    console.log('Home status result:\n');
    if (res.content) {
      for (const part of res.content) {
        if (part.type === 'text') {
          console.log(part.text);
        }
      }
    }
    if (res.structuredContent) {
      console.log('\nstructuredContent:');
      console.log(JSON.stringify(res.structuredContent, null, 2));
    }
  } catch (err) {
    console.error('Home status call failed:', err);
  }

  await client.close();
  await transport.close();
}

main().catch((err) => {
  console.error('Home status tester error:', err);
  process.exit(1);
});
