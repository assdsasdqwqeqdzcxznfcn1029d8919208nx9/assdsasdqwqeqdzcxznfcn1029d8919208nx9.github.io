/* Clean Starblast.io Mod */
const log = (msg) => console.log(`%c[Clean Mod] ${msg}`, "color: #00d4aa; font-weight: bold;");

console.clear();

/* Initialize injectors array */
if (!window.sbCodeInjectors) window.sbCodeInjectors = [];

/* Global settings */
window.modSettings = {
    fovEnabled: true,
    emoteCapacity: parseInt(localStorage.getItem('clean-emote-capacity')) || 4,
    uiVisible: true
};

/* FOV system */
window.I1000 = window.I1000 || {};
window.I1000.baseFOV = 45;
window.I1000.currentFOV = 45;

/* Stop non-modified scripts */
document.open();
document.write(`
<html>
    <head><title>Loading Clean Mods...</title></head>
    <body style="background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: white;">
        <div style="display: flex; align-items: center; justify-content: center; height: 100vh;">
            <div style="text-align: center;">
                <div style="width: 50px; height: 50px; border: 4px solid rgba(255,255,255,0.3); border-top: 4px solid #00d4aa; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 30px;"></div>
                <h1 style="margin: 0; font-weight: 300; font-size: 32px;">Loading Clean Mods</h1>
                <p style="margin: 15px 0 0; opacity: 0.8; font-size: 16px;">Preparing enhanced experience...</p>
            </div>
        </div>
        <style>
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        </style>
    </body>
</html>
`);
document.close();

/* Main injection function */
function injectLoader() {
    if (window.location.pathname != "/") {
        log("Injection not needed");
        return;
    }

    var url = "https://starblast.io";
    var xhr = new XMLHttpRequest();
    log("Fetching starblast source...");
    xhr.open("GET", url);
    
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            var starSRC = xhr.responseText;
            if (starSRC != undefined) {
                log("Source fetched successfully");
            } else {
                log("Source fetch failed");
                alert("An error occurred whilst fetching game code");
                return;
            }

            const start_time = performance.now();
            log("Applying clean mods...");
            
            if (!window.sbCodeInjectors) {
                log("No userscripts to load");
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
                            alert("One of the mods failed to load");
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

            document.addEventListener("DOMContentLoaded", function() {
                log("Document loaded - Clean Mods active! 🚀");
            });
        }
    };
    xhr.send();
}

