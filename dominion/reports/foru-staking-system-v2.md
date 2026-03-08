# $FORU Staking System Documentation

## Overview

| Property | Value |
|---|---|
| Reward Source | Community Rewards Pool (244,750,000 FORU) |
| Emission Duration | 60 months (TGE → Jan 2031) |
| Monthly Emission | 4,079,167 FORU |
| Daily Emission | ~136,305 FORU |
| Integration | ForU Social Platform (Badges, XP, Quests) |

---

## Staking Tiers

### Tier Requirements

Each tier requires a minimum FORU stake and a time-lock commitment. Higher tiers unlock better base APR, bonus multipliers, and platform perks.

| Tier | Min Stake | Lock Period | Base Weight | Color |
|---|---|---|---|---|
| Bronze | 1,000 FORU | Flex (no lock) | 1.0x | 🟤 |
| Silver | 10,000 FORU | 3 months | 1.3x | ⚪ |
| Gold | 50,000 FORU | 6 months | 2.0x | 🟡 |
| Diamond | 200,000 FORU | 12 months | 3.0x | 💎 |

### Tier Benefits Matrix

| Benefit | Bronze | Silver | Gold | Diamond |
|---|---|---|---|---|
| Base weight multiplier | 1.0x | 1.3x | 2.0x | 3.0x |
| Badge bonus eligible | ✗ | ✓ | ✓ | ✓ |
| XP bonus eligible | ✗ | ✗ | ✓ | ✓ |
| Admin bonus eligible | ✗ | ✗ | ✓ | ✓ |
| Early unstake | ✓ (no lock) | ✓ (pro-rata penalty) | ✓ (pro-rata penalty) | ✓ (steep pro-rata penalty) |
| Governance voting | ✗ | ✓ | ✓ (2x vote) | ✓ (4x vote) |
| Campaign priority access | ✗ | ✗ | ✓ | ✓ |
| Exclusive quest access | ✗ | ✗ | ✗ | ✓ |
| Reward format | Liquid FORU | Liquid FORU | 50% liquid / 50% esFORU | 50% liquid / 50% esFORU |

---

## Early Unstake: Pro-Rata Penalty System

All locked tiers allow early exit with a declining penalty based on time served. This ensures fairness — stakers who exit near the end of their lock are penalized far less than those who exit early.

### Penalty Formula

```
Penalty = Max Penalty × (Remaining Lock / Total Lock)
```

### Penalty by Tier

| Tier | Max Penalty | Lock Period | Formula |
|---|---|---|---|
| Bronze | 0% | None | No penalty (flex) |
| Silver | 40% | 3 months | 40% × (remaining / 3 months) |
| Gold | 50% | 6 months | 50% × (remaining / 6 months) |
| Diamond | 65% | 12 months | 65% × (remaining / 12 months) |

### Penalty Examples

**Silver (3-month lock, 40% max):**

| Unstake At | Remaining | Penalty | Keep |
|---|---|---|---|
| Month 0.5 | 2.5 months | 33.3% | 66.7% |
| Month 1 | 2 months | 26.7% | 73.3% |
| Month 2 | 1 month | 13.3% | 86.7% |
| Month 2.5 | 0.5 months | 6.7% | 93.3% |

**Gold (6-month lock, 50% max):**

| Unstake At | Remaining | Penalty | Keep |
|---|---|---|---|
| Month 1 | 5 months | 41.7% | 58.3% |
| Month 3 | 3 months | 25.0% | 75.0% |
| Month 5 | 1 month | 8.3% | 91.7% |

**Diamond (12-month lock, 65% max):**

| Unstake At | Remaining | Penalty | Keep |
|---|---|---|---|
| Month 1 | 11 months | 59.6% | 40.4% |
| Month 3 | 9 months | 48.8% | 51.2% |
| Month 6 | 6 months | 32.5% | 67.5% |
| Month 9 | 3 months | 16.3% | 83.7% |
| Month 11 | 1 month | 5.4% | 94.6% |

### Penalty Token Redistribution

Penalized tokens are split:
- **70%** → redistributed to remaining stakers in the same tier (rewards loyalty)
- **30%** → returned to Community Rewards Pool (extends emission runway)

---

## Reward Calculation

### Base Formula

```
User Reward = Daily Emission × (User Effective Weight / Total Effective Weight)

Where:
  Effective Weight = Staked Amount × Tier Weight × (1 + Badge% + XP% + Admin%)
  Daily Emission = 136,305 FORU (fixed, never exceeded)
```

**Important:** Bonuses do NOT create additional emissions. They increase a staker's share of the fixed daily emission by increasing their effective weight. Total daily emission is always exactly 136,305 FORU.

### Weighted Stake Example

```
Alice:  50,000 FORU × 2.0x (Gold)    = 100,000 weighted
Bob:   200,000 FORU × 3.0x (Diamond) = 600,000 weighted
Carol:   5,000 FORU × 1.0x (Bronze)  =   5,000 weighted
                           Total = 705,000 weighted

Alice daily reward (base):
  = 136,305 × (100,000 / 705,000)
  = 136,305 × 0.1418
  = 19,328 FORU/day

Bob daily reward (base):
  = 136,305 × (600,000 / 705,000)
  = 136,305 × 0.8511
  = 116,008 FORU/day

Carol daily reward (base):
  = 136,305 × (5,000 / 705,000)
  = 136,305 × 0.0071
  = 968 FORU/day
```

