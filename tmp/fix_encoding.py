#!/usr/bin/env python3
"""Fix corrupted UTF-8 characters in pdfgpt.html"""
import sys

filepath = sys.argv[1]

# Read file as bytes
with open(filepath, 'rb') as f:
    data = f.read()

# The corrupted pattern is: 0xEF 0xBF 0xBD (U+FFFD) followed by zero or more 0x3F (?)
# We know what the characters should be based on context

replacements = [
    # "CONFIGURACI" + U+FFFD + "?" + "N" -> "CONFIGURACIÓ" + "N"
    (b'CONFIGURACI\xef\xbf\xbd\x3fN', b'CONFIGURACI\xc3\x93N'),
    # "ECON" + U+FFFD + "?" + "MICOS" -> "ECONÓ" + "MICOS"
    (b'ECON\xef\xbf\xbd\x3fMICOS', b'ECON\xc3\x93MICOS'),
    # "EST" + U+FFFD + "NDAR" -> "ESTÁ" + "NDAR"
    (b'EST\xef\xbf\xbdNDAR', b'EST\xc3\x81NDAR'),
    # "fotovoltaico " + U+FFFD + "??" + " " -> "fotovoltaico — " (em dash)
    (b'fotovoltaico \xef\xbf\xbd\x3f\x3f ', b'fotovoltaico \xe2\x80\x94 '),
    # "CODENSOLAR " + U+FFFD + "??" + " Energ" -> "CODENSOLAR — Energ"
    (b'CODENSOLAR \xef\xbf\xbd\x3f\x3f Energ', b'CODENSOLAR \xe2\x80\x94 Energ'),
]

for old, new in replacements:
    count = data.count(old)
    if count > 0:
        data = data.replace(old, new)
        print(f"Fixed {count} occurrence(s) of corrupt sequence (new: {new})")
    else:
        # Try without the trailing byte
        print(f"Not found: {old[:20]}...")

with open(filepath, 'wb') as f:
    f.write(data)

print("Done")
