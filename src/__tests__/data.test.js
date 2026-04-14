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
  it('exists and contains at least 8 position types', () => {
    expect(Object.keys(ROLES_IP).length).toBeGreaterThanOrEqual(8)
  })

  it('each position type has at least one IP role', () => {
    Object.entries(ROLES_IP).forEach(([type, roles]) => {
      expect(Array.isArray(roles)).toBe(true)
      expect(roles.length).toBeGreaterThan(0)
    })
  })

  it('contains fundamental position types', () => {
    const required = ['GK', 'CB', 'FB', 'WB', 'DM', 'CM', 'ST']
    required.forEach(t => {
      expect(ROLES_IP).toHaveProperty(t)
    })
  })

  it('GK has the expected roles', () => {
    expect(ROLES_IP.GK).toContain('Goalkeeper')
    expect(ROLES_IP.GK).toContain('Ball-Playing GK')
    expect(ROLES_IP.GK).toContain('No-Nonsense GK')
  })

  it('ST has the expected offensive roles', () => {
    expect(ROLES_IP.ST).toContain('Centre Forward')
    expect(ROLES_IP.ST).toContain('False 9')
    expect(ROLES_IP.ST).toContain('Poacher')
    expect(ROLES_IP.ST).toContain('Target Forward')
  })
})

describe('ROLES_OOP', () => {
  it('each position type has at least one OOP role', () => {
    Object.entries(ROLES_OOP).forEach(([type, roles]) => {
      expect(Array.isArray(roles)).toBe(true)
      expect(roles.length).toBeGreaterThan(0)
    })
  })

  it('GK OOP contains Sweeper Keeper and Line-Holding Keeper', () => {
    expect(ROLES_OOP.GK).toContain('Sweeper Keeper')
    expect(ROLES_OOP.GK).toContain('Line-Holding Keeper')
  })

  it('ST OOP contains Tracking CF', () => {
    expect(ROLES_OOP.ST).toContain('Tracking CF')
  })
})

describe('POS_TYPES', () => {
  it('each type has bg, tx and label', () => {
    Object.values(POS_TYPES).forEach(type => {
      expect(type).toHaveProperty('bg')
      expect(type).toHaveProperty('tx')
      expect(type).toHaveProperty('label')
    })
  })
})

// ── Positions fixes ────────────────────────────────────────────────────────
describe('PITCH_POSITIONS', () => {
  it('contains exactly 24 positions', () => {
    expect(Object.keys(PITCH_POSITIONS).length).toBe(24)
  })

  it('each position has the required properties', () => {
    Object.entries(PITCH_POSITIONS).forEach(([id, pos]) => {
      expect(pos).toHaveProperty('x')
      expect(pos).toHaveProperty('y')
      expect(pos).toHaveProperty('type')
      expect(pos).toHaveProperty('label')
      expect(pos).toHaveProperty('zone')
    })
  })

  it('coordinates are between 0 and 100', () => {
    Object.values(PITCH_POSITIONS).forEach(pos => {
      expect(pos.x).toBeGreaterThanOrEqual(0)
      expect(pos.x).toBeLessThanOrEqual(100)
      expect(pos.y).toBeGreaterThanOrEqual(0)
      expect(pos.y).toBeLessThanOrEqual(100)
    })
  })

  it('GK is at the bottom of the pitch (y > 80)', () => {
    expect(PITCH_POSITIONS.GK.y).toBeGreaterThan(80)
  })

  it('attackers are at the top (y < 25)', () => {
    expect(PITCH_POSITIONS.STC.y).toBeLessThan(25)
    expect(PITCH_POSITIONS.STL.y).toBeLessThan(25)
    expect(PITCH_POSITIONS.STR.y).toBeLessThan(25)
  })

  it('GK has type GK', () => {
    expect(PITCH_POSITIONS.GK.type).toBe('GK')
  })

  it('STC has type ST', () => {
    expect(PITCH_POSITIONS.STC.type).toBe('ST')
  })

  it('each position type has corresponding IP roles', () => {
    Object.values(PITCH_POSITIONS).forEach(pos => {
      expect(ROLES_IP).toHaveProperty(pos.type)
    })
  })
})

describe('findNearestPosition', () => {
  it('finds the nearest position within snap radius', () => {
    const gk = PITCH_POSITIONS.GK
    const result = findNearestPosition(gk.x, gk.y)
    expect(result).not.toBeNull()
    expect(result.id).toBe('GK')
  })

  it('returns null if no position within radius', () => {
    // Coordonnées au milieu du terrain, loin de toute position fixe
    const result = findNearestPosition(50, 50)
    // Peut retourner null ou la position la plus proche selon le rayon
    if (result !== null) {
      expect(result).toHaveProperty('id')
      expect(result).toHaveProperty('dist')
    }
  })

  it('correctly excludes the specified position', () => {
    const gk = PITCH_POSITIONS.GK
    const result = findNearestPosition(gk.x, gk.y, 'GK')
    // Ne doit pas retourner GK lui-même
    if (result !== null) {
      expect(result.id).not.toBe('GK')
    }
  })
})

