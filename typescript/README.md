# Fibaro Home Center 2 MCP Server (TypeScript)

TypeScript/Node.js implementasjon av Model Context Protocol (MCP) server for Fibaro Home Center 2.

## Funksjoner

- 📱 List og kontroller enheter (devices)
- 🏠 Administrer rom (rooms)
- 🎬 Trigger scener (scenes) med full LUA-kode support
- 📊 Hent enhetsinformasjon og status
- 🔧 Oppdater enhetsparametere
- 🌍 Globale variabler

## Installasjon

### 1. Installer avhengigheter

```bash
cd typescript
npm install
```

### 2. Konfigurer miljøvariabler

Kopier `.env.example` til `.env`:

```bash
cp .env.example .env
```

Rediger `.env` med dine Fibaro HC2 detaljer:

```env
FIBARO_URL=http://192.168.1.100
FIBARO_USERNAME=admin
FIBARO_PASSWORD=your_password
```

**Merk:** Bruk `https://` i URL hvis din Fibaro bruker HTTPS.

### 3. Bygg prosjektet

```bash
npm run build
```

## Bruk

### Kjør serveren lokalt

```bash
npm start
```

### Bruk med Claude Desktop

Legg til i `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS):

```json
{
  "mcpServers": {
    "fibaro-home-center": {
      "command": "node",
      "args": ["/full/path/to/fibaro-mcp/typescript/dist/index.js"],
      "env": {
        "FIBARO_URL": "http://192.168.1.100",
        "FIBARO_USERNAME": "admin",
        "FIBARO_PASSWORD": "your_password"
      }
    }
  }
}
```

### Bruk med VS Code

Legg til i `~/.vscode/mcp.json`:

```json
{
  "mcpServers": {
    "fibaro-home-center": {
      "command": "node",
      "args": ["/full/path/to/fibaro-mcp/typescript/dist/index.js"],
      "env": {
        "FIBARO_URL": "http://192.168.1.100",
        "FIBARO_USERNAME": "admin",
        "FIBARO_PASSWORD": "your_password"
      }
    }
  }
}
```

### Bruk via npx (etter publisering til npm)

```json
{
  "mcpServers": {
    "fibaro-home-center": {
      "command": "npx",
      "args": ["-y", "fibaro-mcp-server"],
      "env": {
        "FIBARO_URL": "http://192.168.1.100",
        "FIBARO_USERNAME": "admin",
        "FIBARO_PASSWORD": "your_password"
      }
    }
  }
}
```

## MCP Tools

Serveren tilbyr følgende tools:

### Enheter (Devices)
- `list_devices` - List alle enheter i systemet
- `get_device` - Hent informasjon om en spesifikk enhet
- `control_device` - Kontroller en enhet (turn on/off, set value, etc.)

### Rom (Rooms)
- `list_rooms` - List alle rom i systemet
- `get_room` - Hent informasjon om et spesifikt rom
- `get_room_devices` - Hent enheter i et spesifikt rom

### Scener (Scenes)
- `list_scenes` - List alle scener
- `get_scene` - Hent detaljert informasjon om en scene (inkludert LUA-kode, triggers, actions)
- `trigger_scene` - Aktiver en scene

### System
- `get_system_info` - Hent systeminformasjon
- `get_weather` - Hent værinformasjon

### Globale Variabler
- `list_global_variables` - List alle globale variabler
- `get_global_variable` - Hent en spesifikk global variabel
- `set_global_variable` - Sett en global variabel

## Utvikling

### Watch mode (auto-rebuild ved endringer)

```bash
npm run dev
```

### Kjør direkte uten bygging

```bash
npm install -g tsx
tsx src/index.ts
```

## Fordeler med TypeScript-versjonen

- ✅ **Ingen pip-installasjon** - Kun npm install
- ✅ **Type safety** - Full TypeScript type checking
- ✅ **Enklere distribusjon** - Kan publiseres til npm
- ✅ **npx support** - Kan kjøres direkte uten installasjon
- ✅ **Bedre ytelse** - Kompilert JavaScript
- ✅ **Moderne async/await** - Enklere å lese og vedlikeholde

## Sammenligning med Python-versjonen

Begge versjoner har identisk funksjonalitet:

| Funksjon | Python | TypeScript |
|----------|--------|------------|
| Device control | ✅ | ✅ |
| Room management | ✅ | ✅ |
| Scene management | ✅ | ✅ |
| LUA code display | ✅ | ✅ |
| Global variables | ✅ | ✅ |
| System info | ✅ | ✅ |

Velg TypeScript hvis:
- Du foretrekker Node.js økosystemet
- Du vil distribuere via npm
- Du vil bruke npx for enkel installasjon

Velg Python hvis:
- Du allerede har Python installert
- Du foretrekker Python syntaks
- Du har andre Python-avhengigheter

## Lisens

MIT
