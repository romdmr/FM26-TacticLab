/**
 * TacticLab FM26 — Moteur de partnerships entre pions
 *
 * Logique inspirée de RateMyTactic mais adaptée au système FM26.
 * Analyse les liens entre pions voisins sur le terrain selon :
 * - La proximité spatiale
 * - Les rôles IP des deux pions
 * - Le niveau de risque / type de mouvement
 */

// ── Types de partnership ──────────────────────────────────────────────────
export const PARTNERSHIP_TYPES = {
  DIRECT:         { id: 'direct',        label: 'Direct',        color: '#26E676', dash: false, desc: 'Short reliable passes between two close positions' },
  OVERLAPPING:    { id: 'overlapping',   label: 'Overlap', color: '#378ADD', dash: false, desc: 'A player pushes forward to create an overload' },
  INTERCHANGING:  { id: 'interchanging', label: 'Interchange',   color: '#FF6619', dash: true,  desc: 'Position exchange between two players' },
  UNDERLAPPING:   { id: 'underlapping',  label: 'Underlap', color: '#C2185B', dash: true, desc: 'Un joueur coupe vers l\'inside to support' },
}

// Niveaux de risque
export const RISK_LEVELS = {
  LOW:     { id: 'low',    label: 'Low',  color: '#26E676', score: 3 },
  MEDIUM:  { id: 'medium', label: 'Medium',   color: '#F1C40F', score: 2 },
  HIGH:    { id: 'high',   label: 'High',   color: '#FF6619', score: 1 },
}

// ── Roles by movement category ─────────────────────────────────────
const ROLE_CATEGORIES = {
  // Players who look for depth (create spaces)
  runners: ['Inside Forward','Wide Forward','Channel Forward','Inside Winger','Advanced Playmaker','Channel Mid','False 9'],
  // Players who overlap (push up the flanks)
  overlapping: ['Advanced Wing Back','Playmaking Wing Back','Wing Back','Overlapping CB (3CB)'],
  // Players who come inside
  inverted: ['Inside Full Back','Inside Wing Back','Inside Winger','Inside Forward'],
  // Players who distribute (starting point of build-up)
  distributors: ['Deep-Lying Playmaker','Ball-Playing CB','Ball-Playing GK','Half Back','Midfield Playmaker'],
  // Players who project forward (B2B, attackers)
  projectors: ['Box-to-Box Mid (2DM)','Box-to-Box Playmaker (2DM)','Advanced Playmaker','Channel Mid'],
  // Static / positional players
  anchors: ['Defensive Mid','Screening DM','Half Back','No-Nonsense CB','Covering CB'],
  // Finishers
  finishers: ['Poacher','Centre Forward','Target Forward','False 9'],
}

function hasCategory(role, cat) {
  return ROLE_CATEGORIES[cat]?.includes(role) ?? false
}

// ── Distance between two players ─────────────────────────────────────────────
function dist(a, b) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2)
}

// ── Determines if two players are close enough for a partnership ────────
// Seuil adaptatif selon les types de postes
function areNeighbors(a, b) {
  const d = dist(a, b)
  // Pions larges (flancs) ont un seuil plus large
  const isWide = (p) => ['FB','WB','MRL','AMRL'].includes(p.t)
  const threshold = (isWide(a) || isWide(b)) ? 32 : 26
  return d <= threshold
}

// ── Computes the type and risk of a partnership ────────────────────────
function computePartnership(a, b) {
  // Déterminer le mouvement dominant entre les deux pions
  const aRole = a.rIP
  const bRole = b.rIP

  const aRuns    = hasCategory(aRole, 'runners')
  const bRuns    = hasCategory(bRole, 'runners')
  const aOverlap = hasCategory(aRole, 'overlapping')
  const bOverlap = hasCategory(bRole, 'overlapping')
  const aInvert  = hasCategory(aRole, 'inverted')
  const bInvert  = hasCategory(bRole, 'inverted')
  const aDist    = hasCategory(aRole, 'distributors')
  const bDist    = hasCategory(bRole, 'distributors')
  const aAnchor  = hasCategory(aRole, 'anchors')
  const bAnchor  = hasCategory(bRole, 'anchors')
  const aProj    = hasCategory(aRole, 'projectors')
  const bProj    = hasCategory(bRole, 'projectors')

  // Cas spéciaux d'interchange (deux coureurs = échange de positions)
  if (aRuns && bRuns) {
    return { type: PARTNERSHIP_TYPES.INTERCHANGING, risk: RISK_LEVELS.HIGH }
  }

  // Chevauchement : un latéral qui monte + quelqu'one who creates space in the'espace
  if ((aOverlap && bRuns) || (bOverlap && aRuns)) {
    return { type: PARTNERSHIP_TYPES.OVERLAPPING, risk: RISK_LEVELS.HIGH }
  }
  if ((aOverlap && bProj) || (bOverlap && aProj)) {
    return { type: PARTNERSHIP_TYPES.OVERLAPPING, risk: RISK_LEVELS.MEDIUM }
  }
  if (aOverlap || bOverlap) {
    return { type: PARTNERSHIP_TYPES.OVERLAPPING, risk: RISK_LEVELS.MEDIUM }
  }

  // Sous-croisement : joueurs qui rentrent dans l'axe
  if (aInvert && bProj) {
    return { type: PARTNERSHIP_TYPES.UNDERLAPPING, risk: RISK_LEVELS.MEDIUM }
  }
  if (aInvert || bInvert) {
    return { type: PARTNERSHIP_TYPES.UNDERLAPPING, risk: RISK_LEVELS.MEDIUM }
  }

  // Distributeur + coureur = direct haut risque
  if ((aDist && bRuns) || (bDist && aRuns)) {
    return { type: PARTNERSHIP_TYPES.DIRECT, risk: RISK_LEVELS.MEDIUM }
  }

  // Distributeur + ancre = lien direct sécurisé
  if ((aDist && bAnchor) || (bDist && aAnchor)) {
    return { type: PARTNERSHIP_TYPES.DIRECT, risk: RISK_LEVELS.LOW }
  }

  // Ancre + projeteur = lien modéré
  if ((aAnchor && bProj) || (bAnchor && aProj)) {
    return { type: PARTNERSHIP_TYPES.DIRECT, risk: RISK_LEVELS.MEDIUM }
  }

  // Par défaut : lien direct basique
  return { type: PARTNERSHIP_TYPES.DIRECT, risk: RISK_LEVELS.LOW }
}

