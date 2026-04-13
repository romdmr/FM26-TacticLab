/**
 * TacticLab FM26 — Profils d'équipe
 *
 * Basé sur Wilson : "You have to have certain typed players.
 * If you haven't got these types, your system won't be successfully exploited."
 * — Arthur Rowe, Tottenham 1950
 *
 * En FM26, la notion de "Team Profile" détermine quels styles et rôles
 * sont réalistes selon les ressources disponibles.
 */

export const TEAM_PROFILES = {
  elite: {
    key: 'elite',
    label: 'Elite',
    emoji: '👑',
    color: '#F1C40F',
    border: 'rgba(241,196,15,0.4)',
    bg: 'rgba(241,196,15,0.08)',
    desc: 'Top clubs européens — joueurs techniques, condition physique maximale, budget illimité',
    examples: 'Man City, Bayern, Barcelone, PSG, Liverpool',
    fm26: 'Réputation mondiale, effectif 4-5 étoiles',

    // Styles pleinement adaptés
    idealStyles: ['Tiki-Taka', 'Vertical Tiki-Taka', 'Gegenpress', 'Control Possession'],
    // Styles fonctionnels
    workableStyles: ['Wing Play', 'Fluid Counter-Attack'],
    // Styles sous-optimaux (gâchis de talent)
    suboptimalStyles: ['Direct Counter-Attack', 'Route One', 'Park the Bus', 'Catenaccio'],

    // Rôles complexes accessibles
    allowedComplexRoles: ['Tiki-Taka','Free Role','False 9','Overlapping CB (3CB)','Box-to-Box Playmaker (2DM)','Advanced Playmaker','Channel Mid','Midfield Playmaker','Wide Central Mid (2CM)'],

    // Pénalités style si pas Elite
    stylePenalty: {},

    // Bonus de cohérence pour rôles techniques
    technicalBonus: ['Ball-Playing GK','Ball-Playing CB','Advanced Playmaker','False 9','Free Role','Playmaking Wing Back','Channel Mid'],

    // Recommandations spécifiques
    advice: [
      'Avec un effectif Elite, privilégier des rôles techniques exigeants — les joueurs sont capables de les exécuter.',
      'Le Ball-Playing GK + DLP + Half Back est le circuit de build-up optimal pour ce niveau.',
      'Éviter Route One ou Park the Bus : ce sont des tactiques de survie, pas de domination.',
    ],
  },

  top: {
    key: 'top',
    label: 'Top',
    emoji: '⭐',
    color: '#26E676',
    border: 'rgba(38,230,118,0.4)',
    bg: 'rgba(38,230,118,0.08)',
    desc: 'Clubs solides du top national — bons joueurs, budget confortable, quelques stars',
    examples: 'Newcastle, Villarreal, Atalanta, Freiburg, Monaco',
    fm26: 'Réputation nationale haute, effectif 3-4 étoiles',

    idealStyles: ['Control Possession', 'Wing Play', 'Fluid Counter-Attack', 'Gegenpress'],
    workableStyles: ['Tiki-Taka', 'Vertical Tiki-Taka', 'Direct Counter-Attack'],
    suboptimalStyles: ['Park the Bus', 'Catenaccio', 'Route One'],

    allowedComplexRoles: ['False 9', 'Advanced Playmaker', 'Channel Mid', 'Box-to-Box Playmaker (2DM)'],

    stylePenalty: {
      'Tiki-Taka': 0.5,       // Faisable mais risqué sans joueurs Elite
      'Vertical Tiki-Taka': 0.5,
    },

    technicalBonus: ['Deep-Lying Playmaker','Advanced Playmaker','Ball-Playing CB','Inside Forward'],

    advice: [
      'Le Gegenpress est efficace à ce niveau si l\'effectif a une bonne condition physique.',
      'Control Possession + Wing Play sont les styles les plus reproductibles avec un effectif Top.',
      'Tiki-Taka est risqué : les pertes de balle en construction seront pénalisées plus sévèrement.',
    ],
  },

  subtop: {
    key: 'subtop',
    label: 'Sub-Top',
    emoji: '🔵',
    color: '#378ADD',
    border: 'rgba(55,138,221,0.4)',
    bg: 'rgba(55,138,221,0.08)',
    desc: 'Clubs mid-table — joueurs corrects, budget moyen, quelques talents émergents',
    examples: 'Lens, St-Étienne retour en L1, Mainz, Getafe',
    fm26: 'Réputation nationale moyenne, effectif 2-3 étoiles',

    idealStyles: ['Wing Play', 'Direct Counter-Attack', 'Fluid Counter-Attack', 'Route One'],
    workableStyles: ['Control Possession', 'Catenaccio'],
    suboptimalStyles: ['Tiki-Taka', 'Vertical Tiki-Taka', 'Gegenpress', 'Park the Bus'],

    allowedComplexRoles: ['Deep-Lying Playmaker', 'Advanced Playmaker'],

    stylePenalty: {
      'Tiki-Taka': 1.5,
      'Vertical Tiki-Taka': 1.5,
      'Gegenpress': 1.0,       // Physiquement trop exigeant
    },

    // Rôles trop complexes pour ce niveau = pénalité
    complexRolePenalty: ['Free Role','False 9','Overlapping CB (3CB)','Box-to-Box Playmaker (2DM)','Wide Central Mid (2CM)','Channel Mid'],

    technicalBonus: ['Wide Mid','Wing Back','Winger','Central Mid'],

    advice: [
      'Les styles de contre-attaque sont les plus efficaces à ce niveau — défense solide + transitions rapides.',
      'Le Wing Play exploite bien les flancs sans nécessiter une technique centrale élevée.',
      'Éviter le Gegenpress : trop épuisant pour des joueurs moyens sur 38 matchs.',
      'Un False 9 ou Free Role avec des joueurs Sub-Top sera inefficace — privilégier des rôles simples.',
    ],
  },

  underdog: {
    key: 'underdog',
    label: 'Underdog',
    emoji: '🐉',
    color: '#FF6619',
    border: 'rgba(255,102,25,0.4)',
    bg: 'rgba(255,102,25,0.08)',
    desc: 'Clubs inférieurs ou promus — ressources limitées, joueurs moyens, survie avant tout',
    examples: 'Clubs promus, équipes de bas de tableau, équipes nationales mineures',
    fm26: 'Réputation locale, effectif 1-2 étoiles',

    idealStyles: ['Park the Bus', 'Catenaccio', 'Direct Counter-Attack', 'Route One'],
    workableStyles: ['Fluid Counter-Attack', 'Wing Play'],
    suboptimalStyles: ['Tiki-Taka', 'Vertical Tiki-Taka', 'Gegenpress', 'Control Possession'],

    allowedComplexRoles: [],  // Aucun rôle complexe recommandé

    stylePenalty: {
      'Tiki-Taka': 3.0,
      'Vertical Tiki-Taka': 3.0,
      'Gegenpress': 2.5,
      'Control Possession': 2.0,
    },

    // Tous les rôles techniques avancés = pénalité
    complexRolePenalty: [
      'Free Role','False 9','Overlapping CB (3CB)','Box-to-Box Playmaker (2DM)',
      'Wide Central Mid (2CM)','Channel Mid','Advanced Playmaker','Ball-Playing GK',
      'Ball-Playing CB','Playmaking Wing Back','Midfield Playmaker',
    ],

    // Rôles simples = bonus car bien adaptés
    simplePosBonus: ['Centre-Back','Full Back','Wing Back','Defensive Mid','Winger','Centre Forward','Wide Mid'],

    technicalBonus: ['No-Nonsense CB','Covering CB','Screening DM','Holding WB','Tracking Winger'],

    advice: [
      'Wilson : "Une foi naïve dans le football improvisé a conduit aux sous-performances brésiliennes des années 30." — Structure avant technique.',
      'Park the Bus + contre-attaques directes est la tactique historique des Underdog (Leicester 2016, Atletico Simeone).',
      'Des rôles simples et disciplinés surpassent des rôles complexes mal exécutés.',
      'Route One + Target Forward est efficace si vous n\'avez pas les techniciens pour jouer court.',
      'Catenaccio à 3 CBs offre une sécurité défensive maximale avec peu de qualité individuelle.',
    ],
  },
}

