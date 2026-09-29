# Direction artistique de Chouffinder

> **Montage 2012, rendu 2026.** Les codes visuels et sonores de l'internet geek de 2010 à 2015, exécutés avec la rigueur d'une interface d'aujourd'hui : accessible, rapide, mobile d'abord.

L'analyse culturelle qui justifie chaque référence est dans [`culture-geek-2010-2015.md`](./culture-geek-2010-2015.md).

---

## 1. Principes

1. **Le calme avant le combo.** L'état de repos est net et lisible : un grand meme (texte du haut, champ au milieu, texte du bas) sur fond de nuit étoilée. Le chaos est réservé aux moments qui le méritent.
2. **Le « parfois » compte.** Une animation ne sort qu'une fois sur trois pour un mot chouffin (toujours pour un mot légendaire), une réaction d'échec une fois sur quatre pour un mot pas chouffin. La rareté fait la surprise. Quand elle sort, elle parle la langue de la **tribu** du mot (gamer, geek, métalleux, taverne, weeb, rôliste) et sa démesure suit le score (voir 4.9).
3. **Le verdict choisit son époque.** CHOUFFIN est rendu en skeuomorphisme glossy de 2011 (tampon Impact incliné, halo néon, reliefs). PAS CHOUFFIN est rendu en flat design de 2013 (tuile bleue, minuscules légères, angles droits). Même composant, deux époques.
4. **L'humour est dans le détail, jamais dans le chemin.** Chaque blague est posée à côté de l'information, pas à sa place : le verdict, le score et les boutons de vote sont toujours lisibles en premier.
5. **Tout est original.** Illustrations en SVG maison, sons synthétisés, textes écrits pour le site. Aucune marque, aucun asset protégé, aucune photo de personne réelle.
6. **Taquin et affectueux.** On vanne le chouffin comme un pote. Face aux insultes, le ton reste celui du site mais devient ferme, et toute animation rigolote disparaît.

---

## 2. Tokens

Tous les tokens vivent dans `src/app/globals.css`, dans le bloc `@theme` de Tailwind CSS 4 : ils génèrent directement les utilitaires (`bg-nuit`, `text-dew`, `rounded-card`, `ease-punch`...).

### 2.1 Couleurs

Thème unique sombre (`color-scheme: dark`) : le néon MLG n'existe que sur fond de nuit, et un seul thème maîtrisé vaut mieux que deux thèmes moyens.

| Token | Valeur | Rôle |
| --- | --- | --- |
| `--color-nuit` | `#0e0a16` | Fond de page (nuit de taverne légèrement violette) |
| `--color-nuit-2` | `#161022` | Fond du HUD de lecture, cartes plates |
| `--color-surface` | `#1d162b` | Cartes |
| `--color-surface-2` | `#282039` | Surfaces surélevées |
| `--color-ligne` | `rgb(255 255 255 / 0.12)` | Filets et bordures discrètes |
| `--color-parchemin` | `#f7f1e5` | Texte principal (blanc cassé, chaud) |
| `--color-brume` | `#bcb1cf` | Texte secondaire |
| `--color-dew` | `#b6ff2e` | Vert soda fluo : **CHOUFFIN**, action principale, focus |
| `--color-dew-deep` | `#4f8a00` | Tranche 3D des boutons verts |
| `--color-metro` | `#1f6fe5` | Bleu flat : **PAS CHOUFFIN** |
| `--color-metro-deep` | `#1553b3` | Tranche 3D des boutons bleus |
| `--color-metro-light` | `#7ab4ff` | Texte bleu sur fond sombre |
| `--color-chips` | `#ff7a1a` | Orange chips (progression, projectiles) |
| `--color-hydromel` | `#ffc84a` | Or : textes d'ambiance, lettrines, notices |
| `--color-alerte` | `#ff5a6a` | Erreurs, mot bloqué |
| `--color-neon-pink` / `cyan` / `yellow` / `violet` | `#ff3ea5` / `#3ef0ff` / `#fff23e` / `#9b7bff` | Bordure RGB, doge-speak, badges |

**Rareté du butin** (indice de chouffinitude), teintes éclaircies pour le contraste :

| Token | Valeur | Seuil |
| --- | --- | --- |
| `--color-rarity-poor` | `#a8a8a8` | 0 à 20, « Médiocre » |
| `--color-rarity-common` | `#f2f2f2` | 21 à 50, « Classique » |
| `--color-rarity-uncommon` | `#3dff2a` | 51 à 70, « Inhabituel » |
| `--color-rarity-rare` | `#52a8ff` | 71 à 85, « Rare » |
| `--color-rarity-epic` | `#c77dff` | 86 à 94, « Épique » |
| `--color-rarity-legendary` | `#ff8a1a` | 95 et plus (ou `legendary`), « Légendaire » |

**Contrastes vérifiés (WCAG 2.2)** : parchemin sur nuit 17,4:1 ; brume sur surface 8,6:1 ; texte des boutons verts 13,9:1 (10,9:1 sur la partie la plus sombre du dégradé) ; blanc sur tuile metro 4,7:1 ; texte des boutons bleus 6,6:1 ; hydromel sur surface 11,3:1 ; alerte sur surface 5,8:1 ; toutes les raretés au-dessus de 7:1 sur le fond d'info-bulle. Tout passe AA, la plupart AAA.

### 2.2 Typographie