---

## Bonus Reward System

Bonuses are additive weight multipliers applied on top of the base reward. They integrate directly with the ForU Social Platform gamification systems.

All bonuses are applied as weight multipliers, meaning they redistribute — not inflate — the daily emission.

### 1. Badge Bonus (Silver+ Tiers)

Badges from the ForU platform (`BadgeSource: ADMIN_DEFINED | AI_GENERATED | PERSONA_GENERATED`) grant staking bonus multipliers when held (unlocked) by the staker.

**Anti-Gaming Rules:**
- Only badges older than **7 days** count toward staking bonus
- Maximum **2 new badges per month** can contribute to staking bonus per wallet
- Badge bonus recalculated at each reward claim (badges removed = bonus removed)

#### Badge Bonus Tiers

| Badge Category | Bonus | Requirement | Example |
|---|---|---|---|
| Community Badge | +2% per badge | Any unlocked ADMIN_DEFINED badge | "Early Adopter", "Beta Tester" |
| AI Badge | +3% per badge | Any unlocked AI_GENERATED badge | Persona-generated badges |
| Rare/Highlight Badge | +5% per badge | Badge with `highlight: true` | "OG Supporter", "Genesis" |
| Minted NFT Badge | +8% per badge | Badge with `is_minted: true` | On-chain verified badges |

#### Badge Bonus Cap

| Tier | Max Badge Bonus |
|---|---|
| Silver | +10% |
| Gold | +20% |
| Diamond | +35% |

#### Badge Bonus Example

```
Alice (Gold tier, 50,000 FORU staked):
  - Holds 3 community badges (all >7 days old): 3 × 2% = +6%
  - Holds 1 highlight badge:                     1 × 5% = +5%
  - Holds 1 minted NFT badge:                    1 × 8% = +8%
  - Raw total:                                           = +19%
  - Gold cap:                                            = +19% (under 20% cap ✓)

  Base daily reward: 19,328 FORU
  With badge bonus:  19,328 × 1.19 = 23,000 FORU/day
```

### 2. XP/Level Bonus (Gold+ Tiers)

User level (1–50) from the ForU platform XP system (`UserAttributes.level`) grants a scaling staking bonus.

#### XP Level Bonus Table

| Level Range | Bonus |
|---|---|
| 1–5 | +0% |
| 6–10 | +2% |
| 11–20 | +5% |
| 21–30 | +8% |
| 31–40 | +12% |
| 41–50 | +18% |

#### XP Streak Bonus (Additive)

Integration with the daily check-in streak system (`DailyCheckInStats.current_streak`):

| Streak | Bonus |
|---|---|
| 7+ days active streak | +2% |
| 30+ days active streak | +5% |
| 90+ days active streak | +8% |

#### XP Bonus Cap

| Tier | Max XP Bonus |
|---|---|
| Gold | +15% |
| Diamond | +26% (18% level + 8% streak) |

#### XP Bonus Example

```
Bob (Diamond tier, 200,000 FORU staked):
  - Level 35:                +12%
  - 45-day check-in streak:   +5%
  - Total XP bonus:          +17%

  Base daily reward: 116,008 FORU
  With XP bonus:     116,008 × 1.17 = 135,729 FORU/day
```

### 3. Admin-Defined Bonus (Gold+ Tiers)

Admins can create time-limited bonus events via the platform's `FeatureConfig` system. These are campaign-style multipliers with built-in safeguards.

**Safeguards:**
- All admin bonuses require a **48-hour timelock** before activation (visible to all stakers in advance)
- Maximum **2 admin bonuses active simultaneously**
- Minimum **7-day cooldown** between ending one bonus and starting another of the same type
- All bonus activations emit on-chain events for full auditability

#### Admin Bonus Types

| Type | Description | Duration | Max Bonus |
|---|---|---|---|
| Seasonal Event | Holiday, anniversary, launch events | 1–14 days | +15% |
| Campaign Bonus | Tied to `Campaign` entity (`REP_LEADERBOARD` or `COMMUNITY`) | Campaign duration | +10% |
| Quest Completion Bonus | Complete specific `DailyQuest` to activate staking boost | 24–72 hours | +10% |
| Partnership Bonus | Partner-sponsored (`partner_id` on quest/badge) | Varies | +15% |
| Retention Incentive | Market downturn retention bonus | Max 14 days | +25% |

#### Admin Bonus Configuration Example

```json
{
  "bonus_id": "lunar-new-year-2027",
  "type": "SEASONAL_EVENT",
  "bonus_percent": 15,
  "min_tier": "SILVER",
  "start_at": "2027-01-30T00:00:00Z",
  "end_at": "2027-02-11T00:00:00Z",
  "timelock_announced_at": "2027-01-28T00:00:00Z",
  "eligible_badge_ids": [],
  "eligible_quest_ids": [],
  "eligible_campaign_ids": [],
  "stacking": false,
  "description": "Lunar New Year staking boost"
}
```

```json
{
  "bonus_id": "trivia-master-boost",
  "type": "QUEST_COMPLETION_BONUS",
  "bonus_percent": 10,
  "min_tier": "GOLD",
  "start_at": "2027-03-03T00:00:00Z",
  "end_at": "2027-03-31T00:00:00Z",
  "timelock_announced_at": "2027-03-01T00:00:00Z",
  "eligible_quest_ids": [42, 43, 44],
  "required_completions": 3,
  "stacking": true,
  "description": "Complete 3 trivia quests for staking boost"
}
```

