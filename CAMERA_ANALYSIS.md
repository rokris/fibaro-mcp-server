# Camera Analysis with Ollama Vision

The Fibaro MCP server includes integrated AI vision analysis for IP cameras using local Ollama models.

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

3. **Fibaro MCP Server configured**
   - See [VSCODE_CONFIG.md](VSCODE_CONFIG.md) for setup
   - Ensure server is running with proper camera credentials

## Usage

### 1. Automatic Analysis in `get_home_status`

The `get_home_status` tool now automatically includes AI analysis of your cameras. When you ask "Hvordan står det til hjemme?", the server will:

1.  Fetch weather and device status from Fibaro.
2.  Identify available cameras.
3.  Filter cameras based on your configuration (see below).
4.  Analyze snapshots from each camera using Ollama (concurrently).
5.  Return a comprehensive status report including visual descriptions.

### 2. Manual Analysis via `analyze_camera_snapshot`

You can also analyze specific cameras on demand:

**Parameters:**
- `device_id` (required): The camera device ID from your Fibaro system
- `prompt` (optional): Custom prompt for the vision model
- `model` (optional): Ollama model name (default: `llama3.2-vision`)

**Example queries in Copilot:**
- "Analyze camera 87" (Garasjekamera)
- "What do you see on camera 342?" (Hagekamera)
- "Check camera 176 for any people" (Terrassekamera)

## Configuration

You can fine-tune the camera analysis behavior using environment variables in your MCP configuration:

| Variable | Description | Default |
|----------|-------------|---------|
| `OLLAMA_URL` | URL to your local Ollama instance | `http://localhost:11434` |
| `HOME_STATUS_CAMERA_CONCURRENCY` | Number of cameras to analyze in parallel. Lower this if you experience timeouts. | `2` |
| `HOME_STATUS_CAMERA_INCLUDE` | Comma-separated list of camera IDs to include. If set, ONLY these cameras are analyzed. | (All enabled cameras) |
| `HOME_STATUS_CAMERA_EXCLUDE` | Comma-separated list of camera IDs to skip. | (None) |
| `HOME_STATUS_TEST_TIMEOUT` | Timeout (in ms) for each camera analysis request. | `30000` |

### Robustness & Error Handling

- **Dynamic Filtering:** The server automatically skips cameras that are marked as `dead` (offline) or disabled in Fibaro.
- **Concurrency Control:** To prevent overloading your local Ollama instance, requests are queued and processed in batches (controlled by `HOME_STATUS_CAMERA_CONCURRENCY`).
- **Graceful Degradation:** If a camera fails to analyze (timeout or error), it is skipped, and the rest of the home status report is returned without interruption. The error will be noted in the response.
- "Describe the scene at camera 341" (Inngangskamera)

### Via Standalone Test Script

You can test camera analysis directly:

```bash
cd typescript
node test-camera.js
```

## Configuration

### Ollama URL

The default Ollama URL is `http://localhost:11434`. This is configured in the TypeScript server code.

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
Copilot: [Fetches snapshot from camera 341, analyzes with Ollama]
         "Camera Analysis shows the entrance area with good lighting.
         No people visible. The path is clear with some landscaping
         visible on both sides..."
```

### Example 2: Weather assessment

```
User: "What's the weather like according to the garden camera?"
Copilot: [Analyzes camera 342]
         "The image shows an overcast November day with gray skies.
         Autumn foliage is visible with reddish-brown bushes. No
         precipitation visible. Temperature appears cool based on
         the lighting conditions..."
```

### Example 3: Security check

```
User: "Check all cameras for any unusual activity"
Copilot: [Analyzes all camera devices sequentially]
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

- "Is there a car parked in the driveway?"
- "How many people are visible in this image?"
- "Describe the condition of the garden plants"
- "Is the gate open or closed?"
- "Based on the lighting, what time of day does this appear to be?"

### Integration with TypeScript/Node.js

```typescript
import axios from 'axios';

async function analyzeCameraSnapshot(
  cameraUrl: string,
  username: string,
  password: string,
  prompt: string = "Describe this image in detail"
): Promise<string> {
  // Fetch snapshot
  const snapshotResponse = await axios.get(cameraUrl, {
    auth: { username, password },
    responseType: 'arraybuffer'
  });
  
  const base64Image = Buffer.from(snapshotResponse.data).toString('base64');
  
  // Send to Ollama
  const ollamaResponse = await axios.post('http://localhost:11434/api/generate', {
    model: 'llama3.2-vision',
    prompt: prompt,
    images: [base64Image],
    stream: false
  });
  
  return ollamaResponse.data.response;
}
```

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