| Token | Police | Usage | Pourquoi |
| --- | --- | --- | --- |
| `--font-display` | **Anton** (OFL), repli Impact | Textes « meme », tampon CHOUFFIN, titres de chapitres, chiffres | Le squelette d'Impact, libre de droits et chargé proprement |
| `--font-sans` | **Bricolage Grotesque** (OFL, variable) | Tout le reste | Une grotesque 2020s avec du caractère, lisible en long (le « C'est pas faux ») |
| `--font-comic` | **Comic Neue** (OFL), repli Comic Sans MS | Doge-speak uniquement | Le Comic Sans, en version dessinée proprement |
| `--font-pixel` | **Silkscreen** (OFL) | HUD : « +1 », « +100 CHOUFFINITUDE », « DEAL WITH IT », pastille ON/OFF | Le bitmap des jeux, en petit |

Chargement via `next/font/google` (auto-hébergé, aucune requête vers Google côté visiteur). Comic Neue et Silkscreen ont `preload: false` : ils ne servent que dans les animations.

Échelle : tailles fluides avec `clamp()` (titre héros `clamp(2.9rem, 12vw, 6.8rem)`, tampon `clamp(3rem, 16cqi, 7rem)` en unités de conteneur). Le champ de saisie ne descend jamais sous 16 px (pas de zoom iOS) : il fait 1,6rem sur mobile et 2,6rem sur grand écran.

Texte meme : `text-transform: uppercase`, `-webkit-text-stroke: 0.09em #000` avec `paint-order: stroke fill` (contour extérieur net), plus une ombre `0 0.05em 0 #000` pour l'épaisseur.

### 2.3 Rayons

| Token | Valeur | Usage |
| --- | --- | --- |
| `--radius-tile` | `2px` | Tout ce qui est « pas chouffin » (flat 2013) |
| `--radius-tooltip` | `6px` | Info-bulle d'objet |
| `--radius-button` | `14px` | Boutons glossy |
| `--radius-field` | `22px` | Champ de saisie et sa bordure RGB |
| `--radius-card` | `24px` | Cartes |
| (pilule) | `999px` | Boutons secondaires, badges, succès |

### 2.4 Ombres et matières

| Token ou classe | Définition | Usage |
| --- | --- | --- |
| `--shadow-card` | reflet intérieur 1 px + ombre portée douce `0 24px 60px -24px` | Cartes |
| `--shadow-neon` | liseré noir + halo `0 0 70px -18px` vert | Carte CHOUFFIN |
| `.btn-glossy` | dégradé 4 arrêts, reflet en demi-lune (`::before`), tranche 3D `0 5px 0`, halo coloré | Actions principales |
| `.card-chouffin[data-legendary]` | halo orange | Mots légendaires |
| `.item-tooltip` | fond bleu nuit, liseré argenté, contour noir | Info-bulle d'objet |
| `.achievement` | pilule anthracite glossy + orbe argentée | Succès déverrouillé |

### 2.5 Courbes et durées

| Token | Valeur | Usage |
| --- | --- | --- |
| `--ease-out-expo` | `cubic-bezier(0.16, 1, 0.3, 1)` | Apparitions, barres, morphing |
| `--ease-punch` | `cubic-bezier(0.2, 1.4, 0.3, 1)` | Survol du logo (léger dépassement) |
| `--ease-metro` | `cubic-bezier(0.1, 0.9, 0.2, 1)` | Tuile PAS CHOUFFIN, écran bleu |
| ressort « tampon » | `stiffness 520, damping 19, mass 0.9` | Tampon CHOUFFIN |
| ressort « badge » | `stiffness 420, damping 16` | Badges de verdict |

Durées de référence : 80 ms (appui), 180 à 350 ms (apparitions), 450 à 500 ms (tampons, tuiles), 700 ms (barres), 1,5 à 1,9 s (petites réactions de tribu), 2,6 à 3 s (réactions plein écran et gros combos), 3,4 à 3,7 s (apothéoses légendaires), 4,2 s (succès).

### 2.6 Profondeur (z-index)

| Couche | z | Élément |
| --- | --- | --- |
| Fond | -1 | Ciel étoilé fixe |
| Contenu | auto | Page |
| HUD de lecture | 10 | Barre collante du « C'est pas faux » |
| Réactions | 50 | Combo MLG, écran bleu, NOPE |
| Succès | 60 | Toast « Succès déverrouillé » (au-dessus du combo) |

---

## 3. Composition

- **Accueil = un meme.** Texte du haut « C'EST CHOUFFIN OU PAS ? », le champ au centre comme l'image, texte du bas « LE CHOUFFINDER A TOUJOURS RAISON* », et sa note « *Sauf quand la communauté le contredit ». Derrière, une roue de couleurs rayonnante façon Advice Animals.
- **Après la première recherche**, le héros passe en mode compact (titre sur une ligne, suggestions masquées) avec une View Transition : le titre et le champ glissent à leur nouvelle place, le verdict apparaît dessous.
- **Carte de verdict** : sur-titre, mot entre guillemets, tampon ou tuile, badges éventuels, info-bulle d'objet (rareté et catégorie, jauge, justification dorée), bloc de vote, partage.
- **Mobile d'abord** : colonne unique de 390 px, cibles tactiles de 44 px minimum (56 px pour les actions principales), bouton de soumission pleine largeur sous le champ. Au-delà de 36rem de conteneur (container query `@xl`), le bouton rejoint le champ sur la même ligne.
- **Fond** : ciel étoilé en dégradés radiaux répétés, sur un calque fixe (aucun repaint au défilement), avec des halos violet, vert et rose aux coins.

---

## 4. Catalogue des micro-interactions

Chaque ligne : ce qui déclenche, ce que ça montre, combien de temps, avec quelle courbe, et ce qui reste quand l'utilisateur préfère les animations réduites (`prefers-reduced-motion: reduce`). Les composants Motion sont enveloppés dans `<MotionConfig reducedMotion="user">` : en mouvement réduit, les transformations sont coupées et seules les opacités restent.

### 4.1 Saisie

| Interaction | Déclencheur | Feedback | Durée | Courbe | Mouvement réduit |
| --- | --- | --- | --- | --- | --- |
| Exemples qui défilent | Champ vide | « Genre « Kaamelott » » glisse vers le haut et laisse place au suivant | toutes les 2,4 s, transition 350 ms | out-expo | Fondu enchaîné, sans glissement |
| Bordure RGB | Focus du champ | La bordure arc-en-ciel passe de 50 % à 100 % d'opacité et se met à tourner, halo vert | 6 s par tour, fondu 300 ms | linéaire | Bordure fixe, halo conservé |
| Focus clavier | Tab vers le champ | Contour blanc de 2 px autour de la bordure (`:has(input:focus-visible)`) | instantané | | Identique |
| Soumission vide | Entrée ou bouton sans texte | Le champ tremble horizontalement, message d'aide doré (`role="alert"`) | 420 ms | keyframes | Message seul, pas de tremblement |
| Appui sur un bouton glossy | `:active` | Le bouton s'enfonce de 4 px, la tranche 3D disparaît | 80 ms | ease | Identique (pas de déplacement notable) |
| Suggestion « Essaie : » | Clic sur une pastille | Remplit le champ et lance la recherche | | | Identique |
| Effacer | Bouton « x » dans le champ | Vide le champ et rend le focus | instantané | | Identique |
| Préchargement | Focus du champ ou survol d'une suggestion | Les modules d'animation et le « C'est pas faux » sont téléchargés en avance | invisible | | Identique |

### 4.2 Recherche et chargement

| Interaction | Déclencheur | Feedback | Durée | Courbe | Mouvement réduit |
| --- | --- | --- | --- | --- | --- |
| URL partageable | Soumission | L'URL devient `/?q=mot` (`pushState`, ou `replaceState` si c'est le même mot) | | | Identique |
| Morphing du héros | Première recherche | View Transition : le titre et le champ glissent vers le mode compact | 380 ms | out-expo | Changement direct |
| Chargement | Requête en cours | Bouton « Délibération... » avec rotor, bordure RGB qui s'emballe | tour de bordure 0,9 s, rotor 0,7 s | linéaire | Rotor remplacé par une pulsation d'opacité, bordure fixe |
| Astuce de chargement | Requête de plus de 0,6 s | Carte avec chope qui sautille et astuce absurde | apparition après 600 ms, fondu 350 ms | ease | Chope immobile, apparition sans fondu |
| Arrivée du résultat | Réponse de l'API | La carte monte de 18 px en apparaissant | 320 ms (sortie 180 ms) | out-expo | Fondu seul |
| Recadrage mobile | Résultat sous 60 % de la hauteur d'écran | Défilement doux jusqu'au verdict | natif | smooth | Défilement instantané |

