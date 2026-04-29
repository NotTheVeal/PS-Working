<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Claude Setup Guide — PS Design Library</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}
  html,body{background:#f0ede8;min-height:100vh}

  /* Banner */
  .banner{background:#1a1a1a;padding:0 24px;display:flex;align-items:center;justify-content:space-between;height:52px;position:sticky;top:0;z-index:100}
  .banner-left{display:flex;align-items:center;gap:10px}
  .claude-mark{width:26px;height:26px;background:#d97757;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#fff}
  .banner-title{font-size:14px;font-weight:600;color:#fff}
  .banner-div{width:1px;height:18px;background:#444}
  .banner-sub{font-size:13px;color:#999}
  .banner-badge{font-size:11px;font-weight:500;padding:3px 10px;border-radius:100px;background:#2d2d2d;color:#d97757;border:1px solid #3a3a3a}

  /* Step toggle */
  .step-toggle{background:#fff;border-bottom:1px solid #e0ddd6;padding:0 24px;display:flex;justify-content:center}
  .toggle-inner{display:flex;max-width:720px;width:100%}
  .step-tab{flex:1;padding:16px 12px;text-align:center;cursor:pointer;border-bottom:3px solid transparent;transition:all .15s}
  .step-tab:hover{background:#faf9f7}
  .step-tab.active{border-bottom-color:#d97757}
  .step-tab-num{display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;border-radius:50%;background:#e8f0fe;color:#1a56b0;font-size:11px;font-weight:700;margin-bottom:4px}
  .step-tab.active .step-tab-num{background:#d97757;color:#fff}
  .step-tab-title{font-size:14px;font-weight:600;color:#1a1a1a;display:block}
  .step-tab-sub{font-size:11px;color:#6b6b6b;display:block;margin-top:2px}

  /* Hero */
  .hero{background:#fff;border-bottom:1px solid #e0ddd6;padding:32px 24px 28px;text-align:center}
  .hero-eyebrow{font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#d97757;margin-bottom:8px}
  .hero-title{font-size:28px;font-weight:700;color:#1a1a1a;margin-bottom:8px;line-height:1.2}
  .hero-title span{color:#d97757}
  .hero-sub{font-size:14px;color:#6b6b6b;max-width:500px;margin:0 auto;line-height:1.6}

  /* Main */
  .main{max-width:720px;margin:0 auto;padding:24px 24px 60px}
  .page{display:none}
  .page.active{display:block}

  /* Section label */
  .slabel{font-size:11px;font-weight:600;color:#4a4a4a;text-transform:uppercase;letter-spacing:.06em;margin:24px 0 10px}
  .slabel:first-child{margin-top:0}

  /* Cards */
  .card{background:#fff;border:1px solid #e0ddd6;border-radius:10px;margin-bottom:12px;overflow:hidden}
  .card-head{padding:14px 16px;display:flex;align-items:flex-start;gap:12px}
  .card-icon{width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;margin-top:1px}
  .card-title{font-size:14px;font-weight:600;color:#1a1a1a;margin-bottom:3px}
  .card-sub{font-size:12px;color:#6b6b6b;line-height:1.5}
  .card-body{padding:0 16px 16px}
  .divider{height:1px;background:#e0ddd6;margin:0 0 14px}

  /* Progress dots */
  .progress{display:flex;gap:6px;margin-bottom:20px;align-items:center}
  .pdot{width:8px;height:8px;border-radius:50%;background:#d0cdc5}
  .pdot.active{background:#1a56b0}
  .pdot.done{background:#1a6b3a}

  /* Step cards */
  .step{background:#fff;border:1px solid #e0ddd6;border-radius:10px;margin-bottom:12px;overflow:hidden}
  .step-head{padding:12px 16px;display:flex;align-items:center;gap:12px;cursor:pointer;background:#fff}
  .step-head:hover{background:#faf9f7}
  .step-num{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:600;flex-shrink:0;background:#e8f0fe;color:#1a56b0}
  .step-num.done{background:#d4edda;color:#1a6b3a}
  .step-title{font-size:14px;font-weight:600;color:#1a1a1a;flex:1}
  .step-sub{font-size:11px;color:#6b6b6b;margin-top:1px}
  .step-body{padding:0 16px 16px;border-top:1px solid #e0ddd6}
  .step-body.hidden{display:none}

  /* Chips */
  .label{font-size:11px;font-weight:600;color:#4a4a4a;margin:14px 0 6px;display:block;text-transform:uppercase;letter-spacing:.04em}
  .chips{display:flex;flex-wrap:wrap;gap:7px;margin-bottom:4px}
  .chip{padding:5px 11px;border-radius:100px;font-size:12px;font-weight:500;cursor:pointer;border:1.5px solid #d0cdc5;color:#4a4a4a;background:#fff;transition:all .12s}
  .chip:hover{border-color:#1a56b0;color:#1a56b0;background:#e8f0fe}
  .chip.on{border-color:#1a56b0;color:#1a56b0;background:#e8f0fe}

  /* Inputs */
  input[type=text]{width:100%;font-size:13px;padding:8px 10px;border-radius:8px;border:1px solid #d0cdc5;background:#fff;color:#1a1a1a;margin-top:4px}
  input[type=text]:focus{outline:none;border-color:#1a56b0}
  input[type=text]::placeholder{color:#aaa}
  .repo-input{font-family:monospace;font-size:13px;padding:6px 10px;border-radius:6px;border:1.5px dashed #1a56b0;background:#e8f0fe;color:#1a56b0;width:100%;margin-top:4px}
  .repo-input:focus{outline:none;border-style:solid}
  .repo-input::placeholder{color:#7a9fd4}

  /* Buttons */
  .next-btn{margin-top:14px;padding:8px 18px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;background:#1a56b0;color:#fff;border:none}
  .next-btn:hover{background:#1446a0}
  .btn{padding:8px 18px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;border:none}
  .btn-primary{background:#1a56b0;color:#fff}
  .btn-primary:hover{background:#1446a0}
  .btn-secondary{background:#f5f4f0;color:#1a1a1a;border:1px solid #d0cdc5}
  .btn-secondary:hover{background:#ebe9e3}
  .btn-green{background:#1a7f37;color:#fff}
  .btn-green:hover{background:#176b2e}
  .btn-row{display:flex;gap:8px;margin-top:12px;flex-wrap:wrap;align-items:center}
  .confirm{font-size:12px;color:#1a6b3a;font-weight:600;display:none}

  /* Output boxes */
  .output-box{background:#0d1117;border-radius:8px;padding:14px;font-family:'SFMono-Regular',Consolas,monospace;font-size:11.5px;line-height:1.7;color:#aff5b4;white-space:pre-wrap;margin-top:12px;border:1px solid #30363d;word-break:break-word}
  .prompt-output{background:#0d1117;border-radius:8px;padding:16px;font-family:'SFMono-Regular',Consolas,monospace;font-size:12px;line-height:1.75;color:#e6edf3;white-space:pre-wrap;border:1px solid #30363d;word-break:break-word}

  /* Where box */
  .where-box{background:#f9f8f5;border-radius:8px;padding:12px 14px;margin-top:10px;font-size:13px;line-height:1.6;color:#4a4a4a;border:1px solid #e0ddd6}
  .path-row{display:flex;align-items:center;gap:8px;margin-top:8px;background:#fff;border:1px solid #e0ddd6;border-radius:8px;padding:8px 12px;font-family:monospace;font-size:12px;color:#1a1a1a;flex-wrap:wrap}
  .hint-box{background:#f0f6ff;border:1px solid #c0d4f5;border-radius:8px;padding:10px 14px;margin-top:10px;font-size:12px;color:#1a56b0;line-height:1.55}
  code{background:#f0ede8;padding:1px 5px;border-radius:4px;font-family:monospace;font-size:11px;color:#c0392b}

  /* Toggles (Step 2) */
  .toggle-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px}
  @media(max-width:480px){.toggle-grid{grid-template-columns:1fr}}
  .tog-row{display:flex;align-items:center;justify-content:space-between;background:#f9f8f5;border:1px solid #e0ddd6;border-radius:8px;padding:10px 14px;cursor:pointer;user-select:none}
  .tog-row:hover{background:#f0ede8}
  .tog-label{font-size:13px;font-weight:500;color:#1a1a1a}
  .tog-sub{font-size:11px;color:#6b6b6b;margin-top:1px}
  .tog-sw{width:36px;height:20px;border-radius:100px;background:#d0cdc5;position:relative;transition:background .15s;flex-shrink:0;margin-left:10px}
  .tog-sw.on{background:#1a56b0}
  .tog-knob{width:16px;height:16px;border-radius:50%;background:#fff;position:absolute;top:2px;left:2px;transition:left .15s}
  .tog-sw.on .tog-knob{left:18px}
  .name-row{display:flex;align-items:center;gap:10px;margin-bottom:14px;flex-wrap:wrap}
  .name-row label{font-size:13px;font-weight:500;color:#1a1a1a;white-space:nowrap}
  .name-row input{flex:1;min-width:160px;font-size:14px;padding:8px 12px;border-radius:8px;border:1.5px solid #1a56b0;background:#e8f0fe;color:#1a56b0;font-weight:600}
  .name-row input:focus{outline:none}
  .name-row input::placeholder{color:#7a9fd4;font-weight:400}

  /* Tips */
  .tip-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
  @media(max-width:480px){.tip-grid{grid-template-columns:1fr}}
  .tip-card{background:#fff;border:1px solid #e0ddd6;border-radius:8px;padding:12px 14px}
  .tip-title{font-size:12px;font-weight:600;color:#1a1a1a;margin-bottom:4px}
  .tip-body{font-size:12px;color:#6b6b6b;line-height:1.55}
  .tip-tag{display:inline-block;font-size:10px;font-weight:600;padding:2px 7px;border-radius:100px;margin-bottom:6px;text-transform:uppercase;letter-spacing:.03em}
  .tag-do{background:#d4edda;color:#1a6b3a}
  .tag-dont{background:#fde8e8;color:#9b2c2c}

  /* Paste steps */
  .paste-step{display:flex;align-items:flex-start;gap:12px;margin-bottom:12px}
  .paste-step:last-child{margin-bottom:0}
  .paste-num{width:24px;height:24px;border-radius:50%;background:#e8f0fe;color:#1a56b0;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px}
  .paste-text{font-size:13px;color:#4a4a4a;line-height:1.55}
  .paste-text strong{color:#1a1a1a}

  /* File preview */
  .preview-box{background:#f9f8f5;border:1px solid #e0ddd6;border-radius:8px;overflow:hidden;margin-top:10px}
  .preview-header{background:#f0ede8;border-bottom:1px solid #e0ddd6;padding:8px 14px;font-size:11px;font-weight:600;color:#6b6b6b;text-transform:uppercase;letter-spacing:.04em;display:flex;justify-content:space-between}
  .preview-content{padding:12px 14px;font-size:12px;color:#4a4a4a;line-height:1.8}
  .file-pill{font-family:monospace;font-size:11px;background:#e8f0fe;color:#1a56b0;padding:1px 6px;border-radius:4px;margin-right:4px}
  .tick{color:#1a6b3a;font-weight:600}

  .footer{border-top:1px solid #e0ddd6;padding:24px;text-align:center;font-size:12px;color:#aaa;background:#fff}
  .footer a{color:#1a56b0;text-decoration:none}
</style>
</head>
<body>

<!-- Banner -->
<div class="banner">
  <div class="banner-left">
    <div class="claude-mark">C</div>
    <span class="banner-title">Claude</span>
    <div class="banner-div"></div>
    <span class="banner-sub">PS Design Library</span>
  </div>
  <span class="banner-badge">Phase 4 — Claude Automation</span>
</div>

<!-- Step toggle -->
<div class="step-toggle">
  <div class="toggle-inner">
    <div class="step-tab active" id="tab1" onclick="switchStep(1)">
      <div class="step-tab-num">1</div>
      <span class="step-tab-title">Create CLAUDE.md</span>
      <span class="step-tab-sub">Your permanent instruction file</span>
    </div>
    <div class="step-tab" id="tab2" onclick="switchStep(2)">
      <div class="step-tab-num">2</div>
      <span class="step-tab-title">Prompt Template</span>
      <span class="step-tab-sub">What to type into Claude</span>
    </div>
  </div>
</div>

<!-- ═══════════════════════════════════════════
     PAGE 1 — CLAUDE.md
════════════════════════════════════════════ -->
<div id="page1" class="page active">
  <div class="hero">
    <div class="hero-eyebrow">Step 1 of the Claude Setup Guide</div>
    <div class="hero-title">Create your <span>CLAUDE.md</span></div>
    <div class="hero-sub">Your permanent instruction manual for Claude. Fill in the steps below and get a ready-to-paste file in under 2 minutes.</div>
  </div>

  <div class="main">
    <div class="progress">
      <div class="pdot active" id="pd0"></div>
      <div class="pdot" id="pd1"></div>
      <div class="pdot" id="pd2"></div>
      <div class="pdot" id="pd3"></div>
      <span style="font-size:12px;color:#6b6b6b;margin-left:6px" id="prog-label">Step 1 of 4</span>
    </div>

    <!-- Where -->
    <div class="step" id="s0">
      <div class="step-head" onclick="tog1(0)">
        <div class="step-num" id="sn0">1</div>
        <div style="flex:1"><div class="step-title">Where does CLAUDE.md live?</div><div class="step-sub">You only do this once</div></div>
        <span style="color:#aaa;font-size:11px" id="ch0">&#9660;</span>
      </div>
      <div class="step-body" id="sb0">
        <div class="where-box">
          <strong style="color:#1a1a1a">It goes in the root of your GitHub repo</strong> — the very top level, same folder as <code>README.md</code> and <code>package.json</code>.
          <div class="path-row" style="margin-top:12px;align-items:center">
            <input
              type="text"
              id="repo-name"
              placeholder="your-repo-name"
              oninput="updateRepo()"
              style="font-family:monospace;font-size:12px;border:none;border-bottom:1.5px dashed #1a56b0;outline:none;background:transparent;color:#1a56b0;font-weight:600;width:160px;padding:0 0 1px 0;margin:0;"
            /><span style="color:#aaa;font-family:monospace;font-size:12px">/</span>
            <span style="color:#aaa;margin:0 4px">&#9654;</span>
            <span style="font-weight:600;color:#1a6b3a;font-family:monospace">CLAUDE.md</span>
            <span style="margin-left:auto;font-size:11px;color:#1a6b3a">&#10003; right here</span>
          </div>
          <div style="font-size:11px;color:#aaa;margin-top:6px">Click the repo name above to edit it</div>
        </div>
        <div class="hint-box">In GitHub: click <strong>Add file → Create new file</strong>, name it <strong>CLAUDE.md</strong> (capitals matter), paste the content you generate below, then click <strong>Commit changes</strong>.</div>
        <button class="next-btn" onclick="adv(0)">Got it — next →</button>
      </div>
    </div>

    <!-- Tech stack -->
    <div class="step" id="s1">
      <div class="step-head" onclick="tog1(1)">
        <div class="step-num" id="sn1">2</div>
        <div style="flex:1"><div class="step-title">Tech stack</div><div class="step-sub">Tell Claude what tools you use</div></div>
        <span style="color:#aaa;font-size:11px" id="ch1">&#9658;</span>
      </div>
      <div class="step-body hidden" id="sb1">
        <span class="label">Select everything that applies</span>
        <div class="chips" id="stack-chips">
          <div class="chip on" data-val="React">React</div>
          <div class="chip on" data-val="TypeScript">TypeScript</div>
          <div class="chip on" data-val="Tailwind CSS">Tailwind CSS</div>
          <div class="chip on" data-val="Token Studio">Token Studio</div>
          <div class="chip on" data-val="Storybook">Storybook</div>
          <div class="chip" data-val="Vite">Vite</div>
          <div class="chip" data-val="Next.js">Next.js</div>
          <div class="chip" data-val="Vitest">Vitest</div>
          <div class="chip" data-val="Jest">Jest</div>
          <div class="chip" data-val="ESLint">ESLint</div>
          <div class="chip" data-val="Prettier">Prettier</div>
          <div class="chip" data-val="Figma">Figma</div>
          <div class="chip" data-val="Bloomreach">Bloomreach</div>
        </div>
        <span class="label">Anything else? (optional)</span>
        <input type="text" id="extra-stack" placeholder="e.g. Framer Motion, Radix UI"/>
        <button class="next-btn" onclick="adv(1)">Next →</button>
      </div>
    </div>

    <!-- Rules -->
    <div class="step" id="s2">
      <div class="step-head" onclick="tog1(2)">
        <div class="step-num" id="sn2">3</div>
        <div style="flex:1"><div class="step-title">Rules</div><div class="step-sub">Hard limits Claude must never break</div></div>
        <span style="color:#aaa;font-size:11px" id="ch2">&#9658;</span>
      </div>
      <div class="step-body hidden" id="sb2">
        <span class="label">Select your non-negotiables</span>
        <div class="chips" id="rule-chips">
          <div class="chip on" data-val="Always use design tokens — never hardcode colours or spacing values">Tokens only — no hardcoded values</div>
          <div class="chip on" data-val="Every component must include ARIA roles, labels, and keyboard navigation">Accessibility on every component</div>
          <div class="chip on" data-val="Always generate a Storybook story covering all states and variants">Storybook story required</div>
          <div class="chip on" data-val="Always generate unit tests using Testing Library">Unit tests required</div>
          <div class="chip on" data-val="Use React.forwardRef for all components">Use forwardRef on all components</div>
          <div class="chip on" data-val="Use class-variance-authority (cva) for variant logic">Use cva for variants</div>
          <div class="chip" data-val="Never install new packages without approval">No new packages without approval</div>
          <div class="chip" data-val="Never modify tailwind.config.js">Don't touch tailwind.config</div>
          <div class="chip" data-val="No TypeScript 'any' types allowed">No TypeScript any types</div>
          <div class="chip" data-val="One responsibility per component file">One responsibility per component</div>
        </div>
        <span class="label">Any other rules? (optional)</span>
        <input type="text" id="extra-rules" placeholder="e.g. Always use named exports"/>
        <button class="next-btn" onclick="adv(2)">Next →</button>
      </div>
    </div>

    <!-- Expectations -->
    <div class="step" id="s3">
      <div class="step-head" onclick="tog1(3)">
        <div class="step-num" id="sn3">4</div>
        <div style="flex:1"><div class="step-title">Expectations</div><div class="step-sub">How Claude should behave and communicate</div></div>
        <span style="color:#aaa;font-size:11px" id="ch3">&#9658;</span>
      </div>
      <div class="step-body hidden" id="sb3">
        <span class="label">Select your expectations</span>
        <div class="chips" id="exp-chips">
          <div class="chip on" data-val="Always explain what you are building before writing any code">Explain before coding</div>
          <div class="chip on" data-val="Ask one clarifying question if anything is unclear">Ask if unclear</div>
          <div class="chip on" data-val="Generate the full file — never use placeholders like // rest of code here">Full files only — no placeholders</div>
          <div class="chip on" data-val="After generating, summarise what was created and why">Summarise decisions after</div>
          <div class="chip" data-val="Suggest missing states or edge cases">Suggest missing states</div>
          <div class="chip" data-val="Add JSDoc comments to all exported components">Add JSDoc comments</div>
          <div class="chip" data-val="Favour simplicity over cleverness">Favour simplicity</div>
          <div class="chip" data-val="Flag accessibility issues proactively, even if not asked">Flag a11y issues proactively</div>
          <div class="chip" data-val="Include a Bloomreach analytics placeholder in every component">Include Bloomreach placeholders</div>
        </div>
        <span class="label">Anything specific to your team? (optional)</span>
        <input type="text" id="extra-exp" placeholder="e.g. Always follow PS Design Library naming conventions"/>
        <button class="next-btn" onclick="generateMd()">Generate my CLAUDE.md →</button>
      </div>
    </div>

    <!-- Output -->
    <div id="md-output-section" style="display:none;margin-top:8px">
      <div style="border-top:1px solid #e0ddd6;margin:12px 0"></div>
      <div style="font-size:16px;font-weight:700;color:#1a1a1a;margin-bottom:4px">Your CLAUDE.md is ready</div>
      <div style="font-size:13px;color:#6b6b6b;margin-bottom:10px">Copy this → go to GitHub → <strong style="color:#1a1a1a">Add file → Create new file</strong> → name it <code>CLAUDE.md</code> → paste → commit.</div>
      <div class="output-box" id="md-output"></div>
      <div class="btn-row">
        <button class="btn btn-primary" onclick="copyMd()">Copy to clipboard</button>
        <button class="btn btn-secondary" onclick="location.reload()">Start over</button>
        <span class="confirm" id="md-confirm">Copied!</span>
      </div>
      <div style="margin-top:16px;background:#f0f6ff;border:1px solid #c0d4f5;border-radius:8px;padding:12px 14px;font-size:13px;color:#1a56b0">
        <strong style="display:block;margin-bottom:4px;color:#0f3a8a">Done? Move to Step 2 →</strong>
        Now set up your prompt template so your whole team uses Claude the same way.
        <span style="display:block;margin-top:8px"><button class="btn btn-primary" onclick="switchStep(2)" style="font-size:12px;padding:6px 14px">Go to Step 2 — Prompt Template →</button></span>
      </div>
    </div>
  </div>
</div>

<!-- ═══════════════════════════════════════════
     PAGE 2 — PROMPT TEMPLATE
════════════════════════════════════════════ -->
<div id="page2" class="page">
  <div class="hero">
    <div class="hero-eyebrow">Step 2 of the Claude Setup Guide</div>
    <div class="hero-title">Your <span>Prompt Template</span></div>
    <div class="hero-sub">Build your standard prompt once. Paste it into Claude every time you want a component built — it tells Claude exactly what to produce.</div>
  </div>

  <div class="main">

    <!-- What is it -->
    <div class="slabel">What is a prompt template?</div>
    <div class="card">
      <div class="card-body" style="padding-top:14px">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
          <div style="background:#fde8e8;border-radius:8px;padding:12px;font-size:12px;color:#9b2c2c;line-height:1.6;border:1px solid #f5c6c6">
            <strong style="display:block;margin-bottom:4px;color:#7b1c1c">Without a template</strong>
            "Build me a button" — Claude guesses. You might get a component missing tokens, tests, accessibility, or Storybook stories.
          </div>
          <div style="background:#d4edda;border-radius:8px;padding:12px;font-size:12px;color:#1a4a2a;line-height:1.6;border:1px solid #b8dfc4">
            <strong style="display:block;margin-bottom:4px;color:#0f3318">With a template</strong>
            Claude gets full instructions every time — component, Storybook, tests, tokens, accessibility — automatically, without you having to remember anything.
          </div>
        </div>
      </div>
    </div>

    <!-- Builder -->
    <div class="slabel">Build your prompt</div>
    <div class="card">
      <div class="card-head">
        <div class="card-icon" style="background:#fff3e0">&#9881;</div>
        <div>
          <div class="card-title">Customise what Claude always includes</div>
          <div class="card-sub">Toggle things on or off. Your prompt updates live below — then copy it.</div>
        </div>
      </div>
      <div class="card-body">
        <div class="divider"></div>
        <div class="name-row">
          <label>Component name:</label>
          <input type="text" id="comp-name" placeholder="e.g. Button" oninput="updatePrompt()"/>
        </div>
        <div class="toggle-grid">
          <div class="tog-row" onclick="togP('tailwind')">
            <div><div class="tog-label">Tailwind CSS</div><div class="tog-sub">Token-based utility classes</div></div>
            <div class="tog-sw on" id="tp-tailwind"><div class="tog-knob"></div></div>
          </div>
          <div class="tog-row" onclick="togP('tokens')">
            <div><div class="tog-label">Design tokens</div><div class="tog-sub">Token Studio / ps-asset preset</div></div>
            <div class="tog-sw on" id="tp-tokens"><div class="tog-knob"></div></div>
          </div>
          <div class="tog-row" onclick="togP('ts')">
            <div><div class="tog-label">TypeScript</div><div class="tog-sub">Full types, no any</div></div>
            <div class="tog-sw on" id="tp-ts"><div class="tog-knob"></div></div>
          </div>
          <div class="tog-row" onclick="togP('states')">
            <div><div class="tog-label">All states</div><div class="tog-sub">Default, hover, focus, disabled, loading</div></div>
            <div class="tog-sw on" id="tp-states"><div class="tog-knob"></div></div>
          </div>
          <div class="tog-row" onclick="togP('a11y')">
            <div><div class="tog-label">Accessibility</div><div class="tog-sub">ARIA roles, labels, keyboard nav</div></div>
            <div class="tog-sw on" id="tp-a11y"><div class="tog-knob"></div></div>
          </div>
          <div class="tog-row" onclick="togP('storybook')">
            <div><div class="tog-label">Storybook story</div><div class="tog-sub">autodocs + all variants</div></div>
            <div class="tog-sw on" id="tp-storybook"><div class="tog-knob"></div></div>
          </div>
          <div class="tog-row" onclick="togP('tests')">
            <div><div class="tog-label">Unit tests</div><div class="tog-sub">Testing Library + all cases</div></div>
            <div class="tog-sw on" id="tp-tests"><div class="tog-knob"></div></div>
          </div>
          <div class="tog-row" onclick="togP('forwardref')">
            <div><div class="tog-label">forwardRef</div><div class="tog-sub">So refs work on the element</div></div>
            <div class="tog-sw on" id="tp-forwardref"><div class="tog-knob"></div></div>
          </div>
          <div class="tog-row" onclick="togP('jsdoc')">
            <div><div class="tog-label">JSDoc comments</div><div class="tog-sub">Inline documentation</div></div>
            <div class="tog-sw" id="tp-jsdoc"><div class="tog-knob"></div></div>
          </div>
          <div class="tog-row" onclick="togP('bloomreach')">
            <div><div class="tog-label">Bloomreach placeholder</div><div class="tog-sub">Analytics event stub</div></div>
            <div class="tog-sw" id="tp-bloomreach"><div class="tog-knob"></div></div>
          </div>
        </div>

        <div style="margin-bottom:8px;font-size:11px;font-weight:600;color:#4a4a4a;text-transform:uppercase;letter-spacing:.04em">Your prompt</div>
        <div class="prompt-output" id="prompt-output"></div>

        <div class="btn-row">
          <button class="btn btn-primary" onclick="copyPrompt()">Copy prompt</button>
          <button class="btn btn-secondary" onclick="resetP()">Reset</button>
          <span class="confirm" id="cp-confirm">Copied!</span>
        </div>
      </div>
    </div>

    <!-- What Claude produces -->
    <div class="slabel">What Claude will produce</div>
    <div class="card">
      <div class="card-body" style="padding-top:14px">
        <div class="preview-box">
          <div class="preview-header"><span>Files Claude generates from one prompt</span><span id="file-count" style="color:#1a56b0">4 files</span></div>
          <div class="preview-content">
            <div style="margin-bottom:8px"><span class="tick">&#10003;</span> <span class="file-pill" id="f1">Button.tsx</span> The component — typed props, all variants, design tokens, accessibility</div>
            <div style="margin-bottom:8px"><span class="tick">&#10003;</span> <span class="file-pill" id="f2">Button.stories.tsx</span> Storybook stories — one story per state and variant, autodocs enabled</div>
            <div style="margin-bottom:8px"><span class="tick">&#10003;</span> <span class="file-pill" id="f3">Button.test.tsx</span> Unit tests — render, click, disabled state, loading state</div>
            <div><span class="tick">&#10003;</span> <span class="file-pill" id="f4">index.ts</span> Clean export so the component is importable anywhere in the repo</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Where to paste -->
    <div class="slabel">Where do you paste this?</div>
    <div class="card">
      <div class="card-body" style="padding-top:14px">
        <div class="paste-step">
          <div class="paste-num">1</div>
          <div class="paste-text">Open <strong>Claude.ai</strong> in your browser, or open <strong>Claude Code</strong> in your terminal inside your repo folder.</div>
        </div>
        <div class="paste-step">
          <div class="paste-num">2</div>
          <div class="paste-text">Copy your prompt using the button above. Paste it into the chat box. Claude reads your <code>CLAUDE.md</code> first, then your prompt on top.</div>
        </div>
        <div class="paste-step">
          <div class="paste-num">3</div>
          <div class="paste-text">Hit enter. <strong>You don't type any code.</strong> Claude generates all the files automatically.</div>
        </div>
        <div class="paste-step">
          <div class="paste-num">4</div>
          <div class="paste-text">Claude tells you exactly which files it created. Review them, then open a pull request on GitHub — just like the PR example in this guide.</div>
        </div>
      </div>
    </div>

    <!-- Tips -->
    <div class="slabel">Tips for best results</div>
    <div class="tip-grid">
      <div class="tip-card">
        <span class="tip-tag tag-do">Do</span>
        <div class="tip-title">Be specific about the component</div>
        <div class="tip-body">Say "a primary button with icon support" not just "a button". More detail = better output.</div>
      </div>
      <div class="tip-card">
        <span class="tip-tag tag-dont">Don't</span>
        <div class="tip-title">Skip the template</div>
        <div class="tip-body">Without it Claude guesses. You'll get a component but it may be missing tokens, tests, or stories.</div>
      </div>
      <div class="tip-card">
        <span class="tip-tag tag-do">Do</span>
        <div class="tip-title">Describe the variants you need</div>
        <div class="tip-body">Add "variants: primary, secondary, ghost, danger" so Claude covers all styles in one go.</div>
      </div>
      <div class="tip-card">
        <span class="tip-tag tag-dont">Don't</span>
        <div class="tip-title">Ask for too many things at once</div>
        <div class="tip-body">One component per prompt. Asking for 5 at once lowers quality. Do them one at a time.</div>
      </div>
    </div>

  </div>
</div>

<div class="footer">
  Built with <a href="https://claude.ai">Claude</a> &mdash; PS Design Library &mdash; Phase 4 Claude Automation
</div>

<script>
/* ── Tab switching ── */
function switchStep(n){
  document.getElementById('page1').classList.toggle('active',n===1);
  document.getElementById('page2').classList.toggle('active',n===2);
  document.getElementById('tab1').classList.toggle('active',n===1);
  document.getElementById('tab2').classList.toggle('active',n===2);
  window.scrollTo({top:0,behavior:'smooth'});
}

/* ══════════════════════════
   STEP 1 — CLAUDE.md
══════════════════════════ */
document.querySelectorAll('.chip').forEach(function(c){
  c.addEventListener('click',function(){c.classList.toggle('on');});
});
function updateRepo(){
  var v=document.getElementById('repo-name').value.trim()||'your-repo';
  document.getElementById('repo-display').textContent=v+'/';
}
function tog1(i){
  var b=document.getElementById('sb'+i);
  var ch=document.getElementById('ch'+i);
  var h=b.classList.contains('hidden');
  b.classList.toggle('hidden',!h);
  ch.innerHTML=h?'&#9660;':'&#9658;';
}
function adv(i){
  var sn=document.getElementById('sn'+i);
  sn.classList.add('done');sn.innerHTML='&#10003;';
  document.getElementById('pd'+i).classList.remove('active');
  document.getElementById('pd'+i).classList.add('done');
  document.getElementById('sb'+i).classList.add('hidden');
  document.getElementById('ch'+i).innerHTML='&#9658;';
  var nx=i+1;
  if(nx<=3){
    document.getElementById('sb'+nx).classList.remove('hidden');
    document.getElementById('ch'+nx).innerHTML='&#9660;';
    document.getElementById('pd'+nx).classList.add('active');
    document.getElementById('prog-label').textContent='Step '+(nx+1)+' of 4';
  }
}
function getSel(id){
  return Array.from(document.querySelectorAll('#'+id+' .chip.on')).map(function(c){return c.dataset.val;});
}
function generateMd(){
  adv(3);
  var repo=document.getElementById('repo-name').value.trim()||'your-repo';
  var stack=getSel('stack-chips');
  var ex1=document.getElementById('extra-stack').value.trim();
  if(ex1)ex1.split(',').map(function(s){return s.trim();}).filter(Boolean).forEach(function(s){stack.push(s);});
  var rules=getSel('rule-chips');
  var ex2=document.getElementById('extra-rules').value.trim();
  if(ex2)ex2.split(',').map(function(s){return s.trim();}).filter(Boolean).forEach(function(s){rules.push(s);});
  var exps=getSel('exp-chips');
  var ex3=document.getElementById('extra-exp').value.trim();
  if(ex3)ex3.split(',').map(function(s){return s.trim();}).filter(Boolean).forEach(function(s){exps.push(s);});
  var md='# CLAUDE.md — '+repo+'\n\nThis file tells Claude how to work in this repository.\nRead this before doing anything else.\n\n---\n\n## Tech stack\n\n'+stack.map(function(s){return '- '+s;}).join('\n')+'\n\n---\n\n## Rules\n\nThese are hard limits. Never break them, even if asked.\n\n'+rules.map(function(r,i){return (i+1)+'. '+r;}).join('\n')+'\n\n---\n\n## Expectations\n\n'+exps.map(function(e,i){return (i+1)+'. '+e;}).join('\n')+'\n\n---\n\n## Component checklist\n\nEvery component must include ALL of the following:\n\n- [ ] Component file: src/components/{Name}/{Name}.tsx\n- [ ] Storybook story: src/components/{Name}/{Name}.stories.tsx\n- [ ] Unit tests: src/components/{Name}/{Name}.test.tsx\n- [ ] TypeScript interface exported from the component file\n- [ ] All variants and states covered\n- [ ] ARIA roles and labels on interactive elements\n- [ ] Design token classes only — no hardcoded values\n- [ ] forwardRef applied so refs work correctly\n\n---\n\n## Prompt template\n\nUse this every time you ask Claude to build a component:\n\nGenerate a React component using:\n- Tailwind CSS with Token Studio tokens\n- TypeScript with full types (no any)\n- All states: default, hover, focus, disabled, loading, error\n- Accessibility: ARIA roles, aria-label, keyboard nav\n- Storybook story with autodocs and all variants\n- Unit tests with Testing Library\n- class-variance-authority (cva) for variants';
  document.getElementById('md-output').textContent=md;
  document.getElementById('md-output-section').style.display='block';
  document.getElementById('prog-label').textContent='Complete!';
  document.getElementById('md-output-section').scrollIntoView({behavior:'smooth',block:'start'});
}
function copyMd(){
  navigator.clipboard.writeText(document.getElementById('md-output').textContent).then(function(){
    var c=document.getElementById('md-confirm');c.style.display='inline';
    setTimeout(function(){c.style.display='none';},2500);
  });
}

/* ══════════════════════════
   STEP 2 — PROMPT
══════════════════════════ */
var ps={tailwind:true,tokens:true,ts:true,states:true,a11y:true,storybook:true,tests:true,forwardref:true,jsdoc:false,bloomreach:false};
function togP(k){
  ps[k]=!ps[k];
  document.getElementById('tp-'+k).classList.toggle('on',ps[k]);
  updatePrompt();
}
function resetP(){
  var d={tailwind:true,tokens:true,ts:true,states:true,a11y:true,storybook:true,tests:true,forwardref:true,jsdoc:false,bloomreach:false};
  Object.keys(d).forEach(function(k){ps[k]=d[k];document.getElementById('tp-'+k).classList.toggle('on',d[k]);});
  updatePrompt();
}
function updatePrompt(){
  var name=document.getElementById('comp-name').value.trim()||'Button';
  ['f1','f2','f3','f4'].forEach(function(id,i){
    document.getElementById(id).textContent=[name+'.tsx',name+'.stories.tsx',name+'.test.tsx','index.ts'][i];
  });
  var L=[];
  L.push('Generate a '+name+' component for the PS Design Library.');L.push('');
  var tech=['React'];
  if(ps.ts)tech.push('TypeScript (no any)');
  if(ps.tailwind)tech.push('Tailwind CSS');
  L.push('Tech: '+tech.join(' + '));
  if(ps.tokens){L.push('Tokens: Use Token Studio tokens via the ps-asset Tailwind preset.');L.push('        Token classes follow the pattern: bg-color-brand-primary-DEFAULT');}
  L.push('');
  if(ps.states)L.push('States: default, hover, focus-visible, disabled, loading (aria-busy)');
  if(ps.a11y)L.push('Accessibility: ARIA roles, aria-label, keyboard navigation');
  if(ps.forwardref)L.push('Use React.forwardRef so refs work on the element');
  L.push('');
  L.push('Generate these files:');
  var b='src/components/'+name+'/';
  L.push('- '+b+name+'.tsx          (the component)');
  if(ps.storybook)L.push('- '+b+name+'.stories.tsx  (autodocs + all variants)');
  if(ps.tests)L.push('- '+b+name+'.test.tsx     (render, click, disabled, loading)');
  L.push('- '+b+'index.ts           (named export)');
  if(ps.jsdoc){L.push('');L.push('Add JSDoc comments to all exported functions.');}
  if(ps.bloomreach){L.push('');L.push('Include a Bloomreach analytics placeholder in the component.');}
  L.push('');
  L.push('Before writing code, explain what you are going to build.');
  L.push('Generate complete files — no placeholders or "// rest of code here".');
  document.getElementById('prompt-output').textContent=L.join('\n');
}
function copyPrompt(){
  navigator.clipboard.writeText(document.getElementById('prompt-output').textContent).then(function(){
    var c=document.getElementById('cp-confirm');c.style.display='inline';
    setTimeout(function(){c.style.display='none';},2500);
  });
}

updatePrompt();
</script>
</body>
</html>
