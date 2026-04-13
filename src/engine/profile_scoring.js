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
    strengths.push(`Style "${style}" idéalement adapté au profil ${profile.label}`)
  } else if (compat.level === 'workable') {
    strengths.push(`Style "${style}" faisable pour un profil ${profile.label}`)
  } else if (compat.level === 'poor') {
    score -= compat.penalty
    issues.push(`Style "${style}" déconseillé pour un profil ${profile.label} — ${getStyleMismatchReason(profileKey, style)}`)
  }

  // 2. Rôles trop complexes
  const complex = getTooComplexRoles(profileKey, pions)
  if (complex.length > 0) {
    const complexNames = [...new Set(complex.map(p => p.rIP).filter(r => profile.complexRolePenalty?.includes(r)))]
    if (complexNames.length > 0) {
      const pen = profileKey === 'underdog' ? 0.6 : profileKey === 'subtop' ? 0.4 : 0.2
      score -= complexNames.length * pen
      issues.push(`${complexNames.length} rôle(s) trop complexe(s) pour un profil ${profile.label} : ${complexNames.slice(0,3).join(', ')}`)
    }
  }

  // 3. Bonus rôles techniques adaptés au profil
  const techBonus = pions.filter(p =>
    profile.technicalBonus?.includes(p.rIP) || profile.technicalBonus?.includes(p.rOOP)
  )
  if (techBonus.length >= 3) {
    strengths.push(`${techBonus.length} rôles bien adaptés au profil ${profile.label}`)
    score = Math.min(10, score + 0.4)
  }

  // 4. Cohérences spécifiques par profil
  if (profileKey === 'elite') {
    // Elite qui joue Route One = gâchis de talent
    if (['Route One','Park the Bus'].includes(style)) {
      score -= 2
      issues.push(`Un effectif Elite qui joue "${style}" sous-exploite massivement son potentiel`)
    }
    // Elite avec No-Nonsense partout = trop basique
    const nnCount = pions.filter(p => p.rIP === 'No-Nonsense GK' || p.rIP === 'No-Nonsense CB').length
    if (nnCount >= 2) {
      score -= 1
      issues.push('Trop de rôles No-Nonsense pour un profil Elite — sous-exploite la qualité technique')
    }
  }

  if (profileKey === 'underdog') {
    // Underdog qui tente Tiki-Taka = catastrophe
    if (['Tiki-Taka','Vertical Tiki-Taka'].includes(style)) {
      issues.push(`Wilson : "${style} requiert un très haut niveau technique" — incompatible avec un Underdog`)
    }
    // Underdog avec un système simple = valorisé
    const simpleRoles = pions.filter(p =>
      profile.simplePosBonus?.includes(p.rIP) || profile.simplePosBonus?.includes(p.rOOP)
    )
    if (simpleRoles.length >= 6) {
      strengths.push(`Système simple et direct — adapté aux ressources d'un ${profile.label} (Wilson : structure avant technique)`)
      score = Math.min(10, score + 0.5)
    }
    // Underdog avec beaucoup de défenseurs = bon
    const defCount = pions.filter(p => ['CB','FB','WB','DM'].includes(p.t)).length
    if (defCount >= 7) {
      strengths.push(`Bloc défensif dense — stratégie Underdog cohérente (${defCount} postes défensifs)`)
      score = Math.min(10, score + 0.3)
    }
  }

  if (profileKey === 'subtop') {
    // Sub-Top avec Gegenpress = trop exigeant
    if (style === 'Gegenpress') {
      score -= 1
      issues.push('Gegenpress pour un Sub-Top : "très éprouvant pour les joueurs" (FM26) — condition physique insuffisante sur 38 matchs')
    }
    // Sub-Top avec Counter = cohérent
    if (['Fluid Counter-Attack','Direct Counter-Attack','Wing Play'].includes(style)) {
      strengths.push(`${style} est le style optimal pour maximiser le potentiel d'un Sub-Top`)
    }
  }

  if (profileKey === 'top') {
    // Top qui joue Tiki-Taka risque des pertes de balle coûteuses
    if (['Tiki-Taka','Vertical Tiki-Taka'].includes(style)) {
      score -= 0.5
      issues.push(`${style} est risqué pour un profil Top : les pertes de balle en construction seront davantage punies`)
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
      'Gegenpress': 'épuisant physiquement pour des joueurs moyens',
      'Control Possession': 'trop risqué en construction sans technique élevée',
    },
    subtop: {
      'Tiki-Taka': 'trop complexe sans joueurs très techniques',
      'Vertical Tiki-Taka': 'trop complexe sans joueurs très techniques',
      'Gegenpress': 'épuisant sur une saison complète sans top condition',
      'Park the Bus': 'trop passif pour un Sub-Top avec ambitions',
    },
    top: {
      'Park the Bus': 'trop défensif pour un Top club avec ambitions',
      'Route One': 'trop basique, sous-exploite la qualité disponible',
      'Catenaccio': 'stratégie de survie, pas d\'aspiration pour un Top club',
    },
    elite: {
      'Route One': 'gâchis total du potentiel technique',
      'Park the Bus': 'gâchis total du potentiel technique',
      'Catenaccio': 'stratégie de survie inadaptée à l\'Elite',
      'Direct Counter-Attack': 'sous-exploite la qualité de l\'effectif',
    },
  }
  return reasons[profileKey]?.[style] || 'inadapté au niveau de l\'équipe'
}

// ── Recommandations de style selon profil ────────────────────────────────
export function getStyleRecommendations(profileKey) {
  const profile = TEAM_PROFILES[profileKey]
  if (!profile) return []
  return [
    ...profile.idealStyles.map(s => ({ style: s, level: 'ideal', label: '✓ Idéal' })),
    ...profile.workableStyles.map(s => ({ style: s, level: 'workable', label: '~ Faisable' })),
    ...profile.suboptimalStyles.map(s => ({ style: s, level: 'poor', label: '✗ Déconseillé' })),
  ]
}
