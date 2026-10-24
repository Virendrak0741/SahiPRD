#!/usr/bin/env python3
"""
SahiPRD — Nature-Inspired PRD Score Evaluator (CLI Edition)
Color Scheme: Forest Gray-Green & Sage (ANSI formatting)
"""

import sys
import os
import re

# ANSI Color codes for Nature Inspired Forest & Sage Palette
COLOR_FOREST = "\033[38;2;38;56;47m"
COLOR_SAGE = "\033[38;2;82;117;97m"
COLOR_PALE_SAGE = "\033[38;2;157;187;180m"
COLOR_FRESH_GREEN = "\033[38;2;45;107;73m"
COLOR_AMBER = "\033[38;2;192;125;50m"
COLOR_CLAY = "\033[38;2;179;82;53m"
COLOR_RESET = "\033[0m"
COLOR_BOLD = "\033[1m"
COLOR_DIM = "\033[2m"

def evaluate_prd(text):
    word_count = len(re.findall(r'\b\w+\b', text))
    headings = len(re.findall(r'^#{1,6}\s+.+$', text, re.MULTILINE))
    tables = len(re.findall(r'\|[\s\S]*?\|[\s\S]*?\|', text))
    citations = len(re.findall(r'\[\d+\]|https?://[^\s\)]+|rajya sabha|lok sabha|icmr|pgimer|who|nabcons', text, re.IGNORECASE))

    # D1: Problem Definition & Evidence (20)
    has_scale = bool(re.search(r'₹|\$|€|crore|billion|million tonnes|lost.*harvest|\d+%', text, re.IGNORECASE))
    has_citations = citations >= 3
    s1_1 = 5 if (has_scale and has_citations) else 3 if has_scale else 1

    has_root_causes = bool(re.search(r'root cause|why planning fails|on the ground', text, re.IGNORECASE))
    s1_2 = 5 if has_root_causes else 1

    has_persona = bool(re.search(r'persona|ritesh|archetype|planner', text, re.IGNORECASE))
    has_jtbd = bool(re.search(r'when i|i want|so that', text, re.IGNORECASE))
    s1_3 = 5 if (has_persona and has_jtbd) else 3.5 if has_persona else 1

    has_hypo = bool(re.search(r'hypothes[ie]s|h1|h2', text, re.IGNORECASE))
    has_invalidation = bool(re.search(r'we are wrong if|invalidation|then we', text, re.IGNORECASE))
    has_credit = bool(re.search(r'credit term|invoice lock', text, re.IGNORECASE))
    s1_4 = 5 if (has_hypo and has_invalidation and has_credit) else 4 if (has_hypo and has_invalidation) else 1

    d1 = s1_1 + s1_2 + s1_3 + s1_4

    # D2: Technical Architecture & Rigor (20)
    has_mermaid = bool(re.search(r'```mermaid|flowchart', text, re.IGNORECASE))
    has_components = bool(re.search(r'fastapi|pydantic|react|sqlite|milp', text, re.IGNORECASE))
    s2_1 = 5 if (has_mermaid and has_components) else 3.5 if has_components else 1

    has_opt = bool(re.search(r'min\s+Σ|milp|decision variables|objective function', text, re.IGNORECASE))
    has_fefo = bool(re.search(r'bounded fefo|ε.*r_b', text, re.IGNORECASE))
    s2_2 = 5 if (has_opt and has_fefo) else 4 if has_opt else 1

    has_checker = bool(re.search(r'independent checker|zero shared|recomputes eligibility', text, re.IGNORECASE))
    has_fingerprint = bool(re.search(r'fingerprint|sha-256|hypothesis', text, re.IGNORECASE))
    s2_3 = 5 if (has_checker and has_fingerprint) else 3 if has_checker else 1

    has_scale_path = bool(re.search(r'scalability path|stress test|p50|p95', text, re.IGNORECASE))
    s2_4 = 5 if has_scale_path else 3

    d2 = s2_1 + s2_2 + s2_3 + s2_4

    # D3: Scope, Prioritization & Feasibility (20)
    has_p0p1 = bool(re.search(r'p0\s*[—–-]|p1\s*[—–-]|acceptance test', text, re.IGNORECASE))
    s3_1 = 5 if has_p0p1 else 2

    has_hours = bool(re.search(r'person-hours|hours budget|role [a-d]', text, re.IGNORECASE))
    s3_2 = 4 if has_hours else 2

    has_cut = bool(re.search(r'cut ladder|never cut|checkpoints at hours', text, re.IGNORECASE))
    s3_3 = 5 if has_cut else 2

    has_limits = bool(re.search(r'known limitations|fallbacks|single planning period', text, re.IGNORECASE))
    s3_4 = 5 if has_limits else 2

    d3 = s3_1 + s3_2 + s3_3 + s3_4

    # D4: Innovation & Moat (15)
    has_bench = bool(re.search(r'capability benchmark|spreadsheet / erp|enterprise planning', text, re.IGNORECASE))
    s4_1 = 5 if has_bench else 2

    has_explain = bool(re.search(r'why / why-not|shadow price|worth ₹', text, re.IGNORECASE))
    s4_2 = 4 if has_explain else 2

    has_moat = bool(re.search(r'hard to copy|trust layer|typed rule', text, re.IGNORECASE))
    s4_3 = 3 if has_moat else 1

    has_biz = bool(re.search(r'business model hypothesis|subscription', text, re.IGNORECASE))
    s4_4 = 2 if has_biz else 1

    d4 = s4_1 + s4_2 + s4_3 + s4_4

    # D5: Execution & Validation (15)
    has_baseline_tgt = bool(re.search(r'fill rate ≥ baseline|lost sales avoided', text, re.IGNORECASE))
    s5_1 = 5 if has_baseline_tgt else 2

    has_sus = bool(re.search(r'sus score|t1\s*—|t2\s*—', text, re.IGNORECASE))
    s5_2 = 4 if has_sus else 2

    has_pilot = bool(re.search(r'shadow mode|assisted mode|measured mode', text, re.IGNORECASE))
    s5_3 = 2 if has_pilot else 1

    has_demo = bool(re.search(r'three-minute demo|0:00|0:20', text, re.IGNORECASE))
    s5_4 = 3 if has_demo else 1

    d5 = s5_1 + s5_2 + s5_3 + s5_4

    # D6: Structure & Integrity (10)
    s6_1 = 4 if (headings >= 8 and tables >= 3) else 2
    has_honesty = bool(re.search(r'status\.\s*this is a plan|design setting or a target|noise floor', text, re.IGNORECASE))
    s6_2 = 3 if has_honesty else 1
    s6_3 = 3

    d6 = s6_1 + s6_2 + s6_3

    total = int(round(d1 + d2 + d3 + d4 + d5 + d6))
    return {
        "total": total,
        "d1": (d1, 20),
        "d2": (d2, 20),
        "d3": (d3, 20),
        "d4": (d4, 15),
        "d5": (d5, 15),
        "d6": (d6, 10),
        "words": word_count,
        "headings": headings,
        "tables": tables,
        "citations": citations
    }

