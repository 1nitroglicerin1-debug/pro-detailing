# -*- coding: utf-8 -*-
"""Финальная точная вырезка логотипа PRO-DETAILING.

По ASCII-карте баннера установлено точное окно логотипа:
  синее "PRO" у (100,23)-(154,86), хром "DETAILING" на y~108-124, до x~300.
Окно берём с запасом и делаем тёмный фон прозрачным."""
import os
from PIL import Image

SRC = r"C:\Users\Максим\Desktop\ref_prodetailing.jpg"
DST_DIR = r"C:\Users\Максим\Desktop\deepseek\projects_memory\pro-detailing\assets"
DST = os.path.join(DST_DIR, "logo.png")
os.makedirs(DST_DIR, exist_ok=True)

im = Image.open(SRC).convert("RGB")

# окно логотипа (x0, y0, x1, y1) — расширенное, чтобы захватить весь DETAILING
X0, Y0, X1, Y1 = 0, 0, 520, 210
crop = im.crop((X0, Y0, X1, Y1)).convert("RGBA")

dat = list(crop.getdata())
new = []
for (r, g, b, a) in dat:
    # тёмный/чёрный фон баннера -> прозрачный (яркий текст и неон оставляем)
    if (r + g + b) < 260:
        new.append((r, g, b, 0))
    else:
        new.append((r, g, b, 255))
crop.putdata(new)
crop.save(DST)
print("saved=%s -> %dx%d" % (DST, crop.width, crop.height))
