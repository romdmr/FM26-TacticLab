# ⚽ TacticLab FM26

> **Builder tactique Football Manager 26** — Construit, analyse et partage tes tactiques avec les rôles IP/OOP officiels, les Team Instructions complètes et un moteur d'analyse sur 7 dimensions basé sur *Inverting the Pyramid* de Jonathan Wilson.

![TacticLab](https://img.shields.io/badge/FM26-Tactical_Builder-26E676?style=flat-square&labelColor=0D1014)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white&labelColor=0D1014)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite&logoColor=white&labelColor=0D1014)
![Zustand](https://img.shields.io/badge/Zustand-5-FF6619?style=flat-square&labelColor=0D1014)
![License](https://img.shields.io/badge/License-MIT-white?style=flat-square&labelColor=0D1014)

---

## Aperçu

TacticLab est un outil web pour construire et analyser des tactiques Football Manager 26 de façon théorique. Il reproduit le système IP/OOP dual de FM26 avec tous les rôles officiels, les Team Instructions complètes, et un moteur de scoring qui évalue la cohérence tactique selon la théorie footballistique de Jonathan Wilson.

### Fonctionnalités principales

- **Builder dual terrain** — Un terrain In Possession et un Out of Possession, avec bascule en un clic. Drag & drop vers des positions fixes avec snap automatique et changement de poste.
- **Rôles FM26 officiels** — 80+ rôles IP et OOP organisés par type de poste (GK, CB, FB, WB, DM, CM, MRL, AMC, AMRL, ST). Attributs clés et préférés par rôle (source sortitoutsi.net).
- **Team Instructions complètes** — 8 panels configurables (4 IP : Overview, Final Third, Progression, Buildup — 4 OOP : Overview, High Press, Mid Block, Low Block). Overlap/Underlap avec exclusivité mutuelle par côté.
- **10 styles de jeu FM26 officiels** — Control Possession, Gegenpress, Tiki-Taka, Vertical Tiki-Taka, Wing Play, Route One, Fluid Counter-Attack, Direct Counter-Attack, Catenaccio, Park the Bus. Chacun avec ses TI par défaut, staff feedback et tooltip détaillé.
- **4 profils d'équipe** — Elite / Top / Sub-Top / Underdog. Chaque profil contextualise le scoring : styles adaptés, pénalités pour rôles trop complexes, recommandations spécifiques.
- **Moteur d'analyse 7 dimensions** — Bloc défensif, milieu, puissance offensive, cohérence IP, solidité OOP, synergies de rôles, adéquation profil.
- **7 tactiques de référence** — Barcelone 2009, PSG 2025, Bayern 2013, Atletico 2014, Atalanta 2019, Leicester 2016, Park the Bus Underdog. Chargement en un clic avec tous les rôles, TI et profil préconfigurés.

---

## Stack technique

| Outil | Version | Usage |
|---|---|---|
| React | 19 | UI & composants |
| Vite | 5 | Build & dev server |
| Zustand | 5 | State management (persist localStorage) |
| Tailwind CSS | 3 | Utilitaires CSS |
| React Router DOM | 7 | Navigation |

---

## Installation

**Prérequis :** Node.js 20.19+ ou 22.12+

```bash
# Cloner le repo
git clone https://github.com/<ton-username>/tacticlab-fm26.git
cd tacticlab-fm26

# Installer les dépendances
npm install

# Lancer en développement
npm run dev

# Builder pour la production
npm run build
```

L'app sera disponible sur `http://localhost:5173`.

---

## Structure du projet

```
src/
├── components/
│   ├── Navbar.jsx           # Barre de navigation + sélecteur profil d'équipe
│   ├── Sidebar.jsx          # Formations IP/OOP + styles de jeu avec tooltips
│   ├── Pitch.jsx            # Terrain avec drag & drop + snap sur positions fixes
│   ├── PlayerPanel.jsx      # Panel rôles IP/OOP + attributs clés par rôle
│   ├── TeamInstructions.jsx # Overlay TI complet (8 panels, Overlap/Underlap)
│   ├── ScoreView.jsx        # Analyse tactique 7 dimensions + ProfileCard
│   ├── HomeView.jsx         # Accueil + tactiques de référence cliquables
│   └── CommunityView.jsx    # Classement communautaire
│
├── data/
│   ├── fm26.js              # Rôles IP/OOP, types de postes, descriptions, TI
│   ├── positions.js         # 24 positions fixes avec coordonnées + snap logic
│   ├── attributes.js        # Attributs clés/préférés FM26 par rôle (sortitoutsi)
│   ├── playstyles.js        # 10 styles FM26 officiels avec TI par défaut
│   ├── tactical_theory.js   # Théorie Wilson : paires, conflits, principes
│   ├── teamprofiles.js      # 4 profils d'équipe + compatibilité style/profil
│   └── templates.js         # 7 tactiques historiques préconfigurées
│
├── engine/
│   ├── scoring.js           # Moteur principal 7 dimensions
│   └── profile_scoring.js   # Scoring contextualisé par profil d'équipe
│
└── store/
    └── useTacticStore.js    # État global Zustand avec persist localStorage
```

---

## Le moteur de scoring

Le moteur évalue une tactique sur 7 dimensions pondérées :

| Dimension | Poids | Ce qui est analysé |
|---|---|---|
| Bloc défensif | 18% | Nombre de CBs, couverture latérale, cohérence GK |
| Milieu | 13% | Écran DM, Half Back, Box-to-Box, densité |
| Puissance offensive | 13% | Options de finition, créateurs, style de jeu |
| Cohérence IP | 18% | Rôles + TI cohérents avec le style choisi |
| Solidité OOP | 18% | Sweeper Keeper / ligne haute, pressing, WBs défensifs |
| Synergies de rôles | 9% | 15 paires positives encodées, 7 conflits détectés |
| Adéquation profil | 11% | Style vs niveau d'équipe, complexité des rôles |

### Basé sur Jonathan Wilson — *Inverting the Pyramid* (2013)

Les règles du moteur sont ancrées dans la théorie tactique footballistique :

- **Modèle Nicholson/Ramsey (ch.8)** — Le duo stopper/couvrant est détecté et valorisé
- **Pressing de Michels/Ajax 1972 (ch.12)** — Le High Press requiert un Tracking CF + Sweeper Keeper sur ligne haute
- **Hidegkuti 1953 / False 9 (ch.13)** — Le False 9 nécessite des coureurs dans l'axe pour exploiter les espaces créés
- **Universalité moderne (ch.17)** — Pénalise les systèmes trop rigides, valorise la polyvalence

---

## Les 24 positions fixes

Le terrain utilise un système de positions fixes avec snap automatique :

```
GK
FBL  CDL  CDC  CDR  FBR
WBL  DML  DMC  DMR  WBR
ML   CML  CMC  CMR  MR
AML  CAML CAMC CAMR AMR
     STL  STC  STR
```

Quand un pion est glissé vers une nouvelle zone, son type de poste change automatiquement et ses rôles IP/OOP disponibles sont mis à jour.

---

## Tactiques de référence

| Tactique | Style | Profil | Score |
|---|---|---|---|
| 🔴 Barcelone 2009 (Guardiola) | Tiki-Taka | 👑 Elite | 9.6 |
| ⚫ Bayern 2013 (Heynckes) | Gegenpress | 👑 Elite | 9.4 |
| 🔵 PSG 2025 (Luis Enrique) | Vertical Tiki-Taka | 👑 Elite | 9.1 |
| 🔴 Atletico 2014 (Simeone) | Direct Counter-Attack | ⭐ Top | 8.8 |
| 🔵 Atalanta 2019 (Gasperini) | Gegenpress | ⭐ Top | 8.5 |
| 🔵 Leicester 2016 (Ranieri) | Fluid Counter-Attack | 🔵 Sub-Top | 8.3 |
| ⚫ Park the Bus Parfait | Park the Bus | 🐉 Underdog | 8.0 |

Chaque tactique est entièrement préconfigurée : formation IP/OOP, rôles pion par pion, Team Instructions complètes, style et profil d'équipe.

---

## Sources des données

| Source | Usage |
|---|---|
| Football Manager 26 (Sports Interactive) | Rôles IP/OOP, types de postes, styles de jeu, Team Instructions |
| [sortitoutsi.net](https://sortitoutsi.net) | Attributs clés et préférés par rôle |
| Jonathan Wilson, *Inverting the Pyramid* (2013) | Théorie tactique, principes du moteur de scoring |

> **Note :** Ce projet est un outil de fan non affilié à Sports Interactive ou SEGA. Football Manager est une marque déposée de Sports Interactive Limited.

---

## Feuille de route

- [ ] Backend Supabase — persistance cross-session, comptes utilisateurs, partage par URL
- [ ] Classement communautaire réel — votes, notes, filtres par style/profil
- [ ] Export image/PDF — partager sa tactique en une image propre
- [ ] Badges de cohérence — indicateurs rouge/orange/vert sur les pions
- [ ] Vue côte-à-côte IP/OOP — visualiser les deux terrains simultanément
- [ ] Comparateur de tactiques — mettre deux systèmes en parallèle

---

## Contribuer

Les contributions sont les bienvenues, notamment :

- Nouveaux templates de tactiques historiques
- Corrections sur les rôles ou attributs FM26
- Améliorations du moteur de scoring
- Traductions (la base est en français)

```bash
# Fork le repo, crée une branche
git checkout -b feature/ma-contribution

# Commit et push
git commit -m "feat: description"
git push origin feature/ma-contribution

# Ouvre une Pull Request
```

---

## Licence

MIT — libre d'utilisation, de modification et de distribution.

---

<div align="center">
  <sub>Construit avec ⚽ et React · Théorie par Jonathan Wilson</sub>
</div>
