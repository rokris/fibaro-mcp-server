import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { FibaroClient } from '../dist/fibaro-client.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const deviceId = Number(process.argv[2] || 0);

if (!deviceId) {
  console.error('Usage: node scripts/get-device.js <deviceId>');
  process.exit(1);
}

const host = process.env.FIBARO_URL || process.env.FIBARO_HOST;
const username = process.env.FIBARO_USERNAME;
const password = process.env.FIBARO_PASSWORD;
let useHttps = process.env.FIBARO_USE_HTTPS === 'true';

if (!host || !username || !password) {
  console.error('Missing Fibaro credentials in environment.');
  process.exit(1);
}

let cleanHost = host;
if (host.startsWith('http://') || host.startsWith('https://')) {
  useHttps = host.startsWith('https://');
  cleanHost = host.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
}

const client = new FibaroClient(cleanHost, username, password, useHttps);

async function main() {
  try {
    const device = await client.getDevice(deviceId);
    console.log(JSON.stringify(device, null, 2));
  } catch (error) {
    console.error('Error fetching device:', error?.message || error);
    if (error?.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
    }
    process.exit(1);
  }
}

main();
