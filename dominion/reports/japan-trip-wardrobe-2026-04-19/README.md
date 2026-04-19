# Japan Trip Wardrobe + Shoes + Thrift Update — 2026-04-19

Built during THRONE migration session. The work is committed on
`claude/wardrobe-shoes-thrift` in this session's local clone of
`zexoverz/japan-trip`, but **could not be pushed** — this session has no
GitHub credentials for the japan-trip repo (only `zexoverz/dominion` is
proxied through the local git server).

This directory preserves the changes so Faisal can apply them locally.

## Files

- **`Wardrobe.jsx`** — full new component. Drop into
  `japan-trip/src/components/Wardrobe.jsx`.
- **`wardrobe-shoes-thrift.patch`** — git patch with all 5 file changes
  (Wardrobe.jsx + Itinerary.jsx + PackingChecklist.jsx + Navbar.jsx + App.jsx).

## How to apply on your local japan-trip checkout

```bash
cd ~/path/to/japan-trip
git checkout -b claude/wardrobe-shoes-thrift
git am < /path/to/wardrobe-shoes-thrift.patch
npm run build   # verify clean
git push -u origin claude/wardrobe-shoes-thrift
# merge to main, redeploy gh-pages
```

If `git am` complains, use `git apply` instead:

```bash
git apply /path/to/wardrobe-shoes-thrift.patch
git add .
git commit -m "feat: add Wardrobe section + hiking-shoe shopping + thrift map"
git push -u origin claude/wardrobe-shoes-thrift
```

## What it adds

### New: Wardrobe section (`#wardrobe` in nav, 旅装)

3 tabs:
1. **Daily Outfits** — collapsible per day, Faisal + Keiko side-by-side
   with photo aesthetic notes (Day 7 pre-wedding palette flagged)
2. **Shoe Loadout** — strategy callout + cards for Faisal (Rebel V5 +
   hiking shoe to buy in Kyoto) and Keiko (Skechers Slip-ins + Crocs +
   optional Workman trail shoe)
3. **Thrift Map** — 6 stops including Mont-bell Kawaramachi, 2nd Street
   (Shimokitazawa, Harajuku, Ueno), HARD OFF, Mercari setup nudge

### Itinerary updates

- **Day 1 (Apr 21) evening 20:00** — Yodobashi hiking-shoe shop. Buys
  the 5-day break-in window before Day 9 Kamikochi.
- **Day 13 (May 3) 15:45 + 18:00** — 2nd Street Ueno (with Ameyoko) and
  2nd Street Shimokitazawa thrift stops, slotted into existing
  schedule.

### Packing checklist refactor

- Split into two shoe categories (Faisal's 2 pairs / Keiko's 2-3 pairs)
- Refined Kamikochi gear list
- Removed obsolete "20+ shoe removes" hyperbole

## Strategy summary

- **Faisal:** bring NB FuelCell Rebel V5 from Indo. Buy Mont-bell
  Tazawa or equivalent Gore-Tex shoe Day 1 evening (Yodobashi) or Day 2
  morning (Mont-bell Kawaramachi). Break in over Kyoto Days 2-5
  (~40km). Use for Kamikochi Day 9. Bring home as future naik gunung
  investment.
- **Keiko:** Skechers Slip-ins primary (Hands Free line — designed for
  temple shoe-removal). Crocs Mellow as ryokan/hotel utility. Optional
  Workman trail shoe ¥3,900 if joining Kamikochi.
- **Thrift:** built into Day 13 itinerary (Ueno + Shimokitazawa already
  on schedule). 2nd Street for streetwear, Keiko's outfits, future
  outdoor jackets. Skip used hiking shoes — safety risk.

## Why hiking shoe in Kyoto, not Takayama

5-day break-in window vs zero. New shoes + 6h alpine hike Day 1 of
wear = blister hell. Kyoto Days 2-5 walking serves as natural break-in.
