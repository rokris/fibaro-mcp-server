import dotenv from 'dotenv';
import { FibaroClient } from '../dist/fibaro-client.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from .env file in parent directory
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function main() {
  const host = process.env.FIBARO_HOST || process.env.FIBARO_URL;
  const user = process.env.FIBARO_USERNAME;
  const password = process.env.FIBARO_PASSWORD;

  if (!host || !user || !password) {
    console.error('Error: Missing FIBARO_HOST, FIBARO_USERNAME, or FIBARO_PASSWORD environment variables.');
    process.exit(1);
  }

  // Clean host
  let cleanHost = host;
  let useHttps = process.env.FIBARO_USE_HTTPS === 'true';
  
  if (host.startsWith('http://') || host.startsWith('https://')) {
    useHttps = host.startsWith('https://');
    cleanHost = host.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
  }

  console.log(`Connecting to Fibaro at ${cleanHost} (${useHttps ? 'HTTPS' : 'HTTP'})...`);

  const client = new FibaroClient(cleanHost, user, password, useHttps);

  try {
    console.log('Fetching home status...');
    const status = await client.getHomeStatus();
    console.log('Home Status Result:');
    console.log(JSON.stringify(status, null, 2));
  } catch (error) {
    console.error('Error fetching home status:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

main();
