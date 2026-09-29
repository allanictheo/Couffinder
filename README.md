# Chouffinder

> Tape un mot. L'Oracle te dit s'il est **chouffin** ou **pas chouffin**.

« Chouffin » est un terme né sur le forum 18-25 de jeuxvideo.com. Il désigne un stéréotype de geek fan de culture geek mainstream : Kaamelott (surtout), le Seigneur des Anneaux, WoW, Warhammer, le métal, la bière La Chouffe (d'où le nom)... Chouffinder juge, mot par mot, ce qui relève de cet univers. Si le mot est inconnu, le site répond comme Perceval : **« C'est pas faux »**.

## Fonctionnalités

- **Verdict instantané** sur environ 2 000 mots jugés à l'avance par l'agent `juge-chouffin`, avec un indice de chouffinitude et une justification.
- **Animation MLG** façon 2015 : parfois sur un verdict chouffin, et toujours pour les mots légendaires.
- **Contestation** : chaque visiteur peut donner son avis, et les votes modifient la base.
  - L'avis de l'agent compte pour **5 votes**. Si la communauté le contredit en majorité, le verdict bascule.
  - Un mot inconnu entre dans la base après **3 votes** et une majorité claire.
  - Chaque visiteur a droit à un seul vote par mot. L'IP n'est jamais stockée : on ne garde qu'une empreinte hachée et salée.
- **Protection** contre les insultes, les injures et les propos haineux (leet speak, lettres espacées ou étirées). Le visiteur est invité à mieux choisir ses mots. On ne peut pas non plus voter sur ce qui ressemble au nom d'une personne réelle.
- **Limitation de débit** : 60 recherches et 20 votes par minute et par visiteur.

## Stack

- Next.js 16 (App Router), React 19, TypeScript et Tailwind CSS 4.
- `motion` pour les micro-interactions et WebAudio pour les sons, synthétisés sans aucun fichier audio.
- Upstash Redis pour les votes. En local, ou tant que Redis n'est pas branché, un stockage en mémoire prend le relais.
- Déploiement Vercel à chaque push GitHub, avec une CI GitHub Actions (lint, build, test de la production).

## Les agents

Deux sous-agents Claude Code sont versionnés dans `.claude/agents/` :

| Agent | Rôle |
| --- | --- |
| `juge-chouffin` | L'Oracle. Juge chaque mot selon la définition du chouffin, attribue un score de 0 à 100 et une justification. Il sert à générer, enrichir et auditer la base. |
| `designer-mlg` | Designer UI/UX et micro-interactions, expert de la culture geek et internet 2010-2015. Il reprend ces codes avec une technique moderne et accessible. |

Dans Claude Code, il suffit de les nommer, par exemple : « utilise l'agent juge-chouffin pour juger ces 50 mots ».

## Structure

```
.claude/agents/          Les deux agents
docs/design/             Analyse culturelle 2010-2015 et direction artistique
scripts/seed/lot-*/      Lots de mots produits par l'agent juge-chouffin
scripts/build-words.mts  Fusion et validation des lots vers src/data/words.json
src/data/words.json      La base de mots (générée)
src/content/             Textes (l'interminable « C'est pas faux »)
src/lib/judge.ts         Le tribunal : verdict de l'agent + votes
src/lib/moderation.ts    Filtre anti-insultes et anti-noms de personnes
src/lib/store.ts         Stockage Redis ou mémoire
src/app/api/             Routes judge, vote et stats
```

## Développement

```bash
npm install
npm run dev        # http://localhost:3000
npm run lint
npm run build
```

Pour ajouter ou modifier des mots, crée ou édite un fichier dans `scripts/seed/lot-N/`, puis lance :

```bash
npm run words      # valide et régénère src/data/words.json
```

Le script refuse :

- un score incohérent avec le verdict (chouffin si score >= 51) ;
- une justification de plus de 140 caractères ;
- une catégorie inconnue.

Il ignore les doublons.

## Déploiement (GitHub + Vercel)

Le repo est importé dans Vercel (projet `couffinder`). Vercel déploie donc automatiquement à chaque push : en production pour la branche de production, en preview pour les autres branches.

Le workflow `.github/workflows/ci.yml` vérifie chaque push :

- lint ;
- cohérence de la base de mots ;
- build.

Il teste ensuite que le site en production répond. L'URL testée est `https://couffinder.vercel.app` ; tu peux la changer avec la variable de repo `SITE_URL`.

**Base de votes** : sur Vercel, dans le projet `couffinder`, ouvre l'onglet Storage. Crée une base Upstash for Redis (offre gratuite) et connecte-la au projet. Les variables `KV_REST_API_URL` et `KV_REST_API_TOKEN` sont ajoutées automatiquement. Redéploie ensuite : les votes deviennent persistants. Tant que la base n'est pas branchée, le pied de page affiche « Mode démo ».

Variables d'environnement :

| Variable | Rôle |
| --- | --- |
| `KV_REST_API_URL`, `KV_REST_API_TOKEN` | Connexion à Upstash Redis. Les noms `UPSTASH_REDIS_REST_URL` et `UPSTASH_REDIS_REST_TOKEN` sont aussi acceptés. |
| `VOTE_SALT` | Optionnel. Sel pour anonymiser les votants. |
