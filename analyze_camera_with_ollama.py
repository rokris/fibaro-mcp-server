#!/usr/bin/env python3
"""
Analyze camera images using local Ollama with vision models.
Supports models like llama3.2-vision, llava, and other vision-capable models.
"""
import base64
import json
import sys
import requests
from pathlib import Path


def encode_image_to_base64(image_path):
    """Encode image file to base64 string"""
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')


def analyze_image_with_ollama(
    image_path,
    prompt="Describe what you see in this image in detail. Include any people, objects, buildings, landscape features, time of day, and weather conditions.",
    model="llama3.2-vision",
    ollama_url="http://localhost:11434"
):
    """
    Send image to local Ollama instance for analysis.
    
    Args:
        image_path: Path to the image file
        prompt: The question/prompt for the vision model
        model: Ollama model name (default: llama3.2-vision)
        ollama_url: Ollama API endpoint (default: http://localhost:11434)
    
    Returns:
        dict: Response from Ollama containing the analysis
    """
    
    # Check if image exists
    if not Path(image_path).exists():
        raise FileNotFoundError(f"Image not found: {image_path}")
    
    # Encode image
    print(f"📸 Loading image: {image_path}")
    image_base64 = encode_image_to_base64(image_path)
    
    # Prepare request
    api_endpoint = f"{ollama_url}/api/generate"
    
    payload = {
        "model": model,
        "prompt": prompt,
        "images": [image_base64],
        "stream": False
    }
    
    print(f"🤖 Sending to Ollama ({model})...")
    print(f"💬 Prompt: {prompt}\n")
    
    try:
        # Send request
        response = requests.post(api_endpoint, json=payload, timeout=120)
        response.raise_for_status()
        
        result = response.json()
        
        # Extract response text
        if "response" in result:
            analysis = result["response"]
            print("="*60)
            print("OLLAMA VISION ANALYSIS")
            print("="*60)
            print(analysis)
            print("="*60)
            
            return {
                "success": True,
                "analysis": analysis,
                "model": model,
                "image": image_path
            }
        else:
            print(f"❌ Unexpected response format: {result}")
            return {
                "success": False,
                "error": "Unexpected response format"
            }
            
    except requests.exceptions.ConnectionError:
        print(f"❌ Error: Could not connect to Ollama at {ollama_url}")
        print("   Make sure Ollama is running (ollama serve)")
        print(f"   Make sure the model '{model}' is installed (ollama pull {model})")
        return {
            "success": False,
            "error": "Connection failed"
        }
    except requests.exceptions.Timeout:
        print("❌ Error: Request timed out. The model might be too slow or not responding.")
        return {
            "success": False,
            "error": "Timeout"
        }
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return {
            "success": False,
            "error": str(e)
        }


def check_ollama_status(ollama_url="http://localhost:11434"):
    """Check if Ollama is running and list available models"""
    try:
        response = requests.get(f"{ollama_url}/api/tags", timeout=5)
        response.raise_for_status()
        models = response.json().get("models", [])
        
        print("✅ Ollama is running")
        print(f"📦 Available models:")
        
        vision_models = []
        for model in models:
            name = model.get("name", "unknown")
            print(f"   - {name}")
            # Check if it's a vision model
            if any(vm in name.lower() for vm in ["vision", "llava", "bakllava"]):
                vision_models.append(name)
        
        if vision_models:
            print(f"\n🖼️  Vision-capable models found: {', '.join(vision_models)}")
        else:
            print("\n⚠️  No vision-capable models found.")
            print("   Install one with: ollama pull llama3.2-vision")
            print("   Or: ollama pull llava")
        
        return True, vision_models
    except:
        print("❌ Ollama is not running or not accessible")
        print("   Start it with: ollama serve")
        return False, []


if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(
        description="Analyze images using local Ollama vision models"
    )
    parser.add_argument(
        "image",
        nargs="?",
        help="Path to the image file to analyze"
    )
    parser.add_argument(
        "--prompt",
        "-p",
        default="Describe what you see in this image in detail. Include any people, objects, buildings, landscape features, time of day, and weather conditions.",
        help="Custom prompt for the vision model"
    )
    parser.add_argument(
        "--model",
        "-m",
        default="llama3.2-vision",
        help="Ollama model to use (default: llama3.2-vision)"
    )
    parser.add_argument(
        "--ollama-url",
        default="http://localhost:11434",
        help="Ollama API URL (default: http://localhost:11434)"
    )
    parser.add_argument(
        "--check-status",
        action="store_true",
        help="Check Ollama status and list available models"
    )
    
    args = parser.parse_args()
    
    # Check status if requested
    if args.check_status:
        check_ollama_status(args.ollama_url)
        sys.exit(0)
    
    # Require image if not checking status
    if not args.image:
        parser.error("image argument is required when not using --check-status")
    
    # Analyze image
    result = analyze_image_with_ollama(
        args.image,
        prompt=args.prompt,
        model=args.model,
        ollama_url=args.ollama_url
    )
    
    if not result["success"]:
        sys.exit(1)
