# Corbatera Games Studio · Matemàtiques A

Gamificació de **Matemàtiques A · 4t ESO** (Corbatera Institut Escola, curs 2026–2027) dins de la situació d'aprenentatge «Corbatera Games Studio».
L'alumnat resol cada missió **pas a pas** i tot el procés (respostes, intents fallits, pistes) queda registrat en un **diari de procés** que es pot descarregar com a informe.

## Contingut

| Nivell | Fase | Missió | Sabers |
|---|---|---|---|
| **0 · Tutorial** (U1) | 1 | Tria el teu personatge | Classificació: ℕ, ℤ, ℚ, I, ℝ |
| | 2 | Els cofres del tresor | Decimal exacte, periòdic pur i mixt, il·limitat |
| | 3 | Les regles del joc | Intervals: desigualtat, notació, paraules, recta |
| | 4 | La pista de curses | Arrodoniment, truncament, error absolut |
| | 5 | Caça el bug | Errors conceptuals de la U1 |
| | 6 | Operacions amb enters | Repàs: signes, parèntesis, jerarquia, valor absolut |
| | 7 | Fraccions | Repàs: simplificar, fracció d'una quantitat, operacions |
| | BOSS | Prova d'accés a l'estudi | Un exercici de cada fase, sense pistes |
| **1 · Memòria i píxels** (U2) | 1 | Quants colors? | Potències, bits, exponent 0 i negatiu |
| | 2 | Quant ocupa? | Propietats de les potències |
| | 3 | Caça de bugs | Errors típics amb potències |
| | 4 | Xifres del joc | Notació científica i la «E» de la calculadora |
| | 5 | El servidor | Operacions en notació científica |
| | 6 | Distància entre personatges | Arrels i teorema de Pitàgores |
| | 7 | Escalat de sprites | Extreure factors d'un radical |
| | 8 | Camins del mapa | Operacions amb radicals |
| | 9 | Potències de fraccions | Repàs: base fraccionària o negativa, mateixa base |
| | BOSS | Boss del Nivell 1 | Un exercici de cada fase, sense pistes |
| **2 · La física del salt** (U3) | 1 | El salt com a fórmula | Monomis, polinomis i valor numèric |
| | 2 | Salts diferents | Sumar i restar polinomis |
| | 3 | L'àrea jugable | Multiplicar polinomis (taula de l'àrea) |
| | 4 | Quadrats que creixen | Productes notables i càlcul mental |
| | 5 | Caça de bugs algebraics | Errors típics amb polinomis |
| | 6 | Desfer la multiplicació | Factor comú i identitats al revés |
| | 7 | Repartir la pantalla | Divisió entre (x − a), D = d · q + r |
| | 8 | Ruffini: quan toca a terra? | Ruffini, teorema del residu, arrels enteres |
| | BOSS | Boss del Nivell 2 | Un exercici de cada fase, sense pistes |
| **3 · La botiga i el llançament** (U4) | 1 | Situar plataformes | Equacions de 1r grau (parèntesis i denominadors) |
| | 2 | Quan aterra el salt? | Equacions de 2n grau: fórmula general |
| | 3 | Dreceres | Equacions de 2n grau incompletes i factoritzades |
| | 4 | El salt arriba a la plataforma? | Discriminant i nombre de solucions |
| | 5 | Del joc a l'equació | Problemes amb el mètode dels quatre passos |
| | 6 | La botiga: rebaixes i IVA | Percentatges i índex de variació |
| | 7 | Estalviar o finançar? | Variacions encadenades, interès simple i compost |
| | 8 | El preu mínim | Inequacions de 1r grau i intervals |
| | 9 | Packs a la gràfica | Sistemes 2×2: resolució gràfica i tipus |
| | 10 | Tres camins | Substitució, igualació i reducció |
| | BOSS | Boss del Nivell 3 | Un exercici de cada fase, sense pistes |

L'ampliació (racionalització, exponents fraccionaris, fraccions algebraiques, biquadrades, inequacions de 2n grau, sistemes no lineals…) no hi és, perquè no entra a les proves.

Als polinomis, l'alumnat escriu cada coeficient en una casella amb el seu signe (0 si el terme no hi és).

## Estudi (teoria)

`estudi.html` és l'apartat de teoria del trimestre (unitats 1 a 4): definicions, regles i fórmules, exemples resolts i errors típics, amb índex, cercador i opció d'imprimir o desar en PDF.

- Al mapa del joc hi ha una targeta **Estudi** a dalt de tot.
- Dins de cada missió, el «Recuadre de teoria» té un enllaç **Teoria completa d'aquest tema →**.
- Cada apartat de teoria té botons **Practica-ho** que obren directament la missió corresponent (`index.html#jugar=N2M8`). Si la missió encara està bloquejada, el joc ho avisa.
- Adreça directa: `https://laurasc14.github.io/jocs-matematiquesA/estudi.html`

## Organització del mapa

De dalt a baix:

1. **Estudi**: targeta que porta a la teoria (`estudi.html`).
2. **Nivells 0, 1, 2 i 3**, per ordre. Els nivells 0 i 1 (ja fets a classe) tenen totes les fases obertes; als nivells 2 i 3 les fases s'obren en ordre.
3. **Mode repàs**: rondes d'exercicis barrejats per tema, pas a pas i sempre obertes (vegeu més avall).
4. **Mode entrenament**: les preguntes ràpides (`entrenament-1a.html` i `entrenament-2a.html`), amb diari d'errors C/P/D, boss per nivell, «El meu avanç» i «Resum per a la profe». Els seus XP també sumen per al rang del joc (es llegeixen del mateix navegador).
5. **Diari de procés** i informe.

