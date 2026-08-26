# 🎨 GimnApp Design Kit — Posters & Social Assets

Companion to `marketing.md`. Everything here is built in **Canva Pro** using your brand system (red `#DC2626`, font **Outfit** — same as the app, available in Canva's font list).

---

## 1. Golden Rules (read before opening Canva)

- **3-second rule:** a student walking past must get the message in 3 seconds. One idea per poster. Big type, no paragraphs.
- **Hierarchy:** Hook (biggest thing on poster) → one visual → QR + micro-copy (smallest).
- **Max 12 words** of body text on any printed poster.
- **QR always bottom-right, at hand height** when posted (~140–160 cm). People scan with phones held at chest level.
- Every poster gets a **UTM-tagged link inside its QR** (`gimnapp.me/?utm=posteri-misterija`, `?utm=posteri-reveal`, `?utm=leaderboard`) → you'll see scan counts in Vercel Analytics.

---

## 2. Brand Setup in Canva (do once, 10 minutes)

1. Create a **Brand Kit**: upload logo (`public/favicon.png` source), colors below.
2. Fonts: **Outfit Bold** for headlines, **Outfit Regular/Medium** for everything else. Nothing else. Ever.
3. Save your layouts as templates so every future asset is consistent.

### Color palette
| Use | Hex |
|---|---|
| Primary red (brand) | `#DC2626` |
| Deep red (accents/hover) | `#991B1B` |
| Near-black backgrounds | `#0F172A` (slate-950) |
| White / off-white | `#FFFFFF` / `#F8FAFC` |
| Semantic green (only for "success/results") | `#10B981` |

High contrast matters — school hallways have harsh fluorescent light and glass reflections. Dark-on-light or white-on-dark-red both survive it. Avoid mid-gray text entirely.

---

## 3. The Two-Drop Poster System

### Drop 1 — Mystery teaser (hang Fri Sep 11)

Purpose: curiosity, zero explanation. Pairs with the `67.gimnapp.me` easter egg.

```
┌─────────────────────┐
│                     │
│                     │
│        67.          │   ← Outfit Bold, fills ~60% of width,
│                     │     white on #0F172A (or reverse)
│   [datum].          │   ← medium, e.g. "15. septembar."
│   Sve će biti       │
│   jasno.            │
│                     │
│              ┌────┐ │
│              │ QR │ │   ← small-ish, quiet corner,
│              └────┘ │     QR → 67.gimnapp.me
└─────────────────────┘
```

- **No logo. No app name. No explanation.** That's the whole trick.
- Alternative headline options (test 2 variants across school): `67.` alone / `Nešto dolazi.` / `[datum].`
- Print count: ~15 copies.

> ⚠️ Before printing: check that scanning the QR lands somewhere decent. `67.gimnapp.me` serves the easter egg page — fine. If you'd rather capture signups pre-launch, ask the agent to add a tiny `/soon` countdown page first and point Drop 1 QRs there instead.

### Drop 2 — Reveal poster (hang Mon Sep 14, by 07:30)

```
┌─────────────────────┐
│ [logo] GimnApp      │   ← top-left, small
│                     │
│  Tvoja škola.       │   ← Outfit Bold, huge, two lines
│  Tvoj glas.         │
│                     │
│  [telefon sa        │   ← phone-frame mockup with real
│   screenshotom      │     app screenshot (feed/vote screen),
│   aplikacije]       │     slightly rotated 3–5°
│                     │
│ Glasaj · Pitaj ·    │   ← one line, medium
│ Prati · AI gratis   │
│                     │
│  Besplatno     ┌───┐│
│  gimnapp.me    │QR ││   ← QR ≥ 7 cm, framed,
│                └───┘│     label "Skeniraj" underneath
└─────────────────────┘
```

- QR → `gimnapp.me/?utm=posteri-reveal`
- Screenshot must show a **populated** feed/vote screen (seeded content!), never empty states.
- Phone mockup: Canva → search "iPhone mockup" element, drop screenshot inside.
- Print count: ~20 copies.

### Drop 3 — Weekly Leaderboard poster (first copy Fri Sep 25, then weekly Fridays)

Same skeleton every week, only numbers change:

```
┌─────────────────────┐
│ 🍕 BITKA KLASA      │   ← title locked forever
│                     │
│  1. III-2    ▓▓▓▓▓▓ │   ← horizontal bars, class vs % signup
│  2. IV-1    ▓▓▓▓▓   │
│  3. II-4    ▓▓▓▓    │
│                     │
│  Tvoja klasa nije na│
│  listi? To se menja.│
│            ┌───┐    │
│  gimnapp.me│QR │    │
│            └───┘    │
└─────────────────────┘
```

- Update every Friday, photograph fresh copy in hallway + post same graphic to stories. Physical + digital sync = the competition feels alive.
- Print 3 copies (entrance, cafeteria, schedule board).

---

## 4. Print Specs (give these to the print shop)

| Spec | Value |
|---|---|
| Format | A3 portrait (297 × 420 mm), plus a few A2 for main entrance |
| Resolution | 300 DPI export (Canva: Share → Download → PDF Print, crop marks + bleed ON) |
| Paper | 170–200 gsm matte — glossy glares under hallway lights |
| Lamination | Only for leaderboard (gets touched/updated weekly) |
| Quantity | D1: 15 · D2: 20 (+2 A2) · Leaderboard: 3/wk |

Cost note: A3 color prints are cheap (~30–50 RSD/copy at local shops) — total campaign print budget under 2.000 RSD. Order deadline: place the full print order by **Tue Sep 8** so Drop 1 is physical for Fri Sep 11.

---

## 5. Where Exactly to Hang (placement map)

Ranked by eyeballs-per-day:

1. **Main entrance doors** — both sides, everyone passes twice daily
2. **Next to class schedule boards** — students stop here anyway every day
3. **Cafeteria queue** — captive audience, bored, phone in hand
4. **Staircase landings** — people pause climbing, read walls
5. **Bathroom stall doors & mirror** — gross but true: highest read-time of any location in school
6. **Locker hallways** — dwell time during breaks
7. **Classroom doors of friendly professors** — ask permission, adds legitimacy

Height: center of QR at **~145 cm** (teen chest/eye level). Tape all four corners, not just top — ripped posters kill momentum.

---

## 6. Social Template Specs (same brand system)

| Asset | Size | Notes |
|---|---|---|
| IG Story / TikTok slide | 1080×1920 | Keep text in middle 80% — platforms crop edges |
| IG Feed post | 1080×1350 (4:5) | More screen space than square = more hook room |
| Video end-card | 1080×1080 | Logo + `gimnapp.me` — identical last 2s of EVERY video |
| Countdown story | 1080×1920 | Canva animated template + IG native countdown sticker on top |
| Results announcement | 1080×1350 | Big number, green accent allowed here |

Build each once → save as Canva template → swap text/screenshot weekly. Batch-produce Sundays with the video edits.

---

## 7. Pre-Print Checklist

- [ ] Scan every QR yourself from 1.5 m distance, on school wifi AND mobile data
- [ ] Check UTM param appears correctly in destination URL
- [ ] Screenshot in phone mockup shows real, populated app content
- [ ] Date on teaser matches the actual launch day in marketing.md
- [ ] Serbian text proofread by second person (diakritika: š, č, ć, ž, đ correct everywhere)
- [ ] Exported as PDF Print @300 DPI with bleed
- [ ] Printed one test copy before full run — check colors aren't washed out
