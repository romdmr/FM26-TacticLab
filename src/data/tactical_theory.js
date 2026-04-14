/**
 * TacticLab — Football Tactical Theory
 * Sources: Jonathan Wilson "Inverting the Pyramid" (2013)
 *           + FM26 / modern football knowledge
 *
 * These fundamental principles feed the scoring engine
 * for analysis consistent with tactical theory.
 */

// ── FUNDAMENTAL PRINCIPLES ───────────────────────────────────────────────
export const TACTICAL_PRINCIPLES = {

  // "The game is about space and how you control it: make the field big
  // when you have the ball and it is easy to retain it; make it small
  // when you do not." — Michels / Lobanovskyi via Wilson, ch.12
  SPACE_CONTROL: {
    ip: 'Expand the pitch in possession — create space for teammates',
    oop: 'Compress the pitch out of possession — reduce opposition space',
  },

  // "Possession football is the thing, not kick and rush" — Buckingham (Ajax/Barcelona)
  // "If you've got the ball, keep it. The other side can't score." — Buckingham
  POSSESSION: {
    keyRoles: ['Deep-Lying Playmaker','Ball-Playing CB','Ball-Playing GK','Midfield Playmaker'],
    keyTI: { passingDirectness: 'Shorter', buildupStrategy: 'Play Through Press' },
    desc: 'Retaining the ball = denying the opposition the chance to score',
  },

  // Pressing viability: "Pressing is hugely demanding physically, requiring
  // almost constant motion and thus supreme levels of fitness." — Wilson, ch.12
  PRESSING: {
    requirement: 'High stamina required for all players in the pressing structure',
    keyRoles: ['Tracking CF','Pressing CM','Pressing DM (2DM)','Pressing WB','Pressing FB'],
    counterpart: 'Sweeper Keeper indispensable si ligne haute',
    desc: 'Collective pressing is only viable when the entire line participates',
  },

  // Balance: "There is a need always for at least one [CB] who can pass
  // the ball or advance with it into midfield." — Wilson, ch.17
  // Plus stopper-cover pair (Nicholson/Ramsey model)
  DEFENSIVE_BALANCE: {
    ideal: 'One stopping CB + one covering CB — systemic complementarity',
    desc: 'The Nicholson/Ramsey model: one presses, one covers. Foundation of modern defensive play.',
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
    desc: 'Modern football demands versatile players capable of multiple roles depending on the phase',
    evidence: 'Total Football de Michels/Ajax 1972 : interchange total des positions',
    inFM26: 'FM26\'s IP/OOP system is the direct heir to this philosophy',
  },

  // Counter-attack geometry: "Looks to draw the opposition out to leave them
  // vulnerable on the break." — FM26 style description
  COUNTER_ATTACK: {
    requirement: 'Bloc bas compact + joueurs rapides en transition',
    keyRoles: { ip: ['Channel Forward','Wide Forward','Central Outlet CF'], oop: ['Holding FB','Covering CB','Screening DM'] },
    desc: 'Low block → quick transition: the geometry requires wide runners',
  },

  // False 9 origin: "The False Nine drops between lines, draws defenders,
  // and creates space for runners behind him." — FM26 / Wilson ch.13 (Nandor Hidegkuti)
  FALSE_NINE: {
    origin: 'Nandor Hidegkuti, Hongrie 1953 — premier "false number 9" documented',
    requirement: 'Requires midfielders or wingers to exploit the created spaces',
    counterpart: ['Inside Forward','Channel Mid','Advanced Playmaker'],
  },

  // Catenaccio principle: "A defence-focused style that primarily looks to
  // deny the opposition goalscoring opportunities. Uses 3 centre-backs." — FM26
  CATENACCIO: {
    origin: 'Italy 1950s — Nereo Rocco, Helenio Herrera\'s Inter',
    keyStructure: '3 CBs + libero (positionnement profond) + contre-attaque rapide',
    inFM26: 'Style Catenaccio = Low Block + Covering CBs + No-Nonsense GK',
  },
}

