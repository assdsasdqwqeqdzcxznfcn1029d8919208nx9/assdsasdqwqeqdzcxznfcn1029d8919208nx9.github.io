if (!window.sbCodeInjectors) window.sbCodeInjectors = [];

// Global settings object
window.modSettings = {
  fovEnabled: localStorage.getItem('fov-enabled') === 'true',
  emoteCapacity: parseInt(localStorage.getItem('emote-capacity')) || 4,
  showBlankECP: localStorage.getItem('show-blank-ecp') === 'true'
};

const modName = "Lowercase Name";
const logLowercase = (msg) => console.log(`%c[${modName}] ${msg}`, "color: #FF00A6");

function lowercaseInjector(sbCode) {
  let src = sbCode;
  let prevSrc = src;

  src = src.replace(/\.toUpperCase\(\)/g, "");
  const styleBlock = `
  <style>
    #player input { text-transform: none !important; }
  </style>
  `;
  src = src.replace('</head>', `${styleBlock}</head>`);
  if (src === prevSrc) throw new Error("LowercaseInjector: replace did not work");
  logLowercase("Mod injected");
  return src;
}

const emoteModName = "Custom Emote";
const logEmote = (msg) => console.log(`%c[${emoteModName}] ${msg}`, "color: #FFA500");

function emoteInjector(sbCode) {
  let src = sbCode;
  let prevSrc = src;

  const vocabPattern = /(this\.vocabulary\s*=\s*\[[\s\S]*?\})/;
  const clownEmote = `,{
    text: "orosbu cocu",
    icon: "🤡",
    key: "J"
  }`;

  src = src.replace(vocabPattern, `$1${clownEmote}`);
  if (src === prevSrc) throw new Error("EmoteInjector: replace did not work");
  logEmote("Clown emote injected");
  return src;
}

const fovModName = "FOV Editor";
const logFOV = (msg) => console.log(`%c[${fovModName}] ${msg}`, "color: #00A6FF");

window.I1000 = window.I1000 || {};
window.I1000.baseFOV = 45;
window.I1000.currentFOV = 45;

const controlStyles = `
<style>
#mod-controls {
    position: fixed;
    top: 10px;
    left: 10px;
    z-index: 1000;
    font-family: Arial, sans-serif;
    user-select: none;
    background: linear-gradient(45deg, #8B008B, #FF1493);
    border: 1px solid #FF1493;
    color: white;
    padding: 5px;
    border-radius: 8px;
    opacity: 0.9;
    width: 180px;
}

#mod-controls-header {
    cursor: pointer;
    text-align: center;
    padding: 5px;
    border-bottom: 1px solid #FF1493;
}

#mod-controls-panel {
    padding: 5px;
    display: none;
}

.mod-control {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 5px 0;
}

#fov-display {
    padding: 5px;
    margin-top: 5px;
    display: none;
}

.toggle-switch {
    position: relative;
    display: inline-block;
    width: 30px;
    height: 17px;
}

.toggle-switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: .4s;
    border-radius: 17px;
}

input:checked + .slider {
    background-color: #FF1493;
}
</style>
`;

const controlsHTML = `
<div id="mod-controls">
    <div id="mod-controls-header">Game Controls</div>
    <div id="mod-controls-panel">
        <div class="mod-control">
            <span>FOV</span>
            <label class="toggle-switch">
                <input type="checkbox" id="fov-toggle">
                <span class="slider"></span>
            </label>
        </div>
        <div class="mod-control">
            <span>Blank ECP</span>
            <label class="toggle-switch">
                <input type="checkbox" id="blank-ecp-toggle">
                <span class="slider"></span>
            </label>
        </div>
    </div>
    <div id="fov-display">
        FOV: <span id="fov-value">45</span>
    </div>
</div>
`;

