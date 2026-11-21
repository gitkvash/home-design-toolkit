"""Helpers for comparing building products across shops, in any country or currency.

Standard library only. Read the shop's robots.txt and terms first; see README.md.
Everything here normalises messy shop data into one record shape so prices compare:

    {shop, id, url, name, brand, category, unit, price, priceM2, sizeCm, boxM2, currency}
"""
import json
import re
import time
import urllib.parse
import urllib.request
import urllib.robotparser

USER_AGENT = "home-design-toolkit-research/1.0 (personal renovation research; polite, rate-limited)"
_last = {}


def num(text):
    """'1 234,50 ₾' / '1,234.50' / '12.5' -> float. Returns None if there is no number."""
    if text is None:
        return None
    s = re.sub(r"[^\d.,\-]", "", str(text))
    if not re.search(r"\d", s):
        return None
    if "," in s and "." in s:  # the last separator is the decimal point
        dec = "," if s.rfind(",") > s.rfind(".") else "."
        thou = "." if dec == "," else ","
        s = s.replace(thou, "").replace(dec, ".")
    elif "," in s:
        head, _, tail = s.rpartition(",")
        s = head.replace(",", "") + ("." + tail if len(tail) != 3 else tail)  # 1,234 = thousands, 12,5 = decimal
    return float(s)


def size_cm(text):
    """'60x120', '60 × 120 cm', '600*1200 mm', '0,53x10,05 m' -> (a, b) in cm, or None."""
    m = re.search(r"(\d+[.,]?\d*)\s*[x×*]\s*(\d+[.,]?\d*)\s*(mm|cm|m)?", str(text), re.I)
    if not m:
        return None
    a, b = num(m.group(1)), num(m.group(2))
    unit = (m.group(3) or "").lower()
    if unit == "mm" or (not unit and max(a, b) >= 300):
        a, b = a / 10, b / 10
    elif unit == "m":
        a, b = a * 100, b * 100
    return (round(a, 1), round(b, 1))


def per_m2(price, unit, size=None, box_m2=None):
    """Convert a shop price to price per m2. unit: 'm2' | 'box' | 'pc' (piece) | 'roll'.
    Returns (value or None, how). Never silently 'fixes' a doubtful unit: flag it instead."""
    if price is None:
        return None, "no price"
    if unit == "m2":
        return price, "as listed"
    if unit == "box" and box_m2:
        return price / box_m2, "price / box m2"
    if unit in ("pc", "roll") and size:
        area = size[0] * size[1] / 10000
        if area > 0:
            return price / area, "price / piece area"
    return None, "unit unknown"


def unit_warning(price_m2):
    """Flag, never change: a floor/wall product above ~1000/m2 is probably a per-piece price read as per-m2."""
    return price_m2 is not None and price_m2 > 1000


def dedupe_key(rec):
    """Same product in several shops -> same key. Strict on purpose: a wrong merge is worse than two cards."""
    name = re.sub(r"[^a-z0-9]+", " ", (rec.get("name") or "").lower()).strip()
    size = rec.get("sizeCm") or ()
    return (rec.get("brand", "").lower(), name, tuple(round(x) for x in size))


class Robots:
    def __init__(self, base):
        self.rp = urllib.robotparser.RobotFileParser(urllib.parse.urljoin(base, "/robots.txt"))
        try:
            self.rp.read()
        except Exception:
            self.rp = None  # unreachable robots.txt: be conservative elsewhere (slow down)

    def ok(self, url):
        return True if self.rp is None else self.rp.can_fetch(USER_AGENT, url)


def get(url, delay=1.5, retries=3, robots=None):
    """Polite GET: honours robots.txt, spaces requests per host, backs off on 429/5xx."""
    if robots and not robots.ok(url):
        raise PermissionError(f"robots.txt disallows {url}")
    host = urllib.parse.urlparse(url).netloc
    for attempt in range(retries):
        wait = _last.get(host, 0) + delay - time.time()
        if wait > 0:
            time.sleep(wait)
        _last[host] = time.time()
        req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
        try:
            with urllib.request.urlopen(req, timeout=30) as r:
                return r.read().decode("utf-8", "replace")
        except Exception as e:  # noqa: BLE001
            if attempt == retries - 1:
                raise
            time.sleep(delay * (attempt + 2) * 2)
    return ""


def save(shop, records, out_dir="out"):
    import os
    os.makedirs(out_dir, exist_ok=True)
    with open(os.path.join(out_dir, f"{shop}.json"), "w", encoding="utf-8") as f:
        json.dump(records, f, ensure_ascii=False, indent=1)
