# VS Code Configuration (TypeScript Version)

For å bruke TypeScript-versjonen av MCP serveren med GitHub Copilot i VS Code, må du legge til konfigurasjonen i VS Code settings.

## Konfigurasjonsfil lokasjon

VS Code MCP-konfigurasjonen ligger i:

### macOS/Linux
`~/.vscode/mcp.json`

### Windows
`%USERPROFILE%\.vscode\mcp.json`

## Konfigurasjon

### Alternativ 1: Direkte med miljøvariabler

Opprett eller rediger `mcp.json` filen med følgende innhold:

```json
{
  "mcpServers": {
    "fibaro-home-center": {
      "command": "node",
      "args": [
        "/full/path/to/fibaro-mcp/typescript/dist/index.js"
      ],
      "env": {
        "FIBARO_HOST": "192.168.1.100",
        "FIBARO_USERNAME": "admin",
        "FIBARO_PASSWORD": "your_password",
        "FIBARO_USE_HTTPS": "false"
      }
    }
  }
}
```

Erstatt følgende verdier med dine egne:
- `FIBARO_HOST` - IP-adressen til din Fibaro Home Center 2
- `FIBARO_USERNAME` - Brukernavn for Fibaro HC2
- `FIBARO_PASSWORD` - Passord for Fibaro HC2
- `FIBARO_USE_HTTPS` - Sett til `"true"` hvis du bruker HTTPS

### Alternativ 2: Med .env fil

```json
{
  "mcpServers": {
    "fibaro-home-center": {
      "command": "node",
      "args": [
        "/full/path/to/fibaro-mcp/typescript/dist/index.js"
      ],
      "cwd": "/full/path/to/fibaro-mcp/typescript"
    }
  }
}
```

Opprett `.env` filen i `typescript/` mappen:

```env
FIBARO_HOST=192.168.1.100
FIBARO_USERNAME=admin
FIBARO_PASSWORD=your_password
FIBARO_USE_HTTPS=false
```

### Alternativ 3: Via npx (etter publisering til npm)

```json
{
  "mcpServers": {
    "fibaro-home-center": {
      "command": "npx",
      "args": [
        "-y",
        "fibaro-mcp-server"
      ],
      "env": {
        "FIBARO_HOST": "192.168.1.100",
        "FIBARO_USERNAME": "admin",
        "FIBARO_PASSWORD": "your_password",
        "FIBARO_USE_HTTPS": "false"
      }
    }
  }
}
```

## Installasjon

Sørg for at du har bygget TypeScript-prosjektet først:

```bash
cd /path/to/fibaro-mcp/typescript
npm install
npm run build
```

## Aktivering i VS Code

1. Sørg for at Node.js er installert (versjon 18 eller nyere)
2. Restart VS Code etter å ha opprettet `mcp.json` filen
3. MCP-serveren vil automatisk starte når du bruker GitHub Copilot Chat

## Verifikasjon

Du kan nå spørre GitHub Copilot i VS Code om:
- "List alle enheter i mitt Fibaro system"
- "Skru på lys med ID 123"
- "Vis meg alle rom"
- "Trigger scene 5"
- "Hva er LUA-koden for scene 99?" (Ny funksjonalitet!)
- "Vis meg detaljer om tidstyrt scene"
- "Hva er systeminformasjonen for Fibaro?"

GitHub Copilot vil da bruke MCP serveren til å kommunisere med din Fibaro Home Center 2.

## Fordeler med TypeScript-versjonen

- ✅ **Ingen Python nødvendig** - Kun Node.js
- ✅ **Raskere oppstart** - Kompilert JavaScript
- ✅ **Type safety** - Full TypeScript støtte
- ✅ **npx support** - Kan kjøres direkte uten lokal installasjon
- ✅ **Enklere distribusjon** - Kan publiseres til npm

## Feilsøking

### Serveren starter ikke
- Sjekk at Node.js er installert: `node --version` (må være >= 18.0.0)
- Verifiser at prosjektet er bygget: `npm run build`
- Sjekk VS Code Output-panelet for feilmeldinger

### Kan ikke koble til Fibaro HC2
- Verifiser at IP-adressen er korrekt
- Sjekk at brukernavn og passord er riktige
- Test forbindelsen manuelt: `node dist/test.js`

### MCP-serveren vises ikke i Copilot
- Restart VS Code
- Sjekk at `mcp.json` har korrekt JSON-syntaks
- Se etter feilmeldinger i VS Code Developer Tools (Help → Toggle Developer Tools)

### TypeScript compile errors
- Kjør `npm install` på nytt for å sikre at alle avhengigheter er installert
- Slett `node_modules/` og `dist/` og kjør `npm install && npm run build`

## Se også

- [TypeScript README](../typescript/README.md) - TypeScript-spesifikk dokumentasjon
- [Python VSCODE_CONFIG](./VSCODE_CONFIG.md) - Python-versjon konfigurasjon
- [EXAMPLES](./EXAMPLES.md) - Brukseksempler
