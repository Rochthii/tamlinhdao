import os
import sys

def install_and_run():
    # Try importing Pillow, if not installed, install it
    try:
        from PIL import Image, ImageOps
    except ImportError:
        print("Pillow not found. Installing Pillow...")
        import subprocess
        subprocess.check_call([sys.executable, "-m", "pip", "install", "pillow"])
        from PIL import Image, ImageOps

    original_path = "Bảng Giá CHung (1).jpg"
    target_path = os.path.join("public", "bang-gia-chung.jpg")

    if not os.path.exists(original_path):
        print("Error: Original pricing image file not found.")
        return

    print("Opening original image...")
    img = Image.open(original_path)
    width, height = img.size

    # Convert to grayscale
    gray = img.convert("L")

    # Invert grayscale (white becomes black, black borders/text become bright white)
    inverted = ImageOps.invert(gray)

    # Apply threshold to filter out tiny background noise/artifacts
    thresholded = inverted.point(lambda p: 255 if p > 25 else 0)

    # Get the bounding box of the non-black elements in the inverted image
    bbox = thresholded.getbbox()

    if bbox:
        # Add a nice 15px padding around the table
        padding = 15
        left = max(0, bbox[0] - padding)
        top = max(0, bbox[1] - padding)
        right = min(width, bbox[2] + padding)
        bottom = min(height, bbox[3] + padding)

        print(f"Detected table boundaries: left={left}, top={top}, right={right}, bottom={bottom}")
        cropped = img.crop((left, top, right, bottom))
        
        # Ensure public folder exists
        os.makedirs(os.path.dirname(target_path), exist_ok=True)
        
        cropped.save(target_path, quality=95)
        print(f"Successfully cropped table from {img.size} to {cropped.size} and saved to {target_path}!")
    else:
        print("Could not detect table boundaries. Saving original as fallback.")
        img.save(target_path, quality=95)

if __name__ == "__main__":
    install_and_run()
