# Camera Analysis with Ollama Vision

The Fibaro MCP server now includes integrated AI vision analysis for IP cameras using local Ollama models.

## Features

- 🎥 Capture snapshots from Fibaro IP cameras
- 🤖 Analyze images using local Ollama vision models
- 🔒 Completely private - no data sent to external services
- 💰 No API costs - runs entirely locally

## Prerequisites

1. **Ollama installed and running**
   ```bash
   # Install Ollama (if not already installed)
   # Visit: https://ollama.ai
   
   # Start Ollama service
   ollama serve
   ```

2. **Vision model installed**
   ```bash
   # Install llama3.2-vision (recommended)
   ollama pull llama3.2-vision
   
   # Or install llava (alternative)
   ollama pull llava
   ```

## Usage

### Via MCP Tool

The `analyze_camera_snapshot` tool is available in the Fibaro MCP server:

**Parameters:**
- `device_id` (required): The camera device ID from your Fibaro system
- `prompt` (optional): Custom prompt for the vision model
- `model` (optional): Ollama model name (default: `llama3.2-vision`)

**Example queries:**
- "Analyze camera 87" (Garasjekamera)
- "What do you see on camera 342?" (Hagekamera)
- "Check camera 176 for any people" (Terrassekamera)
- "Describe the scene at camera 341" (Inngangskamera)

### Via Standalone Script

You can also use the standalone Python script directly:

```bash
# Basic analysis
python analyze_camera_with_ollama.py snapshot.jpg

# Custom prompt
python analyze_camera_with_ollama.py snapshot.jpg -p "Are there any people in this image?"

# Different model
python analyze_camera_with_ollama.py snapshot.jpg -m llava

# Check Ollama status
python analyze_camera_with_ollama.py --check-status
```

## Configuration

### Ollama URL

The default Ollama URL is `http://localhost:11434`. If you need to use a different URL, you can modify it in the `server.py` file.

### Camera Requirements

The camera device must have the following properties configured in Fibaro:
- `ip`: Camera IP address
- `jpgPath`: Path to JPEG snapshot endpoint (default: `/image/jpeg.cgi`)
- `username`: Camera username (default: `admin`)
- `password`: Camera password
- `httpsEnabled`: Whether to use HTTPS (default: `false`)

## Supported Camera Types

- `com.fibaro.IPCameraDLinkDCS932L`
- `com.fibaro.ipCamera`
- Any Fibaro camera device with snapshot capability

## Examples

### Example 1: Check for visitors

```
User: "Check the entrance camera for any visitors"
AI: [Fetches snapshot from camera 341, analyzes with Ollama]
     "Camera Analysis shows the entrance area with good lighting.
     No people visible. The path is clear with some landscaping
     visible on both sides..."
```

### Example 2: Weather assessment

```
User: "What's the weather like according to the garden camera?"
AI: [Analyzes camera 342]
     "The image shows an overcast November day with gray skies.
     Autumn foliage is visible with reddish-brown bushes. No
     precipitation visible. Temperature appears cool based on
     the lighting conditions..."
```

### Example 3: Security check

```
User: "Check all cameras for any unusual activity"
AI: [Analyzes all camera devices sequentially]
     "Camera 87 (Garage): Normal, no activity detected...
      Camera 176 (Terrace): Clear view, no movement...
      Camera 341 (Entrance): Pathway clear, no visitors...
      Camera 342 (Garden): Peaceful scene, no unusual activity..."
```

## Troubleshooting

### Error: "Could not connect to Ollama"
- Ensure Ollama is running: `ollama serve`
- Verify Ollama is accessible at `http://localhost:11434`
- Verify the port is not blocked by firewall

### Error: "Model not found"
- Install the required model: `ollama pull llama3.2-vision`
- Check available models: `ollama list`

### Error: "Could not connect to camera"
- Verify camera IP address is correct
- Check camera credentials (username/password)
- Ensure camera is powered on and connected to network
- Test camera URL manually in browser

### Slow analysis
- Vision models require significant computation
- First run may take longer while model loads into memory
- Consider using a smaller model like `llava:7b` for faster results
- Ensure your system meets Ollama's requirements

## Performance

- **Model size**: llama3.2-vision (~7.8 GB)
- **Analysis time**: 5-30 seconds depending on hardware
- **Memory usage**: 4-8 GB RAM during analysis
- **Best for**: Systems with dedicated GPU or Apple Silicon

## Privacy & Security

✅ All processing happens locally on your machine  
✅ No images sent to external services  
✅ No API keys or cloud services required  
✅ Complete control over your camera data  

## Advanced Usage

### Custom Prompts

Tailor the analysis to specific needs:

```python
# Look for specific objects
"Is there a car parked in the driveway?"

# Count items
"How many people are visible in this image?"

# Describe specific areas
"Describe the condition of the garden plants"

# Safety checks
"Is the gate open or closed?"

# Time-based questions
"Based on the lighting, what time of day does this appear to be?"
```

## Integration Examples

### Automation Script

```python
import asyncio
from fibaro_mcp.fibaro_client import FibaroClient

async def check_all_cameras():
    client = FibaroClient(...)
    cameras = [87, 176, 341, 342]  # Camera device IDs
    
    for camera_id in cameras:
        # Use analyze_camera_snapshot tool
        result = await analyze_camera(camera_id)
        print(f"Camera {camera_id}: {result}")

asyncio.run(check_all_cameras())
```

### Scheduled Monitoring

Add to your Fibaro scenes or external scheduler to periodically analyze cameras and send notifications if unusual activity is detected.

## Future Enhancements

Planned features:
- [ ] Motion detection comparison between snapshots
- [ ] Automatic alert generation for detected people/vehicles
- [ ] Integration with Fibaro notification system
- [ ] Multi-camera comparison analysis
- [ ] Historical snapshot storage and comparison

## Credits

- Vision AI: [Ollama](https://ollama.ai)
- Models: Llama 3.2 Vision, LLaVA
- MCP Server: Fibaro Home Center 2 MCP Integration
