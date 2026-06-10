# CAP 2030 — Analyseur de profil collaborateur

Application React de comparaison d'un profil collaborateur au référentiel
**CAP 2030** de la profession comptable. Génère un rapport structuré via l'API
Claude (`claude-sonnet-4-20250514`) ancré dans le contenu officiel des sites
[cap.professioncomptable2030.fr](https://cap.professioncomptable2030.fr/) et
[experts-comptables.fr/sites/profession-comptable-2030/](https://www.experts-comptables.fr/sites/profession-comptable-2030/).

## Fonctionnalités

- Formulaire de saisie en français (intitulé, missions, compétences, ancienneté, département, niveau).
- Rapport structuré à 6 sections : Synthèse · Points forts · Axes de développement · Recommandations formation · Trajectoire 2030 · Score d'alignement.
- Score d'alignement CAP 2030 visualisé (jauge sur 100, justification rédigée).
- Export du rapport en **PDF** (un clic).
- Template RH imprimable (fiche profil collaborateur) à remplir avant saisie.
- Design institutionnel : palette navy / crème / or, typographie Cormorant Garamond + Inter.

## Architecture

```
Cap2030/
├── api/                 # Fonctions serverless Vercel (prod)
│   ├── analyze.js
│   └── health.js
├── lib/                 # Logique partagée API
│   ├── cap-analyzer.js  # System prompt + appel Anthropic SDK
│   └── capFramework.js  # Référentiel CAP 2030 officiel
├── server/
│   └── server.js        # Serveur Express (dev local uniquement)
├── src/
│   ├── App.jsx
│   ├── components/      # Header, ProfileForm, Report, ScoreVisual, Loading
│   ├── pages/Template.jsx  # Template RH imprimable
│   └── lib/             # api.js, pdf.js
└── vercel.json
```

Le client React ne connaît jamais la clé API — elle reste côté serveur (Express en dev, fonction serverless en prod).

## Déploiement Vercel

1. Importer le repo GitHub dans Vercel (https://vercel.com/new).
2. Vercel détecte automatiquement Vite. Ne pas modifier les commandes par défaut.
3. Dans **Settings → Environment Variables**, ajouter :
   - `ANTHROPIC_API_KEY` = votre clé Anthropic
4. Déployer. Les routes `/api/analyze` et `/api/health` sont servies par les fonctions serverless de `api/`.

## Démarrage

1. Installer les dépendances :
   ```bash
   npm install
   ```

2. Copier `.env.example` vers `.env` et y renseigner votre clé :
   ```bash
   cp .env.example .env
   # puis éditer .env et coller votre clé ANTHROPIC_API_KEY
   ```

3. Lancer le frontend + le backend en parallèle :
   ```bash
   npm run dev
   ```

   - Frontend : http://localhost:5173
   - API : http://localhost:3001

## Utilisation

### Analyse d'un profil
1. Ouvrir http://localhost:5173.
2. Renseigner les six champs du formulaire.
3. Cliquer sur **« Lancer l'analyse CAP 2030 »**.
4. Le rapport s'affiche. Cliquer sur **« Exporter en PDF »** pour télécharger.

### Template RH imprimable
1. Cliquer sur **« Template RH imprimable »** dans l'en-tête.
2. Cliquer sur **« Imprimer / Enregistrer en PDF »**.
3. Dans la boîte de dialogue d'impression, choisir « Enregistrer au format PDF » comme destination.

Le template reproduit exactement les champs de l'application — il peut donc être
rempli à la main ou saisi en amont par les collaborateurs, puis recopié dans l'outil
par le service RH.

## Configuration du modèle

Le modèle utilisé est `claude-sonnet-4-20250514`, configurable dans
[server/server.js](server/server.js). Le référentiel injecté dans le system prompt
se trouve dans [server/capFramework.js](server/capFramework.js).

## Build de production

```bash
npm run build
npm run start   # sert l'API ; déployer les fichiers de dist/ via votre hébergeur
```