export const PROFILE_KEYS = Object.keys(TEAM_PROFILES)

// ── Analyse de compatibilité profil/style ─────────────────────────────────
export function getStyleCompatibility(profileKey, style) {
  const profile = TEAM_PROFILES[profileKey]
  if (!profile) return { level: 'neutral', label: 'Neutre', penalty: 0 }

  if (profile.idealStyles.includes(style))
    return { level: 'ideal',    label: 'Idéal',      penalty: 0,    color: profile.color }
  if (profile.workableStyles.includes(style))
    return { level: 'workable', label: 'Faisable',   penalty: 0,    color: 'rgba(255,255,255,0.5)' }
  if (profile.suboptimalStyles.includes(style))
    return { level: 'poor',     label: 'Déconseillé', penalty: profile.stylePenalty?.[style] || 1.0, color: '#E74C3C' }
  return { level: 'neutral', label: 'Neutre', penalty: 0 }
}

// ── Rôles trop complexes pour un profil ──────────────────────────────────
export function getTooComplexRoles(profileKey, pions) {
  const profile = TEAM_PROFILES[profileKey]
  if (!profile?.complexRolePenalty) return []
  return pions.filter(p =>
    profile.complexRolePenalty.includes(p.rIP) ||
    profile.complexRolePenalty.includes(p.rOOP)
  )
}
