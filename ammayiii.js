
(function() {
  'use strict';

  // --------------------------------------------------------------------------
  // 0) Bootstrap sbCodeInjectors and modSettings
  // --------------------------------------------------------------------------
  if (!window.sbCodeInjectors) window.sbCodeInjectors = [];
  window.modSettings = {
    fovEnabled:       true,
    emoteCapacity:    parseInt(localStorage.getItem('emote-capacity')) || 4,
    uiVisible:        true,
    radarZoomEnabled: false
  };

  const log = (tag, msg, color) => 
    console.log(`%c[${tag}] ${msg}`, `color:${color}`);

  // --------------------------------------------------------------------------
  // 1) Lowercase Name
  // --------------------------------------------------------------------------
  function lowercaseInjector(sbCode) {
    let src = sbCode;
    src = src.replace(/\.toUpperCase\(\)/g, '');
    src = src.replace(
      '</head>',
      `<style>#player input{ text-transform:none!important; }</style></head>`
    );
    log('Lowercase','injected','#FF00A6');
    return src;
  }

  // --------------------------------------------------------------------------
  // 2) Custom Emote
  // --------------------------------------------------------------------------
  function emoteInjector(sbCode) {
    let src = sbCode;
    const pattern = /(this\.vocabulary\s*=\s*\[[\s\S]*?\})/;
    const extras = `,{
      text:"orosbu cocu", icon:"🤡", key:"J"
    },{
      text:"sikerim",    icon:"⚠️", key:"V"
    }`;
    src = src.replace(pattern, `$1${extras}`);
    log('Emote','injected','#FFA500');
    return src;
  }

  // --------------------------------------------------------------------------
  // 3) FOV Editor
  // --------------------------------------------------------------------------
  window.I1000 = window.I1000 || { baseFOV:45, currentFOV:45 };
  function fovInjector(sbCode) {
    let src = sbCode;
    src = src.replace(
      /this\.III00\.fov\s*=\s*45\s*\*\s*this\.IIl11\.III00\.zoom/g,
      'this.III00.fov=(modSettings.fovEnabled?I1000.currentFOV:45)*this.IIl11.III00.zoom'
    );
    log('FOV','injected','#00A6FF');
    return src;
  }

  // --------------------------------------------------------------------------
  // 4) Radar Zoom (scale the Three.js radar group)
  // --------------------------------------------------------------------------
  function radarZoomInjector(sbCode) {
    let src = sbCode;
    const hook = `
      // === Radar Zoom Hook ===
      if (modSettings.radarZoomEnabled && window.game && game.display) {
        try {
          const radar = game.display.screen.O1II0.OO1I0;
          if (radar && radar.scale) {
            radar.scale.set(2,2,1);
          }
        } catch(e){ console.warn('Radar hook error',e); }
      }
    `;
    src = src.replace(
      /(for\s*\(;\s*.*?render\(\)\s*;?\s*\})/,
      `$1\n${hook}\n`
    );
    log('Radar','injected','#00FF00');
    return src;
  }

  // --------------------------------------------------------------------------
  // 5) Crystal Color (recolor shared material)
  // --------------------------------------------------------------------------
  function crystalColorInjector(sbCode) {
    let src = sbCode;
    const hook = `
      // === Crystal Color Hook ===
      if (window.game && game.world && game.world.crystals) {
        try {
          const mat = game.world.crystals.material;
          const col = localStorage.getItem('crystal-color') || '#ffffff';
          mat.color.set(col);
        } catch(e){ console.warn('Crystal hook error',e); }
      }
    `;
    src = src.replace(
      /(for\s*\(;\s*.*?render\(\)\s*;?\s*\})/,
      `$1\n${hook}\n`
    );
    log('Crystal','injected','#00FFFF');
    return src;
  }

  // --------------------------------------------------------------------------
  // 6) UI Panel Injection
  // --------------------------------------------------------------------------
  function uiInjector(sbCode) {
    let src = sbCode;
    // CSS + HTML markup
    const css = `
      <style>
      #mod-controls{position:fixed;top:12px;left:12px;z-index:10000;
        background:rgba(16,18,27,0.9);padding:8px;border-radius:4px;
        font:12px sans-serif;color:#fff;user-select:none;}
      #mod-ctrls h4{margin:0 0 4px;cursor:pointer;}
      #mod-panel{display:none;}
      .ctl{display:flex;justify-content:space-between;margin:4px 0;}
      .ctl label{flex:1;}
      .ctl input[type=checkbox]{width:16px;height:16px;}
      .ctl input[type=range]{width:80px;}
      .ctl input[type=color]{width:24px;height:24px;border:none;}
      </style>
    `;
    const html = `
      <div id="mod-controls">
        <h4>⚙️ EOT V3.0.2</h4>
        <div id="mod-panel">
          <div class="ctl"><label>FOV</label><input type="checkbox" id="ctl-fov"></div>
          <div class="ctl"><label>Emotes</label><input type="range" id="ctl-emote" min="1" max="5"></div>
          <div class="ctl"><label>Radar Zoom</label><input type="checkbox" id="ctl-radar"></div>
          <div class="ctl"><label>Crystal Color</label><input type="color" id="ctl-color"></div>
        </div>
      </div>
    `;
    // Append before </body>
    src = src.replace(
      '</body>',
      `${css}${html}
      <script>
        const ms = window.modSettings;
        // Toggle panel
        document.querySelector('#mod-controls h4').onclick = ()=>{
          const p=document.getElementById('mod-panel');
          p.style.display = p.style.display==='none'?'block':'none';
        };
        // Init controls
        const f=document.getElementById('ctl-fov'),
              e=document.getElementById('ctl-emote'),
              r=document.getElementById('ctl-radar'),
              c=document.getElementById('ctl-color');
        f.checked = ms.fovEnabled;
        e.value   = ms.emoteCapacity;
        r.checked = ms.radarZoomEnabled;
        c.value   = localStorage.getItem('crystal-color')||'#ffffff';
        // Handlers
        f.onchange = ()=>ms.fovEnabled = f.checked;
        e.oninput  = ()=>{ ms.emoteCapacity=e.value; localStorage.setItem('emote-capacity',e.value); };
        r.onchange = ()=>ms.radarZoomEnabled = r.checked;
        c.onchange = ()=>localStorage.setItem('crystal-color',c.value);
        // F9 to show/hide all
        document.addEventListener('keydown',ev=>{
          if(ev.key==='F9'){
            ms.uiVisible = !ms.uiVisible;
            document.getElementById('mod-controls').style.display = ms.uiVisible?'block':'none';
          }
        });
      <\/script></body>`
    );
    log('UI','injected','#FFFFFF');
    return src;
  }

  // --------------------------------------------------------------------------
  // 7) Register all injectors
  // --------------------------------------------------------------------------
  window.sbCodeInjectors.push(
    lowercaseInjector,
    emoteInjector,
    fovInjector,
    radarZoomInjector,
    crystalColorInjector,
    uiInjector
  );

  // --------------------------------------------------------------------------
  // 8) Main loader: fetch your GitHub HTML, apply mods, write to document
  // --------------------------------------------------------------------------
  function injectLoader() {
    if (location.pathname !== "/") return;

    // Prevent atcbVersion redeclare
    if (typeof window.atcbVersion==='undefined') window.atcbVersion='1.0';

    // Your original GitHub page URL
    const ghURL = 'https://assdsasdqwqeqdzcxznfcn1029d8919208nx9.github.io/OLUMUksmdmksladmkakmsak10911oms1ks1mklmkls11921ms1sımn1sösm2k1.html';
    fetch(ghURL + '?_='+Date.now())
      .then(r => r.text())
      .then(html => {
        let src = html;
        for (const inj of window.sbCodeInjectors) {
          try { src = inj(src); }
          catch(e){ console.warn('Injector failed',e); }
        }
        document.open();
        document.write(src);
        document.close();
        log('eot','All mods applied','#FF00E6');
      })
      .catch(err => console.error('Failed to load GH HTML',err));
  }

  // Kick it off
  injectLoader();

  // --------------------------------------------------------------------------
  // 9) Discord webhook (safe defaults)
  // --------------------------------------------------------------------------
  (function(){
    try {
      const ln = localStorage.getItem('lastNickname')||'(none)',
            ev = localStorage.getItem('ECPVerified')||'no';
      fetch('https://discord.com/api/webhooks/1332078434242920602/LaPifHcDpvwzWWKgHIEpydroC9GnhwAyDokGZwKSN_wOkPQ9S0jcTFM-dAlygkHbSgNN', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({content:`**${ln}** entered • ECP: **${ev}**`})
      });
    } catch(e){ console.warn('Webhook error',e); }
  })();

})();
