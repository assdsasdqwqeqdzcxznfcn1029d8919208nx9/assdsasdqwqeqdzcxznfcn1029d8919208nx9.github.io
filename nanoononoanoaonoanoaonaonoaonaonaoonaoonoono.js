// Starblast Control Panel Injector
// This should be integrated into your existing injection system

function injectControlPanel() {
    // Create and inject CSS
    const css = `
        /* Control Panel Styles */
        #starblast-control-panel {
            position: fixed;
            top: 16px;
            left: 16px;
            z-index: 10000;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            user-select: none;
            background: rgba(0, 0, 0, 0.85);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border-radius: 6px;
            border: 1px solid rgba(255, 255, 255, 0.08);
            color: #ffffff;
            padding: 0;
            min-width: 140px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
            transition: all 0.2s ease;
        }

        #starblast-control-panel:hover {
            background: rgba(0, 0, 0, 0.9);
            border-color: rgba(255, 255, 255, 0.12);
        }

        #panel-header {
            cursor: pointer;
            padding: 10px 14px;
            background: rgba(255, 255, 255, 0.03);
            font-weight: 500;
            font-size: 12px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid rgba(255, 255, 255, 0.06);
            transition: background 0.2s ease;
        }

        #panel-header:hover {
            background: rgba(255, 255, 255, 0.05);
        }

        .header-title {
            color: #ffffff;
            opacity: 0.9;
        }

        .collapse-icon {
            font-size: 10px;
            color: rgba(255, 255, 255, 0.6);
            transition: transform 0.2s ease;
        }

        #panel-content.collapsed + #panel-header .collapse-icon {
            transform: rotate(-90deg);
        }

        #panel-content {
            padding: 12px 14px;
            transition: all 0.2s ease;
            overflow: hidden;
        }

        #panel-content.collapsed {
            height: 0;
            padding: 0 14px;
        }

        .control-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 0 0 12px 0;
            font-size: 11px;
            color: rgba(255, 255, 255, 0.8);
        }

        .control-row:last-child {
            margin-bottom: 0;
        }

        .control-label {
            font-weight: 400;
            opacity: 0.9;
        }

        .toggle-switch {
            position: relative;
            width: 32px;
            height: 18px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 9px;
            cursor: pointer;
            transition: all 0.2s ease;
            border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .toggle-switch.active {
            background: rgba(99, 102, 241, 0.8);
            border-color: rgba(99, 102, 241, 0.3);
        }

        .toggle-switch::after {
            content: '';
            position: absolute;
            top: 1px;
            left: 1px;
            width: 14px;
            height: 14px;
            background: #ffffff;
            border-radius: 50%;
            transition: transform 0.2s ease;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
        }

        .toggle-switch.active::after {
            transform: translateX(14px);
        }

        .slider-container {
            width: 100%;
            margin: 8px 0 12px 0;
        }

        .slider-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 6px;
        }

        .slider-value {
            font-weight: 500;
            color: rgba(99, 102, 241, 1);
            font-size: 11px;
            min-width: 20px;
            text-align: right;
        }

        .control-slider {
            width: 100%;
            height: 2px;
            background: rgba(255, 255, 255, 0.08);
            -webkit-appearance: none;
            appearance: none;
            outline: none;
            border-radius: 1px;
            cursor: pointer;
        }

        .control-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 14px;
            height: 14px;
            background: rgba(99, 102, 241, 1);
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 1px 4px rgba(99, 102, 241, 0.4);
            transition: all 0.1s ease;
        }

        .control-slider::-webkit-slider-thumb:hover {
            transform: scale(1.1);
            box-shadow: 0 2px 8px rgba(99, 102, 241, 0.6);
        }

        .control-slider::-moz-range-thumb {
            width: 14px;
            height: 14px;
            background: rgba(99, 102, 241, 1);
            border-radius: 50%;
            cursor: pointer;
            border: none;
        }

        .color-picker {
            width: 24px;
            height: 18px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 3px;
            padding: 0;
            cursor: pointer;
            background: transparent;
            transition: border-color 0.2s ease;
        }

        .color-picker:hover {
            border-color: rgba(255, 255, 255, 0.2);
        }

        #fov-display {
            padding: 8px 0 0 0;
            font-size: 10px;
            color: rgba(255, 255, 255, 0.6);
            border-top: 1px solid rgba(255, 255, 255, 0.06);
            margin-top: 8px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .fov-value {
            color: rgba(99, 102, 241, 1);
            font-weight: 500;
        }

        .status-dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: rgba(34, 197, 94, 1);
            margin-left: 6px;
            box-shadow: 0 0 4px rgba(34, 197, 94, 0.4);
        }

        #fov-overlay {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 500;
            display: none;
            z-index: 10001;
            backdrop-filter: blur(4px);
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
            to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }

        #fov-overlay.show {
            animation: fadeIn 0.2s ease;
        }
    `;

    // Inject CSS
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    // Create control panel HTML
    const panelHTML = `
        <div id="starblast-control-panel">
            <div id="panel-header">
                <span class="header-title">MODS</span>
                <span class="collapse-icon">▼</span>
                <div class="status-dot"></div>
            </div>
            <div id="panel-content">
                <div class="control-row">
                    <span class="control-label">FOV</span>
                    <div class="toggle-switch" id="fov-toggle"></div>
                </div>
                
                <div class="slider-container">
                    <div class="slider-row">
                        <span class="control-label">Emotes</span>
                        <span class="slider-value" id="emote-value">3</span>
                    </div>
                    <input type="range" min="1" max="5" value="3" class="control-slider" id="emote-slider">
                </div>
                
                <div class="control-row">
                    <span class="control-label">Radar+</span>
                    <div class="toggle-switch" id="radar-toggle"></div>
                </div>
                
                <div class="control-row">
                    <span class="control-label">Crystal</span>
                    <input type="color" class="color-picker" id="crystal-color" value="#ffffff">
                </div>
                
                <div class="control-row">
                    <span class="control-label">Timer</span>
                    <div class="toggle-switch" id="timer-toggle"></div>
                </div>
                
                <div id="fov-display">
                    <span>FOV</span>
                    <span class="fov-value" id="fov-value">45°</span>
                </div>
            </div>
        </div>

        <div id="fov-overlay">FOV: 45°</div>
    `;

    // Inject HTML
    document.body.insertAdjacentHTML('beforeend', panelHTML);

    // Initialize control panel functionality
    initializeControlPanel();
}

