# La culture geek et internet de 2010 à 2015, et ce qu'en fait Chouffinder

Ce document sert de mémoire culturelle au design de Chouffinder. Pour chaque code de l'époque, on note trois choses :

1. **pourquoi c'était drôle ou reconnaissable** ;
2. **comment le citer sans le copier** (pas d'asset protégé, pas de logo, pas de photo de personne réelle) ;
3. **comment on le modernise** dans l'interface.

Le fil rouge : le chouffin (terme du forum 18-25 de jeuxvideo.com) est un personnage de cette époque. Il a grandi avec Kaamelott, le Seigneur des Anneaux en version longue, WoW, Skyrim, les montages MLG et Joueur du Grenier. Un site qui le juge doit parler sa langue visuelle, avec tendresse.

---

## 1. Pourquoi cette époque est si particulière

Entre 2010 et 2015, internet change de mains. Les forums et les blogs laissent la place à YouTube, Reddit, Tumblr et Facebook, mais la culture reste artisanale : les memes sont faits sur Paint ou sur des générateurs en ligne, avec les mêmes polices (Impact, Comic Sans), les mêmes gabarits et les mêmes sons. C'est cette **pauvreté assumée des moyens** qui crée la complicité : tout le monde reconnaît le gabarit, donc la blague tient en une image.

Deuxième trait : **l'ironie en couches**. On utilise Comic Sans parce que c'est moche, on met des lens flares partout parce que c'est trop, on célèbre un tir raté comme un exploit (MLG). L'excès est la blague.

Troisième trait : c'est **l'âge d'or des interfaces de jeu** comme objets culturels. Le « Succès déverrouillé » de la console de salon, le toast de la plateforme de jeux PC, la couleur des objets légendaires dans les MMORPG, l'écran de chargement avec son astuce inutile : ce sont des micro-interactions que toute une génération sait lire instantanément.

---

## 2. Les codes, un par un

### 2.1 MLG et les « Montage Parodies » (2013 à 2015)

**Ce que c'était.** Des parodies de montages de joueurs de FPS (« Major League Gaming ») : chaque action banale est célébrée comme un exploit, avec hitmarkers, airhorn, zoom brutal, lens flares, lunettes pixel « Deal With It » qui tombent, chips triangulaires et soda fluo, textes « 360 NO SCOPE », « WOMBO COMBO », tremblement d'écran, saturation, dubstep. Le tout en quelques secondes.

**Pourquoi c'était drôle.** Le décalage entre la banalité du contenu et la démesure de la célébration. Et la surcharge sensorielle : trop d'effets, trop vite, trop fort. C'est une moquerie affectueuse de la culture « gamer » par elle-même.

**Comment on le cite.**
- Hitmarkers dessinés en SVG (quatre traits blancs cerclés de noir), pas de capture de jeu.
- Airhorn **synthétisé en WebAudio** : accord de dents de scie désaccordées et saturées, rythme court, court, long. Aucun sample.
- Chips triangulaires génériques orange et canette « FLUO » verte, sans aucune marque. On garde la silhouette et la couleur, qui suffisent à la reconnaissance.
- Lunettes pixel dessinées à la main en grille de pixels (24 x 5), reconnaissables par leur marche d'escalier et leurs deux reflets.
- « DEAL WITH IT », « 360 NO SCOPE », « COMBO x3 » : des phrases, pas des assets.

**Comment on le modernise.**
- Tout est animé sur `transform` et `opacity` avec Motion, sans vidéo ni GIF.
- Le combo dure 2,7 secondes et se zappe au clic ou avec Échap.
- **Le « parfois »** : il ne se déclenche qu'une fois sur trois pour un mot chouffin, et toujours pour un mot légendaire. C'est la rareté qui fait la surprise, exactement comme dans les montages où le moment MLG arrive au pire instant.
- Photosensibilité : deux lens flares seulement, espacées de plus d'une seconde, aucun clignotement plein écran, et rien du tout si l'utilisateur préfère les animations réduites.

### 2.2 Doge (2013)

**Ce que c'était.** Un Shiba Inu au regard en coin, entouré de pensées en Comic Sans multicolore : « such wow », « very scare », « much doge ». Une grammaire anglaise volontairement cassée (« such », « very », « much », « so », « many » suivis d'un seul mot).

**Pourquoi c'était drôle.** La voix intérieure naïve et émerveillée, la typographie honnie utilisée avec sincérité, les couleurs criardes éparpillées.

**Comment on le cite.** Pas de photo du chien (c'est une photo d'un animal réel, avec des droits). On garde seulement **la grammaire et la typographie** : « such chouffin », « very kaamelott », « much hydromel », « wow ». Police : Comic Neue (libre, OFL), repli sur Comic Sans MS.

