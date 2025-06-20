// ==UserScript==
// @name         Clean Starblast.io Mod
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Clean and modern Starblast.io modifications
// @author       You
// @match        https://starblast.io/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    
    // Global settings
    window.modSettings = {
        fovEnabled: true,
        emoteCapacity: parseInt(localStorage.getItem('sb-emote-capacity')) || 4,
        uiVisible: true
    };
    
    // FOV system
    window.I1000 = window.I1000 || {};
    window.I1000.baseFOV = 45;
    window.I1000.currentFOV = 45;
    
    // Logger
    const log = (msg, color = "#00d4aa") => console.log(`%c[Clean SB Mod] ${msg}`, `color: ${color}`);
    
    // Initialize code injectors array
    if (!window.sbCodeInjectors) window.sbCodeInjectors = [];
    
    // Main injection function
    function injectMods() {
        if (window.location.pathname !== "/") {
            log("Not on main page, skipping injection");
            return;
        }
        
        // Show loading screen
        document.open();
        document.write(`
            <html>
                <head><title>Loading Mods...</title></head>
                <body style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                    <div style="display: flex; align-items: center; justify-content: center; height: 100vh; color: white;">
                        <div style="text-align: center;">
                            <div style="width: 40px; height: 40px; border: 3px solid rgba(255,255,255,0.3); border-top: 3px solid white; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px;"></div>
                            <h2 style="margin: 0; font-weight: 300;">Loading Clean Mods</h2>
                            <p style="margin: 10px 0 0; opacity: 0.8;">Please wait...</p>
                        </div>
                    </div>
                    <style>
                        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                    </style>
                </body>
            </html>
        `);
        document.close();
        
        // Fetch game source
        const xhr = new XMLHttpRequest();
        log("Fetching game source...");
        xhr.open("GET", "https://starblast.io");
        
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                let gameSource = xhr.responseText;
                
                if (!gameSource) {
                    log("Failed to fetch game source", "#ff4757");
                    alert("Failed to load game. Please refresh.");
                    return;
                }
                
                log("Source fetched successfully");
                const startTime = performance.now();
                
                // Apply all mod injectors
                if (window.sbCodeInjectors.length > 0) {
                    log(`Applying ${window.sbCodeInjectors.length} mod(s)...`);
                    
                    for (const injector of window.sbCodeInjectors) {
                        try {
                            if (typeof injector === "function") {
                                gameSource = injector(gameSource);
                            }
                        } catch (error) {
                            log(`Mod injection failed: ${error}`, "#ff4757");
                            console.error(error);
                        }
                    }
                } else {
                    log("No mods to inject");
                }
                
                const endTime = performance.now();
                log(`Mods applied in ${(endTime - startTime).toFixed(0)}ms`);
                
                // Load modified game
                document.open();
                document.write(gameSource);
                document.close();
            }
        };
        
        xhr.send();
    }
    
    // FOV Mod Injector
    function fovInjector(source) {
        let src = source;
        const originalSrc = src;
        
        // Replace FOV calculation
        const fovPattern = /this\.III00\.fov\s*=\s*45\s*\*\s*this\.IIl11\.III00\.zoom/g;
        if (!fovPattern.test(src)) {
            throw new Error("FOV pattern not found in source");
        }
        
        src = src.replace(fovPattern, 
            'this.III00.fov = (window.modSettings.fovEnabled ? window.I1000.currentFOV : 45) * this.IIl11.III00.zoom'
        );
        
        if (src === originalSrc) {
            throw new Error("FOV injection failed - no changes made");
        }
        
        // Add UI and controls
        const modUI = `
        <style>
            #clean-mod-ui {
                position: fixed;
                top: 20px;
                left: 20px;
                z-index: 10000;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                background: rgba(0, 0, 0, 0.85);
                backdrop-filter: blur(10px);
                border-radius: 12px;
                border: 1px solid rgba(255, 255, 255, 0.1);
                color: white;
                min-width: 200px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                user-select: none;
                transition: all 0.3s ease;
            }
            
            #clean-mod-ui.hidden {
                transform: translateX(-100%);
                opacity: 0;
            }
            
            .mod-header {
                padding: 16px 20px;
                background: linear-gradient(135deg, #00d4aa, #00a8ff);
                border-radius: 12px 12px 0 0;
                font-weight: 600;
                font-size: 14px;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .mod-header::before {
                content: "⚡";
                font-size: 16px;
            }
            
            .mod-content {
                padding: 20px;
                display: none;
            }
            
            .mod-content.expanded {
                display: block;
            }
            
            .mod-control {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 16px;
                font-size: 13px;
            }
            
            .mod-control:last-child {
                margin-bottom: 0;
            }
            
            .toggle-switch {
                position: relative;
                width: 44px;
                height: 24px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 12px;
                cursor: pointer;
                transition: background 0.3s ease;
            }
            
            .toggle-switch.active {
                background: #00d4aa;
            }
            
            .toggle-switch::before {
                content: "";
                position: absolute;
                width: 20px;
                height: 20px;
                background: white;
                border-radius: 10px;
                top: 2px;
                left: 2px;
                transition: transform 0.3s ease;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            }
            
            .toggle-switch.active::before {
                transform: translateX(20px);
            }
            
            .slider-control {
                width: 100%;
                margin-top: 8px;
            }
            
            .slider {
                width: 100%;
                height: 4px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 2px;
                outline: none;
                -webkit-appearance: none;
            }
            
            .slider::-webkit-slider-thumb {
                -webkit-appearance: none;
                width: 16px;
                height: 16px;
                background: #00d4aa;
                border-radius: 8px;
                cursor: pointer;
                box-shadow: 0 2px 6px rgba(0, 212, 170, 0.3);
            }
            
            .fov-display {
                background: rgba(255, 255, 255, 0.1);
                padding: 12px 16px;
                border-radius: 8px;
                text-align: center;
                font-size: 14px;
                font-weight: 600;
                margin-top: 12px;
                color: #00d4aa;
            }
            
            .help-text {
                font-size: 11px;
                color: rgba(255, 255, 255, 0.6);
                margin-top: 8px;
                text-align: center;
            }
        </style>
        
        <div id="clean-mod-ui">
            <div class="mod-header" onclick="toggleModUI()">
                Clean Starblast Mod
            </div>
            <div class="mod-content" id="mod-content">
                <div class="mod-control">
                    <span>FOV Control</span>
                    <div class="toggle-switch active" id="fov-toggle" onclick="toggleFOV()"></div>
                </div>
                
                <div class="mod-control">
                    <span>Emote Capacity</span>
                    <span id="emote-value">4</span>
                </div>
                <div class="slider-control">
                    <input type="range" class="slider" id="emote-slider" min="1" max="6" value="4" oninput="updateEmotes(this.value)">
                </div>
                
                <div class="fov-display">
                    FOV: <span id="fov-value">45</span>°
                </div>
                
                <div class="help-text">
                    Scroll to change FOV • F9 to toggle UI
                </div>
            </div>
        </div>
        
        <script>
            // UI Functions
            function toggleModUI() {
                const content = document.getElementById('mod-content');
                content.classList.toggle('expanded');
            }
            
            function toggleFOV() {
                const toggle = document.getElementById('fov-toggle');
                window.modSettings.fovEnabled = !window.modSettings.fovEnabled;
                toggle.classList.toggle('active', window.modSettings.fovEnabled);
            }
            
            function updateEmotes(value) {
                document.getElementById('emote-value').textContent = value;
                window.modSettings.emoteCapacity = parseInt(value);
                localStorage.setItem('sb-emote-capacity', value);
            }
            
            // FOV Controls
            document.addEventListener('wheel', (e) => {
                if (!window.modSettings.fovEnabled) return;
                
                e.preventDefault();
                const delta = e.deltaY < 0 ? 2 : -2;
                window.I1000.currentFOV = Math.max(10, Math.min(120, window.I1000.currentFOV + delta));
                
                const fovDisplay = document.getElementById('fov-value');
                if (fovDisplay) {
                    fovDisplay.textContent = Math.round(window.I1000.currentFOV);
                }
            }, { passive: false });
            
            // F9 to toggle UI
            document.addEventListener('keydown', (e) => {
                if (e.key === 'F9') {
                    e.preventDefault();
                    const ui = document.getElementById('clean-mod-ui');
                    window.modSettings.uiVisible = !window.modSettings.uiVisible;
                    ui.classList.toggle('hidden', !window.modSettings.uiVisible);
                }
            });
            
            // Initialize UI
            document.addEventListener('DOMContentLoaded', () => {
                const emoteSlider = document.getElementById('emote-slider');
                const emoteValue = document.getElementById('emote-value');
                const fovToggle = document.getElementById('fov-toggle');
                
                // Load saved settings
                const savedEmotes = localStorage.getItem('sb-emote-capacity') || '4';
                emoteSlider.value = savedEmotes;
                emoteValue.textContent = savedEmotes;
                window.modSettings.emoteCapacity = parseInt(savedEmotes);
                
                fovToggle.classList.toggle('active', window.modSettings.fovEnabled);
                
                // Expand UI by default
                setTimeout(() => {
                    document.getElementById('mod-content').classList.add('expanded');
                }, 500);
            });
        </script>
        </body>`;
        
        src = src.replace('</body>', modUI);
        
        log("FOV mod injected successfully", "#00d4aa");
        return src;
    }
    
    // Emote Capacity Mod Injector
    function emoteInjector(source) {
        let src = source;
        
        // Add custom emotes
        const vocabPattern = /(this\.vocabulary\s*=\s*\[[\s\S]*?\})/;
        const customEmotes = `,{
            text: "nice shot",
            icon: "🎯",
            key: "Q"
        },{
            text: "gg wp",
            icon: "🏆",
            key: "E"
        }`;
        
        if (vocabPattern.test(src)) {
            src = src.replace(vocabPattern, `$1${customEmotes}`);
            log("Custom emotes injected", "#ffa502");
        }
        
        return src;
    }
    
    // Name lowercase mod
    function nameInjector(source) {
        let src = source;
        
        // Remove uppercase transformation
        src = src.replace(/\.toUpperCase\(\)/g, "");
        
        // Add CSS to prevent uppercase
        const nameStyle = `
        <style>
            #player input { text-transform: none !important; }
        </style>`;
        
        src = src.replace('</head>', `${nameStyle}</head>`);
        
        log("Name case mod injected", "#2ed573");
        return src;
    }
    
    // Register all injectors
    window.sbCodeInjectors.push(fovInjector);
    window.sbCodeInjectors.push(emoteInjector);
    window.sbCodeInjectors.push(nameInjector);
    
    // Start injection
    setTimeout(injectMods, 100);
    
    log("Clean Starblast Mod loaded successfully! 🚀");
})();
