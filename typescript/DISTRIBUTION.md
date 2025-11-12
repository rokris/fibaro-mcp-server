# Fibaro MCP Server - Distribution Package

This package contains everything needed to run the Fibaro MCP Server.

## Contents

- `dist/` - Compiled JavaScript files
- `node_modules/` - Required dependencies
- `package.json` - Package configuration
- `README.md` - Documentation
- `VSCODE_CONFIG.md` - VS Code setup

## Quick Start

1. **Configure with VS Code (Recommended):**
   - All konfigurasjon skjer via `~/.vscode/mcp.json`
   - Se VSCODE_CONFIG.md for detaljert oppsett

2. **Install dependencies (if not included):**
   ```bash
   npm install --production
   ```

3. **Test the server:**
   ```bash
   node dist/index.js
   ```

4. **Configure with VS Code:**
   - For VS Code: See VSCODE_CONFIG.md

## Configuration

All konfigurasjon skjer via `~/.vscode/mcp.json`. Dette prosjektet bruker ikke `.env`-filer.

Se VSCODE_CONFIG.md for detaljert konfigurering.

## Support

For issues and questions, visit:
https://github.com/rokris/fibaro-mcp-server/issues
