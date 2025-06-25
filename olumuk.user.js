
(function () {
  // === 1. Inject CSS ===
  const style = document.createElement('style');
  style.textContent = `
    #control-panel {
      position: fixed;
      top: 16px;
      left: 16px;
      z-index: 1000;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      user-select: none;
      background: rgba(0, 0, 0, 0.85);
      backdrop-filter: blur(10px);
      border-radius: 6px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      color: #ffffff;
      min-width: 140px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
      transition: all 0.2s ease;
    }

    #control-panel:hover {
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
    }

    .header-left {
      display: flex;
      align-items: center;
    }

    .header-title {
      opacity: 0.9;
    }

    .status-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: rgba(34, 197, 94, 1);
      margin-left: 8px;
      box-shadow: 0 0 4px rgba(34, 197, 94, 0.4);
    }

    .collapse-icon {
      font-size: 10px;
      color: rgba(255, 255, 255, 0.6);
      transition: transform 0.2s ease;
    }

    .collapse-icon.collapsed {
      transform: rotate(-90deg);
    }

    #panel-content {
      max-height: 300px;
      padding: 12px 14px;
      transition: all 0.3s ease;
      overflow: hidden;
    }

    #panel-content.collapsed {
      max-height: 0;
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
      background: rgba(255, 255, 255, 0.8);
      border-color: rgba(255, 255, 255, 0.8);
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
      color: rgba(255, 255, 255, 0.8);
      font-size: 10px;
      min-width: 15px;
      text-align: right;
    }
  .slider-row .control-label {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.8);
    font-weight: 400;
    opacity: 0.9;
  }

    .control-slider {
      width: 100%;
      height: 2px;
      background: rgba(255, 255, 255, 0.08);
      appearance: none;
      outline: none;
      border-radius: 1px;
      cursor: pointer;
    }

    .control-slider::-webkit-slider-thumb {
      appearance: none;
      width: 14px;
      height: 14px;
      background: rgba(255, 255, 255, 0.8);
      border-radius: 50%;
      cursor: pointer;
      box-shadow: 0 1px 4px rgba(255, 255, 255, 0.8);
      transition: all 0.1s ease;
    }

    .control-slider::-webkit-slider-thumb:hover {
      transform: scale(1.1);
      box-shadow: 0 2px 8px rrgba(255, 255, 255, 0.8);
    }

    .color-picker {
      width: 24px;
      height: 18px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 3px;
      padding: 0;
      cursor: pointer;
      background: transparent;
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
      color: rgba(255, 255, 255, 0.8);
      font-weight: 500;
    }

    /* optimizaionoitnooa */
    .battle-mode .control-label {
      font-weight: 500;
      color: rgba(255, 255, 255, 0.95);
    }
    
    .battle-mode .slider-value {
      font-size: 11px;
      font-weight: 600;
    }
    
    .battle-mode .fov-value {
      font-size: 11px;
      font-weight: 600;
    }
  `;
  document.head.appendChild(style);

  // === 2. Inject HTML Panel ===
  const panelHTML = `
    <div id="control-panel">
      <div id="panel-header">
        <div class="header-left">
          <span class="header-title">xd</span>
          <div class="status-dot"></div>
        </div>
        <span class="collapse-icon">▼</span>
      </div>
      <div id="panel-content">
        <div class="control-row">
          <span class="control-label">Field of View</span>
          <div class="toggle-switch" id="fov-toggle"></div>
        </div>
        <div class="slider-container">
          <div class="slider-row">
            <span class="control-label">Emote Slots</span>
            <span class="slider-value" id="emote-value">3</span>
          </div>
          <input type="range" min="1" max="5" value="3" class="control-slider" id="emote-slider">
        </div>
        <div class="control-row">
          <span class="control-label">Radar+</span>
          <div class="toggle-switch" id="radar-toggle"></div>
        </div>
        <div class="control-row">
          <span class="control-label">Crystal Color</span>
          <input type="color" class="color-picker" id="crystal-color" value="#ffffff">
        </div>
        <div class="control-row">
          <span class="control-label">Timer</span>
          <div class="toggle-switch" id="timer-toggle"></div>
        </div>
        <div id="fov-display">
          <span>Current FOV</span>
          <span class="fov-value" id="fov-value">45°</span>
        </div>
      </div>
    </div>
    <div id="fov-overlay" style="display:none;
      position:fixed;
      top:50%;
      left:50%;
      transform:translate(-50%, -50%);
      background:rgba(0,0,0,0.9);
      color:#fff;
      padding:12px 20px;
      border-radius:8px;
      font-size:16px;
      font-weight:600;
      z-index:1001;
      border: 1px solid rgba(255, 255, 255, 0.8);">FOV: 45°</div>
  `;
  const wrapper = document.createElement('div');
  wrapper.innerHTML = panelHTML;
  document.body.appendChild(wrapper);

  // === 3. Settings Object ===
  const settings = {
    fov: { enabled: localStorage.getItem('fovCheckboxState') === 'true', value: 45 },
    emotes: parseInt(localStorage.getItem('emoteCapacity')) || 3,
    radar: localStorage.getItem('radar_yknlg') === '1',
    crystal: localStorage.getItem('crystal-color') || '#ffffff',
    timer: localStorage.getItem('timerCheckboxChecked') === 'true',
    panelCollapsed: localStorage.getItem('panelCollapsed') === 'true'
  };

  // === 4. DOM References ===
  const el = {
    panel: document.getElementById('control-panel'),
    header: document.getElementById('panel-header'),
    content: document.getElementById('panel-content'),
    collapseIcon: document.querySelector('.collapse-icon'),
    fovToggle: document.getElementById('fov-toggle'),
    emoteSlider: document.getElementById('emote-slider'),
    emoteValue: document.getElementById('emote-value'),
    radarToggle: document.getElementById('radar-toggle'),
    crystalColor: document.getElementById('crystal-color'),
    timerToggle: document.getElementById('timer-toggle'),
    fovDisplay: document.getElementById('fov-value'),
    fovOverlay: document.getElementById('fov-overlay')
  };

  // === 5. Init UI ===
  function initPanel() {
    el.fovToggle.classList.toggle('active', settings.fov.enabled);
    el.emoteSlider.value = settings.emotes;
    el.emoteValue.textContent = settings.emotes;
    el.radarToggle.classList.toggle('active', settings.radar);
    el.crystalColor.value = settings.crystal;
    el.timerToggle.classList.toggle('active', settings.timer);
    el.fovDisplay.textContent = settings.fov.value + '°';
    
    // Set initial collapsed state
    if (settings.panelCollapsed) {
      el.content.classList.add('collapsed');
      el.collapseIcon.classList.add('collapsed');
    }
    
    // Add battle mode class for better readability
    el.panel.classList.add('battle-mode');
  }

  // === 6. Event Bindings ===
  el.header.addEventListener('click', () => {
    const isCollapsed = el.content.classList.toggle('collapsed');
    el.collapseIcon.classList.toggle('collapsed', isCollapsed);
    settings.panelCollapsed = isCollapsed;
    localStorage.setItem('panelCollapsed', isCollapsed);
  });

  el.fovToggle.addEventListener('click', () => {
    settings.fov.enabled = !settings.fov.enabled;
    el.fovToggle.classList.toggle('active', settings.fov.enabled);
    localStorage.setItem('fovCheckboxState', settings.fov.enabled);
  });

  el.emoteSlider.addEventListener('input', function () {
    settings.emotes = parseInt(this.value);
    el.emoteValue.textContent = this.value;
    localStorage.setItem('emoteCapacity', this.value);
  });

  el.radarToggle.addEventListener('click', () => {
    settings.radar = !settings.radar;
    el.radarToggle.classList.toggle('active', settings.radar);
    localStorage.setItem('radar_yknlg', settings.radar ? '1' : '4');
  });

  el.crystalColor.addEventListener('change', function () {
    settings.crystal = this.value;
    localStorage.setItem('crystal-color', this.value);
  });

  el.timerToggle.addEventListener('click', () => {
    settings.timer = !settings.timer;
    el.timerToggle.classList.toggle('active', settings.timer);
    localStorage.setItem('timerCheckboxChecked', settings.timer);
  });

  // === 7. FOV Wheel + Reset Support ===
  let fovTimeout;
  document.addEventListener('wheel', function (e) {
    if (!settings.fov.enabled) return;
    e.preventDefault();

    if (e.deltaY < 0) settings.fov.value = Math.max(10, settings.fov.value - 1);
    else settings.fov.value = Math.min(190, settings.fov.value + 1);

    el.fovDisplay.textContent = settings.fov.value + '°';
    el.fovOverlay.textContent = `FOV: ${settings.fov.value}°`;
    el.fovOverlay.style.display = 'block';

    clearTimeout(fovTimeout);
    fovTimeout = setTimeout(() => {
      el.fovOverlay.style.display = 'none';
    }, 2000);
  }, { passive: false });

  document.addEventListener('keydown', function (e) {
    if (!settings.fov.enabled || e.key !== 'F11') return;
    e.preventDefault();
    settings.fov.value = 45;
    el.fovDisplay.textContent = '45°';
    el.fovOverlay.textContent = 'FOV: 45°';
    el.fovOverlay.style.display = 'block';

    clearTimeout(fovTimeout);
    fovTimeout = setTimeout(() => {
      el.fovOverlay.style.display = 'none';
    }, 2000);
  });

  // === 8. Initialize ===
  initPanel();
  window.modSettings = settings; // for game integration
  console.log('%c[s] Control Panel Loaded', 'color:#6366f1');
})();