### 4.3 Verdict

| Interaction | Déclencheur | Feedback | Durée | Courbe | Mouvement réduit |
| --- | --- | --- | --- | --- | --- |
| Tampon CHOUFFIN | Verdict chouffin | Le tampon s'écrase depuis 2,4x en tournant (-16° vers -4°), son de coup de tampon grave | environ 450 ms | ressort 520/19 | Fondu du tampon, son conservé si activé |
| Tuile PAS CHOUFFIN | Verdict pas chouffin | La tuile bleue pivote depuis la gauche (tourniquet de tuile), petit « tic-toc » poli | 500 ms | metro | Fondu de la tuile |
| Objet légendaire | `legendary` | Tampon orange, mention pixel « ★ Objet légendaire ★ », halo orange de la carte | avec le tampon | | Identique sans mouvement |
| Jauge de chouffinitude | Affichage du verdict | Les 20 segments s'allument un par un à la couleur de la rareté, le score défile de 0 à sa valeur | 30 ms par segment dès 200 ms, compteur 900 ms | out-expo | Jauge et score affichés directement |
| Badges | `flipped` ou `source === "communaute"` | Pastille qui rebondit en apparaissant | après 350 ms | ressort 420/16 | Fondu |
| Partage | « Partager ce verdict » | Feuille de partage native sur mobile, sinon copie du lien et « Lien copié ! » avec coche | 2,2 s | | Identique |
| Annonce | Tout résultat | Phrase complète dans la région `aria-live="polite"` (« Verdict : « Dragon » est chouffin. Indice de chouffinitude : 88 sur 100. ») | | | Identique |

### 4.4 Réactions surprises

Le tirage est fait par `planSurprise()` (`src/components/easter-eggs/catalog.ts`), une fonction pure partagée par le site et la page de prévisualisation. Les fréquences n'ont pas bougé : 1 fois sur 3 pour un verdict chouffin (toujours si légendaire), 1 fois sur 4 pour un verdict pas chouffin (mesuré sur 10 000 tirages : 32,6 % et 25,1 %).

