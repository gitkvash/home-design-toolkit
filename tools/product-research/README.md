# product-research

Standard-library Python helpers to compare building and interior products across shops in any country.

- `common.py`: `num`, `size_cm`, `per_m2`, `unit_warning`, `dedupe_key`, a polite `get()` (robots.txt, per-host delay, back-off) and `save`.
- `shopify_example.py`: a complete example scraper for any Shopify store's public `/products.json`.
- `test_common.py`: run `python -m unittest` in this folder.

## Rules for scraping (read before you run anything)

1. Read the shop's **terms and robots.txt**. If automated access is not allowed, do not scrape. Browse manually or ask for a price list.
2. **Rate-limit**: one request at a time per host, ≥ 1.5 s apart; nightly at most.
3. **Identify yourself** with an honest User-Agent (see `USER_AGENT`).
4. **Keep the data private**: use it for your own comparison. Do not republish photos, descriptions or price lists.
5. **Never auto-fix** a doubtful unit; show it and let a person decide.
6. Always show the **date** of a price.

## Typical record

```
{"shop","id","url","name","brand","category","unit":"m2|box|pc|roll","price","priceM2","sizeCm":[w,h],"boxM2","how","warn"}
```

Add a new shop by copying `shopify_example.py`, replacing `parse()`. For WooCommerce use `/wp-json/wc/store/products`; for
JS-rendered shops look for a JSON state blob in the page source before trying HTML parsing.
