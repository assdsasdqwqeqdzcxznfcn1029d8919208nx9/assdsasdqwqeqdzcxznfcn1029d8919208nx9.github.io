(function () {
  // === 1. Initialize Global Variables ===
  let fovdegeri = 45;
  let radaryakinlastirmasi = localStorage.getItem('radar_yknlg') || 4;
  let CrystalObject;

  // === 2. Inject CSS ===
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

  // === 3. Inject HTML Panel ===
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

  // === 4. Initialize Crystal Object Detection ===
  function findCrystalObject() {
    for (let i in window) {
      try {
        let val = window[i];
        if (
          'function' == typeof val.prototype.createModel &&
          val.prototype.createModel.toString().includes('Crystal')
        ) {
          CrystalObject = val;
          break;
        }
      } catch (e) {}
    }
    
    if (CrystalObject) {
      let oldModel = CrystalObject.prototype.getModelInstance;
      let getCustomCrystalColor = function () {
        return localStorage.getItem('crystal-color') || '';
      };
      
      CrystalObject.prototype.getModelInstance = function () {
        let result = oldModel.apply(this, arguments);
        let customColor = getCustomCrystalColor();
        if (customColor) {
          this.material.color.set(customColor);
        }
        return result;
      };
    }
  }

  // === 5. FOV Functions ===
  function showFov(value) {
    const fovDisplay = document.getElementById('fovDisplay');
    const panelFovDisplay = document.getElementById('fov-value');
    
    if (fovDisplay) {
      fovDisplay.textContent = value;
      fovDisplay.style.display = 'block';
      setTimeout(function () {
        fovDisplay.style.display = 'none';
      }, 3000);
    }
    
    if (panelFovDisplay) {
      panelFovDisplay.textContent = value + '°';
    }
  }

  // === 6. Timer Functions ===
  function initializeTimer() {
    const timeInfo = document.getElementById('timeInfo');
    if (!timeInfo) return;

    let timerInterval;
    let fetchInterval;
    let timeRemaining = 0;
    let timerStarted = false;
    let retryCount = 0;

    function startTimer(systemId) {
      if (!timerInterval) {
        fetchSystemTime(systemId);
        timerInterval = setInterval(() => fetchSystemTime(systemId), 10000);
      }
      if (!fetchInterval) {
        fetchInterval = setInterval(updateTimer, 1000);
      }
    }

    function stopTimer() {
      clearInterval(timerInterval);
      clearInterval(fetchInterval);
      timerInterval = null;
      fetchInterval = null;
      timeInfo.textContent = '';
    }

    function fetchSystemTime(systemId) {
      if (timerStarted) {
        console.clear();
        return;
      }

      if (!systemId) {
        const url = window.location.href;
        const match = url.match(/#(\d+)/);
        systemId = match ? match[1] : null;
      }

      if (!systemId) {
        setTimeout(() => fetchSystemTime(systemId), 5000);
        return;
      }

      fetch('https://starblast.io/simstatus.json')
        .then(response => response.json())
        .then(data => {
          for (let region of data) {
            const systems = region.systems;
            if (systems) {
              for (let i = 0; i < systems.length; i++) {
                if (systems[i].id === parseInt(systemId)) {
                  const systemTime = systems[i].time;
                  const timeDiff = systemTime / 60 - 30;
                  timeRemaining = Math.abs(timeDiff) * 60;
                  updateTimer();
                  timerStarted = true;
                  console.clear();
                  break;
                }
              }
            }
            if (timerStarted) break;
          }

          if (!timerStarted) {
            console.log('System ID not found in API data');
            retryCount++;
            if (retryCount < 7) {
              setTimeout(() => fetchSystemTime(systemId), 5000);
            } else {
              console.error('Exceeded retry attempts, stopping further retries.');
            }
          }
        })
        .catch(error => {
          console.error('Error:', error);
          setTimeout(() => fetchSystemTime(systemId), 5000);
        });
    }

    function updateTimer() {
      if (timeRemaining > 0) {
        timeRemaining--;
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        const minutesDisplay = String(minutes).padStart(2, '0').slice(0, 2);
        const secondsDisplay = String(seconds).padStart(2, '0').slice(0, 2);
        timeInfo.textContent = 'Hkm: ' + minutesDisplay + ':' + secondsDisplay;
      }
    }

    // Start timer automatically if needed
    const timerCheckbox = document.getElementById('timerCheckbox');
    if (timerCheckbox && timerCheckbox.checked) {
      startTimer();
    }

    return { startTimer, stopTimer };
  }

  // === 7. Background Functions ===
  function initializeBackground() {
    const particlesJs = document.getElementById('particles-js');
    const backgroundLinkInput = document.getElementById('backgroundLinkInput');
    const applyBackground = document.getElementById('applyBackground');
    const playButton = document.getElementById('play');
    const customBackground = localStorage.getItem('customBackground');

    if (customBackground && particlesJs) {
      particlesJs.style.backgroundImage = 'url("' + customBackground + '")';
    }

    if (applyBackground && backgroundLinkInput && particlesJs) {
      applyBackground.addEventListener('click', function () {
        const backgroundUrl = backgroundLinkInput.value;
        if (backgroundUrl && 
            (backgroundUrl.endsWith('.png') || 
             backgroundUrl.endsWith('.jpg') || 
             backgroundUrl.endsWith('.gif'))) {
          localStorage.setItem('customBackground', backgroundUrl);
          particlesJs.style.backgroundImage = 'url("' + backgroundUrl + '")';
        } else if (backgroundUrl.trim() === '') {
          particlesJs.style.backgroundImage = '';
          localStorage.removeItem('customBackground');
        } else {
          alert('Arkaplan kaldırıldı');
        }
      });
    }

    if (playButton && particlesJs) {
      playButton.addEventListener('click', function () {
        particlesJs.style.backgroundImage = '';
      });
    }

    const moddingSpace = document.querySelector('#moddingspace');
    if (moddingSpace && particlesJs) {
      moddingSpace.addEventListener('click', function () {
        particlesJs.style.backgroundImage = '';
      });
    }

    document.addEventListener('restoreBackground', function () {
      const savedBackground = localStorage.getItem('customBackground');
      if (savedBackground && particlesJs) {
        particlesJs.style.backgroundImage = 'url("' + savedBackground + '")';
      } else if (particlesJs) {
        particlesJs.style.backgroundImage = '';
      }
    });
  }

  // === 8. Initialize Panel After DOM Load ===
  function initializePanel() {
    // Wait for original elements to be available
    const checkElements = setInterval(() => {
      const fovCheckbox = document.getElementById('fovCheckbox');
      const timerCheckbox = document.getElementById('timerCheckbox');
      const lowercaseCheckbox = document.getElementById('lowercaseCheckbox');
      
      if (fovCheckbox && timerCheckbox && lowercaseCheckbox) {
        clearInterval(checkElements);
        setupPanel(fovCheckbox, timerCheckbox, lowercaseCheckbox);
      }
    }, 100);
  }

  function setupPanel(fovCheckbox, timerCheckbox, lowercaseCheckbox) {
    // Settings object
    const settings = {
      fov: { 
        enabled: localStorage.getItem('fovCheckboxState') === 'true', 
        value: fovdegeri 
      },
      emotes: parseInt(localStorage.getItem('emoteCapacity')) || 3,
      radar: radaryakinlastirmasi == 1,
      crystal: localStorage.getItem('crystal-color') || '#ffffff',
      lowercase: localStorage.getItem('lowercaseEnabled') === 'true',
      timer: localStorage.getItem('timerCheckboxChecked') === 'true',
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

    // Initialize original checkboxes
    fovCheckbox.checked = settings.fov.enabled;
    timerCheckbox.checked = settings.timer;
    lowercaseCheckbox.checked = settings.lowercase;

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

      // Apply lowercase setting
      const playerInput = document.querySelector('#player input');
      if (playerInput) {
        if (settings.lowercase) {
          playerInput.classList.add('lowercase');
        } else {
          playerInput.classList.remove('lowercase');
        }
      }
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
      fovCheckbox.checked = settings.fov.enabled;
      localStorage.setItem('fovCheckboxState', settings.fov.enabled);
    });

// === Custom Emote Capacity Handling ===
el.emoteSlider.addEventListener('input', function () {
  const newCapacity = Math.max(1, Math.min(5, parseInt(this.value, 10) || 4));
  settings.emotes = newCapacity;
  el.emoteValue.textContent = newCapacity;
  localStorage.setItem('chat_emotes_capacity', JSON.stringify(newCapacity));

  // Custom override of emote capacity logic
  const patchInterval = setInterval(() => {
    if (typeof ChatPanel === 'function') {
      // Identify the hidden settings accessor key (e.g., "lOOI1" etc.)
      const globalVal = ChatPanel.toString().match(/[0OlI1]{5}/)?.[0];

      if (!globalVal) return;

      // Patch ChatPanel.prototype.getEmotesCapacity
      ChatPanel.prototype.getEmotesCapacity = function () {
        return settings.emotes;
      };

      // Patch .typed function to respect new capacity
      if (typeof ChatPanel.prototype.typed === 'function') {
        ChatPanel.prototype.typed = Function(
          'return ' +
            ChatPanel.prototype.typed
              .toString()
              .replace(/>=\s*4/, '>= this.getEmotesCapacity()')
        )();
      }

      console.log('[✔] Emote capacity patched to', newCapacity);
      clearInterval(patchInterval);
    }
  }, 300);
});




    el.radarToggle.addEventListener('click', () => {
      settings.radar = !settings.radar;
      el.radarToggle.classList.toggle('active', settings.radar);
      const radarValue = settings.radar ? 1 : 4;
      localStorage.setItem('radar_yknlg', radarValue);
      radaryakinlastirmasi = radarValue;
      location.reload();
    });

    el.crystalColorUI.addEventListener('change', function () {
      settings.crystal = this.value;
      localStorage.setItem('crystal-color', this.value);
    });

    el.lowercaseToggle.addEventListener('click', () => {
      settings.lowercase = !settings.lowercase;
      el.lowercaseToggle.classList.toggle('active', settings.lowercase);
      lowercaseCheckbox.checked = settings.lowercase;
      localStorage.setItem('lowercaseEnabled', settings.lowercase);
      
      const playerInput = document.querySelector('#player input');
      if (playerInput) {
        if (settings.lowercase) {
          playerInput.classList.add('lowercase');
        } else {
          playerInput.classList.remove('lowercase');
        }
      }
    });

    el.timerToggle.addEventListener('click', () => {
      settings.timer = !settings.timer;
      el.timerToggle.classList.toggle('active', settings.timer);
      timerCheckbox.checked = settings.timer;
      localStorage.setItem('timerCheckboxChecked', settings.timer);
      
      const herseyburada = document.getElementById('herseyburada');
      if (herseyburada) {
        if (settings.timer) {
          herseyburada.style.display = 'inline-block';
        } else {
          herseyburada.style.display = 'none';
        }
      }
    });

    // FOV wheel event with proper passive handling
    document.addEventListener('wheel', function (e) {
      if (!settings.fov.enabled) return;
      
      // Prevent default only if we can
      if (e.cancelable) {
        e.preventDefault();
      }
      
      if (e.deltaY < 0) {
        fovdegeri -= 1;
      } else {
        fovdegeri += 1;
      }
      
      fovdegeri = Math.max(10, Math.min(fovdegeri, 190));
      
      if (window.lOOI1) {
        window.lOOI1.fov = fovdegeri;
      }
      
      settings.fov.value = fovdegeri;
      window.fovdegeri = fovdegeri;
      showFov(fovdegeri);
    }, { passive: false });

    // FOV F11 key event
    document.addEventListener('keydown', function (e) {
      if (!settings.fov.enabled) return;
      
      if (e.key === 'F11') {
        fovdegeri = 45;
        if (window.lOOI1) {
          window.lOOI1.fov = fovdegeri;
        }
        settings.fov.value = fovdegeri;
        window.fovdegeri = fovdegeri;
        showFov(fovdegeri);
      }
    });

    // Monitor FOV changes
    function updateFOVDisplay() {
      if (window.fovdegeri !== undefined && window.fovdegeri !== settings.fov.value) {
        settings.fov.value = window.fovdegeri;
        el.fovDisplay.textContent = window.fovdegeri + '°';
      }
    }

    // Initialize and start monitoring
    initUI();
    setInterval(updateFOVDisplay, 100);

    // Make available globally
    window.modSettings = settings;
    window.controlPanelElements = el;
    window.fovdegeri = fovdegeri;
    
    console.log('%c[s] Control Panel Loaded & Synced', 'color:#6366f1');
  }

  // === 9. Menu Functions ===
  function initializeMenus() {
    // Alt+A menu toggle
    document.addEventListener('keydown', function (e) {
      if (e.altKey && e.key === 'a') {
        const gizliMenu = document.getElementById('gizlimenu');
        if (gizliMenu) {
          if (gizliMenu.style.display === 'none' || gizliMenu.style.display === '') {
            gizliMenu.style.display = 'block';
          } else {
            gizliMenu.style.display = 'none';
          }
        }
      }
    });

    // Mod edit link
    const modEdtLink = document.getElementById('modEdtLink');
    if (modEdtLink) {
      modEdtLink.addEventListener('click', function () {
        const gizliMenu = document.getElementById('gizlimenu');
        if (gizliMenu) {
          if (gizliMenu.style.display === 'none' || gizliMenu.style.display === '') {
            gizliMenu.style.display = 'block';
          } else {
            gizliMenu.style.display = 'none';
          }
        }
      });
    }

    // Close menu
    const closeMenu = document.getElementById('closeMenu');
    if (closeMenu) {
      closeMenu.addEventListener('click', function () {
        const gizliMenu = document.getElementById('gizlimenu');
        if (gizliMenu) {
          gizliMenu.style.display = 'none';
        }
      });
    }
  }

  // === 10. Play Button Timer Handler ===
  function initializePlayButton() {
    const playButton = document.getElementById('play');
    if (playButton) {
      playButton.addEventListener('click', function () {
        const timerCheckbox = document.getElementById('timerCheckbox');
        if (timerCheckbox && timerCheckbox.checked) {
          const herseyburada = document.getElementById('herseyburada');
          if (herseyburada) {
            if (herseyburada.style.display === 'none' || herseyburada.style.display === '') {
              herseyburada.style.display = 'inline-block';
            } else {
              herseyburada.style.display = 'none';
            }
          }
        }
      });
    }
  }

  // === 11. Main Initialization ===
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(() => {
        findCrystalObject();
        initializeTimer();
        initializeBackground();
        initializeMenus();
        initializePlayButton();
        initializePanel();
      }, 100);
    });
  } else {
    setTimeout(() => {
      findCrystalObject();
      initializeTimer();
      initializeBackground();
      initializeMenus();
      initializePlayButton();
      initializePanel();
    }, 100);
  }

  // === 12. Window Load Handler for Radar ===
  window.addEventListener('load', function () {
    const radarEnabled = radaryakinlastirmasi == 1;
    const sSlider = document.querySelector('.s-slider');
    if (sSlider) {
      sSlider.checked = radarEnabled;
    }
  });
})();
