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
import { FibaroClient } from './fibaro-client.js';

// Load environment variables
dotenv.config();

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
const tools: Tool[] = [
  // Device tools
  {
    name: 'list_devices',
    description: 'List all devices in the Fibaro Home Center system',
    inputSchema: {
      type: 'object',
      properties: {},
    },
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
    name: 'get_weather',
    description: 'Get weather information from Fibaro system',
    inputSchema: {
      type: 'object',
      properties: {},
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
];

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
      };
    }

    if (name === 'get_device') {
      const device = await fibaroClient.getDevice(args.device_id as number);
      return {
        content: [
          {
            type: 'text',
            text: `Device Information:\nID: ${device.id}\nName: ${device.name}\nType: ${device.type}\nRoom ID: ${device.roomID}\nEnabled: ${device.enabled}\nProperties: ${JSON.stringify(device.properties, null, 2)}\nActions: ${JSON.stringify(Object.keys(device.actions || {}), null, 2)}`,
          },
        ],
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
      };
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
      };
    }

    throw new Error(`Unknown tool: ${name}`);
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
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
