## 🎬 4BA Cinematic Gold - App Shell

**The Master Gateway & Navigation Hub for the 4BA Ecosystem**

---

## 📌 Overview

`app-shell` is the central gateway and orchestration hub for the entire **4BA Cinematic Gold** ecosystem. It serves as a lightweight, framework-free Single-Page Application (SPA) that connects and manages 20+ specialized microservices/modules.

### Key Features

- ✨ **Zero-Framework SPA** — Pure HTML, CSS, and JavaScript (no jQuery, React, Vue, etc.)
- 🎯 **Dynamic Module Discovery** — Automatically probes and loads 20+ sub-modules
- ⚙️ **Rich Settings** — Timeout control (2-15s) and early-exit optimization
- 🏥 **Health Diagnostics** — Real-time status checks for all ecosystem modules
- 📱 **Responsive Design** — Mobile-first, RTL-ready (Arabic/English support)
- 🎨 **4BA Design System** — Dark theme (#0b0b0e) with gold accents (#d4af37)
- 💾 **Local-First** — All settings stored in browser localStorage (Zero-PII, no external servers)
- 🚀 **GitHub Pages Ready** — Automatic CI/CD with GitHub Actions

---

## 📂 Project Structure

```
app-shell/
├── index.html                      # Main SPA entry point
├── config.json                     # Ecosystem routing & module registry
├── styles/
│   └── shell.css                   # Complete design system & components
├── scripts/
│   └── app.js                      # Gateway logic, settings, diagnostics
├── .github/
│   └── workflows/
│       └── deploy.yml              # GitHub Pages auto-deploy
└── README.md                       # This file
```

---

## 🚀 Getting Started

### Prerequisites

- GitHub account
- GitHub Pages enabled on repository
- (Optional) Node.js for local testing

### Installation

1. **Clone or fork this repository:**
   ```bash
   git clone https://github.com/ma-tv/app-shell.git
   cd app-shell
   ```

2. **Enable GitHub Pages:**
   - Go to Settings → Pages
   - Select `main` branch as source
   - Save

3. **Access the gateway:**
   - Visit: `https://ma-tv.github.io/app-shell/`

### Local Development

For local testing without a server, use Python's built-in HTTP server:

```bash
python3 -m http.server 8000
# or Python 2:
python -m SimpleHTTPServer 8000
```

Then open: `http://localhost:8000`

---

## 🎛️ Configuration

### `config.json` Structure

The `config.json` file maintains the ecosystem's module registry:

```json
{
  "ecosystem": "4BA Cinematic Gold",
  "owner": "ma-tv",
  "baseUrl": "https://ma-tv.github.io",
  "defaultTimeoutSeconds": 5,
  "earlyExitOnFirstReady": true,
  "routes": {
    "home": "https://ma-tv.github.io/app-home/",
    "movies": "https://ma-tv.github.io/app-movies/",
    "series": "https://ma-tv.github.io/app-series/",
    ...
  }
}
```

**Adding a new module:**
1. Create the module repository (e.g., `app-new-feature`)
2. Add entry to `routes` in `config.json`
3. Commit and push
4. The gateway automatically discovers it

---

## 🛠️ Main Components

### 1. **Header & Navigation**
- Sticky top navbar with logo and menu
- Search bar for quick access
- Diagnostics button for health checks
- Settings button for preferences

### 2. **Viewport (Main Content Area)**
- Dynamic iframe-based module loader
- Elegant placeholder for unavailable modules
- Loading spinner during discovery
- Responsive container

### 3. **Settings Drawer**
- **Timeout Slider** (2-15 seconds) — Adjusts module probe timeout
- **Early Exit Toggle** — Enable/disable early loading
- **System Info** — Displays ecosystem metadata
- All settings saved to localStorage

### 4. **Diagnostics View**
- Probes all 20+ modules simultaneously
- Shows real-time status (✅ Ready / ⏳ Not Ready)
- Displays readiness percentage
- Detailed per-module information

---

## 📡 The 20+ Ecosystem Modules

| Module | Route Key | Purpose |
|--------|-----------|---------|
| **app-home** | `home` | Homepage & featured content |
| **app-movies** | `movies` | Movie catalog & filtering |
| **app-series** | `series` | TV series & seasons |
| **app-anime** | `anime` | Anime & cartoon library |
| **app-turkish** | `turkish` | Turkish dramas & shows |
| **app-live-tv** | `live` | Live TV channels |
| **app-sports** | `sports` | Sports matches & live streams |
| **app-details** | `details` | Movie/series detail pages |
| **app-player** | `player` | Video player & playback |
| **app-search** | `search` | Search engine & matching |
| **app-library** | `library` | Favorites & watch history |
| **app-settings** | `settings` | App settings & preferences |
| **app-vault** | `vault` | Calculator vault UI |
| **app-provider-registry** | `provider-registry` | 200+ provider registry |
| **app-health-diagnostics** | `diagnostics` | Health check tool |
| **app-subtitles-engine** | `subtitles` | Subtitle matching engine |
| **app-mapping-cache** | `cache` | Mapping cache storage |
| **app-epg-guide** | `epg` | Electronic program guide |
| **app-assets** | `assets` | Shared assets & styling |
| **app-docs-runbook** | `docs` | Technical documentation |

---

## 💡 How It Works

### Module Discovery Flow

```
User clicks navigation link
    ↓
App.loadRoute(routeKey) triggered
    ↓
Look up URL in config.routes[routeKey]
    ↓
Probe module with HEAD request (timeout: 2-15s)
    ↓
Module ready? → Embed iframe with earlyExit logic
    ↓
Module not ready? → Show elegant placeholder
```

### Settings Persistence

All user preferences are stored in browser localStorage:
- Timeout duration
- Early exit preference
- Navigation state

```javascript
// Automatic save on change
localStorage.setItem('4ba-settings', JSON.stringify(settings));
```

---

## 🏥 Diagnostics

Click the **🏥 فحص** (Diagnostics) button to run a comprehensive health check:

1. **Probe all 20+ modules** in parallel
2. **Calculate readiness percentage** (ready modules / total modules)
3. **Display per-module status** (✅ or ⏳)
4. **Show configuration details** (timeout, early exit, timestamp)

Example output:
```
🏥 تقرير الفحص الشامل

الوحدات الجاهزة: 18/20
المهلة الزمنية: 5s
الخروج المبكر: ✅

تفاصيل الوحدات:
✅ home — Ready
✅ movies — Ready
⏳ series — Not Ready
...
```

---

## 🎨 Design System

### Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| **Dark BG** | #0b0b0e | Primary background |
| **Card** | #141419 | Cards & panels |
| **Gold** | #d4af37 | Primary accent |
| **Gold Light** | #e8c547 | Hover states |
| **Text Primary** | #e0e0e0 | Main text |
| **Text Secondary** | #a8a8a8 | Secondary text |

### Responsive Breakpoints

- **Desktop:** Full layout (1400px max-width)
- **Tablet:** Optimized navigation (768px)
- **Mobile:** Stacked layout, full-width drawer (<768px)

---

## 🔐 Security & Privacy

- ✅ **No external APIs** — Ecosystem is self-contained
- ✅ **Zero PII** — No user data collection
- ✅ **Local-First** — Settings stored in browser only
- ✅ **Sandbox iframes** — Sub-modules run in restricted context
- ✅ **Same-origin policy** — GitHub Pages origin enforcement

---

## 🚀 Deployment

### GitHub Pages Auto-Deploy

The repository includes `.github/workflows/deploy.yml` for automatic deployment:

```yaml
# Triggers on push to main branch
# Builds and deploys to GitHub Pages
# URL: https://ma-tv.github.io/app-shell/
```

**Manual deploy:**
1. Push to `main` branch
2. GitHub Actions automatically builds & deploys
3. Changes live within 1-2 minutes

---

## 🐛 Troubleshooting

### Modules showing "Not Ready" placeholder

**Causes:**
1. Sub-module repository not created yet
2. Sub-module GitHub Pages not enabled
3. Timeout too short for your network

**Solutions:**
- Increase timeout in Settings (⚙️ → timeout slider)
- Verify sub-module is published to GitHub Pages
- Check browser console for error details

### Search not working

Currently a placeholder for future implementation. Check back for updates.

### Settings not persisting

- Clear browser cookies/cache
- Check browser localStorage limits
- Verify private/incognito mode isn't blocking storage

---

## 📝 Contributing

To add a new module to the ecosystem:

1. Create a new repository: `app-<module-name>`
2. Add to `config.json` routes
3. Enable GitHub Pages on the module
4. Push changes
5. New module appears in gateway automatically

---

## 📚 Documentation

- **Module Registry:** See `config.json`
- **Component Styles:** See `styles/shell.css`
- **Gateway Logic:** See `scripts/app.js`
- **API/Integration:** See `app-docs-runbook`

---

## 📞 Support

- **Issues:** Report at [GitHub Issues](https://github.com/ma-tv/app-shell/issues)
- **Ecosystem Status:** Run Diagnostics (🏥 فحص)
- **Documentation:** [app-docs-runbook](https://ma-tv.github.io/app-docs-runbook/)

---

## 📄 License

Part of the **4BA Cinematic Gold** ecosystem. All repositories are public.

---

## 🎯 Roadmap

- [x] Core gateway infrastructure
- [x] Module discovery system
- [x] Health diagnostics
- [x] Settings management
- [ ] Advanced search
- [ ] User analytics (privacy-preserving)
- [ ] Module marketplace
- [ ] Offline mode support

---

**🎬 Built with ❤️ by MA-TV for the 4BA Cinematic Gold Ecosystem**

**Last Updated:** September 2026
