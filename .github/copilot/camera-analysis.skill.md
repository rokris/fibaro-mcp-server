# Kameraanalyse Skill

## Beskrivelse
AI-drevet kameraanalyse for Fibaro Home Center 2 IP-kameraer ved hjelp av lokale Ollama vision-modeller. Gir sikkerhetsovervåkning, aktivitetsdeteksjon og visuell sceneforståelse gjennom Fibaro MCP-serveren.

## Funksjoner
- 🎥 Ta og analyser øyeblikksbilder fra Fibaro IP-kameraer
- 🤖 AI-drevet bildeanalyse med lokale Ollama-modeller (llama3.2-vision)
- 👥 Oppdage personer, kjøretøy og objekter i kamerafeed
- 🌤️ Identifisere værforhold og tidspunkt på dagen
- 🔒 Helt privat - ingen eksterne API-kall eller datadeling
- 📊 Masseanalyse av alle kameraer for omfattende hjemmeovervåkning

## Forutsetninger

### 1. Ollama-installasjon
```bash
# Verifiser at Ollama er installert
ollama --version

# Start Ollama-tjenesten
ollama serve
```

### 2. Vision-modell
```bash
# Installer llama3.2-vision (anbefalt)
ollama pull llama3.2-vision

# Verifiser installasjon
ollama list | grep llama3.2-vision
```

### 3. Fibaro MCP-server
Må være konfigurert med kamera-legitimasjon i VS Code-innstillinger:
```json
{
  "github.copilot.chat.mcp.servers": {
    "fibaro": {
      "command": "npx",
      "args": ["-y", "fibaro-mcp-server"],
      "env": {
        "FIBARO_HOST": "192.168.x.x",
        "FIBARO_USERNAME": "your_username",
        "FIBARO_PASSWORD": "your_password",
        "OLLAMA_URL": "http://localhost:11434"
      }
    }
  }
}
```

## Brukseksempler

### Sjekk alle kameraer for aktivitet
```
Sjekk alle kameraer for uvanlig aktivitet
Check all cameras for any unusual activity
Gi meg en oversikt over hva som skjer utenfor huset
```
**Respons:** Analyserer alle aktive kameraer og gir en omfattende sikkerhetsrapport inkludert oppdagede personer, objekter, værforhold og eventuell uvanlig aktivitet.

### Analyser spesifikt kamera
```
Analyser kamera 87
Hva ser du på kamera 342?
Sjekk garasjekameraet for kjøretøy
Er det noen utenfor inngangen?
```
**Respons:** Detaljert analyse av det spesifikke kameraet inkludert scenebeskrivelse, oppdagede objekter, antall personer og kontekstuell informasjon.

### Få hjemmestatus med kameraanalyse
```
Hvordan står det til hjemme?
Gi meg en fullstendig statusrapport
Hva skjer hjemme nå?
```
**Respons:** Full hjemmestatus inkludert vær, aktive enheter, sensorer, temperaturavlesninger og AI-analyse av alle konfigurerte kameraer.

### Tilpassede analysespørsmål
```
Er det en bil i garasjen? (Sjekk kamera 87)
Er det noen ved inngangen? (Sjekk kamera 341)
Hvordan er været ifølge hagekameraet?
Beskriv lysforholdene på terrassekameraet
```

## Konfigurasjonsalternativer
el | Beskrivelse | Standard |
|----------|-------------|---------|
| `OLLAMA_URL` | Ollama-tjeneste endepunkt | `http://localhost:11434` |
| `HOME_STATUS_CAMERA_CONCURRENCY` | Antall kameraer analysert parallelt | `2` |
| `HOME_STATUS_CAMERA_INCLUDE` | Kommaseparerte kamera-IDer å inkludere (f.eks. "87,342,176") | Alle kameraer |
| `HOME_STATUS_CAMERA_EXCLUDE` | Kommaseparerte kamera-IDer å ekskludere | Ingen |
| `HOME_STATUS_TEST_TIMEOUT` | Timeout per kameraanalyse (ms) | `30000` |
| `HOME_STATUS_CAMERA_MODEL` | Ollama vision-modell å bruke | `llama3.2-vision` |

### Eksempel: Analyser kun utendørskameraerparated camera IDs to exclude | None |
| `HOME_STATUS_TEST_TIMEOUT` | Timeout per camera analysis (ms) | `30000` |
| `HOME_STATUS_CAMERA_MODEL` | Ollama vision model to use | `llama3.2-vision` |