function initializeFOVControls() {
  if (document.getElementById('mod-controls')) return;

  document.head.insertAdjacentHTML('beforeend', controlStyles);
  document.body.insertAdjacentHTML('beforeend', controlsHTML);

  const controlsPanel = document.getElementById('mod-controls-panel');
  const controlsHeader = document.getElementById('mod-controls-header');
  const fovToggle = document.getElementById('fov-toggle');
  const fovDisplay = document.getElementById('fov-display');
  const fovValue = document.getElementById('fov-value');
  const blankECPToggle = document.getElementById('blank-ecp-toggle');

  // Initialize states from localStorage or defaults
  fovToggle.checked = window.modSettings.fovEnabled;
  fovDisplay.style.display = window.modSettings.fovEnabled ? 'block' : 'none';
  blankECPToggle.checked = window.modSettings.showBlankECP;

  controlsHeader.addEventListener('click', () => {
    controlsPanel.style.display = controlsPanel.style.display === 'none' ? 'block' : 'none';
  });

  fovToggle.addEventListener('change', e => {
    window.modSettings.fovEnabled = e.target.checked;
    localStorage.setItem('fov-enabled', e.target.checked);
    fovDisplay.style.display = e.target.checked ? 'block' : 'none';
  });

  blankECPToggle.addEventListener('change', e => {
    window.modSettings.showBlankECP = e.target.checked;
    localStorage.setItem('show-blank-ecp', e.target.checked);
    if (window.module?.exports?.settings?.set) {
      window.module.exports.settings.set('show_blank_badge', e.target.checked);
    }
  });

  document.addEventListener('wheel', (e) => {
    if (!window.modSettings.fovEnabled) return;
    e.preventDefault();
    const delta = e.deltaY < 0 ? 1 : -1;
    window.I1000.currentFOV = Math.min(120, Math.max(30, window.I1000.currentFOV + delta));
    fovValue.textContent = window.I1000.currentFOV;
  }, { passive: false });

  logFOV("FOV controls initialized");
}

function fovInjector(sbCode) {
  let src = sbCode;
  let prevSrc = src;

  const fovPattern = /this\.I1000\.fov\s*=\s*45\s*\*\s*this\.IO11l\.I1000\.zoom/g;
  src = src.replace(fovPattern, 'this.I1000.fov = (window.modSettings.fovEnabled ? window.I1000.currentFOV : 45) * this.IO11l.I1000.zoom');
  if (src === prevSrc) throw new Error("FOVInjector: replace did not work");

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeFOVControls);
  } else {
    initializeFOVControls();
  }

  logFOV("FOV injector applied");
  return src;
}

// Add all injectors in sequence
window.sbCodeInjectors.push(sbCode => {
  let src = sbCode;
  try {
    src = lowercaseInjector(src);
    src = emoteInjector(src);
    src = fovInjector(src);
    return src;
  } catch (error) {
    console.error("Injector error:", error);
    throw error;
  }
});

// Settings polyfill to avoid errors
if (!window.module) window.module = {};
if (!window.module.exports) window.module.exports = {};
if (!window.module.exports.settings) {
  window.module.exports.settings = {
    set(key, value) {
      this[key] = value;
    },
    check(key) {
      return this[key];
    }
  };
}

// Loader function to fetch source and inject mods
function injectLoader() {
  if (window.location.pathname !== "/") {
    console.log("Injection not needed");
    return;
  }

  const url = `https://assdsasdqwqeqdzcxznfcn1029d8919208nx9.github.io/OLUMUksmdmksladmkakmsak10911oms1ks1mklmkls11921ms1sımn1sösm2k1.html?_=${Date.now()}`;

  fetch(url)
    .then(res => res.text())
    .then(src => {
      if (!src) throw new Error("Empty source");

      console.log("Source fetched, applying mods...");
      let modified = src;

      for (const injector of window.sbCodeInjectors) {
        if (typeof injector === 'function') {
          modified = injector(modified);
        }
      }

      console.log("Mods applied, injecting script...");
      const script = document.createElement('script');
      script.textContent = modified;
      document.body.appendChild(script);
    })
    .catch(e => {
      console.error("Failed to load game code:", e);
      alert("Failed to load game code");
    });
}

injectLoader();