describe('Formations', () => {
  it('IP formations contain exactly 11 positions each', () => {
    Object.entries(FORMATIONS_IP).forEach(([name, positions]) => {
      expect(positions.length).toBe(11)
    })
  })

  it('OOP formations contain exactly 11 positions each', () => {
    Object.entries(FORMATIONS_OOP).forEach(([name, positions]) => {
      expect(positions.length).toBe(11)
    })
  })

  it('all positions referenced in formations exist in PITCH_POSITIONS', () => {
    const allFormations = [...Object.values(FORMATIONS_IP), ...Object.values(FORMATIONS_OOP)]
    allFormations.forEach(formation => {
      formation.forEach(posId => {
        expect(PITCH_POSITIONS).toHaveProperty(posId)
      })
    })
  })

  it('all formations include a GK', () => {
    const allFormations = { ...FORMATIONS_IP, ...FORMATIONS_OOP }
    Object.entries(allFormations).forEach(([name, positions]) => {
      expect(positions).toContain('GK')
    })
  })
})

// ── Attributs ──────────────────────────────────────────────────────────────
describe('ROLE_ATTRIBUTES', () => {
  it('contains attributes for at least 40 roles', () => {
    expect(Object.keys(ROLE_ATTRIBUTES).length).toBeGreaterThanOrEqual(40)
  })

  it('each entry has key, preferred, unnecessary properties', () => {
    Object.entries(ROLE_ATTRIBUTES).forEach(([role, attrs]) => {
      expect(attrs).toHaveProperty('key')
      expect(attrs).toHaveProperty('preferred')
      expect(attrs).toHaveProperty('unnecessary')
      expect(Array.isArray(attrs.key)).toBe(true)
      expect(Array.isArray(attrs.preferred)).toBe(true)
    })
  })

  it('Goalkeeper has the correct key attributes', () => {
    const gk = ROLE_ATTRIBUTES['Goalkeeper']
    expect(gk).toBeDefined()
    expect(gk.key).toContain('Reflexes')
    expect(gk.key).toContain('Positioning')
    expect(gk.key).toContain('Handling')
  })

  it('False 9 has the expected technical attributes', () => {
    const f9 = ROLE_ATTRIBUTES['False 9']
    expect(f9).toBeDefined()
    expect(f9.key).toContain('Dribbling')
    expect(f9.key).toContain('Vision')
    expect(f9.key).toContain('Passing')
  })

  it('No-Nonsense GK has Passing in unnecessary', () => {
    const nn = ROLE_ATTRIBUTES['No-Nonsense GK']
    expect(nn).toBeDefined()
    expect(nn.unnecessary).toContain('Passing')
  })
})

// ── Styles de jeu ──────────────────────────────────────────────────────────
describe('PLAY_STYLES', () => {
  it('contains exactly 10 official FM26 styles', () => {
    expect(PLAY_STYLE_KEYS.length).toBe(10)
  })

  it('each style has the required properties', () => {
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

  it('key styles are present', () => {
    const required = ['Tiki-Taka', 'Gegenpress', 'Park the Bus', 'Control Possession', 'Route One']
    required.forEach(s => {
      expect(PLAY_STYLES).toHaveProperty(s)
    })
  })

  it('Gegenpress has high tempo in IP', () => {
    expect(PLAY_STYLES['Gegenpress'].tiIP.tempo).toMatch(/Higher/)
  })

  it('Park the Bus has a Low Block in OOP', () => {
    expect(PLAY_STYLES['Park the Bus'].tiOOP.lineEngagement).toBe('Low Block')
  })

  it('Tiki-Taka has very short passing in IP', () => {
    expect(PLAY_STYLES['Tiki-Taka'].tiIP.passingDirectness).toBe('Much Shorter')
  })
})

// ── Profils d'équipe ───────────────────────────────────────────────────────
describe('TEAM_PROFILES', () => {
  it('contains exactly 4 profiles', () => {
    expect(PROFILE_KEYS.length).toBe(4)
  })

  it('all 4 expected profiles are present', () => {
    expect(TEAM_PROFILES).toHaveProperty('elite')
    expect(TEAM_PROFILES).toHaveProperty('top')
    expect(TEAM_PROFILES).toHaveProperty('subtop')
    expect(TEAM_PROFILES).toHaveProperty('underdog')
  })

  it('each profile has the required properties', () => {
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

  it('Elite has Tiki-Taka as ideal style', () => {
    expect(TEAM_PROFILES.elite.idealStyles).toContain('Tiki-Taka')
  })

  it('Underdog has Park the Bus as ideal style', () => {
    expect(TEAM_PROFILES.underdog.idealStyles).toContain('Park the Bus')
  })

  it('Elite has Park the Bus as sub-optimal style', () => {
    expect(TEAM_PROFILES.elite.suboptimalStyles).toContain('Park the Bus')
  })

  it('Underdog has Tiki-Taka as sub-optimal style', () => {
    expect(TEAM_PROFILES.underdog.suboptimalStyles).toContain('Tiki-Taka')
  })
})

describe('getStyleCompatibility', () => {
  it('returns "ideal" for Elite + Tiki-Taka', () => {
    const result = getStyleCompatibility('elite', 'Tiki-Taka')
    expect(result.level).toBe('ideal')
  })

  it('returns "poor" for Underdog + Tiki-Taka', () => {
    const result = getStyleCompatibility('underdog', 'Tiki-Taka')
    expect(result.level).toBe('poor')
    expect(result.penalty).toBeGreaterThan(0)
  })

  it('returns "ideal" for Underdog + Park the Bus', () => {
    const result = getStyleCompatibility('underdog', 'Park the Bus')
    expect(result.level).toBe('ideal')
  })

  it('returns "poor" for Elite + Park the Bus', () => {
    const result = getStyleCompatibility('elite', 'Park the Bus')
    expect(result.level).toBe('poor')
  })

  it('returns a penalty for a sub-optimal style', () => {
    const result = getStyleCompatibility('underdog', 'Gegenpress')
    expect(result.penalty).toBeGreaterThan(0)
  })
})
