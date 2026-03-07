# Thread Visual References — Excalidraw Guide

> For Zexo to create header images and diagrams in Excalidraw.
> **Brand style:** Dark background (#1a1a2e or #0d1117), clean lines, slightly playful, dev-oriented.
> **Brand colors:** Cyan (#00d4ff), Orange (#ff6b35), White (#ffffff), Muted gray (#8b949e) for secondary elements.
> **Font feel:** Monospace for code/labels, clean sans-serif for titles.
> **Common elements:** Rounded rectangles for containers, dotted lines for abstract connections, glow effects (subtle cyan/orange outer stroke) for emphasis.

---

## Table of Contents

- [V1 Threads](#v1-threads): Posts #16–35
- [V2.1 Threads](#v21-threads): Posts #42–78

---

# V1 Threads

---

## Post #16: EIP-7702 Changed Everything

### Header Image (Tweet 1)
- **Composition:** Center — a classic wallet icon (rectangle with rounded corners, white outline) with a glowing cyan brain/circuit pattern emerging from inside it
- **Text:** "EIP-7702" in large bold white, subtitle "Your Wallet Just Got an Upgrade" in orange below
- **Elements:** Small "EOA" label on the wallet, arrows pointing outward to floating smart contract code snippets (curly braces, function signatures) in cyan monospace
- **Vibe:** Transformation moment — the boring wallet becoming something alive

### Diagram 1: Before vs After (Tweet 3-4)
- **Layout:** Two-panel split (left = "Before", right = "After")
- **Left panel:** Simple wallet icon → arrow → single "transfer()" box. Gray/muted tones. Label: "EOA: Sign & Send. That's it."
- **Right panel:** Same wallet icon but glowing cyan → arrows fanning out to multiple boxes: "Batch Txns", "Gas Sponsorship", "Custom Logic", "Session Keys". Each box a different shade of cyan/orange.
- **Divider:** Vertical dashed line with "EIP-7702" label

### Diagram 2: Delegation Flow (Tweet 5-6)
- **Flow:** Left-to-right horizontal
- **Elements:** EOA box → arrow labeled "designate" → Smart Contract box → arrow labeled "execute as" → back to EOA
- **Key label:** "EOA's storage + SC's code = 🔥" in orange text below
- **Show the `delegation` pointer as a dotted cyan arrow from EOA to contract

---

## Post #17: Account Abstraction 4337+7702

### Header Image (Tweet 1)
- **Composition:** Two puzzle pieces clicking together. Left piece labeled "ERC-4337" (orange), right piece labeled "EIP-7702" (cyan). Background: dark with subtle grid
- **Text:** "The Full Picture" in white above the puzzle
- **Small icons inside each piece:** 4337 = bundler/paymaster icons, 7702 = wallet/code icon

### Diagram 1: Architecture Stack (Tweet 3-4)
- **Layout:** Vertical stack/layer diagram
- **Bottom layer:** "Ethereum L1" (dark gray, wide rectangle)
- **Middle layer:** "EIP-7702: EOA Code Execution" (cyan rectangle)
- **Top layer:** "ERC-4337: UserOp Infrastructure" (orange rectangle)
- **Side labels:** Bundlers, Paymasters, EntryPoint on the 4337 layer; Delegation, Temp Code on 7702 layer
- **Arrows:** Show UserOp flowing down through layers

### Diagram 2: User Experience Flow (Tweet 5-6)
- **Horizontal flow:** User icon → "Sign Once" → Bundler box → Paymaster box → On-chain execution → checkmark
- **Below the flow:** Label "User pays $0 gas" with a crossed-out gas pump icon (playful)

---

## Post #18: ZK Proofs Actually Explained

### Header Image (Tweet 1)
- **Composition:** A lock icon made of circuit lines (like a PCB trace forming a padlock shape), glowing cyan
- **Text:** "Zero Knowledge" in large white, "Proofs Actually Explained" in orange below
- **Background:** Dark with faint mathematical symbols (Σ, π, ∈) scattered lightly in gray

### Diagram 1: Three Properties (Tweet 2-3)
- **Layout:** Three columns or a triangle
- **Three rounded boxes:**
  - "Completeness" (green checkmark) — "Honest prover always convinces"
  - "Soundness" (red shield) — "Cheater can't fake it"
  - "Zero-Knowledge" (cyan lock) — "Verifier learns nothing extra"
- **Connect with thin lines to center label "ZK Proof"**

### Diagram 2: SNARKs vs STARKs Comparison (Tweet 5-6)
- **Layout:** Two-column comparison table style (but visual, not a markdown table)
- **Left column "SNARKs":** Small proof icon, "Trusted Setup" warning triangle, "Small proofs" with a compressed file icon
- **Right column "STARKs":** Larger proof icon, "No Trusted Setup" green checkmark, "Bigger proofs but transparent" with an open eye icon
- **Use orange for SNARKs column, cyan for STARKs column**

### Diagram 3: Circuit Concept (Tweet 7-8)
- **Show:** Input wires (left) → gate boxes (AND, multiplication symbols) → output wire (right)
- **Label:** "Arithmetic Circuit" above
- **Highlight one gate in cyan with label "Constraint" and an arrow explaining "Each gate = one equation the prover must satisfy"

---

## Post #19: Uniswap V4 Hook Architecture

### Header Image (Tweet 1)
- **Composition:** The Uniswap unicorn silhouette (simplified) with fishing hooks hanging from it — playful visual pun
- **Text:** "Uniswap V4 Hooks" in white, "Customize Everything" in cyan
- **Background:** Dark with subtle Uniswap pink (#ff007a) accents blending to cyan

### Diagram 1: Hook Lifecycle (Tweet 3-4)
- **Layout:** Vertical timeline / swimlane
- **Center column:** "Swap" flow going top to bottom: Initialize → beforeSwap → SWAP EXECUTION → afterSwap → Settle
- **Left/right hooks:** Branching arrows to "Your Custom Code" boxes at each hook point (beforeSwap, afterSwap, beforeAddLiquidity, etc.)
- **Color:** Main flow in white, hook branches in cyan, "Your Code" boxes in orange

### Diagram 2: Address Mining (Tweet 5)
- **Show:** Multiple address hashes scrolling/floating, one highlighted in cyan where the leading bits match the hook flags
- **Label:** "Address encodes permissions" with an arrow pointing to the first bytes of the address
- **Small legend:** "0x01 = beforeSwap", "0x02 = afterSwap" etc.

### Diagram 3: GrimSwap Integration (Tweet 6-7)
- **Layout:** Uniswap V4 pool in center → hook arrow → "GrimSwap ZK Module" box → "Shielded Swap" output
- **Show privacy shield icon on the GrimSwap box**
- **Label:** "Privacy layer plugs in via hooks — no fork needed"

---

## Post #20: Solidity Storage Layout Deep Dive

### Header Image (Tweet 1)
- **Composition:** A grid of numbered slots (Slot 0, Slot 1, Slot 2...) like a filing cabinet or memory bank
- **Text:** "Where Your Data Actually Lives" in white, "Solidity Storage" in cyan
- **Some slots glowing (occupied), others dim (empty)**

### Diagram 1: Slot Packing (Tweet 3-4)
- **Layout:** Two horizontal bars representing 32-byte slots
- **Bad example (top, in red/orange):** uint256 takes full Slot 0, uint8 wastes full Slot 1, address wastes full Slot 2
- **Good example (bottom, in green/cyan):** uint8 + uint8 + address packed into Slot 0 (show subdivisions within the bar), uint256 in Slot 1
- **Label:** "Pack small types together → save gas" with a gas pump icon showing savings

### Diagram 2: Variable Ordering (Tweet 5)
- **Show:** Contract code snippet on the left (simplified), arrows pointing to slot layout on the right
- **Highlight:** How declaration order maps to slot numbers
- **Color code:** Each variable type gets a color — uint256=cyan, address=orange, bool=white

---

## Post #21: EOF is Coming

### Header Image (Tweet 1)
- **Composition:** A shipping container (literal container shape) with "EOF" stamped on it, slightly open with light (cyan glow) coming from inside
- **Text:** "EVM Object Format" in white, "The EVM Gets Structured" in orange
- **Background:** Dark industrial/minimal

### Diagram 1: Container Structure (Tweet 3-4)
- **Layout:** Vertical stacked sections within a container outline
- **Sections (top to bottom):**
  - "Magic Bytes" (small header, gray)
  - "Header" — version, code sizes (orange)
  - "Code Section(s)" (cyan, largest block)
  - "Data Section" (white/gray)
- **Labels on right side with arrows pointing to each section**
- **Compare with a "Legacy EVM" blob on the left (just one undifferentiated gray block labeled "raw bytecode") to show the improvement**

### Diagram 2: New Opcodes (Tweet 5)
- **Simple list-style visual:** Three boxes in a row
  - "CALLF" → "Call function" (arrow to code section)
  - "RETF" → "Return from function"
  - "JUMPF" → "Tail call"
- **Show arrows between them suggesting internal function calls within the container**

---

## Post #24: Why EIP-7708 Matters

### Header Image (Tweet 1)
- **Composition:** An ETH diamond logo with radio waves / log signals emanating from it (like a broadcast tower)
- **Text:** "EIP-7708" in white, "ETH Transfers Finally Emit Logs" in cyan
- **Small thought bubble:** "Wait, they didn't before?!" in orange

### Diagram 1: Before vs After (Tweet 2-3)
- **Two panels:**
  - **Before:** EOA sends ETH → arrives silently. Indexer with question marks, "No event, no log, nothing to index"
  - **After:** EOA sends ETH → Log emitted → Indexer catches it with a green checkmark, "Transfer(from, to, value)"
- **Show a The Graph / Subgraph icon on the "After" side smiling**

---

## Post #26: How I Got 2 Remote Jobs

### Header Image (Tweet 1)
- **Composition:** Two laptop screens side by side, each showing a different company logo/placeholder, connected to one person silhouette in the center
- **Text:** "2 Remote Jobs" in bold white, "Here's How" in orange
- **Background:** Dark with subtle globe/world map outline (remote = global)

### Diagram 1: Career Timeline (Tweet 3-8)
- **Layout:** Horizontal timeline with nodes
- **Nodes on the timeline:** Each major career event as a dot with a short label above/below (alternating)
- **Key milestones:** First coding → First freelance → Upwork grind → First full-time remote → Second job → Present
- **Color the progression from gray (early) → orange (growth) → cyan (current)**
- **Include salary/income indicators if mentioned — small bar chart under each node**

---

## Post #27: The XPL Story

### Header Image (Tweet 1)
- **Composition:** A rollercoaster chart line — going up euphoria, then crashing down hard
- **Text:** "The XPL Story" in white, "How I Lost It All on Altcoins" in orange/red
- **The crash section of the line could have a small 💀 emoji or skull icon**

### Diagram 1: Journey Arc (Tweet 3-6)
- **Layout:** Emotional/financial arc — curved line on a graph
- **Y-axis:** Portfolio value / Confidence
- **X-axis:** Time
- **Key points labeled on the curve:**
  - "Discovery" (rising)
  - "XPL Moon" (peak, with rocket icon)
  - "Rug/Crash" (sharp drop, red zone)
  - "Despair" (bottom)
  - "BTC Enlightenment" (steady rise, orange line diverging to Bitcoin)
- **End state:** Clean orange line labeled "BTC Only" going steadily up

---

## Post #28: EIP-7702 Deep Dive for Builders

### Header Image (Tweet 1)
- **Composition:** Blueprint/schematic style — dark blue background with white/cyan technical drawings of authorization flow
- **Text:** "EIP-7702 Builder's Guide" in white, "Under the Hood" in cyan
- **Wrench + code bracket icons**

### Diagram 1: Authorization Tuple (Tweet 3-4)
- **Show:** A tuple structure as a labeled box with fields:
  - `chain_id` (gray)
  - `address` (cyan — the delegate contract)
  - `nonce` (orange)
  - `y_parity, r, s` (white — signature fields)
- **Arrow from the tuple to an EOA icon showing "This EOA authorizes this contract to run as its code"**

### Diagram 2: Delegation Flow (Tweet 5-7)
- **Horizontal flow diagram:**
  - EOA signs authorization → Tx includes auth list → EVM sets EOA's code → Execution runs delegate code with EOA's context
- **Highlight:** "EOA's storage, delegate's logic" with a split-color box (half cyan, half orange)
- **Warning callout:** "⚠️ Delegate can access EOA's storage" in red/orange

### Diagram 3: Batched Operations (Tweet 8-9)
- **Show:** Single transaction box containing multiple operation boxes inside: "Approve", "Swap", "Stake" — all in one
- **Compare with:** Three separate transaction boxes (the old way) with gas costs labeled on each
- **Total gas comparison at bottom**

---

## Post #29: Zero to CTO No Degree

### Header Image (Tweet 1)
- **Composition:** A graduation cap with a big red X over it, next to a glowing laptop with code on screen
- **Text:** "Zero to CTO" in bold white, "No Degree Required" in cyan
- **Age badge:** "17 → 25" in orange

### Diagram 1: Career Timeline (Tweet 3-8)
- **Layout:** Vertical timeline (top to bottom = age 17 to 25)
- **Each node:** Age label + role/milestone + small icon
  - 17: "Started coding" (keyboard icon)
  - 18-19: "Freelance grind" (coffee cup)
  - 20-21: "First real job" (office icon)
  - 22-23: "Senior Dev" (rocket)
  - 24-25: "CTO" (crown/star)
- **Salary progression as a growing bar on the right side**
- **Color gradient from gray to cyan as seniority increases**

---

## Post #30: ZK Privacy on Uniswap V4 GrimSwap

### Header Image (Tweet 1)
- **Composition:** Uniswap pool icon wrapped in a shield/privacy bubble (semi-transparent cyan overlay)
- **Text:** "GrimSwap" in white, "ZK Privacy on Uniswap V4" in cyan
- **Lock + Uniswap unicorn mashup**

### Diagram 1: Shielded Balance Layer (Tweet 3-4)
- **Layout:** Two layers
- **Top layer (public):** Uniswap V4 pool — visible token balances, regular swaps
- **Bottom layer (shielded):** GrimSwap layer — encrypted balances shown as "???" or lock icons, connected to ZK proof generators
- **Arrow:** User deposits into shielded layer → swaps privately → withdraws to public
- **Color:** Public layer in white/gray, shielded layer in cyan with glow

### Diagram 2: Commitment Tree (Tweet 5-6)
- **Layout:** Merkle tree structure
- **Leaf nodes:** "Commitment₁", "Commitment₂", etc. (each a hash of: amount + secret + nullifier)
- **Interior nodes:** Hash combinations flowing up to root
- **Highlight one leaf with labels pointing to its components: "amount", "blinding factor", "nullifier"**
- **Root labeled "On-chain Merkle Root" in orange**
- **Side note:** "Nullifier revealed on spend → prevents double-spend" with a red X on duplicate

---

## Post #31: ETHJKT Building Indonesia's Web3 Dev Army

### Header Image (Tweet 1)
- **Composition:** Map of Java/Jakarta with Ethereum diamond pin on Jakarta's location, radiating connection lines to other cities
- **Text:** "ETHJKT" in bold white, "Building Indonesia's Web3 Dev Army" in orange
- **Small dev avatars (circles with laptop icons) scattered along the connection lines**

### Diagram 1: Community Growth (Tweet 4-6)
- **Layout:** Growth chart — bar chart or area chart style
- **X-axis:** Time milestones (first meetup, first hackathon, etc.)
- **Y-axis:** Community size / events
- **Key milestones as labeled points on the curve**
- **Icons:** Meetup (people), Hackathon (trophy), Online (globe)
- **Color:** Bars in gradient from orange to cyan as community grows**

---

## Post #32: Bitcoin Monetary Policy for Indonesian Context

### Header Image (Tweet 1)
- **Composition:** Split image — left side: stack of Rupiah bills (fading/shrinking over time), right side: Bitcoin logo (growing/glowing)
- **Text:** "Hard Money" in white, "Untuk Indonesia" in orange
- **Subtle Indonesian flag colors (red/white) as accent**

### Diagram 1: Rupiah Devaluation Chart (Tweet 3-4)
- **Layout:** Line chart
- **X-axis:** Years (1970s → present)
- **Y-axis:** IDR/USD exchange rate (going up = weaker rupiah)
- **Line:** Steadily climbing with sharp spikes at 1998 crisis, 2008, 2020
- **Label the spikes with events: "Krismon '98", "GFC '08"**
- **Overlay a flat orange line: "BTC supply: 21M forever"**

### Diagram 2: BTC vs Fiat Properties (Tweet 5-6)
- **Two-column visual comparison:**
  - Rupiah: "Unlimited supply" (printer icon), "Government controlled" (building), "Devalues over time" (down arrow, red)
  - Bitcoin: "21M cap" (lock icon), "Decentralized" (network nodes), "Deflationary" (up arrow, cyan)

---

## Post #33: Solidity Patterns That Actually Matter

### Header Image (Tweet 1)
- **Composition:** A Solidity file icon with a gold star badge / "Best Practices" stamp
- **Text:** "Solidity Patterns" in white, "That Actually Matter" in cyan
- **Small code snippets floating around the edges (curly braces, require(), etc.)**

### Diagram 1: Checks-Effects-Interactions (Tweet 2-3)
- **Layout:** Three stacked horizontal bars in a vertical sequence with arrows
  1. "CHECKS" (orange) — require(), validation icons (shield)
  2. "EFFECTS" (cyan) — state changes, "balance -= amount" 
  3. "INTERACTIONS" (white) — external calls, "addr.call{value}()"
- **Big red X on a reordered version (Interactions before Effects) labeled "⚠️ Reentrancy!"**

### Diagram 2: Pattern Quick Reference (Tweet 4-6)
- **Grid of 4-6 small pattern cards:**
  - "Custom Errors" — gas savings icon + code snippet `error Unauthorized()`
  - "Immutable/Constant" — lock icon + "deploy-time only"
  - "Pull over Push" — arrow pointing inward vs outward
  - "Guard Checks" — modifier shield icon
- **Each card: small icon + 1-line description, colored border (alternating cyan/orange)**

---

## Post #35: The Real Web3 Education Problem

### Header Image (Tweet 1)
- **Composition:** A broken bridge — left cliff labeled "Web2 Devs" (lots of people), right cliff labeled "Web3" (glowing city), gap in the middle labeled "Education Gap"
- **Text:** "The Real Problem" in white, "Web3 Education is Broken" in orange
- **Style:** Slightly dramatic, illustrative

### Diagram 1: Education Approach (Tweet 3-4)
- **Layout:** Two paths diverging from a starting point
- **Wrong path (top, red/muted):** "Learn Solidity syntax → Build toy dApp → Get confused by real DeFi → Quit"
- **Right path (bottom, cyan/green):** "Understand EVM → Build mental models → Read real contracts → Ship production code"
- **Each step as a node on the path with small icons**

---

# V2.1 Threads

---

## Post #42: AI + Bitcoin Fire Sale Theory

### Header Image (Tweet 1)
- **Composition:** Robot/AI icon holding a Bitcoin coin, with flames in the background (fire sale)
- **Text:** "AI + Bitcoin" in white, "The Fire Sale Theory" in orange
- **Background:** Dark with red/orange gradient at bottom suggesting fire

### Diagram 1: Wealth Transfer Flow (Tweet 2-3)
- **Layout:** Sankey-style or flow diagram
- **Left:** "Traditional Jobs" (fading, gray) → "AI Automation" (robot icon, center)
- **Center:** "Wealth Concentration" arrow pointing to "Tech/AI Owners"
- **Bottom fork:** "Smart money" arrow → Bitcoin icon (glowing orange)
- **Label:** "BTC = hedge against AI wealth concentration"

---

## Post #61: MEV Explained Like a Warung

### Header Image (Tweet 1)
- **Composition:** A warung padang (simple Indonesian food stall) with blockchain elements — the food display case has "transactions" instead of food
- **Text:** "MEV" in bold white, "Explained Like a Warung Padang" in orange
- **Playful, colorful, Indonesian street food vibes mixed with tech**

### Diagram 1: Front-Running (Tweet 3)
- **Layout:** Queue of people at a warung counter
- **Normal customer:** Standing in line, order = "Buy 1 ETH"
- **MEV bot:** Cutting in front, order = "Buy 1 ETH first" (highlighted in red/orange)
- **Result:** Normal customer pays more (price moved up)
- **Label each character with blockchain equivalents: "User Tx", "Searcher Tx"**

### Diagram 2: Sandwich Attack (Tweet 4-5)
- **Layout:** Three transactions stacked like a sandwich (literally draw bread slices)
- **Top bread:** "Bot buys" (orange slice)
- **Filling:** "Your swap" (cyan, the victim)
- **Bottom bread:** "Bot sells" (orange slice)
- **Arrow showing profit flowing from the filling to the bread slices**
- **Label:** "You get worse price, bot profits the difference"

---

## Post #62: Proxy Patterns Divorce Lawyers

### Header Image (Tweet 1)
- **Composition:** A smart contract document being split in two by a dotted line — "Logic" on one side, "Storage" on the other, with a lawyer figure (briefcase icon) in the middle
- **Text:** "Proxy Patterns" in white, "Smart Contract Divorce Lawyers" in orange
- **Playful courtroom/legal vibe mixed with code**

### Diagram 1: Three Proxy Types (Tweet 3-5)
- **Layout:** Three columns side by side
- **Transparent Proxy:**
  - Proxy box (top, orange) → arrow → Implementation box (bottom, cyan)
  - Admin icon with key on the side
  - Label: "Admin can upgrade, users can't call admin functions"
- **UUPS Proxy:**
  - Proxy box (top, simpler) → arrow → Implementation box with "upgradeToAndCall()" inside
  - Label: "Upgrade logic lives in implementation"
- **Beacon Proxy:**
  - Multiple Proxy boxes (top) → all arrows point to one Beacon box (middle) → arrow to Implementation (bottom)
  - Label: "One beacon, many proxies, one upgrade upgrades all"
- **Color-code each pattern differently: orange, cyan, white**

---

## Post #63: EIP-4844 Blobs

### Header Image (Tweet 1)
- **Composition:** Large blob shapes (literally amorphous blob shapes) with data bits inside them, floating above an Ethereum chain
- **Text:** "EIP-4844" in white, "Blobs: Cheap Data for L2s" in cyan
- **Blobs should look playful — soft rounded shapes, semi-transparent cyan**

### Diagram 1: Blob vs Calldata (Tweet 3-4)
- **Two panels:**
  - **Calldata (before):** Heavy block attached to a chain link, labeled "Expensive, stored forever", red cost indicator
  - **Blob (after):** Light floating blob loosely tethered to chain, labeled "Cheap, pruned after ~18 days", green cost indicator
- **Cost comparison: "$$$" vs "$" with actual estimated savings**

### Diagram 2: L2 Cost Reduction (Tweet 5)
- **Bar chart:** L2 transaction costs before 4844 vs after
- **Dramatic height difference**
- **Label specific L2s: Arbitrum, Optimism, Base**
- **Colors: Red/tall bars for before, cyan/short bars for after**

---

## Post #65: Oracle Problem

### Header Image (Tweet 1)
- **Composition:** A crystal ball (oracle) sitting on a blockchain, with question marks and price feeds floating around it
- **Text:** "The Oracle Problem" in white, "How Smart Contracts See the Real World" in cyan
- **The crystal ball has a crack in it suggesting vulnerability**

### Diagram 1: Oracle Architecture (Tweet 2-3)
- **Layout:** Three layers
  - **Off-chain:** Multiple data sources (exchanges, APIs) in gray
  - **Oracle network:** Chainlink node icons in a ring/network formation (orange)
  - **On-chain:** Smart contract consuming the price feed (cyan)
- **Arrows flowing from off-chain → oracle network → on-chain**

### Diagram 2: TWAP vs Spot Manipulation (Tweet 4)
- **Two line charts side by side:**
  - **Spot price:** Volatile line with a sharp manipulation spike (red flash)
  - **TWAP:** Smooth averaged line that barely reacts to the spike
- **Label:** "TWAP resists single-block manipulation"

---

## Post #66: Bridge Security

### Header Image (Tweet 1)
- **Composition:** A bridge (literal bridge structure) connecting two floating islands labeled "Chain A" and "Chain B", with a hacker silhouette underneath planting dynamite
- **Text:** "Bridge Security" in white, "$2B+ Lost" in red/orange
- **Dramatic, danger vibes**

### Diagram 1: Bridge Architecture (Tweet 2-3)
- **Layout:** Horizontal flow
  - Chain A box → "Lock/Burn" module → Bridge relayer/validator set (center) → "Mint/Unlock" module → Chain B box
- **Label trust assumptions at each step**
- **Highlight the relayer/validator as the trust bottleneck (orange warning)**

### Diagram 2: Attack Vectors (Tweet 4-6)
- **Grid of 3-4 attack cards (like the pattern cards):**
  - "Validator Compromise" — broken key icon (Ronin)
  - "Smart Contract Bug" — bug icon (Wormhole)
  - "Relayer Manipulation" — twisted arrow
  - "Fake Proof" — forged stamp icon (Nomad)
- **Each card: red border, hack name, amount lost, 1-line description**

---

## Post #69: Verkle Trees

### Header Image (Tweet 1)
- **Composition:** Side-by-side tree structures — left is a dense Merkle tree (lots of nodes/hashes), right is a sleek Verkle tree (fewer nodes, polynomial commitments)
- **Text:** "Verkle Trees" in white, "Ethereum Gets Lighter" in cyan
- **Arrow from Merkle → Verkle with "Evolution" label**

### Diagram 1: Merkle vs Verkle (Tweet 3-4)
- **Two tree diagrams:**
  - **Merkle (left):** Binary tree, each node shows "H(left+right)", wide proof path highlighted (many sibling nodes needed)
  - **Verkle (right):** Wider branching (16+ children per node), proof path highlighted (much fewer nodes needed)
- **Proof size comparison:** "Merkle: ~1KB" vs "Verkle: ~150B" with size icons
- **Label:** "Wider tree = shorter proofs = stateless clients possible"

---

## Post #71: How I Almost Quit Coding

### Header Image (Tweet 1)
- **Composition:** A laptop half-closed (about to shut), with a hand hesitating on the lid. Faint code on the screen fading out
- **Text:** "I Almost Quit" in white, "Coding" in red (like it's being deleted/crossed out)
- **Mood: Emotional, relatable, slightly dark**

### Diagram 1: Rejection → Comeback Arc (Tweet 3-7)
- **Layout:** Emotional journey curve (like a story arc)
- **X-axis:** Time
- **Y-axis:** Motivation/confidence
- **Key points:**
  - "Rejections pile up" (dipping down)
  - "Almost quit" (lowest point, red zone)
  - "One thing changed" (pivot point, orange)
  - "Breakthrough" (rising sharply, cyan)
  - "Now" (high point, glowing)
- **Style:** Hand-drawn feel, slightly wobbly line for authenticity

---

## Post #72: Wedding Planning Thread

### Header Image (Tweet 1)
- **Composition:** A Gantt chart / project timeline but the tasks are wedding things: "Venue", "Catering", "Guest List", "Nikah Ceremony", "Reception"
- **Text:** "Wedding Planning" in white, "An Engineer's Approach" in cyan
- **Small heart icon merged with a gear/cog icon**
- **Playful: Japanese + Indonesian flags as small accents (cross-cultural)**

### Diagram 1: Cross-Cultural Planning (Tweet 4-5)
- **Venn diagram:** Two overlapping circles
  - Left circle: "Indonesian Traditions" (orange) — items: Nikah, Siraman, Adat
  - Right circle: "Japanese Traditions" (cyan) — items: San-san-kudo, Yuinou
  - Overlap: "Universal" — Love, Family, Food, Chaos
- **Playful labels and small icons for each tradition**

### Diagram 2: Budget Spreadsheet Visual (Tweet 6-7)
- **Mock spreadsheet/dashboard:** Pie chart of budget allocation
  - Venue, Food, Outfits, Photography, Misc
- **Engineer touch:** Version control joke — "budget_v14_FINAL_FINAL.xlsx"
- **Progress bar at bottom showing completion percentage**

---

## Post #73: Security Audit Horror Stories

### Header Image (Tweet 1)
- **Composition:** A magnifying glass over smart contract code, revealing bugs/skulls hidden in the code lines
- **Text:** "Audit Horror Stories" in white, "Real Exploits, Real Losses" in red/orange
- **Horror movie poster vibe but developer-themed — dark, slightly spooky**

### Diagram 1: Exploit Pattern Cards (Tweet 3-6)
- **Grid of exploit cards (like trading cards):**
  - **Reentrancy:** Circular arrow icon, "The DAO — $60M", severity: CRITICAL (red)
  - **Oracle Manipulation:** Crystal ball crack, "Mango Markets — $114M"
  - **Access Control:** Broken lock, "Parity Wallet — $150M"
  - **Integer Overflow:** Overflowing number, "Pre-SafeMath era"
- **Each card: dark background, red border, icon, name, amount, 1-line fix**

---

## Post #74: Ngajarin Keiko Crypto

### Header Image (Tweet 1)
- **Composition:** Two stick figures at a table — one explaining (whiteboard with BTC/ETH logos), the other with progressively more confused then enlightened expressions
- **Text:** "Ngajarin Keiko Crypto" in white, "Teaching My Fiancée Web3" in cyan
- **Playful, cute, wholesome vibes. Maybe heart bubbles around the scene**

### Diagram 1: Learning Progression (Tweet 3-5)
- **Horizontal flow with emoji-style faces:**
  - "What's Bitcoin?" (confused face) → "Oh it's digital money" (thinking face) → "Wait, no one controls it?" (surprised face) → "I want some" (excited face) → "Have you checked the charts?" (galaxy brain)
- **Each step is a rounded box with the face and a short quote**
- **Color gradient from gray → cyan as understanding grows**

---

## Post #75: Why Your Smart Contract Will Get Hacked

### Header Image (Tweet 1)
- **Composition:** A smart contract file icon wearing a "kick me" sign on its back, with crosshairs/target on it
- **Text:** "Your Smart Contract" in white, "WILL Get Hacked" in red
- **Slightly aggressive, code-roast energy**

### Diagram 1: Common Vulnerability Checklist (Tweet 3-6)
- **Layout:** Checklist with X marks (all failing)**
  - ☒ "No reentrancy guard" — circular arrow icon
  - ☒ "tx.origin for auth" — broken shield
  - ☒ "Unchecked external calls" — explosion icon
  - ☒ "No access control on admin functions" — open door
  - ☒ "Hardcoded gas values" — clock bomb
- **Each item in red with a brief "Why it's bad" annotation in white**
- **Bottom label:** "If you checked any of these... fix it NOW" in orange

---

## Post #76: Scaling Ethereum

### Header Image (Tweet 1)
- **Composition:** Ethereum diamond being lifted by multiple L2 balloons (Arbitrum, Optimism, Base, zkSync logos as balloons)
- **Text:** "Scaling Ethereum" in white, "The L2 Landscape" in cyan
- **Upward movement, growth, lifting**

### Diagram 1: L2 Landscape Map (Tweet 3-4)
- **Layout:** Tree/hierarchy diagram
- **Root:** "Ethereum L1" (center bottom)
- **Two branches:**
  - "Optimistic Rollups" (orange branch) → Arbitrum, Optimism, Base
  - "ZK Rollups" (cyan branch) → zkSync, StarkNet, Scroll, Polygon zkEVM
- **Each L2 as a small branded circle/box**
- **TPS and cost annotations next to each**

### Diagram 2: Rollup Architecture (Tweet 5-6)
- **Vertical stack:**
  - Users (top) → L2 Sequencer → Batch transactions → Post to L1
- **Two variants side by side:**
  - Optimistic: "Assume valid, challenge period 7 days" (orange)
  - ZK: "Prove valid with ZK proof, instant finality" (cyan)
- **Arrow comparison: 7-day withdrawal vs instant**

---

## Post #77: Hidup sebagai Dollar Earner di Indonesia

### Header Image (Tweet 1)
- **Composition:** Dollar bills raining down onto an Indonesian landscape (palm trees, rice terraces silhouette), with a laptop in the center
- **Text:** "Dollar Earner" in white, "di Indonesia" in orange
- **Dual currency symbols: $ and Rp with an exchange arrow**

### Diagram 1: Lifestyle Comparison (Tweet 3-5)
- **Two-column comparison:**
  - **US-based dev (left):** Salary bar, rent bar (huge), tax bar (huge), remaining bar (small). Gray tones.
  - **Indo-based dollar earner (right):** Same salary bar, rent bar (tiny), tax bar (moderate), remaining bar (huge, glowing cyan). 
- **Label:** "Same salary, wildly different lifestyle"

### Diagram 2: Currency Exchange Reality (Tweet 6-7)
- **Flow:** USD income → conversion → IDR spending
- **Show the "hacks": Wise/transfer services, timing conversions, keeping USD reserves**
- **Small graph showing USD/IDR fluctuation with annotation "Volatility is your friend (and enemy)"**

---

## Post #78: Worst Bugs I've Ever Shipped

### Header Image (Tweet 1)
- **Composition:** A hall of fame wall (like portrait frames) but each frame contains a bug — literally insect icons or code error icons, with plaques underneath
- **Text:** "Bug Hall of Shame" in white, "My Worst Shipped Bugs" in orange
- **Slightly comedic museum vibe**

### Diagram 1: Bug Timeline (Tweet 3-6)
- **Layout:** Horizontal timeline of disasters
- **Each bug as a "incident card" hanging from the timeline:**
  - Bug name / type
  - Severity indicator (🔴🟡🟢)
  - One-line description of what happened
  - Impact (users affected, money lost, hours to fix)
- **Cards alternate above and below the timeline**
- **Color: Severity-coded borders — red for critical, orange for bad, yellow for embarrassing**

### Diagram 2: Lessons Learned (Tweet 7)
- **Simple flow:** Bug icon → "Post-mortem" document → "Prevention" shield
- **Three takeaway boxes:**
  - "Always test edge cases" (magnifying glass icon)
  - "Monitor production" (dashboard icon)  
  - "Code review saves lives" (two-person icon)
- **Clean, positive ending — cyan/green tones**

---

# General Style Notes

| Element | Specification |
|---|---|
| **Background** | #1a1a2e (dark navy) or #0d1117 (GitHub dark) |
| **Primary text** | #ffffff (white) |
| **Accent 1** | #00d4ff (cyan) — for tech elements, positive |
| **Accent 2** | #ff6b35 (orange) — for emphasis, warnings, energy |
| **Danger/Loss** | #ff4444 (red) — for bugs, hacks, losses |
| **Success** | #00ff88 (green) — for solutions, good patterns |
| **Secondary** | #8b949e (muted gray) — for labels, less important elements |
| **Borders** | 2px stroke, slightly rounded (8px radius) |
| **Arrows** | Straight or single-curve, with arrowhead, 2px stroke |
| **Font** | Monospace for code/labels, default Excalidraw hand-drawn for titles |
| **Icons** | Simple geometric — don't over-detail. Recognizable silhouettes. |
| **Layout** | Generous whitespace. Don't crowd. Let it breathe. |
| **Signature** | Small "@anthropicdev" or Zexo's handle in bottom-right corner |

---

*Generated for Zexo's Excalidraw workflow. Each description is practical enough to build directly — open Excalidraw, follow the layout, add shapes, done.*
