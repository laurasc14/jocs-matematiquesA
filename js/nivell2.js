/* NIVELL 2 · La física del salt — Unitat 3: polinomis */
(function (U) {
  var P = U.poly, PF = U.polyFields, fmt = U.fmt;
  var NOTA = '<p class="small">Escriu cada coeficient amb el seu signe (per exemple −3) i posa 0 si aquell terme no hi és.</p>';
  var nz = function (r, lo, hi) { var v = 0; while (v === 0) v = r.int(lo, hi); return v; };
  var sgn = function (x) { return x < 0 ? ' − ' + fmt(-x) : ' + ' + fmt(x); };

  // ---------- M2.1 El salt com a fórmula (elements i valor numèric) ----------
  function genSalt(r, i) {
    var b = r.pick([10, 15, 20, 25, 30]), c = r.pick([0, 0, 2, 3, 5, 8]);
    var kind = ['anatomia', 'valor', 'plataforma', 'semblants'][i % 4];
    if (kind === 'anatomia') {
      var co = [-5, b, c], nT = c ? 3 : 2;
      return {
        title: 'Anatomia del salt',
        ctx: 'Quan el jugador prem el botó, el programa calcula l\'altura del personatge (en metres) amb:<div class="big">h(t) = ' + P(co, 't') + '</div>',
        steps: [
          { q: 'Quants termes (monomis) té el polinomi?', parts: [{ ans: nT, w: 2 }, ' termes'], hint: 'Compta els monomis separats per + o −.', show: 'Té ' + nT + ' termes' },
          { q: 'Quin és el grau del polinomi?', parts: ['Grau ', { ans: 2, w: 2 }], hint: 'El grau és el del monomi de grau més alt (l\'exponent més gran de t).', show: 'Grau 2' },
          { q: 'Coeficient de t<sup>2</sup>, coeficient de t i terme independent:', parts: ['t<sup>2</sup>: ', { ans: -5, w: 3 }, '  t: ', { ans: b, w: 3 }, '  independent: ', { ans: c, w: 3 }],
            hint: 'El coeficient és el nombre que multiplica la lletra (amb el signe). El terme independent és el que no té lletra (0 si no n\'hi ha).',
            show: 'Coeficients −5 i ' + b + ' · terme independent ' + c + (c ? ' (altura inicial!)' : '') }
        ]
      };
    }
    if (kind === 'valor') {
      var co2 = [-5, b, c], t = r.pick([0.5, 1, 1.5, 2, 2.5, 3]);
      var a1 = -5 * t * t, a2 = b * t, h = U.clean(a1 + a2 + c);
      return {
        title: 'On és el personatge?',
        ctx: 'h(t) = ' + P(co2, 't') + ' (metres, segons). On és el personatge a <b>t = ' + fmt(t) + ' s</b>?',
        steps: [
          { q: 'Primer terme: substitueix t = ' + fmt(t) + '.', parts: ['−5 · ' + fmt(t) + '<sup>2</sup> = ', { ans: U.clean(a1), w: 6 }],
            hint: 'Primer la potència: ' + fmt(t) + '<sup>2</sup> = ' + fmt(U.clean(t * t)) + '. Després multiplica per −5.', show: '−5 · ' + fmt(t) + '<sup>2</sup> = ' + fmt(U.clean(a1)) },
          { q: 'Segon terme:', parts: [b + ' · ' + fmt(t) + ' = ', { ans: U.clean(a2), w: 6 }], hint: 'Multiplica.', show: b + ' · ' + fmt(t) + ' = ' + fmt(U.clean(a2)) },
          { q: 'Suma-ho tot: valor numèric.', parts: ['h(' + fmt(t) + ') = ', { ans: h, w: 6 }, ' m'], hint: 'Suma els resultats' + (c ? ' i el terme independent ' + c : '') + '. Compte amb els signes.',
            show: 'h(' + fmt(t) + ') = ' + fmt(U.clean(a1)) + sgn(U.clean(a2)) + (c ? sgn(c) : '') + ' = <b>' + fmt(h) + ' m</b>' + (h <= 0 ? ' (ja ha tocat a terra!)' : '') }
        ]
      };
    }
    if (kind === 'plataforma') {
      var pl = r.pick([3, 4, 5, 6, 10]), t2 = r.pick([1, 2, 3]), h2 = -5 * t2 * t2 + b * t2 + pl;
      return {
        title: 'Salt des d\'una plataforma',
        ctx: 'El salt des de terra és h(t) = ' + P([-5, b, 0], 't') + '. Ara el personatge salta des d\'una plataforma de <b>' + pl + ' m</b> d\'alçada.',
        steps: [
          { q: 'Escriu la nova fórmula.', parts: ['h(t) = '].concat(PF([-5, b, pl], 't')),
            hint: 'L\'altura inicial ja no és 0: s\'afegeix com a terme independent.', show: 'h(t) = ' + P([-5, b, pl], 't') },
          { q: 'Calcula l\'altura als ' + t2 + ' s.', parts: ['h(' + t2 + ') = ', { ans: h2, w: 5 }, ' m'],
            hint: 'Substitueix t = ' + t2 + ': −5 · ' + t2 + '<sup>2</sup> + ' + b + ' · ' + t2 + ' + ' + pl + '.', show: 'h(' + t2 + ') = ' + fmt(h2) + ' m' }
        ]
      };
    }
    var k = r.int(2, 9), pool = r.shuffle([[k + 'x<sup>2</sup>', 2], ['−x<sup>2</sup>', 2], [r.int(2, 9) + 'x', 1], ['−' + r.int(2, 9) + 'x', 1], ['0,5x<sup>2</sup>', 2], [String(r.int(2, 20)), 0]]);
    var target = r.pick([1, 2]);
    var idx = pool.map(function (p, j) { return p[1] === target ? j : -1; }).filter(function (j) { return j >= 0; });
    var names = ['terme independent (sense lletra)', 'x', 'x<sup>2</sup>'];
    var lit = target === 0 ? '' : target === 1 ? 'x' : 'x<sup>2</sup>';
    var sumS = U.clean(idx.reduce(function (acc, j) { var t = pool[j][0].replace(/<sup>2<\/sup>/, '').replace('x', '').replace('−', '-').replace(',', '.'); return acc + (t === '' ? 1 : t === '-' ? -1 : parseFloat(t)); }, 0));
    return {
      title: 'Monomis semblants',
      ctx: 'Per sumar moviments, el motor del joc només pot ajuntar monomis <b>semblants</b> (mateixa part literal).',
      steps: [
        { q: 'Marca tots els monomis semblants amb part literal <b>' + names[target] + '</b>.', multi: pool.map(function (p) { return p[0]; }), ans: idx,
          hint: 'Mira només la lletra i el seu exponent, no el coeficient.', show: 'Semblants: ' + idx.map(function (j) { return pool[j][0]; }).join(', ') },
        { q: 'Quant val la suma d\'aquests monomis semblants?', parts: [{ ans: sumS, w: 4 }, lit],
          hint: 'Se sumen els coeficients i la part literal es manté igual.', show: 'Suma: ' + fmt(sumS) + lit }
      ]
    };
  }

  // ---------- M2.2 Salts diferents (sumar i restar) ----------
  function rp2(r) { return [nz(r, -6, 6), nz(r, -9, 9), r.int(-9, 9)]; }
  function genSuma(r, i) {
    var kind = ['suma', 'resta', 'molla', 'bug'][i % 4];
    if (kind === 'suma' || kind === 'resta') {
      var A = rp2(r), B = rp2(r); if (A[0] + B[0] === 0) A[0] += 1; if (A[0] - B[0] === 0) A[0] += 1;
      var res = kind === 'suma' ? A.map(function (x, k) { return x + B[k]; }) : A.map(function (x, k) { return x - B[k]; });
      var steps = [];
      if (kind === 'resta') steps.push({ q: 'Primer canvia el signe de <b>tots</b> els termes de Q(x).', parts: ['−Q(x) = '].concat(PF(B.map(function (x) { return -x; }))),
        hint: 'Restar és sumar el contrari: cada + es torna − i cada − es torna +.', show: '−Q(x) = ' + P(B.map(function (x) { return -x; })) });
      steps.push({ q: 'Ajunta els monomis semblants: P(x) ' + (kind === 'suma' ? '+' : '−') + ' Q(x).', parts: PF(res),
        hint: 'Suma els coeficients de x<sup>2</sup> amb x<sup>2</sup>, els de x amb x i els nombres sols entre ells.', show: 'P(x) ' + (kind === 'suma' ? '+' : '−') + ' Q(x) = <b>' + P(res) + '</b>' });
      var xv = r.int(-2, 3);
      steps.push({ q: 'Comprova-ho: calcula el resultat per a x = ' + xv + '.', parts: ['Valor: ', { ans: U.polyEval(res, xv), w: 5 }],
        hint: 'Substitueix x = ' + xv + ' al polinomi resultat.', show: 'Per a x = ' + fmt(xv) + ' val ' + fmt(U.polyEval(res, xv)) + ' (P(' + xv + ') ' + (kind === 'suma' ? '+' : '−') + ' Q(' + xv + ') = ' + fmt(U.polyEval(A, xv)) + (kind === 'suma' ? ' + ' : ' − ') + '(' + fmt(U.polyEval(B, xv)) + ') ✔)' });
      return { title: kind === 'suma' ? 'Combinar moviments' : 'Diferència entre models', ctx: 'P(x) = ' + P(A) + '<br>Q(x) = ' + P(B) + NOTA, steps: steps };
    }
    if (kind === 'molla') {
      var b1 = r.pick([10, 15, 20]), b2 = b1 + r.pick([5, 10, 15]), t = r.int(1, 3);
      return {
        title: 'El salt amb molla',
        ctx: 'Salt normal: h<sub>1</sub>(t) = ' + P([-5, b1, 0], 't') + ' · Salt amb molla: h<sub>2</sub>(t) = ' + P([-5, b2, 0], 't') + NOTA,
        steps: [
          { q: 'Calcula h<sub>2</sub>(t) − h<sub>1</sub>(t).', parts: PF([0, b2 - b1, 0], 't'), hint: 'Canvia el signe de tots els termes de h<sub>1</sub> i ajunta semblants. Els termes en t<sup>2</sup> s\'anul·len.',
            show: 'h<sub>2</sub> − h<sub>1</sub> = ' + P([0, b2 - b1, 0], 't') },
          { q: 'Quants metres més alt és el salt amb molla a t = ' + t + ' s?', parts: [{ ans: (b2 - b1) * t, w: 4 }, ' m'], hint: 'Substitueix t = ' + t + ' a la diferència.', show: (b2 - b1) + ' · ' + t + ' = ' + (b2 - b1) * t + ' m més alt' }
        ]
      };
    }
    var a = r.int(2, 7), c = r.int(1, 9);
    return {
      title: 'Bug del signe menys',
      ctx: 'Un company ha escrit:<div class="big quote">−(' + P([a, -c]) + ') = ' + P([-a, -c]) + '</div>' + NOTA,
      steps: [
        { q: 'És correcte?', choices: ['Sí', 'No, és un bug'], ans: 1, hint: 'El signe menys davant del parèntesi canvia el signe de <b>tots</b> els termes.', show: 'Bug: només ha canviat el signe del primer terme' },
        { q: 'Escriu-ho bé.', parts: ['−(' + P([a, -c]) + ') = '].concat(PF([-a, c])), hint: '−(+' + a + 'x) = −' + a + 'x i −(−' + c + ') = +' + c + '.', show: '−(' + P([a, -c]) + ') = ' + P([-a, c]) }
      ]
    };
  }

  // ---------- M2.3 L'àrea jugable (multiplicar) ----------
  function genProducte(r, i) {
    var kind = ['monomi', 'binomis', 'pantalla', 'binomis'][i % 4];
    if (kind === 'monomi') {
      var k = nz(r, -5, 5), a = nz(r, -5, 5), b = nz(r, -9, 9);
      var res = [k * a, k * b, 0];
      return {
        title: 'Monomi per polinomi',
        ctx: 'Desenvolupa:<div class="big">' + P([k, 0]) + '(' + P([a, b]) + ')</div>' + NOTA,
        steps: [
          { q: 'Multiplica ' + P([k, 0]) + ' pel primer terme.', parts: [P([k, 0]) + ' · (' + P([a, 0]) + ') = ', { ans: k * a, w: 4 }, 'x<sup>2</sup>'], hint: 'Coeficients: ' + k + ' · ' + a + '. Lletres: x · x = x<sup>2</sup>.', show: P([k, 0]) + ' · (' + P([a, 0]) + ') = ' + P([k * a, 0, 0]) },
          { q: 'Multiplica ' + P([k, 0]) + ' pel segon terme.', parts: [P([k, 0]) + ' · (' + fmt(b) + ') = ', { ans: k * b, w: 4 }, 'x'], hint: k + ' · (' + b + ') i la x es manté.', show: P([k, 0]) + ' · (' + fmt(b) + ') = ' + P([k * b, 0]) },
          { q: 'Resultat:', parts: PF(res), hint: 'Ajunta els dos resultats.', show: '= <b>' + P(res) + '</b>' }
        ]
      };
    }
    if (kind === 'binomis') {
      var p = r.pick([1, 1, 2, 3]), a2 = nz(r, -6, 6), b2 = nz(r, -6, 6);
      var res2 = U.polyMul([p, a2], [1, b2]);
      return {
        title: 'La taula de l\'àrea',
        ctx: 'Desenvolupa amb la taula de l\'àrea:<div class="big">(' + P([p, a2]) + ')(' + P([1, b2]) + ')</div>' +
          '<table class="areatab"><tr><th>×</th><th>x</th><th>' + fmt(b2) + '</th></tr><tr><th>' + P([p, 0]) + '</th><td>?</td><td>?</td></tr><tr><th>' + fmt(a2) + '</th><td>?</td><td>?</td></tr></table>' + NOTA,
        steps: [
          { q: 'Omple les quatre caselles de la taula.', parts: [P([p, 0]) + ' · x = ', { ans: p, w: 3 }, 'x<sup>2</sup>', '\n', P([p, 0]) + ' · (' + fmt(b2) + ') = ', { ans: p * b2, w: 4 }, 'x', '\n',
            fmt(a2) + ' · x = ', { ans: a2, w: 4 }, 'x', '\n', fmt(a2) + ' · (' + fmt(b2) + ') = ', { ans: a2 * b2, w: 4 }],
            hint: 'Cada casella és fila × columna. Compte amb els signes: − · − = +.', show: 'Peces: ' + P([p, 0, 0]) + ', ' + P([p * b2, 0]) + ', ' + P([a2, 0]) + ' i ' + fmt(a2 * b2) },
          { q: 'Ajunta els termes semblants (les dues peces amb x).', parts: PF(res2), hint: p * b2 + ' + (' + a2 + ') = ?', show: '(' + P([p, a2]) + ')(' + P([1, b2]) + ') = <b>' + P(res2) + '</b>' }
        ]
      };
    }
    var W = r.pick([1920, 1280, 800]), H = W === 1920 ? 1080 : W === 1280 ? 720 : 600, m = r.pick([20, 40, 50, 100]);
    var res3 = [4, -2 * (W + H), W * H], A = U.polyEval(res3, m);
    return {
      title: 'L\'àrea jugable',
      ctx: 'La pantalla fa <b>' + W + ' × ' + H + '</b> píxels. L\'artista vol un marc (HUD) de <i>x</i> píxels a cada costat. La zona de joc és un rectangle de (' + W + ' − 2x) per (' + H + ' − 2x).' + NOTA,
      steps: [
        { q: 'Omple la taula de l\'àrea de (' + W + ' − 2x)(' + H + ' − 2x).', parts: [W + ' · ' + H + ' = ', { ans: W * H, w: 9 }, '\n', W + ' · (−2x) = ', { ans: -2 * W, w: 6 }, 'x', '\n',
          '(−2x) · ' + H + ' = ', { ans: -2 * H, w: 6 }, 'x', '\n', '(−2x) · (−2x) = ', { ans: 4, w: 3 }, 'x<sup>2</sup>'],
          hint: 'Cada terme del primer per cada terme del segon: 4 productes.', show: 'Peces: ' + fmt(W * H) + ', ' + P([-2 * W, 0]) + ', ' + P([-2 * H, 0]) + ' i 4x<sup>2</sup>' },
        { q: 'Escriu A(x) ordenat i amb els semblants agrupats.', parts: ['A(x) = '].concat(PF(res3)), hint: 'Suma les dues peces en x.', show: 'A(x) = <b>' + P(res3) + '</b>' },
        { q: 'Calcula l\'àrea jugable amb un marc de ' + m + ' px: A(' + m + ').', parts: ['A(' + m + ') = ', { ans: A, w: 9 }, ' px<sup>2</sup>'],
          hint: 'Substitueix x = ' + m + '. Pots comprovar-ho fent (' + W + ' − ' + 2 * m + ') · (' + H + ' − ' + 2 * m + ').', show: 'A(' + m + ') = ' + fmt(A) + ' = ' + (W - 2 * m) + ' · ' + (H - 2 * m) + ' ✔' }
      ]
    };
  }

  // ---------- M2.4 Quadrats que creixen (productes notables) ----------
  function genNotables(r, i) {
    var kind = ['quadratSuma', 'quadratResta', 'sumaDif', 'mental'][i % 4];
    if (kind === 'quadratSuma' || kind === 'quadratResta') {
      var a = r.pick([1, 1, 2, 3]), b = r.int(1, 7), s = kind === 'quadratSuma' ? 1 : -1;
      var res = [a * a, 2 * a * b * s, b * b], ax = P([a, 0]);
      return {
        title: kind === 'quadratSuma' ? 'L\'sprite ampliat' : 'L\'sprite retallat',
        ctx: (kind === 'quadratSuma' ? 'Un sprite quadrat de costat ' + ax + ' s\'amplia ' + b + ' px. La seva àrea és:' : 'Desenvolupa:') + '<div class="big">(' + P([a, s * b]) + ')<sup>2</sup></div>' + NOTA,
        steps: [
          { q: 'Quadrat del primer terme:', parts: ['(' + ax + ')<sup>2</sup> = ', { ans: a * a, w: 3 }, 'x<sup>2</sup>'], hint: 'Eleva el coeficient i la lletra.', show: '(' + ax + ')<sup>2</sup> = ' + P([a * a, 0, 0]) },
          { q: 'Doble producte (amb el signe):', parts: ['2 · ' + ax + ' · (' + fmt(s * b) + ') = ', { ans: 2 * a * b * s, w: 4 }, 'x'], hint: 'És la peça que s\'oblida sempre: les dues peces rectangulars del dibuix.', show: 'Doble producte: ' + P([2 * a * b * s, 0]) },
          { q: 'Quadrat del segon terme:', parts: ['(' + fmt(s * b) + ')<sup>2</sup> = ', { ans: b * b, w: 3 }], hint: 'Un quadrat sempre és positiu.', show: '(' + fmt(s * b) + ')<sup>2</sup> = ' + b * b },
          { q: 'Ajunta-ho:', parts: PF(res), hint: '(a ' + (s > 0 ? '+' : '−') + ' b)<sup>2</sup> = a<sup>2</sup> ' + (s > 0 ? '+' : '−') + ' 2ab + b<sup>2</sup>', show: '(' + P([a, s * b]) + ')<sup>2</sup> = <b>' + P(res) + '</b>' }
        ]
      };
    }
    if (kind === 'sumaDif') {
      var a2 = r.pick([1, 1, 2, 3]), b2 = r.int(2, 9);
      return {
        title: 'Suma per diferència',
        ctx: 'Desenvolupa:<div class="big">(' + P([a2, b2]) + ')(' + P([a2, -b2]) + ')</div>' + NOTA,
        steps: [
          { q: 'Quina identitat és?', choices: ['(a + b)<sup>2</sup>', '(a − b)<sup>2</sup>', '(a + b)(a − b)'], ans: 2, hint: 'Els dos parèntesis tenen els mateixos termes; només canvia un signe.', show: 'Suma per diferència: a<sup>2</sup> − b<sup>2</sup>' },
          { q: 'Resultat:', parts: PF([a2 * a2, 0, -b2 * b2]), hint: 'Quadrat del primer menys quadrat del segon. No hi ha terme en x.', show: '= <b>' + P([a2 * a2, 0, -b2 * b2]) + '</b>' }
        ]
      };
    }
    if (r.bool()) {
      var n = r.pick([20, 30, 40, 50, 60, 70]), d = r.pick([1, 2, -1]), N = n + d;
      return {
        title: 'Càlcul mental',
        ctx: 'Sense calculadora, amb una identitat:<div class="big">' + N + '<sup>2</sup> = (' + n + (d > 0 ? ' + ' : ' − ') + Math.abs(d) + ')<sup>2</sup></div>',
        steps: [
          { q: 'Quadrat del primer:', parts: [n + '<sup>2</sup> = ', { ans: n * n, w: 5 }], hint: n / 10 + '<sup>2</sup> i afegeix dos zeros.', show: n + '<sup>2</sup> = ' + n * n },
          { q: 'Doble producte (amb el signe):', parts: ['2 · ' + n + ' · ' + fmt(d) + ' = ', { ans: 2 * n * d, w: 5 }], hint: 'Multiplica.', show: 'Doble producte: ' + fmt(2 * n * d) },
          { q: 'Suma-ho tot.', parts: [N + '<sup>2</sup> = ', { ans: N * N, w: 6 }], hint: n * n + sgn(2 * n * d) + ' + ' + d * d, show: N + '<sup>2</sup> = ' + n * n + sgn(2 * n * d) + ' + ' + d * d + ' = <b>' + N * N + '</b>' }
        ]
      };
    }
    var m = r.pick([30, 40, 50, 60, 100]), e = r.pick([1, 2, 3]);
    return {
      title: 'Càlcul mental',
      ctx: 'Sense calculadora, amb una identitat:<div class="big">' + (m - e) + ' · ' + (m + e) + '</div>',
      steps: [
        { q: 'Escriu-ho com una suma per diferència.', parts: ['(', { ans: m, w: 4 }, ' − ', { ans: e, w: 2 }, ')(' + m + ' + ' + e + ')'], hint: 'Busca el nombre que queda just al mig.', show: (m - e) + ' · ' + (m + e) + ' = (' + m + ' − ' + e + ')(' + m + ' + ' + e + ')' },
        { q: 'Calcula: a<sup>2</sup> − b<sup>2</sup>.', parts: [m + '<sup>2</sup> − ' + e + '<sup>2</sup> = ', { ans: m * m - e * e, w: 6 }], hint: m * m + ' − ' + e * e, show: '= ' + m * m + ' − ' + e * e + ' = <b>' + (m * m - e * e) + '</b>' }
      ]
    };
  }

  // ---------- M2.5 Caça de bugs algebraics ----------
  function genBugsAlg(r, i, used) {
    var tipus = ['sumaExp', 'quadrat', 'menys', 'prodX', 'sumaDif', 'potProd', 'distrib', 'quadratOk'];
    var pool = tipus.filter(function (t) { return used.indexOf(t) < 0; }), t = r.pick(pool); used.push(t);
    var a = r.int(2, 7), b = r.int(2, 6), k = r.int(2, 6), line, bug = true, why, parts, show;
    switch (t) {
      case 'sumaExp': line = a + 'x<sup>2</sup> + ' + b + 'x<sup>2</sup> = ' + (a + b) + 'x<sup>4</sup>'; why = 'En sumar monomis semblants, la part literal no canvia: no se sumen els exponents.';
        parts = [{ ans: a + b, w: 3 }, 'x<sup>', { ans: 2, w: 2 }, '</sup>']; show = (a + b) + 'x<sup>2</sup>'; break;
      case 'quadrat': line = '(x + ' + k + ')<sup>2</sup> = x<sup>2</sup> + ' + k * k; why = 'Falta el doble producte 2ab.';
        parts = PF([1, 2 * k, k * k]); show = P([1, 2 * k, k * k]); break;
      case 'menys': bug = false; line = '−(x<sup>2</sup> − ' + k + 'x + ' + b + ') = −x<sup>2</sup> + ' + k + 'x − ' + b; why = 'És correcte: el menys canvia el signe de tots els termes.';
        parts = PF([-1, k, -b]); show = P([-1, k, -b]); break;
      case 'prodX': line = a + 'x · ' + b + 'x = ' + a * b + 'x'; why = 'x · x = x<sup>2</sup>: els exponents se sumen.';
        parts = [{ ans: a * b, w: 3 }, 'x<sup>', { ans: 2, w: 2 }, '</sup>']; show = a * b + 'x<sup>2</sup>'; break;
      case 'sumaDif': bug = false; line = '(x − ' + k + ')(x + ' + k + ') = x<sup>2</sup> − ' + k * k; why = 'És correcte: suma per diferència.';
        parts = PF([1, 0, -k * k]); show = P([1, 0, -k * k]); break;
      case 'potProd': var e = r.pick([2, 3]); line = '(' + b + 'x)<sup>' + e + '</sup> = ' + b + 'x<sup>' + e + '</sup>'; why = 'La potència afecta el coeficient i la lletra: (ab)<sup>n</sup> = a<sup>n</sup>b<sup>n</sup>.';
        parts = [{ ans: Math.pow(b, e), w: 4 }, 'x<sup>', { ans: e, w: 2 }, '</sup>']; show = Math.pow(b, e) + 'x<sup>' + e + '</sup>'; break;
      case 'distrib': line = 'x(x − ' + k + ') = x<sup>2</sup> − ' + k; why = 'La x multiplica tots dos termes del parèntesi.';
        parts = PF([1, -k, 0]); show = P([1, -k, 0]); break;
      case 'quadratOk': bug = false; line = '(x − ' + k + ')<sup>2</sup> = x<sup>2</sup> − ' + 2 * k + 'x + ' + k * k; why = 'És correcte: (a − b)<sup>2</sup> = a<sup>2</sup> − 2ab + b<sup>2</sup>.';
        parts = PF([1, -2 * k, k * k]); show = P([1, -2 * k, k * k]); break;
    }
    return {
      title: 'Full de bugs algebraics',
      ctx: 'Línia de codi algebraic:<div class="big quote">' + line + '</div>' + (parts.length > 4 ? NOTA : ''),
      steps: [
        { q: 'Hi ha bug?', choices: ['Sí, hi ha bug', 'No, és correcte'], ans: bug ? 0 : 1, hint: 'Comprova-ho substituint x = 1 als dos costats: si no dona igual, hi ha bug.', show: (bug ? 'Bug: ' : '') + why },
        { q: bug ? 'Escriu el resultat correcte.' : 'Copia el resultat (és correcte) per confirmar-lo.', parts: parts, hint: why, show: 'Resultat correcte: ' + show }
      ]
    };
  }

  // ---------- M2.6 Desfer la multiplicació (factoritzar) ----------
  function genFactor(r, i) {
    var kind = ['aterratge', 'comu', 'diferencia', 'trinomi', 'dosPassos'][i % 5];
    if (kind === 'aterratge') {
      var v = r.pick([4, 5, 6, 3]), b = 5 * v;
      return {
        title: 'Quan toca a terra?',
        ctx: 'El salt és <div class="big">h(t) = ' + P([-5, b, 0], 't') + '</div>El personatge és a terra quan h(t) = 0.',
        steps: [
          { q: 'Treu factor comú (−5t).', parts: [P([-5, b, 0], 't') + ' = −5t(t + ', { ans: -v, w: 3 }, ')'], hint: 'Divideix cada terme entre −5t: ' + b + 't : (−5t) = ?', show: 'h(t) = −5t(t − ' + v + ')' },
          { q: 'Un producte val 0 si algun factor val 0. Quines són les solucions?', parts: ['t = ', { ans: 0, w: 3 }, '  o  t = ', { ans: v, w: 3 }], hint: '−5t = 0 → t = 0; t − ' + v + ' = 0 → t = ?', show: 't = 0 o t = ' + v },
          { q: 'Què vol dir cada solució al joc?', choices: ['t = 0 és quan salta i t = ' + v + ' quan aterra', 't = 0 és quan aterra i t = ' + v + ' quan salta', 'Les dues són l\'altura màxima'], ans: 0,
            hint: 'A t = 0 encara no ha passat el temps.', show: 'Salta a t = 0 i torna a terra als <b>' + v + ' s</b>' }
        ]
      };
    }
    if (kind === 'comu') {
      var g = r.pick([2, 3, 4, 5, 6]), p = nz(r, -5, 5), q = nz(r, -7, 7);
      while (U.gcd(p, q) !== 1) q += 1;
      var co = [g * p, g * q, 0];
      var cube = r.bool();
      var full = cube ? [g * p, g * q, 0, 0] : co, fx = cube ? g + 'x<sup>2</sup>' : g + 'x';
      return {
        title: 'Factor comú',
        ctx: 'Factoritza:<div class="big">' + P(full) + '</div>',
        steps: [
          { q: 'Quin és el factor comú? (el nombre positiu més gran que divideix els coeficients i la x amb l\'exponent més petit)', parts: [{ ans: g, w: 3 }, 'x<sup>', { ans: cube ? 2 : 1, w: 2 }, '</sup>'],
            hint: 'MCD(' + Math.abs(g * p) + ', ' + Math.abs(g * q) + ') i la x amb l\'exponent més petit.', show: 'Factor comú: ' + fx },
          { q: 'Divideix cada terme pel factor comú.', parts: [P(full) + ' = ' + fx + '(', { ans: p, w: 3 }, 'x + ', { ans: q, w: 3 }, ')'], hint: 'Primer terme: ' + P(full.slice(0, 1).concat(cube ? [0, 0] : [0])) + ' : ' + fx + '. Segon terme igual.',
            show: P(full) + ' = <b>' + fx + '(' + P([p, q]) + ')</b>' },
          { q: 'Comprova-ho multiplicant: quant val el resultat per a x = 1?', parts: [{ ans: U.polyEval(full, 1), w: 4 }], hint: 'Substitueix x = 1 a qualsevol de les dues formes.', show: 'Per a x = 1 totes dues valen ' + U.polyEval(full, 1) + ' ✔' }
        ]
      };
    }
    if (kind === 'diferencia') {
      var a = r.pick([1, 1, 2, 3]), k = r.int(2, 9);
      return {
        title: 'Identitat al revés',
        ctx: 'Factoritza:<div class="big">' + P([a * a, 0, -k * k]) + '</div>',
        steps: [
          { q: 'És una diferència de quadrats a<sup>2</sup> − b<sup>2</sup>. Qui són a i b?', parts: ['a = ', { ans: a, w: 2 }, 'x   b = ', { ans: k, w: 3 }], hint: 'a<sup>2</sup> = ' + P([a * a, 0, 0]) + ' i b<sup>2</sup> = ' + k * k + '.', show: 'a = ' + P([a, 0]) + ', b = ' + k },
          { q: 'Escriu-lo com a producte.', parts: ['(', { ans: a, w: 2 }, 'x + ', { ans: k, w: 3 }, ')(', { ans: a, w: 2 }, 'x − ', { ans: k, w: 3 }, ')'], hint: 'a<sup>2</sup> − b<sup>2</sup> = (a + b)(a − b)', show: P([a * a, 0, -k * k]) + ' = <b>(' + P([a, k]) + ')(' + P([a, -k]) + ')</b>' }
        ]
      };
    }
    if (kind === 'trinomi') {
      var a2 = r.pick([1, 1, 2, 3]), k2 = r.int(1, 7), s = r.bool() ? 1 : -1;
      var co2 = [a2 * a2, 2 * a2 * k2 * s, k2 * k2];
      return {
        title: 'Quadrat perfecte',
        ctx: 'Una plataforma quadrada té àrea <div class="big">' + P(co2) + '</div>Quant fa el costat?',
        steps: [
          { q: 'Arrels quadrades del primer i de l\'últim terme:', parts: ['√(' + P([a2 * a2, 0, 0]) + ') = ', { ans: a2, w: 2 }, 'x   √' + k2 * k2 + ' = ', { ans: k2, w: 3 }], hint: 'Quin monomi al quadrat dona cada terme?', show: 'a = ' + P([a2, 0]) + ', b = ' + k2 },
          { q: 'El terme del mig és ±2ab? Amb quin signe?', choices: ['+ (és (a + b)<sup>2</sup>)', '− (és (a − b)<sup>2</sup>)'], ans: s > 0 ? 0 : 1, hint: '2 · ' + P([a2, 0]) + ' · ' + k2 + ' = ' + P([2 * a2 * k2, 0]) + '. Mira el signe del terme del mig.', show: 'Terme del mig ' + P([2 * a2 * k2 * s, 0]) + ' → (a ' + (s > 0 ? '+' : '−') + ' b)<sup>2</sup>' },
          { q: 'Escriu-lo factoritzat.', parts: ['(', { ans: a2, w: 2 }, 'x + ', { ans: s * k2, w: 3 }, ')<sup>2</sup>'], hint: 'Posa el signe dins el segon camp (per exemple −3).', show: P(co2) + ' = <b>(' + P([a2, s * k2]) + ')<sup>2</sup></b> → costat ' + P([a2, s * k2]) }
        ]
      };
    }
    var g2 = r.pick([2, 3, 5]), k3 = r.int(2, 5);
    return {
      title: 'Dos passos',
      ctx: 'Factoritza completament:<div class="big">' + P([g2, 0, -g2 * k3 * k3, 0]) + '</div>',
      steps: [
        { q: 'Primer, treu factor comú.', parts: [g2 + 'x(x<sup>2</sup> − ', { ans: k3 * k3, w: 3 }, ')'], hint: 'El factor comú és ' + g2 + 'x.', show: '= ' + g2 + 'x(x<sup>2</sup> − ' + k3 * k3 + ')' },
        { q: 'Ara el parèntesi és una diferència de quadrats.', parts: [g2 + 'x(x + ', { ans: k3, w: 3 }, ')(x − ', { ans: k3, w: 3 }, ')'], hint: 'x<sup>2</sup> − ' + k3 * k3 + ' = (x + ?)(x − ?)', show: '= <b>' + g2 + 'x(x + ' + k3 + ')(x − ' + k3 + ')</b>' },
        { q: 'Per a quins valors val 0? (de petit a gran)', parts: ['x = ', { ans: -k3, w: 3 }, ', x = ', { ans: 0, w: 3 }, ', x = ', { ans: k3, w: 3 }], hint: 'Iguala cada factor a 0.', show: 'Arrels: −' + k3 + ', 0 i ' + k3 }
      ]
    };
  }

  // ---------- M2.7 Repartir la pantalla (divisió) ----------
  function genDivisio(r, i) {
    var m = i === 0 ? 1 : r.pick([1, 2, 3]), a = nz(r, -5, 5), q = nz(r, -6, 6), rr = i === 0 ? 0 : r.int(-5, 6);
    var D = U.polyMul([m, q], [1, a]); D[2] += rr;
    var b = D[1], c = D[2], rest1 = b - m * a;
    var ctx = i === 0
      ? 'Una zona rectangular del mapa té àrea <b>' + P(D) + '</b> i un costat mesura <b>' + P([1, a]) + '</b>. Quant mesura l\'altre costat?'
      : 'Fes la divisió:<div class="big">(' + P(D) + ') : (' + P([1, a]) + ')</div>';
    return {
      title: i === 0 ? 'L\'altre costat' : 'Divisió pas a pas',
      ctx: ctx + NOTA,
      steps: [
        { q: 'Divideix el primer terme del dividend pel primer terme del divisor.', parts: [P([m, 0, 0]) + ' : x = ', { ans: m, w: 3 }, 'x'], hint: 'x<sup>2</sup> : x = x', show: 'Primer terme del quocient: ' + P([m, 0]) },
        { q: 'Multiplica aquest terme pel divisor.', parts: [P([m, 0]) + ' · (' + P([1, a]) + ') = '].concat(PF([m, m * a, 0]).slice(0, 5)), hint: P([m, 0]) + ' · x i ' + P([m, 0]) + ' · (' + a + ').', show: P([m, 0]) + '(' + P([1, a]) + ') = ' + P([m, m * a, 0]) },
        { q: 'Resta-ho del dividend (canvia els signes!) i baixa el terme següent.', parts: [{ ans: rest1, w: 4 }, 'x + ', { ans: c, w: 4 }], hint: '(' + P([m, b, 0]) + ') − (' + P([m, m * a, 0]) + '): els x<sup>2</sup> s\'anul·len; ' + b + ' − (' + m * a + ') = ?', show: 'Queda: ' + P([rest1, c]) },
        { q: 'Divideix de nou el primer terme pel x del divisor.', parts: [P([rest1, 0]) + ' : x = ', { ans: q, w: 3 }], hint: 'Només el coeficient.', show: 'Segon terme del quocient: ' + fmt(q) },
        { q: 'Multiplica pel divisor i resta. Quin és el residu?', parts: ['Residu = ', { ans: rr, w: 3 }], hint: fmt(q) + ' · (' + P([1, a]) + ') = ' + P([q, q * a]) + '. Resta-ho de ' + P([rest1, c]) + '.', show: 'Residu: ' + rr },
        { q: 'Quocient i residu:', parts: ['Q(x) = ', { ans: m, w: 3 }, 'x + ', { ans: q, w: 3 }, '   R = ', { ans: rr, w: 3 }], hint: 'Ajunta els dos termes del quocient.',
          show: 'Q(x) = <b>' + P([m, q]) + '</b>, R = <b>' + rr + '</b>. Comprovació: (' + P([1, a]) + ')(' + P([m, q]) + ')' + (rr ? sgn(rr) : '') + ' = ' + P(D) + ' ✔' }
      ]
    };
  }

  // ---------- M2.8 Ruffini: quan toca a terra? ----------
  function genRuffini(r, i) {
    var kind = ['divisio', 'arrel', 'plataforma', 'arrel'][i % 4];
    if (kind === 'divisio') {
      var co = [1, r.int(-4, 4), r.int(-5, 5), r.int(-6, 6)]; if (r() < 0.4) co[2] = 0;
      var a = nz(r, -3, 3), R = U.ruffini(co, a), rest = R.bot[3], quo = R.bot.slice(0, 3);
      return {
        title: 'Primer Ruffini',
        ctx: 'Fes amb Ruffini:<div class="big">(' + P(co) + ') : (' + P([1, -a]) + ')</div>' + U.ruffiniTable(co, a, false),
        steps: [
          { q: 'Escriu els coeficients del dividend (0 si falta un terme) i el nombre <i>a</i> que va a l\'esquerra.', parts: ['Coeficients: ', { ans: co[0], w: 3 }, { ans: co[1], w: 3 }, { ans: co[2], w: 3 }, { ans: co[3], w: 3 }, '   a = ', { ans: a, w: 3 }],
            hint: 'Si dividim entre (x − a), a l\'esquerra va a. Compte: (x + 2) = (x − (−2)), per tant a = −2.', show: 'Coeficients ' + co.map(function (v) { return fmt(v); }).join(', ') + ' · a = ' + fmt(a) },
          { q: 'Completa la fila de baix: baixa el primer, multiplica per a, suma… L\'últim és el residu.', parts: ['Fila de baix: ', { ans: R.bot[0], w: 3 }, { ans: R.bot[1], w: 3 }, { ans: R.bot[2], w: 3 }, ' | residu ', { ans: rest, w: 4 }],
            hint: 'Baixa ' + co[0] + '. Multiplica per ' + a + ' i posa-ho sota el següent coeficient. Suma. Repeteix.', show: 'Fila de baix: ' + quo.map(function (v) { return fmt(v); }).join(', ') + ' | residu ' + fmt(rest) },
          { q: 'Escriu el quocient (té un grau menys).', parts: ['Q(x) = '].concat(PF(quo)), hint: 'Els nombres de la fila de baix (sense el residu) són els coeficients del quocient.', show: 'Q(x) = ' + P(quo) + ', R = ' + fmt(rest) },
          { q: 'Teorema del residu: calcula P(' + fmt(a) + '). Coincideix amb el residu?', parts: ['P(' + fmt(a) + ') = ', { ans: U.polyEval(co, a), w: 4 }], hint: 'Substitueix x = ' + fmt(a) + ' al dividend.', show: 'P(' + fmt(a) + ') = ' + fmt(U.polyEval(co, a)) + ' = residu ✔' + (rest === 0 ? ' → ' + fmt(a) + ' és arrel' : '') }
        ],
        after: U.ruffiniTable(co, a, true)
      };
    }
    if (kind === 'arrel') {
      var roots;
      do { roots = [nz(r, -4, 4), nz(r, -4, 4), nz(r, -4, 4)]; } while (roots[1] === roots[2]);
      var co2 = U.polyMul(U.polyMul([1, -roots[0]], [1, -roots[1]]), [1, -roots[2]]);
      var r0 = roots[0], R2 = U.ruffini(co2, r0), quo2 = R2.bot.slice(0, 3);
      var s = [roots[1], roots[2]].sort(function (x, y) { return x - y; });
      var divi = Math.abs(co2[3]);
      return {
        title: 'Busca l\'arrel',
        ctx: 'Una plataforma segueix <div class="big">P(x) = ' + P(co2) + '</div>Les arrels enteres són <b>divisors del terme independent</b> (' + fmt(co2[3]) + ').',
        steps: [
          { q: 'Prova x = ' + fmt(r0) + ': quant val P(' + fmt(r0) + ')?', parts: ['P(' + fmt(r0) + ') = ', { ans: 0, w: 4 }], hint: 'Substitueix. ' + fmt(r0) + ' és divisor de ' + divi + '.', show: 'P(' + fmt(r0) + ') = 0 → <b>x = ' + fmt(r0) + ' és arrel</b>' },
          { q: 'Divideix per Ruffini entre (' + P([1, -r0]) + '). Fila de baix:', parts: [{ ans: R2.bot[0], w: 3 }, { ans: R2.bot[1], w: 3 }, { ans: R2.bot[2], w: 3 }, ' | residu ', { ans: 0, w: 3 }],
            hint: 'Coeficients ' + co2.map(function (v) { return fmt(v); }).join(', ') + ' i a = ' + fmt(r0) + '. Si és arrel, el residu ha de ser 0.', show: 'Quocient: ' + P(quo2) + ' (residu 0)' },
          { q: 'Troba les arrels del quocient ' + P(quo2) + ' (de petita a gran).', parts: ['x = ', { ans: s[0], w: 3 }, '  i  x = ', { ans: s[1], w: 3 }],
            hint: 'Pots tornar a fer Ruffini provant divisors de ' + fmt(quo2[2]) + ', o pensar dos nombres que sumin ' + fmt(-quo2[1]) + ' i multiplicats donin ' + fmt(quo2[2]) + '.', show: 'Arrels del quocient: ' + fmt(s[0]) + ' i ' + fmt(s[1]) },
          { q: 'Llavors, la factorització completa és…', choices: r.shuffle([
              '(' + P([1, -r0]) + ')(' + P([1, -s[0]]) + ')(' + P([1, -s[1]]) + ')',
              '(' + P([1, r0]) + ')(' + P([1, s[0]]) + ')(' + P([1, s[1]]) + ')',
              '(' + P([1, -r0]) + ')(' + P([1, -s[0]]) + ')']).filter(function (x, k, arr) { return arr.indexOf(x) === k; }),
            ans: -1, hint: 'Cada arrel <i>a</i> dona un factor (x − a). Compte amb els signes!', show: 'P(x) = <b>(' + P([1, -r0]) + ')(' + P([1, -s[0]]) + ')(' + P([1, -s[1]]) + ')</b>' }
        ],
        after: U.ruffiniTable(co2, r0, true)
      };
    }
    var p = r.int(2, 4), q = r.int(p + 1, 7), sum = p + q, prod = p * q;
    var h = [1, -sum, prod, 0], R3 = U.ruffini([1, -sum, prod], q);
    return {
      title: 'La plataforma mòbil',
      ctx: 'Una plataforma puja i baixa al soterrani. La seva altura és<div class="big">h(t) = ' + P(h, 't') + '</div>(metres, segons). Quan és a terra (h = 0)?',
      steps: [
        { q: 'Treu factor comú.', parts: ['h(t) = t(t<sup>2</sup> + ', { ans: -sum, w: 4 }, 't + ', { ans: prod, w: 4 }, ')'], hint: 'Tots els termes tenen t.', show: 'h(t) = t(' + P([1, -sum, prod], 't') + ')' },
        { q: 'Comprova amb Ruffini que t = ' + q + ' és arrel del parèntesi. Fila de baix:', parts: [{ ans: R3.bot[0], w: 3 }, { ans: R3.bot[1], w: 3 }, ' | residu ', { ans: R3.bot[2], w: 3 }],
          hint: 'Coeficients 1, ' + fmt(-sum) + ', ' + prod + ' i a = ' + q + '.', show: 'Residu 0 → quocient ' + P([1, -p], 't') },
        { q: 'Escriu la factorització completa.', parts: ['h(t) = t(t − ', { ans: p, w: 3 }, ')(t − ', { ans: q, w: 3 }, ')'], hint: 'El quocient de Ruffini és un dels factors.', show: 'h(t) = <b>t(t − ' + p + ')(t − ' + q + ')</b>' },
        { q: 'En quins instants és a terra? (de petit a gran)', parts: ['t = ', { ans: 0, w: 2 }, ', ', { ans: p, w: 2 }, ' i ', { ans: q, w: 2 }, ' s'], hint: 'Cada factor igualat a 0.', show: 'A terra a t = 0, ' + p + ' i ' + q + ' s (entre ' + p + ' i ' + q + ' s és al soterrani)' }
      ],
      after: U.ruffiniTable([1, -sum, prod], q, true)
    };
  }

  // Corregeix l'índex de la resposta de l'opció de factorització (barrejada)
  function fixRuffini(e) {
    e.steps.forEach(function (s) {
      if (s.choices && s.ans === -1) {
        var good = s.show.replace(/^P\(x\) = <b>|<\/b>$/g, '');
        s.ans = s.choices.indexOf(good);
      }
    });
    return e;
  }

  CGS.NIVELLS = CGS.NIVELLS || [];
  CGS.NIVELLS.push({
    id: 'N2', nom: 'Nivell 2 · La física del salt', sub: 'Unitat 3 · Polinomis',
    missions: [
      { id: 'N2M1', fase: 1, titol: 'El salt com a fórmula', sabers: 'Monomis, polinomis i valor numèric', n: 4, gen: genSalt,
        teoria: '<b>Monomi</b>: −5t<sup>2</sup> → coeficient −5, part literal t<sup>2</sup>, grau 2. <b>Polinomi</b>: suma de monomis; el grau és el del monomi de grau més alt; el <b>terme independent</b> no té lletra.<br><b>Valor numèric</b>: substituir la lletra per un nombre. h(1) = −5 · 1<sup>2</sup> + 20 · 1 = 15 m.' },
      { id: 'N2M2', fase: 2, titol: 'Salts diferents', sabers: 'Sumar i restar polinomis', n: 4, gen: genSuma,
        teoria: '<b>Sumar</b>: s\'ajunten els monomis semblants. <b>Restar</b>: es canvia el signe de <b>tots</b> els termes del segon polinomi i se sumen.<br>(3x<sup>2</sup> + 2x) − (x<sup>2</sup> − 5x) = 3x<sup>2</sup> + 2x − x<sup>2</sup> + 5x = 2x<sup>2</sup> + 7x.' },
      { id: 'N2M3', fase: 3, titol: 'L\'àrea jugable', sabers: 'Multiplicar polinomis (taula de l\'àrea)', n: 4, gen: genProducte,
        teoria: 'Monomi × polinomi: es multiplica per cada terme. 3x(2x − 5) = 6x<sup>2</sup> − 15x.<br>Polinomi × polinomi: cada terme del primer per cada terme del segon (taula de l\'àrea) i s\'ajunten semblants. (x + 3)(x + 5) = x<sup>2</sup> + 5x + 3x + 15 = x<sup>2</sup> + 8x + 15.' },
      { id: 'N2M4', fase: 4, titol: 'Quadrats que creixen', sabers: 'Productes notables i càlcul mental', n: 4, gen: genNotables,
        teoria: '(a + b)<sup>2</sup> = a<sup>2</sup> + 2ab + b<sup>2</sup> · (a − b)<sup>2</sup> = a<sup>2</sup> − 2ab + b<sup>2</sup> · (a + b)(a − b) = a<sup>2</sup> − b<sup>2</sup>.<br>Compte: (a + b)<sup>2</sup> <b>no</b> és a<sup>2</sup> + b<sup>2</sup>: falta el doble producte 2ab.' },
      { id: 'N2M5', fase: 5, titol: 'Caça de bugs algebraics', sabers: 'Errors típics amb polinomis', n: 5, gen: genBugsAlg,
        teoria: 'Bugs freqüents: sumar exponents en una suma (3x<sup>2</sup> + 2x<sup>2</sup> = 5x<sup>2</sup>), oblidar el doble producte, no canviar tots els signes darrere un menys, x · x = x<sup>2</sup> (no x), (2x)<sup>3</sup> = 8x<sup>3</sup>.<br>Truc: substitueix x = 1 als dos costats per detectar el bug.' },
      { id: 'N2M6', fase: 6, titol: 'Desfer la multiplicació', sabers: 'Factor comú i identitats al revés', n: 5, gen: genFactor,
        teoria: 'Factoritzar = escriure com un producte. 1r) <b>Factor comú</b>: −5t<sup>2</sup> + 20t = −5t(t − 4). 2n) <b>Identitats al revés</b>: x<sup>2</sup> − 36 = (x + 6)(x − 6) · x<sup>2</sup> + 10x + 25 = (x + 5)<sup>2</sup>.<br>Un producte val 0 si algun factor val 0. Comprova sempre multiplicant.' },
      { id: 'N2M7', fase: 7, titol: 'Repartir la pantalla', sabers: 'Divisió d\'un polinomi entre (x − a)', n: 3, gen: genDivisio,
        teoria: 'Com a la divisió entera: <b>D = d · q + r</b>.<br>Pas a pas: divideix el primer terme → multiplica pel divisor → resta (canvia signes) → baixa el terme següent → repeteix.<br>(x<sup>2</sup> + 7x + 12) : (x + 3) → x, resta → 4x + 12 → 4, resta → residu 0. Quocient x + 4.' },
      { id: 'N2M8', fase: 8, titol: 'Ruffini: quan toca a terra?', sabers: 'Regla de Ruffini, teorema del residu i arrels enteres', n: 4, gen: function (r, i, u) { return fixRuffini(genRuffini(r, i, u)); },
        teoria: 'Ruffini divideix entre (x − a) només amb els coeficients (posa 0 als termes que falten). Baixa el primer, multiplica per a, suma, repeteix. L\'últim nombre és el <b>residu</b>.<br><b>Teorema del residu</b>: el residu és P(a). Si és 0, <i>a</i> és una <b>arrel</b> i (x − a) és un factor.<br>Les arrels enteres són divisors del terme independent.' },
      { id: 'N2B', fase: 9, boss: true, titol: 'BOSS del Nivell 2', sabers: 'Entrenament del boss: un exercici de cada fase, sense pistes', n: 8,
        gen: function (r, i, used) {
          var g = [genSalt, genSuma, genProducte, genNotables, genBugsAlg, genFactor, genDivisio, genRuffini][i];
          var idx = [1, r.pick([0, 1]), r.pick([1, 2]), r.int(0, 3), 0, r.int(0, 4), 1, r.pick([1, 2])][i];
          return fixRuffini(g(r, idx, used));
        },
        teoria: 'Al boss no hi ha pistes. Pots fer servir el formulari, però escriu el procediment.' }
    ]
  });
})(CGS);
