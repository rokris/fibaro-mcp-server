"""Fibaro Home Center 2 MCP Server."""

import asyncio
import logging
import os
from typing import Any, Optional

from dotenv import load_dotenv
from mcp.server import Server
from mcp.types import (
    Tool,
    TextContent,
    ImageContent,
    EmbeddedResource,
)
from mcp.server.stdio import stdio_server

from .fibaro_client import FibaroClient

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize MCP server
app = Server("fibaro-home-center")

# Global Fibaro client
fibaro_client: Optional[FibaroClient] = None


def get_fibaro_client() -> FibaroClient:
    """Get or create Fibaro client instance."""
    global fibaro_client

    if fibaro_client is None:
        url = os.getenv("FIBARO_URL") or os.getenv("FIBARO_HOST", "")
        username = os.getenv("FIBARO_USERNAME")
        password = os.getenv("FIBARO_PASSWORD")

        # Parse URL to extract host and protocol
        use_https = False
        host = url
        
        if url.startswith("https://"):
            use_https = True
            host = url.replace("https://", "").split("/")[0]
        elif url.startswith("http://"):
            use_https = False
            host = url.replace("http://", "").split("/")[0]
        else:
            # Fallback: check old FIBARO_USE_HTTPS variable
            use_https = os.getenv("FIBARO_USE_HTTPS", "false").lower() == "true"

        if not all([host, username, password]):
            raise ValueError(
                "Missing required environment variables: FIBARO_URL (or FIBARO_HOST), FIBARO_USERNAME, FIBARO_PASSWORD"
            )

        fibaro_client = FibaroClient(
            host=host,
            username=username,
            password=password,
            use_https=use_https,
        )

    return fibaro_client


@app.list_tools()
async def list_tools() -> list[Tool]:
    """List available MCP tools."""
    return [
        # Device tools
        Tool(
            name="list_devices",
            description="List all devices in the Fibaro Home Center system",
            inputSchema={
                "type": "object",
                "properties": {},
            },
        ),
        Tool(
            name="get_device",
            description="Get detailed information about a specific device",
            inputSchema={
                "type": "object",
                "properties": {
                    "device_id": {
                        "type": "integer",
                        "description": "The device ID",
                    }
                },
                "required": ["device_id"],
            },
        ),
        Tool(
            name="control_device",
            description="Control a device (turn on/off, set value, etc.)",
            inputSchema={
                "type": "object",
                "properties": {
                    "device_id": {
                        "type": "integer",
                        "description": "The device ID",
                    },
                    "action": {
                        "type": "string",
                        "description": "Action to perform (e.g., 'turnOn', 'turnOff', 'setValue')",
                    },
                    "args": {
                        "type": "array",
                        "description": "Optional arguments for the action",
                        "items": {"type": "string"},
                    },
                },
                "required": ["device_id", "action"],
            },
        ),
        # Room tools
        Tool(
            name="list_rooms",
            description="List all rooms in the Fibaro Home Center system",
            inputSchema={
                "type": "object",
                "properties": {},
            },
        ),
        Tool(
            name="get_room",
            description="Get detailed information about a specific room",
            inputSchema={
                "type": "object",
                "properties": {
                    "room_id": {
                        "type": "integer",
                        "description": "The room ID",
                    }
                },
                "required": ["room_id"],
            },
        ),
        Tool(
            name="get_room_devices",
            description="Get all devices in a specific room",
            inputSchema={
                "type": "object",
                "properties": {
                    "room_id": {
                        "type": "integer",
                        "description": "The room ID",
                    }
                },
                "required": ["room_id"],
            },
        ),
        # Scene tools
        Tool(
            name="list_scenes",
            description="List all scenes in the Fibaro Home Center system",
            inputSchema={
                "type": "object",
                "properties": {},
            },
        ),
        Tool(
            name="get_scene",
            description="Get detailed information about a specific scene",
            inputSchema={
                "type": "object",
                "properties": {
                    "scene_id": {
                        "type": "integer",
                        "description": "The scene ID",
                    }
                },
                "required": ["scene_id"],
            },
        ),
        Tool(
            name="trigger_scene",
            description="Trigger/execute a scene",
            inputSchema={
                "type": "object",
                "properties": {
                    "scene_id": {
                        "type": "integer",
                        "description": "The scene ID to trigger",
                    }
                },
                "required": ["scene_id"],
            },
        ),
        # System tools
        Tool(
            name="get_system_info",
            description="Get Fibaro Home Center system information",
            inputSchema={
                "type": "object",
                "properties": {},
            },
        ),
        Tool(
            name="get_weather",
            description="Get weather information from Fibaro system",
            inputSchema={
                "type": "object",
                "properties": {},
            },
        ),
        # Variable tools
        Tool(
            name="list_global_variables",
            description="List all global variables",
            inputSchema={
                "type": "object",
                "properties": {},
            },
        ),
        Tool(
            name="get_global_variable",
            description="Get a specific global variable",
            inputSchema={
                "type": "object",
                "properties": {
                    "name": {
                        "type": "string",
                        "description": "Variable name",
                    }
                },
                "required": ["name"],
            },
        ),
        Tool(
            name="set_global_variable",
            description="Set a global variable value",
            inputSchema={
                "type": "object",
                "properties": {
                    "name": {
                        "type": "string",
                        "description": "Variable name",
                    },
                    "value": {
                        "type": "string",
                        "description": "Variable value",
                    },
                },
                "required": ["name", "value"],
            },
        ),
    ]


