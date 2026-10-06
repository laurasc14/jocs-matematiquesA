/* Corbatera Games Studio · motor del joc */
(function (U) {
  var KEY = 'cgs-mates4A-v1';
  var DOCENT = /[?&]docent\b/.test(location.search);
  var app = document.getElementById('app');
  var DB = { players: {}, current: null };
  var storageOK = true;

  function load() {
    try { var raw = localStorage.getItem(KEY); if (raw) DB = JSON.parse(raw); } catch (e) { storageOK = false; }
    DB.players = DB.players || {};
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(DB)); } catch (e) { storageOK = false; } }
  function P() { return DB.players[DB.current]; }

  var MISSIONS = [];
  CGS.NIVELLS.forEach(function (nv) { nv.missions.forEach(function (m) { m.nivell = nv; MISSIONS.push(m); }); });
  if (CGS.REPAS) CGS.REPAS.missions.forEach(function (m) { m.nivell = CGS.REPAS; MISSIONS.push(m); });
  function badgeOf(m) { return m.repas ? 'REPÀS' : m.boss ? 'BOSS' : 'FASE ' + m.fase; }
  function mById(id) { return MISSIONS.filter(function (m) { return m.id === id; })[0]; }

  var RANKS = [[0, 'Becari/ària'], [400, 'Junior dev'], [1200, 'Desenvolupador/a'], [2300, 'Sènior dev'], [3500, 'Lead dev'], [4800, 'Cap d\'estudi']];
  function rank(xp) { var r = RANKS[0]; RANKS.forEach(function (k) { if (xp >= k[0]) r = k; }); return r; }
  function nextRank(xp) { for (var i = 0; i < RANKS.length; i++) if (RANKS[i][0] > xp) return RANKS[i]; return null; }
  // Nivells ja fets a classe: passen al mode entrenament (tot obert)
  var ENTRENAMENT = ['N0', 'N1'];
  CGS.NIVELLS.forEach(function (nv) { nv.entrenament = ENTRENAMENT.indexOf(nv.id) >= 0; });
  // Preguntes ràpides (pàgines entrenament-1a.html i entrenament-2a.html): el seu XP també compta
  var QUICK = [
    { key: 'cgs-entrenament-1a', href: 'entrenament-1a.html', titol: 'Preguntes ràpides · 1a avaluació', sub: 'Nombres reals, potències i radicals, polinomis, equacions i problemes. Preguntes noves cada vegada, diari d\'errors (C, P, D), boss per nivell i «El meu avanç».' },
    { key: 'cgs-entrenament-2a', href: 'entrenament-2a.html', titol: 'Preguntes ràpides · 2a avaluació', sub: 'Representacions, funcions afins, quadràtiques i estadística.', amagat: true }   // amagat fins a la 2a avaluació: canvieu-ho a false per mostrar-lo
  ];
  // Apartat d'estudi (estudi.html): apartat de teoria de cada missió
  var ESTUDI = { N0M1: 'u1-conjunts', N0M2: 'u1-decimals', N0M3: 'u1-intervals', N0M4: 'u1-aproximacions', N0M5: 'u1-conjunts', N0M6: 'u1-enters', N0M7: 'u1-fraccions', N0B: 'u1',
    N1M1: 'u2-potencies', N1M2: 'u2-propietats', N1M3: 'u2-propietats', N1M4: 'u2-nc', N1M5: 'u2-nc', N1M6: 'u2-pitagores', N1M7: 'u2-radicals', N1M8: 'u2-radicals', N1M9: 'u2-potfrac', N1B: 'u2',
    N2M1: 'u3-monomis', N2M2: 'u3-operacions', N2M3: 'u3-operacions', N2M4: 'u3-notables', N2M5: 'u3-notables', N2M6: 'u3-factoritzar', N2M7: 'u3-divisio', N2M8: 'u3-ruffini', N2B: 'u3',
    N3M1: 'u4-eq1', N3M2: 'u4-eq2', N3M3: 'u4-eq2', N3M4: 'u4-eq2', N3M5: 'u4-problemes', N3M6: 'u4-percentatges', N3M7: 'u4-interessos', N3M8: 'u4-inequacions', N3M9: 'u4-sistemes', N3M10: 'u4-sistemes', N3B: 'u4' };
  function quickXP(q) { try { var s = JSON.parse(localStorage.getItem(q.key) || 'null'); return s && s.xp ? +s.xp : 0; } catch (e) { return 0; } }
  function trainXP() { return QUICK.filter(function (q) { return !q.amagat; }).reduce(function (a, q) { return a + quickXP(q); }, 0); }
  function missionXP(p) { var s = 0; Object.keys(p.missions).forEach(function (k) { s += p.missions[k].best || 0; }); return s; }
  function totalXP(p) { return missionXP(p) + trainXP(); }
  function unlocked(idx) {
    if (DOCENT || MISSIONS[idx].repas || MISSIONS[idx].nivell.entrenament) return true;
    // Cada nivell s'obre per la seva fase 1; dins del nivell, les fases van en ordre
    for (var i = 0; i < idx; i++) {
      if (MISSIONS[i].nivell !== MISSIONS[idx].nivell) continue;
      var st = P().missions[MISSIONS[i].id]; if (!st || !st.done) return false;
    }
    return true;
  }

  // Genera tots els exercicis d'una partida (deterministes: nom + missió + partida)
  function exercises(m, run) {
    var r = U.rng(DB.current.toLowerCase() + '|' + m.id + '|' + run), used = [], out = [];
    for (var i = 0; i < m.n; i++) out.push(m.gen(r, i, used));
    return out;
  }

  // ======================= PANTALLA D'INICI =======================
  function viewStart() {
    var names = Object.keys(DB.players);
    var h = '<section class="card start">' +
      '<div class="badge">FASE 0 · ACCÉS</div>' +
      '<h2>Benvingut/da a Corbatera Games Studio</h2>' +
      '<p>Sou un estudi petit que desenvolupa el seu primer joc: un plataformes 2D. Per fer-lo funcionar de veritat necessitareu les matemàtiques de cada <b>nivell</b>. Cada missió es resol <b>pas a pas</b> i tot el que fas (també els errors) queda guardat al teu <b>diari de procés</b>, que al final lliuraràs a la docent.</p>' +
      '<label for="nom">Nom i cognom</label>' +
      '<div class="row"><input id="nom" autocomplete="off" placeholder="Ex.: Laia Puig" maxlength="40"><button class="btn" id="go">Entra a l\'estudi</button></div>';
    if (names.length) {
      h += '<p class="small">O continua la partida guardada en aquest ordinador:</p><div class="chips">' +
        names.map(function (n) { return '<button class="chip" data-n="' + U.esc(n) + '">' + U.esc(n) + '</button>'; }).join('') + '</div>';
    }
    if (!storageOK) h += '<p class="warn">Aquest navegador no deixa guardar el progrés. Descarrega l\'informe abans de tancar la pàgina.</p>';
    h += '</section>';
    app.innerHTML = h;
    var go = function (n) {
      n = n.trim().replace(/\s+/g, ' ');
      if (n.length < 3) { document.getElementById('nom').focus(); return; }
      if (!DB.players[n]) DB.players[n] = { nom: n, creat: Date.now(), missions: {}, log: [] };
      DB.current = n; save();
      if (PENDING) { var j = PENDING; PENDING = null; jumpTo(j); } else viewMap();
    };
    document.getElementById('go').onclick = function () { go(document.getElementById('nom').value); };
    document.getElementById('nom').onkeydown = function (e) { if (e.key === 'Enter') go(this.value); };
    [].forEach.call(document.querySelectorAll('.chip'), function (b) { b.onclick = function () { go(b.dataset.n); }; });
  }

  // ======================= MAPA DE NIVELLS =======================
  function hud() {
    var p = P(), xp = totalXP(p), rk = rank(xp), nx = nextRank(xp);
    var pct = nx ? Math.round(100 * (xp - rk[0]) / (nx[0] - rk[0])) : 100;
    return '<div class="hud"><div><b>' + U.esc(p.nom) + '</b> · <span class="rank">' + rk[1] + '</span></div>' +
      '<div class="xpbar" title="' + xp + ' XP"><span style="width:' + pct + '%"></span></div>' +
      '<div class="xp" title="' + missionXP(p) + ' XP de missions + ' + trainXP() + ' XP de preguntes ràpides">' + xp + ' XP' + (nx ? ' <span class="small">(' + (nx[0] - xp) + ' per a ' + nx[1] + ')</span>' : '') + '</div></div>';
  }
  function viewMap() {
    var p = P(), h = hud();
    if (DOCENT) h += '<p class="docent">Mode docent: totes les missions desbloquejades.</p>';
    if (NOTICE) { h += '<p class="warn">' + NOTICE + '</p>'; NOTICE = ''; }
    var levelHTML = function (nv) {
      var o = '<section class="level' + (nv.entrenament ? ' train' : '') + '"><h2>' + nv.nom + '</h2><p class="sub">' + nv.sub + (nv.entrenament ? ' · ja fet a classe: totes les fases obertes' : '') + '</p><div class="missions">';
      nv.missions.forEach(function (m) {
        var idx = MISSIONS.indexOf(m), st = p.missions[m.id] || {}, open = unlocked(idx);
        var cls = 'mission' + (m.boss ? ' boss' : '') + (st.done ? ' done' : '') + (open ? '' : ' locked');
        o += '<button class="' + cls + '" data-id="' + m.id + '"' + (open ? '' : ' disabled') + '>' +
          '<span class="badge">' + badgeOf(m) + '</span>' +
          '<span class="mt">' + m.titol + '</span><span class="ms">' + m.sabers + '</span>' +
          '<span class="mstate">' + (st.done ? '✔ Superada · ' + (st.best || 0) + ' / ' + (st.max || '?') + ' XP' : open ? (st.runs ? 'En curs' : 'Disponible') : '🔒 Bloquejada') + '</span></button>';
      });
      return o + '</div></section>';
    };
    h += '<a class="card estudi-link" href="estudi.html"><span class="badge tr">ESTUDI</span> <b>Teoria</b> · Tota la teoria del trimestre, amb definicions, fórmules, exemples resolts i errors típics. Ideal per preparar els bosses i la prova. →</a>';
    h += '<h2 class="part">Nivells</h2>';
    CGS.NIVELLS.forEach(function (nv) { h += levelHTML(nv); });
    if (CGS.REPAS) {
      h += '<h2 class="part">Mode repàs</h2><p class="small">Tria un tema i fes una ronda d\'exercicis barrejats, pas a pas. Sempre obert; compta la teva millor ronda de cada tema i queda al diari de procés.</p><div class="missions">';
      CGS.REPAS.missions.forEach(function (m) {
        var st = p.missions[m.id] || {};
        h += '<button class="mission repascard' + (st.done ? ' done' : '') + '" data-id="' + m.id + '"><span class="badge rp">REPÀS</span><span class="mt">' + m.titol + '</span><span class="ms">' + m.sabers + '</span>' +
          '<span class="mstate">' + (st.runs ? 'Millor ronda: ' + (st.best || 0) + ' / ' + (st.max || '?') + ' XP · ' + st.runs + (st.runs === 1 ? ' ronda' : ' rondes') : m.n + ' exercicis per ronda') + '</span></button>';
      });
      h += '</div>';
    }
    h += '<h2 class="part">Mode entrenament</h2><p class="small">Preguntes ràpides per repassar. Tot el que hi guanyis també suma XP per al teu rang.</p>' +
      '<div class="quick">' + QUICK.filter(function (q) { return !q.amagat; }).map(function (q) {
        return '<a class="mission quickcard" href="' + q.href + '"><span class="badge tr">PREGUNTES RÀPIDES</span><span class="mt">' + q.titol + '</span><span class="ms">' + q.sub + '</span><span class="mstate">' + quickXP(q) + ' XP guanyats →</span></a>';
      }).join('') + '</div>';
    h += '<section class="card tools"><h3>Diari de procés</h3><p class="small">Tot el que has fet, pas a pas, amb els intents i les pistes. Quan acabis (o quan t\'ho demani la docent), descarrega l\'informe i penja\'l al Classroom.</p>' +
      '<div class="row"><button class="btn" id="diari">Mira el diari</button><button class="btn" id="inf">Descarrega l\'informe</button><button class="btn ghost" id="print">Imprimeix / PDF</button><button class="btn ghost" id="out">Canvia de jugador</button></div></section>';
    app.innerHTML = h;
    [].forEach.call(document.querySelectorAll('button.mission:not([disabled])'), function (b) { b.onclick = function () { startMission(b.dataset.id); }; });
    document.getElementById('diari').onclick = viewDiari;
    document.getElementById('inf').onclick = downloadReport;
    document.getElementById('print').onclick = printReport;
    document.getElementById('out').onclick = function () { DB.current = null; save(); viewStart(); };
    window.scrollTo(0, 0);
  }

  // ======================= MISSIÓ =======================
  var S = null; // estat de la partida en curs
  function startMission(id, forceNew) {
    var p = P(), m = mById(id), st = p.missions[id] || (p.missions[id] = { runs: 0, done: false, best: 0 });
    var cur = p.cur && p.cur.mid === id && !forceNew ? p.cur : null;
    if (!cur) { st.runs++; cur = p.cur = { mid: id, run: st.runs, ex: 0, step: 0, xp: 0, logIdx: [] }; }
    save();
    S = { m: m, cur: cur, exs: exercises(m, cur.run) };
    renderExercise();
  }
  function maxXP(m, exs) { var n = 0; exs.forEach(function (e) { n += e.steps.length; }); return n * 10; }

  function currentLog() {
    var p = P(), c = S.cur, k = c.logIdx[c.ex];
    if (k === undefined) {
      var e = S.exs[c.ex];
      p.log.push({ mid: S.m.id, mt: S.m.titol, run: c.run, ex: c.ex + 1, title: e.title, ctx: e.ctx, t0: Date.now(), steps: [] });
      k = c.logIdx[c.ex] = p.log.length - 1; save();
    }
    return p.log[k];
  }

  function renderExercise() {
    var m = S.m, c = S.cur, e = S.exs[c.ex], L = currentLog();
    var h = hud() + '<div class="mhead"><button class="btn ghost sm" id="back">← Mapa</button>' +
      '<div><span class="badge' + (m.repas ? ' rp' : '') + '">' + badgeOf(m) + '</span> <b>' + m.titol + '</b> <span class="small">· ' + m.nivell.nom + '</span></div>' +
      '<div class="small">Exercici ' + (c.ex + 1) + ' / ' + S.exs.length + ' · ' + c.xp + ' XP en aquesta partida</div></div>';
    h += '<div class="progress">' + S.exs.map(function (x, i) { return '<span class="' + (i < c.ex ? 'ok' : i === c.ex ? 'now' : '') + '"></span>'; }).join('') + '</div>';
    h += '<details class="theory"' + (c.ex === 0 && c.step === 0 && !m.boss ? ' open' : '') + '><summary>☰ Recuadre de teoria</summary><div>' + m.teoria + ((ESTUDI[m.id] || m.estudi) ? '<p class="small"><a href="estudi.html#' + (ESTUDI[m.id] || m.estudi) + '" target="_blank" rel="noopener">Teoria completa d\'aquest tema →</a></p>' : '') + '</div></details>';
    h += '<section class="card ex"><h3>' + e.title + '</h3><div class="ctx">' + e.ctx + '</div>' + (e.fig ? '<div class="figwrap">' + e.fig + '</div>' : '') + '<ol class="steps">';
    e.steps.forEach(function (st, i) {
      var lg = L.steps[i];
      if (i < c.step) {
        h += '<li class="done"><div class="sq">' + st.q + '</div><div class="proc">✔ ' + st.show +
          ' <span class="tag">' + (lg ? (lg.revealed ? 'solució mostrada · 0 XP' : '+' + lg.xp + ' XP' + (lg.hint ? ' · amb pista' : '')) : '') + '</span></div>' +
          (lg && lg.wrong.length ? '<div class="wrong">Intents anteriors: ' + lg.wrong.map(function (w) { return '<s>' + w + '</s>'; }).join(' · ') + '</div>' : '') + '</li>';
      } else if (i === c.step) {
        h += '<li class="active"><div class="sq">' + st.q + '</div>' + inputs(st) +
          '<div class="row act"><button class="btn" id="check">Comprova</button>' +
          (m.boss ? '' : '<button class="btn ghost" id="hint">Pista (màx. 5 XP)</button>') +
          '<button class="btn ghost hidden" id="reveal">Mostra la solució (0 XP)</button></div>' +
          '<div id="fb" class="fb" aria-live="polite"></div><div id="hintbox" class="hintbox hidden">' + st.hint + '</div></li>';
      } else {
        h += '<li class="todo"><div class="sq">Pas ' + (i + 1) + '</div></li>';
      }
    });
    h += '</ol>';
    if (c.step >= e.steps.length) {
      h += (e.after ? '<div class="figwrap">' + e.after + '</div>' : '') +
        '<div class="row"><button class="btn" id="next">' + (c.ex + 1 < S.exs.length ? 'Següent exercici →' : 'Acaba la missió') + '</button></div>';
    }
    h += '</section>';
    app.innerHTML = h;
    document.getElementById('back').onclick = viewMap;
    if (c.step < e.steps.length) wireStep(e.steps[c.step], L);
    else document.getElementById('next').onclick = nextExercise;
    var act = document.querySelector('.active input, .active select, #next');
    if (act) act.focus({ preventScroll: true });
    var a = document.querySelector('.active') || document.getElementById('next');
    if (a && c.step > 0) a.scrollIntoView({ block: 'center' });
  }

  function inputs(st) {
    if (st.choices) return '<div class="choices">' + st.choices.map(function (t, i) { return '<label class="opt"><input type="radio" name="ch" value="' + i + '"> <span>' + t + '</span></label>'; }).join('') + '</div>';
    if (st.multi) return '<div class="choices">' + st.multi.map(function (t, i) { return '<label class="opt"><input type="checkbox" value="' + i + '"> <span>' + t + '</span></label>'; }).join('') + '</div>';
    var fi = 0, hasInf = false;
    var h = '<div class="parts">' + st.parts.map(function (pt) {
      if (pt === '\n') return '<span class="br"></span>';
      if (typeof pt === 'string') return '<span>' + pt + '</span>';
      var id = 'f' + (fi++);
      if (pt.sel) return '<select id="' + id + '"><option value="">?</option>' + pt.sel.map(function (o) { return '<option>' + U.esc(o) + '</option>'; }).join('') + '</select>';
      if (pt.inf) hasInf = true;
      return '<input id="' + id + '" class="fld" style="width:' + ((pt.w || 4) + 2) + 'ch" inputmode="' + (pt.text ? 'numeric' : 'decimal') + '" autocomplete="off">';
    }).join('') + '</div>';
    if (hasInf) h += '<div class="row infb"><button class="btn ghost sm" data-ins="-∞">−∞</button><button class="btn ghost sm" data-ins="+∞">+∞</button><span class="small">(escriu al camp seleccionat)</span></div>';
    return h;
  }

  function readAnswer(st) {
    if (st.choices) {
      var c = document.querySelector('input[name=ch]:checked');
      if (!c) return null;
      var i = +c.value; return { ok: i === st.ans, txt: U.stripTags(st.choices[i]) };
    }
    if (st.multi) {
      var sel = [].map.call(document.querySelectorAll('.choices input:checked'), function (x) { return +x.value; });
      if (!sel.length) return null;
      var ok = sel.length === st.ans.length && st.ans.every(function (k) { return sel.indexOf(k) >= 0; });
      return { ok: ok, txt: sel.map(function (k) { return st.multi[k].split(' ')[0]; }).join(', ') };
    }
    var fi = 0, ok2 = true, empty = false, txt = '', bad = [];
    st.parts.forEach(function (pt) {
      if (pt === '\n') { txt += ' / '; return; }
      if (typeof pt === 'string') { txt += U.stripTags(pt.replace(/<sup>/g, '^').replace(/<\/sup>/g, ' ')); return; }
      var el = document.getElementById('f' + (fi++)), v = el.value.trim();
      if (v === '') empty = true;
      txt += '[' + v + ']';
      var good;
      if (pt.sel) good = v === pt.ans;
      else if (pt.text) good = U.normText(v) === U.normText(pt.ans);
      else {
        var n = U.parseNum(v);
        if (!isFinite(pt.ans)) good = n === pt.ans;
        else good = isFinite(n) && Math.abs(n - pt.ans) <= (pt.tol || 1e-9) + 1e-12 * Math.abs(pt.ans);
      }
      if (!good) { ok2 = false; bad.push(el); }
      el.classList.toggle('bad', !good && v !== '');
    });
    if (empty) return null;
    return { ok: ok2, txt: txt.replace(/\s+/g, ' ').trim() };
  }

  function wireStep(st, L) {
    var c = S.cur, i = c.step, fb = document.getElementById('fb');
    var lg = L.steps[i] || (L.steps[i] = { q: st.q, wrong: [], hint: false, revealed: false, xp: 0, t0: Date.now() });
    var lastFocus = null;
    [].forEach.call(document.querySelectorAll('.fld'), function (f) {
      f.addEventListener('focus', function () { lastFocus = f; });
      f.addEventListener('keydown', function (e) { if (e.key === 'Enter') document.getElementById('check').click(); });
    });
    [].forEach.call(document.querySelectorAll('[data-ins]'), function (b) {
      b.onclick = function () { var f = lastFocus || document.querySelector('.fld'); f.value = b.dataset.ins; f.focus(); };
    });
    if (lg.wrong.length) fb.innerHTML = '<span class="no">Intents fallits: ' + lg.wrong.length + '</span>';
    if (lg.wrong.length >= 3) document.getElementById('reveal').classList.remove('hidden');
    if (lg.hint) document.getElementById('hintbox').classList.remove('hidden');
    var hb = document.getElementById('hint');
    if (hb) hb.onclick = function () { lg.hint = true; save(); document.getElementById('hintbox').classList.remove('hidden'); hb.disabled = true; };
    document.getElementById('check').onclick = function () {
      var a = readAnswer(st);
      if (!a) { fb.innerHTML = '<span class="no">Respon tots els camps abans de comprovar.</span>'; return; }
      if (a.ok) {
        var xp = Math.max(3, 10 - 3 * lg.wrong.length); if (lg.hint) xp = Math.min(xp, 5);
        finishStep(lg, xp, a.txt, false);
      } else {
        lg.wrong.push(U.esc(a.txt)); save();
        fb.innerHTML = '<span class="no">✘ Encara no. ' + (S.m.boss ? 'Revisa el procediment.' : lg.wrong.length === 1 ? 'Revisa-ho; si cal, demana una pista.' : 'Mira la pista i torna-ho a provar.') + '</span>';
        if (!S.m.boss && lg.wrong.length >= 2) { lg.hint = true; document.getElementById('hintbox').classList.remove('hidden'); }
        if (lg.wrong.length >= 3) document.getElementById('reveal').classList.remove('hidden');
        var box = document.querySelector('.active'); box.classList.remove('shake'); void box.offsetWidth; box.classList.add('shake');
      }
    };
    document.getElementById('reveal').onclick = function () { finishStep(lg, 0, '—', true); };
  }

  function finishStep(lg, xp, txt, revealed) {
    var st = S.exs[S.cur.ex].steps[S.cur.step];
    lg.xp = xp; lg.ok = !revealed; lg.revealed = revealed; lg.ans = U.esc(txt); lg.show = st.show; lg.t1 = Date.now();
    S.cur.xp += xp; S.cur.step++;
    if (S.cur.step >= S.exs[S.cur.ex].steps.length) currentLog().t1 = Date.now();
    save(); renderExercise();
  }

  function nextExercise() {
    var c = S.cur;
    if (c.ex + 1 < S.exs.length) { c.ex++; c.step = 0; save(); renderExercise(); return; }
    // Final de missió
    var p = P(), m = S.m, st = p.missions[m.id], max = maxXP(m, S.exs), pct = c.xp / max;
    var passed = !m.boss || pct >= 0.6;
    st.max = max;
    if (passed) { st.done = true; st.best = Math.max(st.best || 0, c.xp); }
    p.cur = null; save();
    var logs = p.log.filter(function (l) { return l.mid === m.id && l.run === c.run; });
    var nSteps = 0, first = 0, hints = 0, rev = 0;
    logs.forEach(function (l) { l.steps.forEach(function (s) { nSteps++; if (!s.wrong.length && !s.hint && !s.revealed) first++; if (s.hint) hints++; if (s.revealed) rev++; }); });
    var h = hud() + '<section class="card end ' + (passed ? 'win' : 'lose') + '"><div class="badge">' + badgeOf(m) + '</div>' +
      '<h2>' + (passed ? (m.repas ? 'Ronda de repàs acabada!' : m.boss ? 'Boss derrotat!' : 'Missió superada!') : 'El boss encara resisteix…') + '</h2>' +
      '<p class="bigxp">' + c.xp + ' / ' + max + ' XP</p>' +
      '<ul class="stats"><li><b>' + first + '</b> de ' + nSteps + ' passos a la primera</li><li><b>' + hints + '</b> pistes</li><li><b>' + rev + '</b> solucions mostrades</li></ul>' +
      (m.boss && !passed ? '<p>Per superar el boss cal un 60 % dels XP. Repassa les fases i torna-ho a provar (els nombres canvien).</p>' : '') +
      '<div class="row"><button class="btn" id="map">Torna al mapa</button><button class="btn ghost" id="again">Juga-la de nou (nombres nous)</button></div></section>';
    app.innerHTML = h;
    document.getElementById('map').onclick = viewMap;
    document.getElementById('again').onclick = function () { startMission(m.id, true); };
    window.scrollTo(0, 0);
  }

  // ======================= DIARI I INFORME =======================
  function diariHTML(p) {
    var h = '';
    var byRun = {};
    p.log.forEach(function (l) { var k = l.mid + '#' + l.run; (byRun[k] = byRun[k] || []).push(l); });
    MISSIONS.forEach(function (m) {
      Object.keys(byRun).filter(function (k) { return k.split('#')[0] === m.id; }).forEach(function (k) {
        var ls = byRun[k], xp = 0;
        ls.forEach(function (l) { l.steps.forEach(function (s) { xp += s.xp || 0; }); });
        h += '<section class="dm"><h3><span class="badge">' + (m.boss ? 'BOSS' : m.nivell.id + ' · FASE ' + m.fase) + '</span> ' + m.titol + ' <span class="small">· partida ' + k.split('#')[1] + ' · ' + xp + ' XP · ' + new Date(ls[0].t0).toLocaleString('ca-ES') + '</span></h3>';
        ls.forEach(function (l) {
          var mins = l.t1 ? Math.max(1, Math.round((l.t1 - l.t0) / 60000)) + ' min' : 'sense acabar';
          h += '<div class="dex"><h4>Exercici ' + l.ex + ' · ' + l.title + ' <span class="small">(' + mins + ')</span></h4><div class="ctx">' + l.ctx + '</div><ol>';
          l.steps.forEach(function (s) {
            var tag = s.revealed ? '<span class="tag red">solució mostrada</span>' : s.ok ? '<span class="tag">+' + s.xp + ' XP' + (s.hint ? ' · pista' : '') + (s.wrong.length ? ' · ' + (s.wrong.length + 1) + ' intents' : ' · a la primera') + '</span>' : '<span class="tag">en curs</span>';
            h += '<li><div class="sq">' + s.q + '</div>' +
              (s.wrong.length ? '<div class="wrong">✘ ' + s.wrong.map(function (w) { return '<s>' + w + '</s>'; }).join(' · ') + '</div>' : '') +
              (s.show ? '<div class="proc">✔ ' + s.show + ' ' + tag + '</div>' : '<div class="proc">' + tag + '</div>') + '</li>';
          });
          h += '</ol></div>';
        });
        h += '</section>';
      });
    });
    return h || '<p>Encara no hi ha cap missió començada.</p>';
  }
  function summaryHTML(p) {
    var h = '<table class="sum"><thead><tr><th>Missió</th><th>Estat</th><th>Partides</th><th>Millor XP</th><th>Passos a la 1a</th><th>Pistes</th><th>Solucions</th></tr></thead><tbody>';
    MISSIONS.forEach(function (m) {
      var st = p.missions[m.id] || {}, n = 0, f = 0, hi = 0, rv = 0;
      p.log.forEach(function (l) { if (l.mid !== m.id) return; l.steps.forEach(function (s) { n++; if (!s.wrong.length && !s.hint && !s.revealed && s.ok) f++; if (s.hint) hi++; if (s.revealed) rv++; }); });
      h += '<tr><td>' + (m.repas ? 'REPÀS ' : m.boss ? 'BOSS ' : m.nivell.id + '·F' + m.fase + ' ') + m.titol + '</td><td>' + (st.done ? (m.repas ? '✔ ' + st.runs + ' rond.' : '✔ superada') : st.runs ? 'en curs' : '—') + '</td><td>' + (st.runs || 0) + '</td><td>' + (st.best || 0) + (st.max ? ' / ' + st.max : '') + '</td><td>' + (n ? f + ' / ' + n : '—') + '</td><td>' + hi + '</td><td>' + rv + '</td></tr>';
    });
    return h + '</tbody></table>';
  }
  function viewDiari() {
    var p = P();
    app.innerHTML = hud() + '<div class="mhead"><button class="btn ghost sm" id="back">← Mapa</button><b>Diari de procés</b><button class="btn sm" id="inf">Descarrega l\'informe</button></div>' +
      '<section class="card">' + summaryHTML(p) + '</section><section class="card diari">' + diariHTML(p) + '</section>';
    document.getElementById('back').onclick = viewMap;
    document.getElementById('inf').onclick = downloadReport;
    window.scrollTo(0, 0);
  }
  function reportDoc() {
    var p = P(), xp = totalXP(p), css = document.getElementById('report-css').textContent;
    return '<!doctype html><html lang="ca"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Informe · ' + U.esc(p.nom) + '</title><style>' + css + '</style></head><body class="report">' +
      '<header class="rhead"><div><b>Corbatera Games Studio</b> · Matemàtiques A · 4t ESO · Corbatera Institut Escola</div><div>Informe de procés</div></header>' +
      '<h1>' + U.esc(p.nom) + '</h1><p>' + xp + ' XP · rang: <b>' + rank(xp)[1] + '</b> · generat el ' + new Date().toLocaleString('ca-ES') + '</p>' +
      '<h2>Resum</h2><p>XP de missions: <b>' + missionXP(p) + '</b> · XP de preguntes ràpides (mode entrenament, en aquest navegador): <b>' + trainXP() + '</b></p>' + summaryHTML(p) + '<h2>Procés pas a pas</h2><p class="small">Per a cada pas: els intents fallits (ratllats), si s\'ha fet servir pista i la resposta correcta.</p>' + diariHTML(p) + '</body></html>';
  }
  function downloadReport() {
    var p = P(), blob = new Blob([reportDoc()], { type: 'text/html' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'Informe_CGS_' + p.nom.replace(/[^\wÀ-ÿ]+/g, '_') + '_' + new Date().toISOString().slice(0, 10) + '.html';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000);
  }
  function printReport() {
    var w = window.open('', '_blank');
    if (!w) { downloadReport(); return; }
    w.document.write(reportDoc()); w.document.close();
    setTimeout(function () { w.print(); }, 400);
  }

  window.addEventListener('pageshow', function (e) { if (e.persisted && DB.current && document.querySelector('.missions')) viewMap(); });
  // ======================= ARRENCADA =======================
  // Enllaços «Practica-ho» de l'apartat d'estudi: index.html#jugar=N2M8
  var PENDING = (location.hash.match(/jugar=(\w+)/) || [])[1] || null;
  if (PENDING) history.replaceState(null, '', location.pathname + location.search);
  if (PENDING && !mById(PENDING)) PENDING = null;
  var NOTICE = '';
  function jumpTo(id) {
    if (unlocked(MISSIONS.indexOf(mById(id)))) startMission(id);
    else { NOTICE = 'La missió «' + mById(id).titol + '» encara està bloquejada: acaba primer les fases anteriors del nivell.'; viewMap(); }
  }
  load();
  if (DB.current && DB.players[DB.current]) {
    var p = P();
    if (p.cur && !mById(p.cur.mid)) p.cur = null;
    if (PENDING) { jumpTo(PENDING); PENDING = null;    } else if (p.cur) { startMission(p.cur.mid); } else viewMap();
  } else viewStart();
  CGS._debug = { DB: function () { return DB; }, exercises: exercises, MISSIONS: MISSIONS };
})(CGS);