#### Admin Bonus Cap

| Tier | Max Admin Bonus |
|---|---|
| Gold | +20% |
| Diamond | +25% |

#### Admin Bonus Example

```
Alice (Gold tier) during Lunar New Year event:
  - Seasonal event bonus: +15%
  - Completed trivia quest: +10%
  - Raw total:              +25%
  - Gold cap:               +20% (capped ✓)

  Base daily reward: 19,328 FORU
  With all bonuses:
    Badge: +19%
    XP:    +2% (level 8, no streak)
    Admin: +20% (capped)
    Total: 19,328 × (1 + 0.19 + 0.02 + 0.20)
         = 19,328 × 1.41
         = 27,253 FORU/day
```

---

## Maximum Multiplier Analysis

To ensure the system remains fair, here is the theoretical maximum multiplier per tier:

| Tier | Base Weight | Max Badge | Max XP | Max Admin | Max Total Multiplier | vs Bronze |
|---|---|---|---|---|---|---|
| Bronze | 1.0x | +0% | +0% | +0% | 1.0x | 1.0x |
| Silver | 1.3x | +10% | +0% | +0% | 1.3 × 1.10 = 1.43x | 1.43x |
| Gold | 2.0x | +20% | +15% | +20% | 2.0 × 1.55 = 3.10x | 3.10x |
| Diamond | 3.0x | +35% | +26% | +25% | 3.0 × 1.86 = 5.58x | 5.58x |

**Interpretation:** A fully maxed Diamond staker has 5.58x the effective weight of a Bronze staker (per token staked). This rewards commitment and engagement without creating an insurmountable gap.

For comparison, if a Diamond staker and Bronze staker each stake 50,000 FORU:
- Bronze effective weight: 50,000
- Diamond effective weight: 279,000
- Diamond earns ~5.58x more — earned through 12-month lock + platform engagement, not just capital

---

## Combined Reward Scenarios

### Scenario A: Diamond Power User — Maximum Yield

```
Staker: Diamond tier, 500,000 FORU staked
Assume total weighted stake: 50,000,000

Base:
  Pool share = (500,000 × 3.0) / 50,000,000 = 0.03
  Daily base = 136,305 × 0.03 = 4,089 FORU/day

Bonuses:
  Badge: 2 minted NFTs (2×8%=16%) + 2 highlight (2×5%=10%) + 3 community (3×2%=6%) = 32% (under 35% cap ✓)
  XP:    Level 42 (+18%) + 90-day streak (+8%) = 26% (Diamond cap ✓)
  Admin: Partnership bonus (+15%) + seasonal (+10%) = 25% (Diamond cap ✓)

Total daily:
  4,089 × (1 + 0.32 + 0.26 + 0.25)
  = 4,089 × 1.83
  = 7,483 FORU/day

  Of which:
    50% liquid: 3,742 FORU/day (claimable immediately)
    50% esFORU: 3,742 esFORU/day (vests over 6 months)

Monthly: ~224,490 FORU
Annual:  ~2,731,295 FORU
```

### Scenario B: Gold Engaged User — Mid Yield

```
Staker: Gold tier, 50,000 FORU staked
Assume total weighted stake: 50,000,000

Base:
  Pool share = (50,000 × 2.0) / 50,000,000 = 0.002
  Daily base = 136,305 × 0.002 = 273 FORU/day

Bonuses:
  Badge: 2 community (4%) + 1 highlight (5%) = 9%
  XP:    Level 15 (+5%) + 30-day streak (+5%) = 10%
  Admin: None active

Total daily:
  273 × (1 + 0.09 + 0.10)
  = 273 × 1.19
  = 325 FORU/day

  50% liquid: 163 FORU/day
  50% esFORU: 163 esFORU/day

Monthly: ~9,750 FORU
Annual:  ~118,625 FORU
```

### Scenario C: Bronze Casual — Minimum Yield

```
Staker: Bronze tier, 1,000 FORU staked
Assume total weighted stake: 50,000,000

Base:
  Pool share = (1,000 × 1.0) / 50,000,000 = 0.00002
  Daily base = 136,305 × 0.00002 = 2.73 FORU/day

Bonuses: None (Bronze tier has no bonus eligibility)

Total daily: 2.73 FORU/day (100% liquid)
Monthly: ~82 FORU
Annual:  ~996 FORU
```

> **Note:** APR is highest when participation is low. As more users stake, the fixed emission is diluted across more participants and APR decreases naturally. This is by design — early stakers are rewarded for taking the risk.

---

## esFORU (Escrowed FORU) Mechanism

Gold and Diamond tier rewards are paid 50% liquid / 50% esFORU.

### What is esFORU?

| Property | Value |
|---|---|
| Type | Non-transferable receipt token |
| Vesting | Linear over 6 months from earn date |
| Requirement | Must maintain staking position to vest |
| Early exit | Forfeit all unvested esFORU |
| Conversion | 1 esFORU → 1 FORU (after vesting) |

### Why esFORU?

esFORU creates a double lock mechanism:
1. **First lock:** Staking itself (3–12 months depending on tier)
2. **Second lock:** Earned rewards vest over an additional 6 months

This dramatically reduces sell pressure from reward farming. Users who stake purely to dump rewards are penalized — they lose 50% of their earnings (the esFORU portion) if they unstake early.

