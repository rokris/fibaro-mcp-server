"""Test script to check what scene details the API returns."""

import asyncio
import os
import json
from dotenv import load_dotenv
from fibaro_mcp.fibaro_client import FibaroClient

# Load environment variables
load_dotenv()

async def test_scene_details():
    """Test what scene details the API returns."""
    print("🔍 Testing scene details from API...")
    
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
        # Get scene 99 - "Tidstyrt utelys på"
        print("\n📋 Getting details for scene ID 99 (Tidstyrt utelys på)...")
        scene = await client.get_scene(99)
        
        print("\n🔍 Full scene data:")
        print(json.dumps(scene, indent=2, ensure_ascii=False))
        
        print("\n📝 Available keys:")
        for key in scene.keys():
            print(f"   - {key}")
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
    finally:
        await client.close()

if __name__ == "__main__":
    asyncio.run(test_scene_details())
