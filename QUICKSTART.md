# Quick Start Guide

Kom i gang med Fibaro MCP Server på under 5 minutter!

## Installasjon

### Via npm/npx (Raskeste måten)

```bash
# Kjør direkte uten installasjon
npx fibaro-mcp-server

# Eller installer globalt
npm install -g fibaro-mcp-server
fibaro-mcp-server
```

### Fra source

```bash
# 1. Klon repository
git clone https://github.com/rokris/fibaro-mcp-server.git
cd fibaro-mcp-server/typescript

# 2. Installer dependencies
npm install

# 3. Bygg
npm run build

# 4. Test
node dist/test.js
```

## Konfigurasjon

All konfigurasjon skjer via GitHub Copilot settings eller `~/.vscode/mcp.json`. Se [VSCODE_CONFIG.md](VSCODE_CONFIG.md) for detaljer.

Eksempel konfigurasjon for GitHub Copilot (`~/Library/Application Support/Code/User/settings.json`):

```json
{
  "github.copilot.chat.mcp.servers": {
    "fibaro": {
      "command": "npx",
      "args": ["-y", "fibaro-mcp-server"],
      "env": {
        "FIBARO_HOST": "192.168.1.100",
        "FIBARO_USERNAME": "admin",
        "FIBARO_PASSWORD": "your_password",
        "FIBARO_USE_HTTPS": "false"
      }
    }
  }
}
}
```

Erstatt med dine verdier:
- `FIBARO_HOST` - IP-adresse til din Fibaro Home Center 2 (f.eks. `192.168.1.100`)
- `FIBARO_USERNAME` - Administrator brukernavn
- `FIBARO_PASSWORD` - Administrator passord
- `FIBARO_USE_HTTPS` - Sett til `"true"` hvis du bruker HTTPS

## Test at det fungerer

### Fra terminalen

```bash
cd typescript
node dist/test.js
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

### I VS Code med GitHub Copilot

Restart VS Code og spør i Copilot chat:

```
List alle enheter i mitt Fibaro system
```

eller

```
Vis meg alle rom
```

## Neste steg

- 💻 Se [VSCODE_CONFIG.md](./VSCODE_CONFIG.md) for VS Code konfigurasjon
- 🎥 Se [CAMERA_ANALYSIS.md](./CAMERA_ANALYSIS.md) for å sette opp AI-kameraanalyse
- 📖 Se [README.md](./README.md) for full dokumentasjon

## Vanlige problemer

### "Cannot connect to Fibaro"
- Sjekk at FIBARO_HOST er riktig IP-adresse
- Verifiser at Fibaro HC2 er på nettverket
- Test i nettleser: `http://192.168.x.x/api/settings/info`

### "Authentication failed"
- Sjekk brukernavn og passord
- Sørg for at brukeren har admin-rettigheter i Fibaro

### "Module not found"
- Kjør `npm install` på nytt i `typescript/` mappen
- Slett `node_modules/` og kjør `npm install` igjen
- Hvis du bruker npx, kjør `npx -y fibaro-mcp-server` for å force reinstall

## Hjelp og support

- 🐛 Rapporter bugs via GitHub Issues
- 💬 Still spørsmål i GitHub Discussions
- 📧 Eller kontakt vedlikeholder direkte

## Gratulerer! 🎉

Du har nå en fullstendig fungerende Fibaro MCP Server som kan kontrollere hjemmet ditt via GitHub Copilot!

