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
      box-shadow: 0 2px 8px rgba(255, 255, 255, 0.8);
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

    /* Lowercase CSS class */
    .lowercase {
      text-transform: lowercase !important;
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
          <input type="color" class="color-picker" id="crystal-color-ui" value="#ffffff">
        </div>
        <div class="control-row">
          <span class="control-label">Lowercase Names</span>
          <div class="toggle-switch" id="lowercase-toggle"></div>
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
  `;
  const wrapper = document.createElement('div');
  wrapper.innerHTML = panelHTML;
  document.body.appendChild(wrapper);

  // === 3. Wait for original elements to be available ===
  function waitForElements() {
    const fovCheckbox = document.getElementById('fovCheckbox');
    const timerCheckbox = document.getElementById('timerCheckbox');
    const lowercaseCheckbox = document.getElementById('lowercaseCheckbox');
    const radarSlider = document.querySelector('.s-slider');
    const crystalColorOriginal = document.querySelector('#crystal-color');
    
    if (!fovCheckbox || !timerCheckbox || !lowercaseCheckbox || !radarSlider) {
      setTimeout(waitForElements, 100);
      return;
    }
    
    initializePanel(fovCheckbox, timerCheckbox, lowercaseCheckbox, radarSlider, crystalColorOriginal);
  }

  // === 4. Initialize Panel ===
  function initializePanel(fovCheckbox, timerCheckbox, lowercaseCheckbox, radarSlider, crystalColorOriginal) {
    // Settings object
    const settings = {
      fov: { enabled: fovCheckbox.checked, value: window.fovdegeri || 45 },
      emotes: parseInt(localStorage.getItem('emoteCapacity')) || 3,
      radar: radarSlider.checked,
      crystal: localStorage.getItem('crystal-color') || '#ffffff',
      lowercase: lowercaseCheckbox.checked,
      timer: timerCheckbox.checked,
      panelCollapsed: localStorage.getItem('panelCollapsed') === 'true'
    };

    // DOM References
    const el = {
      panel: document.getElementById('control-panel'),
      header: document.getElementById('panel-header'),
      content: document.getElementById('panel-content'),
      collapseIcon: document.querySelector('.collapse-icon'),
      fovToggle: document.getElementById('fov-toggle'),
      emoteSlider: document.getElementById('emote-slider'),
      emoteValue: document.getElementById('emote-value'),
      radarToggle: document.getElementById('radar-toggle'),
      crystalColorUI: document.getElementById('crystal-color-ui'),
      lowercaseToggle: document.getElementById('lowercase-toggle'),
      timerToggle: document.getElementById('timer-toggle'),
      fovDisplay: document.getElementById('fov-value')
    };

    // Initialize UI state
    function initUI() {
      el.fovToggle.classList.toggle('active', settings.fov.enabled);
      el.emoteSlider.value = settings.emotes;
      el.emoteValue.textContent = settings.emotes;
      el.radarToggle.classList.toggle('active', settings.radar);
      el.crystalColorUI.value = settings.crystal;
      el.lowercaseToggle.classList.toggle('active', settings.lowercase);
      el.timerToggle.classList.toggle('active', settings.timer);
      el.fovDisplay.textContent = settings.fov.value + '°';
      
      if (settings.panelCollapsed) {
        el.content.classList.add('collapsed');
        el.collapseIcon.classList.add('collapsed');
      }
      
      el.panel.classList.add('battle-mode');
    }

    // Event handlers
    el.header.addEventListener('click', () => {
      const isCollapsed = el.content.classList.toggle('collapsed');
      el.collapseIcon.classList.toggle('collapsed', isCollapsed);
      settings.panelCollapsed = isCollapsed;
      localStorage.setItem('panelCollapsed', isCollapsed);
    });

    el.fovToggle.addEventListener('click', () => {
      settings.fov.enabled = !settings.fov.enabled;
      el.fovToggle.classList.toggle('active', settings.fov.enabled);
      // Trigger original checkbox
      fovCheckbox.checked = settings.fov.enabled;
      fovCheckbox.dispatchEvent(new Event('change'));
    });

    el.emoteSlider.addEventListener('input', function () {
      settings.emotes = parseInt(this.value);
      el.emoteValue.textContent = this.value;
      localStorage.setItem('emoteCapacity', this.value);
      
      // Try to find and update emote capacity in the game
      // This might need adjustment based on how emotes are handled in your game
      if (window.game && window.game.emoteCapacity !== undefined) {
        window.game.emoteCapacity = settings.emotes;
      }
      if (window.emoteCapacity !== undefined) {
        window.emoteCapacity = settings.emotes;
      }
    });

    el.radarToggle.addEventListener('click', () => {
      settings.radar = !settings.radar;
      el.radarToggle.classList.toggle('active', settings.radar);
      // Trigger original slider
      radarSlider.checked = settings.radar;
      radarSlider.dispatchEvent(new Event('change'));
    });

    el.crystalColorUI.addEventListener('change', function () {
      settings.crystal = this.value;
      // Update the original crystal color picker
      if (crystalColorOriginal) {
        crystalColorOriginal.value = this.value;
        crystalColorOriginal.dispatchEvent(new Event('change'));
      }
      // Also set localStorage directly since that's what the original script uses
      localStorage.setItem('crystal-color', this.value);
    });

    el.lowercaseToggle.addEventListener('click', () => {
      settings.lowercase = !settings.lowercase;
      el.lowercaseToggle.classList.toggle('active', settings.lowercase);
      // Trigger original checkbox
      lowercaseCheckbox.checked = settings.lowercase;
      lowercaseCheckbox.dispatchEvent(new Event('change'));
    });

    el.timerToggle.addEventListener('click', () => {
      settings.timer = !settings.timer;
      el.timerToggle.classList.toggle('active', settings.timer);
      // Trigger original checkbox
      timerCheckbox.checked = settings.timer;
      timerCheckbox.dispatchEvent(new Event('change'));
    });

    // Monitor FOV changes from the original script
    function updateFOVDisplay() {
      if (window.fovdegeri !== undefined && window.fovdegeri !== settings.fov.value) {
        settings.fov.value = window.fovdegeri;
        el.fovDisplay.textContent = window.fovdegeri + '°';
      }
    }

    // Monitor changes from original checkboxes
    function syncWithOriginal() {
      if (fovCheckbox.checked !== settings.fov.enabled) {
        settings.fov.enabled = fovCheckbox.checked;
        el.fovToggle.classList.toggle('active', settings.fov.enabled);
      }
      
      if (timerCheckbox.checked !== settings.timer) {
        settings.timer = timerCheckbox.checked;
        el.timerToggle.classList.toggle('active', settings.timer);
      }
      
      if (lowercaseCheckbox.checked !== settings.lowercase) {
        settings.lowercase = lowercaseCheckbox.checked;
        el.lowercaseToggle.classList.toggle('active', settings.lowercase);
      }
      
      if (radarSlider.checked !== settings.radar) {
        settings.radar = radarSlider.checked;
        el.radarToggle.classList.toggle('active', settings.radar);
      }
      
      updateFOVDisplay();
    }

    // Initialize and start monitoring
    initUI();
    setInterval(syncWithOriginal, 500);
    setInterval(updateFOVDisplay, 100);

    // Make available globally
    window.modSettings = settings;
    window.controlPanelElements = el;
    
    console.log('%c[s] Control Panel Loaded & Synced', 'color:#6366f1');
  }

  // Start initialization
  waitForElements();
})();