// ── Zone of a player ────────────────────────────────────────────────────────
function getZone(pion) {
  if (pion.y > 70)      return 'defense'
  if (pion.y > 55)      return 'midlow'
  if (pion.y > 40)      return 'mid'
  if (pion.y > 25)      return 'attack'
  return 'final_third'
}

function getSide(pion) {
  if (pion.x < 33)  return 'left'
  if (pion.x > 67)  return 'right'
  return 'central'
}

// ── Compute all partnerships for a set of players ─────────────────
export function computePartnerships(pions) {
  const links = []

  for (let i = 0; i < pions.length; i++) {
    for (let j = i + 1; j < pions.length; j++) {
      const a = pions[i]
      const b = pions[j]

      if (!areNeighbors(a, b)) continue
      if (a.t === 'GK' && b.t !== 'CB') continue // GK only links to CBs
      if (b.t === 'GK' && a.t !== 'CB') continue

      const { type, risk } = computePartnership(a, b)

      links.push({
        a: i, b: j,
        ax: a.x, ay: a.y,
        bx: b.x, by: b.y,
        type,
        risk,
        zone: getSide(a) === getSide(b) ? getSide(a) : 'central',
        aRole: a.rIP,
        bRole: b.rIP,
      })
    }
  }

  return links
}

// ── Scores par zone (comme RateMyTactic) ─────────────────────────────────
export function computeZoneScores(pions) {
  const zones = {
    left:    { pions: [], links: 0, score: 0 },
    right:   { pions: [], links: 0, score: 0 },
    central: { pions: [], links: 0, score: 0 },
  }

  pions.forEach(p => {
    const side = getSide(p)
    zones[side].pions.push(p)
  })

  const links = computePartnerships(pions)

  links.forEach(link => {
    const side = link.zone
    if (zones[side]) {
      zones[side].links++
      zones[side].score += link.risk.score
    }
  })

  // Normalise sur 20
  Object.values(zones).forEach(z => {
    const maxScore = Math.max(z.pions.length * 3, 1)
    z.normalized = Math.round((z.score / maxScore) * 20 * 10) / 10
  })

  return zones
}

// ── Offensive forward movement scores ────────────────────────────
// Inspired by RateMyTactic: penetration, support, solidity per zone
export function computeForwardMovementScores(pions) {
  const zones = { left: [], central: [], right: [] }
  pions.forEach(p => { zones[getSide(p)].push(p) })

  const scoreZone = (zonePions) => {
    let penetration = 0  // joueurs qui cherchent la profondeur
    let support     = 0  // joueurs qui apportent le soutien
    let solidity    = 0  // joueurs qui ancrent / couvrent

    zonePions.forEach(p => {
      const r = p.rIP
      if (hasCategory(r,'runners'))     penetration += 2
      if (hasCategory(r,'projectors'))  penetration += 1
      if (hasCategory(r,'distributors'))support     += 2
      if (hasCategory(r,'overlapping')) support     += 1.5
      if (hasCategory(r,'anchors'))     solidity    += 2
      // Wide bonus: covering presence
      if (['Full Back','Wing Back','No-Nonsense CB','Centre-Back'].includes(r)) solidity += 1
    })

    // Normalise to 20
    const maxPen = Math.max(zonePions.length * 2, 1)
    const maxSup = Math.max(zonePions.length * 2, 1)
    const maxSol = Math.max(zonePions.length * 2, 1)

    return {
      penetration: Math.min(20, Math.round(penetration / maxPen * 20 * 10) / 10),
      support:     Math.min(20, Math.round(support     / maxSup * 20 * 10) / 10),
      solidity:    Math.min(20, Math.round(solidity    / maxSol * 20 * 10) / 10),
    }
  }

  return {
    left:    scoreZone(zones.left),
    central: scoreZone(zones.central),
    right:   scoreZone(zones.right),
  }
}

