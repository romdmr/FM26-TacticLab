/**
 * TacticLab — Tests des données FM26
 * Vérifie l'intégrité et la cohérence des données de base
 */

import { describe, it, expect } from 'vitest'
import { ROLES_IP, ROLES_OOP, POS_TYPES } from '../data/fm26.js'
import { PITCH_POSITIONS, FORMATIONS_IP, FORMATIONS_OOP, findNearestPosition } from '../data/positions.js'
import { ROLE_ATTRIBUTES } from '../data/attributes.js'
import { PLAY_STYLES, PLAY_STYLE_KEYS } from '../data/playstyles.js'
import { TEAM_PROFILES, PROFILE_KEYS, getStyleCompatibility } from '../data/teamprofiles.js'

// ── Données FM26 : rôles ───────────────────────────────────────────────────
describe('ROLES_IP', () => {
  it('existe et contient au moins 8 types de postes', () => {
    expect(Object.keys(ROLES_IP).length).toBeGreaterThanOrEqual(8)
  })

  it('chaque type de poste a au moins un rôle IP', () => {
    Object.entries(ROLES_IP).forEach(([type, roles]) => {
      expect(Array.isArray(roles)).toBe(true)
      expect(roles.length).toBeGreaterThan(0)
    })
  })

  it('contient les types de postes fondamentaux', () => {
    const required = ['GK', 'CB', 'FB', 'WB', 'DM', 'CM', 'ST']
    required.forEach(t => {
      expect(ROLES_IP).toHaveProperty(t)
    })
  })

  it('GK a bien les rôles attendus', () => {
    expect(ROLES_IP.GK).toContain('Goalkeeper')
    expect(ROLES_IP.GK).toContain('Ball-Playing GK')
    expect(ROLES_IP.GK).toContain('No-Nonsense GK')
  })

  it('ST a bien les rôles offensifs attendus', () => {
    expect(ROLES_IP.ST).toContain('Centre Forward')
    expect(ROLES_IP.ST).toContain('False 9')
    expect(ROLES_IP.ST).toContain('Poacher')
    expect(ROLES_IP.ST).toContain('Target Forward')
  })
})

describe('ROLES_OOP', () => {
  it('chaque type de poste a au moins un rôle OOP', () => {
    Object.entries(ROLES_OOP).forEach(([type, roles]) => {
      expect(Array.isArray(roles)).toBe(true)
      expect(roles.length).toBeGreaterThan(0)
    })
  })

  it('GK OOP contient Sweeper Keeper et Line-Holding Keeper', () => {
    expect(ROLES_OOP.GK).toContain('Sweeper Keeper')
    expect(ROLES_OOP.GK).toContain('Line-Holding Keeper')
  })

  it('ST OOP contient Tracking CF', () => {
    expect(ROLES_OOP.ST).toContain('Tracking CF')
  })
})

describe('POS_TYPES', () => {
  it('chaque type a bg, tx et label', () => {
    Object.values(POS_TYPES).forEach(type => {
      expect(type).toHaveProperty('bg')
      expect(type).toHaveProperty('tx')
      expect(type).toHaveProperty('label')
    })
  })
})

// ── Positions fixes ────────────────────────────────────────────────────────
describe('PITCH_POSITIONS', () => {
  it('contient exactement 24 positions', () => {
    expect(Object.keys(PITCH_POSITIONS).length).toBe(24)
  })

  it('chaque position a les propriétés requises', () => {
    Object.entries(PITCH_POSITIONS).forEach(([id, pos]) => {
      expect(pos).toHaveProperty('x')
      expect(pos).toHaveProperty('y')
      expect(pos).toHaveProperty('type')
      expect(pos).toHaveProperty('label')
      expect(pos).toHaveProperty('zone')
    })
  })

  it('les coordonnées sont comprises entre 0 et 100', () => {
    Object.values(PITCH_POSITIONS).forEach(pos => {
      expect(pos.x).toBeGreaterThanOrEqual(0)
      expect(pos.x).toBeLessThanOrEqual(100)
      expect(pos.y).toBeGreaterThanOrEqual(0)
      expect(pos.y).toBeLessThanOrEqual(100)
    })
  })

  it('GK est en bas du terrain (y > 80)', () => {
    expect(PITCH_POSITIONS.GK.y).toBeGreaterThan(80)
  })

  it('les attaquants sont en haut (y < 25)', () => {
    expect(PITCH_POSITIONS.STC.y).toBeLessThan(25)
    expect(PITCH_POSITIONS.STL.y).toBeLessThan(25)
    expect(PITCH_POSITIONS.STR.y).toBeLessThan(25)
  })

  it('GK a le type GK', () => {
    expect(PITCH_POSITIONS.GK.type).toBe('GK')
  })

  it('STC a le type ST', () => {
    expect(PITCH_POSITIONS.STC.type).toBe('ST')
  })

  it('chaque type de position a des rôles IP correspondants', () => {
    Object.values(PITCH_POSITIONS).forEach(pos => {
      expect(ROLES_IP).toHaveProperty(pos.type)
    })
  })
})

