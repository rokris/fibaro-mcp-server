# Fibaro Home Center 2 MCP Server

En Model Context Protocol (MCP) server for integrasjon med Fibaro Home Center 2.

Bygget med **TypeScript/Node.js** for moderne npx-støtte og enkel installasjon.

<a href="https://insiders.vscode.dev/redirect/mcp/install?name=fibaro&config=%7B%22type%22%3A%22stdio%22%2C%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22-y%22%2C%22fibaro-mcp-server%22%5D%2C%22env%22%3A%7B%22FIBARO_URL%22%3A%22%24%7Binput%3Afibaro_url%7D%22%2C%22FIBARO_USERNAME%22%3A%22%24%7Binput%3Afibaro_username%7D%22%2C%22FIBARO_PASSWORD%22%3A%22%24%7Binput%3Afibaro_password%7D%22%7D%7D&inputs=%5B%7B%22id%22%3A%22fibaro_url%22%2C%22type%22%3A%22promptString%22%2C%22description%22%3A%22Fibaro%20Home%20Center%202%20URL%20(e.g.%20http%3A%2F%2F192.168.1.100)%22%7D%2C%7B%22id%22%3A%22fibaro_username%22%2C%22type%22%3A%22promptString%22%2C%22description%22%3A%22Fibaro%20username%22%7D%2C%7B%22id%22%3A%22fibaro_password%22%2C%22type%22%3A%22promptString%22%2C%22description%22%3A%22Fibaro%20password%22%2C%22password%22%3Atrue%7D%5D">
  <img src="https://img.shields.io/badge/Install-Fibaro%20MCP%20Server-blue?style=for-the-badge&logo=visual-studio-code" alt="Install Fibaro MCP Server" />
</a>

## 🚀 Rask installasjon

### Via VS Code (Ett klikk)

<a href="https://insiders.vscode.dev/redirect/mcp/install?name=fibaro&config=%7B%22type%22%3A%22stdio%22%2C%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22-y%22%2C%22fibaro-mcp-server%22%5D%2C%22env%22%3A%7B%22FIBARO_URL%22%3A%22%24%7Binput%3Afibaro_url%7D%22%2C%22FIBARO_USERNAME%22%3A%22%24%7Binput%3Afibaro_username%7D%22%2C%22FIBARO_PASSWORD%22%3A%22%24%7Binput%3Afibaro_password%7D%22%7D%7D&inputs=%5B%7B%22id%22%3A%22fibaro_url%22%2C%22type%22%3A%22promptString%22%2C%22description%22%3A%22Fibaro%20Home%20Center%202%20URL%20(e.g.%20http%3A%2F%2F192.168.1.100)%22%7D%2C%7B%22id%22%3A%22fibaro_username%22%2C%22type%22%3A%22promptString%22%2C%22description%22%3A%22Fibaro%20username%22%7D%2C%7B%22id%22%3A%22fibaro_password%22%2C%22type%22%3A%22promptString%22%2C%22description%22%3A%22Fibaro%20password%22%2C%22password%22%3Atrue%7D%5D">
  <img src="https://img.shields.io/badge/Install-Fibaro%20MCP%20Server-blue?style=for-the-badge&logo=visual-studio-code" alt="Install Fibaro MCP Server" />
</a>

Klikk på knappen over for å installere direkte i VS Code - den enkleste måten!

### Via npm

```bash
npm install -g fibaro-mcp-server
# eller kjør direkte med npx
npx fibaro-mcp-server
```

## Funksjoner

- 📱 List og kontroller enheter (devices)
- 🏠 Administrer rom (rooms)
- 🎬 Trigger scener (scenes) med full LUA-kode visning
- 📊 Hent enhetsinformasjon og status
- 🔧 Oppdater enhetsparametere
- 🌍 Administrer globale variabler
- 🔍 Systemdiagnostikk (minne, lagring, CPU)
- 👥 Brukeradministrasjon
- 📂 Seksjonsadministrasjon
- ⚡ Energiforbruksovervåkning
- 🌡️ Temperaturdata
- 📍 Lokasjonsinformasjon
- 🎥 **NYT: AI-drevet kameraanalyse med lokal Ollama** (se [CAMERA_ANALYSIS.md](CAMERA_ANALYSIS.md))

## Prosjektstruktur

```
fibaro-mcp-server/
├── typescript/      # TypeScript-implementasjon (hoved-kode)
│   ├── src/         # TypeScript source
│   ├── dist/        # Compiled JavaScript
│   └── package.json
├── CAMERA_ANALYSIS.md  # AI kamera-analyse dokumentasjon
├── QUICKSTART.md      # 5-minutters oppsettguide
├── VSCODE_CONFIG.md   # VS Code MCP konfigurasjon
└── README.md          # Denne filen
```

