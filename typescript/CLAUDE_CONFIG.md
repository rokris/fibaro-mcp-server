# Claude Desktop Configuration (TypeScript Version)

For å bruke TypeScript-versjonen av MCP serveren med Claude Desktop, legg til følgende i din Claude Desktop konfigurasjonsfil:

## macOS
`~/Library/Application Support/Claude/claude_desktop_config.json`

## Windows
`%APPDATA%\Claude\claude_desktop_config.json`

## Konfigurasjon

### Alternativ 1: Direkte med miljøvariabler

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

## Restart Claude Desktop

Etter å ha oppdatert konfigurasjonen, restart Claude Desktop for å aktivere MCP serveren.

## Verifikasjon

Du kan nå spørre Claude om:
- "List alle enheter i mitt Fibaro system"
- "Skru på lys med ID 123"
- "Vis meg alle rom"
- "Trigger scene 5"
- "Hva er LUA-koden for scene 99?" (Ny funksjonalitet!)
- "Vis meg detaljer om tidstyrt scene"
- "Hva er systeminformasjonen for Fibaro?"

Claude vil da bruke MCP serveren til å kommunisere med din Fibaro Home Center 2.

## Fordeler med TypeScript-versjonen

- ✅ **Ingen Python nødvendig** - Kun Node.js
- ✅ **Raskere oppstart** - Kompilert JavaScript
- ✅ **Type safety** - Full TypeScript støtte
- ✅ **npx support** - Kan kjøres direkte uten lokal installasjon (når publisert)
- ✅ **Moderne async/await** - Enklere å lese og vedlikeholde

## Se også

- [TypeScript README](../typescript/README.md) - TypeScript-spesifikk dokumentasjon
- [Python CLAUDE_CONFIG](./CLAUDE_CONFIG.md) - Python-versjon konfigurasjon
- [EXAMPLES](./EXAMPLES.md) - Brukseksempler
