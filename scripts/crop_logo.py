from PIL import Image
import sys
import os

src = sys.argv[1] if len(sys.argv) > 1 else r'statics\products\img\LOGO PNG 1.png'

if not os.path.exists(src):
    print(f"Archivo no encontrado: {src}")
    sys.exit(1)

img = Image.open(src)
if img.mode != 'RGBA':
    img = img.convert('RGBA')

pixels = img.load()
w, h = img.size
xmin, ymin, xmax, ymax = w, h, 0, 0
for y in range(h):
    for x in range(w):
        if pixels[x, y][3] > 0:
            if x < xmin:
                xmin = x
            if x > xmax:
                xmax = x
            if y < ymin:
                ymin = y
            if y > ymax:
                ymax = y

cropped = img.crop((xmin, ymin, xmax + 1, ymax + 1))
cropped.save(src)
print(f"Logo recortado: {w}x{h} -> {cropped.size[0]}x{cropped.size[1]}")
