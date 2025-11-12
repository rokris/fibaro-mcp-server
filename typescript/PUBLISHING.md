# Fibaro MCP Server - Publishing Guide

## Distribution Options

### Option 1: npm Publishing (Recommended)

1. **Login to npm:**
   ```bash
   npm login
   ```

2. **Test package before publishing:**
   ```bash
   npm pack
   # This creates fibaro-mcp-server-1.0.0.tgz
   ```

3. **Publish to npm:**
   ```bash
   npm publish
   ```

4. **Users can then install with:**
   ```bash
   npm install -g fibaro-mcp-server
   # or use with npx
   npx fibaro-mcp-server
   ```

### Option 2: Manual Distribution

Use the pre-built packages:
- `fibaro-mcp-server-dist.tar.gz` (3.1 MB) - For macOS/Linux
- `fibaro-mcp-server-dist.zip` (4.3 MB) - For Windows

Share these files with users, who can then:
1. Extract the archive
2. Configure via `~/.vscode/mcp.json` (see VSCODE_CONFIG.md)
3. Run `node dist/index.js`

### Option 3: GitHub Releases

1. **Create a GitHub release:**
   - Tag: v1.0.0
   - Attach both .tar.gz and .zip files
   
2. **Users can install from GitHub:**
   ```bash
   npm install -g rokris/fibaro-mcp-server
   ```

## Files Prepared for Distribution

✅ **package.json** - Updated with:
  - Version 1.0.0
  - Complete metadata (author, repository, keywords)
  - `bin` entry for CLI usage
  - `files` field to include only necessary files
  - `prepublishOnly` script for automatic building

✅ **.npmignore** - Excludes:
  - Source TypeScript files
  - Development files
  - Test files
  - Editor configurations

✅ **.env.example** - Configuration template for users

✅ **Distribution packages:**
  - fibaro-mcp-server-dist.tar.gz
  - fibaro-mcp-server-dist.zip

## Testing Before Publishing

Test the package locally:

```bash
# Test npm pack
npm pack
npm install -g ./fibaro-mcp-server-1.0.0.tgz

# Test the distribution package
cd fibaro-mcp-server-dist
cp .env.example .env
# Edit .env
node dist/index.js
```

## Publishing Checklist

- [ ] Update version in package.json
- [ ] Test locally with `npm pack`
- [ ] Test installation: `npm install -g ./fibaro-mcp-server-X.X.X.tgz`
- [ ] Verify bin script works: `fibaro-mcp-server`
- [ ] Update README.md with installation instructions
- [ ] Commit all changes
- [ ] Create git tag: `git tag v1.0.0`
- [ ] Push with tags: `git push --tags`
- [ ] Publish to npm: `npm publish`
- [ ] Create GitHub release with distribution packages

## Version Management

Update version using npm:
```bash
npm version patch  # 1.0.0 -> 1.0.1
npm version minor  # 1.0.0 -> 1.1.0
npm version major  # 1.0.0 -> 2.0.0
```

This automatically:
- Updates package.json
- Creates a git commit
- Creates a git tag