// ── PAIRES DE RÔLES COMPLÉMENTAIRES (théorie Wilson + FM26) ─────────────
// Basé sur les duos historiquement efficaces + logique FM26
export const ROLE_PAIRS = [

  // DÉFENSE
  { a: 'Stopping CB',  b: 'Covering CB',      score: 1.0, cat: 'defense',
    desc: 'Classic CB pairing (Baresi/Costacurta). One intercepts, one covers.' },
  { a: 'Stopping Wide CB', b: 'Covering Wide CB', score: 0.8, cat: 'defense',
    desc: 'Defensive asymmetry in a back-3 — one aggressive flank, one conservative.' },
  { a: 'Pressing FB',  b: 'Screening DM',      score: 0.8, cat: 'defense',
    desc: 'Aggressive FB covered by a wide DM — pressure + security.' },
  { a: 'Sweeper Keeper', b: 'Stopping CB',     score: 0.9, cat: 'defense',
    desc: 'Sweeper Keeper + Stopping CB = viable high line. GK comes out, CB presses.' },

  // MILIEU
  { a: 'Deep-Lying Playmaker', b: 'Box-to-Box Mid (2DM)',    score: 1.0, cat: 'midfield',
    desc: 'Pirlo/Gattuso — the organiser and the box-to-box. Classic FM duo.' },
  { a: 'Deep-Lying Playmaker', b: 'Box-to-Box Playmaker (2DM)', score: 0.9, cat: 'midfield',
    desc: 'Double playmaker at different heights — total midfield control.' },
  { a: 'Half Back',    b: 'Box-to-Box Mid (2DM)',    score: 0.9, cat: 'midfield',
    desc: 'Half Back frees the CBs to advance, the B2B provides vertical energy.' },
  { a: 'Midfield Playmaker', b: 'Pressing CM',       score: 0.8, cat: 'midfield',
    desc: 'Creator protected by a hunter — Xavi/Busquets or Pirlo/Vidal archetype.' },
  { a: 'Channel Mid',  b: 'Inside Winger',            score: 0.9, cat: 'midfield',
    desc: 'Two players exploiting half-spaces — guaranteed defensive chaos.' },

  // ATTAQUE
  { a: 'False 9',      b: 'Inside Forward',           score: 1.0, cat: 'attack',
    desc: 'False 9 drops deep, Inside Forward runs in behind — classic post-2010 duo.' },
  { a: 'False 9',      b: 'Advanced Playmaker',       score: 0.9, cat: 'attack',
    desc: 'Two creators between the lines — requires wide runners in support.' },
  { a: 'Target Forward', b: 'Winger',                  score: 0.9, cat: 'attack',
    desc: 'Tall striker + crossing wingers = dangerous aerial game. Route One archetype.' },
  { a: 'Target Forward', b: 'Playmaking Winger',       score: 0.8, cat: 'attack',
    desc: 'Aerial target + wide creator = varied options.' },
  { a: 'Poacher',      b: 'Deep-Lying Forward',        score: 0.8, cat: 'attack',
    desc: 'Finisher + creator = classic ST pairing. Vardy/Mahrez in miniature.' },
  { a: 'Channel Forward', b: 'Centre Forward',         score: 0.8, cat: 'attack',
    desc: 'Central striker + channel runner — lateral imbalance.' },

  // TRANSITIONS IP/OOP
  { a: 'Ball-Playing GK', b: 'Half Back',              score: 0.9, cat: 'buildup',
    desc: 'Three-player build-up from GK — breaks opposition presses (Guardiola).' },
  { a: 'Ball-Playing CB', b: 'Deep-Lying Playmaker',   score: 0.9, cat: 'buildup',
    desc: 'Ball-carrying CB + DLP — two build-up phases before the central midfielder.' },
  { a: 'Playmaking Wing Back', b: 'Inside Winger',     score: 0.8, cat: 'attack',
    desc: 'Creative WB + inverting winger = half-space overload (Tuchel/Chelsea style).' },
]