Per obrir totes les fases d'un nivell que ja s'ha fet a classe, edita `var ENTRENAMENT = ['N0', 'N1'];` a `js/app.js` (per exemple, afegeix-hi `'N2'` quan s'acabi el Nivell 2).

## Mode repàs

Rondes d'exercicis barrejats d'un tema, amb el mateix sistema pas a pas, pistes i diari de procés. Sempre obert; cada ronda té nombres nous i compta la millor ronda de cada tema per als XP.

| Tema | Exercicis per ronda | D'on surten |
|---|---|---|
| Notació científica | 10 | Xifres del joc, El servidor i 5 tipus nous: corregir una dada mal escrita, ordenar, potències en notació científica, «quants jocs hi caben?» i canvi d'unitats (kB, MB, GB, TB) |
| Enters i fraccions | 8 | Nivell 0, fases 6 i 7 |
| Potències | 8 | Nivell 1, fases 1, 2, 3 i 9 |
| Radicals i Pitàgores | 8 | Nivell 1, fases 6, 7 i 8 |
| Polinomis | 8 | Nivell 2 |
| Equacions i problemes | 8 | Nivell 3, fases 1–5 |
| Percentatges i interessos | 8 | Nivell 3, fases 6 i 7 |
| Inequacions i sistemes | 8 | Nivell 3, fases 8–10 |

## Com funciona

- **Pas a pas:** cada exercici està dividit en passos. Fins que un pas no és correcte no apareix el següent, i els passos resolts queden escrits a sobre com un procediment.
- **Nombres personalitzats:** els nombres es generen a partir del nom de l'alumne/a, així cadascú té exercicis diferents. Si torna a jugar una missió, li surten nombres nous.
- **XP:** 10 XP per pas a la primera; −3 per cada intent fallit (mínim 3); amb pista, màxim 5; si es mostra la solució (després de 3 intents), 0 XP. Compta la millor partida de cada missió.
- **Rangs:** Becari/ària (0) → Junior dev (400) → Desenvolupador/a (1.200) → Sènior dev (2.300) → Lead dev (3.500) → Cap d'estudi (4.800 XP).
- **Bosses:** sense pistes; cal un 60 % dels XP per superar-los.
- **Desbloqueig:** a la campanya, la fase 1 de cada nivell està oberta i les altres s'obren en ordre. Al mode entrenament tot està obert.
- **Diari de procés i informe:** el botó *Descarrega l'informe* genera un fitxer HTML amb el resum (missions, XP, passos a la primera, pistes, solucions mostrades) i el procés complet de cada exercici, amb els intents fallits ratllats. També es pot imprimir o desar com a PDF. L'alumnat el penja al Classroom.

### Mode docent

Afegint `?docent` a l'adreça (`https://laurasc14.github.io/jocs-matematiquesA/?docent`) totes les missions queden desbloquejades, per revisar-les o projectar-les.

### On es guarda el progrés

Al navegador de cada ordinador (`localStorage`). Si diversos alumnes fan servir el mateix ordinador, cadascú entra amb el seu nom. Si s'esborren les dades del navegador o es canvia d'ordinador, el progrés es perd: per això cal descarregar l'informe en acabar cada sessió.

**Joc:** https://laurasc14.github.io/jocs-matematiquesA/
**Repositori:** https://github.com/laurasc14/jocs-matematiquesA

## Publicar-ho a GitHub Pages

1. Repositori: `laurasc14/jocs-matematiquesA`.
2. Puja-hi **tot el contingut d'aquesta carpeta** (`index.html`, `estudi.html`, `entrenament-1a.html`, `entrenament-2a.html`, `css/`, `js/`, `README.md`, `.nojekyll`) a l'arrel del repositori. Des de la web: *Add file → Upload files* i arrossega-ho tot.
3. Ves a *Settings → Pages*, a *Source* tria *Deploy from a branch*, branca `main` i carpeta `/ (root)`. Desa.
4. Al cap d'un minut la pàgina serà a `https://laurasc14.github.io/jocs-matematiquesA/`.
   - Mode entrenament: `https://laurasc14.github.io/jocs-matematiquesA/entrenament-1a.html` i `…/entrenament-2a.html`

També funciona sense internet: obre `index.html` directament amb el navegador.

## Estructura

```
index.html        pàgina principal (joc pas a pas)
estudi.html       apartat d'estudi: teoria de les unitats 1 a 4
entrenament-1a.html  mode entrenament · preguntes ràpides de la 1a avaluació
entrenament-2a.html  mode entrenament · preguntes ràpides de la 2a avaluació
css/estil.css     estil (capçalera verda, etiquetes FASE, mode fosc)
css/estudi.css    estil de l'apartat d'estudi (i de la versió impresa)
js/util.js        utilitats: atzar amb llavor, format, lectura de respostes, figures SVG
js/nivell0.js     missions del Nivell 0 (U1)
js/nivell1.js     missions del Nivell 1 (U2)
js/nivell2.js     missions del Nivell 2 (U3)
js/nivell3.js     missions del Nivell 3 (U4)
js/repas.js       fases de repàs: enters i fraccions (N0) i potències de fraccions (N1)
js/mode-repas.js  mode repàs: rondes per tema (notació científica i la resta de temes)
js/app.js         motor del joc: mapa, passos, XP, diari i informe
```

Per afegir un nivell nou (per exemple, funcions a la 2a avaluació) n'hi ha prou de crear `js/nivell4.js` amb el mateix format (`CGS.NIVELLS.push({...})`) i enllaçar-lo a `index.html` abans d'`app.js`.

---
Docent: Laura · Corbatera Institut Escola