function initializeControlPanel() {
    // Settings management
    const settings = {
        fov: { enabled: localStorage.getItem('fovCheckboxState') === 'true', value: 45 },
        emotes: parseInt(localStorage.getItem('emoteCapacity')) || 3,
        radar: localStorage.getItem('radar_yknlg') === '1',
        crystal: localStorage.getItem('crystal-color') || '#ffffff',
        timer: localStorage.getItem('timerCheckboxChecked') === 'true',
        panelCollapsed: localStorage.getItem('panelCollapsed') === 'true'
    };

    // DOM elements
    const elements = {
        header: document.getElementById('panel-header'),
        content: document.getElementById('panel-content'),
        fovToggle: document.getElementById('fov-toggle'),
        emoteSlider: document.getElementById('emote-slider'),
        emoteValue: document.getElementById('emote-value'),
        radarToggle: document.getElementById('radar-toggle'),
        crystalColor: document.getElementById('crystal-color'),
        timerToggle: document.getElementById('timer-toggle'),
        fovDisplay: document.getElementById('fov-value'),
        fovOverlay: document.getElementById('fov-overlay')
    };

    // Initialize UI state
    function initializeUI() {
        elements.fovToggle.classList.toggle('active', settings.fov.enabled);
        elements.emoteSlider.value = settings.emotes;
        elements.emoteValue.textContent = settings.emotes;
        elements.radarToggle.classList.toggle('active', settings.radar);
        elements.crystalColor.value = settings.crystal;
        elements.timerToggle.classList.toggle('active', settings.timer);
        
        if (settings.panelCollapsed) {
            elements.content.classList.add('collapsed');
        }
    }

    // Event listeners
    elements.header.addEventListener('click', function() {
        const isCollapsed = elements.content.classList.toggle('collapsed');
        settings.panelCollapsed = isCollapsed;
        localStorage.setItem('panelCollapsed', isCollapsed);
    });

    elements.fovToggle.addEventListener('click', function() {
        settings.fov.enabled = !settings.fov.enabled;
        this.classList.toggle('active', settings.fov.enabled);
        localStorage.setItem('fovCheckboxState', settings.fov.enabled);
    });

    elements.emoteSlider.addEventListener('input', function() {
        settings.emotes = parseInt(this.value);
        elements.emoteValue.textContent = settings.emotes;
        localStorage.setItem('emoteCapacity', settings.emotes);
    });

    elements.radarToggle.addEventListener('click', function() {
        settings.radar = !settings.radar;
        this.classList.toggle('active', settings.radar);
        localStorage.setItem('radar_yknlg', settings.radar ? '1' : '4');
    });

    elements.crystalColor.addEventListener('change', function() {
        settings.crystal = this.value;
        localStorage.setItem('crystal-color', this.value);
    });

    elements.timerToggle.addEventListener('click', function() {
        settings.timer = !settings.timer;
        this.classList.toggle('active', settings.timer);
        localStorage.setItem('timerCheckboxChecked', settings.timer);
    });

    // FOV control with mouse wheel
    let fovTimeout;
    document.addEventListener('wheel', function(e) {
        if (!settings.fov.enabled) return;
        
        e.preventDefault();
        if (e.deltaY < 0) {
            settings.fov.value = Math.max(10, settings.fov.value - 1);
        } else {
            settings.fov.value = Math.min(190, settings.fov.value + 1);
        }
        
        elements.fovDisplay.textContent = settings.fov.value + '°';
        elements.fovOverlay.textContent = `FOV: ${settings.fov.value}°`;
        
        elements.fovOverlay.style.display = 'block';
        elements.fovOverlay.classList.add('show');
        
        clearTimeout(fovTimeout);
        fovTimeout = setTimeout(() => {
            elements.fovOverlay.style.display = 'none';
            elements.fovOverlay.classList.remove('show');
        }, 2000);
    });

    // FOV reset with F11
    document.addEventListener('keydown', function(e) {
        if (!settings.fov.enabled || e.key !== 'F11') return;
        
        e.preventDefault();
        settings.fov.value = 45;
        elements.fovDisplay.textContent = '45°';
        elements.fovOverlay.textContent = 'FOV: 45°';
        
        elements.fovOverlay.style.display = 'block';
        elements.fovOverlay.classList.add('show');
        
        clearTimeout(fovTimeout);
        fovTimeout = setTimeout(() => {
            elements.fovOverlay.style.display = 'none';
            elements.fovOverlay.classList.remove('show');
        }, 2000);
    });

    // Initialize UI
    initializeUI();

    // Export settings globally for game integration
    window.modSettings = settings;
    
    console.log('%c[MODS] Control panel initialized', 'color: #6366f1');
}

// Integration with your existing injection system
// Add this to your sbCodeInjectors array:
if (!window.sbCodeInjectors) {
    window.sbCodeInjectors = [];
}

window.sbCodeInjectors.push(function(gameCode) {
    // Inject the control panel after game loads
    setTimeout(() => {
        injectControlPanel();
    }, 1000);
    
    // Return the unmodified game code
    return gameCode;
});

// Auto-initialize if this script runs after game load
if (document.readyState === 'complete') {
    setTimeout(() => {
        if (!document.getElementById('starblast-control-panel')) {
            injectControlPanel();
        }
    }, 1000);
}
