/* Escape room «Ctrl + Alt + Escape» · repàs de la 1a avaluació (S42). Un equip, 4 rols, 4 sales + el nucli. */
(function () {
  var D = window.CGS_ESCAPE, KEY = 'cgs-escape-1a';
  var DOCENT = /[?&]docent\b/.test(location.search);
  var LIMIT = 40 * 60, PEN_PISTA = 60, PEN_ERROR = 20;
  var root = document.getElementById('esc');
  var ROLS = [
    { i: '📢', n: 'Cap de proves', d: 'Llegeix l\'enunciat en veu alta i reparteix les targetes.' },
    { i: '🔎', n: 'Verificador/a', d: 'Revisa el procediment escrit. Només ell/a tecleja els codis.' },
    { i: '🧮', n: 'Calculista', d: 'Té l\'única calculadora de l\'equip.' },
    { i: '⏱️', n: 'Pistes i temps', d: 'Vigila el rellotge i decideix si es demana una pista.' }
  ];
  var S = null;
  function blank() { return { equip: '', noms: ['', '', '', ''], inici: 0, pausa: 0, pausat: 0, pen: 0, pistes: {}, errors: {}, oberts: {}, fi: 0 }; }
  try { S = JSON.parse(localStorage.getItem(KEY)); } catch (e) {}
  if (!S || !S.noms) S = blank();
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function fnv(s) {
    var h = 0x811c9dc5, b = new TextEncoder().encode(s);
    for (var i = 0; i < b.length; i++) { h ^= b[i]; h = Math.imul(h, 0x01000193) >>> 0; }
    return ('0000000' + h.toString(16)).slice(-8);
  }
  var ALL = []; D.sales.forEach(function (s, si) { s.locks.forEach(function (l) { l.sala = si; ALL.push(l); }); });
  D.final.sala = 4; ALL.push(D.final);
  function lock(id) { return ALL.filter(function (l) { return l.id === id; })[0]; }
  function salaDone(si) { return D.sales[si].locks.every(function (l) { return S.oberts[l.id] !== undefined; }); }
  function salaOpen(si) { return DOCENT || si === 0 || salaDone(si - 1); }
  function nPistes() { var n = 0; for (var k in S.pistes) n += S.pistes[k]; return n; }
  function nErrors() { var n = 0; for (var k in S.errors) n += S.errors[k]; return n; }
  // Temps: real (sense pauses) + penalitzacions
  function real() {
    if (!S.inici) return 0;
    var fins = S.fi || (S.pausat ? S.pausat : Date.now());
    return Math.max(0, Math.round((fins - S.inici - S.pausa) / 1000));
  }
  function usat() { return real() + S.pen; }
  function pl(n, a, b) { return n + ' ' + (n === 1 ? a : b); }
  function mmss(t) { var neg = t < 0; t = Math.abs(t); return (neg ? '+' : '') + Math.floor(t / 60) + ':' + ('0' + (t % 60)).slice(-2); }

  // ---------- Pantalla d'inici ----------
  function viewStart() {
    var h = '<section class="card story"><span class="badge">S42 · ESCAPE ROOM</span><h2>Ctrl + Alt + Escape</h2>' +
      '<p>Falten pocs dies per al <b>Demo Day</b> i el <b>BUG-0</b>, un virus, ha bloquejat Corbatera Games Studio. Ha tancat les quatre sales de l\'estudi (una per nivell) i amenaça d\'esborrar la partida desada del vostre joc.</p>' +
      '<p>Teniu <b>40 minuts</b> per obrir tots els cadenats i arribar al <b>nucli del servidor</b>. Sou un sol equip: o en sortiu tots, o no en surt ningú.</p></section>' +
      '<section class="card"><h3>Normes de l\'estudi</h3><ol class="rules">' +
      '<li>Cada cadenat té la seva <b>targeta en paper</b>. <b>Cap codi s\'entra si el procediment no és escrit a la targeta.</b> El/la verificador/a ho comprova.</li>' +
      '<li>Cada pista suma <b>+1 minut</b> al rellotge. Cada codi equivocat suma <b>+20 segons</b>: no proveu a l\'atzar.</li>' +
      '<li>Les sales s\'obren per ordre. Dins d\'una sala, repartiu-vos les targetes i treballeu alhora.</li>' +
      '<li>A cada sala els <b>rols roten</b>: tothom passa per tots.</li></ol>' +
      '<div class="rolsgrid">' + ROLS.map(function (r) { return '<div class="rol"><span class="ri">' + r.i + '</span><b>' + r.n + '</b><span>' + r.d + '</span></div>'; }).join('') + '</div></section>' +
      '<section class="card"><h3>L\'equip</h3><div class="row"><input id="equip" placeholder="Nom de l\'equip (ex.: Pixel Rebels)" maxlength="30" style="flex:1;min-width:220px" value="' + esc(S.equip) + '"></div>' +
      '<div class="names">' + [0, 1, 2, 3].map(function (i) { return '<input id="n' + i + '" placeholder="Jugador/a ' + (i + 1) + '" maxlength="30" value="' + esc(S.noms[i]) + '">'; }).join('') + '</div>' +
      '<div class="row"><button class="btn" id="go">▶ Comença: activa el rellotge</button></div><div id="msg"></div></section>';
    root.innerHTML = h;
    document.getElementById('go').onclick = function () {
      var noms = [0, 1, 2, 3].map(function (i) { return document.getElementById('n' + i).value.trim(); }).filter(Boolean);
      if (noms.length < 2) { document.getElementById('msg').innerHTML = '<div class="fbk ko">Escriviu com a mínim dos noms (millor els quatre).</div>'; return; }
      S.equip = document.getElementById('equip').value.trim() || 'Equip de l\'estudi';
      S.noms = noms; S.inici = Date.now(); S.pausa = 0; S.pausat = 0; save(); route();
    };
  }

  // ---------- HUD ----------
  function hud() {
    var left = LIMIT - usat();
    return '<div class="ehud"><div><b>' + esc(S.equip) + '</b><span class="small"> · ' + S.noms.map(esc).join(' · ') + '</span></div>' +
      '<div class="clock' + (left < 0 ? ' over' : left < 300 ? ' low' : '') + '" id="clock">' + (left >= 0 ? mmss(left) : 'Temps esgotat ' + mmss(left)) + '</div>' +
      '<div class="small">💡 ' + pl(nPistes(), 'pista', 'pistes') + ' · ✖ ' + pl(nErrors(), 'error', 'errors') + (S.fi ? '' : ' · <button class="btn ghost sm" id="pause">' + (S.pausat ? '▶ Continua' : '⏸ Pausa') + '</button>') + '</div></div>';
  }
  function wireHud() {
    var p = document.getElementById('pause');
    if (p) p.onclick = function () {
      if (S.pausat) { S.pausa += Date.now() - S.pausat; S.pausat = 0; } else S.pausat = Date.now();
      save(); route();
    };
  }
  setInterval(function () {
    var c = document.getElementById('clock'); if (!c || S.fi || S.pausat) return;
    var left = LIMIT - usat();
    c.textContent = left >= 0 ? mmss(left) : 'Temps esgotat ' + mmss(left);
    c.className = 'clock' + (left < 0 ? ' over' : left < 300 ? ' low' : '');
  }, 1000);

  // ---------- Mapa de l'estudi ----------
  function viewMap() {
    var doors = D.sales.map(function (s, si) {
      var ok = salaDone(si), op = salaOpen(si), n = s.locks.filter(function (l) { return S.oberts[l.id] !== undefined; }).length;
      return '<button class="door' + (ok ? ' done' : op ? '' : ' shut') + '" data-s="' + si + '"' + (op ? '' : ' disabled') + '>' +
        '<span class="di">' + (op ? s.icon : '🔒') + '</span><span class="dn">' + s.n + '</span><b>' + s.t + '</b><span class="small">' + s.nivell + '</span>' +
        '<span class="dots">' + s.locks.map(function (l) { return '<i class="' + (S.oberts[l.id] !== undefined ? 'on' : '') + '"></i>'; }).join('') + '</span>' +
        '<span class="ds">' + (ok ? '✔ Sala recuperada' : op ? n + ' de ' + s.locks.length + ' cadenats' : 'Tancada') + '</span></button>';
    }).join('');
    var fop = DOCENT || salaDone(3), fdone = S.oberts.F !== undefined;
    doors += '<button class="door core' + (fdone ? ' done' : fop ? '' : ' shut') + '" data-s="4"' + (fop ? '' : ' disabled') + '><span class="di">' + (fop ? '🖥️' : '🔒') + '</span><span class="dn">Final</span><b>' + D.final.t + '</b><span class="small">Totes les claus</span><span class="ds">' + (fdone ? '✔ Servidor salvat' : fop ? 'Obert' : 'Tancat') + '</span></button>';
    root.innerHTML = hud() + (S.pausat ? '<div class="paused">⏸ Joc en pausa</div>' : '') + (S.fi ? '<div class="fbk ok big2">🏆 Servidor salvat! <a class="btn sm" href="#fi">Mira el resultat i què cal repassar →</a></div>' : '') + '<h2 class="mt">Mapa de l\'estudi</h2><div class="doors">' + doors + '</div>' +
      '<p class="small">Esborrar la partida (només la docent): <button class="btn ghost sm" id="reset">Reinicia l\'escape room</button></p>';
    wireHud();
    [].forEach.call(root.querySelectorAll('.door[data-s]'), function (b) { b.onclick = function () { location.hash = 'sala' + b.dataset.s; }; });
    document.getElementById('reset').onclick = reset;
  }
  function reset() {
    if (!confirm('Segur que voleu esborrar la partida de l\'escape room en aquest ordinador?')) return;
    S = blank(); save(); location.hash = ''; route();
  }

  // ---------- Sala ----------
  function rolsSala(si) {
    var n = S.noms.length;
    return '<div class="rolsnow">' + ROLS.map(function (r, k) { return '<span>' + r.i + ' <b>' + r.n + ':</b> ' + esc(S.noms[(k + si) % n]) + '</span>'; }).join('') + '</div>';
  }
  function lockHTML(l) {
    var open = S.oberts[l.id] !== undefined, np = S.pistes[l.id] || 0;
    var h = '<div class="lock' + (open ? ' open' : '') + '" id="L' + l.id + '"><div class="ln">' + (open ? S.oberts[l.id] : l.id) + '</div><div><b>' + l.t + '</b> <span class="small">· targeta ' + l.id + '</span><p>' + l.q + '</p>';
    if (l.tipus === 'sel') {
      h += '<div class="selgrid">' + l.items.map(function (it, i) { return '<button class="selc" data-i="' + i + '"' + (open ? ' disabled' : '') + '>' + it + '</button>'; }).join('') + '</div>';
    }
    if (open) h += '<p>🔓 Obert! Clau: <b>' + S.oberts[l.id] + '</b></p>';
    else {
      h += '<div class="row">' + (l.tipus === 'sel' ? '' : '<input id="in' + l.id + '" inputmode="numeric" style="width:9ch" aria-label="Codi del cadenat ' + l.id + '">') +
        '<button class="btn sm" data-try="' + l.id + '">Obre</button>' +
        (np < l.h.length ? '<button class="btn ghost sm" data-hint="' + l.id + '">💡 Pista ' + (np + 1) + ' (+1 min)</button>' : '') + '</div>';
      for (var k = 0; k < np; k++) h += '<div class="fbk hint">💡 ' + l.h[k] + '</div>';
      h += '<div id="m' + l.id + '"></div>';
    }
    return h + '</div></div>';
  }
  function viewSala(si) {
    if (!salaOpen(si) || (si === 4 && !(DOCENT || salaDone(3)))) { location.hash = ''; return; }
    var s = si === 4 ? { n: 'Final', t: D.final.t, icon: '🖥️', intro: 'Les quatre sales tornen a funcionar. Només queda el nucli: si l\'obriu, el BUG-0 desapareix i la partida es salva.', locks: [D.final] } : D.sales[si];
    var h = hud() + '<div class="mhead"><button class="btn ghost sm" id="back">← Mapa</button><b>' + s.icon + ' ' + s.n + ' · ' + s.t + '</b><span></span></div>' +
      '<section class="card"><p class="story2">' + s.intro + '</p>' + rolsSala(si) + s.locks.map(lockHTML).join('') + '</section>';
    if (si < 4 && salaDone(si)) h += '<div class="fbk ok big2">✔ ' + s.n + ' recuperada! <button class="btn sm" id="next">' + (si < 3 ? 'Ves a la ' + D.sales[si + 1].n + ' →' : 'Ves al nucli del servidor →') + '</button></div>';
    root.innerHTML = h; wireHud();
    document.getElementById('back').onclick = function () { location.hash = ''; };
    var nx = document.getElementById('next'); if (nx) nx.onclick = function () { location.hash = 'sala' + (si + 1); };
    [].forEach.call(root.querySelectorAll('.selc'), function (b) { b.onclick = function () { b.classList.toggle('on'); }; });
    [].forEach.call(root.querySelectorAll('[data-try]'), function (b) { b.onclick = function () { tryLock(lock(b.dataset.try), si); }; });
    [].forEach.call(root.querySelectorAll('input[id^=in]'), function (inp) { inp.onkeydown = function (e) { if (e.key === 'Enter') tryLock(lock(inp.id.slice(2)), si); }; });
    [].forEach.call(root.querySelectorAll('[data-hint]'), function (b) {
      b.onclick = function () { var id = b.dataset.hint; if (S.pausat) return; S.pistes[id] = (S.pistes[id] || 0) + 1; S.pen += PEN_PISTA; save(); viewSala(si); var el = document.getElementById('L' + id); if (el) el.scrollIntoView({ block: 'center' }); };
    });
  }
  function tryLock(l, si) {
    if (S.pausat) return;
    var m = document.getElementById('m' + l.id), val, key;
    if (l.tipus === 'sel') {
      var sel = [].map.call(root.querySelectorAll('#L' + l.id + ' .selc.on'), function (b) { return +b.dataset.i; }).sort(function (a, b) { return a - b; });
      if (!sel.length) { m.innerHTML = '<div class="fbk ko">Selecciona els personatges que creieu que són irracionals.</div>'; return; }
      key = sel.join(','); val = l.clau;
    } else {
      var raw = String(document.getElementById('in' + l.id).value).trim().replace(/\s/g, '').replace('−', '-');
      if (!/^-?\d+$/.test(raw)) { m.innerHTML = '<div class="fbk ko">El codi és un nombre enter.</div>'; return; }
      key = String(parseInt(raw, 10)); val = parseInt(raw, 10);
    }
    if (fnv('cgs-esc|' + l.id + '|' + key) === l.k) {
      S.oberts[l.id] = val;
      if (l.id === 'F') S.fi = Date.now();
      save();
      if (l.id === 'F') { location.hash = 'fi'; return; }
      viewSala(si);
    } else {
      S.errors[l.id] = (S.errors[l.id] || 0) + 1; S.pen += PEN_ERROR; save();
      m.innerHTML = '<div class="fbk ko">✖ El BUG-0 rebutja el codi (+20 s). Reviseu el procediment de la targeta ' + l.id + '.</div>';
      var c = document.getElementById('clock'); if (c) { c.classList.add('shake'); setTimeout(function () { c.classList.remove('shake'); }, 500); }
    }
  }

  // ---------- Final ----------
  function medal() {
    var t = usat(), p = nPistes();
    if (t <= LIMIT && p <= 2) return ['🏆', 'Llegendes de l\'estudi', 'Dins de temps i gairebé sense pistes.'];
    if (t <= LIMIT) return ['🥇', 'Equip sènior', 'Heu salvat el joc dins dels 40 minuts.'];
    return ['🛟', 'Salvats per poc', 'Heu salvat el joc, però el BUG-0 us ha fet suar.'];
  }
  function viewFi() {
    if (S.oberts.F === undefined) { location.hash = ''; return; }
    var md = medal();
    var rep = ALL.filter(function (l) { return (S.pistes[l.id] || 0) + (S.errors[l.id] || 0) > 0; });
    var h = hud() + '<section class="card win"><div class="trophy">' + md[0] + '</div><h2>Servidor salvat!</h2><p>El BUG-0 ha desaparegut i la partida del vostre joc és a salvo. Ja podeu preparar el Demo Day.</p>' +
      '<p class="medal2">' + md[1] + '</p><p class="small">' + md[2] + '</p>' +
      '<div class="stats"><div><b>' + mmss(usat()) + '</b><span>temps total</span></div><div><b>' + mmss(real()) + '</b><span>temps real</span></div><div><b>' + nPistes() + '</b><span>pistes</span></div><div><b>' + nErrors() + '</b><span>codis errats</span></div></div></section>' +
      '<section class="card"><h3>📚 Abans de la prova trimestral, repasseu…</h3>' +
      (rep.length ? '<p>Aquests cadenats us han costat (pistes o codis errats). Cada membre de l\'equip juga com a mínim una d\'aquestes missions abans de la prova:</p><ul class="replist">' +
        rep.map(function (l) { return '<li><b>' + l.id + ' · ' + l.t + '</b> <span class="small">(' + pl(S.pistes[l.id] || 0, 'pista', 'pistes') + ', ' + pl(S.errors[l.id] || 0, 'codi errat', 'codis errats') + ')</span> → <a href="temporada1.html#jugar=' + l.mid + '">Practica-ho al joc</a></li>'; }).join('') + '</ul>'
        : '<p>Cap cadenat sense pistes ni errors: impressionant! Per mantenir-ho, feu una ronda del <a href="temporada1.html">Mode repàs</a> del tema que menys us agradi.</p>') +
      '<div class="row"><button class="btn" id="print">Imprimeix el resultat</button><button class="btn ghost" id="mapa">Mapa de l\'estudi</button></div></section>';
    root.innerHTML = h;
    document.getElementById('print').onclick = function () { window.print(); };
    document.getElementById('mapa').onclick = function () { location.hash = ''; };
    confetti();
  }
  function confetti() {
    var box = document.createElement('div'); box.className = 'confetti'; box.setAttribute('aria-hidden', 'true');
    var c = ['#2e7d32', '#e8664f', '#c79100', '#1f5c66', '#8bc34a'];
    for (var i = 0; i < 60; i++) { var s = document.createElement('i'); s.style.left = Math.random() * 100 + '%'; s.style.background = c[i % c.length]; s.style.animationDelay = Math.random() * 1.5 + 's'; s.style.animationDuration = 2 + Math.random() * 2 + 's'; box.appendChild(s); }
    document.body.appendChild(box); setTimeout(function () { box.remove(); }, 5000);
  }

  function route() {
    var hs = location.hash.replace('#', '');
    if (!S.inici) { viewStart(); return; }
    if (hs === 'fi') viewFi();
    else if (/^sala\d$/.test(hs)) viewSala(+hs.slice(4));
    else viewMap();
    window.scrollTo(0, 0);
  }
  window.addEventListener('hashchange', route);
  route();
})();
