# VS Code Configuration

For å bruke denne MCP serveren med GitHub Copilot i VS Code, må du legge til konfigurasjonen i VS Code settings.

## Konfigurasjonsfil lokasjon

GitHub Copilot MCP-konfigurasjonen ligger i VS Code settings:

### macOS
`~/Library/Application Support/Code/User/settings.json`

### Linux
`~/.config/Code/User/settings.json`

### Windows
`%APPDATA%\Code\User\settings.json`

## Konfigurasjon

Åpne settings.json (Cmd+Shift+P → "Preferences: Open User Settings (JSON)") og legg til:

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
        "FIBARO_USE_HTTPS": "false",
        "OLLAMA_URL": "http://localhost:11434",
        "HOME_STATUS_CAMERA_CONCURRENCY": "2",
        "HOME_STATUS_CAMERA_INCLUDE": "87,342,176"
      }
    }
  }
}
```

Erstatt følgende verdier med dine egne:
- `FIBARO_HOST` - IP-adresse til din Fibaro Home Center 2 (f.eks. `192.168.1.100`)
- `FIBARO_USERNAME` - Brukernavn for Fibaro HC2
- `FIBARO_PASSWORD` - Passord for Fibaro HC2
- `FIBARO_USE_HTTPS` - Sett til `"true"` hvis du bruker HTTPS

### AI og Kamera Konfigurasjon (Valgfritt)

For å aktivere AI-analyse av kameraer i `get_home_status`:

- `OLLAMA_URL` - URL til din lokale Ollama instans (default: `http://localhost:11434`)
- `HOME_STATUS_CAMERA_CONCURRENCY` - Antall kameraer som analyseres samtidig (default: `2`). Senk denne hvis du opplever timeouts.
- `HOME_STATUS_CAMERA_INCLUDE` - Komma-separert liste av kamera-IDer som *skal* analyseres. Hvis satt, analyseres *kun* disse.
- `HOME_STATUS_CAMERA_EXCLUDE` - Komma-separert liste av kamera-IDer som *ikke* skal analyseres.
- `HOME_STATUS_TEST_TIMEOUT` - Timeout i millisekunder for hver kamera-analyse (default: `30000`).

> **Note:** Serveren installeres automatisk via npx første gang du bruker den. Ingen manuell installasjon nødvendig!

## Alternativ: Fra source

Hvis du vil kjøre fra source i stedet for npm:

```json
{
  "github.copilot.chat.mcp.servers": {
    "fibaro": {
      "command": "node",
      "args": ["/path/to/fibaro-mcp-server/typescript/dist/index.js"],
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

Sørg for at du har bygget prosjektet først:
```bash
cd /path/to/fibaro-mcp-server/typescript
npm install
npm run build
```

## Aktivering i VS Code

1. Lagre settings.json
2. Restart VS Code
3. MCP-serveren vil automatisk starte når du bruker GitHub Copilot Chat

## Verifikasjon

Du kan nå spørre GitHub Copilot i VS Code om:
- "List alle enheter i mitt Fibaro system"
- "Skru på lys med ID 123"
- "Vis meg alle rom"
- "Trigger scene 5"
- "Hva er LUA-koden for scene 99?"
- "Vis meg detaljer om tidstyrt scene"
- "Hva er systeminformasjonen for Fibaro?"
- "Kan du sjekke Hagekameraet for aktivitet?" (Kamera AI-analyse)

GitHub Copilot vil da bruke MCP serveren til å kommunisere med din Fibaro Home Center 2.

## Feilsøking

### Serveren starter ikke
- Sjekk at Node.js er installert (kjør `node --version`)
- Hvis du bruker npx, slett cache: `rm -rf ~/.npm/_npx`
- Sjekk VS Code Output-panelet for feilmeldinger

### Kan ikke koble til Fibaro HC2
- Verifiser at IP-adressen er korrekt
- Sjekk at brukernavn og passord er riktige
- Test forbindelsen manuelt: `cd typescript && node dist/test.js`

### MCP-serveren vises ikke i Copilot
- Restart VS Code
- Sjekk at settings.json har korrekt JSON-syntaks
- Se etter feilmeldinger i VS Code Developer Tools (Help → Toggle Developer Tools)

## Se også

- [README.md](README.md) - Hovedoversikt over prosjektet
- [QUICKSTART.md](QUICKSTART.md) - Kom i gang på 5 minutter
- [CAMERA_ANALYSIS.md](CAMERA_ANALYSIS.md) - Kamera AI-analyse med Ollama