### esFORU Vesting Example

```
Bob earns 116,008 FORU/day at Diamond tier:
  - 58,004 FORU → liquid (claimable immediately)
  - 58,004 esFORU → vests linearly over 6 months

After 1 month of staking:
  Liquid claimed:   58,004 × 30 = 1,740,120 FORU
  esFORU earned:    58,004 × 30 = 1,740,120 esFORU
  esFORU vested:    ~290,020 FORU (earliest esFORU partially vested)
  esFORU unvested:  ~1,450,100 esFORU (still vesting)

If Bob unstakes at month 1:
  Keeps:    1,740,120 liquid + ~290,020 vested FORU
  Forfeits: ~1,450,100 unvested esFORU (redistributed)
```

### Forfeited esFORU Redistribution

When a user forfeits unvested esFORU:
- **70%** → redistributed to remaining stakers in the same tier pool
- **30%** → returned to Community Rewards Pool (extends emission runway)

This creates a positive feedback loop: users who leave early subsidize users who stay.

---

## Early Staker Bonus (TGE First 72 Hours)

### Purpose

Absorb immediate sell pressure from TGE unlock events (airdrops, seed investor unlocks, ecosystem unlocks) by incentivizing staking within the first 72 hours.

### Mechanism

| Window | Bonus | Duration | Description |
|---|---|---|---|
| First 24 hours | +50% weight | 3 months | 1.5x base weight for 3 months |
| 24–48 hours | +30% weight | 3 months | 1.3x base weight for 3 months |
| 48–72 hours | +15% weight | 3 months | 1.15x base weight for 3 months |
| After 72 hours | +0% | — | Standard weight |

The early staker bonus decays after 3 months and stacks with tier weight (but NOT with other bonuses — applied to base weight only).

### Example

```
Alice stakes 50,000 FORU into Gold tier within first 24 hours:

  Normal Gold weight:  50,000 × 2.0 = 100,000
  With early bonus:    50,000 × 2.0 × 1.5 = 150,000
  Duration:            3 months, then reverts to 100,000
```

---

## Anti-Whale Protections

| Protection | Value | Rationale |
|---|---|---|
| Max stake per wallet | 20,000,000 FORU (2% supply) | Prevent single-wallet dominance |
| Diminishing returns | Above 5,000,000 FORU: 50% weight efficiency | Reduces mega-whale advantage |
| Cooldown on restake | 24 hours after unstake | Prevents gaming lock/unlock cycles |
| Bonus cap per tier | See caps above | Limits maximum multiplier advantage |
| Badge rate limit | Max 2 new badges/month for staking bonus | Prevents badge farming |
| Badge age requirement | 7-day minimum age to count | Prevents flash-badge attacks |

### Diminishing Returns Formula

```
For stake amounts above 5,000,000 FORU:

  Effective Stake = 5,000,000 + (Amount - 5,000,000) × 0.5

  Example: 10,000,000 FORU staked
    Effective = 5,000,000 + (5,000,000 × 0.5) = 7,500,000
    (25% less effective than linear)

  Example: 20,000,000 FORU staked (max)
    Effective = 5,000,000 + (15,000,000 × 0.5) = 12,500,000
    (37.5% less effective than linear)
```

---

## Emission Budget Sustainability

### 60-Month Emission Schedule

```
Total community pool:   244,750,000 FORU
Monthly emission:         4,079,167 FORU
Daily emission:             136,305 FORU

Year 1 total emitted:    48,950,000 FORU (20% of pool)
Year 2 total emitted:    48,950,000 FORU (40% cumulative)
Year 3 total emitted:    48,950,000 FORU (60% cumulative)
Year 4 total emitted:    48,950,000 FORU (80% cumulative)
Year 5 total emitted:    48,950,000 FORU (100% — pool exhausted)
```

### Emission Extension via Forfeitures

Forfeited esFORU and early unstake penalties return tokens to the Community Rewards Pool. This can extend the emission runway beyond 60 months.

```
Conservative estimate (20% forfeit rate):
  Monthly forfeiture return: ~815,833 FORU
  Effective monthly net emission: 4,079,167 - 815,833 = 3,263,334
  Extended runway: ~75 months (+15 months)

Moderate estimate (35% forfeit rate):
  Monthly forfeiture return: ~1,427,708 FORU
  Effective monthly net emission: 2,651,459
  Extended runway: ~92 months (+32 months)
```

### Bonus Budget Impact

Bonuses do NOT create additional emissions. They redistribute existing daily emissions toward bonus-eligible stakers.

```
Daily emission is ALWAYS 136,305 FORU (fixed ceiling)

Bonuses increase a staker's WEIGHT in the pool, not the total emission.

Implementation:
  Effective Weight = Staked Amount × Tier Weight × (1 + Badge% + XP% + Admin%)
  User Reward = Daily Emission × (User Effective Weight / Total Effective Weight)

The denominator (Total Effective Weight) adjusts automatically.
A user with high bonuses earns more only because their slice of the pie is bigger — the pie itself never grows.
```

---

