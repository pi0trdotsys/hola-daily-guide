"""Generuje ikony aplikacji (adaptive + legacy) w motywie Hiszpanii.
Słońce w barwach flagi Hiszpanii (złoto/czerwień) + pinezka mapa na granatowym tle.
"""
import math
import os
from PIL import Image, ImageDraw

NAVY = (11, 16, 23, 255)      # ink tła (spójne z motywem)
NAVY_OPAQUE = (11, 16, 23, 255)
GOLD = (255, 196, 34, 255)
RED = (198, 11, 30, 255)
WHITE = (255, 244, 224, 255)

RES = os.path.dirname(os.path.abspath(__file__))
MIPMAP = os.path.join(RES, "android", "app", "src", "main", "res")


def sun_motif(draw, cx, cy, R):
    """Rysuje słońce (promienie naprzemienne złoto/czerwień) + białą pinezkę."""
    n = 8
    half = math.pi / n
    ray_inner = R * 0.42
    ray_outer = R * 0.98
    disc_r = R * 0.34
    for i in range(n):
        ang = i * (2 * math.pi / n) - math.pi / 2
        color = GOLD if i % 2 == 0 else RED
        a1 = ang - half
        a2 = ang + half
        pts = [
            (cx + ray_inner * math.cos(a1), cy + ray_inner * math.sin(a1)),
            (cx + ray_outer * math.cos(ang), cy + ray_outer * math.sin(ang)),
            (cx + ray_inner * math.cos(a2), cy + ray_inner * math.sin(a2)),
        ]
        draw.polygon(pts, fill=color)
    draw.ellipse([cx - disc_r, cy - disc_r, cx + disc_r, cy + disc_r], fill=GOLD)

    # biała pinezka (lokalizacja / przewodnik)
    head_r = R * 0.13
    hx, hy = cx, cy - R * 0.04
    draw.ellipse([hx - head_r, hy - head_r, hx + head_r, hy + head_r], fill=WHITE)
    tip = (cx, cy + R * 0.22)
    draw.polygon(
        [(hx - head_r * 0.88, hy + head_r * 0.5), (hx + head_r * 0.88, hy + head_r * 0.5), tip],
        fill=WHITE,
    )
    # otwór pinezki
    draw.ellipse([hx - head_r * 0.38, hy - head_r * 0.38, hx + head_r * 0.38, hy + head_r * 0.38], fill=GOLD)


def render(size, with_bg, round_mask=False):
    img = Image.new("RGBA", (size, size), NAVY if with_bg else (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    cx = size / 2
    cy = size / 2
    # motyw w bezpiecznej strefie (adaptive safe zone = 66% średnicy)
    if with_bg:
        motif_R = size / 2 * 0.92
    else:
        motif_R = size / 2 * 0.58
    sun_motif(d, cx, cy, motif_R)
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

print("Ikony wygenerowane (app + www).")