@app.call_tool()
async def call_tool(name: str, arguments: Any) -> list[TextContent]:
    """Handle tool calls."""
    client = get_fibaro_client()

    try:
        # Device tools
        if name == "list_devices":
            devices = await client.get_devices()
            return [
                TextContent(
                    type="text",
                    text=f"Found {len(devices)} devices:\n\n"
                    + "\n".join(
                        f"- ID: {d['id']}, Name: {d.get('name', 'Unknown')}, "
                        f"Type: {d.get('type', 'Unknown')}, Room: {d.get('roomID', 'N/A')}"
                        for d in devices
                    ),
                )
            ]

        elif name == "get_device":
            device = await client.get_device(arguments["device_id"])
            return [
                TextContent(
                    type="text",
                    text=f"Device Information:\n"
                    f"ID: {device.get('id')}\n"
                    f"Name: {device.get('name')}\n"
                    f"Type: {device.get('type')}\n"
                    f"Room ID: {device.get('roomID')}\n"
                    f"Enabled: {device.get('enabled')}\n"
                    f"Properties: {device.get('properties', {})}\n"
                    f"Actions: {device.get('actions', {})}",
                )
            ]

        elif name == "control_device":
            result = await client.call_action(
                device_id=arguments["device_id"],
                action=arguments["action"],
                args=arguments.get("args"),
            )
            return [TextContent(type="text", text=f"Action executed successfully: {result}")]

        # Room tools
        elif name == "list_rooms":
            rooms = await client.get_rooms()
            return [
                TextContent(
                    type="text",
                    text=f"Found {len(rooms)} rooms:\n\n"
                    + "\n".join(
                        f"- ID: {r['id']}, Name: {r.get('name', 'Unknown')}" for r in rooms
                    ),
                )
            ]

        elif name == "get_room":
            room = await client.get_room(arguments["room_id"])
            return [
                TextContent(
                    type="text",
                    text=f"Room Information:\n"
                    f"ID: {room.get('id')}\n"
                    f"Name: {room.get('name')}\n"
                    f"Section ID: {room.get('sectionID')}",
                )
            ]

        elif name == "get_room_devices":
            devices = await client.get_devices()
            room_devices = [d for d in devices if d.get("roomID") == arguments["room_id"]]
            return [
                TextContent(
                    type="text",
                    text=f"Found {len(room_devices)} devices in room:\n\n"
                    + "\n".join(
                        f"- ID: {d['id']}, Name: {d.get('name', 'Unknown')}, "
                        f"Type: {d.get('type', 'Unknown')}"
                        for d in room_devices
                    ),
                )
            ]

        # Scene tools
        elif name == "list_scenes":
            scenes = await client.get_scenes()
            return [
                TextContent(
                    type="text",
                    text=f"Found {len(scenes)} scenes:\n\n"
                    + "\n".join(
                        f"- ID: {s['id']}, Name: {s.get('name', 'Unknown')}" for s in scenes
                    ),
                )
            ]

        elif name == "get_scene":
            scene = await client.get_scene(arguments["scene_id"])
            
            # Build basic information
            info_parts = [
                f"Scene Information:",
                f"ID: {scene.get('id')}",
                f"Name: {scene.get('name')}",
                f"Type: {scene.get('type', 'Unknown')}",
                f"Room ID: {scene.get('roomID')}",
                f"Enabled: {scene.get('enabled')}",
                f"Autostart: {scene.get('autostart', False)}",
                f"Run Config: {scene.get('runConfig', 'N/A')}",
                f"Running Instances: {scene.get('runningInstances', 0)}",
                f"Visible: {scene.get('visible', True)}",
                f"Is Lua Scene: {scene.get('isLua', False)}",
            ]
            
            # Add triggers information if available
            triggers = scene.get('triggers', {})
            if triggers:
                info_parts.append("\nTriggers:")
                if triggers.get('properties'):
                    info_parts.append(f"  Properties: {triggers['properties']}")
                if triggers.get('globals'):
                    info_parts.append(f"  Globals: {triggers['globals']}")
                if triggers.get('events'):
                    info_parts.append(f"  Events: {triggers['events']}")
                if triggers.get('weather'):
                    info_parts.append(f"  Weather: {triggers['weather']}")
            
            # Add actions information if available
            actions = scene.get('actions', {})
            if actions:
                info_parts.append("\nActions:")
                if actions.get('devices'):
                    info_parts.append(f"  Devices: {actions['devices']}")
                if actions.get('scenes'):
                    info_parts.append(f"  Scenes: {actions['scenes']}")
                if actions.get('groups'):
                    info_parts.append(f"  Groups: {actions['groups']}")
            
            # Add LUA code if available
            lua_code = scene.get('lua', '')
            if lua_code:
                info_parts.append("\nLUA Code:")
                info_parts.append("```lua")
                info_parts.append(lua_code)
                info_parts.append("```")
            
            return [
                TextContent(
                    type="text",
                    text="\n".join(info_parts),
                )
            ]

        elif name == "trigger_scene":
            result = await client.trigger_scene(arguments["scene_id"])
            return [TextContent(type="text", text=f"Scene triggered successfully: {result}")]

        # System tools
        elif name == "get_system_info":
            info = await client.get_system_info()
            return [
                TextContent(
                    type="text",
                    text=f"System Information:\n"
                    f"Serial Number: {info.get('serialNumber')}\n"
                    f"HC Version: {info.get('hcVersion')}\n"
                    f"Platform: {info.get('platform')}\n"
                    f"MAC: {info.get('mac')}",
                )
            ]

        elif name == "get_weather":
            weather = await client.get_weather()
            return [TextContent(type="text", text=f"Weather Information:\n{weather}")]

        # Variable tools
        elif name == "list_global_variables":
            variables = await client.get_global_variables()
            return [
                TextContent(
                    type="text",
                    text=f"Found {len(variables)} global variables:\n\n"
                    + "\n".join(
                        f"- {v.get('name')}: {v.get('value')} (modified: {v.get('modified')})"
                        for v in variables
                    ),
                )
            ]

        elif name == "get_global_variable":
            variable = await client.get_global_variable(arguments["name"])
            return [
                TextContent(
                    type="text",
                    text=f"Variable '{arguments['name']}':\n"
                    f"Value: {variable.get('value')}\n"
                    f"Modified: {variable.get('modified')}",
                )
            ]

        elif name == "set_global_variable":
            result = await client.set_global_variable(arguments["name"], arguments["value"])
            return [
                TextContent(
                    type="text", text=f"Variable '{arguments['name']}' updated successfully"
                )
            ]

        else:
            return [TextContent(type="text", text=f"Unknown tool: {name}")]

    except Exception as e:
        logger.error(f"Error executing tool {name}: {e}")
        return [TextContent(type="text", text=f"Error: {str(e)}")]


async def main():
    """Run the MCP server."""
    async with stdio_server() as (read_stream, write_stream):
        logger.info("Starting Fibaro Home Center 2 MCP server...")
        await app.run(
            read_stream,
            write_stream,
            app.create_initialization_options(),
        )


if __name__ == "__main__":
    asyncio.run(main())
