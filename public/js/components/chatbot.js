/**
 * SkoolFinder Ghana - Feature 15: AI Admissions & CSSPS Guidance Chatbot ("Akosua")
 */
const AIChatbot = {
  isOpen: false,
  isTyping: false,
  messages: [],
  history: [],

  init() {
    if (document.getElementById('sd-chatbot-root')) return;

    // Create mount root
    const root = document.createElement('div');
    root.id = 'sd-chatbot-root';
    document.body.appendChild(root);

    this.render();
    this.attachEvents();

    // Initial greeting if first time
    if (this.messages.length === 0) {
      this.messages.push({
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        reply: `**Akwaaba! 🇬🇭** I am **Akosua**, your SkoolFinder AI Education & Admissions Advisor.\n\nI can help you navigate:\n* 🎯 **BECE CSSPS cut-offs & aggregate calculations**\n* 🏫 **Cambridge IGCSE vs GES (NaSIA) vs IB curricula**\n* 💰 **Transparent fees, PTA levies & Mobile Money payments**\n* 🚌 **School bus routes, live GPS tracking & infirmaries**\n* 📚 **Aki-Ola textbooks & WAEC/BECE past questions**\n\nHow can I help guide your ward's schooling today?`,
        suggestions: [
          "How do I calculate CSSPS BECE aggregate?",
          "Compare Cambridge vs GES curriculum",
          "What are the fees for GIS & Morning Star?",
          "Show Cambridge schools in East Legon"
        ],
        quickLinks: [
          { label: "🎯 CSSPS Placement Simulator", view: "cssps" },
          { label: "🏫 School Directory", view: "directory" },
          { label: "⚖️ Compare Schools", view: "compare" }
        ]
      });
      this.updateMessagesUI();
    }
  },

  render() {
    const root = document.getElementById('sd-chatbot-root');
    if (!root) return;

    root.innerHTML = `
      <!-- Floating Action Button -->
      <button class="sd-chatbot-fab" id="sd-chatbot-fab-btn" aria-label="Akosua AI Advisor - CSSPS & School Admissions" style="${this.isOpen ? 'display: none;' : 'display: flex;'}">
        <div class="sd-chatbot-avatar-wrap">
          👩🏾‍💼
          <span class="sd-chatbot-status-dot"></span>
        </div>
        <div class="sd-chatbot-fab-text">
          <span class="sd-chatbot-fab-title">Akosua AI <span class="badge" style="background: rgba(245,158,11,0.25); color: #fef08a; padding: 1px 6px; font-size: 0.65rem;">🇬🇭 Advisor</span></span>
          <span class="sd-chatbot-fab-sub">CSSPS & School Admissions</span>
        </div>
      </button>

      <!-- Chat Window -->
      <div class="sd-chat-window" id="sd-chat-window" style="${this.isOpen ? 'display: flex;' : 'display: none;'}">
        <!-- Header -->
        <div class="sd-chat-header">
          <div class="sd-chat-header-info">
            <div class="sd-chatbot-avatar-wrap" style="width: 34px; height: 34px; font-size: 1.15rem;">
              👩🏾‍💼
              <span class="sd-chatbot-status-dot"></span>
            </div>
            <div>
              <div class="sd-chat-title">
                Akosua
                <span class="sd-chat-badge">AI Advisor</span>
              </div>
              <div style="font-size: 0.7rem; color: #93c5fd; font-weight: 500;">
                🟢 Online • CSSPS & Admissions Desk
              </div>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <!-- Soundwave Audio Visualization -->
            <div class="ai-soundwave-wrap" id="akosua-soundwave" title="Live AI Admissions Intelligence Active">
              <span class="soundwave-bar"></span>
              <span class="soundwave-bar"></span>
              <span class="soundwave-bar"></span>
              <span class="soundwave-bar"></span>
              <span class="soundwave-bar"></span>
            </div>
            <div class="sd-chat-actions">
              <button class="sd-chat-btn-icon" id="sd-chat-restart-btn" title="Restart Conversation">🔄</button>
              <button class="sd-chat-btn-icon" id="sd-chat-close-btn" title="Minimize Chat">✕</button>
            </div>
          </div>
        </div>

        <!-- Messages Feed -->
        <div class="sd-chat-messages" id="sd-chat-messages-box">
          <!-- Dynamically populated -->
        </div>

        <!-- Suggestions Pills Bar -->
        <div class="sd-chat-suggestions" id="sd-chat-suggestions-bar">
          <!-- Dynamically populated -->
        </div>

        <!-- Input Bar -->
        <form class="sd-chat-input-bar" id="sd-chat-form">
          <input 
            type="text" 
            class="sd-chat-input" 
            id="sd-chat-input-field" 
            placeholder="Ask Akosua: e.g. What schools accept aggregate 8?..." 
            autocomplete="off"
            maxlength="300"
          />
          <button type="submit" class="sd-chat-send-btn" id="sd-chat-send-btn" title="Send Question" aria-label="Send">
            ➤
          </button>
        </form>
      </div>
    `;
  },

  attachEvents() {
    const fabBtn = document.getElementById('sd-chatbot-fab-btn');
    const closeBtn = document.getElementById('sd-chat-close-btn');
    const restartBtn = document.getElementById('sd-chat-restart-btn');
    const form = document.getElementById('sd-chat-form');
    const inputField = document.getElementById('sd-chat-input-field');

    if (fabBtn) {
      fabBtn.addEventListener('click', () => this.open());
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.close());
    }

    if (restartBtn) {
      restartBtn.addEventListener('click', () => this.restart());
    }

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = inputField?.value?.trim();
        if (text) {
          inputField.value = '';
          this.handleUserSubmit(text);
        }
      });
    }
  },

  open(initialQuery = null) {
    this.isOpen = true;
    const fab = document.getElementById('sd-chatbot-fab-btn');
    const win = document.getElementById('sd-chat-window');
    if (fab) fab.style.display = 'none';
    if (win) {
      win.style.display = 'flex';
      this.updateMessagesUI();
      const input = document.getElementById('sd-chat-input-field');
      if (input) {
        if (initialQuery) {
          input.value = initialQuery;
        }
        setTimeout(() => input.focus(), 150);
      }
    }

    if (initialQuery) {
      this.handleUserSubmit(initialQuery);
    }
  },

  close() {
    this.isOpen = false;
    const fab = document.getElementById('sd-chatbot-fab-btn');
    const win = document.getElementById('sd-chat-window');
    if (win) win.style.display = 'none';
    if (fab) fab.style.display = 'flex';
  },

  restart() {
    this.messages = [];
    this.history = [];
    this.init();
    State.showToast("Akosua AI conversation restarted", "info");
  },

  async handleUserSubmit(text) {
    if (!text || this.isTyping) return;

    // Add user message
    this.messages.push({
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    this.history.push({ role: 'user', content: text });
    this.isTyping = true;
    this.updateMessagesUI();

    try {
      // Call backend AI endpoint
      const res = await API.queryAIChat(text, this.history, {
        currentView: State.currentView,
        currentSchoolId: State.currentSchoolId,
        userRole: State.currentUser?.role || 'guest'
      });

      this.isTyping = false;

      if (res && res.reply) {
        this.messages.push({
          sender: 'bot',
          reply: res.reply,
          timestamp: res.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestions: res.suggestions || [],
          actionCards: res.actionCards || [],
          quickLinks: res.quickLinks || []
        });
        this.history.push({ role: 'assistant', content: res.reply });
      } else {
        this.messages.push({
          sender: 'bot',
          reply: "I am having trouble retrieving that educational data right now. Please try asking again in a moment or explore our Directory directly.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestions: ["Explore School Directory", "Calculate BECE CSSPS aggregate"]
        });
      }
    } catch (err) {
      this.isTyping = false;
      this.messages.push({
        sender: 'bot',
        reply: `⚠️ *An error occurred:* ${err.message}. Please check your connection or retry.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    }

    this.updateMessagesUI();
  },

  updateMessagesUI() {
    const box = document.getElementById('sd-chat-messages-box');
    const suggestionsBar = document.getElementById('sd-chat-suggestions-bar');
    if (!box) return;

    let html = '';
    let latestSuggestions = [];

    this.messages.forEach((msg, idx) => {
      if (msg.sender === 'user') {
        html += `
          <div class="sd-chat-msg user">
            <div class="sd-chat-bubble">
              ${this.escapeHTML(msg.text)}
              <div style="font-size: 0.65rem; color: #94a3b8; text-align: right; margin-top: 0.25rem;">
                ${msg.timestamp}
              </div>
            </div>
          </div>
        `;
      } else {
        // Bot message
        const parsedMarkdown = this.formatMarkdown(msg.reply);
        
        let actionCardsHtml = '';
        if (msg.actionCards && msg.actionCards.length > 0) {
          actionCardsHtml = msg.actionCards.map(c => `
            <div class="sd-chat-action-card">
              <div class="sd-chat-action-card-header">
                <div>
                  <div class="sd-chat-action-title">${this.escapeHTML(c.title)}</div>
                  <div class="sd-chat-action-sub">${this.escapeHTML(c.subtitle)}</div>
                </div>
                ${c.badge ? `<span class="badge badge-verified" style="font-size: 0.65rem;">${this.escapeHTML(c.badge)}</span>` : ''}
              </div>
              <div class="sd-chat-action-meta">${this.escapeHTML(c.meta)}</div>
              <button class="sd-chat-action-btn" onclick="AIChatbot.handleActionCardClick('${c.link}')">
                ${c.actionText || 'View Details'} &rarr;
              </button>
            </div>
          `).join('');
        }

        let quickLinksHtml = '';
        if (msg.quickLinks && msg.quickLinks.length > 0) {
          quickLinksHtml = `
            <div class="sd-chat-quicklinks">
              ${msg.quickLinks.map(l => `
                <button class="sd-chat-link-btn" onclick="AIChatbot.handleQuickLink('${l.view}', '${l.param || ''}')">
                  ${this.escapeHTML(l.label)}
                </button>
              `).join('')}
            </div>
          `;
        }

        html += `
          <div class="sd-chat-msg bot">
            <div class="sd-chat-msg-avatar">👩🏾‍💼</div>
            <div class="sd-chat-bubble">
              ${parsedMarkdown}
              ${actionCardsHtml}
              ${quickLinksHtml}
              <div style="font-size: 0.65rem; color: #94a3b8; margin-top: 0.35rem;">
                Akosua • ${msg.timestamp}
              </div>
            </div>
          </div>
        `;

        if (msg.suggestions && msg.suggestions.length > 0) {
          latestSuggestions = msg.suggestions;
        }
      }
    });

    if (this.isTyping) {
      html += `
        <div class="sd-chat-msg bot">
          <div class="sd-chat-msg-avatar">👩🏾‍💼</div>
          <div class="sd-chat-bubble" style="padding: 0.5rem 0.85rem;">
            <div class="sd-chat-typing">
              <span class="sd-chat-typing-dot"></span>
              <span class="sd-chat-typing-dot"></span>
              <span class="sd-chat-typing-dot"></span>
            </div>
          </div>
        </div>
      `;
    }

    box.innerHTML = html;

    // Populate suggestions
    if (suggestionsBar) {
      if (latestSuggestions.length > 0) {
        suggestionsBar.style.display = 'flex';
        suggestionsBar.innerHTML = latestSuggestions.map(s => `
          <button class="sd-chat-chip" onclick="AIChatbot.handleSuggestionClick('${this.escapeQuotes(s)}')">
            ${this.escapeHTML(s)}
          </button>
        `).join('');
      } else {
        suggestionsBar.style.display = 'none';
      }
    }

    // Scroll to bottom
    setTimeout(() => {
      box.scrollTop = box.scrollHeight;
    }, 50);
  },

  handleSuggestionClick(text) {
    this.handleUserSubmit(text);
  },

  handleQuickLink(view, param) {
    this.close();
    App.navigate(view, param || null);
  },

  handleActionCardClick(link) {
    this.close();
    if (link.startsWith('#/')) {
      window.location.hash = link;
    } else {
      window.location.href = link;
    }
  },

  formatMarkdown(text) {
    if (!text) return '';

    let res = this.escapeHTML(text);

    // Tables
    if (res.includes('|')) {
      res = res.replace(/((?:\|[^\n]+\|\r?\n)+)/g, (tableMatch) => {
        const rows = tableMatch.trim().split('\n').filter(r => r.trim() && !r.includes(':---') && !r.includes('---'));
        if (rows.length < 1) return tableMatch;
        let tableHtml = '<table>';
        rows.forEach((row, idx) => {
          const cells = row.split('|').filter((c, i, arr) => i > 0 && i < arr.length - 1);
          if (idx === 0) {
            tableHtml += '<thead><tr>' + cells.map(c => `<th>${c.trim()}</th>`).join('') + '</tr></thead><tbody>';
          } else {
            tableHtml += '<tr>' + cells.map(c => `<td>${c.trim()}</td>`).join('') + '</tr>';
          }
        });
        tableHtml += '</tbody></table>';
        return tableHtml;
      });
    }

    // Headings
    res = res.replace(/^### (.*$)/gim, '<h4 style="font-size: 0.95rem; font-weight: 700; margin: 0.5rem 0 0.35rem 0; color: #0f172a;">$1</h4>');
    res = res.replace(/^## (.*$)/gim, '<h3 style="font-size: 1rem; font-weight: 700; margin: 0.5rem 0 0.35rem 0; color: #0f172a;">$1</h3>');

    // Bold
    res = res.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Italics
    res = res.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Code blocks / inline code
    res = res.replace(/`([^`]+)`/g, '<code style="background: #f1f5f9; padding: 1px 5px; border-radius: 4px; font-size: 0.8em; color: #0f172a; border: 1px solid #e2e8f0;">$1</code>');

    // Blockquotes
    res = res.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>');

    // Bullet points
    res = res.replace(/^\* (.*$)/gim, '<li>$1</li>');
    res = res.replace(/((?:<li>.*<\/li>\s*)+)/g, '<ul>$1</ul>');

    // Newlines to <br> or paragraphs
    res = res.split('\n\n').map(p => {
      p = p.trim();
      if (p.startsWith('<h4>') || p.startsWith('<h3>') || p.startsWith('<ul>') || p.startsWith('<table>') || p.startsWith('<blockquote>')) {
        return p;
      }
      return `<p>${p.replace(/\n/g, '<br>')}</p>`;
    }).join('');

    return res;
  },

  escapeHTML(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  },

  escapeQuotes(str) {
    if (!str) return '';
    return str.replace(/'/g, "\\'").replace(/"/g, '&quot;');
  }
};

if (typeof window !== 'undefined') {
  window.AIChatbot = AIChatbot;
}

// Auto-initialize when DOM ready
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    AIChatbot.init();
  });
}
