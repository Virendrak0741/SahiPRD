/**
 * SahiPRD — Application Controller
 * Nature-Inspired Forest Gray-Green & Sage Evaluation Platform
 */

// Embedded default sample PRD text (SahiSupply v4)
let currentMarkdown = "";
let currentEvaluation = null;
let currentFileName = "sahisupply_v4.md";

// Sample PRDs catalog
const SAMPLES = {
  sahisupply: {
    fileName: "sahisupply_v4.md",
    name: "SahiSupply v4 (Flagship)",
    category: "Food & Pharma Expiry Planning",
    path: "samples/sahisupply_v4.md"
  },
  ecotrace: {
    fileName: "ecotrace_mid.md",
    name: "EcoTrace v1.2",
    category: "Cold-Chain Sensor Tracking",
    path: "samples/ecotrace_mid.md"
  },
  omniloop: {
    fileName: "ai_social_low.md",
    name: "OmniLoop AI",
    category: "Vague Web3 Social MVP",
    path: "samples/ai_social_low.md"
  }
};

// Simple Markdown to HTML Parser for in-browser rendering without heavy external dependencies
function renderMarkdown(md) {
  if (!md) return "";
  let html = md
    // Escape HTML tags to prevent XSS
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Code blocks
  html = html.replace(/```([\w-]*)\n([\s\S]*?)```/g, function (match, lang, code) {
    return `<pre class="code-block"><code class="language-${lang}">${code.trim()}</code></pre>`;
  });

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Blockquotes
  html = html.replace(/^>\s?(.*)$/gm, '<blockquote>$1</blockquote>');

  // Tables
  html = html.replace(/^(\|.+?\|)\n(\|[-:\s|]+?\|)\n((?:\|.+?\|\n?)+)/gm, function (match, header, divider, rows) {
    const ths = header.split('|').slice(1, -1).map(h => `<th>${h.trim()}</th>`).join('');
    const trs = rows.trim().split('\n').map(row => {
      const tds = row.split('|').slice(1, -1).map(c => `<td>${c.trim()}</td>`).join('');
      return `<tr>${tds}</tr>`;
    }).join('');
    return `<table><thead><tr>${ths}</tr></thead><tbody>${trs}</tbody></table>`;
  });

  // Headings
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

  // Bold & Italic
  html = html.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

  // Unordered Lists
  html = html.replace(/^\s*[-*]\s+(.*)$/gm, '<ul><li>$1</li></ul>');
  html = html.replace(/<\/ul>\s*<ul>/g, '');

  // Ordered Lists
  html = html.replace(/^\s*\d+\.\s+(.*)$/gm, '<ol><li>$1</li></ol>');
  html = html.replace(/<\/ol>\s*<ol>/g, '');

  // Horizontal Rules
  html = html.replace(/^---$/gm, '<hr style="border:0;border-top:1px solid var(--border-light);margin:24px 0;">');

  // Paragraphs
  html = html.replace(/\n\s*\n/g, '</p><p>');
  html = '<p>' + html + '</p>';
  html = html.replace(/<p>\s*<\/p>/g, '');

  return html;
}

// Initialise App
document.addEventListener("DOMContentLoaded", function () {
  initTheme();
  initTabs();
  initDragAndDrop();
  initEditor();
  loadSample("sahisupply"); // Load SahiSupply flagship by default
});

// Theme Management
function initTheme() {
  const saved = localStorage.getItem("sahiprd_theme") || "light";
  document.documentElement.setAttribute("data-theme", saved);
  updateThemeIcon(saved);

  const toggleBtn = document.getElementById("theme-toggle-btn");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme");
      const next = current === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("sahiprd_theme", next);
      updateThemeIcon(next);
    });
  }
}

function updateThemeIcon(theme) {
  const icon = document.getElementById("theme-icon");
  if (icon) {
    icon.innerHTML = theme === "dark"
      ? '<path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'
      : '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>';
  }
}