def print_banner():
    print(f"{COLOR_SAGE}{COLOR_BOLD}🌿 SahiPRD — Nature-Inspired PRD Scoring Platform{COLOR_RESET}")
    print(f"{COLOR_DIM}Palette: Forest Gray-Green & Sage · Sustainability & Expiry Tracking{COLOR_RESET}\n")

def main():
    print_banner()
    if len(sys.argv) < 2:
        print("Usage: python3 prd_cli.py <path_to_prd.md>")
        print("Example: python3 prd_cli.py samples/sahisupply_v4.md\n")
        path = "samples/sahisupply_v4.md"
        if not os.path.exists(path):
            return
        print(f"{COLOR_PALE_SAGE}Defaulting to evaluating: {path}{COLOR_RESET}\n")
    else:
        path = sys.argv[1]

    if not os.path.exists(path):
        print(f"{COLOR_CLAY}Error: File not found: {path}{COLOR_RESET}")
        return

    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    res = evaluate_prd(content)

    # Score coloring
    if res["total"] >= 90:
        score_color = COLOR_FRESH_GREEN
        tier = "Elite Tier (Top 1%) · Ready for VC & Hackathon Demo"
        grade = "A+"
    elif res["total"] >= 75:
        score_color = COLOR_SAGE
        tier = "Institutional Grade · Strong Prototype Foundation"
        grade = "A"
    elif res["total"] >= 55:
        score_color = COLOR_AMBER
        tier = "Viable Spec · Requires Deeper Mathematical Model"
        grade = "B"
    else:
        score_color = COLOR_CLAY
        tier = "Draft Spec · Needs Substantial Rework"
        grade = "D"

    print(f"File Evaluated: {COLOR_BOLD}{os.path.basename(path)}{COLOR_RESET}")
    print(f"Stats: {res['words']} words | {res['headings']} sections | {res['tables']} tables | {res['citations']} citations\n")

    print(f"┌─────────────────────────────────────────────────────────────┐")
    print(f"│  OVERALL PRD SCORE:   {score_color}{COLOR_BOLD}{res['total']} / 100{COLOR_RESET}  ({grade})                             │")
    print(f"│  Tier: {score_color}{tier:<52}{COLOR_RESET} │")
    print(f"└─────────────────────────────────────────────────────────────┘\n")

    print(f"{COLOR_BOLD}Dimension Breakdown:{COLOR_RESET}")
    dims = [
        ("1. Problem Definition & Empathy", res["d1"]),
        ("2. Technical & Mathematical Architecture", res["d2"]),
        ("3. Scope, Prioritization & Feasibility", res["d3"]),
        ("4. Innovation, Differentiation & Moat", res["d4"]),
        ("5. Execution, Validation & Pilot Roadmap", res["d5"]),
        ("6. Structure, Clarity & Intellectual Honesty", res["d6"]),
    ]

    for name, (score, max_pts) in dims:
        pct = int(round((score / max_pts) * 100))
        bar_len = int(round(pct / 5)) # 20 chars
        bar = "█" * bar_len + "░" * (20 - bar_len)
        color = COLOR_FRESH_GREEN if pct >= 90 else COLOR_SAGE if pct >= 70 else COLOR_AMBER
        print(f"  {name:<44} {color}{score:>4.1f}/{max_pts} pts [{bar}] {pct:>3}%{COLOR_RESET}")

    print(f"\n{COLOR_DIM}For full interactive visual report with extracted evidence snippets,{COLOR_RESET}")
    print(f"{COLOR_DIM}open index.html in your browser or run python3 server.py{COLOR_RESET}\n")

if __name__ == "__main__":
    main()