/* FOV Mod Injector */
function fovInjector(sbCode) {
    let src = sbCode;
    let prevSrc = src;
    
    function checkSrcChange() {
        if (src === prevSrc) throw new Error("FOV replace did not work");
        prevSrc = src;
    }

    // Replace FOV calculation
    const fovPattern = /this\.III00\.fov\s*=\s*45\s*\*\s*this\.IIl11\.III00\.zoom/g;
    src = src.replace(fovPattern, 'this.III00.fov = (window.modSettings.fovEnabled ? window.I1000.currentFOV : 45) * this.IIl11.III00.zoom');
    checkSrcChange();

    // Add modern UI
    const modernUI = `
    <style>
        #clean-ui {
            position: fixed;
            top: 20px;
            left: 20px;
            z-index: 10000;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: rgba(0, 0, 0, 0.9);
            backdrop-filter: blur(15px);
            border-radius: 16px;
            border: 1px solid rgba(0, 212, 170, 0.3);
            color: white;
            min-width: 220px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
            user-select: none;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            overflow: hidden;
        }
        
        #clean-ui.hidden {
            transform: translateX(-110%);
            opacity: 0;
        }
        
        .ui-header {
            padding: 18px 22px;
            background: linear-gradient(135deg, #00d4aa, #00a8ff);
            font-weight: 700;
            font-size: 15px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: space-between;
            transition: all 0.3s ease;
        }
        
        .ui-header:hover {
            background: linear-gradient(135deg, #00e6c0, #00b8ff);
        }
        
        .ui-header .title {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .ui-header .title::before {
            content: "⚡";
            font-size: 18px;
            filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.8));
        }
        
        .ui-header .arrow {
            transition: transform 0.3s ease;
            font-size: 12px;
        }
        
        .ui-header .arrow.expanded {
            transform: rotate(180deg);
        }
        
        .ui-content {
            padding: 0;
            max-height: 0;
            overflow: hidden;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .ui-content.expanded {
            padding: 22px;
            max-height: 400px;
        }
        
        .control-group {
            margin-bottom: 20px;
        }
        
        .control-group:last-child {
            margin-bottom: 0;
        }
        
        .control-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
            font-size: 14px;
            font-weight: 500;
        }
        
        .toggle-switch {
            position: relative;
            width: 50px;
            height: 26px;
            background: rgba(255, 255, 255, 0.15);
            border-radius: 13px;
            cursor: pointer;
            transition: all 0.3s ease;
            border: 2px solid transparent;
        }
        
        .toggle-switch.active {
            background: linear-gradient(135deg, #00d4aa, #00a8ff);
            box-shadow: 0 0 20px rgba(0, 212, 170, 0.4);
        }
        
        .toggle-switch::before {
            content: "";
            position: absolute;
            width: 20px;
            height: 20px;
            background: white;
            border-radius: 10px;
            top: 1px;
            left: 1px;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }
        
        .toggle-switch.active::before {
            transform: translateX(24px);
        }
        
        .slider-container {
            margin-top: 12px;
        }
        
        .slider {
            width: 100%;
            height: 6px;
            background: rgba(255, 255, 255, 0.15);
            border-radius: 3px;
            outline: none;
            -webkit-appearance: none;
            transition: all 0.3s ease;
        }
        
        .slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 20px;
            height: 20px;
            background: linear-gradient(135deg, #00d4aa, #00a8ff);
            border-radius: 10px;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(0, 212, 170, 0.4);
            transition: all 0.3s ease;
        }
        
        .slider::-webkit-slider-thumb:hover {
            transform: scale(1.1);
            box-shadow: 0 4px 12px rgba(0, 212, 170, 0.6);
        }
        
        .value-display {
            color: #00d4aa;
            font-weight: 700;
            font-size: 15px;
        }
        
        .fov-display {
            background: linear-gradient(135deg, rgba(0, 212, 170, 0.1), rgba(0, 168, 255, 0.1));
            border: 1px solid rgba(0, 212, 170, 0.3);
            padding: 16px;
            border-radius: 12px;
            text-align: center;
            font-size: 16px;
            font-weight: 700;
            margin-top: 16px;
            color: #00d4aa;
        }
        
        .help-text {
            font-size: 12px;
            color: rgba(255, 255, 255, 0.6);
            margin-top: 12px;
            text-align: center;
            line-height: 1.4;
        }
        
        .divider {
            height: 1px;
            background: rgba(255, 255, 255, 0.1);
            margin: 20px 0;
        }
    </style>
    
    <div id="clean-ui">
        <div class="ui-header" onclick="toggleUI()">
            <div class="title">Clean Starblast</div>
            <div class="arrow">▼</div>
        </div>
        <div class="ui-content" id="ui-content">
            <div class="control-group">
                <div class="control-row">
                    <span>FOV Control</span>
                    <div class="toggle-switch active" id="fov-toggle" onclick="toggleFOV()"></div>
                </div>
                <div class="fov-display">
                    FOV: <span id="fov-value">45</span>°
                </div>
            </div>
            
            <div class="divider"></div>
            
            <div class="control-group">
                <div class="control-row">
                    <span>Emote Capacity</span>
                    <span class="value-display" id="emote-value">4</span>
                </div>
                <div class="slider-container">
                    <input type="range" class="slider" id="emote-slider" min="1" max="6" value="4">
                </div>
            </div>
            
            <div class="help-text">
                Mouse wheel to adjust FOV<br>
                F9 to toggle this panel
            </div>
        </div>
    </div>
    
    <script>
        let uiExpanded = false;
        
        function toggleUI() {
            const content = document.getElementById('ui-content');
            const arrow = document.querySelector('.arrow');
            uiExpanded = !uiExpanded;
            
            content.classList.toggle('expanded', uiExpanded);
            arrow.classList.toggle('expanded', uiExpanded);
        }
        
        function toggleFOV() {
            const toggle = document.getElementById('fov-toggle');
            window.modSettings.fovEnabled = !window.modSettings.fovEnabled;
            toggle.classList.toggle('active', window.modSettings.fovEnabled);
        }
        
        // FOV wheel control
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
        
        // F9 toggle
        document.addEventListener('keydown', (e) => {
            if (e.key === 'F9') {
                e.preventDefault();
                const ui = document.getElementById('clean-ui');
                window.modSettings.uiVisible = !window.modSettings.uiVisible;
                ui.classList.toggle('hidden', !window.modSettings.uiVisible);
            }
        });
        
        // Initialize
        document.addEventListener('DOMContentLoaded', () => {
            const emoteSlider = document.getElementById('emote-slider');
            const emoteValue = document.getElementById('emote-value');
            
            // Load saved settings
            const savedEmotes = localStorage.getItem('clean-emote-capacity') || '4';
            emoteSlider.value = savedEmotes;
            emoteValue.textContent = savedEmotes;
            window.modSettings.emoteCapacity = parseInt(savedEmotes);
            
            // Emote slider
            emoteSlider.addEventListener('input', (e) => {
                const value = e.target.value;
                emoteValue.textContent = value;
                window.modSettings.emoteCapacity = parseInt(value);
                localStorage.setItem('clean-emote-capacity', value);
            });
            
            // Auto-expand after load
            setTimeout(() => {
                toggleUI();
            }, 800);
        });
    </script>
    </body>`;

    src = src.replace('</body>', modernUI);
    checkSrcChange();

    log("FOV mod with modern UI injected");
    return src;
}