**Comment on le modernise.** Les phrases sont positionnées en périphérie pour ne jamais masquer le verdict, apparaissent en cascade (200 ms d'écart) avec un léger rebond, et reçoivent une ombre portée pour rester lisibles sur n'importe quel fond. La position est tirée d'une graine pseudo-aléatoire : deux combos ne se ressemblent jamais, mais le rendu reste pur (compatible React 19).

### 2.3 Les « image macros » et la police Impact (2008 à 2013)

**Ce que c'était.** Texte blanc en capitales Impact, contour noir, en haut et en bas d'une image (« TOP TEXT / BOTTOM TEXT »). Les « Advice Animals » ajoutaient un fond en roue de couleurs rayonnante.

**Pourquoi c'était drôle.** Le gabarit est instantanément reconnaissable, le rythme « setup en haut, chute en bas » est une mécanique comique parfaite.

**Comment on le cite.** L'accueil est **construit comme un meme** : texte du haut « C'EST CHOUFFIN OU PAS ? », l'« image » au milieu est le champ de saisie, texte du bas « LE CHOUFFINDER A TOUJOURS RAISON* ». Derrière, une roue de couleurs rayonnante très atténuée tourne lentement. Police Anton (libre), repli sur Impact.

**Comment on le modernise.** Le contour est fait avec `-webkit-text-stroke` et `paint-order: stroke fill` (contour net, sans empâter les lettres), la roue est un `repeating-conic-gradient` masqué en radial, animée en rotation GPU et figée en mouvement réduit. L'astérisque du texte du bas est la vraie chute : « *Sauf quand la communauté le contredit », qui annonce la fonction de vote.

### 2.4 Rage comics, trollface et consorts (2010 à 2012)

**Ce que c'était.** Des BD en quatre cases dessinées sous Paint, avec des visages codifiés (« Y U NO », « Me gusta », « Forever alone », « Challenge accepted », trollface).

**Pourquoi c'était drôle.** Un vocabulaire d'émotions universelles et exagérées, accessible à n'importe qui sachant tenir une souris.

**Pourquoi on ne l'utilise pas tel quel.** Plusieurs de ces visages ont un auteur identifié qui a fait valoir ses droits (le trollface notamment). On **ne redessine aucun de ces visages**. On garde l'esprit « émotion exagérée en réaction à un verdict » via d'autres codes libres de droits : l'écran bleu au smiley « :( » et le « NOPE. » en Impact.

### 2.5 L'écran bleu au smiley triste (2012)

**Ce que c'était.** Avec le passage au flat design, l'écran d'erreur fatale d'un grand système d'exploitation de bureau a troqué son texte technique contre un énorme « :( » et une phrase polie, puis un pourcentage qui progresse.

**Pourquoi c'était drôle.** La politesse désolée face à une catastrophe. Le contraste entre la gravité de la situation et le ton calme.

**Comment on le cite.** Un panneau bleu plat, un « :( » en graisse légère, un texte original (« « Brunch » a rencontré un problème de chouffinitude et doit redémarrer ») et un « Code d'arrêt : PAS_CHOUFFIN_EXCEPTION ». Aucun logo, aucune reprise du texte d'origine.

**Comment on le modernise.** C'est l'une des deux réactions « pas chouffin », déclenchée une fois sur quatre seulement, zappable, absente en mouvement réduit.

### 2.6 « NOPE » et le trombone triste

**Ce que c'était.** « Nope » en capitales pour refuser quelque chose avec emphase, et le « wah wah wah waaah » du trombone pour souligner un échec.

**Comment on le cite.** « NOPE. » en Impact avec un hochement de tête horizontal, un virevoltant (buisson roulant de western) dessiné en SVG qui traverse l'écran, et un trombone **synthétisé** : quatre notes descendantes, filtre « wah » et vibrato sur la dernière.

### 2.7 Les succès de console et les toasts de plateforme (2005 à 2015)

**Ce que c'était.** Une pastille qui glisse en bas de l'écran : un rond avec un trophée, puis « Succès déverrouillé » et un nombre de points. Un son reconnaissable entre mille.

**Pourquoi c'était drôle (et addictif).** La récompense arbitraire pour des actions insignifiantes. Débloquer « 10 G : a regardé les crédits » est absurde et gratifiant à la fois.

**Comment on le cite.** Pilule gris anthracite glossy, orbe argentée avec un trophée générique, textes originaux (« 100 G · Légende vivante », « 30 G · Le peuple a parlé », « 50 G · Parrain d'un mot »). Pas de logo de console, pas de son d'origine : un carillon synthétique de deux notes.

**Comment on le modernise.** L'orbe apparaît avec un ressort, puis la pilule se déroule via `clip-path` (effet de dévoilement, pas de reflow). Le toast est décoratif (`aria-hidden`) : l'information utile est annoncée par la région `aria-live` principale.

### 2.8 La rareté du butin dans les MMORPG

**Ce que c'était.** Dans les MMORPG, la couleur du nom d'un objet dit sa valeur : gris médiocre, blanc classique, vert inhabituel, bleu rare, violet épique, orange légendaire. L'info-bulle d'objet (fond bleu nuit, liseré argenté, texte d'ambiance en doré) est une icône en soi.

**Pourquoi c'est pertinent.** C'est le jeu préféré du chouffin, et un code de lecture de valeur que sa génération comprend sans légende.

**Comment on le cite.** L'**indice de chouffinitude** prend la couleur de la rareté : moins de 21 médiocre, 21 à 50 classique, 51 à 70 inhabituel, 71 à 85 rare, 86 à 94 épique, 95 et plus légendaire. La justification du verdict est affichée comme le texte d'ambiance doré d'une info-bulle d'objet. Les teintes sont éclaircies pour tenir le contraste AA.

### 2.9 Les écrans de chargement à astuces

**Ce que c'était.** « Astuce : vous pouvez sprinter en appuyant sur Maj. » Des conseils souvent inutiles pour meubler l'attente.

**Comment on le cite.** Si l'API met plus de 0,6 seconde à répondre, une carte apparaît avec une astuce absurde (« Astuce : un vrai chouffin ne dit pas « bière », il dit « breuvage ». »). En dessous de 0,6 seconde, rien ne s'affiche : pas de clignotement inutile.

### 2.10 Les répliques cultes

- **« I used to be an adventurer like you, then I took an arrow in the knee »** (Skyrim, 2011) : l'erreur réseau devient « Ta connexion a pris une flèche dans le genou. »
- **Le lancer de dé** (JDR, et l'humour du « 1 critique ») : l'erreur serveur devient « Échec critique ! Le serveur a fait 1 au d20. »
- **« First ! »** (commentaires YouTube 2010 à 2012) : quand personne n'a voté, « Sois le premier (« first ! », comme en 2012). »
- **Le temps de recharge** (MMORPG) : après un HTTP 429, le bouton « Relancer le dé » se recharge avec un balayage conique, comme un sort.
- **Le « +1 »** des forums : chaque vote fait monter un « +1 » en police pixel.
- **« C'est pas faux »** (Kaamelott) : l'écran des mots inconnus.

### 2.11 Kaamelott, pilier absolu

**Ce que c'est.** La série d'Alexandre Astier (2005 à 2009), découpée en six « Livres ». Perceval répond « C'est pas faux » quand il ne comprend pas un mot. C'est la référence la plus partagée de la culture chouffin.

**Comment on l'utilise.** L'écran des mots inconnus s'ouvre sur un énorme « C'EST PAS FAUX » en Impact qui arrive en rebondissant, puis un texte interminable (écrit par le coordinateur) mis en scène comme une lecture sans fin :
- révélation chapitre par chapitre (« Attends, c'est pas fini... ») ;
- estimation du temps de lecture qui grimpe de façon absurde (6 min, puis 18 min, puis « 1 h 20 (pause pipi incluse) », jusqu'à « ∞ (c'est pas faux) ») ;
- barre de progression qui **recule** à chaque chapitre, avec des commentaires (« Oui, la barre a reculé. C'est normal. ») ;
- une lettrine dorée façon manuscrit médiéval ;
- une sortie de secours toujours visible : « Trop long ? Aller au vote ».

Aucune image, aucun extrait audio ou vidéo de la série : seulement la réplique, qui est devenue une expression courante.

### 2.12 Le 18-25 de jeuxvideo.com et le web francophone

**Ce que c'était.** Le forum le plus actif du web francophone, avec sa culture du topic, ses stickers (Risitas, « issou », « ayaa »), le « +1 », le « PTDR ». Autour, une scène YouTube naissante : Joueur du Grenier, Norman, Cyprien, Salut les Geeks, What the Cut, Le Visiteur du Futur, Noob, Le Donjon de Naheulbeuk.

**Ce qu'on en garde.** Le ton : la vanne entre potes, jamais méchante, l'autodérision (« Aucun chouffin n'a été maltraité pendant la fabrication de ce site (quelques-uns ont été gentiment vannés) »). Le « +1 » au vote. Le vocabulaire de taverne et de Table Ronde.

**Ce qu'on n'utilise pas.** Les stickers du forum reprennent souvent la photo de personnes réelles (Risitas est un vrai humoriste) : exclus. Les youtubeurs sont cités dans le texte des exemples, jamais par leur image ou leur logo.

### 2.13 Skeuomorphisme finissant et bascule vers le flat (2010 à 2013)

**Ce que c'était.** Jusqu'en 2012, les interfaces imitent la matière : boutons glossy avec reflet en demi-lune, dégradés, ombres portées, textures. En 2013, iOS 7 et l'interface tuiles de Windows 8 imposent le flat design : aplats, typographie fine en minuscules, angles droits, rotation 3D « tourniquet » des tuiles.

**Comment on s'en sert : la dualité du verdict.** C'est l'idée centrale de la direction artistique.
- **CHOUFFIN** vit en 2011 : carte glossy à halo néon, tampon en capitales Impact incliné, boutons en relief qui s'enfoncent. Maximaliste, comme le chouffin.
- **PAS CHOUFFIN** vit en 2013 : tuile bleue plate, « pas chouffin. » en minuscules légères, angles droits, entrée en rotation 3D façon tuile. Sobre, propre, un peu froid. Comme un brunch.

Le verdict se lit donc deux fois : par le texte, et par l'époque graphique qu'il convoque.

### 2.14 Lens flares et esthétique blockbuster (2009 à 2013)

**Ce que c'était.** Les reflets d'objectif anamorphiques (longue traînée horizontale bleutée) sont devenus la signature de certains blockbusters de science-fiction, jusqu'à la parodie.

**Comment on le cite.** 100 % CSS : un cœur en dégradé radial, une traînée horizontale fine, un anneau fantôme, en `mix-blend-mode: screen`. Deux occurrences maximum par combo.

### 2.15 Les « RGB gamer » et le dubstep

- Le rétroéclairage arc-en-ciel des périphériques « gamer » (qui explose vers 2014 et 2015) devient la **bordure du champ de saisie** : un `conic-gradient` animé via `@property`, lent au focus, qui s'emballe pendant le chargement.
- Le « wub wub » du dubstep (drop de 2011 et 2012) est synthétisé en fin de combo MLG : dents de scie graves à travers un filtre passe-bas modulé par un LFO.

---

## 3. Ce qu'on s'interdit

| Tentation | Pourquoi non | Ce qu'on fait à la place |
| --- | --- | --- |
| Logos de chips et de soda | Marques déposées | Chips triangulaire orange générique, canette « FLUO » |
| Samples d'airhorn, de hitmarker, de succès | Sons sous droits | Synthèse WebAudio originale |
| Photo du Shiba du doge | Photo d'un animal réel, sous droits | Seulement la grammaire et le Comic Sans |
| Trollface et rage faces | Dessins d'auteurs identifiés | Écran bleu « :( » et « NOPE. » |
| Stickers Risitas et consorts | Photos de personnes réelles | Le ton et le vocabulaire du forum |
| Logos de console ou de plateforme | Marques déposées | Orbe argentée et trophée génériques |
| Captures ou extraits de Kaamelott | Œuvre protégée | La réplique « C'est pas faux », devenue expression |
| Clignotements rapides | Risque photosensible | Au plus deux flashs espacés de plus d'une seconde |

---

## 4. Résumé de la traduction « 2012 vers 2026 »

| Code d'époque | Exécution 2026 dans Chouffinder |
| --- | --- |
| Montage MLG en vidéo | Composant React chargé à la demande, Motion, 2,7 s, zappable |
| Sons MP3 piqués | WebAudio synthétisé, coupé par défaut, préférence mémorisée |
| Meme généré sur un site tiers | Mise en page en « top text / bottom text » en HTML sémantique |
| Impact avec contour | Anton (OFL) + `-webkit-text-stroke` + `paint-order` |
| Roue de couleurs des Advice Animals | `repeating-conic-gradient` masqué, rotation GPU |
| Bordure RGB de clavier | `@property --ring-angle` + `conic-gradient` |
| Succès de console | `clip-path` animé, `aria-hidden`, annonce via `aria-live` |
| Info-bulle d'objet MMORPG | Carte sémantique, `role="meter"` pour la jauge |
| Skeuo contre flat | Deux styles de carte selon le verdict, même composant |
| Tuile « tourniquet » | `rotateY` avec `transformPerspective`, courbe « quintique » |
| Écran de chargement à astuce | Apparition retardée de 0,6 s en CSS pur, zéro flash |