// Tabs
function initTabs() {
  const tabButtons = document.querySelectorAll(".tab-btn");
  tabButtons.forEach(btn => {
    btn.addEventListener("click", function () {
      const target = this.getAttribute("data-tab");
      tabButtons.forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".tab-content-panel").forEach(p => p.classList.remove("active"));

      this.classList.add("active");
      const panel = document.getElementById(`tab-${target}`);
      if (panel) panel.classList.add("active");
    });
  });
}

// Drag & Drop File Loader
function initDragAndDrop() {
  const dropzone = document.getElementById("dropzone");
  const fileInput = document.getElementById("file-input");

  if (!dropzone || !fileInput) return;

  dropzone.addEventListener("click", () => fileInput.click());

  fileInput.addEventListener("change", function (e) {
    if (this.files && this.files[0]) {
      handleFile(this.files[0]);
    }
  });

  ["dragenter", "dragover"].forEach(eventName => {
    dropzone.addEventListener(eventName, e => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.add("drag-over");
    });
  });

  ["dragleave", "drop"].forEach(eventName => {
    dropzone.addEventListener(eventName, e => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.remove("drag-over");
    });
  });

  dropzone.addEventListener("drop", function (e) {
    const dt = e.dataTransfer;
    if (dt && dt.files && dt.files[0]) {
      handleFile(dt.files[0]);
    }
  });
}

function handleFile(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (e) {
    currentFileName = file.name;
    currentMarkdown = e.target.result;
    runEvaluation(currentMarkdown, currentFileName);
  };
  reader.readAsText(file);
}

// Live Editor
function initEditor() {
  const toggleBtn = document.getElementById("editor-toggle-btn");
  const panel = document.getElementById("editor-panel");
  const textarea = document.getElementById("editor-textarea");
  const reEvaluateBtn = document.getElementById("re-evaluate-btn");

  if (toggleBtn && panel) {
    toggleBtn.addEventListener("click", () => {
      panel.classList.toggle("open");
      if (panel.classList.contains("open")) {
        textarea.value = currentMarkdown;
      }
    });
  }

  if (reEvaluateBtn && textarea) {
    reEvaluateBtn.addEventListener("click", () => {
      currentMarkdown = textarea.value;
      runEvaluation(currentMarkdown, "custom_edited.md");
    });
  }
}

// Load Preloaded Samples
function loadSample(key) {
  const sample = SAMPLES[key];
  if (!sample) return;

  // Highlight pill
  document.querySelectorAll(".sample-pill-btn").forEach(btn => {
    btn.classList.toggle("active", btn.getAttribute("data-sample") === key);
  });

  fetch(sample.path)
    .then(res => {
      if (!res.ok) throw new Error("Network response error");
      return res.text();
    })
    .then(text => {
      currentFileName = sample.fileName;
      currentMarkdown = text;
      runEvaluation(currentMarkdown, currentFileName);
    })
    .catch(err => {
      console.warn("Could not fetch sample via HTTP, using fallback embedded text", err);
      // Fallback: If running file:// without webserver, load built-in fallback
      loadEmbeddedFallback(key);
    });
}

function loadEmbeddedFallback(key) {
  if (key === "sahisupply") {
    // SahiSupply markdown content as fallback
    const sahisupplyText = document.getElementById("raw-sahisupply-content")?.textContent || "";
    if (sahisupplyText) {
      currentFileName = "sahisupply_v4.md";
      currentMarkdown = sahisupplyText.trim();
      runEvaluation(currentMarkdown, currentFileName);
    }
  }
}

// Core Evaluation & Dashboard Update
function runEvaluation(markdown, fileName) {
  if (!window.PRDEvaluator) {
    console.error("PRDEvaluator engine not loaded");
    return;
  }

  currentEvaluation = window.PRDEvaluator.evaluate(markdown);
  updateDashboard(currentEvaluation, fileName, markdown);
}

