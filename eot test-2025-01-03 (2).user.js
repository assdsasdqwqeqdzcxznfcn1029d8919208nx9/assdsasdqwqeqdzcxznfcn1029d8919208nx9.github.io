if (!window.sbCodeInjectors) window.sbCodeInjectors = [];

// Global settings object
window.modSettings = {
  fovEnabled: true,
  emoteCapacity: localStorage.getItem('emote-capacity') || 4,
  showBlankECP: localStorage.getItem('show-blank-ecp') === 'true'
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
  const clownEmote = `,{
    text: "orosbu cocu",
    icon: "🤡",
    key: "J"
  }`;

  src = src.replace(vocabPattern, `$1${clownEmote}`);
  checkSrcChange();

  logEmote("Clown emote injected");
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
    if (src === prevSrc) throw new Error("replace did not work");
    prevSrc = src;
  }

  const fovPattern = /this\.I1000\.fov\s*=\s*45\s*\*\s*this\.IO11l\.I1000\.zoom/g;
  src = src.replace(fovPattern, 'this.I1000.fov = (window.modSettings.fovEnabled ? window.I1000.currentFOV : 45) * this.IO11l.I1000.zoom');
  checkSrcChange();

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
    width: 150px;
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

  .mod-control-slider {
    width: 100%;
    margin-top: 5px;
  }

  #crystal-color-picker {
    width: 100%;
    margin-top: 5px;
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
  }

  input:checked + .slider {
    background-color: #FF1493;
  }

  .control-value {
    font-size: 12px;
    text-align: right;
    min-width: 30px;
  }
  </style>
  `;

  const controlsHTML = `
  <div id="mod-controls">
    <div id="mod-controls-header">Controls</div>
    <div id="mod-controls-panel">
      <div class="mod-control">
        <span>FOV</span>
        <label class="toggle-switch">
          <input type="checkbox" id="fov-toggle" checked>
          <span class="slider"></span>
        </label>
      </div>
      <div class="mod-control">
        <span>Emote Capacity</span>
        <div class="control-value" id="emote-capacity-value">${window.modSettings.emoteCapacity}</div>
      </div>
      <input type="range" min="1" max="5" value="${window.modSettings.emoteCapacity}" class="mod-control-slider" id="emote-capacity-slider">
      <div class="mod-control">
        <span>Show Blank ECPs</span>
        <label class="toggle-switch">
          <input type="checkbox" id="blank-ecp-toggle" ${window.modSettings.showBlankECP ? 'checked' : ''}>
          <span class="slider"></span>
        </label>
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

  // Add emote capacity mod
  const emoteCapacityMod = `
  let globalVal = ChatPanel.toString().match(/[0OlI1]{5}/)[0];
  ChatPanel.prototype.getEmotesCapacity = function () {
    let num = this[globalVal].settings.get("chat_emotes_capacity");
    try { return (num == null || isNaN(num)) ? 4 : (Math.trunc(Math.min(Math.max(1, num), 5)) || 4) }
    catch (e) { return 4 }
  };
  ChatPanel.prototype.typed = Function("return " + ChatPanel.prototype.typed.toString().replace(/>=\\s*4/, " >= this.getEmotesCapacity()"))();
  `;

  // Add blank ECP mod
  const blankECPMod = `
  /*
  Show blank ECPs on leaderboard
  */

  // The pattern to match the "blank" badge check in the function string
  let pattern = /,(\s*"blank"\s*!={1,2}\s*this\\.custom\\.badge)/;

  Search: for (let i in window) {
    try {
      let val = window[i]?.prototype;
      if (!val) continue;
      for (let j in val) {
        let func = val[j];

        // Check if the function string matches the pattern
        if (typeof func === "function" && func.toString().match(pattern)) {

          // Replace the function with the modified version
          val[j] = Function("return " + func.toString().replace(pattern, ", window.module.exports.settings.check('show_blank_badge') || $1"))();
          found = true;

          // Modify the drawIcon function to respect the "blank" badge setting
          val.drawIcon = Function("return " + val.drawIcon.toString().replace(/}\\s*else\\s*{/, '} else if (this.icon !== "blank") {'))();

          // Find and modify the function that deals with the leaderboard table
          let gl = window[i];
          for (let k in gl) {
            if (typeof gl[k] === "function" && gl[k].toString().includes(".table")) {
              let oldF = gl[k];
              gl[k] = function () {
                let current = window.module.exports.settings.check('show_blank_badge');
                if (this.showBlank !== current) {
                  for (let i in this.table) if (i.startsWith("blank")) delete this.table[i];
                  this.showBlank = current;
                }
                return oldF.apply(this, arguments);
              };
              break Search;
            }
          }
        }
      }
    } catch (e) {
      console.error(e);
    }
  }
  `;

  // Add crystal color mod
  const crystalColorMod = `
  let CrystalObject;
  for (let i in window) try {
    let val = window[i];
    if ("function" == typeof val.prototype.createModel && val.prototype.createModel.toString().includes("Crystal")) {
      CrystalObject = val;
      break
    }
  }
  catch (e) {}
  
  let oldModel = CrystalObject.prototype.getModelInstance, getCustomCrystalColor = function () {
    return localStorage.getItem("crystal-color") || "#ffffff";
  };
  
  CrystalObject.prototype.getModelInstance = function () {
    let res = oldModel.apply(this, arguments);
    let color = getCustomCrystalColor();
    if (color) this.material.color.set(color);
    return res;
  };
  `;

  src = src.replace('</body>', `
    ${controlStyles}
    ${controlsHTML}
    <script>
    ${emoteCapacityMod}
    ${blankECPMod}
    ${crystalColorMod}

    const fovDisplay = document.getElementById('fov-display');

    // Add wheel event listener for FOV change
    document.addEventListener('wheel', (e) => {
      if (!window.modSettings.fovEnabled) return;
      e.preventDefault();
      const delta = e.deltaY < 0 ? 1 : -1;
      // Add bounds checking
      window.I1000.currentFOV = Math.max(1, Math.min(120, window.I1000.currentFOV + delta));
      document.getElementById('fov-value').textContent = window.I1000.currentFOV;
    }, { passive: false });

    document.addEventListener('DOMContentLoaded', () => {
      const controlsHeader = document.getElementById('mod-controls-header');
      const controlsPanel = document.getElementById('mod-controls-panel');
      const fovToggle = document.getElementById('fov-toggle');
      const emoteSlider = document.getElementById('emote-capacity-slider');
      const emoteValue = document.getElementById('emote-capacity-value');
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
        const value = emoteSlider.value;
        emoteValue.textContent = value;
        window.modSettings.emoteCapacity = value;
        localStorage.setItem('emote-capacity', value);
        if (window.ChatPanel) {
          window.ChatPanel.prototype.getEmotesCapacity = function () {
            return parseInt(value);
          };
        }
      });

      blankECPToggle.addEventListener('change', () => {
        window.modSettings.showBlankECP = blankECPToggle.checked;
        localStorage.setItem('show-blank-ecp', blankECPToggle.checked);
        if (window.module && window.module.exports) {
          window.module.exports.settings.set('show_blank_badge', blankECPToggle.checked);
        }
      });

      // Set the "Show Blank ECPs" to true by default
      if (window.module && window.module.exports) {
        window.module.exports.settings.set('show_blank_badge', true);
      }

      crystalColorPicker.addEventListener('change', () => {
        localStorage.setItem('crystal-color', crystalColorPicker.value);
        // Update crystal color immediately
        if (window.CrystalObject) {
          window.CrystalObject.prototype.getModelInstance().material.color.set(crystalColorPicker.value);
        }
      });
    });
    </script>
    </body>`);

  checkSrcChange();

  logFOV("FOV injector applied");
  return src;
}

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
const log = (msg) => console.log(`%c[Mod injector] ${msg}`, "color: #06c26d");

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

// Run the injectLoader function immediately
injectLoader();
