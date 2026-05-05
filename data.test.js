/**
 * TacticLab FM26 — Moteur de scoring par profil d'équipe
 *
 * Wilson : "You have to have certain typed players.
 * If you haven't got these types, your system won't be successfully exploited."
 * — Arthur Rowe, Tottenham 1950
 */

import { TEAM_PROFILES, getStyleCompatibility, getTooComplexRoles } from '../data/teamprofiles.js'

// ── Analyse profil ─────────────────────────────────────────────────────────
export function analyseTeamProfile(pions, style, profileKey) {
  const profile = TEAM_PROFILES[profileKey]
  if (!profile) return { score: 8, issues: [], strengths: [], advice: [] }

  const issues = [], strengths = []
  let score = 10

  // 1. Compatibilité style / profil
  const compat = getStyleCompatibility(profileKey, style)
  if (compat.level === 'ideal') {
    strengths.push(`Style "${style}" ideally suited for the ${profile.label} profile`)
  } else if (compat.level === 'workable') {
    strengths.push(`Style "${style}" faisable pour un profil ${profile.label}`)
  } else if (compat.level === 'poor') {
    score -= compat.penalty
    issues.push(`Style "${style}" not advised for a ${profile.label} — ${getStyleMismatchReason(profileKey, style)}`)
  }

  // 2. Rôles trop complexes
  const complex = getTooComplexRoles(profileKey, pions)
  if (complex.length > 0) {
    const complexNames = [...new Set(complex.map(p => p.rIP).filter(r => profile.complexRolePenalty?.includes(r)))]
    if (complexNames.length > 0) {
      const pen = profileKey === 'underdog' ? 0.6 : profileKey === 'subtop' ? 0.4 : 0.2
      score -= complexNames.length * pen
      issues.push(`${complexNames.length} role(s) too complex for a ${profile.label} profile: ${complexNames.slice(0,3).join(', ')}`)
    }
  }

  // 3. Technical role bonuses adapted to profile
  const techBonus = pions.filter(p =>
    profile.technicalBonus?.includes(p.rIP) || profile.technicalBonus?.includes(p.rOOP)
  )
  if (techBonus.length >= 3) {
    strengths.push(`${techBonus.length} roles well suited to the ${profile.label} profile`)
    score = Math.min(10, score + 0.4)
  }

  // 4. Cohérences spécifiques par profil
  if (profileKey === 'elite') {
    // Elite playing Route One = talent wasted
    if (['Route One','Park the Bus'].includes(style)) {
      score -= 2
      issues.push(`Un effectif Elite qui joue "${style}" massively under-exploits its potential`)
    }
    // Elite with No-Nonsense everywhere = too basicue
    const nnCount = pions.filter(p => p.rIP === 'No-Nonsense GK' || p.rIP === 'No-Nonsense CB').length
    if (nnCount >= 2) {
      score -= 1
      issues.push('Too many No-Nonsense roles for an Elite profile — under-exploits technical quality')
    }
  }

  if (profileKey === 'underdog') {
    // Underdog qui tente Tiki-Taka = catastrophe
    if (['Tiki-Taka','Vertical Tiki-Taka'].includes(style)) {
      issues.push(`Wilson : "${style} requires very high technical quality" — incompatible with an Underdog`)
    }
    // Underdog with a simple system = valued
    const simpleRoles = pions.filter(p =>
      profile.simplePosBonus?.includes(p.rIP) || profile.simplePosBonus?.includes(p.rOOP)
    )
    if (simpleRoles.length >= 6) {
      strengths.push(`Simple and direct system — suited to the resources ofun ${profile.label} (Wilson : structure avant technique)`)
      score = Math.min(10, score + 0.5)
    }
    // Underdog avec beaucoup de défenseurs = bon
    const defCount = pions.filter(p => ['CB','FB','WB','DM'].includes(p.t)).length
    if (defCount >= 7) {
      strengths.push(`Dense defensive block — coherent Underdog strategy (${defCount} defensive positions)`)
      score = Math.min(10, score + 0.3)
    }
  }

  if (profileKey === 'subtop') {
    // Sub-Top avec Gegenpress = trop exigeant
    if (style === 'Gegenpress') {
      score -= 1
      issues.push('Gegenpress pour un Sub-Top : "very demanding on players" (FM26) — condition physique insuffisante sur 38 matchs')
    }
    // Sub-Top with Counter = coherent
    if (['Fluid Counter-Attack','Direct Counter-Attack','Wing Play'].includes(style)) {
      strengths.push(`${style} est le style optimal pour maximiser le potentiel d'un Sub-Top`)
    }
  }

  if (profileKey === 'top') {
    // Top playing Tiki-Taka risks turnovers coûteuses
    if (['Tiki-Taka','Vertical Tiki-Taka'].includes(style)) {
      score -= 0.5
      issues.push(`${style} is risky for a Top profile: turnovers in build-up will be punished more severely`)
    }
  }

  return {
    score: Math.max(0, Math.round(score * 10) / 10),
    issues,
    strengths,
    advice: profile.advice,
    profile,
    styleCompat: compat,
  }
}

// ── Raison du mismatch style/profil ─────────────────────────────────────
function getStyleMismatchReason(profileKey, style) {
  const reasons = {
    underdog: {
      'Tiki-Taka': 'requiert un niveau technique Elite (Wilson)',
      'Vertical Tiki-Taka': 'requiert un niveau technique Elite',
      'Gegenpress': 'physically exhausting for average players',
      'Control Possession': 'too risky in build-up without high technique',
    },
    subtop: {
      'Tiki-Taka': 'too complex without very technical players',
      'Vertical Tiki-Taka': 'too complex without very technical players',
      'Gegenpress': 'exhausting over a full season without top fitness',
      'Park the Bus': 'trop passif pour un Sub-Top avec ambitions',
    },
    top: {
      'Park the Bus': 'too defensive for a Top club with ambitions',
      'Route One': 'too basic, under-exploits available quality',
      'Catenaccio': 'survival strategy, not aaspiration pour un Top club',
    },
    elite: {
      'Route One': 'total waste of technical potential',
      'Park the Bus': 'total waste of technical potential',
      'Catenaccio': 'survival strategy unsuited to theElite',
      'Direct Counter-Attack': 'under-exploits the quality of theeffectif',
    },
  }
  return reasons[profileKey]?.[style] || 'unsuited to the resources of this squad'
}

// ── Recommandations de style selon profil ────────────────────────────────
export function getStyleRecommendations(profileKey) {
  const profile = TEAM_PROFILES[profileKey]
  if (!profile) return []
  return [
    ...profile.idealStyles.map(s => ({ style: s, level: 'ideal', label: '✓ Ideal' })),
    ...profile.workableStyles.map(s => ({ style: s, level: 'workable', label: '~ Faisable' })),
    ...profile.suboptimalStyles.map(s => ({ style: s, level: 'poor', label: '✗ Not Advised' })),
  ]
}
