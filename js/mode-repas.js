/* MODE REPÀS · rondes d'exercicis barrejats per tema (pas a pas, sempre obert) */
(function (U) {
  var fmt = U.fmt, sci = U.sci;
  var mis = function (id) {
    var out = null;
    CGS.NIVELLS.forEach(function (nv) { nv.missions.forEach(function (m) { if (m.id === id) out = m; }); });
    return out;
  };
  // Agafa un exercici d'una missió existent (id i tipus d'exercici)
  var from = function (id, idx) { return function (r, used) { var m = mis(id); return m.gen(r, idx === undefined ? r.int(0, m.n - 1) : idx, used); }; };

  // ---------- Exercicis nous de notació científica ----------
  function ncMalEscrita(r) {
    var gran = r.bool(), a = U.clean(r.int(11, 99) / 10), e = gran ? r.int(2, 9) : -r.int(2, 7);
    var m, e2, A, E;
    if (r.bool()) { m = U.clean(a * 10); e2 = e - 1; } else { m = U.clean(a / 10); e2 = e + 1; }   // m·10^e2 = a·10^e
    A = a; E = e;
    var big = m >= 10;
    return {
      title: 'Mal escrita!',
      ctx: 'Aquesta dada del GDD és correcta, però <b>no</b> està en notació científica:<div class="big">' + sci(m, e2) + '</div>',
      steps: [
        { q: 'Per què no està en notació científica?', choices: ['El nombre de davant és 10 o més', 'El nombre de davant és més petit que 1', 'L\'exponent és negatiu'], ans: big ? 0 : 1,
          hint: 'Recorda: a · 10<sup>n</sup> amb 1 ≤ a < 10.', show: fmt(m) + (big ? ' ≥ 10' : ' < 1') },
        { q: 'Escriu ' + fmt(m) + ' en notació científica.', parts: [fmt(m) + ' = ', { ans: A, w: 5 }, ' · 10<sup>', { ans: big ? 1 : -1, w: 3 }, '</sup>'],
          hint: big ? 'Mou la coma un lloc a l\'esquerra: ' + fmt(m) + ' = ' + fmt(A) + ' · 10.' : 'Mou la coma un lloc a la dreta: ' + fmt(m) + ' = ' + fmt(A) + ' · 10<sup>−1</sup>.', show: fmt(m) + ' = ' + sci(A, big ? 1 : -1) },
        { q: 'Ajunta les potències de 10.', parts: [{ ans: A, w: 5 }, ' · 10<sup>', { ans: E, w: 3 }, '</sup>'],
          hint: 'Se sumen els exponents: ' + (big ? 1 : -1) + ' + (' + e2 + ').', show: sci(m, e2) + ' = <b>' + sci(A, E) + '</b>' }
      ]
    };
  }
  function ncOrdenar(r) {
    var items = [], seen = {};
    while (items.length < 3) {
      var a = U.clean(r.int(11, 99) / 10), e = r.int(-6, 9), v = a * Math.pow(10, e);
      if (seen[e + '|' + a]) continue; seen[e + '|' + a] = 1;
      items.push({ a: a, e: e, v: v });
    }
    if (r.bool()) {   // dos amb el mateix exponent
      items[1].e = items[0].e; if (items[1].a === items[0].a) items[1].a = U.clean(items[1].a + 0.5 > 9.9 ? items[1].a - 0.5 : items[1].a + 0.5);
      items[1].v = items[1].a * Math.pow(10, items[1].e);
    }
    if (items[2].v === items[0].v || items[2].v === items[1].v) { items[2].e = items[2].e + 1; items[2].v = items[2].a * Math.pow(10, items[2].e); }
    var noms = ['A', 'B', 'C'], txt = items.map(function (it, k) { return noms[k] + ': ' + sci(it.a, it.e); }).join(' · ');
    var order = [0, 1, 2].sort(function (x, y) { return items[x].v - items[y].v; });
    return {
      title: 'Ordena les dades',
      ctx: 'Mides de tres fitxers del joc (en bytes):<div class="big">' + txt + '</div>',
      steps: [
        { q: 'Quin és el més petit?', choices: noms, ans: order[0], hint: 'Mira primer l\'exponent (compte amb els negatius). Si és igual, compara el nombre de davant.', show: 'El més petit: ' + noms[order[0]] },
        { q: 'Quin és el més gran?', choices: noms, ans: order[2], hint: 'L\'exponent més gran guanya.', show: 'El més gran: ' + noms[order[2]] + ' → ordre: ' + order.map(function (k) { return noms[k]; }).join(' < ') }
      ]
    };
  }
  function ncQuadrat(r) {
    var a = r.int(2, 9), n = r.int(-5, 6), p = r.pick([2, 3]), ap = Math.pow(a, p), ep = n * p;
    var exp = Math.floor(Math.log10(ap) + 1e-9), A = U.clean(ap / Math.pow(10, exp)), E = ep + exp;
    return {
      title: 'Potència en notació científica',
      ctx: 'Calcula:<div class="big">(' + sci(a, n) + ')<sup>' + p + '</sup></div>',
      steps: [
        { q: 'Eleva el nombre de davant.', parts: [a + '<sup>' + p + '</sup> = ', { ans: ap, w: 4 }], hint: 'Multiplica ' + a + ' per ell mateix ' + p + ' vegades.', show: a + '<sup>' + p + '</sup> = ' + ap },
        { q: 'Eleva la potència de 10.', parts: ['(10<sup>' + n + '</sup>)<sup>' + p + '</sup> = 10<sup>', { ans: ep, w: 3 }, '</sup>'], hint: 'Potència d\'una potència: es multipliquen els exponents.', show: '10<sup>' + fmt(ep) + '</sup>' },
        { q: 'Escriu-ho en notació científica correcta.', parts: [{ ans: A, w: 5 }, ' · 10<sup>', { ans: E, w: 3 }, '</sup>'], hint: ap >= 10 ? ap + ' = ' + fmt(A) + ' · 10' + (exp > 1 ? '<sup>' + exp + '</sup>' : '') + ': suma ' + exp + ' a l\'exponent.' : 'Ja està bé.', show: '= ' + sci(ap, ep) + (ap >= 10 ? ' = <b>' + sci(A, E) + '</b>' : '') }
      ]
    };
  }
  function ncPendrive(r) {
    var aj = U.clean(r.int(12, 95) / 10), ej = r.int(9, 10), ap = r.pick([1.28, 2.56, 5.12]), epx = ej + r.int(1, 2);
    var q = (ap * Math.pow(10, epx)) / (aj * Math.pow(10, ej)), qm = U.clean(U.round(ap / aj, 3)), n = Math.floor(q + 1e-9);
    return {
      title: 'Quants jocs hi caben?',
      ctx: 'Un joc ocupa <b>' + sci(aj, ej) + '</b> bytes. Un disc té <b>' + sci(ap, epx) + '</b> bytes lliures. Quants jocs hi caben sencers?',
      steps: [
        { q: 'Divideix els nombres de davant (arrodoneix a les mil·lèsimes).', parts: [fmt(ap) + ' : ' + fmt(aj) + ' ≈ ', { ans: qm, tol: 0.0011, w: 6 }], hint: 'Amb la calculadora.', show: fmt(ap) + ' : ' + fmt(aj) + ' ≈ ' + fmt(qm) },
        { q: 'Divideix les potències de 10.', parts: ['10<sup>' + epx + '</sup> : 10<sup>' + ej + '</sup> = 10<sup>', { ans: epx - ej, w: 3 }, '</sup>'], hint: 'Es resten els exponents.', show: '10<sup>' + (epx - ej) + '</sup>' },
        { q: 'Quants jocs sencers hi caben?', parts: [{ ans: n, w: 5 }, ' jocs'], hint: fmt(qm) + ' · 10<sup>' + (epx - ej) + '</sup> ≈ ' + fmt(U.round(q, 1)) + '. Un joc a mitges no hi cap: arrodoneix cap avall.', show: '≈ ' + fmt(U.round(q, 2)) + ' → hi caben <b>' + n + ' jocs</b> (arrodonim cap avall)' }
      ]
    };
  }
  function ncUnitats(r) {
    var u = r.pick([['kB', 3, 'quilobytes'], ['MB', 6, 'megabytes'], ['GB', 9, 'gigabytes'], ['TB', 12, 'terabytes']]);
    var x = U.clean(r.int(12, 950) / 10), exp = Math.floor(Math.log10(x) + 1e-9), A = U.clean(x / Math.pow(10, exp));
    return {
      title: 'Canvi d\'unitats',
      ctx: 'Un fitxer ocupa <b>' + fmt(x) + ' ' + u[0] + '</b>. Sabent que 1 ' + u[0] + ' (' + u[2] + ') = 10<sup>' + u[1] + '</sup> bytes, quants bytes són?',
      steps: [
        { q: 'Escriu ' + fmt(x) + ' en notació científica.', parts: [{ ans: A, w: 5 }, ' · 10<sup>', { ans: exp, w: 2 }, '</sup>'], hint: 'Una sola xifra davant la coma.', show: fmt(x) + ' = ' + sci(A, exp) },
        { q: 'Multiplica per 10<sup>' + u[1] + '</sup>.', parts: [{ ans: A, w: 5 }, ' · 10<sup>', { ans: exp + u[1], w: 3 }, '</sup> bytes'], hint: 'Se sumen els exponents.', show: fmt(x) + ' ' + u[0] + ' = <b>' + sci(A, exp + u[1]) + ' bytes</b>' }
      ]
    };
  }

  // ---------- Temes de repàs ----------
  function tema(id, titol, sabers, estudi, fonts, n, teoria) {
    return {
      id: id, repas: true, titol: titol, sabers: sabers, estudi: estudi, n: n || 8, teoria: teoria,
      gen: function (r, i, used) {
        var k = (i + r.int(0, fonts.length - 1)) % fonts.length, key = 's' + k;
        used[key] = used[key] || [];                       // cada font té la seva llista d'ítems ja sortits
        if (used[key].length >= 6) used[key].length = 0;
        return fonts[k](r, used[key]);
      }
    };
  }
  var NC = [from('N1M4', 0), from('N1M4', 1), from('N1M4', 2), from('N1M4', 3), from('N1M4', 4), from('N1M5', 0), from('N1M5', 1), from('N1M5', 2),
    function (r) { return ncMalEscrita(r); }, function (r) { return ncOrdenar(r); }, function (r) { return ncQuadrat(r); },
    function (r) { return ncPendrive(r); }, function (r) { return ncUnitats(r); }];

  CGS.REPAS = {
    id: 'R', nom: 'Mode repàs', sub: 'Rondes d\'exercicis barrejats d\'un tema, pas a pas',
    missions: [
      tema('RNC', 'Notació científica', 'Escriure, llegir, comparar, ordenar, operar, potències, calculadora i problemes', 'u2-nc', NC, 10,
        'Notació científica: <b>a · 10<sup>n</sup></b> amb 1 ≤ a < 10. Nombres grans → n positiu; nombres petits → n negatiu.<br>Producte: es multipliquen els nombres i se <b>sumen</b> els exponents. Quocient: es divideixen i es <b>resten</b>. Potència: s\'eleva el nombre i es <b>multipliquen</b> els exponents.<br>Si el nombre de davant surt ≥ 10 o < 1, es corregeix: 23,4 · 10<sup>7</sup> = 2,34 · 10<sup>8</sup> · 0,5 · 10<sup>3</sup> = 5 · 10<sup>2</sup>.<br>Calculadora: <code>1.5E-3</code> = 1,5 · 10<sup>−3</sup>.'),
      tema('RFR', 'Enters i fraccions', 'Operacions combinades, valor absolut i fraccions', 'u1-enters', [from('N0M6'), from('N0M7')], 8, mis('N0M6').teoria + '<br>' + mis('N0M7').teoria),
      tema('RPO', 'Potències', 'Exponent 0 i negatiu, propietats, bugs i potències de fraccions', 'u2-propietats', [from('N1M1'), from('N1M2'), from('N1M3'), from('N1M9')], 8, mis('N1M2').teoria + '<br>' + mis('N1M9').teoria),
      tema('RRA', 'Radicals i Pitàgores', 'Arrels, extreure factors, operar radicals i distàncies', 'u2-radicals', [from('N1M6'), from('N1M7'), from('N1M8')], 8, mis('N1M7').teoria + '<br>' + mis('N1M8').teoria),
      tema('RPL', 'Polinomis', 'Valor numèric, operacions, productes notables, factorització, divisió i Ruffini', 'u3-monomis',
        [from('N2M1'), from('N2M2'), from('N2M3'), from('N2M4'), from('N2M6'), from('N2M7'), from('N2M8')], 8, mis('N2M4').teoria + '<br>' + mis('N2M8').teoria),
      tema('REQ', 'Equacions i problemes', 'Equacions de 1r i 2n grau, discriminant i problemes', 'u4-eq2', [from('N3M1'), from('N3M2'), from('N3M3'), from('N3M4'), from('N3M5')], 8, mis('N3M1').teoria + '<br>' + mis('N3M2').teoria),
      tema('RPC', 'Percentatges i interessos', 'IVA, rebaixes, variacions encadenades, interès simple i compost', 'u4-percentatges', [from('N3M6'), from('N3M7')], 8, mis('N3M6').teoria + '<br>' + mis('N3M7').teoria),
      tema('RSI', 'Inequacions i sistemes', 'Inequacions de 1r grau i sistemes 2×2', 'u4-sistemes', [from('N3M8'), from('N3M9'), from('N3M10')], 8, mis('N3M8').teoria + '<br>' + mis('N3M10').teoria)
    ]
  };
})(CGS);
