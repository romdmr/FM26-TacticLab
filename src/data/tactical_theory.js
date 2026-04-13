/**
 * TacticLab — Théorie tactique footballistique
 * Sources : Jonathan Wilson "Inverting the Pyramid" (2013)
 *           + connaissances FM26 / football moderne
 *
 * Ces principes fondamentaux alimentent le moteur de scoring
 * pour des analyses cohérentes avec la théorie du jeu.
 */

// ── PRINCIPES FONDAMENTAUX (Wilson) ──────────────────────────────────────
export const TACTICAL_PRINCIPLES = {

  // "The game is about space and how you control it: make the field big
  // when you have the ball and it is easy to retain it; make it small
  // when you do not." — Michels / Lobanovskyi via Wilson, ch.12
  SPACE_CONTROL: {
    ip: 'Élargir le terrain en possession — créer de l\'espace pour les partenaires',
    oop: 'Rétrécir le terrain hors possession — compresser l\'espace adverse',
  },

  // "Possession football is the thing, not kick and rush" — Buckingham (Ajax/Barcelona)
  // "If you've got the ball, keep it. The other side can't score." — Buckingham
  POSSESSION: {
    keyRoles: ['Deep-Lying Playmaker','Ball-Playing CB','Ball-Playing GK','Midfield Playmaker'],
    keyTI: { passingDirectness: 'Shorter', buildupStrategy: 'Play Through Press' },
    desc: 'Conserver le ballon = priver l\'adversaire de l\'occasion de marquer',
  },

  // Pressing viability: "Pressing is hugely demanding physically, requiring
  // almost constant motion and thus supreme levels of fitness." — Wilson, ch.12
  PRESSING: {
    requirement: 'Stamina élevée pour tous les joueurs du dispositif de presse',
    keyRoles: ['Tracking CF','Pressing CM','Pressing DM (2DM)','Pressing WB','Pressing FB'],
    counterpart: 'Sweeper Keeper indispensable si ligne haute',
    desc: 'Le pressing collectif n\'est viable que si toute la ligne participe',
  },

  // Balance: "There is a need always for at least one [CB] who can pass
  // the ball or advance with it into midfield." — Wilson, ch.17
  // Plus stopper-cover pair (Nicholson/Ramsey model)
  DEFENSIVE_BALANCE: {
    ideal: 'Un CB stopper + un CB couvrant — complémentarité systémique',
    desc: 'Le modèle Nicholson/Ramsey : un avance, l\'autre couvre. Fondement du jeu défensif moderne.',
    pairs: [
      { ip: 'Ball-Playing CB', oop: 'Stopping CB' },
      { ip: 'Advanced CB', oop: 'Covering CB' },
      { ip: 'Centre-Back', oop: 'Covering CB' },
      { ip: 'No-Nonsense CB', oop: 'Stopping CB' },
    ],
  },

  // Universality: "It is very rare to find a top side that plays with two
  // stopper central defenders." and "midfielders are multi-functional" — Wilson, ch.17
  UNIVERSALITY: {
    desc: 'Le football moderne exige des joueurs polyvalents, capables de plusieurs rôles selon la phase',
    evidence: 'Total Football de Michels/Ajax 1972 : interchange total des positions',
    inFM26: 'Le système IP/OOP de FM26 est l\'héritier direct de cette philosophie',
  },

  // Counter-attack geometry: "Looks to draw the opposition out to leave them
  // vulnerable on the break." — FM26 style description
  COUNTER_ATTACK: {
    requirement: 'Bloc bas compact + joueurs rapides en transition',
    keyRoles: { ip: ['Channel Forward','Wide Forward','Central Outlet CF'], oop: ['Holding FB','Covering CB','Screening DM'] },
    desc: 'Défense basse → transition rapide : la géométrie nécessite des coureurs larges',
  },

  // False 9 origin: "The False Nine drops between lines, draws defenders,
  // and creates space for runners behind him." — FM26 / Wilson ch.13 (Nandor Hidegkuti)
  FALSE_NINE: {
    origin: 'Nandor Hidegkuti, Hongrie 1953 — premier "faux numéro 9" documenté',
    requirement: 'Nécessite des milieux ou ailiers qui exploitent les espaces créés',
    counterpart: ['Inside Forward','Channel Mid','Advanced Playmaker'],
  },

  // Catenaccio principle: "A defence-focused style that primarily looks to
  // deny the opposition goalscoring opportunities. Uses 3 centre-backs." — FM26
  CATENACCIO: {
    origin: 'Italie années 1950s — Nereo Rocco, Inter de Helenio Herrera',
    keyStructure: '3 CBs + libero (positionnement profond) + contre-attaque rapide',
    inFM26: 'Style Catenaccio = Low Block + Covering CBs + No-Nonsense GK',
  },
}

