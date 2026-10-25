"""Render the simple app icon using only the Python standard library."""
import struct
import zlib
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent / 'packaging' / 'fnos'


def icon(size):
    rows = []
    for y in range(size):
        row = bytearray([0])
        for x in range(size):
            px, py = x * 256 / size, y * 256 / size
            color = (37, 99, 235, 255)
            if 36 <= px < 220 and 76 <= py < 180:
                color = (248, 250, 252, 255)
            if (64 <= px < 112 and 116 <= py < 132) or (80 <= px < 96 and 100 <= py < 148):
                color = (30, 41, 59, 255)
            if (px - 162) ** 2 + (py - 134) ** 2 < 15 ** 2:
                color = (239, 68, 68, 255)
            if (px - 194) ** 2 + (py - 110) ** 2 < 15 ** 2:
                color = (239, 68, 68, 255)
            if 116 <= px < 136 and 148 <= py < 154:
                color = (100, 116, 139, 255)
            row.extend(color)
        rows.append(bytes(row))

    def chunk(kind, data):
        return struct.pack('>I', len(data)) + kind + data + struct.pack('>I', zlib.crc32(kind + data))

    return b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', struct.pack('>IIBBBBB', size, size, 8, 6, 0, 0, 0)) + chunk(b'IDAT', zlib.compress(b''.join(rows))) + chunk(b'IEND', b'')


for size, names in [(64, ['ICON.PNG', 'app/ui/images/icon_64.png']),
                    (256, ['ICON_256.PNG', 'app/ui/images/icon_256.png'])]:
    for name in names:
        target = ROOT / name
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(icon(size))