/* Custom Emote Mod (keeping original emotes) */
function emoteInjector(sbCode) {
    let src = sbCode;
    let prevSrc = src;
    
    function checkSrcChange() {
        if (src === prevSrc) throw new Error("Emote replace did not work");
        prevSrc = src;
    }

    const vocabPattern = /(this\.vocabulary\s*=\s*\[[\s\S]*?\})/;
    // Keep the original emotes from your script
    const originalEmotes = `,{
        text: "orosbu cocu",
        icon: "🤡",
        key: "J"
    },{
        text: "sikerim",
        icon: "⚠️",
        key: "V"
    }`;

    src = src.replace(vocabPattern, `$1${originalEmotes}`);
    checkSrcChange();
    
    log("Original custom emotes injected");
    return src;
}

/* Lowercase Name Mod */
function nameInjector(sbCode) {
    let src = sbCode;
    let prevSrc = src;
    
    function checkSrcChange() {
        if (src === prevSrc) throw new Error("Name replace did not work");
        prevSrc = src;
    }

    src = src.replace(/\.toUpperCase\(\)/g, "");
    const nameStyle = `
    <style>
        #player input { text-transform: none !important; }
    </style>`;
    
    src = src.replace('</head>', `${nameStyle}</head>`);
    checkSrcChange();

    log("Lowercase name mod injected");
    return src;
}

/* Register all injectors */
window.sbCodeInjectors.push((sbCode) => {
    try {
        return fovInjector(sbCode);
    } catch (error) {
        alert(`FOV mod failed to load: ${error}`);
        throw error;
    }
});

window.sbCodeInjectors.push((sbCode) => {
    try {
        return emoteInjector(sbCode);
    } catch (error) {
        alert(`Emote mod failed to load: ${error}`);
        throw error;
    }
});

window.sbCodeInjectors.push((sbCode) => {
    try {
        return nameInjector(sbCode);
    } catch (error) {
        alert(`Name mod failed to load: ${error}`);
        throw error;
    }
});

/* Start injection */
setTimeout(injectLoader, 10);
log("Clean Starblast Mod initialized! 🚀");
