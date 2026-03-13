# Smart Card Addition System

## Endpoint
`POST /api/portfolio/smart-add`

## How It Works
One API call → auto-detects everything → adds card with correct price, image, and metadata.

```
Input → Franchise Detection → Price Scraping → Image Fetch → Insert + Return
```

## Pricing Rules (hardcoded)
```
Pokemon (any grade) → SNKR Dunk (IQR-filtered average)
One Piece PSA 10    → SNKR Dunk (IQR-filtered average)  
One Piece Raw       → Yuyu-tei (manual JPY or auto-scrape URL)
```

## Required Fields
| Field | Type | Example |
|-------|------|---------|
| `card_code` | string | `"OP12-037"`, `"349/190"` |
| `card_name` | string | `"Ashura Ichibugin (Zoro Parallel)"` |
| `franchise` | string | `"one_piece"` or `"pokemon"` |
| `cost_idr` | number | `2200000` |

## Optional Fields
| Field | Type | Notes |
|-------|------|-------|
| `grade` | string | `"PSA 10"` or `"Raw"` (default: Raw) |
| `rarity` | string | `"Parallel"`, `"SP"`, `"SEC"`, `"BWR"`, `"SAR"` |
| `set_name` | string | `"OP12 - Bond of Bonds"` |
| `yuyu_tei_url` | string | Yuyu-tei product page URL (auto-scrapes price) |
| `yuyu_tei_jpy` | number | Manual JPY price (overrides URL scrape) |
| `language` | string | `"JP"` (default), `"ID"`, `"EN"` |
| `cost_usd` | number | Auto-calculated from IDR if not provided |
| `notes` | string | Any notes |

## Examples

### One Piece PSA 10 Slab
```json
{
  "card_code": "OP01-025",
  "card_name": "Roronoa Zoro (Flagship Battle)",
  "franchise": "one_piece",
  "grade": "PSA 10",
  "cost_idr": 12000000
}
```
→ Searches SNKR Dunk for `OP01-025 PSA`
→ Finds most common apparel ID among PSA10 listings
→ IQR-filters prices, takes average
→ Gets og:image from product page
→ Inserts with all metadata

### One Piece Raw Single (with Yuyu-tei URL)
```json
{
  "card_code": "OP12-037",
  "card_name": "Ashura Ichibugin (Zoro Parallel)",
  "franchise": "one_piece",
  "rarity": "Parallel",
  "cost_idr": 2200000,
  "yuyu_tei_url": "https://yuyu-tei.jp/sell/opc/card/op12/10046"
}
```
→ Scrapes Yuyu-tei page for JPY price
→ Converts to USD/IDR
→ Skips SNKR Dunk (OP singles rule)

### One Piece Raw Single (manual JPY)
```json
{
  "card_code": "OP13-080",
  "card_name": "St. Nusjuro (Red Parallel)",
  "franchise": "one_piece",
  "rarity": "Parallel",
  "cost_idr": 1780000,
  "yuyu_tei_jpy": 17800
}
```

### Pokemon PSA 10 Slab
```json
{
  "card_code": "349/190",
  "card_name": "Charizard ex",
  "franchise": "pokemon",
  "grade": "PSA 10",
  "rarity": "SAR",
  "cost_idr": 5000000
}
```
→ Searches SNKR Dunk for `349/190 PSA`
→ IQR average of PSA10 listings
→ Auto-detects apparel ID

### Non-JP Slab (Indonesian EGS)
```json
{
  "card_code": "347/190",
  "card_name": "Mew ex SAR",
  "franchise": "pokemon",
  "grade": "EGS 9",
  "language": "ID",
  "cost_idr": 3000000,
  "yuyu_tei_jpy": 27650
}
```
→ Sets `skip_snkr_scraper: true` (won't be overwritten by auto-scraper)
→ Uses manual JPY as price

## Auto-Scraper Behavior
The `/api/portfolio/update-prices` cron respects:
- `snkr_apparel_id` in metadata → matches exact SNKR Dunk product
- `skip_snkr_scraper: true` → skips card entirely
- IQR outlier removal on all PSA10 averages
- OP raw singles always use `yuyu_tei_jpy` from metadata

## Response
Returns the inserted card row + `_summary` object:
```json
{
  "id": "uuid",
  "card_name": "...",
  "_summary": {
    "cost": "Rp 12,000,000 ($731.71)",
    "market_price": "$2,476 (¥369,495)",
    "roi": "238.4%",
    "price_source": "snkrdunk",
    "image_found": true,
    "apparel_id": "106779"
  }
}
```
