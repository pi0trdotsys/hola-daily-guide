"""Generuje splash screen z brandingiem NullPointerStudio (future-tech minimalism).
Układ: granatowe tło + siatka + znak null pointer (cyan) + wordmark + podpis studio.
Pobiera wymiary wszystkich istniejących splash.png i renderuje z proporcjonalnym skalowaniem.
"""
import os
from PIL import Image, ImageDraw, ImageFont

NAVY = (11, 16, 23, 255)
CYAN = (77, 212, 224, 255)
GOLD = (255, 196, 0, 255)
TEXT_SOFT = (200, 214, 226, 255)
MUTED = (150, 166, 180, 255)

RES = os.path.dirname(os.path.abspath(__file__))
SPLASH_DIR = os.path.join(RES, "android", "app", "src", "main", "res")


def find_splash_files(base):
    out = []
    for root, _dirs, files in os.walk(base):
        for f in files:
            if f == "splash.png":
                out.append(os.path.join(root, f))
    return out


def load_font(size):
    candidates = [
        "/System/Library/Fonts/Supplemental/Arial.ttf",
        "/System/Library/Fonts/Supplemental/Helvetica.ttf",
        "/Library/Fonts/Arial Unicode.ttf",
    ]
    for c in candidates:
        if os.path.exists(c):
            try:
                return ImageFont.truetype(c, size)
            except Exception:
                pass
    return ImageFont.load_default()


def draw_grid(d, w, h, step, color):
    x = 0
    while x < w:
        d.line([(x, 0), (x, h)], fill=color, width=1)
        x += step
    y = 0
    while y < h:
        d.line([(0, y), (w, y)], fill=color, width=1)
        y += step


def null_mark(d, cx, cy, R, color=CYAN):
    R = int(R)
    d.rectangle([cx - R, cy - R, cx + R, cy + R], outline=(color[0], color[1], color[2], 130), width=max(1, R // 8))
    cr = R * 0.58
    d.ellipse([cx - cr, cy - cr, cx + cr, cy + cr], outline=color, width=max(1, R // 7))
    k = 0.707 * cr
    d.line([(cx - k, cy - k), (cx + k, cy + k)], fill=color, width=max(1, R // 9))
    dr = R * 0.12
    d.ellipse([cx - dr, cy - dr, cx + dr, cy + dr], fill=color)


def render_splash(w, h):
    img = Image.new("RGB", (w, h), NAVY)
    d = ImageDraw.Draw(img)
    draw_grid(d, w, h, 40, (255, 255, 255, 12))

    short = min(w, h)
    # znak w górnej części
    mark_r = int(short * 0.16)
    mark_cy = int(h * 0.34)
    null_mark(d, w // 2, mark_cy, mark_r)

    # wordmark: "Przewodnik"
    f_big = load_font(int(short * 0.075))
    big = "PRZEWODNIK"
    # wersaliki z trackingiem (rysowanie ręczne)
    letter_w = int(short * 0.075 * 0.62)
    total = len(big) * letter_w
    x0 = (w - total) // 2
    d.text((x0, mark_cy + mark_r * 1.5), big, font=f_big, fill=TEXT_SOFT, spacing=letter_w - f_big.getbbox("A")[2])

    # pod marką: "Hiszpania 2026"
    f_mid = load_font(int(short * 0.038))
    mid = "Hiszpania · 2026"
    bb = d.textbbox((0, 0), mid, font=f_mid)
    tw = bb[2] - bb[0]
    d.text(((w - tw) // 2, mark_cy + mark_r * 2.1), mid, font=f_mid, fill=CYAN)

    # stopka: NullPointerStudio
    f_small = load_font(int(short * 0.026))
    foot = "null pointer · studio"
    bb = d.textbbox((0, 0), foot, font=f_small)
    tw = bb[2] - bb[0]
    d.text(((w - tw) // 2, h - int(short * 0.07)), foot, font=f_small, fill=MUTED)

    return img


def main():
    files = find_splash_files(SPLASH_DIR)
    for f in files:
        with Image.open(f) as im:
            w, h = im.size
        out = render_splash(w, h)
        out.save(f, "PNG")
        print(f"  {os.path.relpath(f, SPLASH_DIR)} -> {w}x{h}")
    print("Splash NullPointerStudio wygenerowany.")


if __name__ == "__main__":
    main()