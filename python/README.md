# Fibaro Home Center 2 MCP Server (Python)

En Model Context Protocol (MCP) server for integrasjon med Fibaro Home Center 2, skrevet i Python.

## Installasjon

```bash
pip install -e .
```

## Konfigurering

Opprett en `.env` fil basert på `.env.example`:

```bash
cp .env.example .env
```

Rediger `.env` med dine Fibaro HC2 detaljer:

```bash
FIBARO_URL=http://192.168.1.100
FIBARO_USERNAME=admin
FIBARO_PASSWORD=your_password
```

**Merk:** Bruk `https://` i URL hvis din Fibaro bruker HTTPS.

## Bruk

### Kjør serveren direkte

```bash
python -m fibaro_mcp.server
```

### Integrasjon med Claude Desktop

Se [../CLAUDE_CONFIG.md](../CLAUDE_CONFIG.md) for Claude Desktop konfigurasjon.

### Integrasjon med VS Code

Se [../VSCODE_CONFIG.md](../VSCODE_CONFIG.md) for VS Code konfigurasjon.

## Testing

```bash
# Kjør alle tester
pytest

# Kjør spesifikk test
python test_server.py
```

## Tilgjengelige kommandoer

- `list_devices` - List alle enheter
- `get_device` - Hent informasjon om en enhet
- `control_device` - Kontroller en enhet
- `list_rooms` - List alle rom
- `get_room_devices` - Hent enheter i et rom
- `list_scenes` - List alle scener
- `get_scene` - Hent scene-detaljer (inkludert LUA-kode)
- `trigger_scene` - Trigger en scene
- `get_system_info` - Hent systeminformasjon
- `get_weather` - Hent værdata
- `list_global_variables` - List globale variabler
- `get_global_variable` - Hent en global variabel
- `set_global_variable` - Sett en global variabel

## Utvikling

### Prosjektstruktur

```
python/
├── fibaro_mcp/
│   ├── __init__.py
│   ├── __main__.py
│   ├── server.py          # MCP server implementasjon
│   └── fibaro_client.py   # Fibaro API klient
├── tests/
│   └── test_fibaro_client.py
├── pyproject.toml
└── README.md              # Denne filen
```

## Se også

- [TypeScript-versjon](../typescript/) - Node.js/TypeScript implementasjon
- [Eksempler](../EXAMPLES.md) - Brukseksempler
- [Rask start](../QUICKSTART.md) - 5-minutters guide