## Platform Integration Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   ForU Staking Contract                     │
│                                                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐  │
│  │  Bronze   │ │  Silver  │ │   Gold   │ │   Diamond    │  │
│  │   Pool    │ │   Pool   │ │   Pool   │ │    Pool      │  │
│  └─────┬────┘ └─────┬────┘ └─────┬────┘ └──────┬───────┘  │
│        └─────────────┴─────────────┴─────────────┘          │
│                          │                                   │
│               ┌──────────▼──────────┐                       │
│               │  Reward Calculator  │                       │
│               │                     │                       │
│               │  Base Weight        │                       │
│               │  + Badge Bonus  ◄───┼──── Badge Oracle      │
│               │  + XP Bonus    ◄───┼──── XP Oracle          │
│               │  + Admin Bonus ◄───┼──── Admin Config       │
│               └──────────┬──────────┘                       │
│                          │                                   │
│               ┌──────────▼──────────┐                       │
│               │  Emission Manager   │                       │
│               │                     │                       │
│               │  Community Pool     │                       │
│               │  244,750,000 FORU   │                       │
│               │  136,305 / day      │                       │
│               └─────────────────────┘                       │
│                                                             │
│               ┌─────────────────────┐                       │
│               │  Oracle Fallback    │                       │
│               │                     │                       │
│               │  If Merkle root     │                       │
│               │  stale > 48 hours:  │                       │
│               │  → base weight only │                       │
│               │  (no bonuses)       │                       │
│               └─────────────────────┘                       │
└─────────────────────────────────────────────────────────────┘
           │               │               │
           ▼               ▼               ▼
┌──────────────────┐ ┌──────────────┐ ┌──────────────────┐
│ social-analyzer  │ │ Badge System │ │   Admin Panel    │
│ -backend         │ │              │ │                  │
│                  │ │ UserBadge    │ │ FeatureConfig    │
│ UserAttributes   │ │ BadgeRule    │ │ Campaign         │
│   .level (1-50)  │ │ is_minted    │ │ DailyQuest       │
│   .exp           │ │ highlight    │ │ Bonus Events     │
│                  │ │ source       │ │                  │
│ DailyCheckIn     │ │   ADMIN      │ │ Safeguards:      │
│   Stats          │ │   AI_GEN     │ │  48h timelock    │
│ .current_streak  │ │   PERSONA    │ │  max 2 active    │
│                  │ │              │ │  7-day cooldown  │
│ ExpTransaction   │ │ Anti-Gaming: │ │  on-chain events │
│   Log            │ │  7-day age   │ │                  │
│                  │ │  2/month cap │ │                  │
└──────────────────┘ └──────────────┘ └──────────────────┘
```

### Data Flow: Bonus Calculation

```
1. User stakes FORU → Contract records tier + amount + timestamp
2. Reward claim triggered (daily/manual):
   a. Contract queries Badge Oracle:
      → Reads user's UserBadge records
      → Filters: age > 7 days, max 2 new/month
      → Counts qualifying badges by category
      → Returns badge bonus % (capped by tier)

   b. Contract queries XP Oracle:
      → Reads UserAttributes.level
      → Reads DailyCheckInStats.current_streak
      → Returns XP bonus % (capped by tier)

   c. Contract queries Admin Config:
      → Reads active bonus events (max 2)
      → Checks: timelock passed, user tier eligible
      → Returns admin bonus % (capped by tier)

   d. Oracle Fallback Check:
      → If any oracle Merkle root not updated in 48h
      → That bonus category defaults to 0%
      → Base weight rewards still distributed normally

3. Calculate effective weight:
   weight = staked × tier_weight × (1 + badge% + xp% + admin%)

4. Calculate reward:
   reward = daily_emission × (user_weight / total_weight)

5. Distribute:
   Bronze/Silver: 100% liquid FORU
   Gold/Diamond:  50% liquid FORU + 50% esFORU
