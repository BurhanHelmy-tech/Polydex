import os
from rembg import remove, new_session
from PIL import Image

input_path = "Decagon_(10_sides).png"
output_path = "Decagon_(10_sides)_nobg.png"

try:
    print(f"Processing {input_path} with isnet-general-use...")
    session = new_session("isnet-general-use")
    inp = Image.open(input_path)
    out = remove(inp, session=session)
    out.save(output_path)
    print(f"Successfully saved {output_path}")
except Exception as e:
    print(f"Error: {e}")
