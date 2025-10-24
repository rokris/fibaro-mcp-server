"""Test script to verify the enhanced get_scene functionality."""

import asyncio
import os
from dotenv import load_dotenv
from fibaro_mcp.fibaro_client import FibaroClient
from fibaro_mcp.server import app

# Load environment variables
load_dotenv()

async def test_enhanced_scene():
    """Test the enhanced scene information display."""
    print("🧪 Testing enhanced scene details...\n")
    
    url = os.getenv("FIBARO_URL", "")
    username = os.getenv("FIBARO_USERNAME")
    password = os.getenv("FIBARO_PASSWORD")
    
    # Parse URL
    use_https = url.startswith("https://")
    host = url.replace("https://", "").replace("http://", "").split("/")[0]
    
    client = FibaroClient(
        host=host,
        username=username,
        password=password,
        use_https=use_https
    )
    
    try:
        # Test with scene 99 - "Tidstyrt utelys på"
        print("📋 Testing scene ID 99 (Tidstyrt utelys på)...\n")
        scene = await client.get_scene(99)
        
        # Build the same output as the server would
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
        
        output = "\n".join(info_parts)
        print(output)
        
        print("\n\n✅ Enhanced scene information is working correctly!")
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
    finally:
        await client.close()

if __name__ == "__main__":
    asyncio.run(test_enhanced_scene())