```

### Oracle Implementation: Hybrid Approach (Recommended)

| Data Source | On-Chain Component | Off-Chain Component | Update Frequency |
|---|---|---|---|
| Badge data | Merkle root (multi-sig updated) | API verification layer | Weekly |
| XP/Level data | Merkle root (multi-sig updated) | API verification layer | Daily |
| Admin bonus config | Stored fully on-chain | Admin panel UI | As needed (48h timelock) |
| Streak data | Merkle root (with XP) | API verification | Daily |

**Security requirements:**
- Merkle root updates require **2-of-3 multi-sig** (not single hot wallet)
- All Merkle root updates emit on-chain events with IPFS hash of full data
- Stale oracle fallback: if root not updated in 48 hours, bonuses default to 0% for that category
- Off-chain API serves as verification layer only — contract trusts Merkle proof, not API response

---

## Staking Option Comparison

### Option A: Pure Time-Lock (Simple)

```
Mechanism: Lock FORU for fixed period, earn proportional share of emissions
Bonuses:   None — pure time-lock weight only
esFORU:    No — all rewards liquid
```

| Pros | Cons |
|---|---|
| Simple to implement and audit | No platform integration — staking lives in isolation |
| Easy for users to understand | No defense against mercenary capital |
| Lower smart contract risk | No incentive to engage with ForU platform |
| Gas efficient | Whales dominate with pure capital advantage |
| Proven model | Doesn't differentiate ForU from generic staking |

**Reference:** Aave stkAAVE, Synthetix SNX staking

**Impact on token value:** 🟡 **Moderate.** Estimated 15–25% of circulating supply locked, but no reward vesting = stakers dump liquid rewards immediately.

---

### Option B: Tiered Time-Lock + Platform Bonuses ✅ RECOMMENDED

```
Mechanism: Lock FORU in tiers with min stake + badge/XP/admin bonuses
Bonuses:   Badge + XP + Admin (as described in this document)
esFORU:    Yes — Gold/Diamond get 50% escrowed
```

| Pros | Cons |
|---|---|
| Deep platform integration drives engagement | More complex smart contracts (higher audit cost) |
| Badge/XP bonuses reward loyal users, not just whales | Oracle dependency for off-chain data |
| esFORU double-locks supply (staking + vesting) | Users may find system confusing initially |
| Admin bonuses enable reactive market management | Requires backend infrastructure (oracles, Merkle trees) |
| Differentiates ForU from generic staking | Badge/XP gaming potential (mitigated by anti-gaming rules) |
| Creates flywheel: stake → engage → earn → stake more | — |
| TGE dump protection via early staker bonus | — |
| Pro-rata penalty system is fair and transparent | — |
| Oracle fallback ensures rewards never break | — |

**Reference:** CurveDAO (veCRV) + GMX (esGMX) + Camelot (xGRAIL)

**Impact on token value:** 🟢 **Strongly positive.** Estimated 35–45% of circulating supply locked (removed from sell pressure). esFORU delays reward selling by an additional 6 months. Platform engagement increases token utility beyond speculation. Best option for price stability and long-term value.

---

### Option C: Liquid Staking (stFORU)

```
Mechanism: Stake FORU, receive liquid stFORU receipt token
Bonuses:   Tier-based only (no platform bonuses)
esFORU:    No — stFORU is the receipt, rewards accrue to stFORU value
```

| Pros | Cons |
|---|---|
| stFORU can be used in DeFi (LP, lending, collateral) | Complex — requires stFORU pricing oracle |
| No lock-up friction | stFORU sell = effective unstake (no real lock) |
| Composable with wider DeFi ecosystem | Doesn't create real lock-up for TGE dump prevention |
| Attractive to DeFi-native users | No platform engagement incentive |

**Reference:** Lido (stETH), Rocket Pool (rETH)

**Impact on token value:** 🔴 **Weak.** stFORU can be sold anytime = no real lock-up. Good for TVL numbers on paper, poor for actual sell pressure reduction.

---

### Option D: Vote-Escrowed (veFORU)

```
Mechanism: Lock FORU for variable duration → receive veFORU (decaying)
Bonuses:   Lock duration determines veFORU amount
esFORU:    No — governance power is the incentive
```

| Pros | Cons |
|---|---|
| Proven governance model | Complex UX — decay mechanism confuses users |
| Very long lock-ups possible (up to 4 years) | Locked capital can't react to market changes |
| Strong Schelling point for long-term holders | Whale governance capture risk |
| Battle-tested contracts available | Not ideal for platform-first project |

**Reference:** CurveDAO (veCRV), Balancer (veBAL), Pendle (vePENDLE)

**Impact on token value:** 🟢 **Very strong lock-up**, but conditional — requires meaningful governance decisions to justify multi-year locks. Without robust governance utility, users won't lock long-term and the model falls apart.

---

## Price Impact Analysis & Runway Defense

### Key Principle

```
Effective Sell Pressure = Monthly Vesting Unlocks
                        - Monthly Tokens Entering Staking
                        + Monthly Staking Rewards Claimed as Liquid

If Effective Sell Pressure < 0 → Supply squeeze → Bullish
If Effective Sell Pressure > 0 → Net new supply → Bearish pressure
```

### Monthly Vesting Unlock Schedule (Sell Pressure Sources)

| Period | Monthly New Supply | Danger Level |
|---|---|---|
| TGE (Day 0) | 68,405,000 FORU (one-time) | 🔴 EXTREME |
| Month 1–5 | ~11,968,022/month | 🟡 MODERATE |
| Month 6–11 | ~19,166,911/month | 🟠 HIGH |
| Month 12–24 | ~25,358,577/month | 🔴 CRITICAL |
| Month 25–36 | ~10,301,355/month | 🟡 MODERATE |
| Month 37–48 | ~10,301,355/month | 🟡 MODERATE |
| Month 49–60 | ~4,079,167/month | 🟢 LOW |

**Critical danger zone: Months 12–24** — peak unlock rate with team, advisors, and seed investors all vesting simultaneously.

### Staking Absorption Modeling

#### Assumptions

| Parameter | Conservative | Moderate | Optimistic |
|---|---|---|---|
| Staking participation rate | 25% | 40% | 55% |
| esFORU forfeit rate | 20% | 35% | 50% |
| Average lock duration | 3 months | 6 months | 9 months |
| Reward sell rate (liquid portion) | 80% | 50% | 30% |

#### Phase Analysis (Moderate Scenario — 40% Participation)

**Phase 1: TGE → Month 6**

```
TGE unlock:           68,405,000 FORU
Early staker absorbed: ~27,000,000 FORU (72-hour bonus window)
Net TGE sell pressure: ~41,405,000 FORU

Monthly unlock (M1-5): 11,968,022
Monthly staked:         4,787,209 (40%)
Monthly reward sold:    2,039,584 (liquid portion × 50% sell rate)
Net monthly pressure:   9,220,397 FORU

Assessment: MANAGEABLE — early staker bonus absorbs significant TGE pressure
```

**Phase 2: Month 6–12**

```
Monthly unlock:        19,166,911 (seed cliff ends at M6)
Monthly staked:         7,666,764 (40%)
Monthly reward sold:    2,039,584
esFORU vesting sold:      713,854 (first esFORU starts vesting)
Net monthly pressure:  14,253,585 FORU

