/**
 * TacticLab FM26 — Team Profiles
 *
 * In FM26, the "Team Profile" determines which styles and roles
 * are realistic given the squad resources available.
 */

export const TEAM_PROFILES = {
  elite: {
    key: 'elite',
    label: 'Elite',
    emoji: '👑',
    color: '#F1C40F',
    border: 'rgba(241,196,15,0.4)',
    bg: 'rgba(241,196,15,0.08)',
    desc: 'Top European clubs — technical players, peak fitness, unlimited budget',
    examples: 'Man City, Bayern, Barcelona, PSG, Liverpool',
    fm26: 'World reputation, 4-5 star squad',

    idealStyles: ['Tiki-Taka', 'Vertical Tiki-Taka', 'Gegenpress', 'Control Possession'],
    workableStyles: ['Wing Play', 'Fluid Counter-Attack'],
    suboptimalStyles: ['Direct Counter-Attack', 'Route One', 'Park the Bus', 'Catenaccio'],

    allowedComplexRoles: ['Tiki-Taka','Free Role','False 9','Overlapping CB (3CB)','Box-to-Box Playmaker (2DM)','Advanced Playmaker','Channel Mid','Midfield Playmaker','Wide Central Mid (2CM)'],

    stylePenalty: {},

    technicalBonus: ['Ball-Playing GK','Ball-Playing CB','Advanced Playmaker','False 9','Free Role','Playmaking Wing Back','Channel Mid'],

    advice: [
      'With an Elite squad, prioritise technically demanding roles — players can execute them.',
      'Ball-Playing GK + DLP + Half Back is the optimal build-up circuit for this level.',
      'Avoid Route One or Park the Bus: these are survival tactics, not domination tools.',
    ],
  },

  top: {
    key: 'top',
    label: 'Top',
    emoji: '⭐',
    color: '#26E676',
    border: 'rgba(38,230,118,0.4)',
    bg: 'rgba(38,230,118,0.08)',
    desc: 'Solid top-flight clubs — good players, comfortable budget, a few stars',
    examples: 'Newcastle, Villarreal, Atalanta, Freiburg, Monaco',
    fm26: 'High national reputation, 3-4 star squad',

    idealStyles: ['Control Possession', 'Wing Play', 'Fluid Counter-Attack', 'Gegenpress'],
    workableStyles: ['Tiki-Taka', 'Vertical Tiki-Taka', 'Direct Counter-Attack'],
    suboptimalStyles: ['Park the Bus', 'Catenaccio', 'Route One'],

    allowedComplexRoles: ['False 9', 'Advanced Playmaker', 'Channel Mid', 'Box-to-Box Playmaker (2DM)'],

    stylePenalty: {
      'Tiki-Taka': 0.5,
      'Vertical Tiki-Taka': 0.5,
    },

    technicalBonus: ['Deep-Lying Playmaker','Advanced Playmaker','Ball-Playing CB','Inside Forward'],

    advice: [
      'Gegenpress is effective at this level if the squad has good fitness.',
      'Control Possession + Wing Play are the most reproducible styles with a Top squad.',
      'Tiki-Taka is risky: turnovers in build-up will be punished more severely.',
    ],
  },

  subtop: {
    key: 'subtop',
    label: 'Sub-Top',
    emoji: '🔵',
    color: '#378ADD',
    border: 'rgba(55,138,221,0.4)',
    bg: 'rgba(55,138,221,0.08)',
    desc: 'Mid-table clubs — decent players, average budget, a few emerging talents',
    examples: 'Lens, Mainz, Getafe, promoted clubs with ambitions',
    fm26: 'Average national reputation, 2-3 star squad',

    idealStyles: ['Wing Play', 'Direct Counter-Attack', 'Fluid Counter-Attack', 'Route One'],
    workableStyles: ['Control Possession', 'Catenaccio'],
    suboptimalStyles: ['Tiki-Taka', 'Vertical Tiki-Taka', 'Gegenpress', 'Park the Bus'],

    allowedComplexRoles: ['Deep-Lying Playmaker', 'Advanced Playmaker'],

    stylePenalty: {
      'Tiki-Taka': 1.5,
      'Vertical Tiki-Taka': 1.5,
      'Gegenpress': 1.0,
    },

    complexRolePenalty: ['Free Role','False 9','Overlapping CB (3CB)','Box-to-Box Playmaker (2DM)','Wide Central Mid (2CM)','Channel Mid'],

    technicalBonus: ['Wide Mid','Wing Back','Winger','Central Mid'],

    advice: [
      'Counter-attacking styles are most effective at this level — solid defence + fast transitions.',
      'Wing Play exploits the flanks well without requiring high central technique.',
      'Avoid Gegenpress: too demanding on average players over 38 matches.',
      'A False 9 or Free Role with Sub-Top players will underperform — stick to simpler roles.',
    ],
  },

  underdog: {
    key: 'underdog',
    label: 'Underdog',
    emoji: '🐉',
    color: '#FF6619',
    border: 'rgba(255,102,25,0.4)',
    bg: 'rgba(255,102,25,0.08)',
    desc: 'Lower clubs or promoted sides — limited resources, average players, survival first',
    examples: 'Promoted clubs, bottom-table teams, smaller national teams',
    fm26: 'Local reputation, 1-2 star squad',

    idealStyles: ['Park the Bus', 'Catenaccio', 'Direct Counter-Attack', 'Route One'],
    workableStyles: ['Fluid Counter-Attack', 'Wing Play'],
    suboptimalStyles: ['Tiki-Taka', 'Vertical Tiki-Taka', 'Gegenpress', 'Control Possession'],

    allowedComplexRoles: [],

    stylePenalty: {
      'Tiki-Taka': 3.0,
      'Vertical Tiki-Taka': 3.0,
      'Gegenpress': 2.5,
      'Control Possession': 2.0,
    },

    complexRolePenalty: [
      'Free Role','False 9','Overlapping CB (3CB)','Box-to-Box Playmaker (2DM)',
      'Wide Central Mid (2CM)','Channel Mid','Advanced Playmaker','Ball-Playing GK',
      'Ball-Playing CB','Playmaking Wing Back','Midfield Playmaker',
    ],

    simplePosBonus: ['Centre-Back','Full Back','Wing Back','Defensive Mid','Winger','Centre Forward','Wide Mid'],

    technicalBonus: ['No-Nonsense CB','Covering CB','Screening DM','Holding WB','Tracking Winger'],

    advice: [
      'Park the Bus + direct counter-attacks is the historically proven underdog approach (Leicester 2016, Simeone\'s Atletico).',
      'Simple and disciplined roles outperform complex roles poorly executed.',
      'Route One + Target Forward is effective if you lack the technicians to play short.',
      'Catenaccio with 3 CBs provides maximum defensive security with limited individual quality.',
    ],
  },
}

