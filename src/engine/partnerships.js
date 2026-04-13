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
  DIRECT:         { id: 'direct',        label: 'Direct',        color: '#26E676', dash: false, desc: 'Passes courtes et fiables entre deux positions proches' },
  OVERLAPPING:    { id: 'overlapping',   label: 'Chevauchement', color: '#378ADD', dash: false, desc: 'Un joueur remonte pour créer la surnombre' },
  INTERCHANGING:  { id: 'interchanging', label: 'Interchange',   color: '#FF6619', dash: true,  desc: 'Échange de positions entre deux joueurs' },
  UNDERLAPPING:   { id: 'underlapping',  label: 'Sous-croisement', color: '#C2185B', dash: true, desc: 'Un joueur coupe vers l\'intérieur pour soutenir' },
}

// Niveaux de risque
export const RISK_LEVELS = {
  LOW:     { id: 'low',    label: 'Faible',  color: '#26E676', score: 3 },
  MEDIUM:  { id: 'medium', label: 'Moyen',   color: '#F1C40F', score: 2 },
  HIGH:    { id: 'high',   label: 'Élevé',   color: '#FF6619', score: 1 },
}

// ── Rôles par catégorie de mouvement ─────────────────────────────────────
const ROLE_CATEGORIES = {
  // Joueurs qui cherchent la profondeur (créent des espaces)
  runners: ['Inside Forward','Wide Forward','Channel Forward','Inside Winger','Advanced Playmaker','Channel Mid','False 9'],
  // Joueurs qui chevauchent (remontent sur les flancs)
  overlapping: ['Advanced Wing Back','Playmaking Wing Back','Wing Back','Overlapping CB (3CB)'],
  // Joueurs qui rentrent dans l'axe
  inverted: ['Inside Full Back','Inside Wing Back','Inside Winger','Inside Forward'],
  // Joueurs qui distribuent (point de départ des constructions)
  distributors: ['Deep-Lying Playmaker','Ball-Playing CB','Ball-Playing GK','Half Back','Midfield Playmaker'],
  // Joueurs qui se projettent (B2B, atacants)
  projectors: ['Box-to-Box Mid (2DM)','Box-to-Box Playmaker (2DM)','Advanced Playmaker','Channel Mid'],
  // Joueurs statiques / positionnels
  anchors: ['Defensive Mid','Screening DM','Half Back','No-Nonsense CB','Covering CB'],
  // Finisseurs
  finishers: ['Poacher','Centre Forward','Target Forward','False 9'],
}

function hasCategory(role, cat) {
  return ROLE_CATEGORIES[cat]?.includes(role) ?? false
}

// ── Distance entre deux pions ─────────────────────────────────────────────
function dist(a, b) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2)
}

// ── Détermine si deux pions sont assez proches pour un partnership ────────
// Seuil adaptatif selon les types de postes
function areNeighbors(a, b) {
  const d = dist(a, b)
  // Pions larges (flancs) ont un seuil plus large
  const isWide = (p) => ['FB','WB','MRL','AMRL'].includes(p.t)
  const threshold = (isWide(a) || isWide(b)) ? 32 : 26
  return d <= threshold
}

// ── Calcule le type et le risque d'un partnership ────────────────────────
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

  // Chevauchement : un latéral qui monte + quelqu'un qui se crée dans l'espace
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

// ── Zone d'un pion ────────────────────────────────────────────────────────
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

// ── Calcul de tous les partnerships pour un set de pions ─────────────────
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

// ── Scores offensifs de mouvement vers l'avant ────────────────────────────
// Inspiré de RateMyTactic : penetration, support, solidity par zone
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
      // Bonus latéraux : présence couvrant
      if (['Full Back','Wing Back','No-Nonsense CB','Centre-Back'].includes(r)) solidity += 1
    })

    // Normaliser sur 20
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

// ── Responsabilités positionnelles par zone ───────────────────────────────
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
  left:    'Flanc gauche',
  central: 'Milieu central',
  right:   'Flanc droit',
  defense: 'Défense centrale',
  attack:  'Attaque centrale',
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

// ── Suggestions automatiques basées sur les scores ────────────────────────
export function generatePartnershipSuggestions(fwdScores, partnerships, pionsIP) {
  const suggestions = []

  // Vérifier la solidité par côté
  if (fwdScores.left.solidity < 8) {
    suggestions.push({ type: 'warning', zone: 'left', text: `Solidité faible sur le flanc gauche (${fwdScores.left.solidity}/20). Considérer un Holding WB ou un FB défensif à gauche.` })
  }
  if (fwdScores.right.solidity < 8) {
    suggestions.push({ type: 'warning', zone: 'right', text: `Solidité faible sur le flanc droit (${fwdScores.right.solidity}/20). Considérer un Holding WB ou un FB défensif à droite.` })
  }

  // Vérifier la pénétration centrale
  if (fwdScores.central.penetration < 6) {
    suggestions.push({ type: 'info', zone: 'central', text: `Pénétration centrale faible (${fwdScores.central.penetration}/20). Ajouter un Inside Forward, Channel Mid ou False 9 pour créer des espaces.` })
  }

  // Vérifier le support central
  if (fwdScores.central.support < 6) {
    suggestions.push({ type: 'info', zone: 'central', text: `Support central insuffisant (${fwdScores.central.support}/20). Un DLP ou Advanced Playmaker renforcerait la création centrale.` })
  }

  // Partnerships à haut risque sans ancre
  const highRiskLinks = partnerships.filter(l => l.risk.id === 'high')
  const hasAnchor = pionsIP.some(p => ['Defensive Mid','Half Back','Screening DM','No-Nonsense CB'].includes(p.rIP))
  if (highRiskLinks.length >= 3 && !hasAnchor) {
    suggestions.push({ type: 'warning', zone: 'central', text: `${highRiskLinks.length} partnerships à haut risque sans ancre défensive. Un Screening DM ou Half Back sécuriserait les transitions.` })
  }

  // Trop peu de partnerships (formation trop dispersée)
  if (partnerships.length < 5) {
    suggestions.push({ type: 'info', zone: 'general', text: `Seulement ${partnerships.length} connections entre pions. La formation semble dispersée — rapprocher les lignes améliorerait la circulation du ballon.` })
  }

  return suggestions
}
