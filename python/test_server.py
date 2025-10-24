"""Test script to verify Fibaro MCP server works."""

import asyncio
import os
from dotenv import load_dotenv
from fibaro_mcp.fibaro_client import FibaroClient

# Load environment variables
load_dotenv()

async def test_fibaro():
    """Test connection to Fibaro Home Center."""
    print("🔌 Testing Fibaro connection...")
    
    url = os.getenv("FIBARO_URL", "")
    username = os.getenv("FIBARO_USERNAME")
    password = os.getenv("FIBARO_PASSWORD")
    
    # Parse URL
    use_https = url.startswith("https://")
    host = url.replace("https://", "").replace("http://", "").split("/")[0]
    
    print(f"   URL: {url}")
    print(f"   Host: {host}")
    print(f"   Username: {username}")
    print(f"   HTTPS: {use_https}")
    
    client = FibaroClient(
        host=host,
        username=username,
        password=password,
        use_https=use_https
    )
    
    try:
        # Test system info
        print("\n📊 Getting system info...")
        info = await client.get_system_info()
        print(f"   ✅ System: {info.get('platform', 'Unknown')}")
        print(f"   ✅ Version: {info.get('hcVersion', 'Unknown')}")
        print(f"   ✅ Serial: {info.get('serialNumber', 'Unknown')}")
        
        # Test devices
        print("\n📱 Getting devices...")
        devices = await client.get_devices()
        print(f"   ✅ Found {len(devices)} devices")
        
        if devices:
            print("\n   First 5 devices:")
            for device in devices[:5]:
                print(f"   - ID: {device['id']}, Name: {device.get('name', 'Unknown')}, Type: {device.get('type', 'Unknown')}")
        
        # Test rooms
        print("\n🏠 Getting rooms...")
        rooms = await client.get_rooms()
        print(f"   ✅ Found {len(rooms)} rooms")
        
        if rooms:
            print("\n   Rooms:")
            for room in rooms:
                print(f"   - ID: {room['id']}, Name: {room.get('name', 'Unknown')}")
        
        # Test scenes
        print("\n🎬 Getting scenes...")
        scenes = await client.get_scenes()
        print(f"   ✅ Found {len(scenes)} scenes")
        
        print("\n✅ All tests passed! MCP server should work correctly.")
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
    finally:
        await client.close()

if __name__ == "__main__":
    asyncio.run(test_fibaro())
