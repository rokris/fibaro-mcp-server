#!/usr/bin/env node
/**
 * Fibaro HC2 - iOS Device Cleanup Script
 *
 * Viser alle registrerte iOS-enheter og lar deg:
 *   1. Sende test-push til én eller alle enheter
 *   2. Slette enheter du bekrefter er inaktive
 *
 * Bruk: node cleanup-ios-devices.js
 */

const http = require('http');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

// Les .env manuelt uten dotenv-avhengighet
const envPath = path.join(__dirname, '../typescript/.env');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
    const [key, ...rest] = line.split('=');
    if (key && rest.length) process.env[key.trim()] = rest.join('=').trim();
  });
}

const HC2_HOST = (process.env.FIBARO_URL || 'http://192.168.0.2').replace(/^https?:\/\//, '');
const USERNAME = process.env.FIBARO_USERNAME;
const PASSWORD = process.env.FIBARO_PASSWORD;
const AUTH = Buffer.from(`${USERNAME}:${PASSWORD}`).toString('base64');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise(resolve => rl.question(q, resolve));

function apiRequest(method, path, body) {
  return new Promise((resolve, reject) => {
    const bodyStr = body ? JSON.stringify(body) : null;
    const options = {
      hostname: HC2_HOST,
      port: 80,
      path,
      method,
      headers: {
        'Authorization': `Basic ${AUTH}`,
        'Content-Type': 'application/json',
        ...(bodyStr ? { 'Content-Length': Buffer.byteLength(bodyStr) } : {}),
      },
    };
    const req = http.request(options, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: data ? JSON.parse(data) : null }); }
        catch { resolve({ status: res.statusCode, body: data }); }
      });
    });
    req.on('error', reject);
    if (bodyStr) req.write(bodyStr);
    req.end();
  });
}

async function getDevices() {
  const res = await apiRequest('GET', '/api/iosDevices');
  return res.body || [];
}

async function sendTestPush(deviceId, deviceName) {
  const res = await apiRequest('POST', '/api/mobile/push', {
    mobileDevices: [deviceId],
    message: `Test fra cleanup-script – er denne enheten aktiv? (${deviceName})`,
    title: 'Fibaro test-push',
    category: 'YES_NO',
    data: { sceneId: 125 },
  });
  return res.status >= 200 && res.status < 300;
}

async function deleteDevice(id, udid) {
  const res = await apiRequest('DELETE', `/api/iosDevices/${id}?udid=${encodeURIComponent(udid)}`);
  return res.status >= 200 && res.status < 300;
}

async function main() {
  console.log('\n=== Fibaro HC2 – iOS-enheter rydding ===\n');

  const devices = await getDevices();
  if (!devices.length) {
    console.log('Ingen iOS-enheter registrert.');
    rl.close();
    return;
  }

  console.log(`Fant ${devices.length} registrerte enheter:\n`);
  devices.forEach((d, i) => {
    console.log(`  [${i + 1}] ID ${d.id.toString().padEnd(4)} | Push: ${d.push ? '✅' : '❌'} | Navn: ${d.name}`);
    console.log(`       UDID: ${d.udid}`);
  });

  console.log('\nHva vil du gjøre?');
  console.log('  [t] Send test-push til alle enheter');
  console.log('  [n] Send test-push til én bestemt enhet');
  console.log('  [s] Slett én eller flere enheter');
  console.log('  [q] Avslutt\n');

  const action = (await ask('Valg: ')).trim().toLowerCase();

  if (action === 't') {
    console.log('\nSender test-push til alle enheter...');
    for (const d of devices) {
      const ok = await sendTestPush(d.id, d.name);
      console.log(`  ID ${d.id} (${d.name}): ${ok ? '✅ Sendt' : '❌ Feil'}`);
      await new Promise(r => setTimeout(r, 500));
    }
    console.log('\nSjekk hvilke iPhones som mottok push-varselet.');

  } else if (action === 'n') {
    const idx = parseInt(await ask(`Skriv nummer (1–${devices.length}): `), 10) - 1;
    if (idx < 0 || idx >= devices.length) { console.log('Ugyldig valg.'); rl.close(); return; }
    const d = devices[idx];
    const ok = await sendTestPush(d.id, d.name);
    console.log(`\nTest-push til ID ${d.id} (${d.name}): ${ok ? '✅ Sendt' : '❌ Feil'}`);

  } else if (action === 's') {
    console.log('\nSkriv kommaseparerte nummer på enhetene du vil slette, f.eks: 1,3');
    console.log('(Kun enheter du er SIKKER på er inaktive)\n');
    const input = await ask('Nummer: ');
    const indices = input.split(',').map(s => parseInt(s.trim(), 10) - 1).filter(i => i >= 0 && i < devices.length);

    if (!indices.length) { console.log('Ingen gyldige valg.'); rl.close(); return; }

    console.log('\nDu har valgt å slette:');
    indices.forEach(i => console.log(`  - ID ${devices[i].id}: ${devices[i].name} (${devices[i].udid})`));

    const confirm = (await ask('\nEr du sikker? (ja/nei): ')).trim().toLowerCase();
    if (confirm !== 'ja') { console.log('Avbrutt.'); rl.close(); return; }

    for (const i of indices) {
      const d = devices[i];
      const ok = await deleteDevice(d.id, d.udid);
      console.log(`  Slettet ID ${d.id} (${d.name}): ${ok ? '✅' : '❌ Feilet'}`);
    }

    const remaining = await getDevices();
    console.log(`\n${remaining.length} enheter gjenstår i systemet.`);

  } else {
    console.log('Avbrutt.');
  }

  rl.close();
}

main().catch(err => {
  console.error('Feil:', err.message);
  rl.close();
  process.exit(1);
});
