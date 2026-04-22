(function () {
  'use strict';

  // Prevent double-injection on SPA navigation
  if (document.getElementById('ps-ai-launcher')) return;

  // ── Build floating panel ───────────────────────────────────────────────────
  const panel = document.createElement('div');
  panel.id = 'ps-ai-panel';
  panel.setAttribute('aria-label', 'PartsSource AI Assistant');
  panel.innerHTML = `
    <div id="ps-ai-header">
      <div id="ps-ai-header-left">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
        </svg>
        <span id="ps-ai-title">PartsSource AI</span>
        <span id="ps-ai-badge">BETA</span>
      </div>
      <div id="ps-ai-controls">
        <button id="ps-ai-new" title="New conversation">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        </button>
        <button id="ps-ai-popout" title="Open in full window">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        </button>
        <button id="ps-ai-minimize" title="Minimize">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/></svg>
        </button>
        <button id="ps-ai-close" title="Close">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
    </div>
    <iframe id="ps-ai-frame" src="http://localhost:5173" allow="clipboard-write; clipboard-read" title="PartsSource AI"></iframe>
    <div id="ps-ai-resize-handle"></div>
  `;
  document.body.appendChild(panel);

  // ── Build nav button ───────────────────────────────────────────────────────
  const btn = document.createElement('button');
  btn.id = 'ps-ai-launcher';
  btn.setAttribute('aria-label', 'Open PartsSource AI');
  btn.title = 'PartsSource AI — backorder alerts & order automation';
  btn.innerHTML = `
    <span class="ps-ai-btn-icon">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm1 14.93V15a1 1 0 0 0-2 0v1.93A8 8 0 0 1 4.07 9H6a1 1 0 0 0 0-2H4.07A8 8 0 0 1 11 4.07V6a1 1 0 0 0 2 0V4.07A8 8 0 0 1 19.93 11H18a1 1 0 0 0 0 2h1.93A8 8 0 0 1 13 16.93Z"/>
      </svg>
    </span>
    <span class="ps-ai-btn-text">AI Assistant</span>
    <span id="ps-ai-badge-dot" class="ps-ai-dot"></span>
  `;

  // ── Inject button into PartsSource nav ─────────────────────────────────────
  function injectButton() {
    if (document.getElementById('ps-ai-launcher')) return;

    // Strategy 1 — utility nav area (top-right: Help | About Us)
    const utilSelectors = [
      '.utility-navigation',
      '.utility-nav',
      '[class*="utilityNav"]',
      '[class*="utility-bar"]',
      '[class*="headerTop"] ul',
      '[class*="top-nav"]',
      '.site-header-top',
    ];
    for (const sel of utilSelectors) {
      const el = document.querySelector(sel);
      if (el) {
        el.appendChild(btn);
        return;
      }
    }

    // Strategy 2 — inject next to the "Help" link
    const helpLink = Array.from(document.querySelectorAll('a, li')).find(
      (el) => el.textContent?.trim().toLowerCase() === 'help',
    );
    if (helpLink?.parentElement) {
      helpLink.parentElement.insertBefore(btn, helpLink);
      return;
    }

    // Strategy 3 — main header bar
    const headerSelectors = [
      'header',
      '.site-header',
      '[class*="Header"]',
      '#header',
      '.header',
    ];
    for (const sel of headerSelectors) {
      const el = document.querySelector(sel);
      if (el) {
        Object.assign(btn.style, { position: 'absolute', top: '8px', right: '8px', zIndex: '99999' });
        el.style.position = el.style.position || 'relative';
        el.appendChild(btn);
        return;
      }
    }

    // Last resort — fixed position top-right
    Object.assign(btn.style, { position: 'fixed', top: '10px', right: '10px', zIndex: '999999' });
    document.body.appendChild(btn);
  }

  // Run immediately then watch for SPA-loaded nav
  injectButton();
  const observer = new MutationObserver(() => {
    if (!document.getElementById('ps-ai-launcher')) injectButton();
  });
  observer.observe(document.body, { childList: true, subtree: true });

  // ── Panel visibility toggle ────────────────────────────────────────────────
  let panelOpen = false;
  let minimized = false;

  function openPanel() {
    panelOpen = true;
    minimized = false;
    panel.style.display = 'flex';
    panel.classList.remove('ps-minimized');
    btn.classList.add('ps-active');
    document.getElementById('ps-ai-frame').focus();
  }

  function closePanel() {
    panelOpen = false;
    panel.style.display = 'none';
    btn.classList.remove('ps-active');
  }

  function toggleMinimize() {
    minimized = !minimized;
    panel.classList.toggle('ps-minimized', minimized);
  }

  btn.addEventListener('click', () => {
    if (!panelOpen) openPanel();
    else if (minimized) { minimized = false; panel.classList.remove('ps-minimized'); }
    else closePanel();
  });

  document.getElementById('ps-ai-close').addEventListener('click', closePanel);
  document.getElementById('ps-ai-minimize').addEventListener('click', toggleMinimize);
  document.getElementById('ps-ai-popout').addEventListener('click', () => {
    window.open('http://localhost:5173', 'ps-ai-window', 'width=520,height=760,left=100,top=80');
  });
  document.getElementById('ps-ai-new').addEventListener('click', () => {
    const frame = document.getElementById('ps-ai-frame');
    frame.src = frame.src; // reload iframe to reset conversation
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && panelOpen && !minimized) closePanel();
  });

  // ── Drag header to move panel ──────────────────────────────────────────────
  const header = document.getElementById('ps-ai-header');
  let dragging = false, dragStartX = 0, dragStartY = 0, panelStartX = 0, panelStartY = 0;

  header.addEventListener('mousedown', (e) => {
    if ((e.target).closest('button')) return;
    dragging = true;
    const rect = panel.getBoundingClientRect();
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    panelStartX = rect.left;
    panelStartY = rect.top;
    header.style.cursor = 'grabbing';
    e.preventDefault();
  });

  document.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - dragStartX;
    const dy = e.clientY - dragStartY;
    const newLeft = Math.max(0, Math.min(window.innerWidth - 100, panelStartX + dx));
    const newTop = Math.max(0, Math.min(window.innerHeight - 60, panelStartY + dy));
    panel.style.left = newLeft + 'px';
    panel.style.top = newTop + 'px';
    panel.style.right = 'auto';
  });

  document.addEventListener('mouseup', () => {
    dragging = false;
    header.style.cursor = 'grab';
  });

  // ── Resize handle ──────────────────────────────────────────────────────────
  const resizeHandle = document.getElementById('ps-ai-resize-handle');
  let resizing = false, resizeStartX = 0, resizeStartY = 0, startW = 0, startH = 0;

  resizeHandle.addEventListener('mousedown', (e) => {
    resizing = true;
    resizeStartX = e.clientX;
    resizeStartY = e.clientY;
    startW = panel.offsetWidth;
    startH = panel.offsetHeight;
    e.preventDefault();
    e.stopPropagation();
  });

  document.addEventListener('mousemove', (e) => {
    if (!resizing) return;
    const newW = Math.max(340, startW + (e.clientX - resizeStartX));
    const newH = Math.max(300, startH + (e.clientY - resizeStartY));
    panel.style.width = newW + 'px';
    panel.style.height = newH + 'px';
  });

  document.addEventListener('mouseup', () => { resizing = false; });

  // ── Save/restore panel position ────────────────────────────────────────────
  const STORAGE_KEY = 'ps-ai-panel-pos';
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    if (saved.left) { panel.style.left = saved.left; panel.style.right = 'auto'; }
    if (saved.top) panel.style.top = saved.top;
    if (saved.width) panel.style.width = saved.width;
    if (saved.height) panel.style.height = saved.height;
  } catch { /* ignore */ }

  window.addEventListener('beforeunload', () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        left: panel.style.left || (window.innerWidth - 500) + 'px',
        top: panel.style.top || '70px',
        width: panel.style.width,
        height: panel.style.height,
      }));
    } catch { /* ignore */ }
  });

  // ── Notification dot: pulse when backend detects backorder ────────────────
  // Listen for postMessage events from the iframe
  window.addEventListener('message', (e) => {
    if (e.origin !== 'http://localhost:5173') return;
    if (e.data?.type === 'backorder_alert') {
      const dot = document.getElementById('ps-ai-badge-dot');
      if (dot) { dot.classList.add('ps-dot-alert'); dot.title = 'Backorder alert!'; }
    }
    if (e.data?.type === 'panel_opened') {
      const dot = document.getElementById('ps-ai-badge-dot');
      if (dot) dot.classList.remove('ps-dot-alert');
    }
  });
})();
