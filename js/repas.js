/* Fases de repàs de 1r–3r: operacions amb enters i fraccions (Nivell 0) i potències de fraccions (Nivell 1) */
(function (U) {
  var F = U.frac, fmt = U.fmt, pw = U.pw;
  var nz = function (r, lo, hi) { var v = 0; while (v === 0) v = r.int(lo, hi); return v; };
  var sg = function (x) { return x < 0 ? '(−' + Math.abs(x) + ')' : String(x); };     // nombre entre parèntesis si és negatiu
  var simp = function (n, d) { var g = U.gcd(n, d) || 1; if (d < 0) { n = -n; d = -d; } return [n / g, d / g]; };
  var fr = function (n, d) { var s = simp(n, d); return s[1] === 1 ? fmt(s[0]) : (s[0] < 0 ? '−' : '') + F(Math.abs(s[0]), s[1]); };
  var NOTA = '<p class="small">Fracció irreductible: el signe va al numerador (per exemple −3 / 4).</p>';
  var fracParts = function (n, d, pre) {
    var s = simp(n, d);
    return [pre || '', { ans: s[0], w: 4 }, ' / ', { ans: s[1], w: 4 }];
  };

  // ---------- Operacions amb enters ----------
  function genEnters(r, i) {
    var kind = ['agrupar', 'parentesis', 'jerarquia', 'absolut'][i % 4];
    if (kind === 'agrupar') {
      var nums = [r.int(2, 15)], k;
      for (k = 0; k < 5; k++) nums.push(r.int(1, 12) * (r.bool() ? 1 : -1));
      var pos = nums.filter(function (x) { return x > 0; }).reduce(function (a, b) { return a + b; }, 0);
      var neg = -nums.filter(function (x) { return x < 0; }).reduce(function (a, b) { return a + b; }, 0);
      var expr = nums.map(function (x, j) { return j === 0 ? String(x) : (x < 0 ? ' − ' + (-x) : ' + ' + x); }).join('');
      return {
        title: 'Puntuació de la partida',
        ctx: 'Els punts guanyats i perduts en una partida són:<div class="big">' + expr + '</div>',
        steps: [
          { q: 'Suma tots els positius.', parts: [{ ans: pos, w: 4 }], hint: 'Els que van amb + (i el primer).', show: 'Positius: ' + pos },
          { q: 'Suma tots els negatius (sense el signe).', parts: [{ ans: neg, w: 4 }], hint: 'Els que van amb −.', show: 'Negatius: ' + neg },
          { q: 'Resultat:', parts: [pos + ' − ' + neg + ' = ', { ans: pos - neg, w: 4 }], hint: 'Resta i posa el signe del més gran.', show: '= <b>' + fmt(pos - neg) + '</b>' }
        ]
      };
    }
    if (kind === 'parentesis') {
      var a = r.int(2, 12), b = r.int(2, 12), c = r.int(2, 12);
      var t = [{ s: '−(−' + a + ')', v: a }, { s: '(−' + b + ')', v: -b }, { s: '−(+' + c + ')', v: -c }];
      if (r.bool()) t[1] = { s: '−(−' + b + ')', v: b };
      t = r.shuffle(t);
      var sum = t[0].v + t[1].v + t[2].v;
      var expr2 = t[0].s + (t[1].s[0] === '−' ? ' ' + t[1].s : ' + ' + t[1].s) + (t[2].s[0] === '−' ? ' ' + t[2].s : ' + ' + t[2].s);
      return {
        title: 'Treure parèntesis',
        ctx: 'Calcula:<div class="big">' + expr2 + '</div>',
        steps: [
          { q: 'Treu els parèntesis: escriu cada terme amb el seu signe.', parts: [{ ans: t[0].v, w: 3 }, '  ', { ans: t[1].v, w: 3 }, '  ', { ans: t[2].v, w: 3 }],
            hint: 'Regla dels signes: −(−) = + · −(+) = − · +(−) = −.', show: 'Sense parèntesis: ' + t.map(function (x, j) { return (x.v < 0 ? (j ? ' − ' : '−') + (-x.v) : (j ? ' + ' : '') + x.v); }).join('') },
          { q: 'Resultat:', parts: [{ ans: sum, w: 4 }], hint: 'Agrupa positius i negatius.', show: '= <b>' + fmt(sum) + '</b>' }
        ]
      };
    }
    if (kind === 'jerarquia') {
      var A = r.int(10, 30), B = r.int(2, 5), C = r.int(5, 12), D = r.int(1, 6), E = r.int(1, 9);
      var in1 = D - E, in2 = C - in1, prod = B * in2, res = A - prod;
      return {
        title: 'Jerarquia de les operacions',
        ctx: 'Calcula:<div class="big">' + A + ' − ' + B + ' · [' + C + ' − (' + D + ' − ' + E + ')]</div><p class="small">Ordre: parèntesis i claudàtors (de dins cap a fora) → multiplicacions i divisions → sumes i restes.</p>',
        steps: [
          { q: 'Primer el parèntesi de dins.', parts: [D + ' − ' + E + ' = ', { ans: in1, w: 3 }], hint: 'Resta.', show: '(' + D + ' − ' + E + ') = ' + fmt(in1) },
          { q: 'Ara el claudàtor.', parts: [C + ' − ' + sg(in1) + ' = ', { ans: in2, w: 3 }], hint: 'Compte: restar un negatiu és sumar.', show: '[' + C + ' − ' + sg(in1) + '] = ' + fmt(in2) },
          { q: 'Després la multiplicació.', parts: [B + ' · ' + sg(in2) + ' = ', { ans: prod, w: 4 }], hint: 'La multiplicació va abans que la resta.', show: B + ' · ' + sg(in2) + ' = ' + fmt(prod) },
          { q: 'Finalment la resta.', parts: [A + ' − ' + sg(prod) + ' = ', { ans: res, w: 4 }], hint: 'Restar un negatiu és sumar.', show: '= <b>' + fmt(res) + '</b>' }
        ]
      };
    }
    var p = r.int(1, 9), q = r.int(1, 12), c2 = r.int(1, 8), d2 = r.int(1, 8), e = nz(r, -9, 9);
    var v1 = Math.abs(p - q), v2 = c2 - d2, v3 = Math.abs(e), res2 = v1 * v2 - v3;
    return {
      title: 'Valor absolut',
      ctx: 'El valor absolut |x| és la distància de x al 0 (sempre positiu). Calcula:<div class="big">|' + p + ' − ' + q + '| · (' + c2 + ' − ' + d2 + ') − |' + fmt(e) + '|</div>',
      steps: [
        { q: 'Calcula els dos valors absoluts.', parts: ['|' + p + ' − ' + q + '| = ', { ans: v1, w: 3 }, '   |' + fmt(e) + '| = ', { ans: v3, w: 3 }], hint: 'Primer el que hi ha a dins; després treu el signe.', show: '|' + fmt(p - q) + '| = ' + v1 + ' i |' + fmt(e) + '| = ' + v3 },
        { q: 'Calcula el parèntesi.', parts: [c2 + ' − ' + d2 + ' = ', { ans: v2, w: 3 }], hint: 'Resta.', show: '(' + c2 + ' − ' + d2 + ') = ' + fmt(v2) },
        { q: 'Resultat (primer el producte, després la resta).', parts: [{ ans: res2, w: 4 }], hint: v1 + ' · ' + sg(v2) + ' − ' + v3, show: v1 + ' · ' + sg(v2) + ' − ' + v3 + ' = <b>' + fmt(res2) + '</b>' }
      ]
    };
  }

  // ---------- Fraccions ----------
  function genFraccions(r, i) {
    var kind = ['irreductible', 'mixta', 'quantitat', 'suma', 'producte'][i % 5];
    if (kind === 'irreductible') {
      var a = r.int(1, 9), b = r.int(2, 9), g = r.pick([2, 3, 4, 5, 6]), neg = r.bool();
      while (U.gcd(a, b) !== 1 || a === b) { b++; }
      var N = a * g, D = b * g;
      return {
        title: 'Simplificar',
        ctx: 'Obtén la fracció irreductible:<div class="big">' + (neg ? '−' : '') + F(N, D) + '</div>' + NOTA,
        steps: [
          { q: 'Quin és el màxim comú divisor del numerador i el denominador?', parts: ['m.c.d.(' + N + ', ' + D + ') = ', { ans: U.gcd(N, D), w: 3 }], hint: 'El nombre més gran que divideix tots dos.', show: 'm.c.d. = ' + U.gcd(N, D) },
          { q: 'Divideix-los tots dos pel m.c.d.', parts: fracParts(neg ? -N : N, D), hint: N + ' : ' + U.gcd(N, D) + ' i ' + D + ' : ' + U.gcd(N, D) + '.', show: (neg ? '−' : '') + F(N, D) + ' = <b>' + fr(neg ? -N : N, D) + '</b>' }
        ]
      };
    }
    if (kind === 'mixta') {
      var d = r.int(2, 9), q = r.int(1, 7), rr = r.int(1, d - 1), n = q * d + rr;
      return {
        title: 'Enter i fracció',
        ctx: 'Expressa com la suma d\'un enter i una fracció:<div class="big">' + F(n, d) + '</div>',
        steps: [
          { q: 'Divideix ' + n + ' entre ' + d + ': quocient i residu.', parts: ['Quocient ', { ans: q, w: 3 }, '   Residu ', { ans: rr, w: 3 }], hint: 'Quantes vegades cap ' + d + ' dins de ' + n + '? I quant sobra?', show: n + ' = ' + d + ' · ' + q + ' + ' + rr },
          { q: 'Escriu-ho com a enter + fracció.', parts: [F(n, d) + ' = ', { ans: q, w: 3 }, ' + ', { ans: rr, w: 3 }, ' / ' + d], hint: 'El quocient és l\'enter i el residu, el numerador.', show: F(n, d) + ' = <b>' + q + ' + ' + F(rr, d) + '</b>' }
        ]
      };
    }
    if (kind === 'quantitat') {
      var den = r.pick([3, 4, 5, 6, 7, 8, 9, 10]), num = r.int(1, den - 1);
      while (U.gcd(num, den) !== 1) num++;
      var base = den * r.int(3, 40), part = base / den * num;
      if (r.bool()) {
        return {
          title: 'Fracció d\'una quantitat',
          ctx: 'Un ' + F(num, den) + ' dels <b>' + fmt(base) + '</b> jugadors ha arribat al nivell 3. Quants jugadors són?',
          steps: [
            { q: 'Primer divideix entre el denominador (una part).', parts: [fmt(base) + ' : ' + den + ' = ', { ans: base / den, w: 5 }], hint: 'Cada «' + den + 'è» del total.', show: fmt(base) + ' : ' + den + ' = ' + fmt(base / den) },
            { q: 'Després multiplica pel numerador.', parts: [fmt(base / den) + ' · ' + num + ' = ', { ans: part, w: 5 }], hint: 'Agafa ' + num + ' parts.', show: '<b>' + fmt(part) + ' jugadors</b>' }
          ]
        };
      }
      return {
        title: 'Trobar el total',
        ctx: 'Els ' + F(num, den) + ' del pressupost de l\'estudi són <b>' + fmt(part) + ' €</b>. Quin és el pressupost total?',
        steps: [
          { q: 'Quant val una part (1/' + den + ')?', parts: [fmt(part) + ' : ' + num + ' = ', { ans: part / num, w: 5 }], hint: 'Si ' + num + ' parts valen ' + fmt(part) + ', una part val…', show: 'Una part: ' + fmt(part / num) + ' €' },
          { q: 'El total són ' + den + ' parts.', parts: [fmt(part / num) + ' · ' + den + ' = ', { ans: base, w: 5 }, ' €'], hint: 'Multiplica pel denominador.', show: 'Total: <b>' + fmt(base) + ' €</b>' }
        ]
      };
    }
    if (kind === 'suma') {
      var b1 = r.pick([2, 3, 4, 6]), b2 = r.pick([3, 4, 5, 6, 8]); if (b1 === b2) b2 = b1 * 2;
      var a1 = nz(r, -5, 5), a2 = r.int(1, 7), op = r.bool() ? 1 : -1;
      while (U.gcd(a1, b1) !== 1) a1 = a1 > 0 ? a1 + 1 : a1 - 1;
      var m = b1 * b2 / U.gcd(b1, b2), n1, n2, tot;
      do { while (U.gcd(a2, b2) !== 1) a2++; n1 = a1 * m / b1; n2 = a2 * m / b2; tot = n1 + op * n2; if (tot % m === 0) a2++; } while (tot % m === 0 || U.gcd(a2, b2) !== 1);
      return {
        title: 'Sumar i restar fraccions',
        ctx: 'Calcula:<div class="big">' + (a1 < 0 ? '−' : '') + F(Math.abs(a1), b1) + (op > 0 ? ' + ' : ' − ') + F(a2, b2) + '</div>' + NOTA,
        steps: [
          { q: 'Mínim comú múltiple dels denominadors:', parts: ['m.c.m.(' + b1 + ', ' + b2 + ') = ', { ans: m, w: 3 }], hint: 'El múltiple més petit de tots dos.', show: 'm.c.m. = ' + m },
          { q: 'Escriu les fraccions equivalents amb denominador ' + m + ' (numeradors).', parts: [{ ans: n1, w: 4 }, ' / ' + m + (op > 0 ? '  +  ' : '  −  '), { ans: n2, w: 4 }, ' / ' + m], hint: m + ' : ' + b1 + ' = ' + m / b1 + ' → multiplica el numerador per ' + m / b1 + '. Igual amb l\'altra.', show: (n1 < 0 ? '−' : '') + F(Math.abs(n1), m) + (op > 0 ? ' + ' : ' − ') + F(n2, m) },
          { q: 'Opera els numeradors i simplifica.', parts: fracParts(tot, m), hint: n1 + (op > 0 ? ' + ' : ' − ') + n2 + ' = ' + tot + '. Després simplifica.', show: '= ' + (tot < 0 ? '−' : '') + F(Math.abs(tot), m) + ' = <b>' + fr(tot, m) + '</b>' }
        ]
      };
    }
    var p1 = nz(r, -6, 6), q1 = r.int(2, 9), p2 = r.int(1, 9), q2 = r.int(2, 9), div = r.bool();
    var N2 = div ? p1 * q2 : p1 * p2, D2 = div ? q1 * p2 : q1 * q2;
    return {
      title: div ? 'Dividir fraccions' : 'Multiplicar fraccions',
      ctx: 'Calcula:<div class="big">' + (p1 < 0 ? '−' : '') + F(Math.abs(p1), q1) + (div ? ' : ' : ' · ') + F(p2, q2) + '</div>' + NOTA,
      steps: [
        { q: div ? 'Dividir és multiplicar per la inversa: numerador i denominador «en creu».' : 'Multiplica numeradors i denominadors.', parts: [{ ans: N2, w: 4 }, ' / ', { ans: D2, w: 4 }],
          hint: div ? 'Numerador: ' + p1 + ' · ' + q2 + '. Denominador: ' + q1 + ' · ' + p2 + '.' : 'Numerador: ' + p1 + ' · ' + p2 + '. Denominador: ' + q1 + ' · ' + q2 + '.', show: '= ' + (N2 < 0 ? '−' : '') + F(Math.abs(N2), D2) },
        { q: 'Simplifica.', parts: fracParts(N2, D2), hint: 'Divideix pel m.c.d.(' + Math.abs(N2) + ', ' + D2 + ') = ' + U.gcd(N2, D2) + '.', show: '= <b>' + fr(N2, D2) + '</b>' }
      ]
    };
  }

  // ---------- Potències de fraccions i de base negativa ----------
  function genPotFrac(r, i) {
    var kind = ['fraccio', 'negatiu', 'mateixaBase', 'signes'][i % 4];
    if (kind === 'fraccio') {
      var a = r.int(1, 5), b = r.int(2, 6); while (U.gcd(a, b) !== 1) b++;
      var n = r.pick([2, 3]), neg = r.bool(), vN = Math.pow(a, n) * (neg && n % 2 ? -1 : 1), vD = Math.pow(b, n);
      var base = '(' + (neg ? '−' : '') + F(a, b) + ')';
      return {
        title: 'Potència d\'una fracció',
        ctx: 'Calcula:<div class="big">' + base + '<sup>' + n + '</sup></div>' + NOTA,
        steps: [
          { q: 'El resultat és positiu o negatiu?', choices: ['Positiu', 'Negatiu'], ans: vN > 0 ? 0 : 1, hint: 'Base negativa: exponent parell → +, senar → −.', show: 'Signe ' + (vN > 0 ? 'positiu' : 'negatiu') },
          { q: 'Eleva el numerador i el denominador.', parts: [{ ans: vN, w: 4 }, ' / ', { ans: vD, w: 4 }], hint: '(a/b)<sup>n</sup> = a<sup>n</sup> / b<sup>n</sup>.', show: base + '<sup>' + n + '</sup> = <b>' + fr(vN, vD) + '</b>' }
        ]
      };
    }
    if (kind === 'negatiu') {
      var a2 = r.int(1, 5), b2 = r.int(2, 5); while (U.gcd(a2, b2) !== 1) b2++;
      var n2 = r.pick([1, 2, 3]), neg2 = r.bool() && n2 !== 2;
      var sN = (neg2 && n2 % 2 ? -1 : 1) * Math.pow(b2, n2), sD = Math.pow(a2, n2);
      var base2 = '(' + (neg2 ? '−' : '') + F(a2, b2) + ')';
      return {
        title: 'Exponent negatiu',
        ctx: 'Calcula:<div class="big">' + base2 + '<sup>−' + n2 + '</sup></div>' + NOTA,
        steps: [
          { q: 'Un exponent negatiu vol dir «la inversa». Gira la fracció.', parts: ['(', { ans: (neg2 ? -1 : 1) * b2, w: 3 }, ' / ', { ans: a2, w: 3 }, ')<sup>' + n2 + '</sup>'], hint: '(a/b)<sup>−n</sup> = (b/a)<sup>n</sup>. El signe no canvia.', show: base2 + '<sup>−' + n2 + '</sup> = (' + (neg2 ? '−' : '') + F(b2, a2) + ')<sup>' + n2 + '</sup>' },
          { q: 'Calcula la potència.', parts: [{ ans: simp(sN, sD)[0], w: 4 }, ' / ', { ans: simp(sN, sD)[1], w: 4 }], hint: 'Eleva numerador i denominador.', show: '= <b>' + fr(sN, sD) + '</b>' }
        ]
      };
    }
    if (kind === 'mateixaBase') {
      var bb = r.pick([2, 3, 5]), pows = bb === 2 ? [[4, 2], [8, 3], [16, 4]] : bb === 3 ? [[9, 2], [27, 3], [81, 4]] : [[25, 2], [125, 3]];
      var A = r.pick(pows), B = r.pick(pows), k = r.int(2, 3), C = r.pick(pows);
      var eNum = A[1] * k + B[1] + 1, eDen = C[1] + 2, eRes = eNum - eDen;
      return {
        title: 'Tot a la mateixa base',
        ctx: 'Redueix a una sola potència de base ' + bb + ':<div class="big">' + F(A[0] + '<sup>' + k + '</sup> · ' + B[0] + ' · ' + bb, C[0] + ' · (−' + bb + ')<sup>2</sup>') + '</div>',
        steps: [
          { q: 'Escriu cada nombre com a potència de ' + bb + '.', parts: [A[0] + ' = ' + bb + '<sup>', { ans: A[1], w: 2 }, '</sup>   ' + B[0] + ' = ' + bb + '<sup>', { ans: B[1], w: 2 }, '</sup>   ' + C[0] + ' = ' + bb + '<sup>', { ans: C[1], w: 2 }, '</sup>'],
            hint: 'Quantes vegades has de multiplicar ' + bb + ' per obtenir cada nombre?', show: A[0] + ' = ' + pw(bb, A[1]) + ', ' + B[0] + ' = ' + pw(bb, B[1]) + ', ' + C[0] + ' = ' + pw(bb, C[1]) + ' i (−' + bb + ')<sup>2</sup> = ' + pw(bb, 2) },
          { q: 'Exponent del numerador i del denominador.', parts: ['Numerador ' + bb + '<sup>', { ans: eNum, w: 3 }, '</sup>   Denominador ' + bb + '<sup>', { ans: eDen, w: 3 }, '</sup>'],
            hint: '(' + bb + '<sup>' + A[1] + '</sup>)<sup>' + k + '</sup> = ' + bb + '<sup>' + A[1] * k + '</sup>. En un producte se sumen els exponents.', show: F(pw(bb, eNum), pw(bb, eDen)) },
          { q: 'Resultat:', parts: [bb + '<sup>', { ans: eRes, w: 3 }, '</sup>'], hint: 'Quocient: es resten els exponents.', show: '= <b>' + pw(bb, eRes) + '</b>' }
        ]
      };
    }
    var b3 = r.int(2, 4), n3 = r.pick([2, 3, 4]);
    return {
      title: 'On és el signe?',
      ctx: 'Calcula les dues potències:<div class="big">(−' + b3 + ')<sup>' + n3 + '</sup> &nbsp;&nbsp;i&nbsp;&nbsp; −' + b3 + '<sup>' + n3 + '</sup></div>',
      steps: [
        { q: 'A (−' + b3 + ')<sup>' + n3 + '</sup> l\'exponent afecta el signe. Calcula-la.', parts: [{ ans: Math.pow(-b3, n3), w: 4 }], hint: 'Base negativa: exponent parell → +, senar → −.', show: '(−' + b3 + ')<sup>' + n3 + '</sup> = ' + fmt(Math.pow(-b3, n3)) },
        { q: 'A −' + b3 + '<sup>' + n3 + '</sup> l\'exponent només afecta el ' + b3 + '. Calcula-la.', parts: [{ ans: -Math.pow(b3, n3), w: 4 }], hint: 'Primer ' + b3 + '<sup>' + n3 + '</sup> i després el signe menys.', show: '−' + b3 + '<sup>' + n3 + '</sup> = ' + fmt(-Math.pow(b3, n3)) }
      ]
    };
  }

  var lvl = function (id) { return CGS.NIVELLS.filter(function (n) { return n.id === id; })[0]; };
  var addBeforeBoss = function (nv, ms) {
    var bi = nv.missions.map(function (m) { return !!m.boss; }).indexOf(true);
    Array.prototype.splice.apply(nv.missions, [bi, 0].concat(ms));
    nv.missions.forEach(function (m, k) { m.fase = k + 1; });
  };
  addBeforeBoss(lvl('N0'), [
    { id: 'N0M6', titol: 'Operacions amb enters', sabers: 'Repàs: signes, parèntesis, jerarquia i valor absolut', n: 4, gen: genEnters,
      teoria: '<b>Regla dels signes</b>: + · + = + · − · − = + · + · − = −. Treure parèntesis: −(−a) = +a · −(+a) = −a.<br><b>Jerarquia</b>: 1) parèntesis i claudàtors, de dins cap a fora · 2) potències · 3) multiplicacions i divisions · 4) sumes i restes.<br><b>Valor absolut</b> |x|: la distància al 0, sempre positiu. |−7| = 7.' },
    { id: 'N0M7', titol: 'Fraccions', sabers: 'Repàs: simplificar, fracció d\'una quantitat i operacions', n: 5, gen: genFraccions,
      teoria: '<b>Simplificar</b>: divideix numerador i denominador pel m.c.d. <b>Fracció d\'una quantitat</b>: divideix pel denominador i multiplica pel numerador. <b>Trobar el total</b>: divideix pel numerador i multiplica pel denominador.<br><b>Sumar/restar</b>: redueix a denominador comú (m.c.m.). <b>Multiplicar</b>: numeradors per numeradors i denominadors per denominadors. <b>Dividir</b>: multiplica per la inversa (en creu).' }
  ]);
  addBeforeBoss(lvl('N1'), [
    { id: 'N1M9', titol: 'Potències de fraccions', sabers: 'Repàs: base fraccionària o negativa i reduir a la mateixa base', n: 4, gen: genPotFrac,
      teoria: '(a/b)<sup>n</sup> = a<sup>n</sup>/b<sup>n</sup> · (a/b)<sup>−n</sup> = (b/a)<sup>n</sup> (gira la fracció).<br>(−3)<sup>4</sup> = 81 però −3<sup>4</sup> = −81: el parèntesi decideix si el signe s\'eleva.<br>Per reduir 27<sup>2</sup> · 9 · 3 escriu-ho tot amb la mateixa base: (3<sup>3</sup>)<sup>2</sup> · 3<sup>2</sup> · 3 = 3<sup>9</sup>.' }
  ]);
})(CGS);