// ── CONFLITS DE RÔLES (logique FM26 + principes Wilson) ─────────────────
export const ROLE_CONFLICTS = [

  // Wilson: "A naive faith in improvisational soccer had led to Brazil's
  // underperformances in the thirties" — trop de liberté = chaos
  { roles: ['Free Role','Free Role'],                 penalty: 3.0,
    desc: 'Two Free Roles = total structural breakdown. Even the 1970 Brazilian generation had a system.' },

  // Pressing requires fitness: impossible with No-Nonsense GK
  { roles: ['Half Back','No-Nonsense GK'],            penalty: 1.5,
    desc: 'Half Back builds from the CBs — No-Nonsense GK cuts this circuit completely.' },

  // High line + aggressive keeper needed
  { roles: ['Line-Holding Keeper','Sweeper Keeper'],  penalty: 2.0,
    desc: 'Two contradictory OOP GK roles — never combine them.' },

  // False 9 without runners = the spaces created are wasted
  { trigger: 'False 9', missing: ['Inside Forward','Channel Mid','Channel Forward','Advanced Playmaker'], penalty: 1.5,
    desc: 'False 9 without runners in the channels — the created spaces go unexploited.' },

  // Poacher needs service
  { trigger: 'Poacher', missing: ['Deep-Lying Playmaker','Advanced Playmaker','Playmaking Winger','Midfield Playmaker'], penalty: 1.5,
    desc: 'The Poacher is "an instinctive finisher focused purely on goals" — he needs service.' },

  // Too many ball-winners without creator
  { minCount: { ballWinners: 4 }, noCreators: true, penalty: 1.5,
    desc: 'Too physical without a creator — "nobody wants playmakers" but they are needed.' },

  // Wide CB (3CB) in a 4-back system = positional confusion
  { trigger: 'Wide CB (3CB)', in4back: true, penalty: 1.0,
    desc: 'Wide CB (3CB) is designed for a back-3 system — ineffective in a back-4.' },
]

// ── LOGIQUE DE PRESSING (Wilson ch.12 + FM26) ────────────────────────────
export const PRESSING_LOGIC = {
  // "Pressing was the key, but it was probably only in the mid- to late sixties
  // that it became viable." — Wilson on Michels/Lobanovskyi
  HIGH_PRESS: {
    requiredRoles: ['Tracking CF','Pressing CM','Pressing DM (2DM)'],
    idealGK: 'Sweeper Keeper',
    requiredLine: 'Higher',
    staffWarning: 'Without a Tracking CF, the press does not start at the right moment.',
  },

  GEGENPRESS: {
    // "relies on every player working hard and being fit and mobile enough
    // to press immediately after losing the ball" — FM26 style description
    requiredStamina: 'high',
    keyRoles: ['Box-to-Box Mid (2DM)','Pressing CM','Tracking CF','Tracking Winger'],
    staffWarning: 'Gegenpress is "very tiring for players" — requires optimal fitness.',
  },

  LOW_BLOCK: {
    // "A defence-first approach that primarily looks to restrict the amount
    // of attacking opportunities the opposition are able to create." — FM26
    keyRoles: ['Covering CB','Screening DM','Holding WB','Holding FB','Tracking Wide Mid'],
    avoidRoles: ['Advanced Wing Back','Pressing FB','Pressing WB'],
    staffWarning: 'A Low Block with pressing fullbacks is contradictory.',
  },
}

// ── HISTORICAL FORMATION EVOLUTION ─────────────────────────────────────
// Historical context to enrich formation descriptions
export const FORMATION_HISTORY = {
  '4-3-3': {
    origin: 'Brazil 1958 (Zagallo) → Ajax 1972 (Michels) → Barcelona 1988 (Cruyff)',
    strengths: 'Width + high press + midfield balance',
    weaknesses: 'Defensive exposure if WBs push high',
    legend: 'Ajax 1972, Barcelone 2011, Bayern 2013',
  },
  '4-2-3-1': {
    origin: 'Late 1990s — popularised by Mourinho / Ferguson',
    strengths: 'Double pivot shields defence, creative AM, structured press',
    weaknesses: 'AMC can be isolated if the midfielders do not push forward',
    legend: 'France 2000, Chelsea 2005, Real Madrid 2012',
  },
  '3-5-2': {
    origin: 'Italy 1980s (Trapattoni) → popularised in Serie A',
    strengths: 'Numerical midfield superiority, very offensive WBs',
    weaknesses: 'WBs must provide width = high physical dependency',
    legend: 'Juventus 1985, Inter 2010 (Mourinho), Atletico 2014',
  },
  '4-4-2': {
    origin: 'England 1960s — the "national" formation',
    strengths: 'Perfect balance, easy to understand and defend',
    weaknesses: 'Outdated against teams with 3 central midfielders',
    legend: 'Liverpool 1980s, Milan 1988, Manchester United 1999',
  },
  '3-4-3': {
    origin: 'Netherlands Total Football 1974 → Chelsea 2017 (Conte)',
    strengths: 'Wide CBs create overloads, devastating front 3',
    weaknesses: 'WBs exhausted, wide CBs very exposed',
    legend: 'Netherlands 1974, Chelsea 2017',
  },
}
