// 4BA Cinematic Gold - App Shell Gateway
class AppShell {
  constructor() {
    this.config = null;
    this.currentRoute = 'home';
    this.settings = {
      timeoutSeconds: 5,
      earlyExit: true
    };
    this.loadSettings();
    this.init();
  }

  async init() {
    console.log('🚀 Initializing 4BA Cinematic Gold App Shell...');
    await this.loadConfig();
    this.setupEventListeners();
    this.renderNavigation();
    this.loadRoute(this.currentRoute);
  }

  async loadConfig() {
    try {
      const response = await fetch('./config.json');
      this.config = await response.json();
      console.log('✅ Config loaded:', this.config);
    } catch (error) {
      console.error('❌ Failed to load config:', error);
      this.showError('Failed to load ecosystem configuration');
    }
  }

  loadSettings() {
    const stored = localStorage.getItem('4ba-settings');
    if (stored) {
      this.settings = { ...this.settings, ...JSON.parse(stored) };
    }
  }

  saveSettings() {
    localStorage.setItem('4ba-settings', JSON.stringify(this.settings));
  }

  setupEventListeners() {
    // Settings button
    document.getElementById('settings-btn').addEventListener('click', () => {
      this.toggleSettings();
    });

    // Close settings
    document.getElementById('close-settings').addEventListener('click', () => {
      this.toggleSettings();
    });

    // Diagnostics button
    document.getElementById('diagnostics-btn').addEventListener('click', () => {
      this.runDiagnostics();
    });

    // Settings sliders and toggles
    document.getElementById('timeout-slider').addEventListener('input', (e) => {
      this.settings.timeoutSeconds = parseInt(e.target.value);
      document.getElementById('timeout-value').textContent = e.target.value;
      this.saveSettings();
    });

    document.getElementById('early-exit-toggle').addEventListener('change', (e) => {
      this.settings.earlyExit = e.target.checked;
      this.saveSettings();
    });

    // Search
    document.getElementById('search-input').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.performSearch(e.target.value);
      }
    });

    // Close drawer on overlay click
    document.getElementById('settings-overlay').addEventListener('click', () => {
      this.toggleSettings();
    });
  }

  renderNavigation() {
    if (!this.config) return;

    const navMenu = document.querySelector('.nav-menu');
    navMenu.innerHTML = '';

    const navItems = [
      { key: 'home', label: '🏠 الرئيسية' },
      { key: 'movies', label: '🎬 أفلام' },
      { key: 'series', label: '📺 مسلسلات' },
      { key: 'anime', label: '🎨 أنيمي' },
      { key: 'turkish', label: '🇹🇷 تركي' },
      { key: 'live', label: '🔴 مباشر' },
      { key: 'sports', label: '⚽ رياضة' },
      { key: 'library', label: '📚 مكتبة' },
      { key: 'settings', label: '⚙️ إعدادات' }
    ];

    navItems.forEach(item => {
      const li = document.createElement('li');
      li.className = 'nav-item';
      const a = document.createElement('a');
      a.className = 'nav-link';
      a.textContent = item.label;
      a.onclick = (e) => {
        e.preventDefault();
        this.loadRoute(item.key);
      };
      li.appendChild(a);
      navMenu.appendChild(li);
    });
  }

  loadRoute(routeKey) {
    if (!this.config) return;

    this.currentRoute = routeKey;

    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
    });
    event?.target?.classList.add('active');

    const viewport = document.getElementById('viewport');

    if (routeKey === 'diagnostics' || document.querySelector(`[data-route="${routeKey}"]`)?.classList.contains('diagnostics')) {
      this.runDiagnostics();
      return;
    }

    const url = this.config.routes[routeKey];
    if (!url) {
      this.showPlaceholder(routeKey);
      return;
    }

    viewport.innerHTML = '<div class="loading-spinner"></div>';
    this.probeRoute(url, routeKey);
  }

  probeRoute(url, routeKey) {
    const viewport = document.getElementById('viewport');
    const timeout = this.settings.timeoutSeconds * 1000;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    fetch(url, { 
      method: 'HEAD',
      signal: controller.signal,
      mode: 'no-cors'
    })
      .then(response => {
        clearTimeout(timeoutId);
        if (this.settings.earlyExit) {
          this.embedRoute(url, viewport);
        } else {
          this.checkFullContent(url, viewport);
        }
      })
      .catch(error => {
        clearTimeout(timeoutId);
        console.warn(`⚠️ Route not ready: ${routeKey}`, error.message);
        this.showPlaceholder(routeKey);
      });
  }

  embedRoute(url, viewport) {
    viewport.innerHTML = `<iframe src="${url}" style="width: 100%; height: 100%; border: none; border-radius: 4px;" sandbox="allow-same-origin allow-scripts allow-forms allow-popups"></iframe>`;
  }

  checkFullContent(url, viewport) {
    fetch(url)
      .then(response => response.text())
      .then(html => {
        if (html && html.length > 100) {
          this.embedRoute(url, viewport);
        } else {
          throw new Error('Insufficient content');
        }
      })
      .catch(() => this.showPlaceholder(this.currentRoute));
  }

  showPlaceholder(routeKey) {
    const viewport = document.getElementById('viewport');
    const labels = {
      home: { emoji: '🏠', name: 'الرئيسية', desc: 'الصفحة الرئيسية والمحتوى الشائع' },
      movies: { emoji: '🎬', name: 'الأفلام', desc: 'مجموعة الأفلام والتصنيفات' },
      series: { emoji: '📺', name: 'المسلسلات', desc: 'المسلسلات والمواسم' },
      anime: { emoji: '🎨', name: 'الأنيمي', desc: 'الأنيمي والرسوميات' },
      turkish: { emoji: '🇹🇷', name: 'الدراما التركية', desc: 'المسلسلات والدراما التركية' },
      live: { emoji: '🔴', name: 'البث المباشر', desc: 'القنوات التلفزيونية المباشرة' },
      sports: { emoji: '⚽', name: 'الرياضة', desc: 'المباريات والبث الرياضي' },
      details: { emoji: '📖', name: 'التفاصيل', desc: 'صفحة تفاصيل الفيلم والمسلسل' },
      player: { emoji: '▶️', name: 'المشغل', desc: 'مشغل الفيديو والسيرفرات' },
      search: { emoji: '🔍', name: 'البحث', desc: 'محرك البحث والمطابقة' },
      library: { emoji: '📚', name: 'المكتبة', desc: 'المفضلة وسجل المشاهدة' },
      settings: { emoji: '⚙️', name: 'الإعدادات', desc: 'إعدادات التطبيق والتفضيلات' },
      vault: { emoji: '🔐', name: 'الخزنة', desc: 'حاسبة الخزنة' },
      diagnostics: { emoji: '🏥', name: 'الفحص الشامل', desc: 'أداة الفحص واختبار المزودات' }
    };

    const info = labels[routeKey] || { emoji: '📦', name: routeKey, desc: 'الوحدة قريبة قادمة' };

    viewport.innerHTML = `
      <div class="placeholder">
        <div class="placeholder-icon">${info.emoji}</div>
        <h2>${info.name}</h2>
        <p>${info.desc}</p>
        <p style="color: var(--text-secondary); font-size: 0.9rem; margin-top: 1rem;">
          ⏳ هذه الوحدة تحت الإنشاء ولم يتم نشرها بعد.
        </p>
      </div>
    `;
  }

  runDiagnostics() {
    const viewport = document.getElementById('viewport');
    viewport.innerHTML = '<div class="loading-spinner"></div>';

    const diagnostics = {
      timestamp: new Date().toISOString(),
      timeoutSetting: this.settings.timeoutSeconds,
      earlyExitSetting: this.settings.earlyExit,
      results: {}
    };

    if (!this.config) {
      this.showPlaceholder('diagnostics');
      return;
    }

    let completed = 0;
    const total = Object.keys(this.config.routes).length;

    Object.entries(this.config.routes).forEach(([key, url]) => {
      const timeout = this.settings.timeoutSeconds * 1000;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      fetch(url, { 
        method: 'HEAD',
        signal: controller.signal,
        mode: 'no-cors'
      })
        .then(() => {
          diagnostics.results[key] = { status: '✅ Ready', url };
        })
        .catch(error => {
          diagnostics.results[key] = { status: '⏳ Not Ready', url, error: error.message };
        })
        .finally(() => {
          clearTimeout(timeoutId);
          completed++;
          if (completed === total) {
            this.displayDiagnostics(diagnostics);
          }
        });
    });
  }

  displayDiagnostics(diagnostics) {
    const viewport = document.getElementById('viewport');
    const ready = Object.values(diagnostics.results).filter(r => r.status.includes('✅')).length;
    const total = Object.keys(diagnostics.results).length;

    let html = `
      <div style="background: var(--bg-dark); padding: 2rem; border-radius: 8px;">
        <h2 style="color: var(--accent-gold); margin-bottom: 1rem;">🏥 تقرير الفحص الشامل</h2>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 2rem;">
          <div style="background: var(--bg-card); padding: 1rem; border-radius: 4px; border-left: 3px solid var(--accent-gold);">
            <div style="color: var(--text-secondary); font-size: 0.85rem;">الوحدات الجاهزة</div>
            <div style="font-size: 2rem; font-weight: 800; color: var(--accent-gold);">${ready}/${total}</div>
          </div>
          <div style="background: var(--bg-card); padding: 1rem; border-radius: 4px; border-left: 3px solid #666;">
            <div style="color: var(--text-secondary); font-size: 0.85rem;">المهلة الزمنية</div>
            <div style="font-size: 2rem; font-weight: 800; color: var(--text-primary);">${diagnostics.timeoutSetting}s</div>
          </div>
          <div style="background: var(--bg-card); padding: 1rem; border-radius: 4px; border-left: 3px solid #666;">
            <div style="color: var(--text-secondary); font-size: 0.85rem;">الخروج المبكر</div>
            <div style="font-size: 1.5rem;">${diagnostics.earlyExitSetting ? '✅' : '❌'}</div>
          </div>
        </div>
        <div>
          <h3 style="color: var(--accent-gold); margin-bottom: 1rem;">تفاصيل الوحدات:</h3>
          <div style="display: grid; gap: 0.75rem;">
    `;

    Object.entries(diagnostics.results).forEach(([key, result]) => {
      html += `
        <div style="background: var(--bg-card); padding: 1rem; border-radius: 4px; border-left: 3px solid ${result.status.includes('✅') ? 'var(--accent-gold)' : '#666'};">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-weight: 600;">${key}</span>
            <span style="color: ${result.status.includes('✅') ? 'var(--accent-gold)' : '#888'};">${result.status}</span>
          </div>
          <div style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.25rem;">${result.url}</div>
        </div>
      `;
    });

    html += `
          </div>
        </div>
        <div style="margin-top: 2rem; font-size: 0.85rem; color: var(--text-secondary);">
          الوقت: ${new Date(diagnostics.timestamp).toLocaleString()}
        </div>
      </div>
    `;

    viewport.innerHTML = html;
  }

  toggleSettings() {
    const drawer = document.getElementById('settings-drawer');
    const overlay = document.getElementById('settings-overlay');
    drawer.classList.toggle('open');
    overlay.classList.toggle('open');
  }

  performSearch(query) {
    console.log('🔍 Searching for:', query);
    // TODO: Implement search functionality
  }

  showError(message) {
    const viewport = document.getElementById('viewport');
    viewport.innerHTML = `
      <div class="placeholder">
        <div class="placeholder-icon">⚠️</div>
        <h2>خطأ</h2>
        <p>${message}</p>
      </div>
    `;
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.appShell = new AppShell();
});
