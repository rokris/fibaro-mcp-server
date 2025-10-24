# VS Code Configuration

For å bruke denne MCP serveren med GitHub Copilot i VS Code, må du legge til konfigurasjonen i VS Code settings.

## Konfigurasjonsfil lokasjon

VS Code MCP-konfigurasjonen ligger i:

### macOS/Linux
`~/.vscode/mcp.json`

### Windows
`%USERPROFILE%\.vscode\mcp.json`

## Konfigurasjon

Opprett eller rediger `mcp.json` filen med følgende innhold:

```json
{
  "mcpServers": {
    "fibaro-home-center": {
      "command": "python",
      "args": [
        "-m",
        "fibaro_mcp.server"
      ],
      "env": {
        "FIBARO_URL": "http://192.168.1.100",
        "FIBARO_USERNAME": "admin",
        "FIBARO_PASSWORD": "your_password"
      }
    }
  }
}
```

Erstatt følgende verdier med dine egne:
- `FIBARO_URL` - Full URL til din Fibaro Home Center 2 (f.eks. `http://192.168.1.100` eller `https://192.168.1.100`)
- `FIBARO_USERNAME` - Brukernavn for Fibaro HC2
- `FIBARO_PASSWORD` - Passord for Fibaro HC2

## Alternativ med .env fil

Hvis du bruker `.env` fil i prosjektmappen, kan du forenkle konfigurasjonen:

```json
{
  "mcpServers": {
    "fibaro-home-center": {
      "command": "python",
      "args": [
        "-m",
        "fibaro_mcp.server"
      ],
      "cwd": "/full/path/to/fibaro-mcp"
    }
  }
}
```

Opprett `.env` filen i prosjektmappen (`/full/path/to/fibaro-mcp/.env`):

```env
FIBARO_URL=http://192.168.1.100
FIBARO_USERNAME=admin
FIBARO_PASSWORD=your_password
```

## Installasjon

Sørg for at du har installert pakken først:
```bash
cd /path/to/fibaro-mcp
pip install -e .
```

## Aktivering i VS Code

1. Installer Python-utvidelsen for VS Code hvis du ikke har den allerede
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

## Feilsøking

### Serveren starter ikke
- Sjekk at Python er installert og tilgjengelig i PATH
- Verifiser at alle avhengigheter er installert: `pip install -e .`
- Sjekk VS Code Output-panelet for feilmeldinger

### Kan ikke koble til Fibaro HC2
- Verifiser at IP-adressen er korrekt
- Sjekk at brukernavn og passord er riktige
- Test forbindelsen manuelt: `python test_server.py`

### MCP-serveren vises ikke i Copilot
- Restart VS Code
- Sjekk at `mcp.json` har korrekt JSON-syntaks
- Se etter feilmeldinger i VS Code Developer Tools (Help → Toggle Developer Tools)

## Se også

- [README.md](README.md) - Hovedoversikt over prosjektet
- [EXAMPLES.md](EXAMPLES.md) - Eksempler på bruk
- [CLAUDE_CONFIG.md](CLAUDE_CONFIG.md) - Konfigurasjon for Claude Desktop