| Interaction | Déclencheur | Feedback | Durée | Mouvement réduit |
| --- | --- | --- | --- | --- |
| **Easter egg de tribu** | Mot avec une `tribe`, aux fréquences ci-dessus | Animation choisie selon la tribu et le niveau de score (échec, petite réaction, gros combo, légendaire), au moins deux variantes tirées au hasard pour les gros combos et les légendaires. Catalogue complet en 4.9 | 1,5 à 3,7 s, zappable au clic ou Échap | Pas d'animation : toast de succès aux couleurs de la tribu (ou d'échec, liseré rouge) et signature sonore courte si le son est activé |
| **Combo MLG** | Mot sans tribu (neutre ou adopté par la communauté), verdict chouffin, 1 fois sur 3 (toujours si légendaire) | Voir la chronologie ci-dessous, succès déverrouillé en parallèle, léger tremblement de la page (480 ms) | 2,7 s, zappable au clic ou Échap | Pas de combo : seulement le toast de succès (fondu) et un carillon si le son est activé |
| **Écran bleu** | Mot sans tribu, verdict pas chouffin, 1 fois sur 4, une chance sur deux | Panneau bleu « :( », « a rencontré un problème de chouffinitude », pourcentage qui défile, code d'arrêt, trombone triste | 2,6 s, zappable | Rien : le verdict suffit |
| **NOPE** | Mot sans tribu, verdict pas chouffin, 1 fois sur 4, une chance sur deux | « NOPE. » en Impact qui secoue la tête, virevoltant qui traverse l'écran, trombone triste | 2,6 s, zappable | Rien |

**Chronologie du combo MLG** (t = 0 à l'arrivée du verdict) :

| t | Visuel | Son (si activé) |
| --- | --- | --- |
| 0 | Vignette sombre en fondu (120 ms), page qui tremble (480 ms) | Airhorn : court, court, long |
| 0,06 à 0,94 s | 5 hitmarkers (7 si légendaire) à des positions tirées d'une graine | Un « tic » de hitmarker à chaque apparition |
| 0 à 1,3 s | « CHOUFFIN ! » (ou « LÉGENDAIRE ! » en orange) s'écrase depuis 3x, puis coup de zoom à 0,8 s | |
| 0,1 s | Lens flare n° 1 (800 ms) | |
| 0,12 à 2,7 s | 6 projectiles (8 si légendaire) : chips et canettes en parabole avec rotation | |
| 0,3 à 1,15 s | Les lunettes pixel tombent du haut et rebondissent sur le mot | |
| 0,5 à 1,3 s | 5 phrases doge en Comic multicolore, en cascade | |
| 0,75 à 2,45 s | « +100 CHOUFFINITUDE » monte et s'efface | |
| 0,9 s et 1,4 s | Légendaire : « COMBO x3 » qui claque, « 360 NO SCOPE » qui fait un tour complet | |
| 1,05 à 2,35 s | | Basse « wub wub » façon dubstep |
| 1,15 s | « DEAL WITH IT » en pixel | |
| 1,35 s | Lens flare n° 2 (800 ms) | |
| 2,7 s | Fondu de sortie (200 ms) | Coupure douce (80 ms) |

**Sécurité photosensible** : deux lens flares en tout, séparées de 1,25 s, soit moins d'un flash par seconde ; aucun clignotement plein écran, aucune alternance rapide de couleurs. Les hitmarkers sont de petits éléments (44 à 76 px), pas des flashs de zone.

### 4.5 Vote et communauté

| Interaction | Déclencheur | Feedback | Durée | Courbe | Mouvement réduit |
| --- | --- | --- | --- | --- | --- |
| Vote en cours | Clic sur « Pour moi c'est chouffin / pas chouffin » | Rotor dans le bouton, les deux boutons se verrouillent | jusqu'à la réponse | | Pulsation au lieu du rotor |
| Vote compté | Réponse `ok` | « +1 » en pixel doré qui s'envole du bouton, le bouton devient « ✓ Tu as voté chouffin », l'autre s'estompe (40 %), bip montant | « +1 » en 1 s | ease-out | « +1 » en fondu sur place |
| Bras de fer | Nouveaux décomptes | La barre verte (chouffin) contre bleue (pas chouffin) glisse à la nouvelle proportion (`scaleX`) | 700 ms | out-expo | Identique (transition de largeur perçue comme un état) |
| Déjà voté | `alreadyVoted: true` | « Ton vote était déjà compté. Bien essayé, petit malin. » | | | Identique |
| Mémoire locale | Retour sur un mot déjà voté | Les boutons sont verrouillés, « Tu as voté » affiché (`localStorage`, clé `chouffinder:votes`) | | | Identique |
| **Verdict renversé** | Le vote fait basculer `chouffin` | Le tampon bascule en `rotateX` et laisse place à l'autre verdict, tremblement, succès « 30 G · Le peuple a parlé », son « whoosh + ding » | 200 ms + entrée du nouveau verdict | | Fondus, toast, son |
| **Mot adopté** | Un mot inconnu passe `known` | Le « C'est pas faux » laisse place à la carte de verdict avec le badge « Mot adopté par la communauté », succès « 50 G · Parrain d'un mot », carillon | 320 ms | out-expo | Fondus |
| Vote impossible | `votingDisabledReason` | Les boutons sont remplacés par le message de l'API dans un encart doré | | | Identique |
| Erreur de vote | HTTP 400 ou 429 | Le message `error` de l'API, tel quel, en rouge sous les boutons | | | Identique |

### 4.6 « C'est pas faux »

| Interaction | Déclencheur | Feedback | Durée | Courbe | Mouvement réduit |
| --- | --- | --- | --- | --- | --- |
| Titre | Mot inconnu | « C'EST PAS FAUX » arrive en rebondissant (échelle 0,55 vers 1, rotation -5° vers 0) | environ 600 ms | ressort 300/13 | Fondu |
| Chapitre suivant | « Attends, c'est pas fini... » (le libellé change à chaque fois) | Le chapitre apparaît en montant, le focus passe sur lui | 450 ms | out-expo | Fondu, focus identique |
| Temps de lecture | Chaque chapitre | L'estimation grimpe (6 min, 18 min, « 1 h 20 (pause pipi incluse) »... « ∞ (c'est pas faux) ») avec un petit « pop » | ressort 400/18 | | Changement de texte seul |
| Barre qui recule | Chaque chapitre | Le total « apparent » gonfle plus vite que la lecture : la barre recule, avec un commentaire (« Oui, la barre a reculé. C'est normal. ») | 700 ms | out-expo | Identique |
| Fin | Dernier chapitre | Barre à 100 %, « 0 min. C'est fini. Enfin. », « Barre de progression réparée par un clerc de niveau 12 » | | | Identique |
| Sortie de secours | « Trop long ? Aller au vote » (toujours visible dans le HUD collant) | Défilement vers le vote et focus sur son titre | | | Défilement instantané |
| Tout dérouler | « Tout dérouler d'un coup (courage) » | Affiche tous les chapitres | | | Identique |

### 4.7 Mot bloqué, saisie invalide, erreurs

| Interaction | Déclencheur | Feedback | Mouvement réduit |
| --- | --- | --- | --- |
| Mot bloqué | `status: "blocked"` | Carte sobre à liseré rouge, carton rouge dessiné, « Holà, on se calme. », le `message` de l'API, « Ici, on juge des mots, pas des gens. » et « Choisir un autre mot ». **Aucune animation fun, aucun son.** L'URL est nettoyée (`replaceState("/")`) pour ne jamais rendre une insulte partageable. | Identique |
| Saisie invalide | `status: "invalid"` | « Le parchemin est illisible. » + message de l'API, clin d'œil pixel « ERREUR 418 : JE SUIS UNE CHOPE ». URL nettoyée. | Identique |
| Réseau coupé | `fetch` échoue | « Ta connexion a pris une flèche dans le genou. » + « Relancer le dé » | Identique |
| Trop de requêtes | HTTP 429 | « Holà, pas si vite ! » + message de l'API, bouton en recharge 12 s avec balayage conique façon sort de MMORPG | Pas de balayage, texte « Recharge en cours... » |
| Erreur serveur | HTTP 5xx | « Échec critique ! Le serveur a fait 1 au d20 (erreur 500). » + « Relancer le dé » | Identique |

### 4.8 Chrome du site

| Interaction | Déclencheur | Feedback | Durée | Mouvement réduit |
| --- | --- | --- | --- | --- |
| Bouton son | Clic | Icône haut-parleur barrée ou non, pastille pixel OFF/ON, `aria-pressed`, un « tic » de hitmarker à l'activation. Coupé par défaut, mémorisé (`chouffinder:sound`) | instantané | Identique |
| Logo | Survol | La chope pivote de -12° et grossit de 10 % | 200 ms, punch | Pas de rotation (transition CSS neutralisée par la préférence système) |
| Logo | Clic | Retour à l'accueil, champ vidé, morphing inverse du héros | 380 ms | Direct |
| Compteurs | Chargement de `/api/stats`, puis après chaque vote | Les chiffres défilent jusqu'à leur valeur (format français) | 900 ms | Valeurs directes |
| Mode démo | `persistent: false` | « Mode démo : les votes s'envolent au redémarrage du serveur. » | | Identique |

### 4.9 Easter eggs par tribu

Chaque mot de la base peut appartenir à une **tribu de chouffin** (`KnownResult.tribe`). Quand le tirage de 4.4 tombe, l'animation parle la langue de cette tribu, et sa démesure suit le score.

#### 4.9.1 Règles de choix

| Verdict | Niveau | Ce qui sort | Toast de succès en parallèle |
| --- | --- | --- | --- |
| Pas chouffin (0 à 50), 1 fois sur 4 | **Échec thématique** | Une des variantes d'échec de la tribu, plein écran | Non (l'échec se suffit) |
| Chouffin, score 51 à 69, 1 fois sur 3 | **Petite réaction** | Réaction légère sans voile, au-dessus du verdict, qui ne bloque pas les clics (le moindre clic la range et passe au travers) | Non |
| Chouffin, score 70 à 94, 1 fois sur 3 | **Gros combo** | Une variante tirée au hasard (2 ou 3 par tribu), plein écran | Oui, titre propre à la variante |
| Chouffin légendaire (95 à 100), toujours | **Apothéose légendaire** | Une variante tirée au hasard (2 par tribu), plein écran, la plus folle | Oui, 100 G |
| Mot sans tribu | | Réactions d'origine (combo MLG, écran bleu, NOPE) | Comme avant |

Le niveau se lit d'abord sur le drapeau `chouffin` (un vote peut l'avoir renversé), puis sur le score. En **mouvement réduit**, aucune animation n'est montée : le toast de succès prend les couleurs de la tribu (orbe teintée et icône : manette pixel, chapeau pointu, cornes, chope, fleur de cerisier, d20), les échecs ont un liseré rouge et un sur-titre propre (« Échec critique », « Larsen »...), et une signature sonore de moins d'une seconde est jouée si le son est activé. L'échec thématique a donc lui aussi sa version statique (1 fois sur 4, comme en mouvement normal).

Toutes les animations plein écran se zappent au clic et à Échap, coupent leur son en 80 ms, sont `aria-hidden` (le verdict est déjà annoncé par la région `aria-live`) et respectent le budget photosensible de 4.9.8.

#### 4.9.2 Gamers (`gamer`) : montage MLG, arcade, FPS, baston

