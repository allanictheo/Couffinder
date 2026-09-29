# Direction artistique de Chouffinder

> **Montage 2012, rendu 2026.** Les codes visuels et sonores de l'internet geek de 2010 à 2015, exécutés avec la rigueur d'une interface d'aujourd'hui : accessible, rapide, mobile d'abord.

L'analyse culturelle qui justifie chaque référence est dans [`culture-geek-2010-2015.md`](./culture-geek-2010-2015.md).

---

## 1. Principes

1. **Le calme avant le combo.** L'état de repos est net et lisible : un grand meme (texte du haut, champ au milieu, texte du bas) sur fond de nuit étoilée. Le chaos est réservé aux moments qui le méritent.
2. **Le « parfois » compte.** Le combo MLG ne sort qu'une fois sur trois pour un mot chouffin (toujours pour un mot légendaire), la réaction triste une fois sur quatre pour un mot pas chouffin. La rareté fait la surprise.
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

Durées de référence : 80 ms (appui), 180 à 350 ms (apparitions), 450 à 500 ms (tampons, tuiles), 700 ms (barres), 2,6 à 2,7 s (réactions plein écran), 4,2 s (succès).

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

| Interaction | Déclencheur | Feedback | Durée | Mouvement réduit |
| --- | --- | --- | --- | --- |
| **Combo MLG** | Verdict chouffin, 1 fois sur 3 (toujours si légendaire) | Voir la chronologie ci-dessous, succès déverrouillé en parallèle, léger tremblement de la page (480 ms) | 2,7 s, zappable au clic ou Échap | Pas de combo : seulement le toast de succès (fondu) et un carillon si le son est activé |
| **Écran bleu** | Verdict pas chouffin, 1 fois sur 4, une chance sur deux | Panneau bleu « :( », « a rencontré un problème de chouffinitude », pourcentage qui défile, code d'arrêt, trombone triste | 2,6 s, zappable | Rien : le verdict suffit |
| **NOPE** | Verdict pas chouffin, 1 fois sur 4, une chance sur deux | « NOPE. » en Impact qui secoue la tête, virevoltant qui traverse l'écran, trombone triste | 2,6 s, zappable | Rien |

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

---

## 5. Son

- **Coupé par défaut.** Le bouton « Son » est dans l'en-tête, sa valeur est mémorisée en `localStorage`. Le contexte audio n'est créé qu'au premier geste (clic sur « Son ») pour respecter les politiques d'autoplay, iOS compris.
- **100 % synthétisé** (`src/lib/sound.ts`) : oscillateurs, bruit blanc, filtres, saturation, compresseur de sortie. Aucun fichier audio.
- **Palette** : airhorn (accord fa-la-do en dents de scie désaccordées), hitmarker (bruit filtré + bip carré de 35 ms), basse dubstep (LFO sur filtre passe-bas), coup de tampon (sinus 160 vers 42 Hz), « tic-toc » plat, trombone triste (4 notes, filtre wah, vibrato), carillon de succès, bip de vote, bascule (souffle + ding).
- **Zapper coupe le son** : chaque réaction garde une poignée `stop()` qui ferme son bus en 80 ms.

---

## 6. Accessibilité

- `lang="fr"`, structure sémantique (`header`, `main`, `footer`, `form role="search"`, `article` par résultat, titres hiérarchisés).
- Une seule région `aria-live="polite"` annonce chaque verdict, adoption, renversement ou erreur en phrase complète. Les toasts et les réactions plein écran sont `aria-hidden` (redondants).
- Jauge en `role="meter"` avec `aria-valuetext` (« 88 sur 100, rareté épique »), progression de lecture en `role="progressbar"`.
- Focus visibles partout (contour vert de 3 px), navigation clavier complète, Échap ferme les réactions, le focus suit les nouveaux chapitres.
- `prefers-reduced-motion` respecté à trois niveaux : `MotionConfig reducedMotion="user"`, règles CSS dédiées (rotations, tremblement, View Transitions, rotor), et logique applicative (pas de combo ni de réaction plein écran).
- Contraste AA minimum partout (voir 2.1).
- Cibles tactiles de 44 px minimum, champ à 16 px minimum.

---

## 7. Performance

- Les réactions (`MlgCombo`, `SadReaction`) et le « C'est pas faux » sont des modules chargés à la demande (`React.lazy`), préchargés dès le focus du champ.
- Motion est chargé en mode `LazyMotion` + `domAnimation` + composants `m` (bundle réduit).
- Animations sur `transform`, `opacity` et `clip-path` ; les compteurs écrivent via des MotionValues sans re-rendu React.
- Fond étoilé sur un calque fixe, aucune image bitmap dans l'interface (tout est SVG ou CSS).
- La page est prérendue statiquement : seul le petit composant qui lit `?q=` (`QuerySync`, sous `<Suspense>`) bascule en rendu client.

---

## 8. Carte des fichiers

| Fichier | Rôle |
| --- | --- |
| `src/app/globals.css` | Tokens `@theme`, classes de matière (glossy, meme, tampon, tuile, info-bulle, flare, succès), keyframes, règles de mouvement réduit |
| `src/app/layout.tsx` | Polices, métadonnées, Open Graph, `lang="fr"` |
| `src/app/page.tsx` | Point d'entrée |
| `src/app/opengraph-image.tsx`, `apple-icon.tsx`, `icon.svg`, `favicon.ico` | Image de partage et icônes générées |
| `src/components/ChouffinderApp.tsx` | Orchestration : états, URL, surprises, annonces |
| `src/components/QuerySync.tsx` | Lecture de `?q=` sous Suspense |
| `src/components/SearchForm.tsx`, `RotatingPlaceholder.tsx` | Le champ et ses exemples |
| `src/components/VerdictCard.tsx`, `ChouffinGauge.tsx`, `VotePanel.tsx` | Verdict, jauge, vote |
| `src/components/CestPasFaux.tsx` | L'écran des mots inconnus |
| `src/components/MlgCombo.tsx`, `SadReaction.tsx`, `AchievementToast.tsx` | Réactions et succès |
| `src/components/Notices.tsx`, `LoadingCard.tsx` | Bloqué, invalide, erreurs, chargement |
| `src/components/art.tsx` | Illustrations SVG (chope, lunettes, hitmarker, chips, canette, trophée, carton rouge, virevoltant, icônes) |
| `src/hooks/usePreferences.ts` | Son et votes mémorisés (`useSyncExternalStore`) |
| `src/lib/client/*` | Client API, stockage local, textes d'interface |
| `src/lib/sound.ts` | Synthèse sonore WebAudio |
| `public/og/` | Polices OFL (et leurs licences) pour l'image Open Graph |