Assessment: HIGH PRESSURE — activate retention incentive bonuses
Recommendation: Schedule major platform feature launch at M10-11
```

**Phase 3: Month 12–24 (CRITICAL)**

```
Monthly unlock:        25,358,577 (team + advisors cliff)
Monthly staked:        10,143,431 (40%)
Monthly reward sold:    2,039,584
esFORU vesting sold:    1,427,708
Net monthly pressure:  18,682,438 FORU

Assessment: CRITICAL — highest sustained sell pressure period
Recommendations:
  1. Activate admin retention bonuses (+25%) during M11-13
  2. Launch highest-value platform features during this window
  3. Consider token buyback from ecosystem fund if needed
  4. Schedule partnership bonus events to drive staking participation
```

**Phase 4: Month 25–60 (Recovery)**

```
Monthly unlock (M25-48): 10,301,355
Monthly staked:            4,120,542 (40%)
Net monthly pressure:      8,220,397 FORU (declining)

Monthly unlock (M49-60):  4,079,167
Monthly staked:            1,631,667 (40%)
Net monthly pressure:      4,487,084 FORU (low)

Assessment: Sustainable. Sell pressure declines to manageable levels.
esFORU forfeitures extending runway provides additional buffer.
```

### Survival Strategy: Month 12–24 Playbook

| Action | Timing | Expected Impact |
|---|---|---|
| Activate retention incentive (+25%) | Month 11 | +15% staking participation |
| Major platform feature launch | Month 10–11 | Drives organic demand |
| Partnership bonus events | Month 12–14 | Attracts new stakers |
| Community campaign with quest bonuses | Month 12 | Engagement + lock-up |
| Ecosystem fund buyback (if needed) | Month 13+ | Direct price support |
| Increase badge/quest rewards | Month 12 | Higher bonus weight → more staking |

---

## Security Considerations

### Smart Contract Risks

| Risk | Mitigation |
|---|---|
| Reentrancy on claim/unstake | Checks-effects-interactions pattern; ReentrancyGuard |
| Oracle manipulation | Merkle proof verification; multi-sig updates; 48h stale fallback |
| Admin key compromise | Multi-sig (2-of-3 minimum); timelock on all admin actions |
| Bonus calculation overflow | SafeMath (Solidity 0.8+); cap enforcement before multiplication |
| Flash-stake attacks | 24h minimum stake duration before first reward; cooldown on restake |
| Badge farming | 7-day age requirement; 2/month rate limit; source verification |
| esFORU accounting errors | Separate vesting ledger; daily snapshot; invariant checks |

### Audit Recommendations

1. **Tier 1 audit firm** for core staking + reward distribution contracts
2. **Separate audit** for oracle integration (Merkle proof verification)
3. **Economic audit** (Gauntlet, Chaos Labs, or similar) for tokenomics stress testing
4. **Bug bounty program** on Immunefi post-launch (recommended pool: $50,000–$100,000)

### Emergency Controls

| Control | Mechanism | Timelock |
|---|---|---|
| Pause staking | Multi-sig emergency pause | Immediate (no timelock) |
| Pause claims | Multi-sig emergency pause | Immediate (no timelock) |
| Update oracle | Multi-sig Merkle root update | None (operational) |
| Modify bonus config | Admin multi-sig | 48 hours |
| Modify tier parameters | Governance vote | 7 days |
| Upgrade contract (proxy) | Governance vote | 14 days |

---

## Implementation Roadmap

Development accelerated via AI-assisted engineering (Claude Code). Single sprint, 2 weeks, testnet-ready.

### Sprint — Full Staking System (2 Weeks)

| Day | Scope | Deliverable |
|---|---|---|
| D1 | Core staking contract: tiers, deposit, lock, weighted stake | `ForuStaking.sol` + unit tests |
| D2 | Pro-rata early unstake penalty + cooldown + anti-whale | Penalty calculator + weight limiter |
| D3 | esFORU vesting mechanism (mint, vest, forfeit, redistribute) | `EsForu.sol` + vesting tests |
| D4 | Reward calculator + emission manager (fixed daily ceiling) | `RewardDistributor.sol` + invariant tests |
| D5 | Badge oracle: Merkle proof + anti-gaming (7-day age, 2/mo cap) | `BadgeOracle.sol` + proof tests |
| D6 | XP/Streak oracle + Admin bonus system with timelock | `XPOracle.sol` + `AdminBonus.sol` |
| D7 | Oracle fallback (48h stale → base-only) + early staker bonus | Safety module + TGE bonus logic |
| D8 | Full integration: stake → earn → claim → unstake end-to-end | Integration test suite |
| D9 | Edge cases, fuzzing, gas optimization | Foundry fuzz tests + gas report |
| D10 | Testnet deployment + smoke testing + documentation | Deployed to testnet, verified |

**Sprint output:** Complete staking system — tiers, esFORU, all 3 bonus oracles, anti-whale, fallback safety — tested and deployed to testnet.

### Post-Sprint: Security Audit (Runs in Parallel)

The audit runs **parallel** to testnet validation and does not block the development team. Engineering continues with bug fixes, UI integration, and testnet monitoring while auditors review.

| Task | Timeline | Notes |
|---|---|---|
| Security audit | 2–3 weeks | Submit on D10; runs parallel to testnet phase |
| Bug bounty setup (Immunefi) | During audit | Launch alongside audit |
| Mainnet deployment | 1–2 days post-audit | Multi-sig deploy + verify |

| Milestone | Target |
|---|---|
| Sprint complete (testnet live) | End of Week 2 |
| Audit submitted | Week 3 |
| Mainnet ready | Week 5–6 |

### Why We Need a Security Audit — Executive Summary

**The staking contract will custody 244,750,000 FORU (24.5% of total supply) over 60 months. A single vulnerability could result in total loss of user funds and irreversible reputational damage.**

#### Business Risk Without Audit

| Risk | Impact | Likelihood Without Audit |
|---|---|---|
| Reward calculation exploit (drain emission pool) | Loss of entire 244.75M FORU community pool | Medium-High |
| Reentrancy on unstake/claim (drain staked funds) | Loss of all user-staked FORU | Medium |
| Oracle manipulation (fake badges/XP for max rewards) | Unfair reward distribution, community trust destroyed | Medium |
| esFORU vesting bypass (claim unvested tokens) | Accelerated sell pressure, token price collapse | Medium |
| Admin key exploit (unauthorized bonus activation) | Attacker redirects rewards to themselves | Low-Medium |

#### Financial Justification

```
Audit cost:                    $15,000–$40,000 (one-time)
Value at risk (staking pool):  244,750,000 FORU
Value at risk (user deposits): Potentially 35–45% of circulating supply