### Example: Analyze Only Outdoor Cameras
```json
{
  "github.copilot.chat.mcp.servers": {
    "fibaro": {
      "env": {
        "HOME_STATUS_CAMERA_INCLUDE": "87,342,341"
      }
    }
  }-verktøy

### `get_home_status`
Omfattende hjemmestatusrapport med automatisk kameraanalyse.
- **Input:** Ingen
- **Output:** Vær, enheter, sensorer, temperatur og AI-analyse av alle kameraer
- **Bruk når:** Bruker spør om generell hjemmestatus eller sikkerhetsoversikt

### `analyze_camera_snapshot`
Analyser et spesifikt kamera på forespørsel.
- **Input:** 
  - `device_id` (påkrevd): Kamera enhet-ID
  - `prompt` (valgfritt): Tilpasset analyseprompt
  - `model` (valgfritt): Ollama-modellnavn
- **Output:** Detaljert scenebeskrivelse med strukturert data
- **Bruk når:** Bruker spør om et spesifikt kamera eller lokasjon

## Vanlige kamera-IDer
Referanse for typiske kameraposisjoneron with structured data
- **Use when:** User asks about a specific camera or location

## Common Camera IDs
Reference for typical camera locations:
- **87** - Garasjekamera (Garage Camera)
- **176** - Terrassekamera (Terrace Camera)
- **341** - Inngangskamera (Entrance Camera)
- **342** - Hagekamera (Garden Camera)

## Utdataformat

### Strukturert analyse
Hver kameraanalyse inkluderer:
- **Enhet-ID og navn:** Kameraidentifikator
- **Personantall:** Antall personer oppdaget
- **Objekter:** Liste over oppdagede objekter (kjøretøy, møbler, etc.)
- **Vær:** Gjeldende værforhold hvis synlig
- **Tidspunkt:** Estimert tid (morgen, ettermiddag, natt)
- **Råanalyse:** Fullstendig AI-generert beskrivelse

### Eksempel på output
```
Kamera: Garasjekamera (#87)
Status: ✅ Normal
Personer: Ingen oppdaget
Objekter: bil, garasjeport
Vær: snø
Tid: natt
Analyse: Bildet viser et garasjeinteriør om natten. Et mørkt kjøretøy 
er parkert inne. Garasjeporten ser ut til å være lukket. Snø er synlig 
gjennom et vindu. Ingen personer eller uvanlig aktivitet oppdaget.
```

## Feilsøking

### Kameraanalyse timeout
**Problem:** Forespørsel timeout ved analyse av flere kameraer  
**Løsning:** Reduser `HOME_STATUS_CAMERA_CONCURRENCY` til 1 eller øk timeout:
```json
{
  "env": {
    "HOME_STATUS_CAMERA_CONCURRENCY": "1",
    "HOME_STATUS_TEST_TIMEOUT": "60000"
  }
}
```

### Ollama-tilkoblingsfeil
**Problem:** "Could not connect to Ollama"  
**Løsning:** 
1. Verifiser at Ollama kjører: `ps aux | grep ollama`
2. Start om nødvendig: `ollama serve`
3. Sjekk URL: `curl http://localhost:11434/api/tags`

### Kamera offline eller utilgjengelig
**Problem:** "Could not connect to camera"  
**Løsning:**
- Verifiser kamera-IP-adresse i Fibaro-enhetsegenskaper
- Sjekk kameraets strøm og nettverkstilkobling
- Test kamera-URL manuelt: `http://admin:passord@192.168.x.x/image/jpeg.cgi`

### Langsom analyse
**Problem:** Analysen tar 30+ sekunder per kamera  
**Løsning:**
- Normalt for vision-modeller på CPU
- Bruk Apple Silicon eller GPU for raskere resultater
- Vurder mindre modell: `ollama pull llava:7b`
- Analyser færre kameraer med `HOME_STATUS_CAMERA_INCLUDE`

## Sikkerhet og personvern

✅ **100% lokal prosessering**
- All AI-analyse skjer på din lokale maskin
- Ingen bilder lastes opp til eksterne tjenester
- Ingen API-nøkler eller skytjenester påkrevd

✅ **Sikre legitimasjon**
- Kamerapassord lagres kun i VS Code-innstillinger
- Legitimasjon logges aldri eller overføres eksternt
- HTTPS-støtte for kameraforbindelser

✅ **Nettverkspersonvern**
- All trafikk forblir i ditt lokale nettverk
- Ollama kjører lokalt (ingen internett påkrevd)
- MCP-server kommuniserer via stdio (ingen nettverkseksponering)

## Ytelsesinformasjon

- **Første analyse:** 10-30 sekunder (modellinnlasting)
- **Påfølgende analyser:** 5-15 sekunder
- **Minnebruk:** 4-8 GB RAM under analyse
- **Diskplass:** ~8 GB for llama3.2-vision-modell
- **Samtidighet:** 2 kameraer analysert parallelt som standard

## Avansert bruk

### Tilpassede analyseprompts
```
Analyser kamera 87 og fortell meg om garasjeporten er åpen
Sjekk kamera 342 og beskriv hageplantenes tilstand
Se på kamera 341 og tell synlige kjøretøy
```

### Integrasjon med hjemmeautomatisering
```
Sjekk alle kameraer og varsle meg hvis personer oppdages
Analyser utendørskameraer og rapporter værforhold
Overvåk inngangskamera for pakkeleveranser
```

### Planlagt overvåking
```
Gi meg en timerapport fra kameraene de neste 8 timene
Sjekk alle kameraer hver 30. minutt og varsle ved aktivitet
Lag en sikkerhetslogg for natten fra alle kameraer
```

## Relatert dokumentasjon
- [CAMERA_ANALYSIS.md](../../CAMERA_ANALYSIS.md) - Detaljert kameraanalyseoppsett
- [VSCODE_CONFIG.md](../../VSCODE_CONFIG.md) - VS Code MCP-konfigurasjon
- [README.md](../../README.md) - Hovedprosjektdokumentasjon
- [Ollama-dokumentasjon](https://ollama.ai) - Vision-modelldetaljer

## Versjon
- **Skill-versjon:** 1.0.0
- **MCP-serverversjon:** 0.1.0
- **Påkrevd Ollama-versjon:** 0.1.0+
- **Støttede modeller:** llama3.2-vision, llava

## Tagger
`fibaro` `mcp` `kamera` `ai` `vision` `sikkerhet` `overvåking` `ollama` `hjemmeautomatisering` `ip-kamera`
