/**
 * SkoolFinder Visual Annotation & Live Edit Tool
 * Development & Pair-Programming Companion for Chrome DevTools / Browser
 */
(function() {
  'use strict';

  if (window.__SkoolFinderAnnotationToolLoaded) return;
  window.__SkoolFinderAnnotationToolLoaded = true;

  const STORAGE_KEY_PREFIX = 'skoolfinder_annotations_';
  let activeMode = null; // 'text', 'pin', 'inspect', 'tweak', null
  let selectedElement = null;
  let hoveredElement = null;
  let pins = [];
  let textEdits = [];
  let styleTweaks = [];
  let isPanelMinimized = false;

  const getStorageKey = () => `${STORAGE_KEY_PREFIX}${window.location.pathname || '/'}`;

  function loadSavedData() {
    try {
      const raw = localStorage.getItem(getStorageKey());
      if (raw) {
        const parsed = JSON.parse(raw);
        pins = Array.isArray(parsed.pins) ? parsed.pins : [];
        textEdits = Array.isArray(parsed.textEdits) ? parsed.textEdits : [];
        styleTweaks = Array.isArray(parsed.styleTweaks) ? parsed.styleTweaks : [];
      }
    } catch (e) {
      console.warn('[AnnotationTool] Error loading saved annotations:', e);
    }
  }

  function saveData() {
    try {
      localStorage.setItem(getStorageKey(), JSON.stringify({
        pins,
        textEdits,
        styleTweaks,
        updatedAt: new Date().toISOString()
      }));
    } catch (e) {
      console.warn('[AnnotationTool] Error saving annotations:', e);
    }
  }

  function getElementSelector(el) {
    if (!el || el === document.body) return 'body';
    if (el.id) return `#${el.id}`;
    let sel = el.tagName.toLowerCase();
    if (el.className && typeof el.className === 'string') {
      const classes = el.className.split(/\s+/).filter(c => c && !c.startsWith('sfa-'));
      if (classes.length) sel += `.${classes.slice(0, 2).join('.')}`;
    }
    const parent = el.parentElement;
    if (parent && parent !== document.body && parent.id) {
      sel = `#${parent.id} > ${sel}`;
    }
    return sel;
  }

  // Inject CSS Styles
  function injectStyles() {
    if (document.getElementById('sfa-styles')) return;
    const style = document.createElement('style');
    style.id = 'sfa-styles';
    style.textContent = `
      #sfa-hub {
        position: fixed;
        bottom: 24px;
        right: 24px;
        z-index: 999999;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        color: #ffffff;
      }
      #sfa-trigger-btn {
        background: linear-gradient(135deg, #091e42 0%, #1e3a8a 100%);
        color: #ffffff;
        border: 2px solid #fbbf24;
        border-radius: 999px;
        padding: 10px 18px;
        font-size: 14px;
        font-weight: 700;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
        box-shadow: 0 8px 24px rgba(9, 30, 66, 0.4), 0 0 0 2px rgba(251, 191, 36, 0.3);
        transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      }
      #sfa-trigger-btn:hover {
        transform: translateY(-2px) scale(1.03);
        box-shadow: 0 12px 30px rgba(9, 30, 66, 0.5), 0 0 12px rgba(251, 191, 36, 0.6);
      }
      #sfa-badge-count {
        background: #ef4444;
        color: #ffffff;
        font-size: 11px;
        font-weight: 800;
        padding: 2px 6px;
        border-radius: 10px;
        display: none;
      }
      #sfa-panel {
        position: fixed;
        bottom: 74px;
        right: 24px;
        width: 360px;
        max-width: calc(100vw - 48px);
        background: rgba(9, 30, 66, 0.96);
        backdrop-filter: blur(12px);
        border: 1.5px solid rgba(251, 191, 36, 0.6);
        border-radius: 16px;
        box-shadow: 0 16px 40px rgba(0, 0, 0, 0.45);
        display: none;
        flex-direction: column;
        overflow: hidden;
        z-index: 999999;
      }
      .sfa-header {
        padding: 12px 16px;
        background: rgba(255, 255, 255, 0.06);
        border-bottom: 1px solid rgba(255, 255, 255, 0.12);
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .sfa-title {
        font-size: 13.5px;
        font-weight: 800;
        color: #fbbf24;
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .sfa-header-actions button {
        background: transparent;
        border: none;
        color: #94a3b8;
        font-size: 16px;
        cursor: pointer;
        padding: 4px;
        line-height: 1;
      }
      .sfa-header-actions button:hover {
        color: #ffffff;
      }
      .sfa-body {
        padding: 14px 16px;
        display: flex;
        flex-direction: column;
        gap: 12px;
        max-height: 480px;
        overflow-y: auto;
      }
      .sfa-modes {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 6px;
      }
      .sfa-mode-btn {
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.14);
        border-radius: 8px;
        color: #e2e8f0;
        padding: 8px 4px;
        font-size: 11px;
        font-weight: 700;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        transition: all 0.15s ease;
      }
      .sfa-mode-btn span.sfa-icon {
        font-size: 15px;
      }
      .sfa-mode-btn:hover {
        background: rgba(255, 255, 255, 0.16);
      }
      .sfa-mode-btn.active {
        background: #fbbf24;
        color: #091e42;
        border-color: #fbbf24;
        font-weight: 800;
      }
      .sfa-status-banner {
        font-size: 11.5px;
        padding: 8px 10px;
        border-radius: 6px;
        background: rgba(59, 130, 246, 0.18);
        border: 1px solid rgba(59, 130, 246, 0.35);
        color: #93c5fd;
        display: none;
      }
      .sfa-tweaks-box {
        display: none;
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        padding: 10px;
        font-size: 11.5px;
        flex-direction: column;
        gap: 8px;
      }
      .sfa-tweak-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .sfa-tweak-btns {
        display: flex;
        gap: 4px;
      }
      .sfa-tweak-btns button {
        background: rgba(255, 255, 255, 0.12);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: #ffffff;
        border-radius: 4px;
        padding: 3px 8px;
        font-size: 11px;
        cursor: pointer;
      }
      .sfa-tweak-btns button:hover {
        background: #fbbf24;
        color: #091e42;
      }
      .sfa-actions {
        display: flex;
        flex-direction: column;
        gap: 6px;
        margin-top: 4px;
      }
      .sfa-btn-primary {
        background: #fbbf24;
        color: #091e42;
        border: none;
        padding: 9px;
        border-radius: 8px;
        font-weight: 800;
        font-size: 12.5px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        transition: transform 0.15s ease;
      }
      .sfa-btn-primary:hover {
        transform: translateY(-1px);
        background: #f59e0b;
      }
      .sfa-btn-secondary {
        background: rgba(255, 255, 255, 0.08);
        color: #e2e8f0;
        border: 1px solid rgba(255, 255, 255, 0.16);
        padding: 7px;
        border-radius: 8px;
        font-weight: 600;
        font-size: 11.5px;
        cursor: pointer;
      }
      .sfa-btn-secondary:hover {
        background: rgba(255, 255, 255, 0.16);
      }
      /* Marker Pins */
      .sfa-pin-marker {
        position: absolute;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background: #ef4444;
        color: #ffffff;
        font-size: 13px;
        font-weight: 800;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid #ffffff;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.35);
        cursor: pointer;
        z-index: 999990;
        transform: translate(-50%, -50%);
        transition: transform 0.15s ease;
      }
      .sfa-pin-marker:hover {
        transform: translate(-50%, -50%) scale(1.2);
        background: #dc2626;
      }
      .sfa-pin-popover {
        position: absolute;
        width: 240px;
        background: #ffffff;
        color: #091e42;
        border-radius: 10px;
        padding: 10px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
        border: 1.5px solid #091e42;
        font-size: 12px;
        z-index: 999995;
        transform: translate(-50%, 14px);
      }
      .sfa-pin-popover textarea {
        width: 100%;
        border: 1px solid #cbd5e1;
        border-radius: 6px;
        padding: 6px;
        font-size: 12px;
        font-family: inherit;
        resize: vertical;
        min-height: 48px;
        box-sizing: border-box;
      }
      .sfa-pin-popover button.sfa-del-pin {
        background: #fee2e2;
        color: #b91c1c;
        border: none;
        border-radius: 4px;
        padding: 4px 8px;
        font-size: 10.5px;
        cursor: pointer;
        margin-top: 6px;
        float: right;
      }
      /* Hover Inspector Outline */
      .sfa-hover-highlight {
        outline: 2px dashed #3b82f6 !important;
        outline-offset: 2px !important;
        cursor: crosshair !important;
      }
      .sfa-edit-highlight {
        outline: 2px dashed #10b981 !important;
        outline-offset: 2px !important;
      }
      #sfa-inspect-tooltip {
        position: fixed;
        background: rgba(9, 30, 66, 0.95);
        color: #fbbf24;
        padding: 4px 8px;
        border-radius: 6px;
        font-size: 11px;
        font-weight: 700;
        pointer-events: none;
        z-index: 999998;
        display: none;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      }
    `;
    document.head.appendChild(style);
  }

  // Build Floating UI Hub
  function buildUI() {
    if (document.getElementById('sfa-hub')) return;

    const hub = document.createElement('div');
    hub.id = 'sfa-hub';
    hub.innerHTML = `
      <button id="sfa-trigger-btn" type="button" title="SkoolFinder Live Annotator & Editor">
        <span>✏️</span> Annotate &amp; Edit
        <span id="sfa-badge-count">0</span>
      </button>

      <div id="sfa-panel">
        <div class="sfa-header">
          <div class="sfa-title"><span>🛠️</span> Visual Editor &amp; Annotator</div>
          <div class="sfa-header-actions">
            <button id="sfa-btn-close" type="button" title="Close Panel">&times;</button>
          </div>
        </div>

        <div class="sfa-body">
          <div class="sfa-modes">
            <button class="sfa-mode-btn" data-mode="text" type="button" title="Direct inline text editing">
              <span class="sfa-icon">✏️</span>
              <span>Edit Text</span>
            </button>
            <button class="sfa-mode-btn" data-mode="pin" type="button" title="Click anywhere to drop numbered feedback pins">
              <span class="sfa-icon">📌</span>
              <span>Drop Pin</span>
            </button>
            <button class="sfa-mode-btn" data-mode="inspect" type="button" title="Inspect element selectors and box model">
              <span class="sfa-icon">🔍</span>
              <span>Inspect</span>
            </button>
            <button class="sfa-mode-btn" data-mode="tweak" type="button" title="Tweak spacing, alignment, and colors">
              <span class="sfa-icon">🎨</span>
              <span>Tweak</span>
            </button>
          </div>

          <div id="sfa-status" class="sfa-status-banner"></div>

          <!-- Quick Tweaks Panel -->
          <div id="sfa-tweaks" class="sfa-tweaks-box">
            <div style="font-weight: 700; color: #fbbf24; font-size: 11px;" id="sfa-tweak-target">No element selected</div>
            
            <div class="sfa-tweak-row">
              <span>Align:</span>
              <div class="sfa-tweak-btns">
                <button type="button" data-tweak="align" data-val="left">Left</button>
                <button type="button" data-tweak="align" data-val="center">Center</button>
                <button type="button" data-tweak="align" data-val="right">Right</button>
              </div>
            </div>

            <div class="sfa-tweak-row">
              <span>Margin-Y:</span>
              <div class="sfa-tweak-btns">
                <button type="button" data-tweak="my" data-val="-8">-8px</button>
                <button type="button" data-tweak="my" data-val="+8">+8px</button>
                <button type="button" data-tweak="my" data-val="0">Reset</button>
              </div>
            </div>

            <div class="sfa-tweak-row">
              <span>Padding-Y:</span>
              <div class="sfa-tweak-btns">
                <button type="button" data-tweak="py" data-val="-8">-8px</button>
                <button type="button" data-tweak="py" data-val="+8">+8px</button>
                <button type="button" data-tweak="py" data-val="0">Reset</button>
              </div>
            </div>
          </div>

          <div class="sfa-actions">
            <button class="sfa-btn-primary" id="sfa-copy-feedback" type="button" title="Copy structured feedback notes for AI Assistant">
              <span>📋</span> Copy Notes for Agent
            </button>
            <button class="sfa-btn-secondary" id="sfa-toggle-pins" type="button">
              👁️ Toggle Pins Visibility
            </button>
            <button class="sfa-btn-secondary" id="sfa-clear-all" type="button" style="color: #f87171;">
              🗑️ Clear All Pins &amp; Notes
            </button>
          </div>
        </div>
      </div>

      <div id="sfa-inspect-tooltip"></div>
    `;
    document.body.appendChild(hub);

    attachHubEvents();
    renderExistingPins();
    updateBadge();
  }

  function setMode(mode) {
    if (activeMode === mode) {
      activeMode = null; // Toggle off
    } else {
      activeMode = mode;
    }

    // Update UI active buttons
    document.querySelectorAll('.sfa-mode-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.mode === activeMode);
    });

    const statusEl = document.getElementById('sfa-status');
    const tweaksEl = document.getElementById('sfa-tweaks');

    // Remove text edit handlers if deactivating
    document.querySelectorAll('[contenteditable="true"]').forEach(el => {
      el.removeAttribute('contenteditable');
      el.classList.remove('sfa-edit-highlight');
    });

    if (activeMode === 'text') {
      statusEl.style.display = 'block';
      statusEl.textContent = '✏️ Click on any text, heading, or button to edit content live.';
      tweaksEl.style.display = 'none';
      enableTextEditing();
    } else if (activeMode === 'pin') {
      statusEl.style.display = 'block';
      statusEl.textContent = '📌 Click anywhere on the page to drop a feedback pin.';
      tweaksEl.style.display = 'none';
    } else if (activeMode === 'inspect') {
      statusEl.style.display = 'block';
      statusEl.textContent = '🔍 Hover over any element to inspect its selector and box model.';
      tweaksEl.style.display = 'none';
    } else if (activeMode === 'tweak') {
      statusEl.style.display = 'block';
      statusEl.textContent = '🎨 Click any element on the page, then use the controls below to tweak.';
      tweaksEl.style.display = 'flex';
    } else {
      statusEl.style.display = 'none';
      tweaksEl.style.display = 'none';
    }
  }

  function enableTextEditing() {
    const textElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, button, a, strong, small');
    textElements.forEach(el => {
      if (el.closest('#sfa-hub') || el.closest('.sfa-pin-marker') || el.closest('.sfa-pin-popover')) return;
      el.setAttribute('contenteditable', 'true');
      el.classList.add('sfa-edit-highlight');

      let originalText = el.innerText;
      el.onblur = () => {
        const newText = el.innerText;
        if (originalText !== newText) {
          textEdits.push({
            selector: getElementSelector(el),
            oldText: originalText,
            newText: newText,
            time: new Date().toLocaleTimeString()
          });
          saveData();
          updateBadge();
        }
      };
    });
  }

  function attachHubEvents() {
    const triggerBtn = document.getElementById('sfa-trigger-btn');
    const panel = document.getElementById('sfa-panel');
    const closeBtn = document.getElementById('sfa-btn-close');

    triggerBtn.addEventListener('click', () => {
      panel.style.display = panel.style.display === 'flex' ? 'none' : 'flex';
    });

    closeBtn.addEventListener('click', () => {
      panel.style.display = 'none';
      setMode(null);
    });

    document.querySelectorAll('.sfa-mode-btn').forEach(btn => {
      btn.addEventListener('click', () => setMode(btn.dataset.mode));
    });

    // Global Hover Inspector
    const tooltip = document.getElementById('sfa-inspect-tooltip');
    document.addEventListener('mousemove', (e) => {
      if (activeMode !== 'inspect') {
        tooltip.style.display = 'none';
        if (hoveredElement) {
          hoveredElement.classList.remove('sfa-hover-highlight');
          hoveredElement = null;
        }
        return;
      }

      const target = document.elementFromPoint(e.clientX, e.clientY);
      if (!target || target.closest('#sfa-hub') || target.closest('.sfa-pin-marker') || target.closest('.sfa-pin-popover')) {
        tooltip.style.display = 'none';
        return;
      }

      if (hoveredElement && hoveredElement !== target) {
        hoveredElement.classList.remove('sfa-hover-highlight');
      }
      hoveredElement = target;
      hoveredElement.classList.add('sfa-hover-highlight');

      const sel = getElementSelector(target);
      const rect = target.getBoundingClientRect();
      tooltip.textContent = `${sel} (${Math.round(rect.width)} × ${Math.round(rect.height)}px)`;
      tooltip.style.left = `${Math.min(window.innerWidth - 220, e.clientX + 14)}px`;
      tooltip.style.top = `${Math.max(10, e.clientY - 26)}px`;
      tooltip.style.display = 'block';
    });

    // Global Click Handler for Pin & Tweak Selection
    document.addEventListener('click', (e) => {
      if (e.target.closest('#sfa-hub') || e.target.closest('.sfa-pin-marker') || e.target.closest('.sfa-pin-popover')) {
        return;
      }

      if (activeMode === 'pin') {
        e.preventDefault();
        e.stopPropagation();

        const pageX = e.pageX;
        const pageY = e.pageY;
        const selector = getElementSelector(e.target);

        const newPin = {
          id: 'pin_' + Date.now(),
          number: pins.length + 1,
          x: pageX,
          y: pageY,
          selector: selector,
          note: ''
        };
        pins.push(newPin);
        saveData();
        renderPin(newPin, true);
        updateBadge();
      } else if (activeMode === 'tweak') {
        e.preventDefault();
        e.stopPropagation();
        selectedElement = e.target;
        const sel = getElementSelector(selectedElement);
        const tweakTargetEl = document.getElementById('sfa-tweak-target');
        if (tweakTargetEl) tweakTargetEl.textContent = `Target: ${sel}`;
      }
    }, true);

    // Style Tweaks Buttons
    document.querySelectorAll('#sfa-tweaks button[data-tweak]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (!selectedElement) {
          alert('Click an element on the page first to select it.');
          return;
        }
        const tweak = btn.dataset.tweak;
        const val = btn.dataset.val;
        const sel = getElementSelector(selectedElement);

        if (tweak === 'align') {
          selectedElement.style.textAlign = val;
        } else if (tweak === 'my') {
          if (val === '0') {
            selectedElement.style.marginTop = '';
            selectedElement.style.marginBottom = '';
          } else {
            const currentMT = parseInt(window.getComputedStyle(selectedElement).marginTop) || 0;
            const currentMB = parseInt(window.getComputedStyle(selectedElement).marginBottom) || 0;
            const delta = parseInt(val);
            selectedElement.style.marginTop = `${Math.max(0, currentMT + delta)}px`;
            selectedElement.style.marginBottom = `${Math.max(0, currentMB + delta)}px`;
          }
        } else if (tweak === 'py') {
          if (val === '0') {
            selectedElement.style.paddingTop = '';
            selectedElement.style.paddingBottom = '';
          } else {
            const currentPT = parseInt(window.getComputedStyle(selectedElement).paddingTop) || 0;
            const currentPB = parseInt(window.getComputedStyle(selectedElement).paddingBottom) || 0;
            const delta = parseInt(val);
            selectedElement.style.paddingTop = `${Math.max(0, currentPT + delta)}px`;
            selectedElement.style.paddingBottom = `${Math.max(0, currentPB + delta)}px`;
          }
        }

        styleTweaks.push({
          selector: sel,
          tweak: tweak,
          val: val,
          time: new Date().toLocaleTimeString()
        });
        saveData();
        updateBadge();
      });
    });

    // Copy Notes for Agent
    document.getElementById('sfa-copy-feedback').addEventListener('click', () => {
      const summary = generateMarkdownSummary();
      navigator.clipboard.writeText(summary).then(() => {
        const btn = document.getElementById('sfa-copy-feedback');
        const orig = btn.innerHTML;
        btn.innerHTML = '<span>✅</span> Copied to Clipboard!';
        setTimeout(() => { btn.innerHTML = orig; }, 2000);
      }).catch(err => {
        alert('Could not auto-copy. Summary printed to console.');
        console.log(summary);
      });
    });

    // Toggle Pin Visibility
    let pinsVisible = true;
    document.getElementById('sfa-toggle-pins').addEventListener('click', () => {
      pinsVisible = !pinsVisible;
      document.querySelectorAll('.sfa-pin-marker, .sfa-pin-popover').forEach(el => {
        el.style.display = pinsVisible ? '' : 'none';
      });
    });

    // Clear All
    document.getElementById('sfa-clear-all').addEventListener('click', () => {
      if (confirm('Clear all pins, notes, and text edits for this page?')) {
        pins = [];
        textEdits = [];
        styleTweaks = [];
        saveData();
        document.querySelectorAll('.sfa-pin-marker, .sfa-pin-popover').forEach(el => el.remove());
        updateBadge();
      }
    });
  }

  function renderExistingPins() {
    document.querySelectorAll('.sfa-pin-marker, .sfa-pin-popover').forEach(el => el.remove());
    pins.forEach((pin, idx) => {
      pin.number = idx + 1;
      renderPin(pin, false);
    });
  }

  function renderPin(pin, openImmediately = false) {
    const marker = document.createElement('div');
    marker.className = 'sfa-pin-marker';
    marker.id = `sfa-marker-${pin.id}`;
    marker.style.left = `${pin.x}px`;
    marker.style.top = `${pin.y}px`;
    marker.textContent = pin.number;

    const popover = document.createElement('div');
    popover.className = 'sfa-pin-popover';
    popover.id = `sfa-popover-${pin.id}`;
    popover.style.left = `${pin.x}px`;
    popover.style.top = `${pin.y}px`;
    popover.style.display = openImmediately ? 'block' : 'none';

    popover.innerHTML = `
      <div style="font-weight: 800; margin-bottom: 4px; display: flex; justify-content: space-between;">
        <span>Pin #${pin.number}</span>
        <small style="color: #64748b; font-weight: normal; font-size: 10px;">${pin.selector || 'Element'}</small>
      </div>
      <textarea placeholder="Type your change or feedback here...">${pin.note || ''}</textarea>
      <div>
        <button type="button" class="sfa-del-pin">Delete</button>
      </div>
    `;

    const textarea = popover.querySelector('textarea');
    textarea.addEventListener('input', () => {
      pin.note = textarea.value;
      saveData();
    });

    popover.querySelector('.sfa-del-pin').addEventListener('click', (e) => {
      e.stopPropagation();
      pins = pins.filter(p => p.id !== pin.id);
      saveData();
      marker.remove();
      popover.remove();
      renderExistingPins();
      updateBadge();
    });

    marker.addEventListener('click', (e) => {
      e.stopPropagation();
      popover.style.display = popover.style.display === 'none' ? 'block' : 'none';
      if (popover.style.display === 'block') {
        textarea.focus();
      }
    });

    document.body.appendChild(marker);
    document.body.appendChild(popover);

    if (openImmediately) {
      setTimeout(() => textarea.focus(), 50);
    }
  }

  function updateBadge() {
    const badge = document.getElementById('sfa-badge-count');
    if (!badge) return;
    const count = pins.length + textEdits.length + styleTweaks.length;
    if (count > 0) {
      badge.textContent = count;
      badge.style.display = 'inline-block';
    } else {
      badge.style.display = 'none';
    }
  }

  function generateMarkdownSummary() {
    const lines = [];
    lines.push(`### Visual Feedback & Annotations`);
    lines.push(`**Target Page:** \`${window.location.href}\``);
    lines.push(`**Timestamp:** ${new Date().toLocaleString()}`);
    lines.push('');

    if (pins.length > 0) {
      lines.push(`#### 📌 Feedback Pins:`);
      pins.forEach(p => {
        lines.push(`- **Pin #${p.number}** on \`${p.selector}\`: "${p.note || 'No description provided'}"`);
      });
      lines.push('');
    }

    if (textEdits.length > 0) {
      lines.push(`#### ✏️ Live Text Changes:`);
      textEdits.forEach(t => {
        lines.push(`- Element \`${t.selector}\`:`);
        lines.push(`  - *Before:* "${t.oldText}"`);
        lines.push(`  - *After:* "${t.newText}"`);
      });
      lines.push('');
    }

    if (styleTweaks.length > 0) {
      lines.push(`#### 🎨 Style Tweaks:`);
      styleTweaks.forEach(s => {
        lines.push(`- Element \`${s.selector}\`: set \`${s.tweak}\` to \`${s.val}\``);
      });
      lines.push('');
    }

    if (pins.length === 0 && textEdits.length === 0 && styleTweaks.length === 0) {
      lines.push(`*(No active annotations or notes yet. Click on the page to drop pins or edit text.)*`);
    }

    return lines.join('\n');
  }

  // Initialization
  function init() {
    loadSavedData();
    injectStyles();
    buildUI();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

