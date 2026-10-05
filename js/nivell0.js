/* NIVELL 0 · Tutorial — Unitat 1: els nombres reals */
(function (U) {
  var SETS = ['ℕ naturals', 'ℤ enters', 'ℚ racionals', 'I irracionals', 'ℝ reals'];
  var setsFor = function (v, irr) {
    if (irr) return [3, 4];
    if (Number.isInteger(v)) return v >= 0 ? [0, 1, 2, 4] : [1, 2, 4];
    return [2, 4];
  };
  var RI = ['Racional', 'Irracional'];

  // ---------- M0.1 Tria el teu personatge (classificació) ----------
  function genClassifica(r) {
    var tipus = r.pick(['nat', 'neg', 'frac', 'fracInt', 'arrelExacta', 'arrelNo', 'periodic', 'pi', 'menysArrel']);
    var show, val = null, irr = false, calcula = false, nota = '';
    switch (tipus) {
      case 'nat': val = r.int(2, 40); show = String(val); break;
      case 'neg': val = -r.int(1, 30); show = U.fmt(val); break;
      case 'frac':
        var b = r.pick([3, 4, 5, 7, 8, 9]), a = r.int(1, 3 * b);
        while (U.gcd(a, b) !== 1) a++;
        val = a / b; show = (r.bool() ? '' : '−') + U.frac(a, b);
        if (show[0] === '−') val = -val; break;
      case 'fracInt':
        var q = r.int(2, 9), d = r.pick([2, 3, 4, 6]); val = q * (r.bool() ? 1 : -1);
        show = (val < 0 ? '−' : '') + U.frac(q * d, d); calcula = true; break;
      case 'arrelExacta': var k = r.int(2, 12); val = k; show = U.rad(1, k * k); calcula = true; break;
      case 'menysArrel': var k2 = r.int(2, 10); val = -k2; show = '−' + U.rad(1, k2 * k2); calcula = true; break;
      case 'arrelNo':
        var m = r.pick([2, 3, 5, 6, 7, 8, 10, 11, 12, 13, 15]); irr = true; show = U.rad(1, m);
        nota = U.rad(1, m) + ' ≈ ' + U.fmt(Math.sqrt(m), 6) + '… (infinites xifres sense període)'; break;
      case 'periodic':
        var e = r.int(0, 9), p = r.int(1, 9); val = e + p / 9; show = e + ',' + p + p + p + p + '…';
        nota = 'Decimal periòdic → es pot escriure com a fracció'; break;
      case 'pi': irr = true; show = r.pick(['π', '1,010010001…', '0,123456789101112…']);
        nota = 'Infinites xifres decimals sense període'; break;
    }
    var steps = [];
    if (calcula) steps.push({
      q: 'Primer calcula: quant val ' + show + '?',
      parts: [show + ' = ', { ans: val, w: 5 }],
      hint: tipus === 'fracInt' ? 'Fes la divisió: numerador ÷ denominador.' : 'Busca el nombre que, multiplicat per ell mateix, dona el radicand.',
      show: show + ' = ' + U.fmt(val)
    });
    steps.push({
      q: 'El nombre ' + show + ' és racional o irracional?',
      choices: RI, ans: irr ? 1 : 0,
      hint: 'Racional = es pot escriure com una fracció (decimal exacte o periòdic). Irracional = infinites xifres decimals <b>sense</b> període.',
      show: show + ' és <b>' + (irr ? 'irracional' : 'racional') + '</b>' + (nota ? ' · ' + nota : '')
    });
    var corr = setsFor(val, irr);
    steps.push({
      q: 'Marca <b>tots</b> els conjunts als quals pertany ' + show + '.',
      multi: SETS, ans: corr,
      hint: 'Recorda les nines russes: ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ, i I ⊂ ℝ. Un nombre racional no pot ser irracional.',
      show: show + ' ∈ ' + corr.map(function (i) { return SETS[i].split(' ')[0]; }).join(', ')
    });
    return {
      title: 'Fitxa de personatge',
      ctx: 'Cada personatge del joc té un nombre secret. Per crear-lo, el programa ha de saber de quin <b>tipus</b> és.<div class="big">' + show + '</div>',
      steps: steps
    };
  }

  // ---------- M0.2 Els cofres del tresor (tipus de decimals) ----------
  var TIPUS = ['Decimal exacte', 'Periòdic pur', 'Periòdic mixt', 'Il·limitat no periòdic'];
  function genDecimals(r, i) {
    var tipus = ['exacte', 'pur', 'mixt', 'irr'][i % 4];
    if (r() < 0.3) tipus = r.pick(['exacte', 'pur', 'mixt', 'irr']);
    var a, b, info, show, steps = [];
    if (tipus === 'irr') {
      var m = r.pick([2, 3, 5, 7, 11]);
      show = U.rad(1, m);
      steps.push({
        q: 'Calcula ' + show + ' amb la calculadora. Quin tipus de decimal és?', choices: TIPUS, ans: 3,
        hint: 'Mira si les xifres decimals s\'acaben o si es repeteix sempre el mateix bloc.',
        show: show + ' = ' + U.fmt(Math.sqrt(m), 8) + '… → il·limitat no periòdic'
      });
      steps.push({
        q: 'Arrodoneix ' + show + ' a les centèsimes.', parts: [show + ' ≈ ', { ans: U.round(Math.sqrt(m), 2), w: 6 }],
        hint: 'Mira la tercera xifra decimal: si és 5 o més, la segona puja 1.',
        show: show + ' ≈ ' + U.fmt(U.round(Math.sqrt(m), 2))
      });
      steps.push({ q: 'Aleshores, el nombre ' + show + ' és…', choices: RI, ans: 1,
        hint: 'Els decimals il·limitats no periòdics no es poden escriure com a fracció.',
        show: 'No es pot escriure com a fracció → <b>irracional</b>' });
    } else {
      do {
        if (tipus === 'exacte') b = r.pick([4, 5, 8, 20, 25, 40]);
        else if (tipus === 'pur') b = r.pick([3, 9, 11, 33, 27]);
        else b = r.pick([6, 12, 15, 30, 45, 18]);
        a = r.int(1, 3 * b);
      } while (U.gcd(a, b) !== 1);
      info = U.decimalInfo(a, b);
      show = U.frac(a, b);
      var tIdx = tipus === 'exacte' ? 0 : tipus === 'pur' ? 1 : 2;
      var dec = info.ent + ',' + info.ante + (info.per ? '<span class="per">' + info.per + '</span>' : '');
      steps.push({
        q: 'Fes la divisió ' + a + ' : ' + b + ' amb la calculadora. Quin tipus de decimal obtens?', choices: TIPUS, ans: tIdx,
        hint: 'Exacte: s\'acaba. Periòdic pur: el bloc que es repeteix comença just després de la coma. Mixt: abans del bloc hi ha alguna xifra que no es repeteix (anteperíode).',
        show: show + ' = ' + dec + (info.per ? '…' : '') + ' → ' + TIPUS[tIdx].toLowerCase()
      });
      if (tipus === 'exacte') {
        steps.push({ q: 'Escriu el decimal.', parts: [show + ' = ', { ans: a / b, w: 7 }],
          hint: 'Divideix ' + a + ' entre ' + b + '.', show: show + ' = ' + U.fmt(a / b) });
      } else {
        var parts = ['Part entera: ', { ans: info.ent, w: 3 }];
        if (tipus === 'mixt') parts.push('  Anteperíode: ', { ans: info.ante, text: true, w: 3 });
        parts.push('  Període: ', { ans: info.per, text: true, w: 3 });
        steps.push({ q: 'Identifica les parts del decimal ' + show + '.', parts: parts,
          hint: 'El període és el bloc de xifres que es repeteix sempre. L\'anteperíode són les xifres decimals que hi ha abans del període.',
          show: 'Part entera ' + info.ent + (info.ante ? ' · anteperíode ' + info.ante : '') + ' · període ' + info.per });
      }
      steps.push({ q: 'Aleshores, el nombre ' + show + ' és…', choices: RI, ans: 0,
        hint: 'Fixa\'t com està escrit el nombre: és una fracció!',
        show: 'És una fracció → <b>racional</b> (els decimals exactes i periòdics són racionals)' });
    }
    return {
      title: 'Cofre del tresor',
      ctx: 'Cada cofre amaga un nombre. El codi del cofre depèn del <b>tipus de decimal</b>.<div class="big">' + show + '</div>',
      steps: steps
    };
  }

  // ---------- M0.3 Les regles del joc (intervals) ----------
  var BR_L = ['(', '['], BR_R = [')', ']'];
  function genIntervals(r, i) {
    var a = r.int(-8, 4), b = a + r.int(2, 8), li = r.bool(), ri = r.bool(), forma, text;
    var kind = r.pick(['ineq', 'paraules', 'obertA', 'obertB']);
    if (i === 0) kind = 'ineq';
    if (kind === 'obertA') { b = Infinity; ri = false; }
    if (kind === 'obertB') { a = -Infinity; li = false; }
    var x = 'x';
    var opL = li ? '≤' : '<', opR = ri ? '≤' : '<';
    if (kind === 'ineq') {
      text = 'Un salt només funciona si l\'energia <i>x</i> compleix: <div class="big">' + U.fmt(a) + ' ' + opL + ' ' + x + ' ' + opR + ' ' + U.fmt(b) + '</div>';
    } else if (kind === 'paraules') {
      var desc = li && ri ? 'entre ' + U.fmt(a) + ' i ' + U.fmt(b) + ', tots dos inclosos' :
        (!li && !ri ? 'entre ' + U.fmt(a) + ' i ' + U.fmt(b) + ', sense incloure cap dels dos' :
          (li ? 'com a mínim ' + U.fmt(a) + ' i menys de ' + U.fmt(b) : 'més gran que ' + U.fmt(a) + ' i com a màxim ' + U.fmt(b)));
      text = 'Regla del joc: per entrar a la sala secreta la temperatura ha de ser <b>' + desc + '</b> graus.';
    } else if (kind === 'obertA') {
      text = 'Regla del joc: per obrir la porta calen ' + (li ? '<b>com a mínim ' + U.fmt(a) + '</b>' : '<b>més de ' + U.fmt(a) + '</b>') + ' punts.';
    } else {
      text = 'Regla del joc: l\'enemic t\'ataca si estàs a una altura ' + (ri ? '<b>com a màxim de ' + U.fmt(b) + '</b>' : '<b>per sota de ' + U.fmt(b) + '</b>') + ' metres.';
    }
    var v = r.pick([a, b, r.int(isFinite(a) ? a - 2 : b - 6, isFinite(b) ? b + 2 : a + 6)].filter(isFinite));
    var dins = (v > a || (v === a && li)) && (v < b || (v === b && ri));
    var interval = BR_L[li ? 1 : 0] + U.fmt(a) + ', ' + U.fmt(b) + BR_R[ri ? 1 : 0];
    return {
      title: 'Regla del joc',
      ctx: text + '<p class="small">Per escriure ∞ fes servir els botons o escriu <code>inf</code>.</p>',
      steps: [
        { q: 'Quins són els <b>extrems</b> de l\'interval? (esquerre, dret)',
          parts: ['Extrem esquerre: ', { ans: a, w: 5, inf: true }, '  Extrem dret: ', { ans: b, w: 5, inf: true }],
          hint: 'Si no hi ha límit per baix, l\'extrem esquerre és −∞; si no n\'hi ha per dalt, el dret és +∞.',
          show: 'Extrems: ' + U.fmt(a) + ' i ' + U.fmt(b) },
        { q: 'Cada extrem, està <b>inclòs</b>? Tria el claudàtor o el parèntesi.',
          parts: [{ sel: ['(', '['], ans: BR_L[li ? 1 : 0] }, U.fmt(a) + ', ' + U.fmt(b), { sel: [')', ']'], ans: BR_R[ri ? 1 : 0] }],
          hint: 'Inclòs (≤, ≥, «com a mínim», «com a màxim», «inclosos») → claudàtor [ ]. No inclòs (<, >, «més de», «menys de») → parèntesi ( ). L\'infinit sempre amb parèntesi.',
          show: 'Interval: <b>' + interval + '</b>' },
        { q: 'El valor <b>' + U.fmt(v) + '</b> compleix la regla? (pertany a ' + interval + '?)', choices: ['Sí', 'No'], ans: dins ? 0 : 1,
          hint: 'Situa ' + U.fmt(v) + ' a la recta. Si coincideix amb un extrem, mira si aquell extrem està inclòs.',
          show: U.fmt(v) + (dins ? ' ∈ ' : ' ∉ ') + interval }
      ],
      after: U.svgInterval(a, b, li, ri)
    };
  }

  // ---------- M0.4 La pista de curses (aproximacions) ----------
  function genAprox(r, i) {
    if (i === 3) { // història de π
      var ap = r.shuffle([{ n: 'Babilònia', v: 3.125, s: '3,125' }, { n: 'Egipte', v: 256 / 81, s: U.frac(256, 81) },
        { n: 'Arquimedes', v: 22 / 7, s: U.frac(22, 7) }]).slice(0, 2);
      var e1 = Math.abs(Math.PI - ap[0].v), e2 = Math.abs(Math.PI - ap[1].v);
      return {
        title: 'Rècord de π',
        ctx: 'Per programar un nivell circular necessitem π ≈ 3,14159265… Dues civilitzacions antigues van fer servir aquestes aproximacions:<div class="big">' + ap[0].n + ': ' + ap[0].s + ' · ' + ap[1].n + ': ' + ap[1].s + '</div>',
        steps: [
          { q: 'Error absolut de l\'aproximació de ' + ap[0].n + ' (arrodoneix a les mil·lèsimes).', parts: ['|π − aprox.| ≈ ', { ans: U.round(e1, 3), tol: 0.0011, w: 6 }],
            hint: 'Error absolut = |valor real − aproximació|. Fes la resta amb la calculadora (tecla π) i treu el signe.', show: 'Error ' + ap[0].n + ' ≈ ' + U.fmt(U.round(e1, 3)) },
          { q: 'Error absolut de l\'aproximació de ' + ap[1].n + ' (arrodoneix a les mil·lèsimes).', parts: ['|π − aprox.| ≈ ', { ans: U.round(e2, 3), tol: 0.0011, w: 6 }],
            hint: 'Igual que abans, amb l\'altra aproximació.', show: 'Error ' + ap[1].n + ' ≈ ' + U.fmt(U.round(e2, 3)) },
          { q: 'Quina aproximació és millor?', choices: [ap[0].n, ap[1].n], ans: e1 < e2 ? 0 : 1,
            hint: 'La millor és la que comet <b>menys</b> error.', show: 'Millor: <b>' + (e1 < e2 ? ap[0].n : ap[1].n) + '</b> (menys error)' }
        ]
      };
    }
    var d = r.pick([1, 2, 2, 3]), nom = ['dècimes', 'centèsimes', 'mil·lèsimes'][d - 1];
    var x;
    do { x = r.int(10, 99) + r.int(1, 99999) / 100000; x = U.clean(U.round(x, 5)); } while (U.round(x, d) === U.trunc(x, d) && i === 0);
    var ro = U.round(x, d), tr = U.trunc(x, d), ea = U.clean(Math.abs(x - ro)), et = U.clean(Math.abs(x - tr));
    var best = Math.abs(ea - et) < 1e-9 ? 2 : (ea < et ? 0 : 1);
    return {
      title: 'Temps de volta',
      ctx: 'El cronòmetre del joc marca el temps d\'una volta, però a la pantalla només hi caben les <b>' + nom + '</b>.<div class="big">' + U.fmt(x) + ' s</div>',
      steps: [
        { q: 'Arrodoneix a les ' + nom + '.', parts: [{ ans: ro, w: 7 }, ' s'],
          hint: 'Mira la xifra següent a les ' + nom + ': si és 5 o més, la d\'abans puja 1.', show: 'Arrodoniment: ' + U.fmt(ro) + ' s' },
        { q: 'Trunca a les ' + nom + '.', parts: [{ ans: tr, w: 7 }, ' s'],
          hint: 'Truncar = tallar: elimina les xifres que sobren sense mirar-les.', show: 'Truncament: ' + U.fmt(tr) + ' s' },
        { q: 'Calcula l\'<b>error absolut</b> de l\'arrodoniment.', parts: ['|' + U.fmt(x) + ' − ' + U.fmt(ro) + '| = ', { ans: ea, tol: 1e-7, w: 8 }],
          hint: 'Resta els dos nombres i treu el signe (l\'error sempre és positiu).', show: 'Error de l\'arrodoniment = ' + U.fmt(ea) },
        { q: 'L\'error del truncament és ' + U.fmt(et) + '. Quina aproximació comet menys error?', choices: ['Arrodoniment', 'Truncament', 'Les dues igual'], ans: best,
          hint: 'Compara ' + U.fmt(ea) + ' i ' + U.fmt(et) + '.', show: ['L\'arrodoniment és més precís', 'El truncament és més precís', 'Les dues aproximacions coincideixen'][best] }
      ]
    };
  }

  // ---------- M0.5 Caça el bug ----------
  var BUGS = [
    { t: '0,333… és irracional perquè té infinits decimals.', bug: true, ok: 'És racional: és periòdic i val 1/3.', no: ['És irracional perquè no s\'acaba mai.', 'És natural perquè comença per 0.'] },
    { t: '√16 és irracional perquè és una arrel.', bug: true, ok: '√16 = 4, que és natural.', no: ['Totes les arrels són irracionals.', '√16 = 8, que és natural.'] },
    { t: '−5 és un nombre enter i també racional.', bug: false, ok: 'Correcte: −5 = −5/1, i tot enter és racional.', no: ['És incorrecte: els negatius no són racionals.', 'És incorrecte: −5 només és enter.'] },
    { t: 'π = 3,14', bug: true, ok: '3,14 és només una aproximació: π és irracional (π ≈ 3,14).', no: ['π = 3,1416 exactament.', 'π és un decimal periòdic.'] },
    { t: 'Tots els nombres naturals són també nombres enters.', bug: false, ok: 'Correcte: ℕ ⊂ ℤ.', no: ['És incorrecte: el 0 no és enter.', 'És incorrecte: ℤ ⊂ ℕ.'] },
    { t: 'L\'interval (2, 5] inclou el nombre 2.', bug: true, ok: 'No inclou el 2 (parèntesi) i sí que inclou el 5 (claudàtor).', no: ['Inclou el 2 i el 5.', 'No inclou cap dels dos extrems.'] },
    { t: '7 no és racional perquè no té decimals.', bug: true, ok: '7 = 7/1, és racional (també natural i enter).', no: ['7 és irracional.', '7 només és natural.'] },
    { t: '√2 = 1,4142135… és irracional.', bug: false, ok: 'Correcte: té infinites xifres decimals sense període.', no: ['És incorrecte: és periòdic.', 'És incorrecte: √2 = 1,41 exactament.'] },
    { t: '«x ≥ 3» s\'escriu (3, +∞).', bug: true, ok: 'S\'escriu [3, +∞): el 3 està inclòs.', no: ['S\'escriu [3, +∞].', 'S\'escriu (−∞, 3].'] },
    { t: 'Arrodonir 2,46 a les dècimes dona 2,4.', bug: true, ok: 'Dona 2,5, perquè la xifra següent (6) és 5 o més.', no: ['Dona 2,46.', 'Dona 3.'] },
    { t: '2,1555… és un decimal periòdic mixt.', bug: false, ok: 'Correcte: anteperíode 1 i període 5.', no: ['És incorrecte: és periòdic pur.', 'És incorrecte: és irracional.'] },
    { t: 'Truncar 5,79 a les dècimes dona 5,8.', bug: true, ok: 'Truncar és tallar: dona 5,7 (5,8 és l\'arrodoniment).', no: ['Dona 6.', 'Dona 5,79.'] }
  ];
  function genBug(r, i, used) {
    var pool = BUGS.filter(function (b, k) { return used.indexOf(k) < 0; });
    var item = r.pick(pool); used.push(BUGS.indexOf(item));
    var opts = r.shuffle([item.ok].concat(item.no));
    return {
      title: 'Informe de bug',
      ctx: 'Un company del programa ha escrit aquest comentari al codi del joc:<div class="big quote">«' + item.t + '»</div>',
      steps: [
        { q: 'Hi ha un <b>bug</b> (error) en aquesta afirmació?', choices: ['Sí, hi ha bug', 'No, és correcta'], ans: item.bug ? 0 : 1,
          hint: 'Comprova-ho amb un exemple o amb la calculadora.', show: item.bug ? 'Sí que hi ha bug' : 'No hi ha bug' },
        { q: item.bug ? 'Quina és la correcció?' : 'Per què és correcta?', choices: opts, ans: opts.indexOf(item.ok),
          hint: 'Només una de les opcions és matemàticament certa.', show: item.ok }
      ]
    };
  }

  CGS.NIVELLS = CGS.NIVELLS || [];
  CGS.NIVELLS.push({
    id: 'N0', nom: 'Nivell 0 · Tutorial', sub: 'Unitat 1 · Els nombres reals',
    missions: [
      { id: 'N0M1', fase: 1, titol: 'Tria el teu personatge', sabers: 'Classificació dels nombres: ℕ, ℤ, ℚ, I, ℝ', n: 5, gen: genClassifica,
        teoria: '<b>ℕ</b> naturals: 0, 1, 2, 3… · <b>ℤ</b> enters: …, −2, −1, 0, 1, 2… · <b>ℚ</b> racionals: es poden escriure com a fracció (decimals exactes i periòdics) · <b>I</b> irracionals: infinites xifres decimals sense període (√2, π…) · <b>ℝ</b> reals = ℚ ∪ I.<br>Nines russes: ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ. Atenció: les arrels exactes (√25 = 5) <b>no</b> són irracionals.' },
      { id: 'N0M2', fase: 2, titol: 'Els cofres del tresor', sabers: 'Expressió decimal: exacte, periòdic pur i mixt, il·limitat', n: 4, gen: genDecimals,
        teoria: '<b>Exacte</b>: s\'acaba (3/4 = 0,75). <b>Periòdic pur</b>: el període comença després de la coma (5/11 = 0,4545…). <b>Periòdic mixt</b>: hi ha anteperíode (7/6 = 1,1666…). Tots tres són <b>racionals</b>.<br><b>Il·limitat no periòdic</b>: no s\'acaba i no es repeteix (√2, π) → <b>irracional</b>.' },
      { id: 'N0M3', fase: 3, titol: 'Les regles del joc', sabers: 'Intervals: desigualtat, notació, paraules i recta', n: 4, gen: genIntervals,
        teoria: '[a, b] tancat: a ≤ x ≤ b · (a, b) obert: a < x < b · [a, b) i (a, b] semioberts.<br>[a, +∞): x ≥ a «com a mínim a» · (−∞, b): x < b «menys de b».<br>Recta: punt <b>ple</b> = inclòs, punt <b>buit</b> = no inclòs. L\'infinit sempre amb parèntesi.' },
      { id: 'N0M4', fase: 4, titol: 'La pista de curses', sabers: 'Aproximacions: arrodoniment, truncament i error absolut', n: 4, gen: genAprox,
        teoria: '<b>Arrodonir</b>: si la xifra següent és ≥ 5, la última que queda puja 1 (3,147 → 3,15). <b>Truncar</b>: tallar sense mirar (3,147 → 3,14).<br><b>Error absolut</b> = |valor real − aproximació|. La millor aproximació és la que té menys error.' },
      { id: 'N0M5', fase: 5, titol: 'Caça el bug', sabers: 'Errors conceptuals típics de la Unitat 1', n: 4, gen: genBug,
        teoria: 'Els 3 bugs més freqüents: (1) periòdic → és <b>racional</b>; (2) les arrels exactes són <b>racionals</b> (√9 = 3); (3) els enters també són racionals (7 = 7/1).' },
      { id: 'N0B', fase: 6, boss: true, titol: 'BOSS · Prova d\'accés a l\'estudi', sabers: 'Entrenament del boss: un exercici de cada fase, sense pistes', n: 6,
        gen: function (r, i, used) { return [genClassifica, genDecimals, genIntervals, genAprox, genBug, genIntervals][i](r, i === 5 ? 2 : i, used); },
        teoria: 'Al boss no hi ha pistes. Escriu el procés pas a pas i fes servir la calculadora per comprovar.' }
    ]
  });
})(CGS);