## Installasjon og Konfigurasjon

Se [typescript/README.md](typescript/README.md) for detaljert dokumentasjon.

**Rask start:**
```bash
cd typescript
npm install
npm run build
# Konfigurer i ~/.vscode/mcp.json (se VSCODE_CONFIG.md)
```

**Kjør:**
```bash
npm start
```

[📖 Se full TypeScript dokumentasjon](./typescript/)

## Rask start

**Ny bruker?** → Les [QUICKSTART.md](./QUICKSTART.md) for 5-minutters oppsett! 🚀

### Via npm/npx

```bash
# Installer globalt
npm install -g fibaro-mcp-server

# Eller kjør direkte med npx (ingen installasjon nødvendig)
npx fibaro-mcp-server
```

### Fra source

```bash
git clone https://github.com/rokris/fibaro-mcp-server.git
cd fibaro-mcp-server/typescript
npm install
npm run build
```

## Konfigurering

All konfigurasjon skjer via `~/.vscode/mcp.json` eller GitHub Copilot settings. Dette prosjektet bruker ikke `.env`-filer.

Se [VSCODE_CONFIG.md](./VSCODE_CONFIG.md) for detaljert konfigurering av MCP-server i VS Code.

## Bruk

### Kjør serveren

```bash
# Via npx
npx fibaro-mcp-server

# Eller hvis installert globalt
fibaro-mcp-server
```

### MCP Tools

Serveren tilbyr følgende tools:

#### Enheter (Devices)
- `list_devices` - List alle enheter i systemet
- `get_device` - Hent informasjon om en spesifikk enhet
- `control_device` - Kontroller en enhet (turn on/off, set value, etc.)
- `get_device_properties` - Hent egenskaper for en enhet

#### Rom (Rooms)
- `list_rooms` - List alle rom i systemet
- `get_room_devices` - Hent enheter i et spesifikt rom

#### Scener (Scenes)
- `list_scenes` - List alle scener
- `get_scene` - Hent detaljert informasjon om en scene (inkludert LUA-kode, triggers, actions)
- `trigger_scene` - Aktiver en scene

#### System
- `get_system_info` - Hent systeminformasjon
- `get_weather` - Hent værinformasjon

#### Globale Variabler
- `list_global_variables` - List alle globale variabler
- `get_global_variable` - Hent en spesifikk global variabel
- `set_global_variable` - Sett en global variabel

## Sammenligning: Python vs TypeScript

Begge versjoner tilbyr identisk funksjonalitet, men har forskjellige fordeler:

| Aspekt | Python 🐍 | TypeScript 📘 |
|--------|----------|---------------|
| **Installasjon** | `pip install -e .` | `npm install && npm run build` |
| **Kjøring** | `python -m fibaro_mcp.server` | `npm start` eller `node dist/index.js` |
| **Avhengigheter** | Python 3.8+, httpx, mcp, python-dotenv | Node.js 18+, axios, @modelcontextprotocol/sdk |
| **Distribusjon** | PyPI (pip) | npm / npx |
| **Type safety** | Valgfri (med mypy) | Innebygd i TypeScript |
| **Kompilering** | Nei (interpretert) | Ja (til JavaScript) |
| **Startup tid** | Rask | Svært rask |
| **Minnebruk** | Moderat | Lavere |
| **Enkel test** | `python test_server.py` | `node dist/test.js` |

### Velg Python hvis:
- ✅ Du allerede har Python installert
- ✅ Du foretrekker Python syntaks
- ✅ Du har andre Python-avhengigheter i prosjektet

### Velg TypeScript hvis:
- ✅ Du foretrekker Node.js økosystemet
- ✅ Du vil ha type safety uten ekstra verktøy
- ✅ Du vil bruke npx for enkel installasjon (når publisert)
- ✅ Du ønsker raskere oppstart og lavere minnebruk

## Fibaro Home Center 2 API

Serveren bruker Fibaro Home Center 2 REST API:

- Base URL: `http(s)://<host>/api/`
- Autentisering: HTTP Basic Auth
- Endpoints:
  - `/api/devices` - Enheter
  - `/api/rooms` - Rom
  - `/api/scenes` - Scener
  - `/api/settings/info` - Systeminformasjon

## Utvikling

Installer dev-avhengigheter:
```bash
pip install -e ".[dev]"
```

Kjør tester:
```bash
pytest
```

## Lisens

MIT
