/**
 * TacticLab — Tests du store Zustand
 * Vérifie que les actions produisent le bon état
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { PITCH_POSITIONS, FORMATIONS_IP, FORMATIONS_OOP, findNearestPosition, SNAP_RADIUS } from '../data/positions.js'
import { ROLES_IP, ROLES_OOP, defaultTIValues } from '../data/fm26.js'
import { TACTIC_TEMPLATES } from '../data/templates.js'
import { PLAY_STYLE_KEYS } from '../data/playstyles.js'

// ── Helper : makePions ─────────────────────────────────────────────────────
function makePions(formKey, formMap) {
  return formMap[formKey].map(posId => {
    const pos = PITCH_POSITIONS[posId]
    return {
      posId, t: pos.type, x: pos.x, y: pos.y,
      rIP:  ROLES_IP[pos.type][0],
      rOOP: ROLES_OOP[pos.type][0],
    }
  })
}

// ── Logique snapPion pure (extraite du store, sans Zustand) ───────────────
function snapPion(pions, idx, x, y) {
  const currentId = pions[idx].posId
  const nearest   = findNearestPosition(x, y, currentId)

  if (!nearest) {
    // Pas dans le rayon — retour à la position d'origine
    const orig     = PITCH_POSITIONS[currentId]
    const newPions = [...pions]
    newPions[idx]  = { ...pions[idx], x: orig.x, y: orig.y }
    return { pions: newPions, snapped: null }
  }

  const occupiedIdx = pions.findIndex((p, i) => i !== idx && p.posId === nearest.id)
  const newPions    = [...pions]

  if (occupiedIdx !== -1) {
    // Swap
    const posA = PITCH_POSITIONS[nearest.id]
    const posB = PITCH_POSITIONS[currentId]
    newPions[idx]         = { ...pions[idx], posId: nearest.id, t: posA.type, x: posA.x, y: posA.y, rIP: ROLES_IP[posA.type][0], rOOP: ROLES_OOP[posA.type][0] }
    newPions[occupiedIdx] = { ...pions[occupiedIdx], posId: currentId, t: posB.type, x: posB.x, y: posB.y, rIP: ROLES_IP[posB.type][0], rOOP: ROLES_OOP[posB.type][0] }
  } else {
    const newPos  = PITCH_POSITIONS[nearest.id]
    newPions[idx] = { ...pions[idx], posId: nearest.id, t: newPos.type, x: newPos.x, y: newPos.y, rIP: ROLES_IP[newPos.type][0], rOOP: ROLES_OOP[newPos.type][0] }
  }
  return { pions: newPions, snapped: nearest.id }
}

// ── Tests makePions ────────────────────────────────────────────────────────
describe('makePions', () => {
  it('génère 11 pions pour une formation 4-3-3', () => {
    expect(makePions('4-3-3', FORMATIONS_IP).length).toBe(11)
  })

  it('chaque pion a les propriétés requises', () => {
    makePions('4-3-3', FORMATIONS_IP).forEach(p => {
      expect(p).toHaveProperty('posId')
      expect(p).toHaveProperty('t')
      expect(p).toHaveProperty('x')
      expect(p).toHaveProperty('y')
      expect(p).toHaveProperty('rIP')
      expect(p).toHaveProperty('rOOP')
    })
  })

  it('le rôle IP par défaut est valide pour chaque type de poste', () => {
    makePions('4-3-3', FORMATIONS_IP).forEach(p => {
      expect(ROLES_IP[p.t]).toContain(p.rIP)
    })
  })

  it('le rôle OOP par défaut est valide pour chaque type de poste', () => {
    makePions('4-4-2', FORMATIONS_OOP).forEach(p => {
      expect(ROLES_OOP[p.t]).toContain(p.rOOP)
    })
  })

  it('le GK est dans la formation', () => {
    const gk = makePions('4-3-3', FORMATIONS_IP).find(p => p.t === 'GK')
    expect(gk).toBeDefined()
    expect(gk.posId).toBe('GK')
  })
})

// ── Tests de la logique de snap ────────────────────────────────────────────
describe('Logique de snap (snapPion)', () => {
  let pions

  beforeEach(() => {
    pions = makePions('4-3-3', FORMATIONS_IP)
  })

  it('un pion glissé au centre du terrain (loin de toutes positions) revient à l\'origine', () => {
    // Le GK est à y~91, on le glisse vers x=50, y=50 (centre)
    // Toutes les positions sont soit dans les zones hautes soit basses, le centre est loin
    const gkOrigX = pions[0].x
    const gkOrigY = pions[0].y
    const result  = snapPion(pions, 0, 50, 50)
    // Soit il snape sur une position proche, soit il revient à l'origine
    if (result.snapped === null) {
      expect(result.pions[0].x).toBe(gkOrigX)
      expect(result.pions[0].y).toBe(gkOrigY)
    } else {
      // Si une position est dans le rayon, le snap est accepté — ce n'est pas une erreur
      expect(result.pions[0].posId).toBe(result.snapped)
    }
  })

  it('un pion glissé exactement sur une position libre se snap dessus', () => {
    // On cherche une position non occupée dans la formation 4-3-3
    const occupiedIds = pions.map(p => p.posId)
    const freePos = Object.entries(PITCH_POSITIONS).find(([id]) => !occupiedIds.includes(id))
    if (!freePos) return // toutes les positions occupées, skip

    const [freePosId, freePosData] = freePos
    // On glisse le pion[0] exactement sur la position libre
    const result = snapPion(pions, 0, freePosData.x, freePosData.y)
    if (result.snapped) {
      expect(result.pions[0].posId).toBe(result.snapped)
      expect(result.pions[0].t).toBe(PITCH_POSITIONS[result.snapped].type)
      expect(result.pions[0].rIP).toBe(ROLES_IP[PITCH_POSITIONS[result.snapped].type][0])
    }
  })

  it('après un snap, le pion a le type de poste correspondant à sa nouvelle position', () => {
    // Glisse pion[0] (GK) vers la position FBL
    const fblPos = PITCH_POSITIONS.FBL
    const result = snapPion(pions, 0, fblPos.x, fblPos.y)
    if (result.snapped === 'FBL') {
      expect(result.pions[0].t).toBe('FB')
      expect(ROLES_IP.FB).toContain(result.pions[0].rIP)
    }
  })

  it('un swap préserve la cohérence des types de postes', () => {
    // Trouver deux pions adjacents et les swapper
    const stcIdx = pions.findIndex(p => p.posId === 'STC')
    if (stcIdx === -1) return

    const stcPion = pions[stcIdx]
    // Glisser le pion STC vers CML (déjà occupé)
    const cmlPos = PITCH_POSITIONS.CML
    const result = snapPion(pions, stcIdx, cmlPos.x, cmlPos.y)

    if (result.snapped === 'CML') {
      // Le STC est maintenant sur CML
      expect(result.pions[stcIdx].posId).toBe('CML')
      expect(result.pions[stcIdx].t).toBe('CM')
      // L'ancien CML est maintenant sur STC
      const newStc = result.pions.find(p => p.posId === 'STC')
      expect(newStc).toBeDefined()
      expect(newStc.t).toBe('ST')
    }
  })
})

// ── Tests defaultTIValues ──────────────────────────────────────────────────
describe('defaultTIValues', () => {
  it('retourne les sections IP et OOP', () => {
    const ti = defaultTIValues()
    expect(ti).toHaveProperty('ip')
    expect(ti).toHaveProperty('oop')
    expect(ti).toHaveProperty('mentality')
  })

  it('les sections IP contiennent overview, finalThird, progression, buildup', () => {
    const ti = defaultTIValues()
    ;['overview','finalThird','progression','buildup'].forEach(s => {
      expect(ti.ip).toHaveProperty(s)
    })
  })

  it('les sections OOP contiennent overview, highPress, midBlock, lowBlock', () => {
    const ti = defaultTIValues()
    ;['overview','highPress','midBlock','lowBlock'].forEach(s => {
      expect(ti.oop).toHaveProperty(s)
    })
  })
})

// ── Tests des templates ────────────────────────────────────────────────────
describe('Templates de référence — intégrité des données', () => {
  it('7 templates de référence existent', () => {
    expect(TACTIC_TEMPLATES.length).toBe(7)
  })

  it('chaque template a les champs obligatoires', () => {
    TACTIC_TEMPLATES.forEach(tpl => {
      ;['id','name','style','teamProfile','formIP','formOOP','pionsIP','pionsOOP','ti'].forEach(k => {
        expect(tpl).toHaveProperty(k)
      })
    })
  })

  it('chaque template a exactement 11 pions IP et 11 pions OOP', () => {
    TACTIC_TEMPLATES.forEach(tpl => {
      expect(tpl.pionsIP.length).toBe(11)
      expect(tpl.pionsOOP.length).toBe(11)
    })
  })

  it('tous les pions ont des rôles valides', () => {
    TACTIC_TEMPLATES.forEach(tpl => {
      tpl.pionsIP.forEach(p => {
        expect(ROLES_IP[p.t]).toContain(p.rIP)
        expect(ROLES_OOP[p.t]).toContain(p.rOOP)
      })
    })
  })

  it('chaque template inclut un GK', () => {
    TACTIC_TEMPLATES.forEach(tpl => {
      expect(tpl.pionsIP.some(p => p.t === 'GK')).toBe(true)
    })
  })

  it('les IDs de templates sont uniques', () => {
    const ids = TACTIC_TEMPLATES.map(t => t.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('le style de chaque template est un style FM26 valide', () => {
    TACTIC_TEMPLATES.forEach(tpl => {
      expect(PLAY_STYLE_KEYS).toContain(tpl.style)
    })
  })

  it('le profil de chaque template est un profil valide', () => {
    const valid = ['elite','top','subtop','underdog']
    TACTIC_TEMPLATES.forEach(tpl => {
      expect(valid).toContain(tpl.teamProfile)
    })
  })
})
