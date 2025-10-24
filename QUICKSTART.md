# Quick Start Guide

Kom i gang med Fibaro MCP Server på under 5 minutter!

## Velg din versjon

### 🚀 TypeScript (Anbefalt for nye brukere)

**Fordeler:** Rask, moderne, type-safe, kan kjøres via npx

```bash
# 1. Installer
cd fibaro-mcp-server/typescript
npm install
npm run build

# 2. Konfigurer
cp .env.example .env
# Rediger .env med dine Fibaro-detaljer

# 3. Test
node dist/test.js

# 4. Kjør
npm start
```

### 🐍 Python (For Python-brukere)

**Fordeler:** Enkel pip-installasjon, Python syntaks

```bash
# 1. Installer
cd fibaro-mcp-server/python
pip install -e .

# 2. Konfigurer
cp .env.example .env
# Rediger .env med dine Fibaro-detaljer

# 3. Test
python test_server.py

# 4. Kjør
python -m fibaro_mcp.server
```

## .env Konfigurasjon

Begge versjoner bruker samme `.env` format:

```env
FIBARO_URL=http://192.168.1.100
FIBARO_USERNAME=admin
FIBARO_PASSWORD=your_password
```

Erstatt med dine verdier:
- `FIBARO_URL` - Full URL til din Fibaro Home Center 2 (f.eks. `http://192.168.1.100` eller `https://192.168.1.100`)
- `FIBARO_USERNAME` - Administrator brukernavn
- `FIBARO_PASSWORD` - Administrator passord

## Test at det fungerer

### Fra terminalen

**TypeScript:**
```bash
cd typescript
node dist/test.js
```

**Python:**
```bash
python test_server.py
```

Du skal se output som:
```
✅ System: HC2
✅ Version: 4.xxx
✅ Serial: HC2-xxxxxx
✅ Found xxx devices
✅ Found xx rooms
✅ Found xx scenes
```

### I Claude Desktop / VS Code

Restart applikasjonen og spør:

```
List alle enheter i mitt Fibaro system
```

eller

```
Vis meg alle rom
```

## Neste steg


- 💻 Se [VSCODE_CONFIG.md](./VSCODE_CONFIG.md) for VS Code konfigurasjon
- 📘 Les [typescript/README.md](./typescript/README.md) for TypeScript-spesifikk dokumentasjon

## Vanlige problemer

### "Cannot connect to Fibaro"
- Sjekk at FIBARO_URL er riktig (inkludert `http://` eller `https://`)
- Verifiser at Fibaro HC2 er på nettverket
- Test i nettleser: `http://192.168.x.x/api/settings/info`

### "Authentication failed"
- Sjekk brukernavn og passord
- Sørg for at brukeren har admin-rettigheter i Fibaro

### "Module not found" (TypeScript)
- Kjør `npm install` på nytt
- Slett `node_modules/` og kjør `npm install` igjen

### "No module named 'httpx'" (Python)
- Kjør `pip install -e .` på nytt
- Sørg for at du er i riktig directory

## Hjelp og support

- 🐛 Rapporter bugs via GitHub Issues
- 💬 Still spørsmål i GitHub Discussions
- 📧 Eller kontakt vedlikeholder direkte

## Gratulerer! 🎉

Du har nå en fullstendig fungerende Fibaro MCP Server som kan kontrollere hjemmet ditt via Claude eller GitHub Copilot!