// ── Positional responsibilities per zone ───────────────────────────────
// Inspiré de RateMyTactic : quels joueurs assurent quelles responsabilités
const RESPONSIBILITIES = {
  'Applying defensive pressure': (r) =>
    ['Tracking CF','Tracking Winger','Tracking Wide Mid','Pressing CM','Pressing DM (2DM)','Pressing WB','Pressing FB'].includes(r),
  'Creating chances': (r) =>
    ['Advanced Playmaker','Midfield Playmaker','Deep-Lying Playmaker','Ball-Playing CB','Playmaking Winger','Channel Mid'].includes(r),
  'Stretching play': (r) =>
    ['Winger','Wide Mid','Advanced Wing Back','Playmaking Wing Back','Wide Forward','Inside Forward'].includes(r),
  'Taking chances': (r) =>
    ['Poacher','Centre Forward','False 9','Target Forward','Second Striker'].includes(r),
  'Providing defensive cover': (r) =>
    ['Covering CB','Stopping CB','Holding WB','Holding FB','Screening DM','Half Back','Dropping DM'].includes(r),
  'Playing safe': (r) =>
    ['No-Nonsense CB','No-Nonsense GK','Defensive Mid','Goalkeeper'].includes(r),
  'Providing attacking cover': (r) =>
    ['Box-to-Box Mid (2DM)','Box-to-Box Playmaker (2DM)','Central Mid'].includes(r),
}

const ZONE_NAMES = {
  left:    'Left Flank',
  central: 'Central Midfield',
  right:   'Right Flank',
  defense: 'Central Defence',
  attack:  'Central Attack',
}

export function computePositionalResponsibilities(pionsIP, pionsOOP) {
  // Group by zone (side) and phase
  const groups = {}
  const allPosIds = new Set()

  const addToGroup = (pion, label) => {
    const side = getSide(pion)
    const zone = getZone(pion)
    // Use a combined zone key
    let key
    if (zone === 'defense' || zone === 'midlow') key = 'defense'
    else if (zone === 'attack' || zone === 'final_third') key = 'attack'
    else key = side  // left / central / right for midfield

    if (!groups[key]) groups[key] = { ip: [], oop: [] }
    groups[key][label].push(pion)
  }

  pionsIP.forEach(p  => addToGroup(p, 'ip'))
  pionsOOP.forEach(p => addToGroup(p, 'oop'))

  const result = {}
  Object.entries(groups).forEach(([zone, { ip, oop }]) => {
    result[zone] = {}
    Object.entries(RESPONSIBILITIES).forEach(([resp, fn]) => {
      const ipCount  = ip.filter(p => fn(p.rIP)).length
      const oopCount = oop.filter(p => fn(p.rOOP)).length
      if (ipCount > 0 || oopCount > 0) {
        result[zone][resp] = { ip: ipCount, oop: oopCount }
      }
    })
  })

  return result
}

// ── Automatic suggestions based on scores ────────────────────────
export function generatePartnershipSuggestions(fwdScores, partnerships, pionsIP) {
  const suggestions = []

  // Vérifier la solidité par côté
  if (fwdScores.left.solidity < 8) {
    suggestions.push({ type: 'warning', zone: 'left', text: `Low solidity on the left flank (${fwdScores.left.solidity}/20). Consider a Holding WB or defensive FB on the left.` })
  }
  if (fwdScores.right.solidity < 8) {
    suggestions.push({ type: 'warning', zone: 'right', text: `Low solidity on the right flank (${fwdScores.right.solidity}/20). Consider a Holding WB or defensive FB on the right.` })
  }

  // Vérifier la pénétration centrale
  if (fwdScores.central.penetration < 6) {
    suggestions.push({ type: 'info', zone: 'central', text: `Low central penetration (${fwdScores.central.penetration}/20). Add an Inside Forward, Channel Mid or False 9 to create spaces.` })
  }

  // Vérifier le support central
  if (fwdScores.central.support < 6) {
    suggestions.push({ type: 'info', zone: 'central', text: `Insufficient central support (${fwdScores.central.support}/20). A DLP or Advanced Playmaker would strengthen central creation.` })
  }

  // Partnerships à haut risque sans ancre
  const highRiskLinks = partnerships.filter(l => l.risk.id === 'high')
  const hasAnchor = pionsIP.some(p => ['Defensive Mid','Half Back','Screening DM','No-Nonsense CB'].includes(p.rIP))
  if (highRiskLinks.length >= 3 && !hasAnchor) {
    suggestions.push({ type: 'warning', zone: 'central', text: `${highRiskLinks.length} high-risk partnerships without a defensive anchor. A Screening DM or Half Back would secure transitions.` })
  }

  // Trop peu de partnerships (formation trop dispersée)
  if (partnerships.length < 5) {
    suggestions.push({ type: 'info', zone: 'general', text: `Only ${partnerships.length} connections between players. The formation looks dispersed — tightening the lines would improve ball circulation.` })
  }

  return suggestions
}