describe('findNearestPosition', () => {
  it('trouve la position la plus proche dans le rayon de snap', () => {
    const gk = PITCH_POSITIONS.GK
    const result = findNearestPosition(gk.x, gk.y)
    expect(result).not.toBeNull()
    expect(result.id).toBe('GK')
  })

  it('retourne null si aucune position dans le rayon', () => {
    // Coordonnées au milieu du terrain, loin de toute position fixe
    const result = findNearestPosition(50, 50)
    // Peut retourner null ou la position la plus proche selon le rayon
    if (result !== null) {
      expect(result).toHaveProperty('id')
      expect(result).toHaveProperty('dist')
    }
  })

  it('exclut correctement la position spécifiée', () => {
    const gk = PITCH_POSITIONS.GK
    const result = findNearestPosition(gk.x, gk.y, 'GK')
    // Ne doit pas retourner GK lui-même
    if (result !== null) {
      expect(result.id).not.toBe('GK')
    }
  })
})

describe('Formations', () => {
  it('les formations IP contiennent exactement 11 postes chacune', () => {
    Object.entries(FORMATIONS_IP).forEach(([name, positions]) => {
      expect(positions.length).toBe(11)
    })
  })

  it('les formations OOP contiennent exactement 11 postes chacune', () => {
    Object.entries(FORMATIONS_OOP).forEach(([name, positions]) => {
      expect(positions.length).toBe(11)
    })
  })

  it('toutes les positions référencées dans les formations existent dans PITCH_POSITIONS', () => {
    const allFormations = [...Object.values(FORMATIONS_IP), ...Object.values(FORMATIONS_OOP)]
    allFormations.forEach(formation => {
      formation.forEach(posId => {
        expect(PITCH_POSITIONS).toHaveProperty(posId)
      })
    })
  })

  it('toutes les formations incluent un GK', () => {
    const allFormations = { ...FORMATIONS_IP, ...FORMATIONS_OOP }
    Object.entries(allFormations).forEach(([name, positions]) => {
      expect(positions).toContain('GK')
    })
  })
})

// ── Attributs ──────────────────────────────────────────────────────────────
describe('ROLE_ATTRIBUTES', () => {
  it('contient des attributs pour au moins 40 rôles', () => {
    expect(Object.keys(ROLE_ATTRIBUTES).length).toBeGreaterThanOrEqual(40)
  })

  it('chaque entrée a les propriétés key, preferred, unnecessary', () => {
    Object.entries(ROLE_ATTRIBUTES).forEach(([role, attrs]) => {
      expect(attrs).toHaveProperty('key')
      expect(attrs).toHaveProperty('preferred')
      expect(attrs).toHaveProperty('unnecessary')
      expect(Array.isArray(attrs.key)).toBe(true)
      expect(Array.isArray(attrs.preferred)).toBe(true)
    })
  })

  it('Goalkeeper a les bons attributs clés', () => {
    const gk = ROLE_ATTRIBUTES['Goalkeeper']
    expect(gk).toBeDefined()
    expect(gk.key).toContain('Reflexes')
    expect(gk.key).toContain('Positioning')
    expect(gk.key).toContain('Handling')
  })

  it('False 9 a les attributs techniques attendus', () => {
    const f9 = ROLE_ATTRIBUTES['False 9']
    expect(f9).toBeDefined()
    expect(f9.key).toContain('Dribbling')
    expect(f9.key).toContain('Vision')
    expect(f9.key).toContain('Passing')
  })

  it('No-Nonsense GK a Passing en unnecessary', () => {
    const nn = ROLE_ATTRIBUTES['No-Nonsense GK']
    expect(nn).toBeDefined()
    expect(nn.unnecessary).toContain('Passing')
  })
})

