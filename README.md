# 🌿 SahiPRD — Nature-Inspired PRD Score Checker Platform

> **Palette:** Nature Inspired — Forest Gray-Green and Sage Green, with Moss & Earthy Clay accents. Specially designed for sustainability, perishables, and expiry tracking.

SahiPRD is an institutional-grade Product Requirements Document (PRD) evaluation and scoring platform. Upload any `.md` file, paste raw markdown, or choose from our preloaded benchmark library (featuring the **SahiSupply v4 PRD**).

---

## ✨ Features

- **100-Point Standardized Rubric**: Evaluates PRDs across 6 core product & engineering pillars:
  1. **Problem Definition & Empathy (20 pts)** — Macro scale figures, root cause vs symptoms, persona & JTBD, falsifiable hypotheses.
  2. **Technical & Mathematical Architecture (20 pts)** — End-to-end data pipelines, MILP/LP math formulations, bounded heuristics, zero-trust checker, dual-phase specs.
  3. **Scope, Prioritization & Feasibility (20 pts)** — P0/P1/P2 tiering, person-hour role budgeting, deterministic cut ladder, fallback modes.
  4. **Innovation, Differentiation & Moat (15 pts)** — Honest capability benchmark, counterfactual "why-not" explainability, shadow-price economic insights, defensibility.
  5. **Execution, Validation & Pilot Roadmap (15 pts)** — Baseline-relative targets, standardized SUS protocols, phased pilot pathways (Shadow $\to$ Assisted $\to$ Measured).
  6. **Structure, Clarity & Intellectual Honesty (10 pts)** — Document ergonomics, synthetic disclosures, noise floors, zero buzzwords.
- **Nature-Inspired Palette**: Forest gray-green (`#16221b`, `#26382f`), Sage green (`#527561`, `#7a9c88`), Celadon (`#dce7e1`), and organic clay accents (`#b35235`).
- **Interactive Radial Score Gauge**: Animated SVG circle, grade tiers (A+ Elite to D Draft), and instant verdict.
- **Deep 24-Check Criterion Breakdown**: Every dimension broken into verifiable checks with status pills (✓ Pass, ⚠ Partial, ✕ Gap) and **live extracted evidence snippets** directly from the uploaded document.
- **Gap & Deduction Analysis**: Transparent penalty ledger detailing why points were lost.
- **Action Plan ("Path to 100")**: Step-by-step remediation suggestions with one-click copyable markdown snippets ready to paste into your PRD.
- **Built-in Document Inspector**: High-fidelity rendered markdown viewer with styled tables, equations, and code blocks.
- **Multi-Format Export**:
  - Download Audit Report as Markdown (`.md`)
  - Download Machine-Readable Audit Data (`.json`)
  - Print / Save as PDF (custom print stylesheet)
  - Copy GitHub Markdown Score Badge (`[![PRD Score](...)]`)

---

## 🚀 Getting Started

### 1. Open Directly in Browser (Zero Installation)
Simply double-click or open `index.html` in any web browser:
```bash
open /Users/virendra.mac/.gemini/antigravity/scratch/prd-score-checker/index.html
```

### 2. Run with Local Python Server
Launch the local server to enable API endpoints:
```bash
cd /Users/virendra.mac/.gemini/antigravity/scratch/prd-score-checker
python3 server.py
```
Then visit [http://localhost:8080](http://localhost:8080).

### 3. Command Line Interface (CLI)
You can evaluate any `.md` file directly in your terminal:
```bash
python3 prd_cli.py samples/sahisupply_v4.md
```

---

## 📁 Preloaded Benchmark PRDs

1. **`samples/sahisupply_v4.md`** *(Score: **96 / 100**, Grade: A+)*
   - *Expiry-aware distribution planning for Indian grocery & pharmacy networks.*
   - Exceptional mathematical formulation (MILP), bounded FEFO, independent zero-trust checker, 56 person-hour execution plan.
2. **`samples/ecotrace_mid.md`** *(Score: **43 / 100**, Grade: D)*
   - *Cold-chain IoT telemetry tracker.*
   - Good problem concept, but lacks formal math models, cut ladders, or independent safety checkers.
3. **`samples/ai_social_low.md`** *(Score: **40 / 100**, Grade: D)*
   - *Vague Web3 social network.*
   - Buzzword heavy, zero empirical evidence, no JTBD, no architecture.

---

## 🌿 Sustainability & Expiry Tracking Focus

SahiSupply tackles:
- **₹57,000 crore** of fruit & vegetable harvest losses annually.
- **₹48,000 crore** of pharmaceutical supply chain value leakage.
- Over **186–231 out-of-stock days** for essential medicines in regional clinics.

SahiPRD specifically evaluates how well distribution algorithms balance **freshness upon arrival** against **logistics cost** using mathematically bounded heuristics.
