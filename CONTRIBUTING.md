# Contributing

Useful contributions:

- **Country notes**: which shop types and data feeds exist, typical units, regulations that change a
  rule (electrical zones, gas, waterproofing). Put them in `docs/countries/<country>.md`.
- **New skills** for rooms or trades not covered (balcony, home office, children's rooms, heating, ventilation, acoustics).
- **Tool improvements**: the audit (more door kinds, curved walls, multi-room routes).
- **Translations** of README and skills.
- **Lessons**: what went wrong in your project. Add a short entry to `docs/lessons-learned.md`.

Rules: no personal data (addresses, photos of people, order numbers), no scraped shop data, no copyrighted images.
Run the tests before a pull request:

```
node --test tools/clash-audit/audit.test.mjs
```
