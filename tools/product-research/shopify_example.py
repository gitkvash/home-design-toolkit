"""Example scraper for a Shopify-based shop: reads the public /products.json feed.

    python shopify_example.py https://example-shop.com "floor" --limit 50

Most small tile / flooring / paint shops run on Shopify, WooCommerce or a custom JSON API, so
one small script per shop is usually enough. Only fetch what the shop publishes, slowly, and
keep the output for your own comparison (do not republish it: see README.md).
"""
import argparse
import json
import re

import common


def parse(shop, base, p):
    v = (p.get("variants") or [{}])[0]
    price = common.num(v.get("price"))
    text = " ".join([p.get("title", ""), p.get("body_html") or ""])
    size = common.size_cm(text)
    box = None
    m = re.search(r"(\d+[.,]\d+)\s*m(?:2|²)\s*(?:/|per)\s*(?:box|pack)", text, re.I)
    if m:
        box = common.num(m.group(1))
    unit = "box" if box else "pc" if size else "unknown"
    pm2, how = common.per_m2(price, unit, size, box)
    return {
        "shop": shop, "id": p.get("id"), "url": f"{base}/products/{p.get('handle')}",
        "name": p.get("title"), "brand": p.get("vendor", ""), "category": p.get("product_type", ""),
        "unit": unit, "price": price, "priceM2": round(pm2, 2) if pm2 else None, "how": how,
        "sizeCm": size, "boxM2": box, "warn": common.unit_warning(pm2),
    }


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("base")
    ap.add_argument("query", nargs="?", default="")
    ap.add_argument("--limit", type=int, default=50)
    a = ap.parse_args()
    base = a.base.rstrip("/")
    robots = common.Robots(base)
    out, page = [], 1
    while len(out) < a.limit:
        data = json.loads(common.get(f"{base}/products.json?limit=50&page={page}", robots=robots))
        items = data.get("products", [])
        if not items:
            break
        out += [parse(base.split("//")[-1], base, p) for p in items if a.query.lower() in p.get("title", "").lower()]
        page += 1
    common.save(base.split("//")[-1].replace("/", "_"), out[: a.limit])
    print(f"saved {len(out[:a.limit])} products")


if __name__ == "__main__":
    main()
