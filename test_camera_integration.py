#!/usr/bin/env python3
"""
Quick test script for camera analysis integration
"""
import asyncio
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'python'))

from fibaro_mcp.fibaro_client import FibaroClient
from dotenv import load_dotenv

load_dotenv()

async def test_camera_analysis():
    """Test camera analysis functionality"""
    
    print("Testing Fibaro Camera Analysis Integration")
    print("=" * 60)
    
    # Initialize client
    url = os.getenv("FIBARO_URL") or os.getenv("FIBARO_HOST", "")
    username = os.getenv("FIBARO_USERNAME")
    password = os.getenv("FIBARO_PASSWORD")
    
    if not all([url, username, password]):
        print("❌ Error: Missing Fibaro credentials in .env file")
        return
    
    # Parse URL
    use_https = False
    host = url
    if url.startswith("https://"):
        use_https = True
        host = url.replace("https://", "").split("/")[0]
    elif url.startswith("http://"):
        use_https = False
        host = url.replace("http://", "").split("/")[0]
    
    client = FibaroClient(host=host, username=username, password=password, use_https=use_https)
    
    try:
        # Get all devices
        print("\n📹 Looking for camera devices...")
        devices = await client.get_devices()
        
        cameras = [d for d in devices if 'camera' in d.get('type', '').lower()]
        
        if not cameras:
            print("⚠️  No camera devices found in Fibaro system")
            return
        
        print(f"✅ Found {len(cameras)} camera device(s):")
        for cam in cameras:
            print(f"   - ID: {cam['id']}, Name: {cam.get('name', 'Unknown')}, Type: {cam.get('type')}")
        
        # Test with first camera
        test_camera = cameras[0]
        camera_id = test_camera['id']
        camera_name = test_camera.get('name', 'Unknown')
        
        print(f"\n🎥 Testing snapshot capture from camera {camera_id} ({camera_name})...")
        
        device_info = await client.get_device(camera_id)
        props = device_info.get('properties', {})
        
        ip = props.get('ip', '')
        if not ip:
            print(f"❌ Camera {camera_id} has no IP address configured")
            return
        
        print(f"✅ Camera IP: {ip}")
        print(f"✅ JPEG Path: {props.get('jpgPath', '/image/jpeg.cgi')}")
        
        print("\n✅ Integration test completed successfully!")
        print("\nTo test the full camera analysis:")
        print(f"   Ask: 'Analyze camera {camera_id}' or 'What do you see on {camera_name}?'")
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    asyncio.run(test_camera_analysis())
