#!/usr/bin/env python3
"""
Analyze camera snapshot images from Fibaro system
"""
from PIL import Image, ImageDraw, ImageStat, ImageFilter
import sys
from collections import Counter

def analyze_image(image_path, detailed=False):
    """Analyze a camera snapshot image and provide a description"""
    try:
        img = Image.open(image_path)
        
        print(f"Image Analysis for: {image_path}")
        print(f"{'='*60}")
        print(f"Size: {img.size[0]}x{img.size[1]} pixels")
        print(f"Format: {img.format}")
        print(f"Mode: {img.mode}")
        
        # Get basic statistics
        if img.mode == 'RGB':
            r, g, b = img.split()
            
            # Calculate average brightness
            pixels = list(img.getdata())
            avg_brightness = sum(sum(p) for p in pixels) / (len(pixels) * 3)
            
            print(f"\nImage Statistics:")
            print(f"Average brightness: {avg_brightness:.1f}/255")
            
            if avg_brightness < 50:
                print("Lighting: Very dark")
            elif avg_brightness < 100:
                print("Lighting: Dark/Low light")
            elif avg_brightness < 150:
                print("Lighting: Moderate")
            elif avg_brightness < 200:
                print("Lighting: Bright")
            else:
                print("Lighting: Very bright")
            
            if detailed:
                print(f"\n{'='*60}")
                print("DETAILED ANALYSIS")
                print(f"{'='*60}")
                
                # Color channel analysis
                stat = ImageStat.Stat(img)
                print(f"\nColor Channel Statistics:")
                print(f"Red   - Mean: {stat.mean[0]:.1f}, StdDev: {stat.stddev[0]:.1f}")
                print(f"Green - Mean: {stat.mean[1]:.1f}, StdDev: {stat.stddev[1]:.1f}")
                print(f"Blue  - Mean: {stat.mean[2]:.1f}, StdDev: {stat.stddev[2]:.1f}")
                
                # Analyze dominant colors
                print(f"\nDominant Colors:")
                small_img = img.resize((50, 50))
                colors = small_img.getdata()
                color_counter = Counter(colors)
                top_colors = color_counter.most_common(5)
                
                for i, (color, count) in enumerate(top_colors, 1):
                    percentage = (count / len(list(small_img.getdata()))) * 100
                    print(f"{i}. RGB{color} - {percentage:.1f}% of pixels")
                
                # Analyze image regions (quadrants)
                print(f"\nRegion Analysis (by quadrant):")
                width, height = img.size
                regions = {
                    'Top-Left': img.crop((0, 0, width//2, height//2)),
                    'Top-Right': img.crop((width//2, 0, width, height//2)),
                    'Bottom-Left': img.crop((0, height//2, width//2, height)),
                    'Bottom-Right': img.crop((width//2, height//2, width, height))
                }
                
                for region_name, region_img in regions.items():
                    region_pixels = list(region_img.getdata())
                    region_brightness = sum(sum(p) for p in region_pixels) / (len(region_pixels) * 3)
                    print(f"  {region_name:15} - Brightness: {region_brightness:.1f}/255")
                
                # Edge detection for movement/objects
                print(f"\nEdge Detection Analysis:")
                edges = img.filter(ImageFilter.FIND_EDGES)
                edge_pixels = list(edges.getdata())
                edge_intensity = sum(sum(p) for p in edge_pixels) / (len(edge_pixels) * 3)
                print(f"Edge intensity: {edge_intensity:.1f}/255")
                if edge_intensity > 30:
                    print("High detail/complexity - many objects or patterns detected")
                elif edge_intensity > 15:
                    print("Moderate detail - some objects/structure visible")
                else:
                    print("Low detail - uniform or very dark scene")
                
                # Contrast analysis
                print(f"\nContrast Analysis:")
                min_brightness = min(sum(p) for p in pixels) / 3
                max_brightness = max(sum(p) for p in pixels) / 3
                contrast_range = max_brightness - min_brightness
                print(f"Brightness range: {min_brightness:.1f} to {max_brightness:.1f}")
                print(f"Contrast range: {contrast_range:.1f}/255")
                if contrast_range > 200:
                    print("Very high contrast - bright lights and dark shadows")
                elif contrast_range > 150:
                    print("High contrast - good separation between dark and light areas")
                elif contrast_range > 100:
                    print("Moderate contrast")
                else:
                    print("Low contrast - fairly uniform lighting")
                
                # Motion/activity indicators
                print(f"\nScene Assessment:")
                if avg_brightness < 50 and edge_intensity < 15:
                    print("⚫ Scene appears to be nighttime with minimal lighting")
                elif avg_brightness < 100 and edge_intensity > 20:
                    print("🌙 Low light scene but with visible details/objects")
                elif contrast_range > 150 and max_brightness > 200:
                    print("💡 Scene has bright artificial lighting with shadows")
                elif edge_intensity > 30:
                    print("🏞️  Complex scene with many visible objects/details")
                else:
                    print("📷 Scene has uniform or simple content")
        
        # Show the image
        print(f"\n{'='*60}")
        print(f"Opening image for visual inspection...")
        img.show()
        
    except Exception as e:
        print(f"Error analyzing image: {e}")
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python analyze_camera_image.py <image_path> [--detailed]")
        sys.exit(1)
    
    detailed = "--detailed" in sys.argv
    analyze_image(sys.argv[1], detailed=detailed)
