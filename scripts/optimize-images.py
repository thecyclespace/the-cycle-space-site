"""Responsive image pipeline (Pillow). Originals are kept OUTSIDE the repo bundle.

    python scripts/optimize-images.py

Reads PNG sources from assets-source/site-originals/ (git-ignored, ~47 MB),
writes AVIF + WebP at several widths to public/images/site/ and the manifest
src/content/images.manifest.json used by the <Picture> component.
Add a file name to USED to publish it. Not needed day-to-day: Elsa never runs this.
"""
import json
import os
import shutil
import sys
from PIL import Image

Image.MAX_IMAGE_PIXELS = None
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "assets-source", "site-originals")
OUT = os.path.join(ROOT, "public", "images", "site")
MANIFEST = os.path.join(ROOT, "src", "content", "images.manifest.json")
WIDTHS = [480, 800, 1200]  # sources are 1448 px wide: never upscale

USED = [
    "01_hero_home", "04_consultation_online", "08_journal_planner", "20_abstract_landscape",
    "09_home_interior", "07_tea_wellbeing", "05_woman_back_sun", "19_flower_flatlay",
    "03_flower_nature", "12_moon_phases",
]

VARIANTS = os.path.join(OUT, "variantes")  # lighter versions; the admin only lists the main files
os.makedirs(VARIANTS, exist_ok=True)
manifest = {}
total = 0
for name in USED:
    path = os.path.join(SRC, f"{name}.png")
    if not os.path.exists(path):
        sys.exit(f"missing source: {path}")
    im = Image.open(path).convert("RGB")
    w0, h0 = im.size
    widths = [w for w in WIDTHS if w <= w0]  # 1200 px is enough for a half-width hero at 1440 px
    for w in widths:
        h = round(h0 * w / w0)
        resized = im.resize((w, h), Image.LANCZOS) if w != w0 else im
        for ext, kw in (("webp", {"quality": 74, "method": 6}), ("avif", {"quality": 52, "speed": 6})):
            fn = os.path.join(VARIANTS, f"{name}-{w}.{ext}")
            resized.save(fn, **kw)
            total += os.path.getsize(fn)
    # Main file: the one the admin shows and stores ("/images/site/<name>.webp").
    shutil.copyfile(os.path.join(VARIANTS, f"{name}-{widths[-1]}.webp"), os.path.join(OUT, f"{name}.webp"))
    manifest[name] = {"width": w0, "height": h0, "widths": widths}
    print(f"{name}: {widths}")

with open(MANIFEST, "w", encoding="utf8") as f:
    json.dump(manifest, f, indent=2)
    f.write("\n")
print(f"{len(USED)} images, {total / 1024:.0f} KB total in {OUT}")
