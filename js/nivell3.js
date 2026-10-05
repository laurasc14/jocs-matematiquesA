/* NIVELL 3 · La botiga i el llançament — Unitat 4: equacions, percentatges, inequacions i sistemes */
(function (U) {
  var P = U.poly, PF = U.polyFields, fmt = U.fmt;
  var nz = function (r, lo, hi) { var v = 0; while (v === 0) v = r.int(lo, hi); return v; };
  var NOTA = '<p class="small">Escriu els nombres amb el seu signe (per exemple −3) i posa 0 si un terme no hi és.</p>';
  var eur = function (x) { return fmt(U.round(x, 2)) + ' €'; };
  var sideStr = function (a, b) { return P([a, b]); };
  var SIMB = ['<', '≤', '>', '≥'];
  var FLIP = { '<': '>', '≤': '≥', '>': '<', '≥': '≤' };

  // Rectes ax + by = c a la quadrícula
  function svgLines(lines, pt, size) {
    size = size || 10;
    var c = 28, W = size * c + 40, X = function (x) { return 20 + x * c; }, Y = function (y) { return 20 + (size - y) * c; };
    var s = '<svg class="fig grid" viewBox="0 0 ' + W + ' ' + W + '" role="img" aria-label="Rectes a la quadrícula"><defs><clipPath id="cl"><rect x="20" y="20" width="' + size * c + '" height="' + size * c + '"/></clipPath></defs>';
    for (var i = 0; i <= size; i++) {
      s += '<line x1="' + X(i) + '" y1="' + Y(0) + '" x2="' + X(i) + '" y2="' + Y(size) + '" class="gl"/><line x1="' + X(0) + '" y1="' + Y(i) + '" x2="' + X(size) + '" y2="' + Y(i) + '" class="gl"/>';
      s += '<text x="' + X(i) + '" y="' + (Y(0) + 14) + '" class="tick sm">' + i + '</text>';
      if (i) s += '<text x="' + (X(0) - 10) + '" y="' + (Y(i) + 4) + '" class="tick sm">' + i + '</text>';
    }
    var cols = ['l1', 'l2'];
    lines.forEach(function (L, k) {
      var a = L[0], b = L[1], cc = L[2], p1, p2;
      if (b !== 0) { p1 = [-2, (cc - a * -2) / b]; p2 = [size + 2, (cc - a * (size + 2)) / b]; }
      else { p1 = [cc / a, -2]; p2 = [cc / a, size + 2]; }
      s += '<line clip-path="url(#cl)" x1="' + X(p1[0]) + '" y1="' + Y(p1[1]) + '" x2="' + X(p2[0]) + '" y2="' + Y(p2[1]) + '" class="' + cols[k] + '"/>';
    });
    if (pt) s += '<circle cx="' + X(pt[0]) + '" cy="' + Y(pt[1]) + '" r="6" class="cut"/>';
    return s + '</svg>';
  }
  var lineStr = function (a, b, c, vx, vy) {
    vx = vx || 'x'; vy = vy || 'y';
    var t = (a === 1 ? '' : a === -1 ? '−' : fmt(a)) + vx;
    if (b) t += (b < 0 ? ' − ' : ' + ') + (Math.abs(b) === 1 ? '' : fmt(Math.abs(b))) + vy;
    return t + ' = ' + fmt(c);
  };

  // ---------- M3.1 Situar plataformes (equacions de 1r grau) ----------
  function genEq1(r, i) {
    var kind = ['parentesi', 'plataformes', 'denominadors', 'atrapar'][i % 4];
    if (kind === 'parentesi') {
      var x0 = r.int(-4, 9), a = r.int(2, 5), b = nz(r, -6, 6), c = nz(r, -3, 4);
      if (c === a) c = a + 1;
      var d = a * (x0 - b) - c * x0, L = a - c, R = d + a * b;
      return {
        title: 'Resol i comprova',
        ctx: '<div class="big">' + a + '(' + P([1, -b]) + ') = ' + sideStr(c, d) + '</div>' + NOTA,
        steps: [
          { q: '1) Treu el parèntesi.', parts: [{ ans: a, w: 3 }, 'x + ', { ans: -a * b, w: 4 }, ' = ' + sideStr(c, d)], hint: 'Multiplica ' + a + ' per cada terme del parèntesi.', show: P([a, -a * b]) + ' = ' + sideStr(c, d) },
          { q: '2) Lletres a un costat, nombres a l\'altre (el que canvia de costat canvia de signe).', parts: [{ ans: L, w: 3 }, 'x = ', { ans: R, w: 4 }],
            hint: 'Passa ' + P([c, 0]) + ' a l\'esquerra i ' + fmt(-a * b) + ' a la dreta.', show: P([L, 0]) + ' = ' + fmt(R) },
          { q: '3) Aïlla x.', parts: ['x = ', { ans: x0, w: 3 }], hint: 'Divideix ' + fmt(R) + ' entre ' + fmt(L) + '.', show: '<b>x = ' + fmt(x0) + '</b>' },
          { q: '4) Comprova: quant val cada costat per a x = ' + fmt(x0) + '?', parts: ['Esquerra = ', { ans: a * (x0 - b), w: 4 }, '  Dreta = ', { ans: c * x0 + d, w: 4 }], hint: 'Substitueix x a l\'equació original. Els dos costats han de donar igual.', show: 'Tots dos costats valen ' + fmt(a * (x0 - b)) + ' ✔' }
        ]
      };
    }
    if (kind === 'plataformes') {
      var n = r.int(3, 6), e = r.pick([40, 50, 60, 80]), x1 = r.pick([100, 120, 150, 160, 180, 200]), W = n * x1 + (n + 1) * e;
      var opts = r.shuffle([n + 'x + ' + (n + 1) * e + ' = ' + fmt(W), n + 'x = ' + fmt(W) + ' + ' + (n + 1) * e, 'x + ' + n * e + ' = ' + fmt(W)]);
      return {
        title: 'Repartir plataformes',
        ctx: 'La pantalla fa <b>' + fmt(W) + ' px</b> d\'ample. Hi volem <b>' + n + ' plataformes</b> iguals d\'amplada x i <b>' + (n + 1) + ' espais de ' + e + ' px</b> (entre elles i als extrems).',
        steps: [
          { q: 'Quina equació representa la situació?', choices: opts, ans: opts.indexOf(n + 'x + ' + (n + 1) * e + ' = ' + fmt(W)), hint: 'Amplada total = plataformes + espais.', show: n + 'x + ' + (n + 1) + ' · ' + e + ' = ' + fmt(W) },
          { q: 'Agrupa els nombres a la dreta.', parts: [n + 'x = ', { ans: W - (n + 1) * e, w: 5 }], hint: fmt(W) + ' − ' + (n + 1) * e, show: n + 'x = ' + fmt(W - (n + 1) * e) },
          { q: 'Aïlla x.', parts: ['x = ', { ans: x1, w: 4 }, ' px'], hint: 'Divideix entre ' + n + '.', show: 'Cada plataforma fa <b>' + x1 + ' px</b>' }
        ]
      };
    }
    if (kind === 'denominadors') {
      var pq = r.pick([[2, 3], [2, 5], [3, 4], [4, 6], [2, 6], [3, 6]]), p = pq[0], q = pq[1];
      var m = p * q / U.gcd(p, q), k = r.int(1, 4), x2 = m * k * r.pick([1, 2]), rhs = x2 / p + x2 / q;
      return {
        title: 'Equació amb denominadors',
        ctx: 'Resol:<div class="big">' + U.frac('x', p) + ' + ' + U.frac('x', q) + ' = ' + fmt(rhs) + '</div>',
        steps: [
          { q: 'Quin és el m.c.m. dels denominadors?', parts: ['m.c.m.(' + p + ', ' + q + ') = ', { ans: m, w: 3 }], hint: 'El nombre més petit que és múltiple de ' + p + ' i de ' + q + '.', show: 'm.c.m. = ' + m },
          { q: 'Multiplica tots els termes per ' + m + '.', parts: [{ ans: m / p, w: 3 }, 'x + ', { ans: m / q, w: 3 }, 'x = ', { ans: m * rhs, w: 4 }], hint: m + ' : ' + p + ' = ' + m / p + ', ' + m + ' : ' + q + ' = ' + m / q + ' i ' + m + ' · ' + fmt(rhs) + '.', show: P([m / p, 0]) + ' + ' + P([m / q, 0]) + ' = ' + fmt(m * rhs) },
          { q: 'Agrupa i aïlla x.', parts: ['x = ', { ans: x2, w: 4 }], hint: (m / p + m / q) + 'x = ' + fmt(m * rhs), show: '<b>x = ' + x2 + '</b> (comprova: ' + fmt(x2 / p) + ' + ' + fmt(x2 / q) + ' = ' + fmt(rhs) + ' ✔)' }
        ]
      };
    }
    var v2 = r.pick([50, 60, 70, 80]), dv = r.pick([20, 40, 50, 80]), v1 = v2 + dv, t0 = r.int(2, 8), d0 = dv * t0;
    var good = v1 + 't = ' + d0 + ' + ' + v2 + 't', opts2 = r.shuffle([good, v1 + 't + ' + v2 + 't = ' + d0, v1 + 't = ' + v2 + 't − ' + d0]);
    return {
      title: 'L\'atrapa?',
      ctx: 'L\'heroi corre a <b>' + v1 + ' px/s</b> i surt de la posició 0. L\'enemic és <b>' + d0 + ' px</b> per davant i fuig a <b>' + v2 + ' px/s</b>. Quan l\'atrapa?',
      steps: [
        { q: 'Posició de cadascun al cap de t segons. Quina equació diu «són al mateix lloc»?', choices: opts2, ans: opts2.indexOf(good), hint: 'Heroi: ' + v1 + 't. Enemic: comença a ' + d0 + ' i avança ' + v2 + 't.', show: good },
        { q: 'Agrupa les t a l\'esquerra.', parts: [{ ans: dv, w: 3 }, 't = ', { ans: d0, w: 4 }], hint: v1 + 't − ' + v2 + 't = ?', show: dv + 't = ' + d0 },
        { q: 'Aïlla t.', parts: ['t = ', { ans: t0, w: 3 }, ' s'], hint: 'Divideix.', show: 't = <b>' + t0 + ' s</b>' },
        { q: 'A quina posició l\'atrapa?', parts: [{ ans: v1 * t0, w: 5 }, ' px'], hint: 'Substitueix t a la posició de l\'heroi (o de l\'enemic: ha de donar el mateix).', show: 'L\'atrapa a ' + v1 * t0 + ' px (' + d0 + ' + ' + v2 + ' · ' + t0 + ' = ' + v1 * t0 + ' ✔)' }
      ]
    };
  }

  // ---------- Fórmula de 2n grau (comú) ----------
  function quadSteps(a, b, c, roots, v) {
    v = v || 'x';
    var D = b * b - 4 * a * c, sq = Math.sqrt(D);
    return [
      { q: 'Escriu a, b i c (amb el seu signe).', parts: ['a = ', { ans: a, w: 3 }, '  b = ', { ans: b, w: 4 }, '  c = ', { ans: c, w: 4 }], hint: 'a multiplica ' + v + '<sup>2</sup>, b multiplica ' + v + ' i c és el terme independent.', show: 'a = ' + fmt(a) + ', b = ' + fmt(b) + ', c = ' + fmt(c) },
      { q: 'Calcula el discriminant Δ = b<sup>2</sup> − 4ac.', parts: ['Δ = ', { ans: D, w: 5 }], hint: '(' + fmt(b) + ')<sup>2</sup> − 4 · (' + fmt(a) + ') · (' + fmt(c) + '). Compte amb els signes.', show: 'Δ = ' + fmt(b * b) + ' − (' + fmt(4 * a * c) + ') = ' + fmt(D) + ' → √Δ = ' + fmt(sq) },
      { q: 'Aplica la fórmula ' + v + ' = (−b ± √Δ) / 2a. Solucions (de petita a gran):', parts: [v + '<sub>1</sub> = ', { ans: roots[0], w: 4 }, '   ' + v + '<sub>2</sub> = ', { ans: roots[1], w: 4 }],
        hint: '(' + fmt(-b) + ' − ' + fmt(sq) + ') / ' + fmt(2 * a) + ' i (' + fmt(-b) + ' + ' + fmt(sq) + ') / ' + fmt(2 * a) + '.', show: v + ' = (' + fmt(-b) + ' ± ' + fmt(sq) + ') / ' + fmt(2 * a) + ' → <b>' + fmt(roots[0]) + ' i ' + fmt(roots[1]) + '</b>' }
    ];
  }

  // ---------- M3.2 Quan aterra el salt? (fórmula general) ----------
  function genEq2(r, i) {
    if (i % 2 === 1) { // context: salt des d'una plataforma
      var t1 = r.int(2, 5), t2 = -r.int(1, 2), co = U.polyMul([-5], U.polyMul([1, -t1], [1, -t2]));
      var a = 1, b = -(t1 + t2), c = t1 * t2;
      var st = [{ q: 'El personatge toca a terra quan h(t) = 0. Divideix-ho tot entre −5 per simplificar.', parts: PF([a, b, c], 't').concat([' = 0']),
        hint: 'Divideix cada coeficient entre −5 (els signes canvien).', show: P([a, b, c], 't') + ' = 0' }].concat(quadSteps(a, b, c, [t2, t1], 't'));
      st.push({ q: 'Quina solució té sentit al joc?', choices: ['t = ' + fmt(t2) + ' s', 't = ' + fmt(t1) + ' s', 'Les dues'], ans: 1, hint: 'El temps no pot ser negatiu.', show: 'Aterra als <b>' + t1 + ' s</b> (es descarta t = ' + fmt(t2) + ': temps negatiu)' });
      return {
        title: 'Quan aterra el salt?',
        ctx: 'El personatge salta des d\'una plataforma:<div class="big">h(t) = ' + P(co, 't') + '</div>(metres, segons). Quan torna a terra?' + NOTA,
        steps: st
      };
    }
    var p = r.int(-6, 6), q = r.int(-6, 6), A = r.pick([1, 1, 2]);
    if (p === q) q = p + r.int(1, 4);
    var cof = U.polyMul([A], U.polyMul([1, -p], [1, -q]));
    // es presenta desordenada: ax² + c = −bx
    var shown = P([cof[0], 0, cof[2]]) + ' = ' + P([-cof[1], 0]);
    if (cof[1] === 0) shown = P([cof[0], 0, cof[2]]) + ' = 0';
    var roots = [Math.min(p, q), Math.max(p, q)];
    var steps = [{ q: 'Primer, passa-ho tot a l\'esquerra i iguala a 0.', parts: PF(cof).concat([' = 0']), hint: 'El terme que canvia de costat canvia de signe.', show: P(cof) + ' = 0' }].concat(quadSteps(cof[0], cof[1], cof[2], roots));
    return { title: 'La fórmula', ctx: 'Resol:<div class="big">' + shown + '</div>' + NOTA, steps: steps };
  }

  // ---------- M3.3 Dreceres (equacions incompletes) ----------
  var TIPUS = ['Sense terme en x (ax² + c = 0)', 'Sense terme independent (ax² + bx = 0)', 'Ja factoritzada', 'Completa: cal la fórmula'];
  function genIncompletes(r, i) {
    var kind = ['senseB', 'senseC', 'fact', 'senseB'][i % 4];
    if (kind === 'senseB') {
      var a = r.pick([1, 1, 2, 3]), k = r.int(2, 9), cap = i === 3 && r.bool();
      var c = cap ? a * k * k : -a * k * k;
      var st = [
        { q: 'Quin tipus d\'equació és? Tria la drecera.', choices: TIPUS, ans: 0, hint: 'Mira quins termes falten.', show: 'Sense terme en x → aïllem x<sup>2</sup>' },
        { q: 'Aïlla x<sup>2</sup>.', parts: ['x<sup>2</sup> = ', { ans: -c / a, w: 4 }], hint: 'Passa ' + fmt(c) + ' a la dreta i divideix entre ' + a + '.', show: 'x<sup>2</sup> = ' + fmt(-c / a) }
      ];
      if (cap) st.push({ q: 'Quines solucions té?', choices: ['x = ±' + k, 'x = ' + k, 'Cap: cap nombre al quadrat dona negatiu'], ans: 2, hint: 'Un quadrat no pot ser negatiu.', show: '<b>No té solució</b>' });
      else st.push({ q: 'Fes l\'arrel (no oblidis el ±). Solucions de petita a gran:', parts: ['x = ', { ans: -k, w: 3 }, '  i  x = ', { ans: k, w: 3 }], hint: '√' + k * k + ' = ' + k + ', i també el negatiu.', show: '<b>x = ±' + k + '</b>' });
      return { title: 'Drecera: aïlla x²', ctx: 'Resol:<div class="big">' + P([a, 0, c]) + ' = 0</div>', steps: st };
    }
    if (kind === 'senseC') {
      var a2 = r.pick([1, 1, 2, -5]), s = nz(r, -6, 6), b2 = -a2 * s;
      var ctx = a2 === -5 ? 'Un salt des de terra: h(t) = ' + P([a2, b2, 0], 't') + '. Quan és a terra?' : 'Resol:';
      var v = a2 === -5 ? 't' : 'x';
      if (a2 === -5 && s < 0) { s = -s; b2 = -a2 * s; ctx = 'Un salt des de terra: h(t) = ' + P([a2, b2, 0], 't') + '. Quan és a terra?'; }
      var roots = [Math.min(0, s), Math.max(0, s)];
      return {
        title: 'Drecera: factor comú',
        ctx: ctx + '<div class="big">' + P([a2, b2, 0], v) + ' = 0</div>',
        steps: [
          { q: 'Quin tipus d\'equació és?', choices: TIPUS, ans: 1, hint: 'No hi ha terme independent.', show: 'Sense terme independent → factor comú (no dividis mai per ' + v + '!)' },
          { q: 'Treu factor comú ' + v + '.', parts: [v + '(', { ans: a2, w: 3 }, v + ' + ', { ans: b2, w: 4 }, ') = 0'], hint: 'Divideix cada terme entre ' + v + '.', show: v + '(' + P([a2, b2], v) + ') = 0' },
          { q: 'Un producte val 0 si algun factor val 0. Solucions de petita a gran:', parts: [v + ' = ', { ans: roots[0], w: 3 }, '  i  ' + v + ' = ', { ans: roots[1], w: 3 }], hint: v + ' = 0, o bé ' + P([a2, b2], v) + ' = 0.', show: '<b>' + v + ' = 0 i ' + v + ' = ' + fmt(s) + '</b>' + (a2 === -5 ? ' (surt de terra i aterra als ' + s + ' s)' : '') }
        ]
      };
    }
    var p = nz(r, -7, 7), q = nz(r, -7, 7); if (p === q) q = -p;
    var rt = [Math.min(p, q), Math.max(p, q)];
    return {
      title: 'Drecera: ja està factoritzada',
      ctx: 'Resol:<div class="big">(' + P([1, -p]) + ')(' + P([1, -q]) + ') = 0</div>',
      steps: [
        { q: 'Quin tipus d\'equació és?', choices: TIPUS, ans: 2, hint: 'És un producte igualat a 0.', show: 'Ja factoritzada → cada factor igual a 0 (no cal desenvolupar!)' },
        { q: 'Solucions de petita a gran:', parts: ['x = ', { ans: rt[0], w: 3 }, '  i  x = ', { ans: rt[1], w: 3 }], hint: P([1, -p]) + ' = 0 → x = ?   ' + P([1, -q]) + ' = 0 → x = ?', show: '<b>x = ' + fmt(rt[0]) + ' i x = ' + fmt(rt[1]) + '</b>' }
      ]
    };
  }

  // ---------- M3.4 El salt arriba a la plataforma? (discriminant) ----------
  function genDiscriminant(r, i) {
    if (i % 2 === 0) {
      var cases = [], v, H, D;
      var opts = [];
      [20, 30, 40].forEach(function (vv) {
        for (var h = 5; h <= vv * vv / 20 + 10; h += 5) {
          var dd = vv * vv - 20 * h;
          if (dd < 0 || (Math.sqrt(dd) % 1 === 0 && ((vv - Math.sqrt(dd)) % 10 === 0))) opts.push([vv, h]);
        }
      });
      var pick = r.pick(opts); v = pick[0]; H = pick[1]; D = v * v - 20 * H;
      var n = D > 0 ? 0 : D === 0 ? 1 : 2;
      var st = [
        { q: 'Volem saber si h(t) = ' + H + '. Passa-ho tot a un costat: 5t<sup>2</sup> − ' + v + 't + ' + H + ' = 0. Escriu a, b i c.', parts: ['a = ', { ans: 5, w: 3 }, '  b = ', { ans: -v, w: 4 }, '  c = ', { ans: H, w: 4 }], hint: '−5t<sup>2</sup> + ' + v + 't = ' + H + ' → 5t<sup>2</sup> − ' + v + 't + ' + H + ' = 0', show: '5t<sup>2</sup> − ' + v + 't + ' + H + ' = 0' },
        { q: 'Calcula el discriminant.', parts: ['Δ = ', { ans: D, w: 5 }], hint: 'Δ = b<sup>2</sup> − 4ac = ' + v + '<sup>2</sup> − 4 · 5 · ' + H, show: 'Δ = ' + fmt(D) },
        { q: 'Què passa amb la plataforma?', choices: ['Hi arriba i la travessa (dues solucions)', 'La toca just al punt més alt (una solució)', 'No hi arriba (cap solució)'], ans: n,
          hint: 'Δ > 0 → dues · Δ = 0 → una · Δ < 0 → cap.', show: ['Δ > 0: passa per ' + H + ' m pujant i baixant', 'Δ = 0: hi arriba just al punt més alt', 'Δ < 0: el salt no arriba a ' + H + ' m'][n] }
      ];
      if (D >= 0) {
        var s1 = (v - Math.sqrt(D)) / 10, s2 = (v + Math.sqrt(D)) / 10;
        st.push(D > 0 ? { q: 'En quins instants és a ' + H + ' m? (de petit a gran)', parts: ['t = ', { ans: s1, w: 3 }, ' s i t = ', { ans: s2, w: 3 }, ' s'], hint: 't = (' + v + ' ± √' + D + ') / 10', show: 'A ' + H + ' m als ' + fmt(s1) + ' s (pujant) i als ' + fmt(s2) + ' s (baixant)' }
          : { q: 'En quin instant?', parts: ['t = ', { ans: s1, w: 3 }, ' s'], hint: 't = ' + v + ' / 10', show: 'Hi arriba als ' + fmt(s1) + ' s' });
      }
      return { title: 'El salt arriba a la plataforma?', ctx: 'Salt amb molla: <b>h(t) = ' + P([-5, v, 0], 't') + '</b>. Hi ha una plataforma a <b>' + H + ' m</b>.' + NOTA, steps: st };
    }
    var a = nz(r, -3, 4), b = r.int(-8, 8), c = r.int(-6, 6), k = r.int(0, 2);
    if (k === 1) { var m = r.int(1, 4); a = r.pick([1, 4, 9]); var sa = Math.sqrt(a); b = 2 * sa * m * (r.bool() ? 1 : -1); c = m * m; }
    var D2 = b * b - 4 * a * c, n2 = D2 > 0 ? 0 : D2 === 0 ? 1 : 2;
    return {
      title: 'Només el discriminant',
      ctx: 'Sense resoldre-la, quantes solucions té?<div class="big">' + P([a, b, c]) + ' = 0</div>',
      steps: [
        { q: 'Calcula Δ = b<sup>2</sup> − 4ac.', parts: ['Δ = ', { ans: D2, w: 5 }], hint: 'a = ' + a + ', b = ' + b + ', c = ' + c + '.', show: 'Δ = ' + fmt(b * b) + ' − (' + fmt(4 * a * c) + ') = ' + fmt(D2) },
        { q: 'Quantes solucions té?', choices: ['Dues', 'Una', 'Cap'], ans: n2, hint: 'Mira el signe de Δ.', show: ['Δ > 0 → dues solucions', 'Δ = 0 → una solució (doble)', 'Δ < 0 → cap solució'][n2] }
      ]
    };
  }

  // ---------- M3.5 Del joc a l'equació (quatre passos) ----------
  function genProblemes(r, i) {
    var kind = ['perimetre', 'suma', 'quadrat', 'consecutius'][i % 4];
    if (kind === 'perimetre') {
      var x = r.pick([40, 50, 60, 70, 80]), d = r.pick([10, 20, 30, 40]), Pm = 2 * x + 2 * (x + d);
      var good = '2x + 2(x + ' + d + ') = ' + Pm, o = r.shuffle([good, 'x + (x + ' + d + ') = ' + Pm, 'x · (x + ' + d + ') = ' + Pm]);
      return {
        title: 'El mapa rectangular', ctx: 'Un nivell rectangular és <b>' + d + ' m</b> més llarg que ample i el seu perímetre és <b>' + Pm + ' m</b>. Quines dimensions té?',
        steps: [
          { q: '1) i 2) Si x = l\'amplada, quina equació el representa?', choices: o, ans: o.indexOf(good), hint: 'Perímetre = 2 · ample + 2 · llarg.', show: 'x = ample, x + ' + d + ' = llarg → ' + good },
          { q: '3) Resol-la.', parts: ['x = ', { ans: x, w: 4 }], hint: '2x + 2x + ' + 2 * d + ' = ' + Pm + ' → 4x = ' + (Pm - 2 * d), show: 'x = ' + x },
          { q: '4) Respon: dimensions del nivell.', parts: ['ample ', { ans: x, w: 4 }, ' m · llarg ', { ans: x + d, w: 4 }, ' m'], hint: 'Llarg = x + ' + d + '.', show: '<b>' + x + ' × ' + (x + d) + ' m</b> (perímetre 2 · ' + x + ' + 2 · ' + (x + d) + ' = ' + Pm + ' ✔)' }
        ]
      };
    }
    if (kind === 'suma') {
      var x2 = r.pick([300, 400, 500, 600]), d2 = r.pick([150, 250, 350]), S = 2 * x2 + d2;
      var g2 = 'x + x + ' + d2 + ' = ' + fmt(S), o2 = r.shuffle([g2, 'x + ' + d2 + ' = ' + fmt(S), '2x = ' + fmt(S) + ' + ' + d2]);
      return {
        title: 'Punts dels dos nivells', ctx: 'Entre el nivell 1 i el nivell 2 es poden guanyar <b>' + fmt(S) + ' punts</b>. El nivell 2 dona <b>' + d2 + '</b> punts més que el nivell 1. Quants punts dona cada nivell?',
        steps: [
          { q: 'Si x = punts del nivell 1, quina equació?', choices: o2, ans: o2.indexOf(g2), hint: 'Nivell 2 = x + ' + d2 + '.', show: g2 },
          { q: 'Resol-la.', parts: ['x = ', { ans: x2, w: 5 }], hint: '2x = ' + fmt(S - d2), show: 'x = ' + x2 },
          { q: 'Respon.', parts: ['Nivell 1: ', { ans: x2, w: 5 }, '  Nivell 2: ', { ans: x2 + d2, w: 5 }], hint: 'Nivell 2 = x + ' + d2, show: '<b>' + x2 + ' i ' + (x2 + d2) + ' punts</b>' }
        ]
      };
    }
    if (kind === 'quadrat') {
      var x3 = r.int(3, 9), a3 = r.int(2, 6), A = (x3 + a3) * (x3 + a3);
      return {
        title: 'L\'sprite ampliat', ctx: 'Un sprite quadrat s\'amplia <b>' + a3 + ' px</b> per cada costat i la seva àrea passa a ser <b>' + A + ' px<sup>2</sup></b>. Quant feia el costat original x?',
        steps: [
          { q: 'Planteja: (x + ' + a3 + ')<sup>2</sup> = ' + A + '. Fes l\'arrel als dos costats: x + ' + a3 + ' = ±?', parts: ['x + ' + a3 + ' = ±', { ans: x3 + a3, w: 3 }], hint: '√' + A, show: 'x + ' + a3 + ' = ±' + (x3 + a3) },
          { q: 'Solucions (de petita a gran):', parts: ['x = ', { ans: -(x3 + a3) - a3, w: 4 }, '  i  x = ', { ans: x3, w: 3 }], hint: 'x = ' + (x3 + a3) + ' − ' + a3 + ' i x = −' + (x3 + a3) + ' − ' + a3, show: 'x = ' + fmt(-(x3 + 2 * a3)) + ' o x = ' + x3 },
          { q: '4) Quina té sentit?', choices: ['x = ' + fmt(-(x3 + 2 * a3)), 'x = ' + x3], ans: 1, hint: 'Una longitud no pot ser negativa.', show: 'El costat feia <b>' + x3 + ' px</b> (es descarta la negativa)' }
        ]
      };
    }
    var x4 = r.int(5, 15), Pr = x4 * (x4 + 1);
    return {
      title: 'Nivells consecutius', ctx: 'El producte dels números de dos nivells consecutius és <b>' + Pr + '</b>. Quins nivells són?',
      steps: [
        { q: 'Si x és el primer, l\'equació és x(x + 1) = ' + Pr + '. Ordena-la i iguala a 0.', parts: PF([1, 1, -Pr]).concat([' = 0']), hint: 'x<sup>2</sup> + x − ' + Pr + ' = 0', show: P([1, 1, -Pr]) + ' = 0' },
        { q: 'Resol-la amb la fórmula (solucions de petita a gran).', parts: ['x = ', { ans: -(x4 + 1), w: 4 }, '  i  x = ', { ans: x4, w: 4 }], hint: 'Δ = 1 + 4 · ' + Pr + ' = ' + (1 + 4 * Pr) + ', √Δ = ' + (2 * x4 + 1), show: 'x = ' + fmt(-(x4 + 1)) + ' o x = ' + x4 },
        { q: 'Respon (descarta el que no té sentit).', parts: ['Nivells ', { ans: x4, w: 3 }, ' i ', { ans: x4 + 1, w: 3 }], hint: 'Un número de nivell no és negatiu.', show: '<b>Nivells ' + x4 + ' i ' + (x4 + 1) + '</b>' }
      ]
    };
  }

  // ---------- M3.6 La botiga: rebaixes i IVA ----------
  function genBotiga(r, i) {
    var kind = ['ambIVA', 'senseIVA', 'rebaixa', 'original', 'variacio'][i % 5];
    var p = U.clean(r.int(500, 6000) / 100);
    if (kind === 'ambIVA') {
      return { title: 'Afegir l\'IVA', ctx: 'Un pack de la botiga costa <b>' + eur(p) + '</b> sense IVA. L\'IVA és del 21 %.',
        steps: [
          { q: 'Quin és l\'índex de variació d\'un augment del 21 %?', parts: ['× ', { ans: 1.21, w: 5 }], hint: '1 + 21/100', show: '+21 % → × 1,21' },
          { q: 'Preu final amb IVA:', parts: [{ ans: U.round(p * 1.21, 2), tol: 0.006, w: 7 }, ' €'], hint: fmt(p) + ' · 1,21', show: fmt(p) + ' · 1,21 = <b>' + eur(p * 1.21) + '</b>' }
        ] };
    }
    if (kind === 'senseIVA') {
      return { title: 'Treure l\'IVA', ctx: 'A la botiga un pack val <b>' + eur(p) + '</b> amb IVA (21 %). Quant val sense IVA?',
        steps: [
          { q: 'Com es calcula?', choices: ['Es resta el 21 %: ' + fmt(p) + ' · 0,79', 'Es divideix per l\'índex: ' + fmt(p) + ' : 1,21', 'Es resten 21 €'], ans: 1, hint: 'Preu amb IVA = preu sense IVA · 1,21. Fem el camí invers.', show: 'Preu sense IVA = ' + fmt(p) + ' : 1,21 (no es resta el 21 %!)' },
          { q: 'Preu sense IVA (arrodonit als cèntims):', parts: [{ ans: U.round(p / 1.21, 2), tol: 0.006, w: 7 }, ' €'], hint: 'Divideix amb la calculadora.', show: '<b>' + eur(p / 1.21) + '</b>' }
        ] };
    }
    var d = r.pick([10, 15, 20, 25, 30, 35, 40]), idx = U.clean(1 - d / 100);
    if (kind === 'rebaixa') {
      return { title: 'Rebaixes', ctx: 'Un skin de <b>' + eur(p) + '</b> està rebaixat un <b>' + d + ' %</b>.',
        steps: [
          { q: 'Índex de variació d\'una rebaixa del ' + d + ' %:', parts: ['× ', { ans: idx, w: 5 }], hint: '1 − ' + d + '/100', show: '−' + d + ' % → × ' + fmt(idx) },
          { q: 'Preu rebaixat:', parts: [{ ans: U.round(p * idx, 2), tol: 0.006, w: 7 }, ' €'], hint: fmt(p) + ' · ' + fmt(idx), show: '<b>' + eur(p * idx) + '</b>' }
        ] };
    }
    if (kind === 'original') {
      var fin = U.clean(r.int(10, 60) * idx);
      return { title: 'El preu d\'abans', ctx: 'Després d\'una rebaixa del <b>' + d + ' %</b>, un pack costa <b>' + eur(fin) + '</b>. Quant costava abans?',
        steps: [
          { q: 'Planteja: preu original · ' + fmt(idx) + ' = ' + fmt(fin) + '. Com s\'aïlla?', choices: ['Multiplicant: ' + fmt(fin) + ' · ' + fmt(idx), 'Dividint: ' + fmt(fin) + ' : ' + fmt(idx), 'Sumant el ' + d + ' %: ' + fmt(fin) + ' · ' + fmt(U.clean(1 + d / 100))], ans: 1, hint: 'Sumar el ' + d + ' % al preu final no torna al preu inicial.', show: 'Preu original = ' + fmt(fin) + ' : ' + fmt(idx) },
          { q: 'Preu original:', parts: [{ ans: U.round(fin / idx, 2), tol: 0.006, w: 7 }, ' €'], hint: 'Divideix.', show: '<b>' + eur(fin / idx) + '</b>' }
        ] };
    }
    var v0 = r.pick([40, 50, 60, 80]), pc = r.pick([-30, -25, -20, -10, 10, 15, 20, 25]), v1 = U.clean(v0 * (1 + pc / 100));
    return { title: 'Percentatge de variació', ctx: 'Un pack ha passat de <b>' + eur(v0) + '</b> a <b>' + eur(v1) + '</b>. Quin percentatge ha variat?',
      steps: [
        { q: 'Calcula l\'índex: preu nou : preu vell.', parts: [{ ans: U.clean(v1 / v0), w: 5 }], hint: fmt(v1) + ' : ' + v0, show: 'Índex = ' + fmt(U.clean(v1 / v0)) },
        { q: 'Percentatge de variació (amb signe: + puja, − baixa):', parts: [{ ans: pc, w: 4 }, ' %'], hint: '(índex − 1) · 100', show: '<b>' + (pc > 0 ? '+' : '') + fmt(pc) + ' %</b> (' + (pc > 0 ? 'augment' : 'descompte') + ')' }
      ] };
  }

  // ---------- M3.7 Estalviar o finançar? ----------
  function genFinancar(r, i) {
    var kind = ['encadenades', 'simple', 'compost', 'comparar'][i % 4];
    if (kind === 'encadenades') {
      var ps = r.shuffle([r.pick([10, 20, 30]), -r.pick([5, 10, 15]), r.pick([15, 20, 25])]);
      var ix = ps.map(function (p) { return U.clean(1 + p / 100); }), tot = U.clean(ix[0] * ix[1] * ix[2]);
      var names = ['el primer mes', 'el segon', 'el tercer'];
      return { title: 'Creixement de jugadors', ctx: 'Els jugadors actius del joc varien ' + ps.map(function (p, k) { return '<b>' + (p > 0 ? '+' : '−') + Math.abs(p) + ' %</b> ' + names[k]; }).join(', ') + '.',
        steps: [
          { q: 'Escriu els tres índexs de variació.', parts: ['× ', { ans: ix[0], w: 5 }, ' × ', { ans: ix[1], w: 5 }, ' × ', { ans: ix[2], w: 5 }], hint: '+10 % → 1,10 · −5 % → 0,95', show: 'Índexs: ' + ix.map(function (v) { return fmt(v); }).join(' · ') },
          { q: 'Índex total (es multipliquen). Arrodoneix a les mil·lèsimes.', parts: [{ ans: U.round(tot, 3), tol: 0.0011, w: 6 }], hint: 'Multiplica els tres índexs.', show: 'Índex total = ' + fmt(U.round(tot, 4)) },
          { q: 'Variació total en % (amb signe, una decimal).', parts: [{ ans: U.round((tot - 1) * 100, 1), tol: 0.11, w: 5 }, ' %'], hint: '(índex − 1) · 100. No se sumen els percentatges!', show: 'Variació total: <b>' + (tot > 1 ? '+' : '') + fmt(U.round((tot - 1) * 100, 1)) + ' %</b> (no és ' + (ps[0] + ps[1] + ps[2]) + ' %)' }
        ] };
    }
    var C = r.pick([1000, 2000, 3000, 5000]), rr = r.pick([2, 2.5, 3, 4, 5, 6]), t = r.int(2, 5), rd = rr / 100;
    var Is = C * rd * t, Cf = C * Math.pow(1 + rd, t);
    if (kind === 'simple') {
      return { title: 'Interès simple', ctx: 'L\'estudi diposita <b>' + fmt(C) + ' €</b> al <b>' + fmt(rr) + ' %</b> d\'interès simple anual durant <b>' + t + ' anys</b>.',
        steps: [
          { q: 'Interessos: I = C · r · t (r en tant per u).', parts: ['I = ', { ans: U.round(Is, 2), tol: 0.006, w: 7 }, ' €'], hint: fmt(C) + ' · ' + fmt(rd) + ' · ' + t, show: 'I = ' + fmt(C) + ' · ' + fmt(rd) + ' · ' + t + ' = ' + eur(Is) },
          { q: 'Capital final:', parts: [{ ans: U.round(C + Is, 2), tol: 0.006, w: 8 }, ' €'], hint: 'C + I', show: 'Capital final = <b>' + eur(C + Is) + '</b>' }
        ] };
    }
    if (kind === 'compost') {
      return { title: 'Interès compost', ctx: 'L\'estudi diposita <b>' + fmt(C) + ' €</b> al <b>' + fmt(rr) + ' %</b> d\'interès compost anual durant <b>' + t + ' anys</b>.',
        steps: [
          { q: 'Índex anual (1 + r):', parts: [{ ans: U.clean(1 + rd), w: 6 }], hint: '1 + ' + fmt(rr) + '/100', show: '1 + r = ' + fmt(U.clean(1 + rd)) },
          { q: 'Capital final: C · (1 + r)<sup>t</sup> (tecla ^). Arrodoneix als cèntims.', parts: [{ ans: U.round(Cf, 2), tol: 0.011, w: 8 }, ' €'], hint: fmt(C) + ' · ' + fmt(U.clean(1 + rd)) + '<sup>' + t + '</sup>', show: 'C<sub>f</sub> = ' + fmt(C) + ' · ' + fmt(U.clean(1 + rd)) + '<sup>' + t + '</sup> = <b>' + eur(Cf) + '</b>' },
          { q: 'Interessos guanyats:', parts: [{ ans: U.round(Cf - C, 2), tol: 0.011, w: 7 }, ' €'], hint: 'Capital final − capital inicial.', show: 'Interessos = ' + eur(Cf - C) }
        ] };
    }
    return { title: 'Simple o compost?', ctx: 'Dos bancs ofereixen el <b>' + fmt(rr) + ' %</b> anual durant <b>' + t + ' anys</b> per a <b>' + fmt(C) + ' €</b>: el banc A amb interès simple i el B amb interès compost.',
      steps: [
        { q: 'Capital final al banc A (simple):', parts: [{ ans: U.round(C + Is, 2), tol: 0.006, w: 8 }, ' €'], hint: 'C + C · r · t', show: 'A: ' + eur(C + Is) },
        { q: 'Capital final al banc B (compost):', parts: [{ ans: U.round(Cf, 2), tol: 0.011, w: 8 }, ' €'], hint: 'C · (1 + r)<sup>t</sup>', show: 'B: ' + eur(Cf) },
        { q: 'On és millor estalviar?', choices: ['Banc A', 'Banc B', 'És igual'], ans: 1, hint: 'Compara.', show: 'Banc B: guanya ' + eur(Cf - C - Is) + ' més, perquè els interessos també generen interessos' }
      ] };
  }

  // ---------- M3.8 El preu mínim (inequacions) ----------
  function genInequacio(r, i) {
    var kind = ['abstracta', 'negatiu', 'preu', 'tarifes'][i % 4];
    if (kind === 'abstracta' || kind === 'negatiu') {
      var x0 = r.int(-6, 8), a = r.int(2, 5), c = kind === 'negatiu' ? a + r.int(1, 3) : r.int(-2, a - 1), b = r.int(-9, 9);
      if (c === 0) c = -1;
      var s = r.pick(SIMB), L = a - c, d = L * x0 + b;  // ax + b s cx + d  → (a−c)x s d − b
      var R = d - b, fs = L < 0 ? FLIP[s] : s;
      var incl = fs === '≤' || fs === '≥', right = fs === '>' || fs === '≥';
      var lo = right ? x0 : -Infinity, hi = right ? Infinity : x0;
      return {
        title: kind === 'negatiu' ? 'Compte amb el signe!' : 'Resol i representa',
        ctx: 'Resol:<div class="big">' + P([a, b]) + ' ' + s + ' ' + P([c, d]) + '</div><p class="small">Per escriure ∞ fes servir els botons o escriu <code>inf</code>.</p>',
        steps: [
          { q: 'Lletres a l\'esquerra, nombres a la dreta (el símbol es manté).', parts: [{ ans: L, w: 3 }, 'x ', { sel: SIMB, ans: s }, ' ', { ans: R, w: 4 }], hint: 'Com en una equació: el que canvia de costat canvia de signe.', show: P([L, 0]) + ' ' + s + ' ' + fmt(R) },
          { q: 'Aïlla x. ' + (L < 0 ? 'Divideixes per un nombre negatiu…' : ''), parts: ['x ', { sel: SIMB, ans: fs }, ' ', { ans: x0, w: 3 }], hint: 'Si divideixes per un negatiu, el símbol gira (< ↔ >).', show: '<b>x ' + fs + ' ' + fmt(x0) + '</b>' + (L < 0 ? ' (el símbol ha girat!)' : '') },
          { q: 'Escriu la solució com un interval.', parts: [{ sel: ['(', '['], ans: right ? (incl ? '[' : '(') : '(' }, { ans: lo, w: 4, inf: true }, ', ', { ans: hi, w: 4, inf: true }, { sel: [')', ']'], ans: right ? ')' : (incl ? ']' : ')') }],
            hint: 'Claudàtor si l\'extrem hi entra (≤, ≥). L\'infinit sempre amb parèntesi.', show: 'Solució: ' + (right ? (incl ? '[' : '(') : '(') + fmt(lo) + ', ' + fmt(hi) + (right ? ')' : (incl ? ']' : ')')) }
        ],
        after: U.svgInterval(lo, hi, right && incl, !right && incl)
      };
    }
    if (kind === 'preu') {
      var cost = r.pick([3000, 4800, 6000, 7500]), q = r.pick([20, 25, 30]), n = r.pick([800, 1000, 1500, 2000]);
      var k = U.clean((1 - q / 100) * n), pmin = cost / k, pm = Math.ceil(pmin * 100 - 1e-9) / 100;
      return {
        title: 'El preu mínim',
        ctx: 'Desenvolupar el joc ha costat <b>' + fmt(cost) + ' €</b>. La botiga digital es queda el <b>' + q + ' %</b> de cada venda. L\'estudi preveu vendre <b>' + fmt(n) + ' còpies</b>. A quin preu mínim p l\'ha de vendre per no perdre diners?',
        steps: [
          { q: 'Planteja la inequació: el que cobra l\'estudi ha de ser com a mínim el cost.', parts: [fmt(n) + ' · ', { ans: U.clean(1 - q / 100), w: 4 }, ' · p ', { sel: SIMB, ans: '≥' }, ' ', { ans: cost, w: 5 }], hint: 'Si la botiga es queda el ' + q + ' %, l\'estudi cobra el ' + (100 - q) + ' %. «Com a mínim» → ≥.', show: fmt(n) + ' · ' + fmt(U.clean(1 - q / 100)) + ' · p ≥ ' + fmt(cost) },
          { q: 'Aïlla p (dues decimals).', parts: ['p ≥ ', { ans: U.round(pmin, 2), tol: 0.011, w: 6 }], hint: fmt(k) + 'p ≥ ' + fmt(cost) + ' → divideix.', show: 'p ≥ ' + fmt(U.round(pmin, 3)) + '…' },
          { q: 'Quin és el preu mínim en euros i cèntims?', parts: [{ ans: pm, w: 6 }, ' €'], hint: 'Si arrodoneixes cap avall, no arribes a cobrir el cost: cal arrodonir cap amunt.', show: 'Preu mínim: <b>' + eur(pm) + '</b>' }
        ]
      };
    }
    var f = r.pick([30, 50, 80]), pa = r.pick([0.02, 0.03]), pb = U.clean(pa + r.pick([0.01, 0.02])), lim = U.clean(f / (pb - pa));
    return {
      title: 'Quina tarifa de servidor?',
      ctx: 'Tarifa A: <b>' + f + ' €</b> fixos al mes + <b>' + fmt(pa) + ' €</b> per jugador. Tarifa B: <b>' + fmt(pb) + ' €</b> per jugador. Amb quants jugadors x surt més barata la tarifa A?',
      steps: [
        { q: 'Planteja: cost A < cost B.', parts: [f + ' + ', { ans: pa, w: 4 }, 'x < ', { ans: pb, w: 4 }, 'x'], hint: 'Cost = fix + preu per jugador · x.', show: f + ' + ' + fmt(pa) + 'x < ' + fmt(pb) + 'x' },
        { q: 'Agrupa les x.', parts: [f + ' < ', { ans: U.clean(pb - pa), w: 4 }, 'x'], hint: fmt(pb) + 'x − ' + fmt(pa) + 'x', show: f + ' < ' + fmt(U.clean(pb - pa)) + 'x' },
        { q: 'Aïlla x i respon.', parts: ['x ', { sel: SIMB, ans: '>' }, ' ', { ans: lim, w: 5 }], hint: 'Divideix ' + f + ' entre ' + fmt(U.clean(pb - pa)) + '. Llegeix-ho d\'esquerra a dreta.', show: 'La tarifa A és més barata amb <b>més de ' + fmt(lim) + ' jugadors</b>' }
      ]
    };
  }

  // ---------- M3.9 Packs a la gràfica (sistemes gràfics) ----------
  function genGrafic(r, i) {
    var kind = ['tall', 'packs', 'classifica'][i % 3];
    if (kind === 'classifica') {
      var a = r.int(1, 3), b = r.int(1, 3), c = r.int(4, 9), k = r.pick([2, 3]), t = r.int(0, 2);
      var L2 = t === 0 ? [a * k, b * k, c * k] : t === 1 ? [a * k, b * k, c * k + k] : [a, -b, r.int(-2, 3)];
      var ans = t === 0 ? 2 : t === 1 ? 1 : 0;
      return {
        title: 'Sense dibuixar',
        ctx: 'Quantes solucions té el sistema?<div class="big">' + lineStr(a, b, c) + '<br>' + lineStr(L2[0], L2[1], L2[2]) + '</div>',
        steps: [
          { q: 'Multiplica la primera equació per ' + (t === 2 ? 'algun nombre' : k) + '. Què observes comparant-la amb la segona?', choices: ['Els coeficients de x i y no són proporcionals', 'Coeficients proporcionals però el terme independent no', 'Tot és proporcional: és la mateixa equació'], ans: t === 2 ? 0 : t === 1 ? 1 : 2,
            hint: 'Compara ' + a + ' : ' + L2[0] + ', ' + b + ' : ' + L2[1] + ' i ' + c + ' : ' + L2[2] + '.', show: ['Les rectes es tallen', 'Rectes paral·leles', 'La mateixa recta'][t === 2 ? 0 : t === 1 ? 1 : 2] },
          { q: 'Quantes solucions té?', choices: ['Una', 'Cap', 'Infinites'], ans: ans, hint: 'Es tallen → una · paral·leles → cap · mateixa recta → infinites.', show: '<b>' + ['Una solució', 'Cap solució', 'Infinites solucions'][ans] + '</b>' }
        ]
      };
    }
    var x0 = r.int(1, 6), y0 = r.int(1, 6), a1 = 1, b1 = 1, a2, b2;
    if (kind === 'packs') { a2 = 2; b2 = 1; x0 = r.int(1, 4); y0 = r.int(1, 10 - 2 * x0); }
    else { a2 = 1; b2 = -1; y0 = r.int(1, 4); x0 = r.int(y0 + 1, 9 - y0); }
    var c1 = a1 * x0 + b1 * y0, c2 = a2 * x0 + b2 * y0, vx = kind === 'packs' ? 'x' : 'x';
    var ctx = kind === 'packs'
      ? 'Una gemma (x) i una poció (y) costen <b>' + c1 + ' €</b> junts; dues gemmes i una poció, <b>' + c2 + ' €</b>.<div class="big">' + lineStr(1, 1, c1) + '<br>' + lineStr(2, 1, c2) + '</div>'
      : 'Resol gràficament:<div class="big">' + lineStr(1, 1, c1) + '<br>' + lineStr(1, -1, c2) + '</div>';
    var ex = kind === 'packs' ? 0 : c2;
    return {
      title: kind === 'packs' ? 'Els packs' : 'Primer sistema',
      ctx: ctx,
      fig: svgLines([[a1, b1, c1], [a2, b2, c2]], null, 10),
      steps: [
        { q: 'Taula de valors de la primera recta (' + lineStr(a1, b1, c1) + '): si x = 0 i si x = ' + c1 + ', quant val y?', parts: ['x = 0 → y = ', { ans: c1, w: 3 }, '   x = ' + c1 + ' → y = ', { ans: 0, w: 3 }], hint: 'Substitueix x i aïlla y.', show: 'Recta 1 passa per (0, ' + c1 + ') i (' + c1 + ', 0)' },
        { q: 'Taula de valors de la segona recta (' + lineStr(a2, b2, c2) + '): si x = ' + ex + ' i si x = ' + x0 + '?', parts: ['x = ' + ex + ' → y = ', { ans: (c2 - a2 * ex) / b2, w: 3 }, '   x = ' + x0 + ' → y = ', { ans: y0, w: 3 }], hint: 'y = (' + c2 + ' − ' + a2 + 'x) / ' + b2, show: 'Recta 2 passa per (' + ex + ', ' + fmt((c2 - a2 * ex) / b2) + ') i (' + x0 + ', ' + y0 + ')' },
        { q: 'Mira la gràfica: on es tallen?', parts: ['(', { ans: x0, w: 3 }, ', ', { ans: y0, w: 3 }, ')'], hint: 'És el punt que surt a les dues taules.', show: 'Punt de tall: <b>(' + x0 + ', ' + y0 + ')</b>' + (kind === 'packs' ? ' → gemma ' + x0 + ' €, poció ' + y0 + ' €' : '') },
        { q: 'Comprova a la segona equació: quant val ' + lineStr(a2, b2, c2).split(' = ')[0] + ' per a aquest punt?', parts: [{ ans: c2, w: 4 }], hint: 'Substitueix x = ' + x0 + ' i y = ' + y0 + '.', show: 'Dona ' + c2 + ' ✔ (i a la primera, ' + c1 + ' ✔)' }
      ],
      after: svgLines([[a1, b1, c1], [a2, b2, c2]], [x0, y0], 10)
    };
  }

  // ---------- M3.10 Tres camins (mètodes algebraics) ----------
  function genSistema(r, i) {
    var kind = ['substitucio', 'reduccio', 'igualacio', 'packs'][i % 4];
    var x0 = nz(r, -5, 6), y0 = nz(r, -5, 6);
    if (kind === 'substitucio') {
      var b1 = nz(r, -4, 4), a2 = r.int(2, 4), b2 = nz(r, -4, 4); if (b2 - a2 * b1 === 0) b2 += 1;
      var c1 = x0 + b1 * y0, c2 = a2 * x0 + b2 * y0, K = b2 - a2 * b1;
      return {
        title: 'Mètode de substitució', ctx: '<div class="big">' + lineStr(1, b1, c1) + '<br>' + lineStr(a2, b2, c2) + '</div>' + NOTA,
        steps: [
          { q: 'Aïlla x de la primera equació.', parts: ['x = ', { ans: c1, w: 4 }, ' + ', { ans: -b1, w: 3 }, 'y'], hint: 'Passa ' + P([b1, 0]).replace('x', 'y') + ' a la dreta.', show: 'x = ' + P([-b1, c1]).replace('x', 'y') },
          { q: 'Substitueix a la segona, treu parèntesis i agrupa.', parts: [{ ans: K, w: 4 }, 'y = ', { ans: c2 - a2 * c1, w: 4 }], hint: a2 + '(' + P([-b1, c1]).replace('x', 'y') + ') ' + (b2 < 0 ? '− ' + Math.abs(b2) : '+ ' + b2) + 'y = ' + c2, show: P([K, 0]).replace('x', 'y') + ' = ' + fmt(c2 - a2 * c1) },
          { q: 'Aïlla y.', parts: ['y = ', { ans: y0, w: 3 }], hint: 'Divideix.', show: 'y = ' + fmt(y0) },
          { q: 'Torna a l\'expressió de x.', parts: ['x = ', { ans: x0, w: 3 }], hint: 'x = ' + fmt(c1) + ' − (' + fmt(b1) + ') · (' + fmt(y0) + ')', show: '<b>x = ' + fmt(x0) + ', y = ' + fmt(y0) + '</b>' }
        ]
      };
    }
    if (kind === 'reduccio') {
      var m = r.pick([2, 3]), t = nz(r, -3, 3), a1 = r.int(1, 4), b1r = m * t, a2r = r.int(1, 4), b2r = -t;
      if (a1 + m * a2r === 0) a2r += 1;
      var c1r = a1 * x0 + b1r * y0, c2r = a2r * x0 + b2r * y0;
      return {
        title: 'Mètode de reducció', ctx: '<div class="big">' + lineStr(a1, b1r, c1r) + '<br>' + lineStr(a2r, b2r, c2r) + '</div>' + NOTA,
        steps: [
          { q: 'Per quin nombre multipliques la segona equació perquè les y tinguin coeficients oposats?', parts: ['× ', { ans: m, w: 3 }], hint: 'Vols que ' + fmt(b2r) + ' · ? = ' + fmt(-b1r) + '.', show: '2a × ' + m + ': ' + lineStr(m * a2r, m * b2r, m * c2r) },
          { q: 'Suma les dues equacions (les y desapareixen).', parts: [{ ans: a1 + m * a2r, w: 4 }, 'x = ', { ans: c1r + m * c2r, w: 4 }], hint: '(' + a1 + ' + ' + m * a2r + ')x = ' + c1r + ' + ' + m * c2r, show: P([a1 + m * a2r, 0]) + ' = ' + fmt(c1r + m * c2r) },
          { q: 'Aïlla x.', parts: ['x = ', { ans: x0, w: 3 }], hint: 'Divideix.', show: 'x = ' + fmt(x0) },
          { q: 'Substitueix a una equació i troba y.', parts: ['y = ', { ans: y0, w: 3 }], hint: lineStr(a1, b1r, c1r) + ' amb x = ' + fmt(x0), show: '<b>x = ' + fmt(x0) + ', y = ' + fmt(y0) + '</b>' }
        ]
      };
    }
    if (kind === 'igualacio') {
      var m1 = nz(r, -3, 3), m2 = nz(r, -3, 3); if (m1 === m2) m2 = m1 + 1 === 0 ? m1 + 2 : m1 + 1;
      var n1 = y0 - m1 * x0, n2 = y0 - m2 * x0;
      return {
        title: 'Mètode d\'igualació', ctx: '<div class="big">y = ' + P([m1, n1]) + '<br>y = ' + P([m2, n2]) + '</div>' + NOTA,
        steps: [
          { q: 'Les dues ja tenen y aïllada: iguala-les i agrupa (x a l\'esquerra).', parts: [{ ans: m1 - m2, w: 3 }, 'x = ', { ans: n2 - n1, w: 4 }], hint: P([m1, n1]) + ' = ' + P([m2, n2]), show: P([m1 - m2, 0]) + ' = ' + fmt(n2 - n1) },
          { q: 'Aïlla x.', parts: ['x = ', { ans: x0, w: 3 }], hint: 'Divideix.', show: 'x = ' + fmt(x0) },
          { q: 'Calcula y.', parts: ['y = ', { ans: y0, w: 3 }], hint: 'Substitueix x a qualsevol de les dues.', show: '<b>x = ' + fmt(x0) + ', y = ' + fmt(y0) + '</b>' }
        ]
      };
    }
    var s = r.int(2, 6), g = r.int(1, 5), A = [r.int(2, 3), r.int(2, 4)], B = [r.int(2, 4), 1];
    var c1p = A[0] * s + A[1] * g, c2p = B[0] * s + g;
    return {
      title: 'Packs de la botiga',
      ctx: 'Pack 1: <b>' + A[0] + ' skins i ' + A[1] + ' gemmes</b> per ' + c1p + ' €. Pack 2: <b>' + B[0] + ' skins i 1 gemma</b> per ' + c2p + ' €. Quant costa cada skin (s) i cada gemma (g)?',
      steps: [
        { q: 'Planteja el sistema.', parts: [{ ans: A[0], w: 2 }, 's + ', { ans: A[1], w: 2 }, 'g = ', { ans: c1p, w: 3 }, '\n', { ans: B[0], w: 2 }, 's + ', { ans: 1, w: 2 }, 'g = ', { ans: c2p, w: 3 }], hint: 'Una equació per pack.', show: A[0] + 's + ' + A[1] + 'g = ' + c1p + ' i ' + B[0] + 's + g = ' + c2p },
        { q: 'Aïlla g de la segona equació.', parts: ['g = ', { ans: c2p, w: 3 }, ' − ', { ans: B[0], w: 2 }, 's'], hint: 'Passa ' + B[0] + 's a la dreta.', show: 'g = ' + c2p + ' − ' + B[0] + 's' },
        { q: 'Substitueix a la primera i agrupa.', parts: [{ ans: A[0] - A[1] * B[0], w: 4 }, 's = ', { ans: c1p - A[1] * c2p, w: 4 }], hint: A[0] + 's + ' + A[1] + '(' + c2p + ' − ' + B[0] + 's) = ' + c1p, show: P([A[0] - A[1] * B[0], 0]).replace('x', 's') + ' = ' + fmt(c1p - A[1] * c2p) },
        { q: 'Preus:', parts: ['s = ', { ans: s, w: 3 }, ' €   g = ', { ans: g, w: 3 }, ' €'], hint: 'Aïlla s i substitueix a g = ' + c2p + ' − ' + B[0] + 's.', show: '<b>Skin ' + s + ' €, gemma ' + g + ' €</b>' }
      ]
    };
  }

  CGS.NIVELLS = CGS.NIVELLS || [];
  CGS.NIVELLS.push({
    id: 'N3', nom: 'Nivell 3 · La botiga i el llançament', sub: 'Unitat 4 · Equacions, percentatges, inequacions i sistemes',
    missions: [
      { id: 'N3M1', fase: 1, titol: 'Situar plataformes', sabers: 'Equacions de 1r grau (parèntesis i denominadors)', n: 4, gen: genEq1,
        teoria: 'Passos: 1) treu parèntesis · 2) si hi ha denominadors, multiplica-ho tot pel m.c.m. · 3) lletres a un costat, nombres a l\'altre · 4) aïlla x · 5) comprova.<br>3(x − 2) = x + 4 → 3x − 6 = x + 4 → 2x = 10 → x = 5.' },
      { id: 'N3M2', fase: 2, titol: 'Quan aterra el salt?', sabers: 'Equacions de 2n grau: fórmula general', n: 4, gen: genEq2,
        teoria: 'Forma general: ax<sup>2</sup> + bx + c = 0 (primer ordena i iguala a 0).<br>x = (−b ± √(b<sup>2</sup> − 4ac)) / 2a. Escriu primer a, b i c amb el seu signe.<br>x<sup>2</sup> − 5x + 6 = 0 → √(25 − 24) = 1 → x = (5 ± 1)/2 → 3 i 2.' },
      { id: 'N3M3', fase: 3, titol: 'Dreceres', sabers: 'Equacions de 2n grau incompletes i factoritzades', n: 4, gen: genIncompletes,
        teoria: 'Sense terme en x: aïlla x<sup>2</sup> i fes l\'arrel (x<sup>2</sup> − 49 = 0 → x = ±7).<br>Sense terme independent: factor comú (x<sup>2</sup> − 6x = 0 → x(x − 6) = 0 → 0 i 6). No dividis mai per x!<br>Ja factoritzada: (x − 4)(x + 1) = 0 → 4 i −1.' },
      { id: 'N3M4', fase: 4, titol: 'El salt arriba a la plataforma?', sabers: 'El discriminant i el nombre de solucions', n: 4, gen: genDiscriminant,
        teoria: 'Δ = b<sup>2</sup> − 4ac. Δ > 0 → dues solucions · Δ = 0 → una · Δ < 0 → cap.<br>Al joc: dues → el salt passa per aquella altura pujant i baixant · una → la toca just al punt més alt · cap → no hi arriba.' },
      { id: 'N3M5', fase: 5, titol: 'Del joc a l\'equació', sabers: 'Problemes amb el mètode dels quatre passos', n: 4, gen: genProblemes,
        teoria: '1) Llegeix i escriu què és x · 2) Planteja l\'equació · 3) Resol-la · 4) Comprova a l\'enunciat i descarta les solucions sense sentit (longituds o temps negatius…).' },
      { id: 'N3M6', fase: 6, titol: 'La botiga: rebaixes i IVA', sabers: 'Percentatges i índex de variació', n: 5, gen: genBotiga,
        teoria: 'Índex de variació: +21 % → × 1,21 · −35 % → × 0,65.<br>Preu sense IVA = preu amb IVA ÷ 1,21 (no es resta el 21 %). Preu abans d\'una rebaixa del 20 % = preu final ÷ 0,80.<br>% de variació = (preu nou ÷ preu vell − 1) · 100.' },
      { id: 'N3M7', fase: 7, titol: 'Estalviar o finançar?', sabers: 'Variacions encadenades, interès simple i compost', n: 4, gen: genFinancar,
        teoria: 'Variacions encadenades: es multipliquen els índexs (+10 % i −5 % → 1,10 · 0,95 = 1,045 → +4,5 %).<br>Interès simple: I = C · r · t. Interès compost: C<sub>f</sub> = C · (1 + r)<sup>t</sup> (r en tant per u).' },
      { id: 'N3M8', fase: 8, titol: 'El preu mínim', sabers: 'Inequacions de 1r grau i intervals', n: 4, gen: genInequacio,
        teoria: 'Es resol com una equació, però si multipliques o divideixes per un <b>negatiu</b>, el símbol gira.<br>La solució és un interval: x ≥ 3 → [3, +∞) · x < 5 → (−∞, 5).<br>«Com a mínim» → ≥ · «com a màxim» → ≤.' },
      { id: 'N3M9', fase: 9, titol: 'Packs a la gràfica', sabers: 'Sistemes 2×2: resolució gràfica i tipus', n: 3, gen: genGrafic,
        teoria: 'Cada equació és una recta (taula amb dos punts). La solució del sistema és el <b>punt de tall</b>.<br>Es tallen → una solució · paral·leles → cap · la mateixa recta → infinites.' },
      { id: 'N3M10', fase: 10, titol: 'Tres camins', sabers: 'Substitució, igualació i reducció', n: 4, gen: genSistema,
        teoria: '<b>Substitució</b>: aïlla una lletra i substitueix-la a l\'altra equació. <b>Igualació</b>: aïlla la mateixa lletra a les dues i iguala. <b>Reducció</b>: multiplica perquè una lletra tingui coeficients oposats i suma.<br>Sempre: comprova a les dues equacions.' },
      { id: 'N3B', fase: 11, boss: true, titol: 'BOSS del Nivell 3', sabers: 'Entrenament del boss: un exercici de cada fase, sense pistes', n: 10,
        gen: function (r, i, used) {
          var g = [genEq1, genEq2, genIncompletes, genDiscriminant, genProblemes, genBotiga, genFinancar, genInequacio, genGrafic, genSistema][i];
          var idx = [r.pick([0, 2]), r.int(0, 1), r.int(0, 2), r.int(0, 1), r.int(0, 3), r.int(0, 4), r.int(0, 3), r.int(0, 3), r.int(0, 2), r.int(0, 3)][i];
          return g(r, idx, used);
        },
        teoria: 'Al boss no hi ha pistes. Pots fer servir el formulari i la calculadora, però escriu el procediment.' }
    ]
  });
})(CGS);
