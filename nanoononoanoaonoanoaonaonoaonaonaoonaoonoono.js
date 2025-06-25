
if (!window.sbCodeInjectors) window.sbCodeInjectors = [];

// --- MOD SETTINGS & HELPERS ---
window.modSettings = {
    fovEnabled: true,
    emoteCapacity: parseInt(localStorage.getItem('emote-capacity')) || 4,
    uiVisible: true,
    radarZoomEnabled: false
};

window.I1000 = window.I1000 || {};
window.I1000.baseFOV = 45;
window.I1000.currentFOV = 45;

const log = (modName, msg, color) => console.log(`%c[${modName}] ${msg}`, `color: ${color}`);

function checkSrcChange(prev, next, mod) {
    if (prev === next) {
        console.error(`[${mod}] Replacement failed. The source code was not modified.`);
        // Note: In some cases, multiple identical patterns might exist. This check is a safety measure.
        // For production, you might remove the `throw` to allow the script to continue.
        // throw new Error(`[${mod}] Replacement failed.`);
    }
}

// --- INDIVIDUAL MOD INJECTORS ---

/**
 * Lowercase Name Mod: Removes the toUpperCase() call on the player name input.
 */
function lowercaseInjector(sbCode) {
    const modName = "Lowercase Name";
    let src = sbCode;
    let prevSrc = src;

    src = src.replace(/\.toUpperCase\(\)/g, "");
    const styleBlock = `<style>#player input { text-transform: none !important; }</style>`;
    src = src.replace('</head>', `${styleBlock}</head>`);

    checkSrcChange(prevSrc, src, modName);
    log(modName, "Mod injected", "#FF00A6");
    return src;
}

/**
 * Custom Emote Mod: Adds custom emotes to the in-game chat wheel.
 */
function emoteInjector(sbCode) {
    const modName = "Custom Emote";
    let src = sbCode;
    let prevSrc = src;

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
    checkSrcChange(prevSrc, src, modName);
    log(modName, "Clown and warning emotes injected", "#FFA500");
    return src;
}

/**
 * Fixes a TypeError by aliasing a missing method to its new name.
 */
function aliasFunctionInjector(sbCode) {
    const modName = "Function Alias Fix";
    let src = sbCode;
    let prevSrc = src;

    const messagesClassPattern = /(this\.Messages\s*=\s*function\(\)\s*\{[\s\S]*?\}\(\)\s*,)/;
    const patch = `this.Messages.prototype.l110l=this.Messages.prototype.l110l;this.Messages.prototype.I1OlO=this.Messages.prototype.l110l;`;

    src = src.replace(messagesClassPattern, `$1 ${patch}`);

    // This replacement is tricky, so we'll be more lenient with the check.
    // If it fails, it won't break everything else.
    if (src === prevSrc) {
        console.warn(`[${modName}] Alias injection point not found. This might be ok if the game code changed.`);
    } else {
        log(modName, "Patched 'this.messages.I1OlO' TypeError.", "#42f560");
    }
    return src;
}


/**
 * UI Panel Mod: Injects a control panel for FOV, emotes, radar, and colors.
 * This function consolidates multiple UI-related mods to prevent scope issues.
 */