// ── PAIRES DE RÔLES COMPLÉMENTAIRES (théorie Wilson + FM26) ─────────────
// Basé sur les duos historiquement efficaces + logique FM26
export const ROLE_PAIRS = [

  // DÉFENSE
  { a: 'Stopping CB',  b: 'Covering CB',      score: 1.0, cat: 'defense',
    desc: 'Stopper-libero — duo classique (Baresi/Costacurta, Charton/Adams). L\'un intercepte, l\'autre couvre.' },
  { a: 'Stopping Wide CB', b: 'Covering Wide CB', score: 0.8, cat: 'defense',
    desc: 'Asymétrie défensive dans un bloc à 3 — un flanc agressif, l\'autre conservateur.' },
  { a: 'Pressing FB',  b: 'Screening DM',      score: 0.8, cat: 'defense',
    desc: 'FB agressif couvert par un DM latéral — pression + sécurité.' },
  { a: 'Sweeper Keeper', b: 'Stopping CB',     score: 0.9, cat: 'defense',
    desc: 'GK sweeper + CB stopper = ligne haute viable. Le GK sort, le CB presse.' },

  // MILIEU
  { a: 'Deep-Lying Playmaker', b: 'Box-to-Box Mid (2DM)',    score: 1.0, cat: 'midfield',
    desc: 'Pirlo/Gattuso — l\'organisateur et le box-to-box. Duo FM le plus efficace.' },
  { a: 'Deep-Lying Playmaker', b: 'Box-to-Box Playmaker (2DM)', score: 0.9, cat: 'midfield',
    desc: 'Double playmaker à différentes hauteurs — contrôle total du milieu.' },
  { a: 'Half Back',    b: 'Box-to-Box Mid (2DM)',    score: 0.9, cat: 'midfield',
    desc: 'Half Back libère les CBs pour monter, le B2B fournit l\'énergie verticale.' },
  { a: 'Midfield Playmaker', b: 'Pressing CM',       score: 0.8, cat: 'midfield',
    desc: 'Créateur protégé par un chasseur — duo Xavi/Busquets ou Pirlo/Vidal.' },
  { a: 'Channel Mid',  b: 'Inside Winger',            score: 0.9, cat: 'midfield',
    desc: 'Deux joueurs qui exploitent les demi-espaces — chaos défensif garanti.' },

  // ATTAQUE
  { a: 'False 9',      b: 'Inside Forward',           score: 1.0, cat: 'attack',
    desc: 'False 9 décroche, Inside Forward pique dans le dos — duo classique post-2010.' },
  { a: 'False 9',      b: 'Advanced Playmaker',       score: 0.9, cat: 'attack',
    desc: 'Deux créateurs entre les lignes — nécessite des coureurs larges en soutien.' },
  { a: 'Target Forward', b: 'Winger',                  score: 0.9, cat: 'attack',
    desc: 'Grand attaquant + ailiers centreurs = jeu aérien redoutable. Route One.' },
  { a: 'Target Forward', b: 'Playmaking Winger',       score: 0.8, cat: 'attack',
    desc: 'Cible aérienne + créateur large = options variées.' },
  { a: 'Poacher',      b: 'Deep-Lying Forward',        score: 0.8, cat: 'attack',
    desc: 'Finisseur + créateur = binôme classique ST. Vardy/Mahrez en miniature.' },
  { a: 'Channel Forward', b: 'Centre Forward',         score: 0.8, cat: 'attack',
    desc: 'Attaquant axial + coureur de couloir — déséquilibre latéral.' },

  // TRANSITIONS IP/OOP
  { a: 'Ball-Playing GK', b: 'Half Back',              score: 0.9, cat: 'buildup',
    desc: 'Build-up à 3 joueurs depuis le GK — casse les presses adverses (Guardiola).' },
  { a: 'Ball-Playing CB', b: 'Deep-Lying Playmaker',   score: 0.9, cat: 'buildup',
    desc: 'CB porteur + DLP — deux phases de build-up avant le milieu central.' },
  { a: 'Playmaking Wing Back', b: 'Inside Winger',     score: 0.8, cat: 'attack',
    desc: 'WB créateur + ailier qui rentre = surcharge du demi-espace (style Tuchel/Chelsea).' },
]

