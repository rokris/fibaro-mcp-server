#!/bin/bash

# Fibaro MCP Server - Create Distribution Package
# This script creates a ready-to-use distribution package

set -e

DIST_DIR="fibaro-mcp-server-dist"
VERSION=$(node -p "require('./package.json').version")

echo "Creating distribution package v${VERSION}..."

# Clean old distribution
rm -rf "${DIST_DIR}" "${DIST_DIR}.tar.gz"

# Create distribution directory
mkdir -p "${DIST_DIR}"

# Copy necessary files
echo "Copying files..."
cp -r dist "${DIST_DIR}/"
cp package.json "${DIST_DIR}/"
cp .env.example "${DIST_DIR}/"
cp README.md "${DIST_DIR}/" 2>/dev/null || true
cp CLAUDE_CONFIG.md "${DIST_DIR}/" 2>/dev/null || true
cp VSCODE_CONFIG.md "${DIST_DIR}/" 2>/dev/null || true
cp DISTRIBUTION.md "${DIST_DIR}/README.md"

# Install production dependencies
echo "Installing production dependencies..."
cd "${DIST_DIR}"
npm install --production --silent
cd ..

# Create tarball
echo "Creating tarball..."
tar -czf "${DIST_DIR}.tar.gz" "${DIST_DIR}"

# Create zip for Windows users
echo "Creating zip file..."
zip -r -q "${DIST_DIR}.zip" "${DIST_DIR}"

# Show results
echo ""
echo "✅ Distribution packages created:"
echo "   - ${DIST_DIR}.tar.gz ($(du -h "${DIST_DIR}.tar.gz" | cut -f1))"
echo "   - ${DIST_DIR}.zip ($(du -h "${DIST_DIR}.zip" | cut -f1))"
echo ""
echo "📦 Distribution folder: ${DIST_DIR}/"
echo ""
echo "To test:"
echo "   cd ${DIST_DIR}"
echo "   cp .env.example .env"
echo "   # Edit .env with your settings"
echo "   node dist/index.js"
