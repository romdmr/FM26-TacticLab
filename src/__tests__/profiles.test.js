/**
 * TacticLab — Tests du moteur de scoring par profil
 * Vérifie les pénalités et bonus selon le profil d'équipe
 */

import { describe, it, expect } from 'vitest'
import { analyseTeamProfile, getStyleRecommendations } from '../engine/profile_scoring.js'
import { TEAM_PROFILES } from '../data/teamprofiles.js'
import { PITCH_POSITIONS } from '../data/positions.js'
import { ROLES_IP, ROLES_OOP } from '../data/fm26.js'

function makePion(posId, rIP, rOOP) {
  const pos = PITCH_POSITIONS[posId]
  return {
    posId, t: pos.type, x: pos.x, y: pos.y,
    rIP:  rIP  || ROLES_IP[pos.type][0],
    rOOP: rOOP || ROLES_OOP[pos.type][0],
  }
}

const PIONS_SIMPLE = [
  makePion('GK',  'Goalkeeper',   'Goalkeeper'),
  makePion('FBL', 'Full Back',    'Holding FB'),
  makePion('CDL', 'Centre-Back',  'Covering CB'),
  makePion('CDR', 'Centre-Back',  'Stopping CB'),
  makePion('FBR', 'Full Back',    'Holding FB'),
  makePion('CML', 'Central Mid',  'Pressing CM'),
  makePion('CMC', 'Defensive Mid','Screening DM'),
  makePion('CMR', 'Central Mid',  'Pressing CM'),
  makePion('AML', 'Wide Forward', 'Tracking Winger'),
  makePion('STC', 'Centre Forward','Tracking CF'),
  makePion('AMR', 'Wide Forward', 'Tracking Winger'),
]

describe('analyseTeamProfile', () => {
  it('returns the expected properties', () => {
    const result = analyseTeamProfile(PIONS_SIMPLE, 'Control Possession', 'top')
    expect(result).toHaveProperty('score')
    expect(result).toHaveProperty('issues')
    expect(result).toHaveProperty('strengths')
    expect(result).toHaveProperty('advice')
    expect(result.score).toBeGreaterThanOrEqual(0)
    expect(result.score).toBeLessThanOrEqual(10)
  })

  it('ideal style for profile = no style penalty', () => {
    const result = analyseTeamProfile(PIONS_SIMPLE, 'Park the Bus', 'underdog')
    const styleIssue = result.issues.find(i => i.toLowerCase().includes('park the bus'))
    expect(styleIssue).toBeUndefined()
  })

  it('Underdog + Tiki-Taka = severe score penalty', () => {
    const tikitaka = analyseTeamProfile(PIONS_SIMPLE, 'Tiki-Taka', 'underdog')
    const control  = analyseTeamProfile(PIONS_SIMPLE, 'Park the Bus', 'underdog')
    expect(tikitaka.score).toBeLessThan(control.score)
  })

  it('Elite + Park the Bus = issues generated', () => {
    const result = analyseTeamProfile(PIONS_SIMPLE, 'Park the Bus', 'elite')
    expect(result.issues.length).toBeGreaterThan(0)
  })

  it('Underdog with complex roles = penalty', () => {
    const complexPions = [
      makePion('GK',   'Ball-Playing GK',       'Sweeper Keeper'),
      makePion('CDL',  'Ball-Playing CB',        'Covering CB'),
      makePion('CDR',  'Ball-Playing CB',        'Stopping CB'),
      makePion('FBL',  'Full Back',              'Holding FB'),
      makePion('FBR',  'Full Back',              'Holding FB'),
      makePion('DMC',  'Deep-Lying Playmaker',   'Dropping DM'),
      makePion('CML',  'Advanced Playmaker',     'Pressing CM'),
      makePion('CMR',  'Midfield Playmaker',     'Pressing CM'),
      makePion('AML',  'Inside Winger',          'Tracking Winger'),
      makePion('STC',  'False 9',               'Tracking CF'),
      makePion('AMR',  'Inside Winger',          'Tracking Winger'),
    ]
    const complexResult = analyseTeamProfile(complexPions, 'Tiki-Taka', 'underdog')
    const simpleResult  = analyseTeamProfile(PIONS_SIMPLE, 'Park the Bus', 'underdog')
    expect(complexResult.score).toBeLessThan(simpleResult.score)
  })

  it('Underdog with simple system = bonus', () => {
    const simplePions = [
      makePion('GK',  'Goalkeeper',    'Goalkeeper'),
      makePion('WBL', 'Wing Back',     'Holding WB'),
      makePion('CDL', 'No-Nonsense CB','Covering CB'),
      makePion('CDC', 'Centre-Back',   'Stopping CB'),
      makePion('CDR', 'No-Nonsense CB','Covering CB'),
      makePion('WBR', 'Wing Back',     'Holding WB'),
      makePion('ML',  'Wide Mid',      'Wide Outlet Mid'),
      makePion('CML', 'Defensive Mid', 'Screening DM'),
      makePion('CMR', 'Defensive Mid', 'Screening DM'),
      makePion('MR',  'Wide Mid',      'Wide Outlet Mid'),
      makePion('STC', 'Target Forward','Central Outlet CF'),
    ]
    const result = analyseTeamProfile(simplePions, 'Park the Bus', 'underdog')
    expect(result.strengths.length).toBeGreaterThan(0)
  })

  it('Sub-Top + Gegenpress = penalty', () => {
    const resultGegen    = analyseTeamProfile(PIONS_SIMPLE, 'Gegenpress', 'subtop')
    const resultCounter  = analyseTeamProfile(PIONS_SIMPLE, 'Fluid Counter-Attack', 'subtop')
    expect(resultGegen.score).toBeLessThan(resultCounter.score)
    expect(resultGegen.issues.length).toBeGreaterThan(0)
  })

  it('returns non-empty advice for each profile', () => {
    Object.keys(TEAM_PROFILES).forEach(profileKey => {
      const result = analyseTeamProfile(PIONS_SIMPLE, 'Control Possession', profileKey)
      expect(Array.isArray(result.advice)).toBe(true)
      expect(result.advice.length).toBeGreaterThan(0)
    })
  })
})

describe('getStyleRecommendations', () => {
  it('returns recommendations for each profile', () => {
    Object.keys(TEAM_PROFILES).forEach(profileKey => {
      const recs = getStyleRecommendations(profileKey)
      expect(Array.isArray(recs)).toBe(true)
      expect(recs.length).toBeGreaterThan(0)
    })
  })

  it('each recommendation has style, level and label', () => {
    const recs = getStyleRecommendations('elite')
    recs.forEach(r => {
      expect(r).toHaveProperty('style')
      expect(r).toHaveProperty('level')
      expect(r).toHaveProperty('label')
      expect(['ideal', 'workable', 'poor']).toContain(r.level)
    })
  })

  it('Tiki-Taka is ideal for Elite', () => {
    const recs = getStyleRecommendations('elite')
    const tikitaka = recs.find(r => r.style === 'Tiki-Taka')
    expect(tikitaka).toBeDefined()
    expect(tikitaka.level).toBe('ideal')
  })

  it('Park the Bus is not advised for Elite', () => {
    const recs = getStyleRecommendations('elite')
    const ptb = recs.find(r => r.style === 'Park the Bus')
    expect(ptb).toBeDefined()
    expect(ptb.level).toBe('poor')
  })

  it('Park the Bus is ideal for Underdog', () => {
    const recs = getStyleRecommendations('underdog')
    const ptb = recs.find(r => r.style === 'Park the Bus')
    expect(ptb).toBeDefined()
    expect(ptb.level).toBe('ideal')
  })
})