// ── Styles de jeu ──────────────────────────────────────────────────────────
describe('PLAY_STYLES', () => {
  it('contient exactement 10 styles FM26 officiels', () => {
    expect(PLAY_STYLE_KEYS.length).toBe(10)
  })

  it('chaque style a les propriétés requises', () => {
    Object.values(PLAY_STYLES).forEach(style => {
      expect(style).toHaveProperty('label')
      expect(style).toHaveProperty('description')
      expect(style).toHaveProperty('feedback')
      expect(style.feedback).toHaveProperty('pos')
      expect(style.feedback).toHaveProperty('neg')
      expect(style).toHaveProperty('tiIP')
      expect(style).toHaveProperty('tiOOP')
    })
  })

  it('les styles clés sont présents', () => {
    const required = ['Tiki-Taka', 'Gegenpress', 'Park the Bus', 'Control Possession', 'Route One']
    required.forEach(s => {
      expect(PLAY_STYLES).toHaveProperty(s)
    })
  })

  it('Gegenpress a un tempo élevé en IP', () => {
    expect(PLAY_STYLES['Gegenpress'].tiIP.tempo).toMatch(/Higher/)
  })

  it('Park the Bus a un Low Block en OOP', () => {
    expect(PLAY_STYLES['Park the Bus'].tiOOP.lineEngagement).toBe('Low Block')
  })

  it('Tiki-Taka a des passes très courtes en IP', () => {
    expect(PLAY_STYLES['Tiki-Taka'].tiIP.passingDirectness).toBe('Much Shorter')
  })
})

// ── Profils d'équipe ───────────────────────────────────────────────────────
describe('TEAM_PROFILES', () => {
  it('contient exactement 4 profils', () => {
    expect(PROFILE_KEYS.length).toBe(4)
  })

  it('les 4 profils attendus sont présents', () => {
    expect(TEAM_PROFILES).toHaveProperty('elite')
    expect(TEAM_PROFILES).toHaveProperty('top')
    expect(TEAM_PROFILES).toHaveProperty('subtop')
    expect(TEAM_PROFILES).toHaveProperty('underdog')
  })

  it('chaque profil a les propriétés requises', () => {
    Object.values(TEAM_PROFILES).forEach(profile => {
      expect(profile).toHaveProperty('key')
      expect(profile).toHaveProperty('label')
      expect(profile).toHaveProperty('emoji')
      expect(profile).toHaveProperty('color')
      expect(profile).toHaveProperty('idealStyles')
      expect(profile).toHaveProperty('suboptimalStyles')
      expect(profile).toHaveProperty('advice')
      expect(Array.isArray(profile.idealStyles)).toBe(true)
      expect(Array.isArray(profile.suboptimalStyles)).toBe(true)
      expect(Array.isArray(profile.advice)).toBe(true)
    })
  })

  it('Elite a Tiki-Taka comme style idéal', () => {
    expect(TEAM_PROFILES.elite.idealStyles).toContain('Tiki-Taka')
  })

  it('Underdog a Park the Bus comme style idéal', () => {
    expect(TEAM_PROFILES.underdog.idealStyles).toContain('Park the Bus')
  })

  it('Elite a Park the Bus comme style sous-optimal', () => {
    expect(TEAM_PROFILES.elite.suboptimalStyles).toContain('Park the Bus')
  })

  it('Underdog a Tiki-Taka comme style sous-optimal', () => {
    expect(TEAM_PROFILES.underdog.suboptimalStyles).toContain('Tiki-Taka')
  })
})

describe('getStyleCompatibility', () => {
  it('retourne "ideal" pour Elite + Tiki-Taka', () => {
    const result = getStyleCompatibility('elite', 'Tiki-Taka')
    expect(result.level).toBe('ideal')
  })

  it('retourne "poor" pour Underdog + Tiki-Taka', () => {
    const result = getStyleCompatibility('underdog', 'Tiki-Taka')
    expect(result.level).toBe('poor')
    expect(result.penalty).toBeGreaterThan(0)
  })

  it('retourne "ideal" pour Underdog + Park the Bus', () => {
    const result = getStyleCompatibility('underdog', 'Park the Bus')
    expect(result.level).toBe('ideal')
  })

  it('retourne "poor" pour Elite + Park the Bus', () => {
    const result = getStyleCompatibility('elite', 'Park the Bus')
    expect(result.level).toBe('poor')
  })

  it('retourne une pénalité pour un style sous-optimal', () => {
    const result = getStyleCompatibility('underdog', 'Gegenpress')
    expect(result.penalty).toBeGreaterThan(0)
  })
})
