/* Escape room de repàs (S42). Generat automàticament: les claus van en hash perquè no es vegin al codi. */
var CGS_ESCAPE = {
 "sales": [
  {
   "id": "S0",
   "n": "Sala 0",
   "t": "El tutorial",
   "nivell": "Nivell 0 · Nombres reals",
   "icon": "🧭",
   "intro": "El BUG-0 ha entrat pel tutorial i ha barrejat els personatges i les regles del joc.",
   "locks": [
    {
     "id": "0A",
     "t": "Tria els personatges",
     "tipus": "sel",
     "mid": "N0M1",
     "q": "Només els personatges <b>irracionals</b> tenen la clau. Selecciona'ls tots (i cap més).",
     "items": [
      "−5",
      "√9",
      "2/7",
      "√8",
      "0,1212…",
      "π",
      "−√25",
      "14/7",
      "1 + √2"
     ],
     "h": [
      "Un nombre és irracional si té infinits decimals que no es repeteixen. Les arrels exactes no ho són: simplifica-les abans.",
      "N'hi ha 3. Mira bé √8 i √9: només una de les dues és exacta."
     ],
     "k": "8a4891c5",
     "clau": 3
    },
    {
     "id": "0B",
     "t": "Les regles del salt",
     "tipus": "num",
     "mid": "N0M3",
     "q": "El personatge pot saltar si la seva energia x compleix <b>−2 < x ≤ 5</b>. Escriu-ho com a interval al paper. <b>Quants valors enters</b> d'energia li permeten saltar?",
     "h": [
      "«<» vol dir que l'extrem no hi entra (parèntesi); «≤» vol dir que sí (claudàtor).",
      "Comença a comptar pel −1 i acaba al 5."
     ],
     "k": "132280f7"
    },
    {
     "id": "0C",
     "t": "Càrrega d'energia",
     "tipus": "num",
     "mid": "N0M6",
     "q": "Calcula l'energia que recupera el personatge:<br><span class=\"big\">−2 · (5 − 9) + 15 : (−3) + 3/4 · 8</span>",
     "h": [
      "Ordre: parèntesis → multiplicacions i divisions → sumes i restes. Vigila els signes.",
      "−2 · (−4) = 8;  15 : (−3) = −5;  3/4 · 8 = 6."
     ],
     "k": "75a63356"
    }
   ]
  },
  {
   "id": "S1",
   "n": "Sala 1",
   "t": "Memòria i píxels",
   "nivell": "Nivell 1 · Potències i radicals",
   "icon": "💾",
   "intro": "A la sala de servidors, el BUG-0 ha xifrat la memòria del joc i ha amagat el cofre del mapa.",
   "locks": [
    {
     "id": "1A",
     "t": "La paleta de colors",
     "tipus": "num",
     "mid": "N1M2",
     "q": "La paleta del joc té <span class=\"big\">2⁴ · 2³ : (2²)²</span> colors. Expressa-ho com una sola potència al paper. <b>Quants colors</b> són?",
     "h": [
      "Mateixa base: en multiplicar se sumen els exponents; en dividir es resten; potència d'una potència, es multipliquen.",
      "2⁴ · 2³ = 2⁷ i (2²)² = 2⁴."
     ],
     "k": "7d2748d6"
    },
    {
     "id": "1B",
     "t": "Quants nivells hi caben?",
     "tipus": "num",
     "mid": "N1M5",
     "q": "El joc complet ocupa <b>4,8 · 10⁹ bytes</b> i cada nivell ocupa <b>1,6 · 10⁸ bytes</b>. Quants nivells té el joc? (Escriu el resultat en notació científica al paper.)",
     "h": [
      "Divideix les parts decimals entre elles i les potències de 10 entre elles.",
      "4,8 : 1,6 = 3 i 10⁹ : 10⁸ = 10¹."
     ],
     "k": "ddcad78a"
    },
    {
     "id": "1C",
     "t": "El cofre amagat",
     "tipus": "num",
     "mid": "N1M6",
     "q": "El personatge és a <b>(1, 2)</b> i el cofre a <b>(5, 10)</b>. La distància entre ells és <b>a√5</b>. Quant val <b>a</b>?",
     "h": [
      "Els catets són les diferències de coordenades: 5 − 1 i 10 − 2.",
      "√80: busca el quadrat perfecte més gran que el divideix (16)."
     ],
     "k": "9991c74c"
    }
   ]
  },
  {
   "id": "S2",
   "n": "Sala 2",
   "t": "La física del salt",
   "nivell": "Nivell 2 · Polinomis",
   "icon": "🦘",
   "intro": "El motor de física s'ha penjat: el personatge ja no sap quan salta ni on toca a terra.",
   "locks": [
    {
     "id": "2A",
     "t": "Altura del salt",
     "tipus": "num",
     "mid": "N2M1",
     "q": "L'altura del salt és <b>h(t) = −5t² + 15t</b> (metres, segons). Quina altura té el personatge a <b>t = 2 s</b>?",
     "h": [
      "Substitueix t per 2 a tots els termes.",
      "Compte: −5 · 2² = −5 · 4 = −20 (primer la potència)."
     ],
     "k": "df124516"
    },
    {
     "id": "2B",
     "t": "Quadrats que xoquen",
     "tipus": "num",
     "mid": "N2M4",
     "q": "Simplifica <span class=\"big\">(x + 3)² − (x − 3)²</span>. El resultat és <b>k·x</b>. Quant val <b>k</b>?",
     "h": [
      "(a + b)² = a² + 2ab + b² i (a − b)² = a² − 2ab + b².",
      "El menys de davant canvia el signe de TOTS els termes del segon quadrat."
     ],
     "k": "f67e1fdf"
    },
    {
     "id": "2C",
     "t": "On toca a terra?",
     "tipus": "num",
     "mid": "N2M8",
     "q": "Les arrels de <b>P(x) = x³ − 2x² − 9x + 18</b> són els punts on el personatge toca a terra. Troba-les amb Ruffini. La clau és la <b>suma dels seus valors absoluts</b>.",
     "h": [
      "Les arrels enteres són divisors de 18: prova 1, −1, 2, −2…",
      "x = 2 funciona; el quocient és x² − 9."
     ],
     "k": "3b509087"
    }
   ]
  },
  {
   "id": "S3",
   "n": "Sala 3",
   "t": "La botiga",
   "nivell": "Nivell 3 · Equacions, percentatges i sistemes",
   "icon": "🛒",
   "intro": "El BUG-0 ha bloquejat la botiga del joc: preus, pantalles i packs, tot desquadrat.",
   "locks": [
    {
     "id": "3A",
     "t": "La plataforma",
     "tipus": "num",
     "mid": "N3M1",
     "q": "La plataforma és a la posició x que compleix <span class=\"big\">(x + 2)/3 + x/2 = 4</span>. Quant val x?",
     "h": [
      "Multiplica tots els termes pel mcm(3, 2) = 6.",
      "2(x + 2) + 3x = 24."
     ],
     "k": "04864434"
    },
    {
     "id": "3B",
     "t": "La pantalla",
     "tipus": "num",
     "mid": "N3M5",
     "q": "Una pantalla rectangular fa <b>2 cm més d'amplada que d'alçada</b> i té <b>48 cm²</b> d'àrea. Quina és l'<b>alçada</b>?",
     "h": [
      "Alçada x, amplada x + 2. Àrea = alçada · amplada.",
      "x² + 2x − 48 = 0, i Δ = 4 + 192 = 196."
     ],
     "k": "c09e9edf"
    },
    {
     "id": "3C",
     "t": "Rebaixes trucades",
     "tipus": "num",
     "mid": "N3M7",
     "q": "Un joc de <b>50 €</b> puja un <b>20 %</b> i després el rebaixen un <b>30 %</b>. Quants euros costa ara?",
     "h": [
      "Puja un 20 % → multiplica per 1,20. Baixa un 30 % → multiplica per 0,70.",
      "50 · 1,20 = 60."
     ],
     "k": "57870250"
    },
    {
     "id": "3D",
     "t": "Pocions i escuts",
     "tipus": "num",
     "mid": "N3M10",
     "q": "A la botiga, <b>3 pocions i 2 escuts</b> costen 19 monedes, i <b>1 poció i 1 escut</b> costen 8. Quantes monedes costa un <b>escut</b>?",
     "h": [
      "x = preu d'una poció, y = preu d'un escut: x + y = 8 i 3x + 2y = 19.",
      "Aïlla x = 8 − y i substitueix a la segona equació."
     ],
     "k": "affae640"
    }
   ]
  }
 ],
 "final": {
  "id": "F",
  "t": "El nucli del servidor",
  "tipus": "num",
  "mid": "N3M8",
  "q": "El BUG-0 ha amagat la contrasenya en una inequació feta amb dues claus que ja teniu:<br><span class=\"big\">x − (clau 3C) > (clau 1B) − 2x</span>La contrasenya és el <b>nombre enter més petit</b> que la compleix. Escriu la solució com a interval al paper.",
  "h": [
   "Substitueix: x − 42 > 30 − 2x. Passa les x a un costat i els nombres a l'altre.",
   "3x > 72 → x > 24. El 24 no hi entra!"
  ],
  "k": "b22c574b"
 }
};