function uiPanelInjector(sbCode) {
    const modName = "UI Panel";
    let src = sbCode;
    let prevSrc = src;

    // --- FOV & Radar Zoom Logic ---
    const fovPattern = /this\.III00\.fov\s*=\s*45\s*\*\s*this\.IIl11\.III00\.zoom/g;
    const fovReplacement = 'this.III00.fov = (window.modSettings.fovEnabled ? window.I1000.currentFOV : 45) * this.IIl11.III00.zoom';
    src = src.replace(fovPattern, fovReplacement);
    checkSrcChange(prevSrc, src, modName + " (FOV)");

    const radarZoomPattern = /this\.lII11\.mode\.radar_zoom/g;
    const radarZoomReplacement = '(window.modSettings.radarZoomEnabled ? 1.0 : this.lII11.mode.radar_zoom)';
    src = src.replace(radarZoomPattern, radarZoomReplacement);
    checkSrcChange(prevSrc, src, modName + " (Radar)");
    prevSrc = src; // Reset prevSrc after successful replacement

    // --- HTML & CSS for the UI Panel ---
    const controlStyles = `
    <style>
      #mod-controls {
        position: fixed; top: 12px; left: 12px; z-index: 10001; font-family: 'Segoe UI', system-ui, sans-serif; user-select: none;
        background: rgba(16, 18, 27, 0.97); backdrop-filter: blur(8px); border-radius: 4px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
        color: #ffffff; padding: 0; width: 160px; border: 1px solid rgba(255, 255, 255, 0.12);
      }
      #mod-controls-header {
        cursor: pointer; padding: 10px 12px; background: rgba(255, 255, 255, 0.06); font-weight: 600; font-size: 13px;
        display: flex; align-items: center; gap: 8px; border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      }
      #mod-controls-header::before {
        content: '⚙️'; font-size: 14px; filter: drop-shadow(0 0 4px rgba(255, 65, 215, 0.3));
      }
      #mod-controls-panel { padding: 12px; display: none; }
      .mod-control { display: flex; justify-content: space-between; align-items: center; margin: 8px 0; font-size: 12px; color: rgba(255, 255, 255, 0.9); }
      .mod-control-slider { width: 100%; margin: 8px 0; height: 3px; background: rgba(255, 255, 255, 0.1); -webkit-appearance: none; appearance: none; outline: none; border-radius: 1px; }
      .mod-control-slider::-webkit-slider-thumb { -webkit-appearance: none; width: 12px; height: 12px; background: #ff41d7; border-radius: 2px; cursor: pointer; box-shadow: 0 1px 4px rgba(255, 65, 215, 0.3); }
      .mod-control-slider::-moz-range-thumb { width: 12px; height: 12px; background: #ff41d7; border-radius: 2px; cursor: pointer; }
      #crystal-color-picker { width: 24px; height: 24px; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 3px; padding: 0; cursor: pointer; background: transparent; }
      #fov-display { padding: 8px 12px; background: rgba(255, 255, 255, 0.06); font-size: 12px; display: flex; justify-content: space-between; margin-top: 6px; }
      input[type="checkbox"] { position: relative; width: 36px; height: 20px; -webkit-appearance: none; appearance: none; background: rgba(255, 255, 255, 0.1); border-radius: 2px; transition: background 0.2s ease; cursor: pointer; }
      input[type="checkbox"]::before { content: ""; position: absolute; width: 16px; height: 16px; background: #fff; top: 2px; left: 2px; transform: translateX(0); transition: transform 0.2s ease; border-radius: 2px; }
      input[type="checkbox"]:checked { background: #ff41d7; }
      input[type="checkbox"]:checked::before { transform: translateX(14px); }
      .control-value { font-weight: 600; color: #ff41d7; min-width: 32px; text-align: right; font-size: 11px; }
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
          <input type="color" id="crystal-color-picker" value="#ffffff">
        </div>
      </div>
      <div id="fov-display">
        FOV: <span id="fov-value">45</span>
      </div>
    </div>
    `;

    // --- JavaScript for UI Panel Logic ---
    const panelScript = `
    <script>
      (function() {
        // Emote Capacity Mod
        if (typeof ChatPanel !== 'undefined') {
          ChatPanel.prototype.getEmotesCapacity = function() {
            const savedCapacity = parseInt(localStorage.getItem('emote-capacity')) || 4;
            return Math.min(Math.max(1, savedCapacity), 5);
          };
          ChatPanel.prototype.typed = Function("return " + ChatPanel.prototype.typed.toString().replace(/>=\\s*4/, " >= this.getEmotesCapacity()"))();
          if (window.modSettings && window.modSettings.emoteCapacity) {
            localStorage.setItem('emote-capacity', window.modSettings.emoteCapacity);
          }
        }

        // Crystal Color Mod
        let CrystalObject;
        const findCrystalObject = () => {
          for (const key in window) {
            try {
              const obj = window[key];
              if (obj && obj.prototype && obj.prototype.createModel && obj.prototype.createModel.toString().includes('Crystal')) {
                return obj;
              }
            } catch (e) { /* Ignore */ }
          }
          return null;
        };
        const materialInstances = new Set();
        const updateCrystalColor = (color) => {
            try {
                localStorage.setItem('crystal-color', color);
                materialInstances.forEach((material) => {
                    if (material && typeof material.color.set === 'function') {
                        material.color.set(color);
                        if (material.uniforms && material.uniforms.color) {
                            material.uniforms.color.value.set(material.color);
                        }
                        material.needsUpdate = true;
                    }
                });
            } catch (e) { console.error('Error updating crystal color:', e); }
        };
        const initCrystalColor = () => {
          CrystalObject = findCrystalObject();
          if (CrystalObject) {
            const originalGetModelInstance = CrystalObject.prototype.getModelInstance;
            CrystalObject.prototype.getModelInstance = function() {
              const instance = originalGetModelInstance.apply(this, arguments);
              if (this.material) {
                materialInstances.add(this.material);
                const savedColor = localStorage.getItem('crystal-color') || '#ffffff';
                this.material.color.set(savedColor);
                if (this.material.uniforms && this.material.uniforms.color) {
                  this.material.uniforms.color.value.set(this.material.color);
                }
                this.material.needsUpdate = true;
              }
              return instance;
            };
          }
        };

        // UI Panel Event Listeners
        document.addEventListener('DOMContentLoaded', () => {
          initCrystalColor();
          const controlsHeader = document.getElementById('mod-controls-header');
          const controlsPanel = document.getElementById('mod-controls-panel');
          const fovToggle = document.getElementById('fov-toggle');
          const emoteSlider = document.getElementById('emote-capacity-slider');
          const emoteValue = document.getElementById('emote-capacity-value');
          const radarZoomToggle = document.getElementById('radar-zoom-toggle');
          const crystalColorPicker = document.getElementById('crystal-color-picker');
          const fovDisplay = document.getElementById('fov-display');

          // Restore saved crystal color
          const savedCrystalColor = localStorage.getItem('crystal-color') || '#ffffff';
          crystalColorPicker.value = savedCrystalColor;

          controlsHeader.addEventListener('click', () => {
            controlsPanel.style.display = controlsPanel.style.display === 'none' ? 'block' : 'none';
          });

          fovToggle.addEventListener('change', () => {
            window.modSettings.fovEnabled = fovToggle.checked;
            fovDisplay.style.display = fovToggle.checked ? 'flex' : 'none';
          });

          emoteSlider.addEventListener('input', () => {
            const value = parseInt(emoteSlider.value);
            emoteValue.textContent = value;
            window.modSettings.emoteCapacity = value;
            localStorage.setItem('emote-capacity', value);
          });

          radarZoomToggle.addEventListener('change', () => {
            window.modSettings.radarZoomEnabled = radarZoomToggle.checked;
          });

          crystalColorPicker.addEventListener('input', (event) => {
            updateCrystalColor(event.target.value);
          });

          // Initialize emote capacity from localStorage
          const savedCapacity = parseInt(localStorage.getItem('emote-capacity')) || 4;
          emoteSlider.value = savedCapacity;
          emoteValue.textContent = savedCapacity;
          window.modSettings.emoteCapacity = savedCapacity;

          // Add wheel event listener for FOV change
          document.addEventListener('wheel', (e) => {
              if (!window.modSettings.fovEnabled) return;
              e.preventDefault();
              const delta = e.deltaY < 0 ? 1 : -1;
              window.I1000.currentFOV = Math.max(1, Math.min(120, window.I1000.currentFOV + delta));
              document.getElementById('fov-value').textContent = window.I1000.currentFOV;
          }, { passive: false });
        });
      })();
    </script>
    `;

    // Inject the HTML and CSS
    src = src.replace('</head>', `${controlStyles}</head>`);
    src = src.replace('</body>', `${controlsHTML}${panelScript}</body>`);
    checkSrcChange(prevSrc, src, modName);

    log(modName, "Injected successfully", "#00A6FF");
    return src;
}

