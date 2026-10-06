/* RUTA DE RECUPERACIÓ · 1a avaluació
   Una missió per fita mínima: 5 exercicis pas a pas trets de les fases de cada tema.
   La fita queda ASSOLIDA quan una ronda arriba al 60 % dels XP. */
(function () {
  var mis = function (id) {
    var out = null;
    CGS.NIVELLS.concat(CGS.REPAS ? [CGS.REPAS] : []).forEach(function (nv) { nv.missions.forEach(function (m) { if (m.id === id) out = m; }); });
    return out;
  };
  var from = function (id) { return function (r, used) { var m = mis(id); return m.gen(r, r.int(0, m.n - 1), used); }; };
  function fita(n, titol, saber, estudi, fonts, teoria) {
    return {
      id: 'RC' + n, recu: true, fita: n, titol: titol, sabers: saber, estudi: estudi, n: 5,
      teoria: teoria || fonts.map(function (id) { return mis(id).teoria; }).filter(Boolean).join('<br>'),
      gen: function (r, i, used) {
        var k = (i + r.int(0, fonts.length - 1)) % fonts.length, key = 's' + k;
        used[key] = used[key] || [];
        if (used[key].length >= 6) used[key].length = 0;
        return from(fonts[k])(r, used[key]);
      }
    };
  }
  CGS.RECU = {
    id: 'RC', nom: 'Ruta de recuperació', sub: 'Fites mínimes de la 1a avaluació',
    obre: 20261210,           // dia que apareix al mapa (aaaammdd)
    llindar: 0.6,             // percentatge d'XP per donar la fita per assolida
    missions: [
      fita(1, 'Tipus de nombres', 'Classificar nombres (ℕ, ℤ, ℚ, I) i dir el tipus d\'expressió decimal', 'u1-conjunts', ['N0M1', 'N0M2']),
      fita(2, 'Intervals i aproximacions', 'Passar de desigualtat a interval i a la recta; arrodonir, truncar i error absolut', 'u1-intervals', ['N0M3', 'N0M4']),
      fita(3, 'Enters i fraccions', 'Operacions combinades amb enters i fraccions respectant la jerarquia', 'u1-enters', ['N0M6', 'N0M7']),
      fita(4, 'Potències', 'Exponent 0 i negatiu, propietats de les potències i potències de fraccions', 'u2-propietats', ['N1M1', 'N1M2', 'N1M9']),
      fita(5, 'Notació científica', 'Escriure, comparar i operar en notació científica', 'u2-nc', ['RNC']),
      fita(6, 'Radicals i Pitàgores', 'Extreure factors, sumar radicals i calcular distàncies amb Pitàgores', 'u2-radicals', ['N1M6', 'N1M7']),
      fita(7, 'Operacions amb polinomis', 'Valor numèric, suma, resta i producte de polinomis', 'u3-operacions', ['N2M1', 'N2M2', 'N2M3']),
      fita(8, 'Identitats notables i factor comú', 'Desenvolupar identitats notables i factoritzar', 'u3-notables', ['N2M4', 'N2M6']),
      fita(9, 'Ruffini i arrels', 'Dividir per Ruffini i trobar les arrels enteres d\'un polinomi', 'u3-ruffini', ['N2M8']),
      fita(10, 'Equacions de 1r grau', 'Resoldre equacions amb parèntesis i denominadors', 'u4-eq1', ['N3M1']),
      fita(11, 'Equacions de 2n grau', 'Completes, incompletes i nombre de solucions (discriminant)', 'u4-eq2', ['N3M2', 'N3M3']),
      fita(12, 'Problemes i percentatges', 'Plantejar i resoldre problemes amb equacions; descomptes, augments i IVA', 'u4-problemes', ['N3M5', 'N3M6']),
      fita(13, 'Sistemes 2×2', 'Resoldre sistemes per substitució, igualació o reducció i problemes', 'u4-sistemes', ['N3M9', 'N3M10'])
    ]
  };
  CGS.RECU.missions.forEach(function (m) { m.nivell = CGS.RECU; });
})();
