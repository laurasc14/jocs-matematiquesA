/* Temporada 2 · Tràiler de desembre: un minijoc per sessió (S47–S53), sense nota */
(function () {
  var KEY = 'cgs-trailer-t2';
  var DOCENT = /[?&]docent\b/.test(location.search);
  var root = document.getElementById('t2');
  var S = { medals: {} };
  try { S = JSON.parse(localStorage.getItem(KEY)) || S; } catch (e) {}
  S.medals = S.medals || {};
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function fmt(x, d) { return String(Math.round(x * Math.pow(10, d || 0)) / Math.pow(10, d || 0)).replace('.', ',').replace('-', '−'); }

  // ---------- Gràfiques ----------
  // f: funció a [0,10] → [0,10]; o una llista de punts
  function graph(f, opt) {
    opt = opt || {};
    var W = 260, H = 180, L = 30, B = 26, T = 22, R = 10;
    var X = function (x) { return L + x / 10 * (W - L - R); }, Y = function (y) { return H - B - y / 10 * (H - B - T); };
    var s = '<svg class="graph" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Gràfica">';
    for (var k = 0; k <= 10; k += 2) s += '<line class="gr" x1="' + X(k) + '" y1="' + Y(0) + '" x2="' + X(k) + '" y2="' + Y(10) + '"/><line class="gr" x1="' + X(0) + '" y1="' + Y(k) + '" x2="' + X(10) + '" y2="' + Y(k) + '"/>';
    s += '<line class="ax" x1="' + X(0) + '" y1="' + Y(0) + '" x2="' + X(10.2) + '" y2="' + Y(0) + '"/><line class="ax" x1="' + X(0) + '" y1="' + Y(0) + '" x2="' + X(0) + '" y2="' + Y(10.2) + '"/>';
    s += '<text class="lb" x="' + (W - R) + '" y="' + (H - 6) + '" text-anchor="end">' + (opt.x || 'temps') + '</text>';
    s += '<text class="lb" x="4" y="13">' + (opt.y || '') + '</text>';
    var pts = [];
    if (typeof f === 'function') { for (var i = 0; i <= 120; i++) { var x = i / 12; pts.push([X(x), Y(Math.max(0, Math.min(10, f(x))))]); } }
    else pts = f.map(function (p) { return [X(p[0]), Y(p[1])]; });
    s += '<polyline class="cv" points="' + pts.map(function (p) { return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(' ') + '"/>';
    return s + '</svg>';
  }
  var SH = {
    salt: function (x) { return 8 - 0.32 * (x - 5) * (x - 5); },
    frena: function (x) { return x < 5 ? 7 : Math.max(0, 7 - 7 * (x - 5) / 4); },
    ascensor: function (x) { return x < 3 ? 2 * x : x < 6 ? 6 : 6 + (x - 6); },
    bateria: function (x) { return 9 - 0.7 * x; },
    piscina: function (x) { return x < 6 ? 1.5 * x : 9; },
    cau: function (x) { return x < 4 ? 8 : Math.max(0, 8 - 0.5 * (x - 4) * (x - 4)); },
    pilota: function (x) { return Math.abs(Math.sin(Math.PI * x / 3.3)) * 8 * Math.pow(0.6, Math.floor(x / 3.3)); },
    amic: function (x) { return x < 4 ? 2 * x : x < 6 ? 8 : Math.max(0, 8 - 2 * (x - 6)); },
    accelera: function (x) { return 0.09 * x * x; },
    constant: function () { return 5; },
    creix: function (x) { return 1 + 0.8 * x; },
    decreix: function (x) { return 9 - 0.8 * x; }
  };
  var TWIN = { frena: 'cau', cau: 'frena' };   // formes massa semblants: no surten juntes
  var STORIES = [
    { t: 'El personatge salta des de terra i torna a caure.', s: 'salt', y: 'altura', n: 'Salt' },
    { t: 'Un cotxe va a velocitat constant i després frena fins que s\'atura.', s: 'frena', y: 'velocitat', n: 'Frenada' },
    { t: 'Un ascensor puja, s\'atura en un pis i després continua pujant.', s: 'ascensor', y: 'altura', n: 'Ascensor' },
    { t: 'La bateria del mòbil es gasta a poc a poc mentre jugues.', s: 'bateria', y: 'bateria', n: 'Bateria' },
    { t: 'Omplim una piscina amb una aixeta i, quan és plena, la tanquem.', s: 'piscina', y: 'aigua', n: 'Piscina' },
    { t: 'El personatge és quiet dalt d\'una plataforma i, de cop, cau al buit.', s: 'cau', y: 'altura', n: 'Caiguda' },
    { t: 'Una pilota rebota tres vegades, cada cop més baix.', s: 'pilota', y: 'altura', n: 'Rebots' },
    { t: 'Vas a casa d\'un amic, t\'hi estàs una estona i tornes a casa.', s: 'amic', y: 'distància a casa', n: 'Visita' },
    { t: 'Un cotxe surt d\'un semàfor i va cada vegada més de pressa.', s: 'accelera', y: 'distància', n: 'Acceleració' }
  ];

  // ---------- Episodis ----------
  var EPS = [
    { id: 'e1', s: 'S47', d: '2026-12-09', dl: 'dc 9/12', t: 'El joc creix', desc: 'Presentació de la Temporada 2 i primera ullada a les gràfiques.', medal: 'Temporada 2 desbloquejada', fn: ep1 },
    { id: 'e2', s: 'S48', d: '2026-12-10', dl: 'dj 10/12', t: 'Històries amb gràfiques', desc: 'Quina gràfica explica cada història? I quina història explica cada gràfica?', medal: 'Narrador/a de gràfiques', fn: ep2 },
    { id: 'e3', s: 'S49', d: '2026-12-14', dl: 'dl 14/12', t: 'Juga i registra', desc: 'Juga 30 segons a «Caça monedes», mira la taula de les teves dades i la seva gràfica.', medal: 'Analista de partides', fn: ep3 },
    { id: 'e4', s: 'S50', d: '2026-12-15', dl: 'dt 15/12', t: 'Dissenya el salt', desc: 'Mou els controls i fes que el salt superi els reptes. Connexió amb el Nivell 2.', medal: 'Dissenyador/a de salts', fn: ep4 },
    { id: 'e5', s: 'S51', d: '2026-12-16', dl: 'dc 16/12', t: 'Dominó de gràfiques', desc: 'Memory per parelles: troba cada història amb la seva gràfica.', medal: 'Memòria de dades', fn: ep5 },
    { id: 'e6', s: 'S52', d: '2026-12-17', dl: 'dj 17/12', t: 'Posa\'t al dia', desc: 'Què et queda pendent del trimestre: missions, informes i preguntes ràpides.', medal: 'Al dia', fn: ep6 },
    { id: 'e7', s: 'S53', d: '2026-12-21', dl: 'dl 21/12', t: 'Enigma de Nadal', desc: 'Cinc cadenats amb tot el que hem après. Obre la caixa del codi secret!', medal: 'Enigma resolt', fn: ep7 }
  ];
  function today() { var d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function open(ep) { return DOCENT || today() >= ep.d; }
  function medal(id) { if (!S.medals[id]) { S.medals[id] = Date.now(); save(); } }

  function hub() {
    var h = '<section class="intro"><span class="badge" style="background:#1f5c66">TRÀILER</span><h2>Temporada 2 · «El joc creix»</h2>' +
      '<p>El joc del primer trimestre ja funciona. Ara el volem fer créixer: personatges que es mouen, punts que pugen, bateries que es gasten… Tot això es pot <b>dibuixar</b>. Al desembre veurem el tràiler de la temporada: un minijoc per sessió, per explorar i jugar. <b>No compta per a la nota.</b></p>' +
      '<div class="medals">' + EPS.map(function (e) { return '<span class="medal' + (S.medals[e.id] ? '' : ' off') + '">' + (S.medals[e.id] ? '★ ' : '☆ ') + e.medal + '</span>'; }).join('') + '</div>' +
      (DOCENT ? '<p class="small2">Mode docent: tots els episodis oberts.</p>' : '') + '</section><div class="eps">';
    EPS.forEach(function (e, k) {
      var o = open(e);
      h += '<button class="ep' + (S.medals[e.id] ? ' got' : '') + '" data-k="' + k + '"' + (o ? '' : ' disabled') + '><span class="badge">EPISODI ' + (k + 1) + ' · ' + e.s + '</span>' +
        '<span class="et">' + e.t + '</span><span class="ed">' + e.desc + '</span><span class="es">' + (S.medals[e.id] ? '★ ' + e.medal : o ? 'Disponible · ' + e.dl : '🔒 S\'obre el ' + e.dl) + '</span></button>';
    });
    root.innerHTML = h + '</div>';
    [].forEach.call(root.querySelectorAll('.ep:not([disabled])'), function (b) { b.onclick = function () { location.hash = EPS[+b.dataset.k].id; }; });
    window.scrollTo(0, 0);
  }
  function frame(ep, inner) {
    return '<section class="game"><div class="ghead"><button class="btn ghost sm" id="back">← Tràiler</button><h2>' + ep.t + '</h2><span class="badge" style="background:#1f5c66">' + ep.s + ' · ' + ep.dl + '</span></div>' + inner + '</section>';
  }
  function wireBack() { var b = document.getElementById('back'); if (b) b.onclick = function () { location.hash = ''; }; }
  function done(ep, html) { medal(ep.id); return '<div class="fbk ok"><b>★ Insígnia: ' + ep.medal + '</b>' + (html ? '<br>' + html : '') + '</div>'; }

  // ---------- Qüestionari genèric de gràfiques ----------
  function quiz(ep, items, onEnd) {
    var i = 0, ok = 0, res = [];
    function draw() {
      if (i >= items.length) { onEnd(ok, items.length); return; }
      var it = items[i];
      var h = '<div class="progressbar">' + items.map(function (x, k) { return '<span class="' + (k < i ? (res[k] ? 'ok' : 'ko') : k === i ? 'now' : '') + '"></span>'; }).join('') + '</div>';
      h += '<p class="qtext">' + it.q + '</p>' + (it.fig || '') + '<div class="gopts">' + it.o.map(function (o, k) { return '<button class="gopt" data-k="' + k + '">' + o.h + '</button>'; }).join('') + '</div><div id="fb"></div>';
      root.querySelector('#qz').innerHTML = h;
      [].forEach.call(root.querySelectorAll('.gopt'), function (b) {
        b.onclick = function () {
          var k = +b.dataset.k, good = it.o[k].ok;
          [].forEach.call(root.querySelectorAll('.gopt'), function (x, j) { x.disabled = true; if (it.o[j].ok) x.classList.add('ok'); });
          if (!good) b.classList.add('ko');
          res[i] = good; if (good) ok++;
          document.getElementById('fb').innerHTML = '<div class="fbk ' + (good ? 'ok' : 'ko') + '">' + (good ? 'Correcte! ' : 'No és aquesta. ') + (it.why || '') + '</div><div class="row"><button class="btn" id="nx">' + (i + 1 < items.length ? 'Següent →' : 'Resultat') + '</button></div>';
          document.getElementById('nx').onclick = function () { i++; draw(); };
        };
      });
    }
    draw();
  }

  // Episodi 1 · El joc creix
  function ep1(ep) {
    root.innerHTML = frame(ep, '<p>A la Temporada 1 vam fer servir fórmules com h(t) = −5t<sup>2</sup> + 20t. A la Temporada 2 aprendrem a <b>llegir i dibuixar</b> com canvien les coses del joc: <b>funcions</b>. Comencem amb una primera ullada: cada gràfica mostra l\'altura del personatge segons el temps.</p><div id="qz"></div>');
    wireBack();
    var items = shuffle([
      { s: 'constant', a: 'Està quiet a la mateixa altura', why: 'Una línia horitzontal vol dir que l\'altura no canvia.' },
      { s: 'creix', a: 'Puja tota l\'estona', why: 'D\'esquerra a dreta la línia puja: l\'altura augmenta.' },
      { s: 'decreix', a: 'Baixa tota l\'estona', why: 'D\'esquerra a dreta la línia baixa: l\'altura disminueix.' },
      { s: 'salt', a: 'Puja i després baixa', why: 'Primer puja, arriba a un punt màxim i torna a baixar: és un salt.' }
    ]).map(function (x) {
      var all = ['Està quiet a la mateixa altura', 'Puja tota l\'estona', 'Baixa tota l\'estona', 'Puja i després baixa'];
      return { q: 'Què fa el personatge?', fig: '<div style="max-width:320px;margin:auto">' + graph(SH[x.s], { y: 'altura' }) + '</div>', o: shuffle(all.map(function (h) { return { h: h, ok: h === x.a }; })), why: x.why };
    });
    quiz(ep, items, function (ok, n) {
      root.querySelector('#qz').innerHTML = '<p class="qtext">Has encertat <span class="score">' + ok + ' de ' + n + '</span>.</p>' + done(ep, 'Ja saps llegir el més important d\'una gràfica: si <b>puja</b>, si <b>baixa</b> o si es <b>manté</b>. A la Temporada 2 n\'hi direm creixent, decreixent i constant.') +
        '<div class="row"><button class="btn" onclick="location.hash=\'\'">Torna al tràiler</button></div>';
    });
  }

  // Episodi 2 · Històries amb gràfiques
  function ep2(ep) {
    root.innerHTML = frame(ep, '<p>Primer tria la gràfica de cada història. Després, al revés: tria la història de cada gràfica. Fixa\'t en què passa <b>a cada tram</b>.</p><div id="qz"></div>');
    wireBack();
    var st = shuffle(STORIES);
    var a = st.slice(0, 6).map(function (x) {
      var others = shuffle(STORIES.filter(function (y) { return y.s !== x.s && TWIN[x.s] !== y.s; })).slice(0, 2);
      return { q: '«' + x.t + '»', o: shuffle([x].concat(others).map(function (y) { return { h: graph(SH[y.s], { y: x.y }), ok: y.s === x.s }; })), why: 'Llegeix la gràfica d\'esquerra a dreta, tram a tram.' };
    });
    var b = st.slice(6).concat(st.slice(0, 1)).map(function (x) {
      var others = shuffle(STORIES.filter(function (y) { return y.s !== x.s && TWIN[x.s] !== y.s; })).slice(0, 2);
      return { q: 'Quina història explica aquesta gràfica?', fig: '<div style="max-width:320px;margin:auto">' + graph(SH[x.s], { y: x.y }) + '</div>', o: shuffle([x].concat(others).map(function (y) { return { h: y.t, ok: y.s === x.s }; })), why: 'La gràfica correcta és: «' + x.t + '»' };
    });
    quiz(ep, a.concat(b), function (ok, n) {
      var pass = ok / n >= 0.6;
      root.querySelector('#qz').innerHTML = '<p class="qtext">Has encertat <span class="score">' + ok + ' de ' + n + '</span>.</p>' +
        (pass ? done(ep, 'Ara, a la llibreta: inventa una història del joc i dibuixa\'n la gràfica. Passa-la a un company perquè endevini la història.') : '<div class="fbk ko">Necessites 6 de 10 per a la insígnia. Torna-ho a provar: les històries surten en un altre ordre.</div>') +
        '<div class="row"><button class="btn" onclick="location.reload()">Torna a jugar</button><button class="btn ghost" onclick="location.hash=\'\'">Torna al tràiler</button></div>';
    });
  }

  // Episodi 3 · Juga i registra (Caça monedes)
  function ep3(ep) {
    root.innerHTML = frame(ep, '<p><b>Caça monedes</b> durant 30 segons: clica les monedes daurades (+1 punt) i evita les bombes vermelles (−1 vida, en tens 5). Cada 3 segons el joc apunta les teves dades en una taula.</p>' +
      '<div class="hud2"><span id="ht">30 s</span><span id="hp">0 punts</span><span id="hv">♥♥♥♥♥</span></div><canvas class="play" id="cv" width="640" height="360"></canvas>' +
      '<div class="row" style="justify-content:center"><button class="btn" id="go">Comença la partida</button></div><div id="res"></div>');
    wireBack();
    var cv = document.getElementById('cv'), cx = cv.getContext('2d'), items = [], pts = 0, lives = 5, t0 = 0, data = [], timer = null, running = false;
    function drawBg(msg) {
      cx.fillStyle = '#10241a'; cx.fillRect(0, 0, 640, 360);
      if (msg) { cx.fillStyle = '#fff'; cx.font = 'bold 26px system-ui'; cx.textAlign = 'center'; cx.fillText(msg, 320, 185); }
    }
    drawBg('Prem «Comença la partida»');
    function spawn(now) {
      var bomb = Math.random() < 0.25;
      items.push({ x: 40 + Math.random() * 560, y: 40 + Math.random() * 280, r: bomb ? 20 : 18, bomb: bomb, born: now, life: 900 + Math.random() * 700 });
    }
    function loop(now) {
      if (!running) return;
      var el = (now - t0) / 1000;
      if (Math.random() < 0.06) spawn(now);
      items = items.filter(function (it) { return now - it.born < it.life; });
      drawBg();
      items.forEach(function (it) {
        cx.beginPath(); cx.arc(it.x, it.y, it.r, 0, 2 * Math.PI);
        cx.fillStyle = it.bomb ? '#e53935' : '#ffc107'; cx.fill();
        cx.fillStyle = it.bomb ? '#fff' : '#7a5b00'; cx.font = 'bold 18px system-ui'; cx.textAlign = 'center'; cx.fillText(it.bomb ? '✕' : '€', it.x, it.y + 6);
      });
      document.getElementById('ht').textContent = Math.max(0, Math.ceil(30 - el)) + ' s';
      if (el >= 30 || lives <= 0) { end(); return; }
      requestAnimationFrame(loop);
    }
    function hit(ev) {
      if (!running) return;
      var r = cv.getBoundingClientRect(), x = (ev.clientX - r.left) * 640 / r.width, y = (ev.clientY - r.top) * 360 / r.height;
      for (var k = items.length - 1; k >= 0; k--) {
        var it = items[k];
        if ((x - it.x) * (x - it.x) + (y - it.y) * (y - it.y) <= (it.r + 6) * (it.r + 6)) {
          if (it.bomb) lives--; else pts++;
          items.splice(k, 1); break;
        }
      }
      document.getElementById('hp').textContent = pts + ' punts';
      document.getElementById('hv').textContent = '♥♥♥♥♥'.slice(0, Math.max(0, lives)) + '♡♡♡♡♡'.slice(0, 5 - Math.max(0, lives));
    }
    cv.addEventListener('pointerdown', hit);
    document.getElementById('go').onclick = function () {
      items = []; pts = 0; lives = 5; data = [{ t: 0, p: 0, v: 5 }]; running = true; t0 = performance.now();
      this.disabled = true; document.getElementById('res').innerHTML = '';
      hit({ clientX: -999, clientY: -999 });
      timer = setInterval(function () { var t = data.length * 3; if (t <= 30) data.push({ t: t, p: pts, v: Math.max(0, lives) }); }, 3000);
      requestAnimationFrame(loop);
    };
    function end() {
      running = false; clearInterval(timer);
      var last = data[data.length - 1], tEnd = Math.min(30, Math.round((performance.now() - t0) / 1000));
      if (last.t < tEnd) data.push({ t: tEnd, p: pts, v: Math.max(0, lives) });
      drawBg(lives <= 0 ? 'Sense vides!' : 'Temps!');
      document.getElementById('go').disabled = false; document.getElementById('go').textContent = 'Torna a jugar';
      results();
    }
    function results() {
      var maxP = Math.max(10, last(data).p), sc = function (arr, key, max) { return arr.map(function (d) { return [d.t / 3, d[key] / max * 10]; }); };
      var gP = graph(sc(data, 'p', maxP), { y: 'punts (fins a ' + maxP + ')', x: 'temps (cada 3 s)' });
      var gV = graph(sc(data, 'v', 5), { y: 'vides (fins a 5)', x: 'temps (cada 3 s)' });
      var best = 1, bestGain = -1;
      for (var k = 1; k < data.length; k++) { var g = data[k].p - data[k - 1].p; if (g > bestGain) { bestGain = g; best = k; } }
      var tbl = '<table class="data"><tr><th>Temps (s)</th>' + data.map(function (d) { return '<td>' + d.t + '</td>'; }).join('') + '</tr><tr><th>Punts</th>' + data.map(function (d) { return '<td>' + d.p + '</td>'; }).join('') + '</tr><tr><th>Vides</th>' + data.map(function (d) { return '<td>' + d.v + '</td>'; }).join('') + '</tr></table>';
      var opts = [];
      for (var j = 1; j < data.length; j++) opts.push({ h: 'Entre ' + data[j - 1].t + ' i ' + data[j].t + ' s', ok: data[j].p - data[j - 1].p === bestGain });
      opts = shuffle(opts).slice(0, 4); if (!opts.some(function (o) { return o.ok; })) opts[0] = { h: 'Entre ' + data[best - 1].t + ' i ' + data[best].t + ' s', ok: true }; opts = shuffle(opts);
      document.getElementById('res').innerHTML = '<h3>Les teves dades</h3><div style="overflow-x:auto">' + tbl + '</div><div class="twocol"><div><b>Punts segons el temps</b>' + gP + '</div><div><b>Vides segons el temps</b>' + gV + '</div></div><div id="qz"></div>';
      var items = [
        { q: 'En quin tram vas fer més punts? (on la gràfica de punts puja més de pressa)', o: opts, why: 'El tram on la gràfica és més inclinada és on més punts has fet.' },
        { q: 'La gràfica de punts pot baixar alguna vegada?', o: shuffle([{ h: 'No: els punts s\'acumulen, com a molt es queden igual', ok: true }, { h: 'Sí, quan perds una vida', ok: false }, { h: 'Sí, quan s\'acaba el temps', ok: false }]), why: 'Els punts acumulats mai disminueixen: la gràfica és creixent o es manté.' },
        { q: 'Què vol dir un tram horitzontal a la gràfica de vides?', o: shuffle([{ h: 'Que en aquell temps no has perdut cap vida', ok: true }, { h: 'Que has guanyat vides', ok: false }, { h: 'Que el joc estava aturat', ok: false }]), why: 'Horitzontal = el valor no canvia.' }
      ];
      quiz(ep, items, function (ok, n) {
        document.getElementById('qz').innerHTML = '<p class="qtext">Has encertat <span class="score">' + ok + ' de ' + n + '</span>.</p>' + (ok >= 2 ? done(ep, 'Compara la teva gràfica amb la d\'un company: qui ha començat més ràpid? Qui ha acabat més fort?') : '<div class="fbk ko">Torna a jugar i mira bé les gràfiques.</div>');
      });
    }
    function last(a) { return a[a.length - 1]; }
  }

  // Episodi 4 · Dissenya el salt
  function ep4(ep) {
    var CH = [
      { t: 'Des de terra, arriba a una altura màxima de <b>45 m</b>.', ok: function (v, h0, m) { return h0 === 0 && Math.abs(m.hmax - 45) <= 0.6; }, tip: 'Altura màxima = v<sup>2</sup>/20 si surts de terra.' },
      { t: 'Des de terra, aterra <b>exactament als 4 s</b>.', ok: function (v, h0, m) { return h0 === 0 && Math.abs(m.tl - 4) <= 0.05; }, tip: 'Recorda el Nivell 2: −5t<sup>2</sup> + vt = −5t(t − v/5).' },
      { t: 'Des de la plataforma de <b>10 m</b>, aterra <b>als 2 s</b>.', ok: function (v, h0, m) { return h0 === 10 && Math.abs(m.tl - 2) <= 0.05; }, tip: 'h(2) = −20 + 2v + 10 ha de ser 0.' },
      { t: 'Des de terra, supera el mur de <b>20 m</b> que hi ha <b>a t = 1 s</b>, amb la mínima velocitat possible.', ok: function (v, h0, m) { return h0 === 0 && v >= 25 && v <= 25.5; }, tip: 'h(1) = −5 + v ha de ser com a mínim 20.', wall: true },
      { t: 'Des de terra, toca <b>just</b> la plataforma de <b>30 m</b> (només un instant, al punt més alt).', ok: function (v, h0, m) { return h0 === 0 && Math.abs(m.hmax - 30) <= 0.4; }, tip: 'Només un instant vol dir que l\'altura màxima és 30 m (discriminant = 0!).', plat: 30 }
    ];
    var cur = 0, solved = S.e4 || [];
    root.innerHTML = frame(ep, '<p>El salt segueix <b>h(t) = −5t<sup>2</sup> + v·t + h<sub>0</sub></b>, com al Nivell 2. Mou els controls i mira com canvia la gràfica. Supera els cinc reptes.</p>' +
      '<div class="sliders"><label><span>Velocitat inicial v</span> <input type="range" id="sv" min="0" max="40" step="0.5" value="20"><span id="vv"></span></label>' +
      '<label><span>Altura inicial h<sub>0</sub></span> <input type="range" id="sh" min="0" max="30" step="1" value="0"><span id="vh"></span></label></div>' +
      '<div id="gr"></div><div class="facts" id="facts"></div><div class="chal" id="chal"></div><div id="fb"></div>');
    wireBack();
    function metrics(v, h0) { var tl = (v + Math.sqrt(v * v + 20 * h0)) / 10; return { tl: tl, tm: v / 10, hmax: h0 + v * v / 20 }; }
    function drawG(v, h0, m) {
      var W = 620, H = 310, L = 40, B = 30, T = 22, R = 12, tmax = 8, hm = 80;
      var X = function (t) { return L + t / tmax * (W - L - R); }, Y = function (h) { return H - B - h / hm * (H - B - T); };
      var s = '<svg class="graph" viewBox="0 0 ' + W + ' ' + H + '">';
      for (var t = 0; t <= tmax; t++) s += '<line class="gr" x1="' + X(t) + '" y1="' + Y(0) + '" x2="' + X(t) + '" y2="' + Y(hm) + '"/><text class="lb" x="' + X(t) + '" y="' + (H - 12) + '" text-anchor="middle">' + t + '</text>';
      for (var h = 0; h <= hm; h += 10) s += '<line class="gr" x1="' + X(0) + '" y1="' + Y(h) + '" x2="' + X(tmax) + '" y2="' + Y(h) + '"/><text class="lb" x="' + (L - 6) + '" y="' + (Y(h) + 4) + '" text-anchor="end">' + h + '</text>';
      s += '<line class="ax" x1="' + X(0) + '" y1="' + Y(0) + '" x2="' + X(tmax) + '" y2="' + Y(0) + '"/><line class="ax" x1="' + X(0) + '" y1="' + Y(0) + '" x2="' + X(0) + '" y2="' + Y(hm) + '"/>';
      s += '<text class="lb" x="' + (W - R) + '" y="' + (H - 1) + '" text-anchor="end">temps (s)</text><text class="lb" x="4" y="12">altura (m)</text>';
      var c = CH[cur];
      if (c.wall) s += '<rect class="wall" x="' + (X(1) - 4) + '" y="' + Y(20) + '" width="8" height="' + (Y(0) - Y(20)) + '"/>';
      if (c.plat) s += '<rect class="plat" x="' + X(m.tm - 0.6 > 0 ? m.tm - 0.6 : 0) + '" y="' + (Y(c.plat) - 3) + '" width="' + (X(1.2) - X(0)) + '" height="6"/>';
      if (h0 > 0) s += '<rect class="plat" x="' + X(0) + '" y="' + (Y(h0) - 3) + '" width="18" height="6"/>';
      var pts = [];
      for (var i = 0; i <= 200; i++) { var tt = m.tl * i / 200; if (tt > tmax) break; pts.push(X(tt).toFixed(1) + ',' + Y(Math.max(0, Math.min(hm, -5 * tt * tt + v * tt + h0))).toFixed(1)); }
      s += '<polyline class="cv" points="' + pts.join(' ') + '"/>';
      if (m.tm <= tmax && m.hmax <= hm) s += '<circle class="pt" cx="' + X(m.tm) + '" cy="' + Y(m.hmax) + '" r="5"/>';
      return s + '</svg>';
    }
    function render() {
      var v = +document.getElementById('sv').value, h0 = +document.getElementById('sh').value, m = metrics(v, h0);
      document.getElementById('vv').textContent = fmt(v, 1) + ' m/s'; document.getElementById('vh').textContent = h0 + ' m';
      document.getElementById('gr').innerHTML = drawG(v, h0, m);
      document.getElementById('facts').innerHTML = '<span>h(t) = <b>−5t<sup>2</sup> + ' + fmt(v, 1) + 't' + (h0 ? ' + ' + h0 : '') + '</b></span><span>Altura màxima: <b>' + fmt(m.hmax, 1) + ' m</b> (t = ' + fmt(m.tm, 2) + ' s)</span><span>Aterra: <b>t = ' + fmt(m.tl, 2) + ' s</b></span>';
      document.getElementById('chal').innerHTML = CH.map(function (c, k) {
        return '<div class="c' + (solved.indexOf(k) >= 0 ? ' done' : '') + (k === cur ? ' on' : '') + '"><span><b>Repte ' + (k + 1) + '.</b> ' + c.t + '</span>' + (solved.indexOf(k) >= 0 ? '<span>★</span>' : '<button class="btn sm" data-k="' + k + '">' + (k === cur ? 'Comprova' : 'Tria') + '</button>') + '</div>';
      }).join('');
      [].forEach.call(document.querySelectorAll('#chal button'), function (b) {
        b.onclick = function () {
          var k = +b.dataset.k;
          if (k !== cur) { cur = k; document.getElementById('fb').innerHTML = ''; render(); return; }
          var good = CH[k].ok(v, h0, m);
          if (good) { if (solved.indexOf(k) < 0) solved.push(k); S.e4 = solved; save(); var nx = CH.findIndex(function (c, j) { return solved.indexOf(j) < 0; }); if (nx >= 0) cur = nx; }
          render();
          document.getElementById('fb').innerHTML = good ? (solved.length === CH.length ? done(ep, 'Has dissenyat cinc salts diferents. A la Temporada 2 estudiarem aquestes gràfiques: les <b>paràboles</b>.') : '<div class="fbk ok">Repte superat! Passa al següent.</div>') : '<div class="fbk ko">Encara no. Pista: ' + CH[k].tip + '</div>';
        };
      });
    }
    document.getElementById('sv').oninput = render; document.getElementById('sh').oninput = render;
    render();
  }

  // Episodi 5 · Dominó de gràfiques (memory)
  function ep5(ep) {
    var pairs = shuffle(STORIES).slice(0, 6);
    var cards = shuffle(pairs.map(function (p, k) { return { k: k, kind: 'txt', h: p.t }; }).concat(pairs.map(function (p, k) { return { k: k, kind: 'g', h: graph(SH[p.s], { y: p.y }) }; })));
    var up = [], matched = 0, moves = 0, players = 1, turn = 0, pts = [0, 0], lock = false;
    root.innerHTML = frame(ep, '<p>Gira dues cartes: si són una història i la seva gràfica, te les quedes. Podeu jugar sols o <b>per parelles</b> (per torns).</p>' +
      '<div class="row"><button class="btn sm" id="p1">1 jugador</button><button class="btn ghost sm" id="p2">2 jugadors</button><span id="st" class="small2"></span></div><div class="cards" id="cards"></div><div id="fb"></div>');
    wireBack();
    function status() {
      document.getElementById('st').innerHTML = players === 1 ? 'Moviments: <b>' + moves + '</b> · Parelles: <b>' + matched + '/6</b>' :
        'Torn del <b>jugador ' + (turn + 1) + '</b> · J1: <b>' + pts[0] + '</b> · J2: <b>' + pts[1] + '</b>';
    }
    function draw() {
      document.getElementById('cards').innerHTML = cards.map(function (c, i) {
        var show = c.m || up.indexOf(i) >= 0;
        return '<button class="card2' + (c.m ? ' match' : show ? ' up' : '') + '" data-i="' + i + '"' + (c.m ? ' disabled' : '') + '>' + (show ? c.h : '?') + '</button>';
      }).join('');
      [].forEach.call(document.querySelectorAll('.card2'), function (b) { b.onclick = function () { flip(+b.dataset.i); }; });
      status();
    }
    function flip(i) {
      if (lock || cards[i].m || up.indexOf(i) >= 0) return;
      up.push(i); draw();
      if (up.length < 2) return;
      moves++;
      var a = cards[up[0]], b = cards[up[1]];
      if (a.k === b.k && a.kind !== b.kind) {
        a.m = b.m = true; matched++; pts[turn]++; up = []; draw();
        if (matched === 6) document.getElementById('fb').innerHTML = done(ep, players === 1 ? 'Ho has fet en ' + moves + ' moviments.' : (pts[0] === pts[1] ? 'Empat!' : 'Guanya el jugador ' + (pts[0] > pts[1] ? 1 : 2) + '!'));
      } else {
        lock = true;
        setTimeout(function () { up = []; lock = false; if (players === 2) turn = 1 - turn; draw(); }, 1100);
      }
    }
    document.getElementById('p1').onclick = function () { players = 1; this.className = 'btn sm'; document.getElementById('p2').className = 'btn ghost sm'; status(); };
    document.getElementById('p2').onclick = function () { players = 2; this.className = 'btn sm'; document.getElementById('p1').className = 'btn ghost sm'; status(); };
    draw();
  }

  // Episodi 6 · Posa't al dia (llegeix el progrés del joc en aquest navegador)
  function ep6(ep) {
    var DB = null; try { DB = JSON.parse(localStorage.getItem('cgs-mates4A-v1')); } catch (e) {}
    var p = DB && DB.current && DB.players ? DB.players[DB.current] : null;
    var NOMS = { N2: 'Nivell 2 · La física del salt', N3: 'Nivell 3 · La botiga i el llançament' };
    var h = '<p>Abans de vacances, deixa el trimestre ben tancat. Aquesta llista llegeix el teu progrés del joc <b>en aquest navegador</b>.</p>';
    if (!p) h += '<div class="fbk ko">No trobo cap partida en aquest navegador. Obre <a href="temporada1.html">el joc</a> amb el teu nom i torna aquí.</div>';
    else {
      var m = p.missions || {}, pend = [];
      ['N2M1', 'N2M2', 'N2M3', 'N2M4', 'N2M5', 'N2M6', 'N2M7', 'N2M8', 'N2B', 'N3M1', 'N3M2', 'N3M3', 'N3M4', 'N3M5', 'N3M6', 'N3M7', 'N3M8', 'N3M9', 'N3M10', 'N3B'].forEach(function (id) {
        if (!m[id] || !m[id].done) pend.push(id);
      });
      var quick = 0; try { quick = (JSON.parse(localStorage.getItem('cgs-entrenament-1a')) || {}).xp || 0; } catch (e) {}
      h += '<p>Jugador/a: <b>' + esc(p.nom) + '</b></p><ul class="checklist">' +
        '<li>' + (pend.filter(function (x) { return x[1] === '2'; }).length ? '☐' : '☑') + ' ' + NOMS.N2 + ': ' + (pend.filter(function (x) { return x[1] === '2'; }).length ? pend.filter(function (x) { return x[1] === '2'; }).length + ' missions pendents' : 'complet') + '</li>' +
        '<li>' + (pend.filter(function (x) { return x[1] === '3'; }).length ? '☐' : '☑') + ' ' + NOMS.N3 + ': ' + (pend.filter(function (x) { return x[1] === '3'; }).length ? pend.filter(function (x) { return x[1] === '3'; }).length + ' missions pendents' : 'complet') + '</li>' +
        '<li>☐ Descarrega l\'informe (a l\'<a href="index.html#informes">Inici</a>) i comprova que l\'has lliurat al Classroom</li>' +
        '<li>' + (quick > 0 ? '☑' : '☐') + ' Preguntes ràpides de la 1a avaluació: ' + quick + ' XP · genera el «Resum per a la profe» i enganxa\'l al Classroom</li></ul>' +
        '<div class="row"><a class="btn" href="temporada1.html">Obre el joc</a><a class="btn ghost" href="entrenament-1a.html">Preguntes ràpides</a><a class="btn ghost" href="estudi.html">Estudi</a></div>';
      if (!pend.length) h += done(ep, 'Tens el Nivell 2 i el Nivell 3 complets. Quan hagis lliurat l\'informe, ja pots desconnectar!');
      else h += '<p class="small2">La insígnia «' + ep.medal + '» apareix quan tens totes les missions dels nivells 2 i 3 superades.</p>';
    }
    root.innerHTML = frame(ep, h); wireBack();
  }

  // Episodi 7 · Enigma de Nadal
  function ep7(ep) {
    var L = [
      { t: 'Notació científica', q: 'El repartidor de regals té 2,4 · 10<sup>9</sup> paquets i en reparteix 4 · 10<sup>4</sup> per segon. Quants segons tarda? Escriu-ho com 6 · 10<sup>n</sup>: quant val <b>n</b>?', a: 4, h: 'Divideix els nombres (2,4 : 4 = 0,6) i resta els exponents. Després corregeix: 0,6 · 10<sup>5</sup> = 6 · 10<sup>?</sup>' },
      { t: 'Polinomis', q: 'La caixa de regals té un volum de P(x) = x<sup>3</sup> − 2x<sup>2</sup> − 5x + 6. Quina és la seva <b>arrel positiva més gran</b>?', a: 3, h: 'Prova divisors de 6 amb Ruffini: x = 1 és arrel; el quocient és x<sup>2</sup> − x − 6.' },
      { t: 'Equacions', q: 'Els rens estiren el trineu amb una força que compleix 3(x − 2) = x + 4. Quant val <b>x</b>?', a: 5, h: 'Treu el parèntesi: 3x − 6 = x + 4.' },
      { t: 'Percentatges', q: 'Un jersei de Nadal de 40 € té un <b>80 % de descompte</b>. Quants euros es paguen?', a: 8, h: 'Índex de variació: 1 − 0,80 = 0,20.' },
      { t: 'Gràfiques', q: 'La gràfica mostra la temperatura del forn de galetes. <b>Quants minuts</b> està el forn a temperatura constant?', a: 6, h: 'Busca el tram horitzontal i compta els minuts de l\'eix.', fig: graph([[0, 1], [2, 8], [8, 8], [10, 2]], { y: 'temperatura', x: 'minuts (0–10)' }) }
    ];
    var got = S.e7 || [];
    function draw() {
      var h = '<p class="snow">❄ ❄ ❄</p><p>La caixa amb el regal de l\'estudi té <b>cinc cadenats</b>. Cada cadenat s\'obre amb un nombre d\'una xifra. Quan els tingueu tots, el <b>codi secret</b> és la llista dels cinc nombres. Es pot fer en equip!</p>';
      L.forEach(function (l, k) {
        var ok = got[k] !== undefined;
        h += '<div class="lock' + (ok ? ' open' : '') + '"><div class="ln">' + (ok ? l.a : (k + 1)) + '</div><div><b>' + l.t + '</b><p>' + l.q + '</p>' + (l.fig ? '<div style="max-width:320px">' + l.fig + '</div>' : '') +
          (ok ? '<p>🔓 Obert!</p>' : '<div class="row"><input id="in' + k + '" inputmode="numeric" style="width:6ch" aria-label="Resposta del cadenat ' + (k + 1) + '"><button class="btn sm" data-k="' + k + '">Prova</button><button class="btn ghost sm" data-h="' + k + '">Pista</button></div><div id="m' + k + '"></div>') + '</div></div>';
      });
      var code = L.map(function (l, k) { return got[k] !== undefined ? l.a : '_'; }).join(' ');
      h += '<div class="code">' + code + '</div>';
      if (got.filter(function (x) { return x !== undefined; }).length === L.length) h += done(ep, '<b>Codi 4 3 5 8 6: caixa oberta!</b> Dins hi ha el missatge de l\'estudi: «Gràcies per un primer trimestre fantàstic. Bones festes i fins a la Temporada 2!»');
      root.innerHTML = frame(ep, h); wireBack();
      [].forEach.call(root.querySelectorAll('[data-k]'), function (b) {
        b.onclick = function () {
          var k = +b.dataset.k, v = parseInt(String(document.getElementById('in' + k).value).trim(), 10);
          if (v === L[k].a) { got[k] = v; S.e7 = got; save(); draw(); }
          else document.getElementById('m' + k).innerHTML = '<div class="fbk ko">Aquest nombre no obre el cadenat.</div>';
        };
      });
      [].forEach.call(root.querySelectorAll('[data-h]'), function (b) { b.onclick = function () { var k = +b.dataset.h; document.getElementById('m' + k).innerHTML = '<div class="fbk ok">Pista: ' + L[k].h + '</div>'; }; });
    }
    draw();
  }

  function route() {
    var id = location.hash.replace('#', ''), ep = EPS.filter(function (e) { return e.id === id; })[0];
    if (ep && open(ep)) { ep.fn(ep); window.scrollTo(0, 0); } else hub();
  }
  window.addEventListener('hashchange', route);
  route();
  window.CGS_T2 = { STORIES: STORIES, SH: SH, EPS: EPS };
})();
