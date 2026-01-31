#!/usr/bin/env node

/**
 * Fibaro Home Center 2 MCP Server
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import dotenv from 'dotenv';
import axios from 'axios';
import { createRequire } from 'module';
import { FibaroClient, FibaroDevice, FibaroIcon, FibaroIconsResponse } from './fibaro-client.js';

const require = createRequire(import.meta.url);
const pkg = require('../package.json');

// Load environment variables
dotenv.config();

// Check for version flag
if (process.argv.includes('--version') || process.argv.includes('-v')) {
  console.log(pkg.version);
  process.exit(0);
}

// Get configuration from environment
const fibaroUrl = process.env.FIBARO_URL || process.env.FIBARO_HOST || '';
const fibaroUsername = process.env.FIBARO_USERNAME || '';
const fibaroPassword = process.env.FIBARO_PASSWORD || '';
const useHttps = process.env.FIBARO_USE_HTTPS === 'true';

// Parse URL to extract host and protocol if FIBARO_URL is provided
let host = fibaroUrl;
let https = useHttps;

if (fibaroUrl.startsWith('http://') || fibaroUrl.startsWith('https://')) {
  https = fibaroUrl.startsWith('https://');
  host = fibaroUrl.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
}

// Initialize Fibaro client
const fibaroClient = new FibaroClient(
  host,
  fibaroUsername,
  fibaroPassword,
  https,
  30000
);

// Initialize MCP server
const server = new Server(
  {
    name: 'fibaro-home-center',
    version: '0.1.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Define tools
const tools: any[] = [
  // Device tools
  {
    name: 'list_devices',
    description: 'List all devices in the Fibaro Home Center system',
    inputSchema: {
      type: 'object',
      properties: {},
    },
    outputSchema: {
      type: 'object',
      properties: {
        devices: {
          type: 'array',
          items: {
    outputSchema: {
      type: 'object',
      properties: {
        device: { type: 'object' },
        deviceCategory: { type: 'string' },
        iconSetName: { type: ['string', 'null'] },
        actions: { type: 'array' },
      },
    },
    examples: [
      {
        input: { device_id: 42 },
        output: { device: { id: 42, name: 'Entrance Camera' }, deviceCategory: 'camera', iconSetName: 'camera' },
      },
    ],
            type: 'object',
            properties: {
              id: { type: 'number' },
              name: { type: 'string' },
              type: { type: 'string' },
              roomID: { type: 'number' },
            },
          },
        },
      },
    },
    examples: [
      {
        input: {},
        output: { devices: [{ id: 1, name: 'Lamp', type: 'com.fibaro.FGSwitch', roomID: 2 }] },
      },
    ],
  },
  {
    name: 'get_device',
    description: 'Get detailed information about a specific device',
    inputSchema: {
      type: 'object',
      properties: {
        device_id: {
          type: 'number',
          description: 'The device ID',
        },
      },
      required: ['device_id'],
    },
    outputSchema: {
      type: 'object',
      properties: {
        device: {
          type: 'object',
        },
      },
    },
    examples: [
      {
        input: { device_id: 42 },
        output: { device: { id: 42, name: 'Entrance Camera', type: 'com.fibaro.IPCamera', roomID: 1 } },
      },
    ],
  },
  {
    name: 'control_device',
    description: 'Control a device (turn on/off, set value, etc.)',
    inputSchema: {
      type: 'object',
      properties: {
        device_id: {
          type: 'number',
          description: 'The device ID',
        },
        action: {
          type: 'string',
          description: "Action to perform (e.g., 'turnOn', 'turnOff', 'setValue')",
        },
        args: {
          type: 'array',
          description: 'Optional arguments for the action',
          items: {
            type: 'string',
          },
        },
      },
      required: ['device_id', 'action'],
    },
  },
  // Room tools
  {
    name: 'list_rooms',
    description: 'List all rooms in the Fibaro Home Center system',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_room',
    description: 'Get detailed information about a specific room',
    inputSchema: {
      type: 'object',
      properties: {
        room_id: {
          type: 'number',
          description: 'The room ID',
        },
      },
      required: ['room_id'],
    },
  },
  {
    name: 'get_room_devices',
    description: 'Get all devices in a specific room',
    inputSchema: {
      type: 'object',
      properties: {
        room_id: {
          type: 'number',
          description: 'The room ID',
        },
      },
      required: ['room_id'],
    },
  },
  // Scene tools
  {
    name: 'list_scenes',
    description: 'List all scenes in the Fibaro Home Center system',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_scene',
    description: 'Get detailed information about a specific scene',
    inputSchema: {
      type: 'object',
      properties: {
        scene_id: {
          type: 'number',
          description: 'The scene ID',
        },
      },
      required: ['scene_id'],
    },
  },
  {
    name: 'trigger_scene',
    description: 'Trigger/execute a scene',
    inputSchema: {
      type: 'object',
      properties: {
        scene_id: {
          type: 'number',
          description: 'The scene ID to trigger',
        },
      },
      required: ['scene_id'],
    },
  },
  // System tools
  {
    name: 'get_system_info',
    description: 'Get Fibaro Home Center system information',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_icons',
    description: 'Get list of available icons from Fibaro',
    inputSchema: { type: 'object', properties: {} },
    outputSchema: { type: 'object', properties: { icons: { type: 'array' } } },
    examples: [{ input: {}, output: { icons: [{ id: 1, name: 'light' }] } }],
  },
  {
    name: 'get_weather',
    description: 'Get weather information from Fibaro system',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_consumption',
    description: 'Get consumption reports/data',
    inputSchema: { type: 'object', properties: {} },
    outputSchema: { type: 'object', properties: { consumption: { type: 'object' } } },
    examples: [{ input: {}, output: { consumption: { total: 123 } } }],
  },
  {
    name: 'get_ios_devices',
    description: 'Get iOS devices registered in the system',
    inputSchema: { type: 'object', properties: {} },
    outputSchema: { type: 'object', properties: { iosDevices: { type: 'array' } } },
    examples: [{ input: {}, output: { iosDevices: [{ id: 1, name: 'iPhone' }] } }],
  },
  {
    name: 'get_rgb_programs',
    description: 'Get RGB lighting programs',
    inputSchema: { type: 'object', properties: {} },
    outputSchema: { type: 'object', properties: { programs: { type: 'array' } } },
    examples: [{ input: {}, output: { programs: [{ id: 1, name: 'Evening' }] } }],
  },
  {
    name: 'get_tracking_schedules',
    description: 'Get tracking schedules',
    inputSchema: { type: 'object', properties: {} },
    outputSchema: { type: 'object', properties: { schedules: { type: 'array' } } },
    examples: [{ input: {}, output: { schedules: [{ id: 1, name: 'Weekly' }] } }],
  },
  {
    name: 'discover_device',
    description: 'Return capability summary for a deviceId to help agents decide actions',
    inputSchema: {
      type: 'object',
      properties: { device_id: { type: 'number' } },
      required: ['device_id'],
    },
    outputSchema: {
      type: 'object',
      properties: {
        deviceId: { type: 'number' },
        deviceCategory: { type: 'string' },
        supportsActions: { type: 'array' },
        snapshotCapable: { type: 'boolean' },
        energyCapable: { type: 'boolean' },
        hasTemperature: { type: 'boolean' },
      },
    },
    examples: [
      { input: { device_id: 341 }, output: { deviceId: 341, deviceCategory: 'camera', supportsActions: ['start'], snapshotCapable: true } },
    ],
  },
  {
    name: 'get_location',
    description: 'Get location information from Fibaro system',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_diagnostics',
    description: 'Get system diagnostics from Fibaro system',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'list_users',
    description: 'List all users in Fibaro system',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_user',
    description: 'Get a specific user by ID',
    inputSchema: {
      type: 'object',
      properties: {
        user_id: {
          type: 'number',
          description: 'User ID',
        },
      },
      required: ['user_id'],
    },
  },
  {
    name: 'list_sections',
    description: 'List all sections in Fibaro system',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_section',
    description: 'Get a specific section by ID',
    inputSchema: {
      type: 'object',
      properties: {
        section_id: {
          type: 'number',
          description: 'Section ID',
        },
      },
      required: ['section_id'],
    },
  },
  {
    name: 'get_energy',
    description: 'Get energy consumption for rooms or devices',
    inputSchema: {
      type: 'object',
      properties: {
        type: {
          type: 'string',
          description: 'Type: rooms or devices',
        },
        id: {
          type: 'number',
          description: 'ID of room or device',
        },
      },
      required: ['type', 'id'],
    },
  },
  {
    name: 'get_temperature_panel',
    description: 'Get temperature data for rooms or devices',
    inputSchema: {
      type: 'object',
      properties: {
        type: {
          type: 'string',
          description: 'Type: rooms or devices',
        },
        method: {
          type: 'string',
          description: 'Method: single or compare',
        },
        id: {
          type: 'number',
          description: 'ID of room or device',
        },
      },
      required: ['type', 'method', 'id'],
    },
  },
  // Global variables tools
  {
    name: 'list_global_variables',
    description: 'List all global variables',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_global_variable',
    description: 'Get a specific global variable',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Variable name',
        },
      },
      required: ['name'],
    },
  },
  {
    name: 'set_global_variable',
    description: 'Set a global variable value',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Variable name',
        },
        value: {
          type: 'string',
          description: 'Variable value',
        },
      },
      required: ['name', 'value'],
    },
  },
  // Camera analysis tool
  {
    name: 'analyze_camera_snapshot',
    description:
      'Capture a snapshot from a Fibaro IP camera and analyze it using local Ollama vision AI. Returns detailed description of what\'s visible in the image including people, objects, landscape, time of day, and weather conditions.',
    inputSchema: {
      type: 'object',
      properties: {
        device_id: {
          type: 'number',
          description: 'The camera device ID',
        },
        prompt: {
          type: 'string',
          description:
            'Optional custom prompt for the vision model (default: detailed scene description)',
        },
        model: {
          type: 'string',
          description: 'Ollama model to use (default: llama3.2-vision)',
        },
      },
      required: ['device_id'],
    },
    outputSchema: {
      type: 'object',
      properties: {
        deviceId: { type: 'number' },
        deviceName: { type: 'string' },
        model: { type: 'string' },
        cameraIP: { type: 'string' },
        peopleCount: { type: 'number' },
        people: { type: 'array' },
        objects: { type: 'array' },
        timeOfDay: { type: ['string', 'null'] },
        weather: { type: ['string', 'null'] },
        confidence: { type: ['number', 'null'] },
        rawAnalysisText: { type: 'string' },
      },
    },
    examples: [
      {
        input: { device_id: 341, prompt: 'Check the entrance camera for visitors' },
        output: { deviceId: 341, deviceName: 'Entrance', model: 'llama3.2-vision', peopleCount: 0, people: [], objects: [], rawAnalysisText: 'No people visible.' },
      },
    ],
  },
  {
    name: 'get_home_status',
    description: 'Get a summary of the home status including active devices, breached sensors, weather, and camera analyses.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
];

// Helper to build structured JSON response content
// Build structured content for tool results. Return the object that will be
// placed in the `structuredContent` field of a CallToolResult.
function buildJsonContent(data: any, code = 'OK') {
  return {
    success: code === 'OK',
    code,
    data,
  };
}

// Helper to build structured error responses
function buildErrorContent(message: string, code = 'ERROR') {
  return {
    success: false,
    code,
    message,
  };
}

// Simple heuristic parser to extract basic facts from Ollama free-text analysis
function parseCameraAnalysis(text: string) {
  const lower = (text || '').toLowerCase();
  const result: any = {
    peopleCount: null,
    people: [],
    objects: [],
    timeOfDay: null,
    weather: null,
  };

  // People count
  const peopleMatch = lower.match(/(\d+)\s+people|(\d+)\s+persons|(\d+)\s+people\b/);
  if (peopleMatch) {
    const num = Number(peopleMatch[1] || peopleMatch[2] || peopleMatch[3]);
    if (!Number.isNaN(num)) result.peopleCount = num;
  } else if (/no\s+(people|persons|person)\b/.test(lower) || /nobody|no one\b/.test(lower)) {
    result.peopleCount = 0;
  }

  // Common objects
  const objectKeywords = ['car', 'vehicle', 'bicycle', 'dog', 'cat', 'gate', 'person', 'people', 'truck', 'bike'];
  objectKeywords.forEach((kw) => {
    if (new RegExp(`\\b${kw}\\b`).test(lower)) {
      result.objects.push(kw);
    }
  });

  // Time of day heuristics
  if (/morning|dawn|sunrise/.test(lower)) result.timeOfDay = 'morning';
  else if (/afternoon|midday|noon/.test(lower)) result.timeOfDay = 'afternoon';
  else if (/evening|dusk|sunset/.test(lower)) result.timeOfDay = 'evening';
  else if (/night|dark/.test(lower)) result.timeOfDay = 'night';

  // Weather heuristics
  if (/rain|raining|wet|drizzle/.test(lower)) result.weather = 'rain';
  else if (/snow|snowing/.test(lower)) result.weather = 'snow';
  else if (/sunny|clear/.test(lower)) result.weather = 'clear';
  else if (/cloud|overcast|cloudy/.test(lower)) result.weather = 'cloudy';

  // Remove duplicates
  result.objects = Array.from(new Set(result.objects));

  return result;
}

class CameraAnalysisError extends Error {
  code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = 'CameraAnalysisError';
    this.code = code;
  }
}

interface CameraAnalysisData {
  deviceId: number;
  deviceName: string;
  model: string;
  cameraIP: string;
  peopleCount: number;
  people: string[];
  objects: string[];
  timeOfDay: string | null;
  weather: string | null;
  confidence: number | null;
  rawAnalysisText: string;
}

interface CameraAnalysisEntry {
  success: boolean;
  code: string;
  data: Partial<CameraAnalysisData> & { deviceId: number; deviceName: string };
  message?: string;
}

function parseIdList(value?: string | null) {
  if (!value) return null;
  const ids = value
    .split(',')
    .map((part) => Number(part.trim()))
    .filter((num) => !Number.isNaN(num));
  return ids.length > 0 ? new Set(ids) : null;
}

function isCameraDevice(device: FibaroDevice) {
  const type = (device.type || '').toLowerCase();
  return type.includes('camera');
}

function cameraSkipReason(
  device: FibaroDevice,
  includeSet: Set<number> | null,
  excludeSet: Set<number> | null
): string | null {
  if (includeSet && !includeSet.has(device.id)) {
    return 'Camera not in HOME_STATUS_CAMERA_INCLUDE list';
  }
  if (excludeSet && excludeSet.has(device.id)) {
    return 'Camera excluded via HOME_STATUS_CAMERA_EXCLUDE';
  }
  if (device.enabled === false) {
    return 'Camera device is disabled in Fibaro';
  }
  if (device.visible === false) {
    return 'Camera device is hidden in Fibaro';
  }
  const props = device.properties || {};
  if (!props.ip) {
    return 'Camera lacks an IP address configuration';
  }
  const deadValue = String(props.dead ?? '').toLowerCase();
  if (deadValue === 'true' || deadValue === '1') {
    return 'Camera is reported as dead/offline by Fibaro';
  }
  return null;
}

async function analyzeCameraDevicesWithConcurrency(
  devices: FibaroDevice[],
  options: { prompt: string; model: string; ollamaUrl: string },
  concurrency: number
): Promise<CameraAnalysisEntry[]> {
  const normalizedConcurrency = Math.max(1, Math.min(concurrency, devices.length || 1));
  const results: CameraAnalysisEntry[] = [];
  let index = 0;

  async function worker() {
    while (true) {
      const currentIndex = index++;
      if (currentIndex >= devices.length) {
        return;
      }
      const device = devices[currentIndex];

      try {
        const { structured } = await analyzeCameraDevice(device, options);
        results.push({ success: true, code: 'OK', data: structured });
      } catch (error: any) {
        if (error instanceof CameraAnalysisError) {
          results.push({
            success: false,
            code: error.code,
            message: error.message,
            data: { deviceId: device.id, deviceName: device.name },
          });
        } else {
          results.push({
            success: false,
            code: 'UNKNOWN_CAMERA_ERROR',
            message: error?.message || String(error),
            data: { deviceId: device.id, deviceName: device.name },
          });
        }
      }
    }
  }

  const workerCount = Math.min(normalizedConcurrency, devices.length || 1);
  const workers = Array.from({ length: workerCount }, () => worker());
  await Promise.all(workers);

  return results;
}

async function analyzeCameraDevice(
  device: FibaroDevice,
  options: { prompt: string; model: string; ollamaUrl: string }
): Promise<{ structured: CameraAnalysisData; rawText: string }> {
  const { prompt, model, ollamaUrl } = options;
  const cameraType = (device.type || '').toLowerCase();

  if (!cameraType.includes('camera')) {
    throw new CameraAnalysisError(
      'NOT_A_CAMERA',
      `Device ${device.id} is not a camera (type: ${device.type || 'unknown'})`
    );
  }

  const properties = device.properties || {};
  const ip = properties.ip || '';
  let jpgPath = properties.jpgPath || '/image/jpeg.cgi';

  if (!ip) {
    throw new CameraAnalysisError(
      'NO_CAMERA_IP',
      `Camera device ${device.id} has no IP address configured`
    );
  }

  if (!jpgPath.startsWith('/')) {
    jpgPath = '/' + jpgPath;
  }

  const username = properties.username || 'admin';
  const password = properties.password || '';
  const useHttps = (properties.httpsEnabled || 'false').toLowerCase() === 'true';
  const protocol = useHttps ? 'https' : 'http';
  const maskedPassword = '*'.repeat(password.length);
  const cameraUrl = `${protocol}://${username}:${password}@${ip}${jpgPath}`;
  const maskedCameraUrl = `${protocol}://${username}:${maskedPassword}@${ip}${jpgPath}`;

  console.error(`Camera ${device.id} properties IP=${ip}`);
  console.error(`Fetching snapshot from camera ${device.id} at ${ip}...`);
  console.error(`Camera URL: ${maskedCameraUrl}`);
  console.error(`Ollama URL: ${ollamaUrl}`);

  // Retry logic for snapshot fetching
  let snapshotResponse;
  const maxRetries = 3;
  let lastError: any;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.error(`Snapshot attempt ${attempt}/${maxRetries} for camera ${device.id}...`);
      snapshotResponse = await axios.get(cameraUrl, {
        responseType: 'arraybuffer',
        timeout: 30000, // Increased from 10s to 30s
      });
      console.error(`Snapshot successfully fetched for camera ${device.id}`);
      break; // Success, exit retry loop
    } catch (error: any) {
      lastError = error;
      console.error(`Snapshot attempt ${attempt} failed for camera ${device.id}: ${error?.message}`);
      
      if (error?.code === 'ECONNREFUSED') {
        // Don't retry connection refused errors
        throw new CameraAnalysisError(
          'CAMERA_CONNECT_ERROR',
          `Could not connect to camera ${device.id} at ${ip}. ${error.message || ''}`.trim()
        );
      }
      
      if (attempt < maxRetries) {
        // Exponential backoff: 2s, 4s, 8s
        const delayMs = Math.pow(2, attempt) * 1000;
        console.error(`Waiting ${delayMs}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
  }
  
  if (!snapshotResponse) {
    if (lastError?.code === 'ETIMEDOUT') {
      throw new CameraAnalysisError(
        'TIMEOUT',
        `Camera snapshot request timed out after ${maxRetries} attempts.`
      );
    }
    throw new CameraAnalysisError(
      'CAMERA_SNAPSHOT_ERROR',
      `Failed to fetch snapshot from camera ${device.id} after ${maxRetries} attempts: ${lastError?.message || String(lastError)}`
    );
  }

  const imageBase64 = Buffer.from(snapshotResponse.data).toString('base64');

  console.error(`Snapshot captured, analyzing with Ollama...`);

  const ollamaPayload = {
    model,
    prompt,
    images: [imageBase64],
    stream: false,
  };

  // Retry logic for Ollama analysis
  let ollamaResponse;
  const maxOllamaRetries = 2;
  let lastOllamaError: any;
  
  for (let attempt = 1; attempt <= maxOllamaRetries; attempt++) {
    try {
      console.error(`Ollama analysis attempt ${attempt}/${maxOllamaRetries} for camera ${device.id}...`);
      ollamaResponse = await axios.post(`${ollamaUrl}/api/generate`, ollamaPayload, {
        timeout: 180000, // Increased from 120s to 180s (3 minutes)
      });
      console.error(`Ollama analysis completed for camera ${device.id}`);
      break; // Success, exit retry loop
    } catch (error: any) {
      lastOllamaError = error;
      const message = error?.message || String(error);
      console.error(`Ollama attempt ${attempt} failed for camera ${device.id}: ${message}`);
      
      // Don't retry connection errors
      if (error?.code === 'ECONNREFUSED' || message.includes('ECONNREFUSED')) {
        throw new CameraAnalysisError(
          'OLLAMA_UNAVAILABLE',
          `Could not connect to Ollama at ${ollamaUrl}. Ensure the service is running and the model '${model}' is installed.`
        );
      }
      if (error?.code === 'ENOTFOUND' || message.includes('ENOTFOUND')) {
        throw new CameraAnalysisError(
          'OLLAMA_UNAVAILABLE',
          `Could not resolve Ollama host at ${ollamaUrl}. Check the OLLAMA_URL setting.`
        );
      }
      
      // Handle non-timeout errors immediately
      if (error?.response) {
        const status = error.response.status;
        const data = typeof error.response.data === 'string' ? error.response.data : JSON.stringify(error.response.data);
        throw new CameraAnalysisError(
          'OLLAMA_ERROR',
          `Ollama responded with status ${status}: ${data}`
        );
      }
      
      // Retry on timeout
      if (attempt < maxOllamaRetries && error?.code === 'ETIMEDOUT') {
        const delayMs = 5000; // 5 second delay before retry
        console.error(`Waiting ${delayMs}ms before Ollama retry...`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
  }
  
  if (!ollamaResponse) {
    if (lastOllamaError?.code === 'ETIMEDOUT') {
      throw new CameraAnalysisError(
        'TIMEOUT',
        `Ollama analysis timed out after ${maxOllamaRetries} attempts.`
      );
    }
    throw new CameraAnalysisError(
      'UNKNOWN_CAMERA_ERROR',
      `Error analyzing camera snapshot after ${maxOllamaRetries} attempts: ${lastOllamaError?.message || String(lastOllamaError)}`
    );
  }

  const analysis = ollamaResponse.data.response || 'No response from Ollama';
  const heur = parseCameraAnalysis(analysis);
  const structured: CameraAnalysisData = {
    deviceId: device.id,
    deviceName: device.name,
    model,
    cameraIP: ip,
    peopleCount: heur.peopleCount !== null ? heur.peopleCount : 0,
    people: heur.people || [],
    objects: heur.objects || [],
    timeOfDay: heur.timeOfDay,
    weather: heur.weather,
    confidence: null,
    rawAnalysisText: analysis,
  };

  return { structured, rawText: analysis };
}

// Map Fibaro device types / icon names to simple categories
function mapDeviceCategory(device: FibaroDevice, icons: FibaroIconsResponse = []) {
  const t = (device.type || '').toLowerCase();
  const props = device.properties || {};

  // normalize icons to an array
  const iconsArr: FibaroIcon[] = Array.isArray(icons) ? (icons as FibaroIcon[]) : ((icons && (icons as any).device) || []);

  // try icon lookup
  let iconSetName: string | null = null;
  if (iconsArr && Array.isArray(iconsArr)) {
    const match = iconsArr.find((i: FibaroIcon) => String(i.deviceType || '').toLowerCase() === String(device.baseType || device.type || '').toLowerCase() || (i.iconSetName && device.type && String(i.iconSetName).toLowerCase() === String(device.type).toLowerCase()));
    if (match) iconSetName = match.iconSetName || null;
  }

  let category = 'unknown';
  if (t.includes('camera') || (props && (props.jpgPath || props.snapshotUrl))) category = 'camera';
  else if (t.includes('thermostat') || t.includes('temperature')) category = 'thermostat';
  else if (t.includes('binary') || t.includes('switch')) category = 'switch';
  else if (t.includes('multilevel') || t.includes('dimmer')) category = 'dimmer';
  else if (t.includes('sensor') || t.includes('motion') || t.includes('flood') || t.includes('smoke') || t.includes('door')) category = 'sensor';
  else if (t.includes('scene')) category = 'scene';
  else if (t.includes('rgb') || iconSetName === 'rgb' || (props && props.rgb)) category = 'rgb';
  else if (t.includes('roller') || t.includes('shutter') || t.includes('blind') || t.includes('roleta')) category = 'cover';

  return { deviceCategory: category, iconSetName };
}

// List tools handler
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools };
});

// Call tool handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args = {} } = request.params;

  try {
    // Device tools
    if (name === 'list_devices') {
      const devices = await fibaroClient.getDevices();
      return {
        content: [
          {
            type: 'text',
            text: `Found ${devices.length} devices:\n\n${devices
              .map((d) => `- ID: ${d.id}, Name: ${d.name}, Type: ${d.type}, Room: ${d.roomID}`)
              .join('\n')}`,
          },
        ],
        structuredContent: buildJsonContent({ devices: devices.map((d) => ({ id: d.id, name: d.name, type: d.type, roomID: d.roomID })) }),
      };
    }

    if (name === 'get_device') {
        const device = await fibaroClient.getDevice(args.device_id as number);
        // get icons to try to resolve iconSetName
        let icons = [] as any;
        try {
          icons = await fibaroClient.getIcons();
        } catch (e) {
          // ignore icons errors
        }

        const { deviceCategory, iconSetName } = mapDeviceCategory(device, icons);

        // extract actions list
        const actionsList = device.actions ? Object.keys(device.actions) : [];

        const enriched = {
          device: device,
          deviceCategory,
          iconSetName: iconSetName || null,
          interfaces: device.interfaces || [],
          actions: actionsList,
        };

        return {
          content: [
            {
              type: 'text',
              text: `Device Information:\nID: ${device.id}\nName: ${device.name}\nType: ${device.type}\nRoom ID: ${device.roomID}`,
            },
          ],
          structuredContent: buildJsonContent(enriched),
        };
    }

    if (name === 'control_device') {
      const result = await fibaroClient.callAction(
        args.device_id as number,
        args.action as string,
        args.args as any[]
      );
      return {
        content: [
          {
            type: 'text',
            text: `Action executed successfully: ${JSON.stringify(result)}`,
          },
        ],
      };
    }

    // Room tools
    if (name === 'list_rooms') {
      const rooms = await fibaroClient.getRooms();
      return {
        content: [
          {
            type: 'text',
            text: `Found ${rooms.length} rooms:\n\n${rooms.map((r) => `- ID: ${r.id}, Name: ${r.name}`).join('\n')}`,
          },
        ],
        structuredContent: buildJsonContent({ rooms: rooms.map((r) => ({ id: r.id, name: r.name, sectionID: r.sectionID })) }),
      };
    }

    if (name === 'get_room') {
      const room = await fibaroClient.getRoom(args.room_id as number);
      return {
        content: [
          {
            type: 'text',
            text: `Room Information:\nID: ${room.id}\nName: ${room.name}\nSection ID: ${room.sectionID}`,
          },
        ],
        structuredContent: buildJsonContent({ room }),
      };
    }

    if (name === 'get_room_devices') {
      const allDevices = await fibaroClient.getDevices();
      const roomDevices = allDevices.filter((d) => d.roomID === (args.room_id as number));
      return {
        content: [
          {
            type: 'text',
            text: `Found ${roomDevices.length} devices in room:\n\n${roomDevices
              .map((d) => `- ID: ${d.id}, Name: ${d.name}, Type: ${d.type}`)
              .join('\n')}`,
          },
        ],
      };
    }

    // Scene tools
    if (name === 'list_scenes') {
      const scenes = await fibaroClient.getScenes();
      return {
        content: [
          {
            type: 'text',
            text: `Found ${scenes.length} scenes:\n\n${scenes.map((s) => `- ID: ${s.id}, Name: ${s.name}`).join('\n')}`,
          },
        ],
        structuredContent: buildJsonContent({ scenes: scenes.map((s) => ({ id: s.id, name: s.name, roomID: s.roomID })) }),
      };
    }

    if (name === 'get_scene') {
      const scene = await fibaroClient.getScene(args.scene_id as number);

      // Build basic information
      const infoParts = [
        'Scene Information:',
        `ID: ${scene.id}`,
        `Name: ${scene.name}`,
        `Type: ${scene.type || 'Unknown'}`,
        `Room ID: ${scene.roomID}`,
        `Enabled: ${scene.enabled}`,
        `Autostart: ${scene.autostart || false}`,
        `Run Config: ${scene.runConfig || 'N/A'}`,
        `Running Instances: ${scene.runningInstances || 0}`,
        `Visible: ${scene.visible !== undefined ? scene.visible : true}`,
        `Is Lua Scene: ${scene.isLua || false}`,
      ];

      // Add triggers information if available
      const triggers = scene.triggers;
      if (triggers) {
        infoParts.push('\nTriggers:');
        if (triggers.properties && triggers.properties.length > 0) {
          infoParts.push(`  Properties: ${JSON.stringify(triggers.properties)}`);
        }
        if (triggers.globals && triggers.globals.length > 0) {
          infoParts.push(`  Globals: ${JSON.stringify(triggers.globals)}`);
        }
        if (triggers.events && triggers.events.length > 0) {
          infoParts.push(`  Events: ${JSON.stringify(triggers.events)}`);
        }
        if (triggers.weather && triggers.weather.length > 0) {
          infoParts.push(`  Weather: ${JSON.stringify(triggers.weather)}`);
        }
      }

      // Add actions information if available
      const actions = scene.actions;
      if (actions) {
        infoParts.push('\nActions:');
        if (actions.devices && actions.devices.length > 0) {
          infoParts.push(`  Devices: ${JSON.stringify(actions.devices)}`);
        }
        if (actions.scenes && actions.scenes.length > 0) {
          infoParts.push(`  Scenes: ${JSON.stringify(actions.scenes)}`);
        }
        if (actions.groups && actions.groups.length > 0) {
          infoParts.push(`  Groups: ${JSON.stringify(actions.groups)}`);
        }
      }

      // Add LUA code if available
      const luaCode = scene.lua;
      if (luaCode) {
        infoParts.push('\nLUA Code:');
        infoParts.push('```lua');
        infoParts.push(luaCode);
        infoParts.push('```');
      }

      return {
        content: [
          {
            type: 'text',
            text: infoParts.join('\n'),
          },
        ],
        structuredContent: buildJsonContent({ scene }),
      };
    }

    if (name === 'trigger_scene') {
      const result = await fibaroClient.triggerScene(args.scene_id as number);
      return {
        content: [
          {
            type: 'text',
            text: `Scene triggered successfully: ${JSON.stringify(result)}`,
          },
        ],
      };
    }

    // System tools
    if (name === 'get_system_info') {
      const info = await fibaroClient.getSystemInfo();
      return {
        content: [
          {
            type: 'text',
            text: `System Information:\nSerial Number: ${info.serialNumber}\nHC Version: ${info.hcVersion}\nPlatform: ${info.platform}\nMAC: ${info.mac}`,
          },
        ],
        structuredContent: buildJsonContent({ system: info }),
      };
    }

    if (name === 'get_icons') {
      const icons = await fibaroClient.getIcons();
      const iconsArr = Array.isArray(icons) ? icons : (icons && (icons as any).device) || [];
      return { content: [ { type: 'text', text: `Found ${iconsArr.length} icons` } ], structuredContent: buildJsonContent({ icons: iconsArr }) };
    }

    if (name === 'get_weather') {
      const weather = await fibaroClient.getWeather();
      return {
        content: [
          {
            type: 'text',
            text: `Weather Information:\n${JSON.stringify(weather, null, 2)}`,
          },
        ],
        structuredContent: buildJsonContent({ weather }),
      };
    }

    if (name === 'get_home_status') {
      const model = process.env.HOME_STATUS_CAMERA_MODEL || 'llama3.2-vision';
      const ollamaUrl = process.env.OLLAMA_URL || 'http://localhost:11434';
      const cameraPrompt =
        'Provide a concise security-focused description of this camera image. Highlight people, vehicles, open gates/doors, and notable weather or lighting.';

      const [status, devices] = await Promise.all([
        fibaroClient.getHomeStatus(),
        fibaroClient.getDevices(),
      ]);

      const includeSet = parseIdList(process.env.HOME_STATUS_CAMERA_INCLUDE || null);
      const excludeSet = parseIdList(process.env.HOME_STATUS_CAMERA_EXCLUDE || null);
      const cameraAnalyses: CameraAnalysisEntry[] = [];
      const analyzableCameras: FibaroDevice[] = [];

      devices.forEach((device) => {
        if (!isCameraDevice(device)) {
          return;
        }

        const skipReason = cameraSkipReason(device, includeSet, excludeSet);
        if (skipReason) {
          cameraAnalyses.push({
            success: false,
            code: 'CAMERA_SKIPPED',
            message: skipReason,
            data: {
              deviceId: device.id,
              deviceName: device.name,
            },
          });
          return;
        }

        analyzableCameras.push(device);
      });

      console.error(`Analyzing ${analyzableCameras.length} cameras for home status (skipped ${cameraAnalyses.length}).`);

      const requestedConcurrency = parseInt(process.env.HOME_STATUS_CAMERA_CONCURRENCY || '0', 10);
      const effectiveConcurrency = requestedConcurrency > 0 ? requestedConcurrency : analyzableCameras.length || 1;
      const analyzedResults: CameraAnalysisEntry[] = analyzableCameras.length
        ? await analyzeCameraDevicesWithConcurrency(
            analyzableCameras,
            { prompt: cameraPrompt, model, ollamaUrl },
            effectiveConcurrency
          )
        : [];

      cameraAnalyses.push(...analyzedResults);

      const successCount = cameraAnalyses.filter((c) => c.success).length;
      const totalCameras = cameraAnalyses.length;
      const weatherSummary = status.weather
        ? status.weather.ConditionName || status.weather.condition || status.weather.weatherCondition || 'Unknown'
        : 'Unknown';
      const weatherTemp = status.weather && (status.weather.Temperature ?? status.weather.temperature);

      const summaryLines: string[] = [
        `Weather: ${weatherSummary}${weatherTemp !== undefined ? ` (${weatherTemp}°C)` : ''}`,
        `Active devices: ${status.activeDevices.length}`,
        `Breached sensors: ${status.breachedSensors.length}`,
        `Average indoor temperature: ${
          status.temperature && status.temperature.average !== null
            ? `${status.temperature.average}°C`
            : 'N/A'
        }`,
        totalCameras > 0
          ? `Camera snapshots analyzed: ${successCount}/${totalCameras}`
          : 'Camera snapshots analyzed: 0 (no cameras detected)',
      ];

      if (cameraAnalyses.length > 0) {
        summaryLines.push('\nCamera Highlights:');
        cameraAnalyses.forEach((entry) => {
          const cameraLabel = `${entry.data.deviceName} (#${entry.data.deviceId})`;
          if (entry.success && entry.data.rawAnalysisText) {
            const data = entry.data as CameraAnalysisData;
            const peopleText = data.peopleCount && data.peopleCount > 0 ? `${data.peopleCount} person(er)` : 'ingen personer';
            const objectText = data.objects && data.objects.length > 0 ? data.objects.join(', ') : 'ingen spesifikke objekter';
            const weatherText = data.weather ? `, vær: ${data.weather}` : '';
            const timeText = data.timeOfDay ? `, tid: ${data.timeOfDay}` : '';
            summaryLines.push(`- ${cameraLabel}: ${peopleText}, objekter: ${objectText}${weatherText}${timeText}.`);
          } else {
            summaryLines.push(
              `- ${cameraLabel}: kunne ikke analyseres (${entry.code}${entry.message ? ` - ${entry.message}` : ''}).`
            );
          }
        });
      }

      const enrichedStatus = {
        ...status,
        cameraAnalyses,
        cameraModel: model,
      };

      return {
        content: [
          {
            type: 'text',
            text: summaryLines.join('\n'),
          },
        ],
        structuredContent: buildJsonContent(enrichedStatus),
      };
    }

    if (name === 'get_consumption') {
      try {
        const consumption = await fibaroClient.getConsumption();
        return { content: [ { type: 'text', text: `Consumption data retrieved` } ], structuredContent: buildJsonContent({ consumption }) };
      } catch (err: any) {
        if (err && err.response && err.response.status === 501) {
          const msg = 'Consumption endpoint not implemented on this Fibaro unit';
          return { content: [ { type: 'text', text: `Error: ${msg}` } ], structuredContent: buildErrorContent(msg, 'NOT_IMPLEMENTED'), isError: true };
        }
        throw err;
      }
    }

    if (name === 'get_ios_devices') {
      const iosDevices = await fibaroClient.getIOSDevices();
      return { content: [ { type: 'text', text: `Found ${iosDevices.length} iOS devices` } ], structuredContent: buildJsonContent({ iosDevices }) };
    }

    if (name === 'get_rgb_programs') {
      const programs = await fibaroClient.getRGBPrograms();
      return { content: [ { type: 'text', text: `Found ${programs.length} RGB programs` } ], structuredContent: buildJsonContent({ programs }) };
    }

    if (name === 'get_tracking_schedules') {
      const schedules = await fibaroClient.getTrackingSchedules();
      return { content: [ { type: 'text', text: `Found ${schedules.length} tracking schedules` } ], structuredContent: buildJsonContent({ schedules }) };
    }

    if (name === 'discover_device') {
      const deviceId = args.device_id as number;
      const device = await fibaroClient.getDevice(deviceId);
      let icons = [] as any;
      try {
        icons = await fibaroClient.getIcons();
      } catch (e) {}

      const { deviceCategory, iconSetName } = mapDeviceCategory(device, icons);
      const actionsList = device.actions ? Object.keys(device.actions) : [];

      const snapshotCapable = deviceCategory === 'camera' || Boolean(device.properties && (device.properties.jpgPath || device.properties.snapshotUrl));
      const energyCapable = Boolean(device.properties && (device.properties.energy || device.properties.power || device.properties.consumption));
      const hasTemperature = Boolean(device.properties && (device.properties.temperature || device.type && device.type.toLowerCase().includes('thermostat')));

      const summary = {
        deviceId,
        deviceCategory,
        iconSetName: iconSetName || null,
        supportsActions: actionsList,
        snapshotCapable,
        energyCapable,
        hasTemperature,
        rawDevice: device,
      };

      return { content: [ { type: 'text', text: `Discovery for device ${deviceId}: category=${deviceCategory}` } ], structuredContent: buildJsonContent(summary) };
    }

    if (name === 'get_location') {
      const location = await fibaroClient.getLocation();
      return {
        content: [
          {
            type: 'text',
            text: `Location Information:\n${JSON.stringify(location, null, 2)}`,
          },
        ],
      };
    }

    if (name === 'get_diagnostics') {
      const diagnostics = await fibaroClient.getDiagnostics();
      return {
        content: [
          {
            type: 'text',
            text: `Diagnostics Information:\n${JSON.stringify(diagnostics, null, 2)}`,
          },
        ],
      };
    }

    if (name === 'list_users') {
      const users = await fibaroClient.getUsers();
      return {
        content: [
          {
            type: 'text',
            text: `Found ${users.length} users:\n\n${users.map((u) => `- ID: ${u.id}, Name: ${u.name}, Email: ${u.email}`).join('\n')}`,
          },
        ],
        structuredContent: buildJsonContent({ users: users.map((u) => ({ id: u.id, name: u.name, email: u.email })) }),
      };
    }

    if (name === 'get_user') {
      const user = await fibaroClient.getUser(args.user_id as number);
      return {
        content: [
          {
            type: 'text',
            text: `User Information:\nID: ${user.id}\nName: ${user.name}\nEmail: ${user.email}\nType: ${user.type}\nHas GPS: ${user.hasGPS}`,
          },
        ],
      };
    }

    if (name === 'list_sections') {
      const sections = await fibaroClient.getSections();
      return {
        content: [
          {
            type: 'text',
            text: `Found ${sections.length} sections:\n\n${sections.map((s) => `- ID: ${s.id}, Name: ${s.name}`).join('\n')}`,
          },
        ],
      };
    }

    if (name === 'get_section') {
      const section = await fibaroClient.getSection(args.section_id as number);
      return {
        content: [
          {
            type: 'text',
            text: `Section Information:\nID: ${section.id}\nName: ${section.name}\nSort Order: ${section.sortOrder}`,
          },
        ],
      };
    }

    if (name === 'get_energy') {
      const energy = await fibaroClient.getEnergy(args.type as string, args.id as number);
      return {
        content: [
          {
            type: 'text',
            text: `Energy Information:\n${JSON.stringify(energy, null, 2)}`,
          },
        ],
      };
    }

    if (name === 'get_temperature_panel') {
      const temperature = await fibaroClient.getTemperaturePanel(args.type as string, args.method as string, args.id as number);
      return {
        content: [
          {
            type: 'text',
            text: `Temperature Information:\n${JSON.stringify(temperature, null, 2)}`,
          },
        ],
      };
    }

    // Global variables tools
    if (name === 'list_global_variables') {
      const variables = await fibaroClient.getGlobalVariables();
      return {
        content: [
          {
            type: 'text',
            text: `Found ${variables.length} global variables:\n\n${variables
              .map((v) => `- ${v.name}: ${v.value}`)
              .join('\n')}`,
          },
        ],
      };
    }

    if (name === 'get_global_variable') {
      const variable = await fibaroClient.getGlobalVariable(args.name as string);
      return {
        content: [
          {
            type: 'text',
            text: `Variable: ${variable.name}\nValue: ${variable.value}\nModified: ${variable.modified}`,
          },
        ],
        structuredContent: buildJsonContent({ variable }),
      };
    }

    if (name === 'set_global_variable') {
      const result = await fibaroClient.setGlobalVariable(args.name as string, args.value);
      return {
        content: [
          {
            type: 'text',
            text: `Variable set successfully: ${JSON.stringify(result)}`,
          },
        ],
        structuredContent: buildJsonContent({ result }),
      };
    }

    // Camera analysis tool
    if (name === 'analyze_camera_snapshot') {
      const deviceId = args.device_id as number;
      const prompt =
        (args.prompt as string) ||
        'Describe what you see in this image in detail. Include any people, objects, buildings, landscape features, time of day, and weather conditions.';
      const model = (args.model as string) || 'llama3.2-vision';
      const ollamaUrl = process.env.OLLAMA_URL || 'http://localhost:11434';

      try {
        const device = await fibaroClient.getDevice(deviceId);
        const { structured, rawText } = await analyzeCameraDevice(device, {
          prompt,
          model,
          ollamaUrl,
        });
        return {
          content: [
            {
              type: 'text',
              text:
                `Camera Analysis for Device ${deviceId} (${device.name}):\n` +
                `${'='.repeat(60)}\n` +
                `Camera IP: ${structured.cameraIP}\n` +
                `Model: ${model}\n` +
                `${'='.repeat(60)}\n\n` +
                `${rawText}`,
            },
          ],
          structuredContent: buildJsonContent({ success: true, code: 'OK', data: structured }),
        };
      } catch (error: any) {
        if (error instanceof CameraAnalysisError) {
          const msg = error.message;
          return {
            content: [{ type: 'text', text: `Error: ${msg}` }],
            structuredContent: buildErrorContent(msg, error.code),
            isError: true,
          };
        }
        const msg = `Error analyzing camera snapshot: ${error && error.message ? error.message : String(error)}`;
        return {
          content: [{ type: 'text', text: msg }],
          structuredContent: buildErrorContent(msg, 'UNKNOWN_CAMERA_ERROR'),
          isError: true,
        };
      }
    }

    throw new Error(`Unknown tool: ${name}`);
  } catch (error: any) {
    const msg = error instanceof Error ? error.message : String(error);
    return {
      content: [{ type: 'text', text: `Error: ${msg}` }, buildErrorContent(msg, 'SERVER_ERROR')],
      isError: true,
    };
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Fibaro MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
