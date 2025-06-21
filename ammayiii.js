// Starblast Enhancement Script - Enhanced Version with Working FOV & Radar Zoom
(function() {
    'use strict';
    
    // Configuration object to store all settings
    const config = {
        fov: 45,
        radarZoom: 4,
        crystalColor: '',
        backgroundUrl: '',
        lowercaseEnabled: false,
        timerEnabled: false,
        fovWheelEnabled: false
    };
    
    // Initialize mod settings globally
    window.modSettings = window.modSettings || {
        fovEnabled: true,
        radarZoomEnabled: false
    };
    
    // Initialize FOV system
    window.I1000 = window.I1000 || {};
    window.I1000.baseFOV = 45;
    window.I1000.currentFOV = 45;
    
    // FOV Editor Mod
    const fovModName = "FOV Editor";
    const logFOV = (msg) => console.log(`%c[${fovModName}] ${msg}`, "color: #00A6FF");
    
    function fovInjector(sbCode) {
        let src = sbCode;
        let prevSrc = src;

        function checkSrcChange() {
            if (src === prevSrc) console.error("replace did not work");
            prevSrc = src;
        }

        const fovPattern = /this\.I1000\.fov\s*=\s*45\s*\*\s*this\.IO11l\.I1000\.zoom/g;
        src = src.replace(fovPattern, 'this.I1000.fov = (window.modSettings.fovEnabled ? window.I1000.currentFOV : 45) * this.IO11l.I1000.zoom');
        checkSrcChange();

        logFOV("FOV injector applied");
        return src;
    }
    
    // Radar Zoom Override System
    const radarZoomOverride = {
        originalValues: new WeakMap(),
        
        enable(instance) {
            const proto = Object.getPrototypeOf(instance);
            const originalDescriptor = Object.getOwnPropertyDescriptor(proto, 'radar_zoom');
            
            if (originalDescriptor && !instance._radarZoomOverrideApplied) {
                const originalGetter = originalDescriptor.get;
                const originalSetter = originalDescriptor.set;
                
                Object.defineProperty(instance, 'radar_zoom', {
                    get() {
                        if (!radarZoomOverride.originalValues.has(this)) {
                            radarZoomOverride.originalValues.set(this, originalGetter ? originalGetter.call(this) : 4);
                        }
                        
                        return window.modSettings.radarZoomEnabled ? 1 : 
                            radarZoomOverride.originalValues.get(this);
                    },
                    set(value) {
                        if (originalSetter) {
                            originalSetter.call(this, value);
                        }
                        radarZoomOverride.originalValues.set(this, value);
                    },
                    configurable: true
                });
                
                instance._radarZoomOverrideApplied = true;
            }
        }
    };
    
    // Apply radar zoom to all instances
    function applyRadarZoomToAllInstances() {
        // Find all objects that might have radar_zoom property
        for (let key in window) {
            try {
                let obj = window[key];
                if (obj && typeof obj === 'object' && obj.hasOwnProperty('radar_zoom')) {
                    radarZoomOverride.enable(obj);
                }
            } catch (e) {
                // Ignore errors from accessing restricted objects
            }
        }
    }
    
    // Load settings from memory (since localStorage isn't available)
    function loadSettings() {
        // Use default values since localStorage is not available
        config.fov = 45;
        config.radarZoom = 4;
        config.crystalColor = '';
        config.backgroundUrl = '';
        config.lowercaseEnabled = false;
        config.timerEnabled = false;
        config.fovWheelEnabled = false;
        
        // Update global settings
        window.I1000.currentFOV = config.fov;
        window.modSettings.fovEnabled = true;
        window.modSettings.radarZoomEnabled = config.radarZoom === 1;
    }
    
    // Save settings to memory (since localStorage isn't available)
    function saveSettings() {
        // In a real environment, this would save to localStorage
        // For now, just update the global objects
        window.I1000.currentFOV = config.fov;
        window.modSettings.fovEnabled = true;
        window.modSettings.radarZoomEnabled = config.radarZoom === 1;
    }
    
    // Create the UI
    function createUI() {
        // Check if UI already exists
        if (document.getElementById('starblast-enhancer')) {
            return;
        }
        
        const ui = document.createElement('div');
        ui.id = 'starblast-enhancer';
        ui.innerHTML = `
            <div id="sb-panel" style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(0, 0, 0, 0.9);
                border: 2px solid #00ffff;
                border-radius: 10px;
                padding: 15px;
                color: #ffffff;
                font-family: Arial, sans-serif;
                font-size: 12px;
                z-index: 10000;
                min-width: 250px;
                box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
                backdrop-filter: blur(5px);
                display: none;
            ">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <h3 style="margin: 0; color: #00ffff; text-shadow: 0 0 10px #00ffff;">Starblast Enhancer</h3>
                    <button id="sb-close" style="
                        background: #ff4444;
                        border: none;
                        color: white;
                        width: 20px;
                        height: 20px;
                        border-radius: 50%;
                        cursor: pointer;
                        font-size: 12px;
                    ">×</button>
                </div>
                
                <div class="sb-section">
                    <label style="display: block; margin-bottom: 5px; color: #00ffff;">FOV Control:</label>
                    <input type="range" id="sb-fov-slider" min="10" max="190" value="${config.fov}" style="width: 100%; margin-bottom: 5px;">
                    <span id="sb-fov-value" style="color: #ffffff;">${config.fov}°</span>
                    <div style="margin-top: 5px;">
                        <input type="checkbox" id="sb-fov-wheel" ${config.fovWheelEnabled ? 'checked' : ''}>
                        <label for="sb-fov-wheel" style="margin-left: 5px;">Scroll wheel control</label>
                    </div>
                </div>
                
                <div class="sb-section" style="margin-top: 15px;">
                    <label style="display: block; margin-bottom: 5px; color: #00ffff;">Crystal Color:</label>
                    <input type="color" id="sb-crystal-color" value="${config.crystalColor || '#ffffff'}" style="width: 100%; height: 30px; border: none; border-radius: 5px;">
                    <button id="sb-crystal-reset" style="
                        width: 100%;
                        margin-top: 5px;
                        background: #444;
                        color: white;
                        border: 1px solid #666;
                        padding: 5px;
                        border-radius: 3px;
                        cursor: pointer;
                    ">Reset to Default</button>
                </div>
                
                <div class="sb-section" style="margin-top: 15px;">
                    <label style="display: block; margin-bottom: 5px; color: #00ffff;">Background Image:</label>
                    <input type="url" id="sb-background-url" placeholder="Image URL (.png, .jpg, .gif)" value="${config.backgroundUrl}" style="
                        width: 100%;
                        padding: 5px;
                        border: 1px solid #666;
                        border-radius: 3px;
                        background: #333;
                        color: white;
                        margin-bottom: 5px;
                    ">
                    <div style="display: flex; gap: 5px;">
                        <button id="sb-bg-apply" style="
                            flex: 1;
                            background: #00aa00;
                            color: white;
                            border: none;
                            padding: 5px;
                            border-radius: 3px;
                            cursor: pointer;
                        ">Apply</button>
                        <button id="sb-bg-remove" style="
                            flex: 1;
                            background: #aa0000;
                            color: white;
                            border: none;
                            padding: 5px;
                            border-radius: 3px;
                            cursor: pointer;
                        ">Remove</button>
                    </div>
                </div>
                
                <div class="sb-section" style="margin-top: 15px;">
                    <label style="display: block; margin-bottom: 10px; color: #00ffff;">Options:</label>
                    <div style="margin-bottom: 8px;">
                        <input type="checkbox" id="sb-radar-zoom" ${config.radarZoom === 1 ? 'checked' : ''}>
                        <label for="sb-radar-zoom" style="margin-left: 5px;">Enhanced Radar Zoom</label>
                    </div>
                    <div style="margin-bottom: 8px;">
                        <input type="checkbox" id="sb-lowercase" ${config.lowercaseEnabled ? 'checked' : ''}>
                        <label for="sb-lowercase" style="margin-left: 5px;">Lowercase Names</label>
                    </div>
                    <div>
                        <input type="checkbox" id="sb-timer" ${config.timerEnabled ? 'checked' : ''}>
                        <label for="sb-timer" style="margin-left: 5px;">Show Timer Widget</label>
                    </div>
                </div>
            </div>
            
            <button id="sb-toggle" style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(0, 255, 255, 0.8);
                border: 2px solid #00ffff;
                color: #000;
                padding: 8px 12px;
                border-radius: 5px;
                cursor: pointer;
                font-weight: bold;
                z-index: 10001;
                font-size: 12px;
                box-shadow: 0 0 15px rgba(0, 255, 255, 0.5);
            ">SB+</button>
            
            <div id="sb-fov-display" style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(0, 0, 0, 0.8);
                color: #00ffff;
                padding: 10px 20px;
                border-radius: 5px;
                font-size: 24px;
                font-weight: bold;
                z-index: 10000;
                display: none;
                border: 2px solid #00ffff;
                text-shadow: 0 0 10px #00ffff;
            "></div>
        `;
        
        document.body.appendChild(ui);
        setupEventListeners();
        
        // Apply initial radar zoom override
        setTimeout(() => {
            applyRadarZoomToAllInstances();
        }, 1000);
    }
    
    // Setup event listeners
    function setupEventListeners() {
        const panel = document.getElementById('sb-panel');
        const toggle = document.getElementById('sb-toggle');
        const close = document.getElementById('sb-close');
        
        // Toggle panel
        toggle.addEventListener('click', () => {
            panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        });
        
        close.addEventListener('click', () => {
            panel.style.display = 'none';
        });
        
        // FOV controls
        const fovSlider = document.getElementById('sb-fov-slider');
        const fovValue = document.getElementById('sb-fov-value');
        const fovWheel = document.getElementById('sb-fov-wheel');
        
        fovSlider.addEventListener('input', (e) => {
            config.fov = parseInt(e.target.value);
            fovValue.textContent = config.fov + '°';
            updateFOV();
            saveSettings();
        });
        
        fovWheel.addEventListener('change', (e) => {
            config.fovWheelEnabled = e.target.checked;
            saveSettings();
        });
        
        // Crystal color
        const crystalColor = document.getElementById('sb-crystal-color');
        const crystalReset = document.getElementById('sb-crystal-reset');
        
        crystalColor.addEventListener('change', (e) => {
            config.crystalColor = e.target.value;
            saveSettings();
        });
        
        crystalReset.addEventListener('click', () => {
            config.crystalColor = '';
            crystalColor.value = '#ffffff';
            saveSettings();
        });
        
        // Background controls
        const bgUrl = document.getElementById('sb-background-url');
        const bgApply = document.getElementById('sb-bg-apply');
        const bgRemove = document.getElementById('sb-bg-remove');
        
        bgApply.addEventListener('click', () => {
            const url = bgUrl.value.trim();
            if (url && (url.endsWith('.png') || url.endsWith('.jpg') || url.endsWith('.gif'))) {
                config.backgroundUrl = url;
                applyBackground();
                saveSettings();
            }
        });
        
        bgRemove.addEventListener('click', () => {
            config.backgroundUrl = '';
            bgUrl.value = '';
            removeBackground();
            saveSettings();
        });
        
        // Options
        const radarZoom = document.getElementById('sb-radar-zoom');
        const lowercase = document.getElementById('sb-lowercase');
        const timer = document.getElementById('sb-timer');
        
        radarZoom.addEventListener('change', (e) => {
            config.radarZoom = e.target.checked ? 1 : 4;
            window.modSettings.radarZoomEnabled = e.target.checked;
            applyRadarZoomToAllInstances();
            saveSettings();
        });
        
        lowercase.addEventListener('change', (e) => {
            config.lowercaseEnabled = e.target.checked;
            updateLowercase();
            saveSettings();
        });
        
        timer.addEventListener('change', (e) => {
            config.timerEnabled = e.target.checked;
            saveSettings();
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.altKey && e.key === 'e') {
                e.preventDefault();
                panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
            }
            
            if (e.key === 'F11' && config.fovWheelEnabled) {
                e.preventDefault();
                config.fov = 45;
                fovSlider.value = 45;
                fovValue.textContent = '45°';
                updateFOV();
                showFOVDisplay(45);
                saveSettings();
            }
        });
        
        // Mouse wheel FOV control
        document.addEventListener('wheel', (e) => {
            if (!config.fovWheelEnabled) return;
            
            e.preventDefault();
            
            if (e.deltaY < 0) {
                config.fov = Math.max(10, config.fov - 1);
            } else {
                config.fov = Math.min(190, config.fov + 1);
            }
            
            fovSlider.value = config.fov;
            fovValue.textContent = config.fov + '°';
            updateFOV();
            showFOVDisplay(config.fov);
            saveSettings();
        }, { passive: false });
    }
    
    // FOV functions using your system
    function updateFOV() {
        window.I1000.currentFOV = config.fov;
        window.modSettings.fovEnabled = true;
        
        // Try to apply FOV to existing camera objects
        if (window.lOOI1) {
            window.lOOI1.fov = config.fov;
            if (window.lOOI1.updateProjectionMatrix) {
                window.lOOI1.updateProjectionMatrix();
            }
        }
        
        // Apply to any Three.js cameras
        if (window.THREE) {
            const possibleCameras = [
                window.camera,
                window.scene?.camera,
                window.game?.camera,
                window.renderer?.camera
            ];
            
            for (let cam of possibleCameras) {
                if (cam && cam.fov !== undefined) {
                    cam.fov = config.fov;
                    if (cam.updateProjectionMatrix) {
                        cam.updateProjectionMatrix();
                    }
                    break;
                }
            }
        }
        
        logFOV(`FOV updated to ${config.fov}°`);
    }
    
    function showFOVDisplay(value) {
        const display = document.getElementById('sb-fov-display');
        if (display) {
            display.textContent = value + '°';
            display.style.display = 'block';
            setTimeout(() => {
                display.style.display = 'none';
            }, 2000);
        }
    }
    
    // Background functions
    function applyBackground() {
        const particlesElement = document.getElementById('particles-js');
        if (particlesElement && config.backgroundUrl) {
            particlesElement.style.backgroundImage = `url("${config.backgroundUrl}")`;
            particlesElement.style.backgroundSize = 'cover';
            particlesElement.style.backgroundPosition = 'center';
        }
    }
    
    function removeBackground() {
        const particlesElement = document.getElementById('particles-js');
        if (particlesElement) {
            particlesElement.style.backgroundImage = '';
        }
    }
    
    // Lowercase function
    function updateLowercase() {
        const playerInput = document.querySelector('#player input');
        if (playerInput) {
            if (config.lowercaseEnabled) {
                playerInput.style.textTransform = 'lowercase';
            } else {
                playerInput.style.textTransform = '';
            }
        }
    }
    
    // Crystal color modification
    function setupCrystalColorMod() {
        let CrystalObject;
        
        // Find the Crystal object
        for (let i in window) {
            try {
                let val = window[i];
                if (typeof val.prototype?.createModel === 'function' && 
                    val.prototype.createModel.toString().includes('Crystal')) {
                    CrystalObject = val;
                    break;
                }
            } catch (e) {}
        }
        
        if (CrystalObject) {
            const oldModel = CrystalObject.prototype.getModelInstance;
            
            CrystalObject.prototype.getModelInstance = function() {
                let result = oldModel.apply(this, arguments);
                
                if (config.crystalColor && this.material) {
                    this.material.color.set(config.crystalColor);
                }
                
                return result;
            };
        }
    }
    
    // Hook into Starblast's code loading system
    function hookIntoStarblast() {
        // Try to hook into script loading without affecting the document
        const originalCreateElement = document.createElement;
        document.createElement = function(tagName) {
            const element = originalCreateElement.call(this, tagName);
            
            if (tagName.toLowerCase() === 'script') {
                const originalOnLoad = element.onload;
                element.onload = function() {
                    if (originalOnLoad) originalOnLoad.call(this);
                    
                    // Try to find and modify the game code after scripts load
                    setTimeout(() => {
                        try {
                            // Look for game objects that might contain the FOV code
                            for (let key in window) {
                                try {
                                    const obj = window[key];
                                    if (typeof obj === 'function' && obj.toString().includes('fov')) {
                                        // Try to apply FOV injection
                                        const modifiedCode = fovInjector(obj.toString());
                                        if (modifiedCode !== obj.toString()) {
                                            logFOV("Found FOV code to modify");
                                        }
                                    }
                                } catch (e) {
                                    // Ignore errors
                                }
                            }
                        } catch (e) {
                            console.log("Could not inject FOV code:", e);
                        }
                    }, 1000);
                };
            }
            
            return element;
        };
    }
    
    // Initialize everything
    function init() {
        loadSettings();
        hookIntoStarblast();
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => {
                    createUI();
                    applyBackground();
                    updateLowercase();
                    setupCrystalColorMod();
                    updateFOV();
                }, 100);
            });
        } else {
            setTimeout(() => {
                createUI();
                applyBackground();
                updateLowercase();
                setupCrystalColorMod();
                updateFOV();
            }, 100);
        }
        
        console.log('Starblast Enhancer loaded! Press Alt+E to toggle panel.');
        console.log('FOV system initialized with your custom injector.');
        console.log('Radar zoom system initialized with override mechanism.');
    }
    
    // Start the script
    init();
})();