| Niveau | Variante | Animation | Durée | Son (si activé) | Mouvement réduit |
| --- | --- | --- | --- | --- | --- |
| Échec | Vous êtes mort | Voile noir, bandeau sombre, « VOUS ÊTES MORT » en capitales rouges à empattements qui zooment lentement, « « mot » n'était pas chouffin. », « Chouffinitude perdue : 100 moins le score » | 2,8 s | Coup sourd très grave puis nappe dissonante filtrée | Toast « Game over · Vous êtes mort », descente chiptune |
| Échec | Game over arcade | Lignes de balayage, « GAME OVER » pixel dont les lettres tombent une à une, « Continuer ? » de 9 à 0, « Insère une pièce » qui palpite (1,7 Hz) | 2,8 s | Descente chiptune, bips du décompte | Toast « Game over · Insère une pièce » |
| Petite | Level up | Trois hitmarkers, « +score XP » qui monte, barre d'expérience qui se remplit, « Level up ! » | 1,6 s | Trois hitmarkers, arpège carré montant | Toast « 10 G · Level up », pièce 8 bits |
| Gros combo | Série d'éliminations | Killfeed en haut à droite (le mot élimine le brunch, le padel, les Crocs...), « First blood » puis « Double kill » jusqu'à « Pentakill ! » qui s'écrasent, hitmarkers, tremblements, gerbe de chips et de canettes | 2,8 s | Hitmarkers doublés et coups sourds, airhorn et basse « wub » au pentakill | Toast « 50 G · Pentakill de chouffinitude » |
| Gros combo | Combo de baston | Barres de vie de jeu de baston (le mot contre un toast à l'avocat), « Round 1 », « Fight ! », 12 coups avec étoiles d'impact (« PAF », « BIM »...), compteur « 12 HITS », « K.O. » géant, « Perfect » | 2,9 s | Rafale de coups de poing, gros impact au K.O., petite victoire chiptune | Toast « 50 G · K.O. parfait » |
| Gros combo | Nyan-chope | La chope pixel du logo traverse le ciel avec sa traînée arc-en-ciel en escalier, étoiles pixel, le mot en lettres pixel multicolores qui ondulent, « nyan nyan nyan, very mot » | 2,8 s | Mélodie chiptune originale, basse en triangle | Toast « 30 G · Arc-en-ciel pixelisé » |
| Légendaire | Illuminati confirmé | Montage MLG complet (hitmarkers, chips, lunettes pixel sur « LÉGENDAIRE ! », doge-speak, « Wombo combo »), puis triangle doré à l'œil vert qui tourne sous des rayons, « Illuminati confirmé », « 360 no scope » | 3,4 s | Airhorn, 7 hitmarkers, thérémine inquiétant, basse wub | Toast « 100 G · Illuminati confirmé », double airhorn court |
| Légendaire | Code triche | Écran cathodique, les dix touches ↑ ↑ ↓ ↓ ← → ← → B A s'enfoncent une à une, « Code triche activé ! », « +30 vies », « Chouffinitude infinie », le mot saisi lettre à lettre comme un nom de high score, record qui défile jusqu'à 999999, feux d'artifice pixel | 3,5 s | Un bip par touche, montée de puissance, fanfare chiptune, pétards | Toast « 100 G · Code triche activé » |

#### 4.9.3 Geeks (`geek`) : sorciers, sabres laser, super-héros, science-fiction

| Niveau | Variante | Animation | Durée | Son (si activé) | Mouvement réduit |
| --- | --- | --- | --- | --- | --- |
| Échec | Claquement de doigts | « *snap* », puis le mot part en poussière lettre après lettre (7 grains par lettre qui s'envolent), « « Je ne me sens pas très chouffin... » » | 2,9 s | Claquement de doigts, vent qui retombe | Toast « Snap · Réduit en poussière » |
| Échec | Moldu ! | Le chapeau pointu rapiécé réfléchit (« Hmm... difficile. Très difficile... »), puis crie « MOLDU ! » et s'affaisse, « « mot » n'a jamais reçu sa lettre. » | 2,6 s | « Hmm » nasal, deux cuivres qui descendent | Toast « Choixpeau · Moldu confirmé » |
| Petite | Choixpeau | Le chapeau surgit au-dessus du verdict, hésite, puis répartit le mot dans une maison inventée (« Chouffondor », « Serpentaverne », « Serdaigrog », « Poufsoufflé ») avec quelques étincelles | 1,9 s | « Hmm », accord de cuivres, scintillement | Toast « 10 G · Réparti chez les chouffins » |
| Gros combo | Sabre laser | Ciel étoilé, deux sabres (vert et bleu) s'allument l'un après l'autre et se croisent en X derrière le mot, gerbe d'étincelles au contact, « Que la Chouffe soit avec toi » | 2,8 s | Deux allumages (souffle et bourdonnement), choc, nappe | Toast « 50 G · Que la Chouffe soit avec toi » |
| Gros combo | Pluie de code | Colonnes de katakana et de chiffres verts qui tombent, le mot se déchiffre caractère par caractère, « Tu as pris la pilule chouffin. », pilule « brunch » bleue qui s'éteint, pilule « chouffin » verte qui pulse | 2,9 s | Bips numériques, drone grave, impact | Toast « 50 G · Pilule chouffin avalée » |
| Gros combo | Patronus | « EXPECTO CHOUFFINUM ! », un sanglier argenté lumineux galope depuis la gauche en semant des étincelles, « Ton patronus est un sanglier. Évidemment. » | 2,9 s | Souffle, arpège cristallin, nappe majeure | Toast « 50 G · Expecto chouffinum » |
| Légendaire | Saut en hyperespace | 72 étoiles s'étirent en traînées, saut (un flash bleuté), « Il y a bien longtemps, dans une taverne lointaine, très lointaine... », le mot en contour jaune qui s'éloigne, texte déroulant en perspective (« Épisode » + score en chiffres romains, « Le réveil du chouffin ») | 3,7 s | Montée et souffle, impact, fanfare de cuivres originale | Toast « 100 G · Élu de la prophétie », accord de cuivres |
| Légendaire | Gantelet | Un gantelet doré monte, ses six gemmes s'allument une à une, « *SNAP* », onde de choc et vague dorée, le mot s'écrase en orange, « Parfaitement chouffin, comme toute chose devrait l'être. » | 3,5 s | Six clochettes, claquement, impact, nappe | Toast « 100 G · Parfaitement équilibré » |

#### 4.9.4 Métalleux (`metal`) : festival, pogo, pyrotechnie, solos

| Niveau | Variante | Animation | Durée | Son (si activé) | Mouvement réduit |
| --- | --- | --- | --- | --- | --- |
| Échec | Corde cassée | Six cordes de guitare vibrent, la corde de mi aigu casse en deux et se replie, « LARSEN » rouge qui vibre, « « mot » ? Même l'ampli a démissionné. », la main aux cornes se retourne | 2,8 s | Cordes grattées, « twang » de corde qui casse, larsen, chute grave | Toast « Larsen · Corde cassée » |
| Petite | Cornes du diable | Deux mains aux manchettes cloutées font les cornes et headbanguent de part et d'autre de « \m/ MÉTAL \m/ » | 1,6 s | Accord saturé avec vibrato, petite foule | Toast « 10 G · Cornes levées » |
| Gros combo | Pyrotechnie | Colonnes de flammes en décalé puis toutes ensemble, affiche « Ce soir, en tête d'affiche », le mot en **logo de groupe** (lettres chromées étirées, épines, lame et gouttes rouges), « Tournée mondiale de la chouffinitude » | 2,8 s | Trois accords saturés avec palm mute, souffles de flammes, accord final | Toast « 50 G · Pyrotechnie approuvée » |
| Gros combo | Pogo | Poursuites de scène, foule en silhouettes qui saute, une chope qui slamme, « POGO ! », puis « MUR DE LA MORT ! » : la foule s'écarte et se rentre dedans, logo du mot « dans la fosse » | 3 s | Riff original en croches, grosse caisse, foule, impact | Toast « 50 G · Survivant du pogo » |
| Légendaire | Solo légendaire | Guitare en V qui arrive en tournoyant, notes qui s'envolent, deux éclairs, rayons rouges, « Solo de » + logo du mot qui headbangue, flammes, « \m/ Légendaire \m/ » | 3,4 s | Accord, solo rapide (16 notes saturées), note tenue avec bend, accord final, larsen | Toast « 100 G · Dieu du riff » |
| Légendaire | Ampli à 11 | Tête d'ampli et baffles, potard « Volume » qui monte de 1 à 10 puis passe à 11, les haut-parleurs pompent, ondes de choc, « Ce mot monte jusqu'à 11 », logo du mot, « Légendaire » | 3,5 s | Ronflement d'ampli, crans du potard, accord monstrueux, larsen, foule | Toast « 100 G · Monté jusqu'à 11 » |

#### 4.9.5 Taverne (`taverne`) : bière, hydromel, banquet, le gras

| Niveau | Variante | Animation | Durée | Son (si activé) | Mouvement réduit |
| --- | --- | --- | --- | --- | --- |
| Échec | Dernière tournée | Panneau de bois « FERMÉ · Dernière tournée servie » qui tombe et se balance au bout de ses chaînes, chope vide qui bascule et laisse tomber une dernière goutte, « Dernière tournée... et « mot » n'est pas sur la liste. » | 2,8 s | Cloche de comptoir, grincements, « plic », deux cuivres tristes | Toast « Dernière tournée · Le tavernier a dit non » |
| Petite | Santé ! | Deux chopes arrivent de chaque côté, trinquent, éclaboussure de mousse, « SANTÉ ! » | 1,5 s | Double tintement de verre, petite foule | Toast « 10 G · Santé ! » |
| Gros combo | Tournée générale | Comptoir en bois, six chopes glissent jusqu'à leur place, se remplissent, leur mousse gonfle, puis elles se lèvent ensemble, « TOURNÉE GÉNÉRALE ! », « C'est « mot » qui régale. » | 2,9 s | Glissements, bière qui coule, pétillement, trois tintements, acclamations | Toast « 50 G · Tournée générale » |
| Gros combo | Le gras, c'est la vie | Jambon à la broche qui tourne sur lui-même au-dessus des flammes, gouttes de gras, reflets, « LE GRAS, C'EST LA VIE. », « « mot » : validé par le cuisinier. » | 2,9 s | Friture qui crépite, gigue de taverne, clochette | Toast « 50 G · Le gras, c'est la vie » |
| Gros combo | La mousse déborde | Chope géante qui se remplit, bulles, la mousse déborde et coule le long du verre, « Santé ! » dans dix langues (« Prost ! », « Skål ! », « Sláinte ! », « Kanpai ! »...) | 2,8 s | Bière qui coule, pétillement, tintement, foule | Toast « 50 G · Mousse parfaite » |
| Légendaire | Banquet des dieux | Rayons dorés, lustre à bougies qui se balance, le mot « est convié au banquet des dieux », table du banquet (chopes et jambon), deux « SKÅL ! » où toutes les chopes se lèvent, pluie de pièces | 3,5 s | Gigue originale avec bourdon de cornemuse, deux trinquées et acclamations | Toast « 100 G · Convié au banquet des dieux », cloche et tintements |
| Légendaire | Tournée du patron | Cloche de comptoir qui sonne, « TOURNÉE DU PATRON ! », « Hydromel à volonté pour » + le mot, « Légendaire · offert par la maison », pluie de pièces et de chopes | 3,4 s | Trois coups de cloche, pluie de pièces, foule, gigue | Toast « 100 G · Tournée du patron » |

#### 4.9.6 Weebs (`weeb`) : mangas, animés, Japon, kawaii

| Niveau | Variante | Animation | Durée | Son (si activé) | Mouvement réduit |
| --- | --- | --- | --- | --- | --- |
| Échec | Goutte de sueur | Lignes de déprime qui tombent sur le haut de l'écran, goutte de sueur géante qui glisse à côté du mot, « ... » un point après l'autre, « (´・ω・`) », « Sérieusement ? Pas chouffin. Même pas un peu, baka. » | 2,6 s | « Bloop », sifflet qui descend, trois notes gênées | Toast « Goutte de sueur · Baka... » |
| Échec | Table retournée | « (╯°□°)╯ » et la table « ︵ ┻━┻ » qui s'envole en tournoyant, « PAS CHOUFFIN !! » en lettres de manga, puis « ┬─┬ノ( º _ ºノ) » : on range la table | 2,6 s | Souffle, fracas, clochettes du rangement | Toast « (╯°□°)╯︵ ┻━┻ · Table retournée » |
| Petite | Kawaii | Étincelles, cœurs qui montent, « (◕‿◕✿) » et « kawaii~ ♡ » en Comic rose | 1,6 s | « Pyon » montant, scintillement, clochette | Toast « 10 G · Kawaii certifié » |
| Gros combo | NANI ?! | Sous-titre tapé « « Omae wa mou... chouffin. » » sur fond noir, puis case de manga (crème, trame, lignes de vitesse), « NANI ?! » géant qui secoue, le mot dessous, « ゴ » violets menaçants autour | 2,8 s | Frappe du sous-titre, stinger de cuivres graves, grondement en trémolo | Toast « 50 G · Nani ?! » |
| Gros combo | Transformation | Fond rose et violet, trois rubans qui se dessinent en tourbillon, le mot tourne sur lui-même puis devient « mot-chan ✦ » devant un cœur, « Par le pouvoir de la chouffinitude ! », « Transformation ! » | 2,9 s | Arpèges cristallins, nappes majeures, clochette | Toast « 50 G · Transformation réussie » |
| Légendaire | Plus de 9000 | Aura dorée qui enfle autour du mot, particules de ki qui montent, jauge de ki qui se remplit, détecteur vert « Niveau de chouffinitude » qui grimpe jusqu'à 9001 puis se fissure, ondes de choc, « C'EST PLUS DE 9000 !!! » | 3,5 s | Charge qui monte, explosion, accord de cuivres | Toast « 100 G · Plus de 9000 ! » |
| Légendaire | Senpai a remarqué | Tempête de pétales de cerisier, grand cœur qui bat (doki doki), « Senpai a remarqué » + le mot en orange légendaire, « !!! », « (⁄ ⁄>⁄ ▽ ⁄<⁄ ⁄) », « doki doki, légendaire » | 3,4 s | Progression pop IV-V-iii-vi à la clochette (mélodie originale), battements de cœur, scintillement | Toast « 100 G · Senpai t'a remarqué » |

#### 4.9.7 Rôlistes (`roliste`) : JdR, d20, médiéval, Table Ronde

Le d20 est un **vrai icosaèdre en 3D CSS** (`src/components/easter-eggs/D20.tsx`) : 12 sommets calculés, 20 faces triangulaires placées en `matrix3d`, éclairage figé par face, faces opposées qui totalisent 21 comme sur un vrai dé. La face du résultat regarde l'écran au repos : le dé tombe, rebondit et roule depuis une rotation quelconque jusqu'à s'arrêter pile dessus. Le chiffre du résultat est plus gros et teinté.

| Niveau | Variante | Animation | Durée | Son (si activé) | Mouvement réduit |
| --- | --- | --- | --- | --- | --- |
| Échec | Échec critique | Table de jeu (feutrine et quadrillage), le d20 gris roule et s'arrête sur **1** (chiffre rouge), « ÉCHEC CRITIQUE », « 1 naturel », une phrase tirée au hasard (« Tu glisses sur « mot » et tu perds ton tour. »...) | 2,9 s | Dé qui roule et s'arrête, deux cuivres qui descendent | Toast « Échec critique · 1 naturel » |
| Petite | Parchemin | Un parchemin se déroule au-dessus du verdict (les deux rouleaux s'écartent), « Le Maître du Jeu approuve », « +score points d'expérience », le sceau de cire rouge s'écrase dessus | 1,9 s | Froissements de papier, coup de tampon, clochette | Toast « 10 G · Approuvé par le MJ » |
| Gros combo | Jet de d20 | Le d20 bleu roule et s'arrête entre 15 et 19, halo, « RÉUSSITE ! », « Jet de chouffinitude : jet + bonus = total », « +score XP · Niveau supérieur » | 2,9 s | Dé qui roule, arpège de clochettes, accord de cuivres | Toast « 50 G · Jet réussi » |
| Gros combo | Adoubement | Salle de château, deux bannières à la chope tombent, deux trompettes de héraut entrent avec leurs flammes à damier, notes qui s'envolent, « Relève-toi, Sire » + le mot, l'épée descend et touche deux fois l'épaule, « Chevalier de l'Ordre de la Chouffe », « « C'est pas faux. » » | 3 s | Fanfare de héraut originale, deux « ting » d'épée, accord | Toast « 50 G · Chevalier de la Chouffe » |
| Légendaire | 20 naturel | Le d20 doré roule plus longtemps et s'arrête sur **20**, halo et rayons dorés, pluie de petits d20, « COUP CRITIQUE ! », « 20 naturel · « mot » », « Le MJ en lâche ses dés. Légendaire. » | 3,6 s | Dé qui roule, impact, grande fanfare en accords, nappe, scintillement | Toast « 100 G · Coup critique ! », fanfare de héraut |
| Légendaire | Blason | « Oyez, oyez ! », un écu tombe, ses quartiers se colorent un à un (gueules, or, azur, sinople) avec leurs meubles (chope, couronne, d20, cône de houblon), la couronne tombe dessus, la devise « Chouffinus maximus » se déroule, le mot s'écrase, « Suzerain de la taverne · On en a gros ! » | 3,5 s | Fanfare de héraut, quatre coups sourds, clochette de la couronne, froissement, accord final | Toast « 100 G · Suzerain de la taverne » |

#### 4.9.8 Budget photosensible

Règle maison : **au plus deux flashs par animation, espacés d'au moins 0,5 s**, opacité plafonnée à 0,6 et jamais de flash rouge saturé. Les flammes, cœurs et auras pulsent en échelle, pas en luminosité. Les petits clignotements (curseur, « Insère une pièce ») restent sous 2 Hz et sur une petite surface.

| Animation | Événements lumineux |
| --- | --- |
| Série d'éliminations, Combo de baston, Code triche, Sabre laser, Gantelet, Ampli à 11, Plus de 9000, 20 naturel | 1 flash doux (opacité 0,22 à 0,4) |
| Illuminati confirmé | Lens flare à 0,1 s, flash à 1,2 s, lens flare à 2,4 s (plus d'une seconde entre chaque) |
| Saut en hyperespace | 1 flash bleuté (0,45) au moment du saut |
| Solo légendaire | 1 flash (0,28) et deux éclairs fins à 0,3 s d'écart (2 événements par seconde au maximum) |
| NANI ?! | Une transition vers la case de manga claire (fondu de 140 ms), puis retour au sombre à la sortie |
| Toutes les autres | Aucun |

#### 4.9.9 Architecture et performance

- `catalog.ts` (bundle principal, données pures) : niveaux, variantes, durées, toasts, mots d'exemple et `planSurprise()`.
- `EggLayer.tsx` : une seule couche d'overlay, `React.lazy` pour chaque tribu. Le module d'une tribu n'est téléchargé que lorsqu'un verdict la désigne (`preloadTribe` au moment du tirage) : **9 à 13 Ko gzip par tribu**, jamais dans le bundle initial de `/`.
- `kit.tsx` : la scène commune (`Stage` : minuteur, Échap et clic, son coupé au zapping, pastille « Clic ou Échap pour passer » lisible sur tous les fonds), textes qui claquent, particules à graine (rendu pur), tremblements, flashs comptés, rayons, flammes.
- Sons : `src/lib/client/synth.ts` (briques : accords saturés, cuivres, cloches, dés, foule, larsen...) et un module de recettes par tribu dans `src/lib/client/tribe-sounds/`, chargé avec l'animation (ou seul pour la signature du mode réduit, et seulement si le son est activé).
- Tout est animé en `transform` et `opacity` (plus `clip-path` pour les dévoilements et `pathLength` pour les traits SVG). Les positions aléatoires sont tirées d'une graine (`usePlan`), jamais pendant le rendu.

#### 4.9.10 Page de prévisualisation

`/dev/easter-eggs` (404 en production, `noindex`) : une grille tribu × niveau × variante avec de vrais mots de la base par niveau, un bouton « Au hasard » par niveau, les réactions sans tribu, un champ pour afficher n'importe quel mot, une case « Simuler le mouvement réduit », un simulateur de verdict aux vraies fréquences et un bouton qui vérifie les fréquences sur 10 000 tirages. Les captures automatiques passent par `?play=tribu.niveau.variante&word=...&reduced=1`.

---

## 5. Son

- **Coupé par défaut.** Le bouton « Son » est dans l'en-tête, sa valeur est mémorisée en `localStorage`. Le contexte audio n'est créé qu'au premier geste (clic sur « Son ») pour respecter les politiques d'autoplay, iOS compris.
- **100 % synthétisé** (`src/lib/sound.ts`) : oscillateurs, bruit blanc, filtres, saturation, compresseur de sortie. Aucun fichier audio.
- **Palette** : airhorn (accord fa-la-do en dents de scie désaccordées), hitmarker (bruit filtré + bip carré de 35 ms), basse dubstep (LFO sur filtre passe-bas), coup de tampon (sinus 160 vers 42 Hz), « tic-toc » plat, trombone triste (4 notes, filtre wah, vibrato), carillon de succès, bip de vote, bascule (souffle + ding).
- **Palettes des tribus** (`src/lib/client/tribe-sounds/*`, briques dans `src/lib/client/synth.ts`, chargées avec l'animation) : chiptune et coups de baston (gamer) ; allumage de sabre, claquement de doigts, « hmm » du chapeau, fanfare spatiale originale (geek) ; accords saturés, palm mute, solo, larsen, corde qui casse (métal) ; verres qui trinquent, bière qui coule, friture, cloche de comptoir, gigue avec bourdon (taverne) ; stinger dramatique, grondement « ゴゴゴ », charge de ki, progression pop à la clochette (weeb) ; d20 qui roule, parchemin, sceau, fanfares de héraut (rôliste). Toutes les mélodies sont originales : on cite le genre (fanfare, chiptune, riff), jamais un thème existant.
- **Zapper coupe le son** : chaque réaction garde une poignée `stop()` qui ferme son bus en 80 ms (`playRecipe` donne un bus par recette).

---

## 6. Accessibilité

- `lang="fr"`, structure sémantique (`header`, `main`, `footer`, `form role="search"`, `article` par résultat, titres hiérarchisés).
- Une seule région `aria-live="polite"` annonce chaque verdict, adoption, renversement ou erreur en phrase complète. Les toasts et les réactions plein écran sont `aria-hidden` (redondants).
- Jauge en `role="meter"` avec `aria-valuetext` (« 88 sur 100, rareté épique »), progression de lecture en `role="progressbar"`.
- Focus visibles partout (contour vert de 3 px), navigation clavier complète, Échap ferme les réactions, le focus suit les nouveaux chapitres.
- `prefers-reduced-motion` respecté à trois niveaux : `MotionConfig reducedMotion="user"`, règles CSS dédiées (rotations, tremblement, View Transitions, rotor), et logique applicative (pas de combo ni de réaction plein écran ; pour les tribus, un toast statique thématique à la place, voir 4.9.1).
- Budget photosensible : au plus deux flashs par animation, espacés d'au moins 0,5 s (détail en 4.9.8).
- Les réactions légères (petites réactions de tribu) ne bloquent jamais un clic : elles sont en `pointer-events: none` et se rangent au premier appui.
- Contraste AA minimum partout (voir 2.1).
- Cibles tactiles de 44 px minimum, champ à 16 px minimum.

---

## 7. Performance

- Les réactions (`MlgCombo`, `SadReaction`) et le « C'est pas faux » sont des modules chargés à la demande (`React.lazy`), préchargés dès le focus du champ.
- Chaque tribu est un module séparé (9 à 13 Ko gzip, sons compris), téléchargé seulement quand un verdict la désigne. Aucun n'est dans le bundle initial de `/`.
- Motion est chargé en mode `LazyMotion` + `domAnimation` + composants `m` (bundle réduit).
- Animations sur `transform`, `opacity` et `clip-path` ; les compteurs écrivent via des MotionValues sans re-rendu React.
- Fond étoilé sur un calque fixe, aucune image bitmap dans l'interface (tout est SVG ou CSS).
- La page est prérendue statiquement : seul le petit composant qui lit `?q=` (`QuerySync`, sous `<Suspense>`) bascule en rendu client.

---

## 8. Carte des fichiers

| Fichier | Rôle |
| --- | --- |
| `src/app/globals.css` | Tokens `@theme`, classes de matière (glossy, meme, tampon, tuile, info-bulle, flare, succès, orbes de tribu, rayons, lignes de vitesse, trame de manga, parchemin, bois, logo de métal), keyframes, règles de mouvement réduit |
| `src/app/layout.tsx` | Polices, métadonnées, Open Graph, `lang="fr"` |
| `src/app/page.tsx` | Point d'entrée |
| `src/app/opengraph-image.tsx`, `apple-icon.tsx`, `icon.svg`, `favicon.ico` | Image de partage et icônes générées |
| `src/components/ChouffinderApp.tsx` | Orchestration : états, URL, surprises, annonces |
| `src/components/QuerySync.tsx` | Lecture de `?q=` sous Suspense |
| `src/components/SearchForm.tsx`, `RotatingPlaceholder.tsx` | Le champ et ses exemples |
| `src/components/VerdictCard.tsx`, `ChouffinGauge.tsx`, `VotePanel.tsx` | Verdict, jauge, vote |
| `src/components/CestPasFaux.tsx` | L'écran des mots inconnus |
| `src/components/MlgCombo.tsx`, `SadReaction.tsx`, `AchievementToast.tsx` | Réactions sans tribu et succès (orbe aux couleurs de la tribu) |
| `src/components/easter-eggs/catalog.ts` | Catalogue tribu × niveau × variante, durées, toasts, tirage `planSurprise()` |
| `src/components/easter-eggs/EggLayer.tsx`, `useSurprises.ts` | Couche d'overlay (chargement paresseux par tribu) et application d'un plan de surprise |
| `src/components/easter-eggs/kit.tsx` | Scène commune, textes, particules, tremblements, flashs comptés, flammes |
| `src/components/easter-eggs/tribes/*.tsx` | Les animations de chaque tribu (un module chacune) |
| `src/components/easter-eggs/D20.tsx` | Le d20 en 3D CSS |
| `src/components/easter-eggs/icons.tsx` | Icônes de tribu (toast, prévisualisation) |
| `src/components/dev/EasterEggLab.tsx`, `src/app/dev/easter-eggs/page.tsx` | Page de prévisualisation (404 en production) |
| `src/components/Notices.tsx`, `LoadingCard.tsx` | Bloqué, invalide, erreurs, chargement |
| `src/components/art.tsx` | Illustrations SVG (chope, lunettes, hitmarker, chips, canette, trophée, carton rouge, virevoltant, icônes) |
| `src/hooks/usePreferences.ts` | Son et votes mémorisés (`useSyncExternalStore`) |
| `src/lib/client/*` | Client API, stockage local, textes d'interface |
| `src/lib/sound.ts` | Synthèse sonore WebAudio, primitives et `playRecipe` |
| `src/lib/client/synth.ts`, `src/lib/client/tribe-sounds/*` | Briques de synthèse et recettes sonores par tribu (chargées à la demande) |
| `public/og/` | Polices OFL (et leurs licences) pour l'image Open Graph |