function updateDashboard(res, fileName, rawText) {
  // Update file info bar
  const nameEl = document.getElementById("loaded-filename");
  const wordsEl = document.getElementById("stat-words");
  const readingEl = document.getElementById("stat-reading");
  const headingsEl = document.getElementById("stat-headings");
  const tablesEl = document.getElementById("stat-tables");
  const citationsEl = document.getElementById("stat-citations");

  if (nameEl) nameEl.textContent = fileName || "uploaded_prd.md";
  if (wordsEl) wordsEl.textContent = `${res.stats.wordCount.toLocaleString()} words`;
  if (readingEl) readingEl.textContent = `~${res.stats.readingTimeMin} min read`;
  if (headingsEl) headingsEl.textContent = `${res.stats.headings} sections`;
  if (tablesEl) tablesEl.textContent = `${res.stats.tables} tables`;
  if (citationsEl) citationsEl.textContent = `${res.stats.citations} citations`;

  // Update Radial Gauge
  animateScoreGauge(res.score);

  // Update Tier Badge
  const tierBadge = document.getElementById("tier-badge");
  if (tierBadge) {
    tierBadge.textContent = `${res.grade} · ${res.tier}`;
    tierBadge.className = "tier-badge";
    if (res.score >= 90) tierBadge.classList.add("tier-elite");
    else if (res.score >= 80) tierBadge.classList.add("tier-inst");
    else if (res.score >= 60) tierBadge.classList.add("tier-mid");
    else tierBadge.classList.add("tier-low");
  }

  // Update Verdict
  const verdictEl = document.getElementById("verdict-text");
  if (verdictEl) verdictEl.textContent = res.verdict;

  // Quick Chips
  const chipDims = document.getElementById("chip-dims");
  const chipDeduct = document.getElementById("chip-deductions");
  if (chipDims) chipDims.textContent = `6/6 Dimensions Analyzed`;
  if (chipDeduct) chipDeduct.textContent = `${res.deductions.length} Gaps Found`;

  // Update Dimensions Summary Grid
  renderDimensionsGrid(res.dimensions);

  // Render Tab 1: Detailed Criterion Accordion
  renderCriterionAccordion(res.dimensions);

  // Render Tab 2: Deductions & Gap Analysis
  renderDeductions(res.deductions);

  // Render Tab 3: Action Plan
  renderActionPlan(res.actionPlan);

  // Render Tab 4: Markdown Document Preview
  renderInspector(rawText);

  // Update tab counter badges
  const dedCountBadge = document.getElementById("deductions-count-badge");
  const actCountBadge = document.getElementById("actions-count-badge");
  if (dedCountBadge) dedCountBadge.textContent = res.deductions.length;
  if (actCountBadge) actCountBadge.textContent = res.actionPlan.length;
}

// Animate Score Gauge SVG
function animateScoreGauge(score) {
  const circle = document.getElementById("gauge-circle");
  const scoreText = document.getElementById("score-number");
  if (!circle || !scoreText) return;

  const radius = 75;
  const circumference = 2 * Math.PI * radius; // ~471.24
  circle.style.strokeDasharray = `${circumference} ${circumference}`;

  const offset = circumference - (score / 100) * circumference;
  circle.style.strokeDashoffset = offset;

  // Set color according to nature palette
  if (score >= 90) {
    circle.style.stroke = "var(--fresh-green)";
  } else if (score >= 75) {
    circle.style.stroke = "var(--sage-primary)";
  } else if (score >= 55) {
    circle.style.stroke = "var(--warning-amber)";
  } else {
    circle.style.stroke = "var(--spoilage-clay)";
  }

  // Number counter animation
  let current = 0;
  const duration = 1000;
  const startTime = performance.now();

  function updateCount(time) {
    const elapsed = time - startTime;
    const progress = Math.min(elapsed / duration, 1);
    current = Math.round(progress * score);
    scoreText.textContent = current;
    if (progress < 1) {
      requestAnimationFrame(updateCount);
    } else {
      scoreText.textContent = score;
    }
  }

  requestAnimationFrame(updateCount);
}

