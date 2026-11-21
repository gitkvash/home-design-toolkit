---
name: product-research
description: Find and compare building and interior products (flooring, tiles, wallpaper, paint, radiators, fixtures, furniture) across local shops in any country, normalise prices to per m2 or per kW, dedupe the same product across shops, and track what is bought. Use when the owner asks what to buy, where it is cheaper, or wants a catalogue of local options.
---

# Product research

The example project scraped ~29 local shops into one comparable catalogue (parquet, laminate, SPC, porcelain,
floor and wall tile, mosaic, wallpaper, radiators, skirting). The method transfers to any market.

## 1. Find sources

1. List the shops the owner would actually visit or order from (hypermarkets, tile importers, specialist floor shops,
   marketplaces). Ask which ones deliver or accept installments.
2. For each shop, identify how data is exposed, cheapest first: a **public JSON feed** (Shopify `/products.json`,
   WooCommerce Store API), then a **framework state blob** (Next.js `__NEXT_DATA__`), then HTML listing pages.
3. Look at the shop's **robots.txt and terms** before fetching. If scraping is disallowed, do not scrape: browse by
   hand or ask the shop for a price list. Rate-limit (≥ 1.5 s between requests; one request at a time per host), identify
   yourself, cache results, and never republish scraped data. See `tools/product-research/README.md`.

## 2. Normalise to one record

```
shop, id, url, name, brand, category, unit (m2|box|pc|roll), price, priceM2, sizeCm, boxM2, currency
```

`tools/product-research/common.py` has `num()` (handles 1 234,50 / 1,234.50), `size_cm()` (60x120, 600*1200 mm),
`per_m2()` and `dedupe_key()`.

## 3. The traps (all hit in practice)

- **Unit of price.** m² vs box vs piece vs roll. Read it from the page; keep the shop's own price text beside the
  normalised value so the owner can verify. A price above ~1000/m² for floor or wall tile is almost certainly a
  per-piece price: **flag it, never auto-correct** (an expensive product looks the same as a misread one).
- **Sale vs list price.** Store the price paid today and the crossed-out price; show discount %.
- **Shops with no prices** (catalogue only, or hidden prices as 1.00) are kept as a catalogue and listed separately.
- **Ranges.** Some shops give only a price list by thickness: store low and high and sort by the low end.
- **Accessories pollute categories.** Drop borders, listellos, inserts, steps, corners, caps and connectors by name
  (in the local language and in English/Italian/Spanish abbreviations).
- **Same product in several shops** should be one card with a "cheapest shop" and a list of all shops. Be strict:
  same kind, size within 1.5 mm, brand, same model words (or decor code + thickness), no contradiction in finish,
  thickness or class, price per m² within 2.5×. A wrong merge is worse than two cards.
- **Update politely.** One run a night is plenty; hourly was too heavy for the shops (a full scrape is ~25k page loads).
  Keep the old data if a run fails or finds under half the usual products. Stagger requests; some shops (Shopify)
  rate-limit clients that echo their cookies, so drop session cookies.
- **Prices change; stock changes.** Say "as of <date>" everywhere.

## 4. Present for decisions

- Cards in price per m² (or per kW for radiators), the shop list cheapest first, a "how much do I need" calculator
  from the room's area with the right reserve, a compare table highlighting differences only.
- A **buy list grouped by shop** with ticks ("bought") and a budget bar, plus "X is ~N cheaper at shop Y" hints.
- Filters people actually use: colour family, laying pattern (plank / 3-strip / herringbone / chevron), wear layer,
  underfloor heating, rectified, outdoor, washable, "plain" and "warm" for wallpaper.

## 5. What the owner should still do

See the physical sample in the room's light; ask for a batch number and buy all of one batch together; confirm the
delivery date and the return policy for cut materials; keep receipts for warranty.
