/**
 * TacticLab FM26 — Badges de cohérence IP/OOP par pion
 *
 * Évalue si le couple (rôle IP, rôle OOP) d'un pion est cohérent
 * selon les principes FM26 et la théorie tactique.
 */

// Paires IP→OOP naturellement cohérentes
const GOOD_PAIRS = new Set([
  // GK
  'Ball-Playing GK|Line-Holding Keeper',
  'Ball-Playing GK|Sweeper Keeper',
  'Goalkeeper|Line-Holding Keeper',
  'Goalkeeper|Goalkeeper',
  'No-Nonsense GK|Goalkeeper',
  // CB
  'Ball-Playing CB|Covering CB',
  'Ball-Playing CB|Stopping CB',
  'Centre-Back|Covering CB',
  'Centre-Back|Stopping CB',
  'No-Nonsense CB|Stopping CB',
  'No-Nonsense CB|Covering CB',
  'Advanced CB|Covering CB',
  'Wide CB (3CB)|Covering Wide CB',
  'Wide CB (3CB)|Stopping Wide CB',
  'Overlapping CB (3CB)|Covering Wide CB',
  // FB / WB
  'Full Back|Holding FB',
  'Full Back|Pressing FB',
  'Inside Full Back|Holding FB',
  'Advanced Wing Back|Pressing WB',
  'Playmaking Wing Back|Pressing WB',
  'Wing Back|Holding WB',
  'Wing Back|Pressing WB',
  // DM
  'Deep-Lying Playmaker|Dropping DM',
  'Deep-Lying Playmaker|Screening DM',
  'Half Back|Dropping DM',
  'Defensive Mid|Screening DM',
  'Box-to-Box Mid (2DM)|Pressing DM (2DM)',
  'Box-to-Box Playmaker (2DM)|Pressing DM (2DM)',
  // CM
  'Advanced Playmaker|Pressing CM',
  'Central Mid|Pressing CM',
  'Central Mid|Screening CM',
  'Channel Mid|Pressing CM',
  'Midfield Playmaker|Pressing CM',
  // Wide
  'Winger|Tracking Winger',
  'Inside Winger|Tracking Winger',
  'Wide Mid|Tracking Wide Mid',
  'Wide Mid|Wide Outlet Mid',
  'Inside Forward|Tracking Winger',
  'Wide Forward|Wide Outlet Winger',
  'Playmaking Winger|Tracking Winger',
  // AMC
  'Attacking Mid|Tracking AM',
  'Free Role|Tracking AM',
  'Second Striker|Central Outlet AM',
  'Channel Midfielder|Central Outlet AM',
  // ST
  'Centre Forward|Tracking CF',
  'Centre Forward|Central Outlet CF',
  'False 9|Tracking CF',
  'Poacher|Central Outlet CF',
  'Target Forward|Tracking CF',
  'Deep-Lying Forward|Central Outlet CF',
  'Channel Forward|Central Outlet CF',
])

// Paires IP→OOP contradictoires (pénalité forte)
const BAD_PAIRS = new Set([
  'No-Nonsense GK|Sweeper Keeper',        // contradictoire
  'Ball-Playing GK|Goalkeeper',           // sous-exploité
  'Advanced Wing Back|Holding WB',        // bloque le mouvement offensif
  'Overlapping CB (3CB)|Covering CB',     // mauvaise zone
  'Poacher|Pressing CM',                  // mauvais type de poste
  'False 9|Tracking CF',                  // cohérent mais pas idéal
  'Deep-Lying Playmaker|Pressing DM (2DM)', // lui demande de presser alors qu'il distribue
  'Half Back|Pressing CM',               // rôle trop différent
])

// Catégories de type de poste : offensive / defensive / balanced
const ROLE_NATURE = {
  'Advanced Wing Back': 'offensive', 'Playmaking Wing Back': 'offensive', 'Inside Full Back': 'balanced',
  'Ball-Playing CB': 'balanced', 'Advanced CB': 'offensive', 'Overlapping CB (3CB)': 'offensive',
  'Box-to-Box Mid (2DM)': 'balanced', 'Box-to-Box Playmaker (2DM)': 'offensive',
  'Advanced Playmaker': 'offensive', 'Channel Mid': 'offensive',
  'Inside Winger': 'offensive', 'Inside Forward': 'offensive', 'Wide Forward': 'offensive',
  'False 9': 'offensive', 'Poacher': 'offensive',
  'No-Nonsense GK': 'defensive', 'No-Nonsense CB': 'defensive',
  'Defensive Mid': 'defensive', 'Half Back': 'defensive',
  'Screening DM': 'defensive', 'Holding WB': 'defensive', 'Holding FB': 'defensive',
  'Tracking CF': 'defensive', 'Tracking Winger': 'defensive',
}

const OOP_NATURE = {
  'Sweeper Keeper': 'offensive', 'Ball-Playing GK': 'offensive',
  'Pressing WB': 'offensive', 'Pressing FB': 'offensive', 'Advanced Wing Back': 'offensive',
  'Overlapping CB (3CB)': 'offensive',
  'Pressing CM': 'balanced', 'Pressing DM (2DM)': 'balanced',
  'Wide Outlet Winger': 'offensive', 'Wide Outlet Mid': 'offensive', 'Central Outlet CF': 'offensive',
  'Holding WB': 'defensive', 'Holding FB': 'defensive', 'Covering CB': 'defensive',
  'Screening DM': 'defensive', 'Dropping DM': 'defensive',
  'Tracking CF': 'defensive', 'Tracking Winger': 'defensive', 'Tracking Wide Mid': 'defensive',
  'Line-Holding Keeper': 'defensive', 'Goalkeeper': 'balanced',
}

export function computeCoherence(rIP, rOOP) {
  const key = `${rIP}|${rOOP}`

  if (GOOD_PAIRS.has(key)) {
    return { level: 'good', color: '#26E676', label: '✓', tooltip: `Combinaison optimale : ${rIP} + ${rOOP}` }
  }

  if (BAD_PAIRS.has(key)) {
    return { level: 'bad', color: '#E74C3C', label: '✕', tooltip: `Combinaison contradictoire : ${rIP} + ${rOOP}` }
  }

  // Vérification nature IP vs OOP
  const ipNature  = ROLE_NATURE[rIP]  || 'balanced'
  const oopNature = OOP_NATURE[rOOP] || 'balanced'

  // Un rôle très offensif IP avec un rôle très défensif OOP = ok (c'est l'idée)
  // Un rôle très défensif IP avec un rôle très offensif OOP = problématique
  if (ipNature === 'defensive' && oopNature === 'offensive') {
    return { level: 'warn', color: '#FF6619', label: '~', tooltip: `Attention : ${rIP} (défensif) mais ${rOOP} (offensif en OOP)` }
  }

  return { level: 'ok', color: 'rgba(255,255,255,0.25)', label: '·', tooltip: `Combinaison standard : ${rIP} + ${rOOP}` }
}