// Render 6 Dimensions Grid
function renderDimensionsGrid(dimensions) {
  const container = document.getElementById("dimensions-grid");
  if (!container) return;

  container.innerHTML = dimensions.map(d => `
    <div class="dim-bar-card">
      <div class="dim-meta">
        <span class="dim-name">${d.name}</span>
        <span class="dim-score-badge">${d.score} / ${d.weight} pts</span>
      </div>
      <div class="progress-track">
        <div class="progress-fill" style="width: ${d.pct}%; background: ${d.pct >= 90 ? 'var(--fresh-green)' : d.pct >= 70 ? 'var(--sage-primary)' : 'var(--warning-amber)'};"></div>
      </div>
      <div class="dim-footer-info">
        <span>${d.checks.length} sub-checks</span>
        <span>${d.pct}% achieved</span>
      </div>
    </div>
  `).join('');
}

// Render Criterion Breakdown
function renderCriterionAccordion(dimensions) {
  const container = document.getElementById("criteria-accordion-container");
  if (!container) return;

  container.innerHTML = dimensions.map(d => `
    <div class="criterion-group">
      <div class="group-header">
        <div class="group-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
          ${d.name}
        </div>
        <div class="group-score-pill">${d.score} / ${d.weight} pts</div>
      </div>
      <div class="group-items">
        ${d.checks.map(c => `
          <div class="criterion-card">
            <div class="criterion-header">
              <div class="criterion-title-area">
                <span class="criterion-id">${c.id}</span>
                <span class="criterion-name">${c.name}</span>
                <span class="criterion-badge badge-${c.status}">
                  ${c.status === 'pass' ? '✓ Pass' : c.status === 'warning' ? '⚠ Partial' : '✕ Gap'}
                </span>
              </div>
              <div class="criterion-score">${c.score} / ${c.max} pts</div>
            </div>
            <div class="criterion-desc">${c.description}</div>
            <div class="evidence-box"><strong>Extracted Evidence:</strong> ${escapeHtml(c.evidence)}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
}

// Render Deductions Panel
function renderDeductions(deductions) {
  const container = document.getElementById("deductions-container");
  if (!container) return;

  if (deductions.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 40px; background: var(--bg-card); border-radius: var(--radius-md); border: 1px solid var(--border-light);">
        <div style="font-size: 2rem; color: var(--fresh-green); margin-bottom: 8px;">✓</div>
        <div style="font-weight: 700; font-size: 1.1rem; color: var(--text-main);">Zero Significant Deductions</div>
        <div style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">This PRD satisfies all institutional and competitive standards without major structural gaps.</div>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="deductions-container">
      ${deductions.map(d => `
        <div class="deduction-card">
          <div class="deduction-info">
            <span class="deduction-dim">${d.dimension}</span>
            <span class="deduction-reason">${d.reason}</span>
          </div>
          <div class="deduction-penalty">-${d.penalty} pt${d.penalty > 1 ? 's' : ''}</div>
        </div>
      `).join('')}
    </div>
  `;
}

// Render Action Plan
function renderActionPlan(actions) {
  const container = document.getElementById("action-plan-container");
  if (!container) return;

  if (actions.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 40px; background: var(--bg-card); border-radius: var(--radius-md); border: 1px solid var(--border-light);">
        <div style="font-size: 2rem; color: var(--fresh-green); margin-bottom: 8px;">★</div>
        <div style="font-weight: 700; font-size: 1.1rem; color: var(--text-main);">Flawless Architecture</div>
        <div style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">No critical remediation actions needed. You are ready to proceed to engineering execution.</div>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="actions-container">
      ${actions.map((act, index) => `
        <div class="action-card">
          <div class="action-header">
            <div class="action-title">
              <span>${index + 1}.</span> ${act.title}
            </div>
            <div class="action-badges">
              <span class="action-impact-badge">${act.impact}</span>
              <span class="quick-chip">⏱ ${act.effort}</span>
            </div>
          </div>
          <div style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 6px;">Recommended copy-paste markdown snippet to close this gap:</div>
          <div class="action-snippet-box">
            <button class="copy-snippet-btn" onclick="copySnippet(this, ${index})">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg>
              Copy Markdown
            </button>
            <code id="snippet-text-${index}">${escapeHtml(act.snippet)}</code>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

// Render Document Inspector
function renderInspector(markdown) {
  const container = document.getElementById("markdown-preview-container");
  if (!container) return;

  container.innerHTML = `
    <div class="markdown-preview-body">
      ${renderMarkdown(markdown)}
    </div>
  `;
}

// Copy Action Snippet
function copySnippet(btn, index) {
  const el = document.getElementById(`snippet-text-${index}`);
  if (!el) return;
  const text = el.textContent;
  navigator.clipboard.writeText(text).then(() => {
    const original = btn.innerHTML;
    btn.innerHTML = "✓ Copied!";
    btn.style.background = "var(--fresh-green)";
    setTimeout(() => {
      btn.innerHTML = original;
      btn.style.background = "";
    }, 2000);
  });
}

// Export Full Evaluation Report as Markdown
function exportReportMarkdown() {
  if (!currentEvaluation) return;

  const res = currentEvaluation;
  let md = `# SahiPRD Evaluation Audit Report\n\n`;
  md += `**Document:** \`${currentFileName}\`  \n`;
  md += `**Overall Score:** **${res.score} / 100**  \n`;
  md += `**Tier & Grade:** **${res.grade} · ${res.tier}**  \n`;
  md += `**Verdict:** ${res.verdict}  \n`;
  md += `**Audit Date:** ${new Date().toLocaleDateString()}  \n\n`;

  md += `## 1. Executive Dimension Scorecard\n\n`;
  md += `| Dimension | Score | Weight | Achieved | Status |\n`;
  md += `|---|:---:|:---:|:---:|:---:|\n`;
  res.dimensions.forEach(d => {
    md += `| ${d.name} | **${d.score}** | ${d.weight} pts | ${d.pct}% | ${d.pct >= 90 ? 'Elite' : d.pct >= 70 ? 'Satisfactory' : 'Needs Work'} |\n`;
  });
  md += `\n`;

  md += `## 2. Identified Deductions & Structural Gaps\n\n`;
  if (res.deductions.length === 0) {
    md += `*No major deductions identified. Document satisfies all benchmark criteria.*\n\n`;
  } else {
    res.deductions.forEach(ded => {
      md += `- **-${ded.penalty} pt** [${ded.dimension}]: ${ded.reason}\n`;
    });
    md += `\n`;
  }

  md += `## 3. Recommended Remediation Action Plan (Path to 100)\n\n`;
  res.actionPlan.forEach((act, idx) => {
    md += `### ${idx + 1}. ${act.title} (${act.impact}, ${act.effort})\n\n`;
    md += `\`\`\`markdown\n${act.snippet}\n\`\`\`\n\n`;
  });

  md += `---\n*Generated by SahiPRD — Nature-Inspired Sustainability & Expiry-Aware Evaluation Engine.*`;

  downloadFile(`${currentFileName.replace(/\.[^/.]+$/, "")}_Evaluation_Scorecard.md`, md, "text/markdown");
}

// Export JSON Audit Data
function exportReportJSON() {
  if (!currentEvaluation) return;
  const dataStr = JSON.stringify({
    fileName: currentFileName,
    evaluatedAt: new Date().toISOString(),
    result: currentEvaluation
  }, null, 2);

  downloadFile(`${currentFileName.replace(/\.[^/.]+$/, "")}_Score_Audit.json`, dataStr, "application/json");
}

// Helper to trigger file download
function downloadFile(filename, text, mime) {
  const element = document.createElement('a');
  element.setAttribute('href', `data:${mime};charset=utf-8,` + encodeURIComponent(text));
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

// Copy Markdown Badge
function copyBadge() {
  if (!currentEvaluation) return;
  const color = currentEvaluation.score >= 90 ? "2d6b49" : currentEvaluation.score >= 75 ? "527561" : "c07d32";
  const badgeMd = `[![PRD Score](https://img.shields.io/badge/PRD%20Score-${currentEvaluation.score}%2F100-${color})](#)`;
  navigator.clipboard.writeText(badgeMd).then(() => {
    alert("Copied GitHub Markdown Score Badge to clipboard:\n" + badgeMd);
  });
}

function escapeHtml(text) {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