// ── CONFLITS DE RÔLES (logique FM26 + principes Wilson) ─────────────────
export const ROLE_CONFLICTS = [

  // Wilson: "A naive faith in improvisational soccer had led to Brazil's
  // underperformances in the thirties" — trop de liberté = chaos
  { roles: ['Free Role','Free Role'],                 penalty: 3.0,
    desc: 'Deux Free Role = déstructuration totale. Même la génération brésilienne 1970 avait un système.' },

  // Pressing requires fitness: impossible with No-Nonsense GK
  { roles: ['Half Back','No-Nonsense GK'],            penalty: 1.5,
    desc: 'Le Half Back construit depuis les CBs — le No-Nonsense GK coupe ce circuit.' },

  // High line + aggressive keeper needed
  { roles: ['Line-Holding Keeper','Sweeper Keeper'],  penalty: 2.0,
    desc: 'Deux rôles GK OOP contradictoires — ne pas les combiner.' },

  // False 9 without runners = the spaces created are wasted
  { trigger: 'False 9', missing: ['Inside Forward','Channel Mid','Channel Forward','Advanced Playmaker'], penalty: 1.5,
    desc: 'False 9 sans coureurs dans l\'axe — les espaces créés ne sont pas exploités (cf. Wilson ch.13).' },

  // Poacher needs service
  { trigger: 'Poacher', missing: ['Deep-Lying Playmaker','Advanced Playmaker','Playmaking Winger','Midfield Playmaker'], penalty: 1.5,
    desc: 'Le Poacher est "an instinctive finisher focused purely on goals" — il a besoin de service.' },

  // Too many ball-winners without creator
  { minCount: { ballWinners: 4 }, noCreators: true, penalty: 1.5,
    desc: 'Équipe trop physique sans créateur — "nobody wants playmakers" mais on en a besoin.' },

  // Wide CB (3CB) in a 4-back system = positional confusion
  { trigger: 'Wide CB (3CB)', in4back: true, penalty: 1.0,
    desc: 'Le Wide CB (3CB) est conçu pour un système à 3 défenseurs — inefficace en bloc de 4.' },
]

// ── LOGIQUE DE PRESSING (Wilson ch.12 + FM26) ────────────────────────────
export const PRESSING_LOGIC = {
  // "Pressing was the key, but it was probably only in the mid- to late sixties
  // that it became viable." — Wilson on Michels/Lobanovskyi
  HIGH_PRESS: {
    requiredRoles: ['Tracking CF','Pressing CM','Pressing DM (2DM)'],
    idealGK: 'Sweeper Keeper',
    requiredLine: 'Higher',
    staffWarning: 'Sans Tracking CF, la presse ne commence pas au bon moment.',
  },

  GEGENPRESS: {
    // "relies on every player working hard and being fit and mobile enough
    // to press immediately after losing the ball" — FM26 style description
    requiredStamina: 'high',
    keyRoles: ['Box-to-Box Mid (2DM)','Pressing CM','Tracking CF','Tracking Winger'],
    staffWarning: 'Le Gegenpress est "very tiring for players" — nécessite une forme physique optimale.',
  },

  LOW_BLOCK: {
    // "A defence-first approach that primarily looks to restrict the amount
    // of attacking opportunities the opposition are able to create." — FM26
    keyRoles: ['Covering CB','Screening DM','Holding WB','Holding FB','Tracking Wide Mid'],
    avoidRoles: ['Advanced Wing Back','Pressing FB','Pressing WB'],
    staffWarning: 'Un Low Block avec des latéraux presseurs est contradictoire.',
  },
}

// ── ÉVOLUTION HISTORIQUE DES FORMATIONS (Wilson) ─────────────────────────
// Contexte historique pour enrichir les descriptions de formations
export const FORMATION_HISTORY = {
  '4-3-3': {
    origin: 'Brésil 1958 (Zagallo) → Ajax 1972 (Michels) → Barcelone 1988 (Cruyff)',
    strengths: 'Largeur + pressing haut + équilibre milieu',
    weaknesses: 'Exposition défensive si les WBs montent',
    legend: 'Ajax 1972, Barcelone 2011, Bayern 2013',
  },
  '4-2-3-1': {
    origin: 'Années 1990s — popularisé par Mourinho / Ferguson',
    strengths: 'Double pivot protège la défense, AM créatif, pressing structuré',
    weaknesses: 'L\'AMC peut être isolé si les milieux ne montent pas',
    legend: 'France 2000, Chelsea 2005, Real Madrid 2012',
  },
  '3-5-2': {
    origin: 'Italie années 1980s (Trapattoni) → popularisé en Série A',
    strengths: 'Supériorité numérique au milieu, WBs très offensifs',
    weaknesses: 'WBs doivent fournir la largeur = grande dépendance physique',
    legend: 'Juventus 1985, Inter 2010 (Mourinho), Atletico 2014',
  },
  '4-4-2': {
    origin: 'Angleterre des années 1960s — formation "nationale"',
    strengths: 'Équilibre parfait, facile à comprendre et à défendre',
    weaknesses: 'Dépassé face aux équipes à 3 milieux centraux',
    legend: 'Liverpool 1980s, Milan 1988, Manchester United 1999',
  },
  '3-4-3': {
    origin: 'Pays-Bas Total Football 1974 → Chelsea 2017 (Conte)',
    strengths: 'CBs larges créent la surnombre, front 3 dévastateur',
    weaknesses: 'WBs épuisés, CBs latéraux très exposés',
    legend: 'Pays-Bas 1974, Chelsea 2017',
  },
}