Cost of exploit:
  - Direct: total loss of staking pool + user funds
  - Indirect: token price collapse, user exodus, regulatory scrutiny
  - Recovery: near-impossible for on-chain exploits (immutable contracts)

ROI of audit: prevents potential losses 1,000x–10,000x the audit cost
```

#### Industry Precedent

| Protocol | What Happened | Loss |
|---|---|---|
| Ronin Bridge | No independent audit of validator change | $624,000,000 |
| Wormhole | Verification bug missed in review | $326,000,000 |
| Nomad Bridge | Initialization bug — free-for-all exploit | $190,000,000 |
| Mango Markets | Oracle manipulation, unaudited edge case | $114,000,000 |
| Audius | Uninitialized proxy — basic check missed | $6,000,000 |

Every single one of these could have been caught by a competent audit firm. The cost of NOT auditing is orders of magnitude higher than the audit itself.

#### What the Audit Covers

1. **Smart contract logic review** — line-by-line verification of staking, rewards, penalties, vesting
2. **Access control verification** — ensure only authorized roles can call admin functions
3. **Economic attack simulation** — test for flash loan exploits, reward gaming, weight manipulation
4. **Oracle security review** — verify Merkle proof implementation, fallback behavior, staleness checks
5. **Gas optimization review** — identify costly patterns that could make the contract unusable at scale

#### Recommended Audit Firms

| Firm | Estimated Cost | Timeline | Specialization |
|---|---|---|---|
| OpenZeppelin | $30,000–$40,000 | 3–4 weeks | Gold standard, DeFi expertise |
| Trail of Bits | $25,000–$35,000 | 2–3 weeks | Deep technical, formal verification |
| Cyfrin | $15,000–$25,000 | 2–3 weeks | Competitive pricing, strong Solidity focus |
| Code4rena (contest) | $10,000–$20,000 | 1–2 weeks | Community audit, broad coverage |

**Recommendation:** Cyfrin or Code4rena for cost-efficiency with strong coverage. OpenZeppelin if budget allows — their name on the audit report carries significant trust signal for users and investors.

#### Bottom Line for C-Level

The audit is not optional — it is the minimum standard expected by:
- **Users** who will stake their tokens (they check for audit reports before depositing)
- **Exchanges** who may list FORU (audit report is standard listing requirement)
- **Investors** who evaluate protocol security as part of due diligence
- **Regulators** who increasingly scrutinize DeFi protocols for security practices

Skipping the audit to save $15K–$40K while putting 244M+ tokens at risk is not a cost saving. It is an unhedged liability.

An unaudited staking contract is a ticking time bomb. The question is not "if" it gets exploited — it's "when." The audit defuses the bomb before users deposit real money into it.

---

## Summary

The recommended FORU staking system (Option B — Tiered Time-Lock + Platform Bonuses) creates a multi-layered flywheel:

1. **Stake FORU** → lock tokens, reduce circulating supply
2. **Engage with ForU platform** → earn badges, level up, complete quests
3. **Platform engagement unlocks bonus rewards** → higher effective weight
4. **Higher rewards incentivize more staking** → deeper lock-up
5. **esFORU delays reward selling** → 6-month additional vesting
6. **Early unstake penalties redistribute to loyal stakers** → retention reward
7. **Forfeited tokens extend emission runway** → longer sustainability

This system is designed to:
- Absorb TGE sell pressure through early staker bonuses
- Create genuine platform engagement (not just passive staking)
- Survive the critical Month 12–24 unlock period
- Reward long-term, engaged users over mercenary capital
- Maintain a fixed emission ceiling (never inflationary beyond schedule)
- Provide fair exit mechanisms (pro-rata penalties, not full lock-in traps)

**Key differentiator:** Unlike generic staking, FORU staking is inseparable from the ForU social platform. Your staking rewards are directly tied to how much you use and contribute to the platform. This creates a moat that pure DeFi staking protocols cannot replicate.
