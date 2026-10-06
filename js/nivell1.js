/* NIVELL 1 · Memòria i píxels — Unitat 2: potències, notació científica i radicals */
(function (U) {
  var pw = U.pw, rad = U.rad, frac = U.frac, sci = U.sci, fmt = U.fmt;

  // ---------- M1.1 Quants colors? (potències, exponent 0 i negatiu) ----------
  function genColors(r, i) {
    var kind = ['bits', 'rgb', 'sprite', 'signes'][i % 4];
    if (kind === 'bits') {
      var n = r.int(3, 10), v = Math.pow(2, n);
      return {
        title: 'Interruptors i bits',
        ctx: 'Un bit és un interruptor amb 2 posicions (0 o 1). Un personatge guarda el seu estat en <b>' + n + ' bits</b>. Quantes combinacions diferents pot guardar?',
        steps: [
          { q: 'Escriu-ho com a potència.', parts: [{ ans: 2, w: 2 }, '<sup>', { ans: n, w: 2 }, '</sup>'],
            hint: 'Cada bit multiplica per 2 les combinacions: 2 · 2 · 2 · … (' + n + ' vegades).', show: 'Combinacions = ' + pw(2, n) },
          { q: 'Calcula el valor de la potència.', parts: [pw(2, n) + ' = ', { ans: v, w: 6 }],
            hint: 'Multiplica 2 per ell mateix ' + n + ' vegades (o fes servir la tecla x<sup>y</sup>).', show: pw(2, n) + ' = ' + fmt(v) + ' combinacions' }
        ]
      };
    }
    if (kind === 'rgb') {
      var k = r.pick([4, 5, 6, 8]), t = 3 * k, val = Math.pow(2, t);
      return {
        title: 'La paleta de colors',
        ctx: 'Cada color de la pantalla té 3 canals (vermell, verd i blau) i cada canal es guarda amb <b>' + k + ' bits</b>.',
        steps: [
          { q: 'Quants bits fa servir cada color en total?', parts: [{ ans: t, w: 3 }, ' bits'],
            hint: '3 canals de ' + k + ' bits cadascun.', show: '3 · ' + k + ' = ' + t + ' bits' },
          { q: 'Quants colors diferents es poden fer? Escriu la potència i el valor.', parts: [{ ans: 2, w: 2 }, '<sup>', { ans: t, w: 2 }, '</sup> = ', { ans: val, w: 9 }],
            hint: 'Amb ' + t + ' bits hi ha 2<sup>' + t + '</sup> combinacions. Calcula-ho amb la calculadora.', show: pw(2, t) + ' = ' + fmt(val) + ' colors' },
          { q: 'Comprova-ho amb les propietats: ' + pw('2<sup>' + k + '</sup>', 3) + ' = 2<sup>?</sup>', parts: ['(2<sup>' + k + '</sup>)<sup>3</sup> = 2<sup>', { ans: t, w: 3 }, '</sup>'],
            hint: 'Potència d\'una potència: es multipliquen els exponents.', show: '(2<sup>' + k + '</sup>)<sup>3</sup> = 2<sup>' + t + '</sup> ✔' }
        ]
      };
    }
    if (kind === 'sprite') {
      var m = r.pick([5, 6, 7]), L = m + r.int(1, 3), e = m - L, den = Math.pow(2, -e);
      return {
        title: 'L\'sprite que s\'encongeix',
        ctx: 'Un sprite mesura ' + fmt(Math.pow(2, m)) + ' = ' + pw(2, m) + ' px i a cada nivell es fa <b>la meitat de gran</b>. Quant mesura després de ' + L + ' nivells?',
        steps: [
          { q: 'Escriu la mida com una potència de 2.', parts: [pw(2, m) + ' : ' + pw(2, L) + ' = 2<sup>', { ans: e, w: 3 }, '</sup>'],
            hint: 'Dividir per 2 a cada nivell és dividir per 2<sup>' + L + '</sup>. Quocient de la mateixa base: es resten els exponents.', show: pw(2, m) + ' : ' + pw(2, L) + ' = ' + pw(2, e) },
          { q: 'Una potència d\'exponent negatiu és una fracció. Completa-la.', parts: [pw(2, e) + ' = 1 / ', { ans: den, w: 4 }],
            hint: 'a<sup>−n</sup> = 1 / a<sup>n</sup>. Aquí: 1 / 2<sup>' + (-e) + '</sup>.', show: pw(2, e) + ' = ' + frac(1, den) },
          { q: 'Escriu la mida en forma decimal.', parts: [{ ans: 1 / den, w: 7 }, ' px'],
            hint: 'Divideix 1 entre ' + den + '.', show: 'Mida final = ' + fmt(1 / den) + ' px (menys d\'un píxel: ja no es veu!)' }
        ]
      };
    }
    var b = r.int(2, 5), ex = r.pick([2, 3, 4]), neg = r.bool();
    var base = neg ? -b : b, val2 = Math.pow(base, ex);
    var b2 = r.int(2, 6), n2 = r.pick([1, 2, 3]);
    return {
      title: 'Signes i exponents especials',
      ctx: 'El programador ha de calcular aquestes tres potències per al marcador del joc:<div class="big">' + pw(fmt(base), ex) + ' · ' + pw(b2, 0) + ' · ' + pw(b2, -n2) + '</div>',
      steps: [
        { q: 'El resultat de ' + pw(fmt(base), ex) + ' és positiu o negatiu?', choices: ['Positiu', 'Negatiu'], ans: val2 > 0 ? 0 : 1,
          hint: 'Base negativa: exponent parell → positiu; exponent senar → negatiu. Base positiva → sempre positiu.', show: 'Signe: ' + (val2 > 0 ? 'positiu' : 'negatiu') },
        { q: 'Calcula el valor.', parts: [pw(fmt(base), ex) + ' = ', { ans: val2, w: 5 }],
          hint: 'Multiplica la base per ella mateixa ' + ex + ' vegades, amb el signe.', show: pw(fmt(base), ex) + ' = ' + fmt(val2) },
        { q: 'Quant val ' + pw(b2, 0) + '?', parts: [pw(b2, 0) + ' = ', { ans: 1, w: 3 }],
          hint: 'Qualsevol nombre (diferent de 0) elevat a 0 val…', show: pw(b2, 0) + ' = 1' },
        { q: 'Escriu ' + pw(b2, -n2) + ' com a fracció.', parts: [pw(b2, -n2) + ' = 1 / ', { ans: Math.pow(b2, n2), w: 4 }],
          hint: 'a<sup>−n</sup> = 1 / a<sup>n</sup>. No és un nombre negatiu!', show: pw(b2, -n2) + ' = ' + frac(1, Math.pow(b2, n2)) }
      ]
    };
  }

  // ---------- M1.2 Quant ocupa? (propietats) ----------
  var REGLES = ['Mateixa base, multiplicació → se sumen els exponents',
    'Mateixa base, divisió → es resten els exponents',
    'Potència d\'una potència → es multipliquen els exponents',
    'Mateix exponent → es multipliquen (o divideixen) les bases'];
  function genPropietats(r, i) {
    var kind = ['prod', 'quoc', 'potpot', 'mateixExp', 'combinat'][i % 5];
    var b = r.pick([2, 3, 5, 10]), p = r.int(2, 9), q = r.int(2, 7), ctx, steps;
    if (kind === 'prod') {
      if (b !== 2) b = 2;
      ctx = 'Un nivell té ' + pw(2, p) + ' pantalles i cada pantalla ocupa ' + pw(2, q + 8) + ' bytes. Quant ocupa el nivell?';
      q = q + 8;
      steps = [
        { q: 'Quina operació i quina propietat cal fer servir?', choices: REGLES, ans: 0, hint: 'Pantalles × bytes per pantalla. Les dues potències tenen base 2.', show: pw(2, p) + ' · ' + pw(2, q) + ' → se sumen els exponents' },
        { q: 'Calcula-ho com una sola potència.', parts: [pw(2, p) + ' · ' + pw(2, q) + ' = 2<sup>', { ans: p + q, w: 3 }, '</sup>'], hint: p + ' + ' + q + ' = ?', show: pw(2, p) + ' · ' + pw(2, q) + ' = ' + pw(2, p + q) + ' bytes' }
      ];
    } else if (kind === 'quoc') {
      var tot = p + q + 6;
      ctx = 'La memòria té ' + pw(2, tot) + ' bytes lliures i cada pantalla ocupa ' + pw(2, q) + ' bytes. Quantes pantalles hi caben?';
      steps = [
        { q: 'Quina operació i quina propietat cal fer servir?', choices: REGLES, ans: 1, hint: 'Quantes vegades cap una cosa dins l\'altra → divisió.', show: pw(2, tot) + ' : ' + pw(2, q) + ' → es resten els exponents' },
        { q: 'Calcula-ho com una sola potència.', parts: [pw(2, tot) + ' : ' + pw(2, q) + ' = 2<sup>', { ans: tot - q, w: 3 }, '</sup>'], hint: tot + ' − ' + q + ' = ?', show: '= ' + pw(2, tot - q) + ' pantalles' },
        { q: 'Quantes pantalles són? (valor)', parts: [{ ans: Math.pow(2, tot - q), w: 7 }, ' pantalles'], hint: 'Calcula ' + pw(2, tot - q) + '.', show: pw(2, tot - q) + ' = ' + fmt(Math.pow(2, tot - q)) + ' pantalles' }
      ];
    } else if (kind === 'potpot') {
      var e1 = r.int(2, 5), e2 = r.int(2, 4);
      ctx = 'Calcula com una sola potència:<div class="big">(' + pw(b, e1) + ')<sup>' + e2 + '</sup></div>';
      steps = [
        { q: 'Quina propietat cal fer servir?', choices: REGLES, ans: 2, hint: 'Hi ha una potència elevada a una altra potència.', show: 'Potència d\'una potència → es multipliquen' },
        { q: 'Resultat:', parts: ['(' + pw(b, e1) + ')<sup>' + e2 + '</sup> = ', { ans: b, w: 3 }, '<sup>', { ans: e1 * e2, w: 3 }, '</sup>'], hint: e1 + ' · ' + e2 + ' = ?', show: '(' + pw(b, e1) + ')<sup>' + e2 + '</sup> = ' + pw(b, e1 * e2) }
      ];
    } else if (kind === 'mateixExp') {
      var a1 = r.pick([2, 3, 4, 5]), a2 = r.pick([2, 3, 5]), n = r.int(2, 4);
      var div = r.bool(), A = div ? a1 * a2 : a1;
      ctx = 'Calcula com una sola potència:<div class="big">' + pw(A, n) + (div ? ' : ' : ' · ') + pw(a2, n) + '</div>';
      steps = [
        { q: 'Quina propietat cal fer servir?', choices: REGLES, ans: 3, hint: 'Les bases són diferents però els exponents són iguals.', show: 'Mateix exponent → s\'opera amb les bases' },
        { q: 'Resultat:', parts: [pw(A, n) + (div ? ' : ' : ' · ') + pw(a2, n) + ' = ', { ans: div ? a1 : A * a2, w: 3 }, '<sup>', { ans: n, w: 2 }, '</sup>'],
          hint: div ? A + ' : ' + a2 + ' = ?' : A + ' · ' + a2 + ' = ?', show: '= ' + pw(div ? a1 : A * a2, n) }
      ];
    } else {
      var rr = r.int(2, p + q - 1);
      ctx = 'Simplifica com una sola potència:<div class="big">' + frac(pw(b, p) + ' · ' + pw(b, q), pw(b, rr)) + '</div>';
      steps = [
        { q: 'Primer el numerador:', parts: [pw(b, p) + ' · ' + pw(b, q) + ' = ' + b + '<sup>', { ans: p + q, w: 3 }, '</sup>'], hint: 'Producte de la mateixa base: se sumen els exponents.', show: 'Numerador: ' + pw(b, p + q) },
        { q: 'Ara divideix:', parts: [pw(b, p + q) + ' : ' + pw(b, rr) + ' = ' + b + '<sup>', { ans: p + q - rr, w: 3 }, '</sup>'], hint: 'Quocient de la mateixa base: es resten els exponents.', show: 'Resultat: ' + pw(b, p + q - rr) }
      ];
    }
    return { title: 'Memòria del joc', ctx: ctx, steps: steps };
  }

  // ---------- M1.3 Caça de bugs (potències) ----------
  function genBugsPot(r, i, used) {
    var tipus = ['prodMult', 'potSuma', 'zero', 'negatiu', 'signe', 'suma', 'okProd', 'okQuoc'];
    var pool = tipus.filter(function (t) { return used.indexOf(t) < 0; });
    var t = r.pick(pool); used.push(t);
    var b = r.int(2, 5), p = r.int(2, 5), q = r.int(2, 4), escrit, corr, parts, show, bug = true, tipusErr;
    switch (t) {
      case 'prodMult': escrit = pw(b, p) + ' · ' + pw(b, q) + ' = ' + pw(b, p * q); corr = pw(b, p + q);
        parts = [pw(b, p) + ' · ' + pw(b, q) + ' = ' + b + '<sup>', { ans: p + q, w: 3 }, '</sup>']; tipusErr = 'Ha multiplicat els exponents; en un producte de la mateixa base se sumen.'; break;
      case 'potSuma': escrit = '(' + pw(b, p) + ')<sup>' + q + '</sup> = ' + pw(b, p + q); corr = pw(b, p * q);
        parts = ['(' + pw(b, p) + ')<sup>' + q + '</sup> = ' + b + '<sup>', { ans: p * q, w: 3 }, '</sup>']; tipusErr = 'Ha sumat els exponents; en una potència d\'una potència es multipliquen.'; break;
      case 'zero': escrit = pw(b + 3, 0) + ' = 0'; corr = '1';
        parts = [pw(b + 3, 0) + ' = ', { ans: 1, w: 3 }]; tipusErr = 'Qualsevol nombre diferent de 0 elevat a 0 val 1.'; break;
      case 'negatiu': escrit = pw(b, -q) + ' = −' + fmt(Math.pow(b, q)); corr = frac(1, Math.pow(b, q));
        parts = [pw(b, -q) + ' = 1 / ', { ans: Math.pow(b, q), w: 4 }]; tipusErr = 'L\'exponent negatiu no fa negatiu el resultat: indica l\'invers.'; break;
      case 'signe': var e = 2 * r.int(1, 2); escrit = pw('−' + b, e) + ' = −' + fmt(Math.pow(b, e)); corr = fmt(Math.pow(b, e));
        parts = [pw('−' + b, e) + ' = ', { ans: Math.pow(b, e), w: 4 }]; tipusErr = 'Base negativa amb exponent parell → resultat positiu.'; break;
      case 'suma': b = 2; escrit = pw(2, p) + ' + ' + pw(2, p) + ' = ' + pw(2, 2 * p); corr = fmt(Math.pow(2, p + 1)) + ' = ' + pw(2, p + 1);
        parts = [pw(2, p) + ' + ' + pw(2, p) + ' = ', { ans: Math.pow(2, p + 1), w: 5 }]; tipusErr = 'Les propietats són per a productes i quocients, no per a sumes. Cal calcular cada potència i sumar.'; break;
      case 'okProd': bug = false; escrit = pw(b, p) + ' · ' + pw(b, q) + ' = ' + pw(b, p + q); corr = pw(b, p + q);
        parts = ['Valor de ' + pw(b, p + q) + ' = ', { ans: Math.pow(b, p + q), w: 7 }]; tipusErr = 'És correcte: se sumen els exponents.'; break;
      case 'okQuoc': bug = false; var P = p + q; escrit = pw(b, P) + ' : ' + pw(b, q) + ' = ' + pw(b, p); corr = pw(b, p);
        parts = ['Valor de ' + pw(b, p) + ' = ', { ans: Math.pow(b, p), w: 6 }]; tipusErr = 'És correcte: es resten els exponents.'; break;
    }
    return {
      title: 'Full de bugs',
      ctx: 'Línia de codi del càlcul de memòria:<div class="big quote">' + escrit + '</div>',
      steps: [
        { q: 'Aquest càlcul té un bug?', choices: ['Sí, hi ha bug', 'No, és correcte'], ans: bug ? 0 : 1,
          hint: 'Revisa la propietat que s\'hauria d\'aplicar (consulta el recuadre de teoria).', show: (bug ? 'Bug detectat: ' : 'Correcte. ') + tipusErr },
        { q: bug ? 'Corregeix-lo: escriu el resultat correcte.' : 'Comprova-ho calculant el valor.', parts: parts,
          hint: bug ? tipusErr : 'Fes servir la calculadora.', show: 'Resultat correcte: ' + corr }
      ]
    };
  }

  // ---------- M1.4 Xifres del joc (notació científica) ----------
  function genNC(r, i) {
    var kind = ['gran', 'petit', 'aDecimal', 'calc', 'compara'][i % 5];
    var a, e, x;
    if (kind === 'gran' || kind === 'petit') {
      a = U.clean(r.int(11, 99) / 10); if (r.bool()) a = r.int(2, 9);
      e = kind === 'gran' ? r.int(4, 11) : -r.int(3, 7);
      x = U.clean(a * Math.pow(10, e));
      var ctxs = kind === 'gran'
        ? ['Bytes que ocupa el joc complet', 'Jugadors registrats al joc', 'Punts del rècord mundial']
        : ['Segons que tarda un càlcul del processador', 'Metres que mesura un píxel', 'Segons d\'un tic del rellotge intern'];
      var nom = r.pick(ctxs);
      var llocs = Math.abs(e);
      return {
        title: 'Xifres del joc',
        ctx: nom + ':<div class="big">' + fmt(x) + '</div>Passa-ho a notació científica: <b>a · 10<sup>n</sup></b>, amb 1 ≤ a < 10.',
        steps: [
          { q: 'Per deixar una sola xifra (no nul·la) davant la coma, cap a on i quants llocs es mou la coma?',
            parts: [{ sel: ['esquerra', 'dreta'], ans: kind === 'gran' ? 'esquerra' : 'dreta' }, ' ', { ans: llocs, w: 3 }, ' llocs'],
            hint: kind === 'gran' ? 'Compta les xifres que queden darrere la primera.' : 'Compta quants llocs cal avançar fins passar la primera xifra que no és 0.',
            show: 'La coma es mou ' + llocs + ' llocs cap a ' + (kind === 'gran' ? 'l\'esquerra → exponent positiu' : 'la dreta → exponent negatiu') },
          { q: 'Escriu el nombre en notació científica.', parts: [{ ans: a, w: 5 }, ' · 10<sup>', { ans: e, w: 3 }, '</sup>'],
            hint: 'Coma cap a l\'esquerra → exponent positiu. Coma cap a la dreta → exponent negatiu.', show: fmt(x) + ' = ' + sci(a, e) }
        ]
      };
    }
    if (kind === 'aDecimal') {
      a = U.clean(r.int(11, 99) / 10); e = r.bool() ? -r.int(2, 5) : r.int(3, 6); x = U.clean(a * Math.pow(10, e));
      return {
        title: 'De la pantalla al codi',
        ctx: 'Al GDD hi ha aquesta dada:<div class="big">' + sci(a, e) + '</div>',
        steps: [
          { q: 'L\'exponent és ' + (e > 0 ? 'positiu' : 'negatiu') + '. El nombre és…', choices: ['Més gran que 10', 'Entre 0 i 1'], ans: e > 0 ? 0 : 1,
            hint: 'Exponent positiu → nombre gran. Exponent negatiu → nombre petit (entre 0 i 1).', show: e > 0 ? 'Nombre gran' : 'Nombre petit (entre 0 i 1)' },
          { q: 'Escriu-lo en forma decimal (sense potències).', parts: [sci(a, e) + ' = ', { ans: x, w: 10 }],
            hint: 'Mou la coma ' + Math.abs(e) + ' llocs cap a ' + (e > 0 ? 'la dreta' : 'l\'esquerra') + ' i omple amb zeros.', show: sci(a, e) + ' = ' + fmt(x) }
        ]
      };
    }
    if (kind === 'calc') {
      a = U.clean(r.int(11, 99) / 10); e = r.bool() ? -r.int(3, 9) : r.int(7, 15);
      var pant = String(a).replace(',', '.') + 'E' + e;
      return {
        title: 'La «E» de la calculadora',
        ctx: 'La calculadora (i els llenguatges de programació) mostra aquest resultat:<div class="big mono">' + pant + '</div>',
        steps: [
          { q: 'Què vol dir? Escriu-lo en notació científica.', parts: [{ ans: a, w: 5 }, ' · 10<sup>', { ans: e, w: 3 }, '</sup>'],
            hint: 'La «E» vol dir «· 10 elevat a».', show: pant + ' = ' + sci(a, e) },
          { q: 'Quantes xifres té la part entera si es pot escriure sense potències? (si és entre 0 i 1, respon 0 = la part entera és 0)', parts: [{ ans: e > 0 ? e + 1 : 0, w: 3 }],
            hint: 'Amb exponent positiu n, el nombre té n + 1 xifres a la part entera.', show: e > 0 ? 'És un nombre de ' + (e + 1) + ' xifres' : 'És un nombre entre 0 i 1' }
        ]
      };
    }
    var a1 = U.clean(r.int(11, 99) / 10), e1 = -r.int(2, 6), a2 = U.clean(r.int(11, 99) / 10), e2 = e1 + r.pick([-1, 1]);
    var v1 = a1 * Math.pow(10, e1), v2 = a2 * Math.pow(10, e2);
    return {
      title: 'Quin és més ràpid?',
      ctx: 'Dues funcions del joc tarden aquests temps (en segons):<div class="big">A: ' + sci(a1, e1) + ' · B: ' + sci(a2, e2) + '</div>',
      steps: [
        { q: 'Per comparar, primer mira els exponents. Quin té l\'exponent més gran?', choices: ['A', 'B'], ans: e1 > e2 ? 0 : 1,
          hint: 'Compte amb els negatius: −3 és més gran que −4.', show: 'Exponent més gran: ' + (e1 > e2 ? 'A (' + fmt(e1) + ')' : 'B (' + fmt(e2) + ')') },
        { q: 'Quina funció és més ràpida (tarda menys)?', choices: ['A', 'B'], ans: v1 < v2 ? 0 : 1,
          hint: 'Més exponent → nombre més gran → tarda més.', show: 'Més ràpida: <b>' + (v1 < v2 ? 'A' : 'B') + '</b> (' + fmt(Math.min(v1, v2)) + ' s)' }
      ]
    };
  }

  // ---------- M1.5 El servidor (operacions en notació científica) ----------
  function genServidor(r, i) {
    var kind = ['prod', 'quoc', 'problema'][i % 3];
    if (kind === 'prod') {
      var a = r.int(2, 9), b = U.clean(r.int(11, 49) / 10), m = r.int(2, 8), n = r.int(-6, 6);
      var pa = U.clean(a * b), ex = m + n, norm = pa >= 10, A = norm ? U.clean(pa / 10) : pa, E = norm ? ex + 1 : ex;
      return {
        title: 'Dades del servidor',
        ctx: 'Calcula:<div class="big">(' + sci(a, m) + ') · (' + sci(b, n) + ')</div>',
        steps: [
          { q: 'Multiplica els nombres de davant.', parts: [a + ' · ' + fmt(b) + ' = ', { ans: pa, w: 6 }], hint: 'Fes-ho amb la calculadora.', show: a + ' · ' + fmt(b) + ' = ' + fmt(pa) },
          { q: 'Multiplica les potències de 10.', parts: ['10<sup>' + fmt(m) + '</sup> · 10<sup>' + fmt(n) + '</sup> = 10<sup>', { ans: ex, w: 3 }, '</sup>'],
            hint: 'Producte de la mateixa base: se sumen els exponents.', show: '10<sup>' + fmt(m) + '</sup> · 10<sup>' + fmt(n) + '</sup> = 10<sup>' + fmt(ex) + '</sup>' },
          { q: 'Escriu el resultat en notació científica correcta (1 ≤ a < 10).', parts: [{ ans: A, w: 5 }, ' · 10<sup>', { ans: E, w: 3 }, '</sup>'],
            hint: norm ? fmt(pa) + ' és més gran que 10: escriu-lo com ' + fmt(A) + ' · 10 i suma 1 a l\'exponent.' : 'Ja està bé: ' + fmt(pa) + ' és entre 1 i 10.',
            show: '= ' + sci(pa, ex) + (norm ? ' = ' + sci(A, E) : '') }
        ]
      };
    }
    if (kind === 'quoc') {
      var q = r.int(2, 9), d = r.int(2, 4), num = q * d, mm = r.int(4, 12), nn = r.int(1, 5);
      return {
        title: 'Repartir la càrrega',
        ctx: 'Calcula:<div class="big">(' + sci(num, mm) + ') : (' + sci(d, nn) + ')</div><p class="small">(El primer nombre encara no està en notació científica correcta: no passa res, opera igualment.)</p>',
        steps: [
          { q: 'Divideix els nombres de davant.', parts: [num + ' : ' + d + ' = ', { ans: q, w: 4 }], hint: 'Divisió normal.', show: num + ' : ' + d + ' = ' + q },
          { q: 'Divideix les potències de 10.', parts: ['10<sup>' + mm + '</sup> : 10<sup>' + nn + '</sup> = 10<sup>', { ans: mm - nn, w: 3 }, '</sup>'],
            hint: 'Quocient de la mateixa base: es resten els exponents.', show: '10<sup>' + (mm - nn) + '</sup>' },
          { q: 'Resultat en notació científica:', parts: [{ ans: q, w: 4 }, ' · 10<sup>', { ans: mm - nn, w: 3 }, '</sup>'], hint: 'Ajunta els dos resultats.', show: '= ' + sci(q, mm - nn) }
        ]
      };
    }
    var jug = r.int(2, 6), mida = U.clean(r.int(15, 45) / 10), min = r.pick([30, 40, 45, 60]);
    var total = jug * Math.pow(10, 5) * mida * Math.pow(10, 5) * min;
    var expT = Math.floor(Math.log10(total) + 1e-9), aT = U.clean(total / Math.pow(10, expT));
    var cap = U.clean(r.int(11, 19) / 10) * Math.pow(10, expT);
    var serv = total / cap, n2 = Math.ceil(serv - 1e-9);
    return {
      title: 'El dia del llançament',
      ctx: 'El primer dia es connecten <b>' + sci(jug, 5) + '</b> jugadors. Cada jugador envia ' + sci(mida, 5) + ' bytes per minut i juga ' + min + ' minuts. Cada servidor pot moure ' + sci(U.clean(cap / Math.pow(10, expT)), expT) + ' bytes al dia.',
      steps: [
        { q: 'Quants bytes ha de moure el servidor en total? (notació científica)', parts: [{ ans: aT, w: 6, tol: 0.006 }, ' · 10<sup>', { ans: expT, w: 3 }, '</sup> bytes'],
          hint: 'Multiplica les tres dades: jugadors · bytes per minut · minuts. Opera els nombres i les potències de 10 per separat.',
          show: 'Total = ' + sci(jug, 5) + ' · ' + sci(mida, 5) + ' · ' + min + ' = ' + sci(aT, expT) + ' bytes' },
        { q: 'Divideix entre la capacitat d\'un servidor (2 decimals).', parts: [{ ans: U.round(serv, 2), tol: 0.011, w: 6 }, ' servidors'],
          hint: 'Total : capacitat. Les potències de 10 són iguals, es simplifiquen.', show: 'Total : capacitat ≈ ' + fmt(U.round(serv, 2)) },
        { q: 'Quants servidors calen de veritat?', parts: [{ ans: n2, w: 3 }, ' servidors'],
          hint: 'No es pot comprar mig servidor, i si en compres menys no hi cap tot: cal arrodonir cap amunt.', show: 'Calen <b>' + n2 + ' servidors</b> (arrodonim cap amunt)' }
      ]
    };
  }

  // ---------- M1.6 Distància entre personatges (arrels i Pitàgores) ----------
  function genDistancia(r, i) {
    if (i === 0) {
      var cub = r.bool(), k = r.int(3, 9), v = cub ? k * k * k : k * k;
      return {
        title: 'L\'arrel, la inversa de la potència',
        ctx: cub ? 'Un bloc del joc és un cub fet amb <b>' + v + '</b> cubets iguals. Quants cubets té cada aresta?' : 'Una sala quadrada té una àrea de <b>' + v + '</b> píxels. Quant fa el costat?',
        steps: [
          { q: 'Quin nombre elevat ' + (cub ? 'al cub' : 'al quadrat') + ' dona ' + v + '?', parts: [{ ans: k, w: 3 }, '<sup>' + (cub ? 3 : 2) + '</sup> = ' + v],
            hint: 'Prova nombres: 3, 4, 5…', show: k + '<sup>' + (cub ? 3 : 2) + '</sup> = ' + v },
          { q: 'Escriu-ho com una arrel.', parts: [rad(1, v, cub ? 3 : 2) + ' = ', { ans: k, w: 3 }],
            hint: 'L\'arrel desfà la potència.', show: rad(1, v, cub ? 3 : 2) + ' = ' + k + (cub ? ' cubets' : ' px') }
        ]
      };
    }
    var tri = r.pick([[3, 4], [6, 8], [5, 12], [4, 3], [8, 6], [0, 0]]);
    var dx, dy;
    if (tri[0] === 0 || r() < 0.4) { dx = r.int(1, 7); dy = r.int(1, 7); } else { dx = tri[0]; dy = tri[1]; }
    var x1 = r.int(0, 12 - dx), y1 = r.int(0, 12 - dy);
    var H = { x: x1, y: y1, l: 'H', cls: 'hero' }, E = { x: x1 + dx, y: y1 + dy, l: 'E', cls: 'enemy' };
    if (r.bool()) { E = { x: x1, y: y1 + dy, l: 'E', cls: 'enemy' }; H = { x: x1 + dx, y: y1, l: 'H', cls: 'hero' }; }
    var s = dx * dx + dy * dy, d = Math.sqrt(s), exact = Number.isInteger(d);
    var R = exact ? r.pick([d, d - 1, d + 1]) : r.pick([Math.floor(d), Math.ceil(d)]);
    var veu = d <= R + 1e-9;
    return {
      title: 'Radi de visió',
      ctx: 'L\'heroi (H) és a (' + H.x + ', ' + H.y + ') i l\'enemic (E) a (' + E.x + ', ' + E.y + '). L\'enemic veu l\'heroi si la distància és <b>≤ ' + R + '</b> caselles.',
      fig: U.svgGrid([H, E], 12, false),
      steps: [
        { q: 'Quantes caselles hi ha en horitzontal i en vertical entre H i E?', parts: ['Horitzontal: ', { ans: dx, w: 3 }, '  Vertical: ', { ans: dy, w: 3 }],
          hint: 'Resta les coordenades x i les coordenades y (sempre en positiu).', show: 'Catets: ' + dx + ' i ' + dy },
        { q: 'Aplica Pitàgores: suma dels quadrats dels catets.', parts: [dx + '<sup>2</sup> + ' + dy + '<sup>2</sup> = ', { ans: s, w: 4 }],
          hint: 'd<sup>2</sup> = a<sup>2</sup> + b<sup>2</sup>.', show: 'd<sup>2</sup> = ' + (dx * dx) + ' + ' + (dy * dy) + ' = ' + s },
        { q: 'La distància és ' + rad(1, s) + '. És exacta o irracional?', choices: ['Exacta', 'Irracional'], ans: exact ? 0 : 1,
          hint: s + ' és un quadrat perfecte?', show: rad(1, s) + (exact ? ' és exacta' : ' és irracional (cal aproximar-la)') },
        { q: exact ? 'Quant val la distància?' : 'Aproxima la distància a les centèsimes.', parts: ['d = ', { ans: exact ? d : U.round(d, 2), tol: exact ? 0 : 0.006, w: 6 }, ' caselles'],
          hint: 'Fes l\'arrel amb la calculadora.', show: 'd = ' + rad(1, s) + (exact ? ' = ' : ' ≈ ') + fmt(U.round(d, 2)) },
        { q: 'L\'enemic veu l\'heroi? (d ≤ ' + R + ')', choices: ['Sí', 'No'], ans: veu ? 0 : 1,
          hint: 'Compara la distància amb ' + R + '. Atenció: si són iguals, ≤ vol dir que sí.', show: fmt(U.round(d, 2)) + (veu ? ' ≤ ' : ' > ') + R + ' → ' + (veu ? 'el veu!' : 'no el veu') }
      ],
      after: U.svgGrid([H, E], 12, true)
    };
  }

  // ---------- M1.7 Escalat de sprites (extreure factors) ----------
  var MSQ = [2, 3, 5, 6, 7, 10];
  function genEscalat(r, i) {
    var k, m, ctx;
    if (i === 0) {
      var c = r.pick([2, 3, 4, 5]), f = r.pick([2, 3, 5]);
      var area = c * c * f; m = f; k = c;
      ctx = 'Un sprite quadrat de ' + c + ' × ' + c + ' = ' + c * c + ' px d\'àrea es fa <b>' + f + ' vegades més gran en àrea</b> (' + area + ' px). Quant fa el costat nou?<div class="big">costat = ' + rad(1, area) + '</div>';
    } else {
      k = r.int(2, 6); m = r.pick(MSQ);
      ctx = 'Per escalar un sprite cal simplificar aquest radical:<div class="big">' + rad(1, k * k * m) + '</div>';
    }
    var n = k * k * m, F = U.factor(n);
    var e2 = F[2] || 0, e3 = F[3] || 0, e5 = F[5] || 0, e7 = F[7] || 0;
    var desc = Object.keys(F).map(function (p) { return F[p] > 1 ? pw(p, F[p]) : p; }).join(' · ');
    return {
      title: 'Escalat de sprites',
      ctx: ctx,
      steps: [
        { q: 'Descompon ' + n + ' en factors primers (escriu 0 si un primer no hi és).',
          parts: [n + ' = 2<sup>', { ans: e2, w: 2 }, '</sup> · 3<sup>', { ans: e3, w: 2 }, '</sup> · 5<sup>', { ans: e5, w: 2 }, '</sup> · 7<sup>', { ans: e7, w: 2 }, '</sup>'],
          hint: 'Divideix ' + n + ' per 2 tantes vegades com puguis, després per 3, per 5…', show: n + ' = ' + desc },
        { q: 'Els factors amb exponent 2 surten fora de l\'arrel. Simplifica.', parts: [rad(1, n) + ' = ', { ans: k, w: 3 }, '√', { ans: m, w: 3 }],
          hint: 'Agrupa els factors de dos en dos: cada parella surt fora com un sol factor. El que no fa parella es queda dins.', show: rad(1, n) + ' = ' + rad(k, m) },
        { q: 'Aproxima el resultat a les centèsimes.', parts: [rad(k, m) + ' ≈ ', { ans: U.round(k * Math.sqrt(m), 2), tol: 0.011, w: 6 }],
          hint: 'Calcula ' + k + ' · √' + m + ' amb la calculadora.', show: rad(k, m) + ' ≈ ' + fmt(U.round(k * Math.sqrt(m), 2)) + (i === 0 ? ' px' : '') }
      ]
    };
  }

  // ---------- M1.8 Camins del mapa (operacions amb radicals) ----------
  function genCamins(r, i) {
    var kind = ['semblants', 'simplificar', 'producte', 'bug', 'camins'][i % 5];
    if (kind === 'semblants') {
      var m = r.pick([2, 3, 5]), a = r.int(2, 7), b = r.int(1, 6), c = r.int(1, 4), tot = a + b - c;
      return {
        title: 'Suma de trams',
        ctx: 'El personatge recorre tres trams del mapa:<div class="big">' + rad(a, m) + ' + ' + rad(b, m) + ' − ' + rad(c, m) + '</div>',
        steps: [
          { q: 'Són radicals semblants (mateix índex i mateix radicand)?', choices: ['Sí', 'No'], ans: 0, hint: 'Mira el nombre de dins de l\'arrel.', show: 'Són semblants: tots tenen √' + m },
          { q: 'Suma els coeficients.', parts: [{ ans: tot, w: 3 }, '√', { ans: m, w: 3 }], hint: a + ' + ' + b + ' − ' + c + ' = ? i l\'arrel es manté.', show: '= ' + rad(tot, m) }
        ]
      };
    }
    if (kind === 'simplificar') {
      var mm = r.pick([2, 3]), k1 = r.int(2, 3), k2 = r.int(k1 + 1, 5);
      return {
        title: 'Trams amagats',
        ctx: 'Aquests dos trams semblen diferents… però potser no ho són:<div class="big">' + rad(1, k1 * k1 * mm) + ' + ' + rad(1, k2 * k2 * mm) + '</div>',
        steps: [
          { q: 'Simplifica el primer radical.', parts: [rad(1, k1 * k1 * mm) + ' = ', { ans: k1, w: 3 }, '√', { ans: mm, w: 3 }], hint: 'Busca un quadrat perfecte dins de ' + (k1 * k1 * mm) + '.', show: rad(1, k1 * k1 * mm) + ' = ' + rad(k1, mm) },
          { q: 'Simplifica el segon radical.', parts: [rad(1, k2 * k2 * mm) + ' = ', { ans: k2, w: 3 }, '√', { ans: mm, w: 3 }], hint: 'Busca un quadrat perfecte dins de ' + (k2 * k2 * mm) + '.', show: rad(1, k2 * k2 * mm) + ' = ' + rad(k2, mm) },
          { q: 'Ara són semblants. Suma.', parts: [{ ans: k1 + k2, w: 3 }, '√', { ans: mm, w: 3 }], hint: k1 + ' + ' + k2 + ' = ?', show: rad(k1, mm) + ' + ' + rad(k2, mm) + ' = ' + rad(k1 + k2, mm) }
        ]
      };
    }
    if (kind === 'producte') {
      var pairs = [[2, 8, 4, 1], [3, 12, 6, 1], [2, 18, 6, 1], [2, 6, 2, 3], [3, 6, 3, 2], [5, 10, 5, 2], [2, 10, 2, 5], [3, 15, 3, 5]];
      var p = r.pick(pairs), prod = p[0] * p[1];
      var simp = p[3] === 1 ? 'Arrel exacta: ' + rad(1, prod) + ' = ' + p[2] : rad(1, prod) + ' = ' + rad(p[2], p[3]);
      var last = p[3] === 1
        ? { q: 'Calcula l\'arrel.', parts: [rad(1, prod) + ' = ', { ans: p[2], w: 3 }], hint: 'És un quadrat perfecte.', show: simp }
        : { q: 'Simplifica el radical.', parts: [rad(1, prod) + ' = ', { ans: p[2], w: 3 }, '√', { ans: p[3], w: 3 }], hint: 'Busca un quadrat perfecte dins de ' + prod + '.', show: simp };
      return {
        title: 'Àrea d\'una sala',
        ctx: 'Una sala rectangular del mapa fa ' + rad(1, p[0]) + ' × ' + rad(1, p[1]) + ' caselles. Quina àrea té?',
        steps: [
          { q: 'Multiplica els radicals (mateix índex).', parts: [rad(1, p[0]) + ' · ' + rad(1, p[1]) + ' = √', { ans: prod, w: 4 }], hint: '√a · √b = √(a · b).', show: rad(1, p[0]) + ' · ' + rad(1, p[1]) + ' = ' + rad(1, prod) },
          last
        ]
      };
    }
    if (kind === 'bug') {
      var a1 = r.pick([2, 3, 5]), a2 = r.pick([6, 7, 10]), s = U.clean(U.round(Math.sqrt(a1) + Math.sqrt(a2), 2));
      return {
        title: 'Bug d\'entrada',
        ctx: 'Un company ha programat:<div class="big quote">' + rad(1, a1) + ' + ' + rad(1, a2) + ' = ' + rad(1, a1 + a2) + '</div>',
        steps: [
          { q: 'És correcte?', choices: ['Sí', 'No, és un bug'], ans: 1, hint: 'Comprova-ho amb la calculadora: calcula els dos costats.', show: 'Bug: l\'arrel d\'una suma <b>no</b> és la suma de les arrels' },
          { q: 'Calcula el valor correcte (aproximat a les centèsimes).', parts: [rad(1, a1) + ' + ' + rad(1, a2) + ' ≈ ', { ans: s, tol: 0.011, w: 6 }],
            hint: 'Calcula cada arrel per separat i suma.', show: rad(1, a1) + ' + ' + rad(1, a2) + ' ≈ ' + fmt(s) + ' (i ' + rad(1, a1 + a2) + ' ≈ ' + fmt(U.round(Math.sqrt(a1 + a2), 2)) + ')' }
        ]
      };
    }
    var d1 = r.int(2, 4), d2 = r.int(2, 5), D = d1 + d2, L = r.pick([D + 2, D + 3, D + 4]), diag = D * Math.SQRT2;
    return {
      title: 'El camí més curt',
      ctx: 'Camí A: el personatge travessa <b>' + d1 + '</b> caselles en diagonal i després <b>' + d2 + '</b> més en diagonal (cada diagonal mesura √2). Camí B: va en línia recta <b>' + L + '</b> caselles.',
      steps: [
        { q: 'Escriu la longitud del camí A en forma radical.', parts: [rad(d1, 2) + ' + ' + rad(d2, 2) + ' = ', { ans: D, w: 3 }, '√', { ans: 2, w: 3 }], hint: 'Són radicals semblants: suma els coeficients.', show: 'Camí A = ' + rad(D, 2) },
        { q: 'Aproxima el camí A a les centèsimes.', parts: [rad(D, 2) + ' ≈ ', { ans: U.round(diag, 2), tol: 0.011, w: 6 }], hint: D + ' · 1,414…', show: 'Camí A ≈ ' + fmt(U.round(diag, 2)) },
        { q: 'Quin camí és més curt?', choices: ['Camí A', 'Camí B'], ans: diag < L ? 0 : 1, hint: 'Compara ' + fmt(U.round(diag, 2)) + ' amb ' + L + '.', show: 'Més curt: <b>' + (diag < L ? 'A' : 'B') + '</b>' }
      ]
    };
  }

  CGS.NIVELLS = CGS.NIVELLS || [];
  CGS.NIVELLS.push({
    id: 'N1', nom: 'Nivell 1 · Memòria i píxels', sub: 'Unitat 2 · Potències, notació científica i radicals',
    missions: [
      { id: 'N1M1', fase: 1, titol: 'Quants colors?', sabers: 'Potències, bits, exponent 0 i negatiu', n: 4, gen: genColors,
        teoria: 'a<sup>n</sup> = a · a · … · a (n vegades): <b>a</b> és la base i <b>n</b> l\'exponent.<br>a<sup>0</sup> = 1 · a<sup>−n</sup> = 1 / a<sup>n</sup> · Base negativa: exponent parell → +, senar → −.<br>1 byte = 8 bits = 2<sup>8</sup> = 256 valors.' },
      { id: 'N1M2', fase: 2, titol: 'Quant ocupa?', sabers: 'Propietats de les potències', n: 5, gen: genPropietats,
        teoria: 'a<sup>m</sup> · a<sup>n</sup> = a<sup>m+n</sup> · a<sup>m</sup> : a<sup>n</sup> = a<sup>m−n</sup> · (a<sup>m</sup>)<sup>n</sup> = a<sup>m·n</sup><br>a<sup>n</sup> · b<sup>n</sup> = (a · b)<sup>n</sup> · a<sup>n</sup> : b<sup>n</sup> = (a : b)<sup>n</sup>' },
      { id: 'N1M3', fase: 3, titol: 'Caça de bugs', sabers: 'Errors típics amb potències', n: 5, gen: genBugsPot,
        teoria: 'Bugs freqüents: multiplicar exponents en un producte (se sumen!), pensar que a<sup>0</sup> = 0 (val 1), pensar que a<sup>−n</sup> és negatiu (és 1/a<sup>n</sup>), aplicar propietats a les <b>sumes</b> (no es pot!).' },
      { id: 'N1M4', fase: 4, titol: 'Xifres del joc', sabers: 'Notació científica: escriure, llegir, calculadora i comparar', n: 5, gen: genNC,
        teoria: 'Notació científica: <b>a · 10<sup>n</sup></b> amb 1 ≤ a < 10.<br>Nombres grans → n positiu (50.000.000.000 = 5 · 10<sup>10</sup>). Nombres petits → n negatiu (0,00028 = 2,8 · 10<sup>−4</sup>).<br>Calculadora: <code>1.5E-3</code> = 1,5 · 10<sup>−3</sup>.' },
      { id: 'N1M5', fase: 5, titol: 'El servidor', sabers: 'Operacions en notació científica', n: 3, gen: genServidor,
        teoria: 'Producte: es multipliquen els nombres i se <b>sumen</b> els exponents. Quocient: es divideixen els nombres i es <b>resten</b> els exponents.<br>Si el nombre de davant surt ≥ 10, es corregeix: 12 · 10<sup>5</sup> = 1,2 · 10<sup>6</sup>.' },
      { id: 'N1M6', fase: 6, titol: 'Distància entre personatges', sabers: 'Arrels i teorema de Pitàgores', n: 4, gen: genDistancia,
        teoria: 'L\'arrel és l\'operació inversa de la potència: √49 = 7 perquè 7<sup>2</sup> = 49; ∛125 = 5 perquè 5<sup>3</sup> = 125.<br>Pitàgores: d<sup>2</sup> = a<sup>2</sup> + b<sup>2</sup> → d = √(a<sup>2</sup> + b<sup>2</sup>). Si no és un quadrat perfecte, la distància és irracional.' },
      { id: 'N1M7', fase: 7, titol: 'Escalat de sprites', sabers: 'Elements d\'un radical i extreure factors', n: 4, gen: genEscalat,
        teoria: 'En <sup>n</sup>√a, <b>n</b> és l\'índex i <b>a</b> el radicand.<br>Extreure factors: es descompon el radicand; cada parella de factors iguals surt fora com un de sol: √72 = √(2<sup>3</sup> · 3<sup>2</sup>) = 2 · 3 · √2 = 6√2.' },
      { id: 'N1M8', fase: 8, titol: 'Camins del mapa', sabers: 'Operacions amb radicals', n: 5, gen: genCamins,
        teoria: '√a · √b = √(a · b).<br>Només es poden sumar radicals <b>semblants</b> (mateix índex i radicand): 3√2 + 5√2 = 8√2.<br>Compte: √2 + √3 ≠ √5.' },
      { id: 'N1B', fase: 9, boss: true, titol: 'BOSS del Nivell 1', sabers: 'Entrenament del boss: un exercici de cada fase, sense pistes', n: 8,
        gen: function (r, i, used) {
          var g = [genColors, genPropietats, genBugsPot, genNC, genServidor, genDistancia, genEscalat, genCamins][i];
          var idx = [r.int(0, 3), r.int(0, 4), 0, r.int(0, 4), r.int(0, 2), r.int(1, 3), r.int(1, 3), r.int(0, 4)][i];
          return g(r, idx, used);
        },
        teoria: 'Al boss no hi ha pistes. Pots fer servir el formulari i la calculadora, però primer escriu el procediment.' }
    ]
  });
})(CGS);