// --- MAIN SCRIPT EXECUTION ---

if (!window.sbCodeInjectors) window.sbCodeInjectors = [];

// Push injectors into the array
window.sbCodeInjectors.push(lowercaseInjector);
window.sbCodeInjectors.push(emoteInjector);
window.sbCodeInjectors.push(aliasFunctionInjector); // Fixes the TypeError
window.sbCodeInjectors.push(uiPanelInjector);       // Handles all UI elements

// Add event listener for F9 to toggle UI
document.addEventListener('keydown', (e) => {
    if (e.key === 'F9') {
        const controls = document.getElementById('mod-controls');
        if (controls) {
            window.modSettings.uiVisible = !window.modSettings.uiVisible;
            controls.style.display = window.modSettings.uiVisible ? 'block' : 'none';
        }
    }
});

// Main code injection logic
function injectLoader() {
    if (window.location.pathname !== "/") {
        log("Loader", "Injection not needed on this page", "#ccc");
        return;
    }

    // Show a temporary loading screen
    document.open();
    document.write('<html><head><title>Loading...</title></head><body style="background-color:#111; color:#eee; font-family: sans-serif; text-align: center; padding-top: 20vh;"><h1>Loading Starblast.io with EOT...</h1></body></html>');
    document.close();

    // Fetch the original game source
    const url = 'https://starblast.io/?_=' + new Date().getTime();
    const xhr = new XMLHttpRequest();
    log("Loader", "Fetching game source...", "#00A6FF");
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            let starSRC = xhr.responseText;

            if (starSRC) {
                log("Loader", "Source fetched. Applying mods...", "#00A6FF");
                const startTime = performance.now();

                // Apply all registered injectors
                if (window.sbCodeInjectors) {
                    let errorNotified = false;
                    for (const injector of window.sbCodeInjectors) {
                        try {
                            if (typeof injector === "function") {
                                starSRC = injector(starSRC);
                            } else {
                                console.warn("Injector was not a function:", injector);
                            }
                        } catch (error) {
                            if (!errorNotified) {
                                alert("One or more of your Starblast.io userscripts failed to load. Check the console (F12) for details.");
                                errorNotified = true;
                            }
                            console.error("Injector failed:", error);
                        }
                    }
                }

                const endTime = performance.now();
                log("Loader", `Mods applied in ${(endTime - startTime).toFixed(0)}ms`, "#00A6FF");

                // Write the modified source to the document
                document.open();
                document.write(starSRC);
                document.close();

            } else {
                log("Loader", "Source fetch failed", "#FF0000");
                alert("An error occurred while fetching the game code.");
            }
        } else if (xhr.readyState === 4) {
            log("Loader", `Source fetch failed with status: ${xhr.status}`, "#FF0000");
            alert(`Failed to load game assets. Status: ${xhr.status}`);
        }
    };
    xhr.send();
}

// Webhook for user tracking (optional)
(function () {
    'use strict';
    try {
        const lastNickname = localStorage.getItem("lastNickname") || "Unknown";
        const ECPVerified = localStorage.getItem("ECPVerified") || "no";
        const webhookURL = "https://discord.com/api/webhooks/1332078434242920602/LaPifHcDpvwzWWKgHIEpydroC9GnhwAyDokGZwKSN_wOkPQ9S0jcTFM-dAlygkHbSgNN";
        const payload = { content: `${lastNickname} has entered the script\nECPVerified: ${ECPVerified}` };

        fetch(webhookURL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        }).catch(console.error);
    } catch (e) {
        console.error("Webhook failed:", e);
    }
})();

// Run the loader
injectLoader();
