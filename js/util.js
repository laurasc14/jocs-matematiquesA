/* Corbatera Games Studio · utilitats comunes */
var CGS = window.CGS || {};
window.CGS = CGS;

(function (U) {
  // ---------- Atzar amb llavor (cada alumne té nombres diferents) ----------
  U.hash = function (str) {
    var h = 1779033703 ^ str.length;
    for (var i = 0; i < str.length; i++) {
      h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
      h = (h << 13) | (h >>> 19);
    }
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return (h ^= h >>> 16) >>> 0;
  };
  U.rng = function (seedStr) {
    var a = U.hash(seedStr);
    var r = function () {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    r.int = function (lo, hi) { return lo + Math.floor(r() * (hi - lo + 1)); };
    r.pick = function (arr) { return arr[Math.floor(r() * arr.length)]; };
    r.shuffle = function (arr) {
      var a2 = arr.slice();
      for (var i = a2.length - 1; i > 0; i--) {
        var j = Math.floor(r() * (i + 1)); var t = a2[i]; a2[i] = a2[j]; a2[j] = t;
      }
      return a2;
    };
    r.bool = function () { return r() < 0.5; };
    return r;
  };

  // ---------- Aritmètica ----------
  U.gcd = function (a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = b; b = a % b; a = t; } return a; };
  U.round = function (x, d) { var p = Math.pow(10, d); return Math.round(x * p + (x >= 0 ? 1e-9 : -1e-9)) / p; };
  U.trunc = function (x, d) { var p = Math.pow(10, d); return Math.trunc(x * p + (x >= 0 ? 1e-9 : -1e-9)) / p; };
  U.clean = function (x) { return parseFloat(x.toPrecision(12)); };
  U.factor = function (n) { // {2:3, 3:2}
    var f = {}, p = 2;
    while (n > 1 && p * p <= n) { while (n % p === 0) { f[p] = (f[p] || 0) + 1; n /= p; } p++; }
    if (n > 1) f[n] = (f[n] || 0) + 1;
    return f;
  };
  // Expressió decimal d'una fracció positiva a/b: part entera, anteperíode i període
  U.decimalInfo = function (a, b) {
    var ent = Math.floor(a / b), r = a % b, seen = {}, digits = '', pos = 0;
    while (r !== 0 && !(r in seen)) {
      seen[r] = pos; r *= 10; digits += Math.floor(r / b); r = r % b; pos++;
    }
    if (r === 0) return { ent: ent, ante: digits, per: '' };
    return { ent: ent, ante: digits.slice(0, seen[r]), per: digits.slice(seen[r]) };
  };

  // ---------- Format (coma decimal, punt de milers) ----------
  U.fmt = function (x, maxDec) {
    if (x === Infinity) return '+∞';
    if (x === -Infinity) return '−∞';
    if (maxDec === undefined) maxDec = 10;
    var s = U.clean(U.round(x, maxDec)).toString();
    if (s.indexOf('e') >= 0) s = x.toFixed(maxDec).replace(/0+$/, '').replace(/\.$/, '');
    var neg = s[0] === '-'; if (neg) s = s.slice(1);
    var parts = s.split('.');
    var ip = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    var out = ip + (parts[1] ? ',' + parts[1] : '');
    return (neg ? '−' : '') + out;
  };
  U.fmtPlain = function (x) { // sense punts de milers (per a nombres petits)
    return U.fmt(x).replace(/\.(?=\d{3})/g, '.');
  };

  // ---------- Lectura de respostes ----------
  U.parseNum = function (raw) {
    if (raw === undefined || raw === null) return NaN;
    var s = String(raw).trim().toLowerCase()
      .replace(/\s+/g, '').replace(/−|–/g, '-').replace(/^\+/, '');
    if (s === '') return NaN;
    if (/^-?(∞|inf|infinit)$/.test(s) || /^\+?(∞|inf|infinit)$/.test(s)) {
      return s[0] === '-' ? -Infinity : Infinity;
    }
    // fracció a/b
    var m = s.match(/^(-?[\d.,]+)\/(-?[\d.,]+)$/);
    if (m) { var n1 = U.parseNum(m[1]), n2 = U.parseNum(m[2]); return n2 === 0 ? NaN : n1 / n2; }
    if (s.indexOf(',') >= 0) {           // coma decimal; punts = milers
      s = s.replace(/\./g, '').replace(',', '.');
    } else if (/^-?\d{1,3}(\.\d{3})+$/.test(s)) { // 50.000.000
      s = s.replace(/\./g, '');
    }
    if (!/^-?\d*\.?\d+(e-?\d+)?$/.test(s)) return NaN;
    return parseFloat(s);
  };
  U.normText = function (s) {
    return String(s || '').trim().toLowerCase().replace(/\s+/g, '')
      .replace(/[àá]/g, 'a').replace(/[èé]/g, 'e').replace(/[íï]/g, 'i')
      .replace(/[òó]/g, 'o').replace(/[úü]/g, 'u');
  };

  // ---------- Peces de notació matemàtica (HTML) ----------
  U.pw = function (b, e) {
    var bs = String(b);
    if (/^[-−]/.test(bs) || /[·+\/ ]/.test(bs)) bs = '(' + bs + ')';
    return bs + '<sup>' + String(e).replace('-', '−') + '</sup>';
  };
  U.rad = function (k, m, idx) {
    var pre = (k === 1 || k === '') ? '' : (k === -1 ? '−' : String(k).replace('-', '−'));
    var ix = idx && idx !== 2 ? '<sup class="idx">' + idx + '</sup>' : '';
    return '<span class="nw">' + pre + ix + '√<span class="rad">' + m + '</span></span>';
  };
  U.frac = function (a, b) {
    return '<span class="frac"><span>' + a + '</span><span>' + b + '</span></span>';
  };
  U.sci = function (a, e) { return '<span class="nw">' + U.fmt(a) + ' · 10<sup>' + String(e).replace('-', '−') + '</sup></span>'; };
  U.esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  U.stripTags = function (h) { var d = document.createElement('div'); d.innerHTML = h; return d.textContent || ''; };


  // ---------- Polinomis ----------
  // coefs de grau més alt a grau 0: [-5, 20, 0] → −5t² + 20t
  U.poly = function (coefs, v) {
    v = v || 'x'; var n = coefs.length - 1, out = '';
    coefs.forEach(function (c, k) {
      var d = n - k; if (!c) return;
      var abs = Math.abs(c), sign = c < 0 ? '−' : '+';
      var cs = (abs === 1 && d > 0) ? '' : U.fmt(abs);
      var vs = d === 0 ? '' : d === 1 ? v : v + '<sup>' + d + '</sup>';
      out += out === '' ? (c < 0 ? '−' : '') + cs + vs : ' ' + sign + ' ' + cs + vs;
    });
    return '<span class="nw">' + (out || '0') + '</span>';
  };
  U.polyEval = function (coefs, x) { return coefs.reduce(function (acc, c) { return acc * x + c; }, 0); };
  U.polyMul = function (a, b) {
    var out = []; for (var i = 0; i < a.length + b.length - 1; i++) out.push(0);
    a.forEach(function (x, i) { b.forEach(function (y, j) { out[i + j] += x * y; }); });
    return out;
  };
  // Camps per escriure un polinomi coeficient a coeficient
  U.polyFields = function (coefs, v) {
    v = v || 'x'; var n = coefs.length - 1, parts = [];
    coefs.forEach(function (c, k) {
      var d = n - k;
      if (k > 0) parts.push(' + ');
      parts.push({ ans: c, w: 3 });
      if (d > 0) parts.push(d === 1 ? v : v + '<sup>' + d + '</sup>');
    });
    return parts;
  };
  // Taula de Ruffini (HTML)
  U.ruffini = function (coefs, a) {
    var mid = [''], bot = [coefs[0]];
    for (var i = 1; i < coefs.length; i++) { var m = bot[i - 1] * a; mid.push(m); bot.push(coefs[i] + m); }
    return { mid: mid, bot: bot };
  };
  U.ruffiniTable = function (coefs, a, full) {
    var R = U.ruffini(coefs, a), f = function (x) { return (x === '' || x === '?') ? x : U.fmt(x); };
    var row = function (lbl, arr, cls) {
      return '<tr class="' + (cls || '') + '"><td class="ra">' + lbl + '</td>' + arr.map(function (x, i) {
        return '<td' + (i === arr.length - 1 ? ' class="rlast"' : '') + '>' + f(x) + '</td>'; }).join('') + '</tr>';
    };
    return '<table class="ruffini">' + row('', coefs) + row(U.fmt(a), full ? R.mid : coefs.map(function () { return ''; }), 'rmid') +
      row('', full ? R.bot : coefs.map(function () { return '?'; }), 'rbot') + '</table>';
  };

  // ---------- Dibuixos SVG ----------
  // Recta numèrica amb un interval
  U.svgInterval = function (a, b, li, ri) {
    var W = 520, H = 70, y = 38;
    var fin = [a, b].filter(isFinite);
    var lo = Math.min.apply(null, fin) - 3, hi = Math.max.apply(null, fin) + 3;
    if (fin.length === 1) { lo = fin[0] - 5; hi = fin[0] + 5; }
    var X = function (v) { return 30 + (v - lo) * (W - 60) / (hi - lo); };
    var s = '<svg class="fig" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Interval a la recta">';
    s += '<line x1="10" y1="' + y + '" x2="' + (W - 10) + '" y2="' + y + '" class="axis"/>';
    s += '<polygon points="' + (W - 10) + ',' + y + ' ' + (W - 18) + ',' + (y - 5) + ' ' + (W - 18) + ',' + (y + 5) + '" class="axisfill"/>';
    for (var v = Math.ceil(lo); v <= Math.floor(hi); v++) {
      s += '<line x1="' + X(v) + '" y1="' + (y - 4) + '" x2="' + X(v) + '" y2="' + (y + 4) + '" class="axis"/>';
      s += '<text x="' + X(v) + '" y="' + (y + 20) + '" class="tick">' + U.fmt(v) + '</text>';
    }
    var x1 = isFinite(a) ? X(a) : 10, x2 = isFinite(b) ? X(b) : W - 14;
    s += '<line x1="' + x1 + '" y1="' + y + '" x2="' + x2 + '" y2="' + y + '" class="seg"/>';
    if (isFinite(a)) s += '<circle cx="' + x1 + '" cy="' + y + '" r="6" class="' + (li ? 'dotin' : 'dotout') + '"/>';
    if (isFinite(b)) s += '<circle cx="' + x2 + '" cy="' + y + '" r="6" class="' + (ri ? 'dotin' : 'dotout') + '"/>';
    return s + '</svg>';
  };
  // Mapa quadriculat amb personatges
  U.svgGrid = function (pts, size, showLeg) {
    size = size || 12;
    var c = 26, W = size * c + 40, s = '<svg class="fig grid" viewBox="0 0 ' + W + ' ' + W + '" role="img" aria-label="Mapa quadriculat">';
    var X = function (x) { return 20 + x * c; }, Y = function (y) { return 20 + (size - y) * c; };
    for (var i = 0; i <= size; i++) {
      s += '<line x1="' + X(i) + '" y1="' + Y(0) + '" x2="' + X(i) + '" y2="' + Y(size) + '" class="gl"/>';
      s += '<line x1="' + X(0) + '" y1="' + Y(i) + '" x2="' + X(size) + '" y2="' + Y(i) + '" class="gl"/>';
      if (i % 2 === 0) {
        s += '<text x="' + X(i) + '" y="' + (Y(0) + 14) + '" class="tick sm">' + i + '</text>';
        s += '<text x="' + (X(0) - 10) + '" y="' + (Y(i) + 4) + '" class="tick sm">' + i + '</text>';
      }
    }
    if (pts.length >= 2 && showLeg) {
      var p = pts[0], q = pts[1];
      s += '<line x1="' + X(p.x) + '" y1="' + Y(p.y) + '" x2="' + X(q.x) + '" y2="' + Y(p.y) + '" class="leg"/>';
      s += '<line x1="' + X(q.x) + '" y1="' + Y(p.y) + '" x2="' + X(q.x) + '" y2="' + Y(q.y) + '" class="leg"/>';
      s += '<line x1="' + X(p.x) + '" y1="' + Y(p.y) + '" x2="' + X(q.x) + '" y2="' + Y(q.y) + '" class="hyp"/>';
    }
    pts.forEach(function (p) {
      s += '<circle cx="' + X(p.x) + '" cy="' + Y(p.y) + '" r="9" class="pt ' + (p.cls || '') + '"/>';
      s += '<text x="' + X(p.x) + '" y="' + (Y(p.y) + 4) + '" class="ptl">' + p.l + '</text>';
    });
    return s + '</svg>';
  };
})(CGS);