export const PROFILE_KEYS = Object.keys(TEAM_PROFILES)

// ── Profile / style compatibility ─────────────────────────────────────────
export function getStyleCompatibility(profileKey, style) {
  const profile = TEAM_PROFILES[profileKey]
  if (!profile) return { level: 'neutral', label: 'Neutral', penalty: 0 }

  if (profile.idealStyles.includes(style))
    return { level: 'ideal',    label: 'Ideal',        penalty: 0,    color: profile.color }
  if (profile.workableStyles.includes(style))
    return { level: 'workable', label: 'Workable',     penalty: 0,    color: 'rgba(255,255,255,0.5)' }
  if (profile.suboptimalStyles.includes(style))
    return { level: 'poor',     label: 'Not Advised',  penalty: profile.stylePenalty?.[style] || 1.0, color: '#E74C3C' }
  return { level: 'neutral', label: 'Neutral', penalty: 0 }
}

// ── Roles too complex for a profile ──────────────────────────────────────
export function getTooComplexRoles(profileKey, pions) {
  const profile = TEAM_PROFILES[profileKey]
  if (!profile?.complexRolePenalty) return []
  return pions.filter(p =>
    profile.complexRolePenalty.includes(p.rIP) ||
    profile.complexRolePenalty.includes(p.rOOP)
  )
}
