# Changelog - Scene Enhancement

## Dato: 24. oktober 2025

### Nye funksjoner

#### Utvidet `get_scene` funksjonalitet

MCP-serveren har nå blitt utvidet med betydelig mer detaljert informasjon om scener når du bruker `get_scene` kommandoen.

**Nye felt som vises:**
- `Type` - Scene-type (com.fibaro.blockScene, com.fibaro.luaScene, etc.)
- `Autostart` - Om scenen starter automatisk
- `Run Config` - Kjørekonfigurasjon (TRIGGER_AND_MANUAL, etc.)
- `Running Instances` - Antall kjørende instanser av scenen
- `Visible` - Om scenen er synlig i brukergrensesnittet
- `Is Lua Scene` - Om det er en ren LUA-scene

**Triggers** - Viser alle triggere for scenen:
- Properties - Device properties som trigger scenen
- Globals - Globale variabler som trigger scenen
- Events - Events som trigger scenen
- Weather - Værhendelser som trigger scenen

**Actions** - Viser alle handlinger i scenen:
- Devices - Enheter som påvirkes
- Scenes - Andre scener som startes
- Groups - Grupper som påvirkes

**LUA Code** - Full LUA-kode for scenen formatert med syntax highlighting

### Eksempel på bruk

```
Vis meg detaljer om scene 99
Hva er LUA-koden for "Tidstyrt utelys på"?
Hvilke triggers har tidsstyrt kveldslys-scenen?
```

### Tekniske detaljer

Endringene ble gjort i:
- `fibaro_mcp/server.py` - Utvidet `get_scene` håndteringen
- `README.md` - Oppdatert dokumentasjon
- `EXAMPLES.md` - Lagt til nye eksempler

### Testing

Testet med:
- Scene 99 (Tidstyrt utelys på) - Block scene med tid-trigger
- Scene 87 (Tidsstyrt kveldslys) - LUA scene med solnedgang-trigger

Begge viser nå full informasjon inkludert LUA-kode og triggere.

### Kompatibilitet

Endringene er bakoverkompatible. Serveren kan stoppes og startes på nytt uten å påvirke eksisterende funksjonalitet.
