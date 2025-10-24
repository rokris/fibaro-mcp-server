# Fibaro MCP Server - Distribution Package

This package contains everything needed to run the Fibaro MCP Server.

## Contents

- `dist/` - Compiled JavaScript files
- `node_modules/` - Required dependencies
- `package.json` - Package configuration
- `.env.example` - Configuration template
- `README.md` - Documentation
- `CLAUDE_CONFIG.md` - Claude Desktop setup
- `VSCODE_CONFIG.md` - VS Code setup

## Quick Start

1. **Configure your Fibaro Home Center:**
   ```bash
   cp .env.example .env
   # Edit .env with your Fibaro HC2 details
   ```

2. **Install dependencies (if not included):**
   ```bash
   npm install --production
   ```

3. **Test the server:**
   ```bash
   node dist/index.js
   ```

4. **Configure with Claude Desktop or VS Code:**
   - For Claude Desktop: See CLAUDE_CONFIG.md
   - For VS Code: See VSCODE_CONFIG.md

## Configuration

Edit `.env` file with your settings:

```bash
FIBARO_URL=http://192.168.1.100
FIBARO_USERNAME=admin
FIBARO_PASSWORD=your_password
```

## Support

For issues and questions, visit:
https://github.com/rokris/fibaro-mcp-server/issues
