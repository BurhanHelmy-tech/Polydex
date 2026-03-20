import os
from rembg import remove
from PIL import Image

for file in os.listdir('.'):
    if file.endswith('.png') and not file.endswith('_nobg.png'):
        input_path = file
        output_path = file.replace('.png', '_nobg.png')
        if os.path.exists(output_path):
            continue
        try:
            print(f"Processing {input_path}...")
            inp = Image.open(input_path)
            out = remove(inp)
            out.save(output_path)
            print(f"Saved {output_path}")
        except Exception as e:
            print(f"Error processing {input_path}: {e}")
