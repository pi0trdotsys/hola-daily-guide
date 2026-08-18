"""Generuje ikony aplikacji (adaptive + legacy) w stylu future-tech minimalism.
Motyw: granatowe tło z delikatną siatką + znak "null pointer" (ramka + okrąg +
przekątna + kropka) w kolorze cyan — znak NullPointerStudio.

Generuje też favicon dla www.
"""
import math
import os
from PIL import Image, ImageDraw

NAVY = (11, 16, 23, 255)
NAVY_OPAQUE = (11, 16, 23, 255)
CYAN = (77, 212, 224, 255)
CYAN_SOFT = (110, 228, 238, 90)
GOLD = (255, 196, 0, 255)

RES = os.path.dirname(os.path.abspath(__file__))
MIPMAP = os.path.join(RES, "android", "app", "src", "main", "res")


def draw_grid(d, size, step, color, width=1):
    s = size
    k = step
    n = 0
    while k * n < s:
        d.line([(k * n, 0), (k * n, s)], fill=color, width=width)
        d.line([(0, k * n), (s, k * n)], fill=color, width=width)
        n += 1


def null_mark(d, cx, cy, R, color=CYAN):
    """Znak null pointer: ramka, okrąg, przekątna, kropka (wg specu Logo)."""
    R = int(R)
    # ramka kwadratowa (opacity ~0.5)
    d.rectangle([cx - R, cy - R, cx + R, cy + R], outline=(color[0], color[1], color[2], 130), width=max(1, R // 8))
    # okrąg
    cr = R * 0.58
    d.ellipse([cx - cr, cy - cr, cx + cr, cy + cr], outline=color, width=max(1, R // 7))
    # przekątna (od lewego-górnego do prawego-dolnego rogu okręgu)
    k = 0.707 * cr  # cos 45
    d.line([(cx - k, cy - k), (cx + k, cy + k)], fill=color, width=max(1, R // 9))
    # kropka w centrum
    dr = R * 0.12
    d.ellipse([cx - dr, cy - dr, cx + dr, cy + dr], fill=color)


def render(size, with_bg, round_mask=False, motif_scale=0.82):
    img = Image.new("RGBA", (size, size), NAVY if with_bg else (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    cx = size / 2
    cy = size / 2
    if with_bg:
        draw_grid(d, size, max(8, size // 12), (255, 255, 255, 14))
    # adaptive foreground: mniejsza safe zone (66%)
    R = (size / 2) * (0.34 if not with_bg else motif_scale * 0.42)
    null_mark(d, int(cx), int(cy), int(R), CYAN)
    if round_mask:
        mask = Image.new("L", (size, size), 0)
        ImageDraw.Draw(mask).ellipse([0, 0, size - 1, size - 1], fill=255)
        img.putalpha(mask)
    return img


def save(img, path):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    img.save(path, "PNG")


DENS_LEGACY = {"mdpi": 48, "hdpi": 72, "xhdpi": 96, "xxhdpi": 144, "xxxhdpi": 192}
DENS_FG = {"mdpi": 108, "hdpi": 162, "xhdpi": 216, "xxhdpi": 324, "xxxhdpi": 432}

for dens, size in DENS_LEGACY.items():
    save(render(size, with_bg=True), os.path.join(MIPMAP, f"mipmap-{dens}", "ic_launcher.png"))
    save(render(size, with_bg=True, round_mask=True), os.path.join(MIPMAP, f"mipmap-{dens}", "ic_launcher_round.png"))

for dens, size in DENS_FG.items():
    save(render(size, with_bg=False), os.path.join(MIPMAP, f"mipmap-{dens}", "ic_launcher_foreground.png"))

# favicon dla www
WWW = os.path.join(RES, "www")
save(render(192, with_bg=True), os.path.join(WWW, "favicon.png"))
save(render(512, with_bg=True), os.path.join(WWW, "icon.png"))

print("Ikony future-tech wygenerowane (app + www).")