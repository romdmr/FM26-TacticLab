import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { FORMATIONS_IP, FORMATIONS_OOP, PITCH_POSITIONS, findNearestPosition } from '../data/positions'
import { ROLES_IP, ROLES_OOP, defaultTIValues } from '../data/fm26'

const makePions = (formKey, formMap) =>
  formMap[formKey].map(posId => {
    const pos = PITCH_POSITIONS[posId]
    return {
      posId,
      t: pos.type,
      x: pos.x, y: pos.y,
      rIP:  ROLES_IP[pos.type][0],
      rOOP: ROLES_OOP[pos.type][0],
    }
  })

const defaultState = () => ({
  name: 'Ma Tactique FM26',
  style: 'Control Possession',
  teamProfile: 'top',            // NEW
  formIP:  '4-3-3',
  formOOP: '4-4-2',
  pionsIP:  makePions('4-3-3', FORMATIONS_IP),
  pionsOOP: makePions('4-4-2', FORMATIONS_OOP),
  ti: defaultTIValues(),
  view: 'home',
  selectedPion: null,
  tiOpen: false,
  tiTab: 'ip',
})

export const useStore = create(
  persist(
    (set, get) => ({
      ...defaultState(),

      setName:        (n) => set({ name: n }),
      setStyle:       (s) => set({ style: s }),
      setTeamProfile: (p) => set({ teamProfile: p }),  // NEW
      setView:        (v) => set({ view: v }),
      setTIOpen:      (o) => set({ tiOpen: o }),
      setTITab:       (t) => set({ tiTab: t }),

      setFormation: (side, key) => {
        const map   = side === 'ip' ? FORMATIONS_IP : FORMATIONS_OOP
        const pions = makePions(key, map)
        side === 'ip'
          ? set({ formIP: key,  pionsIP:  pions, selectedPion: null })
          : set({ formOOP: key, pionsOOP: pions, selectedPion: null })
      },

      selectPion:     (side, idx) => set({ selectedPion: { side, idx } }),
      clearSelection: ()          => set({ selectedPion: null }),

      movePion: (side, idx, x, y) => set(state => {
        const key   = side === 'ip' ? 'pionsIP' : 'pionsOOP'
        const pions = [...state[key]]
        pions[idx]  = { ...pions[idx], x, y }
        return { [key]: pions }
      }),

      snapPion: (side, idx, x, y) => set(state => {
        const key        = side === 'ip' ? 'pionsIP' : 'pionsOOP'
        const pions      = [...state[key]]
        const currentId  = pions[idx].posId

        // GK est verrouillé — retour à sa position sans modification
        if (pions[idx].t === 'GK') {
          const orig = PITCH_POSITIONS[currentId]
          const newPions = [...pions]
          newPions[idx] = { ...pions[idx], x: orig.x, y: orig.y }
          return { [key]: newPions }
        }

        const nearest = findNearestPosition(x, y, currentId)

        if (nearest) {
          // Ne pas autoriser de snap vers la position GK
          if (PITCH_POSITIONS[nearest.id]?.type === 'GK') {
            const orig = PITCH_POSITIONS[currentId]
            const newPions = [...pions]
            newPions[idx] = { ...pions[idx], x: orig.x, y: orig.y }
            return { [key]: newPions }
          }

          const occupiedIdx = pions.findIndex((p, i) => i !== idx && p.posId === nearest.id)
          if (occupiedIdx !== -1) {
            // Ne pas swapper avec le GK
            if (pions[occupiedIdx].t === 'GK') {
              const orig = PITCH_POSITIONS[currentId]
              const newPions = [...pions]
              newPions[idx] = { ...pions[idx], x: orig.x, y: orig.y }
              return { [key]: newPions }
            }
            const posA = PITCH_POSITIONS[nearest.id]
            const posB = PITCH_POSITIONS[currentId]
            pions[idx] = { ...pions[idx], posId: nearest.id, t: posA.type, x: posA.x, y: posA.y, rIP: ROLES_IP[posA.type][0], rOOP: ROLES_OOP[posA.type][0] }
            pions[occupiedIdx] = { ...pions[occupiedIdx], posId: currentId, t: posB.type, x: posB.x, y: posB.y, rIP: ROLES_IP[posB.type][0], rOOP: ROLES_OOP[posB.type][0] }
          } else {
            const newPos = PITCH_POSITIONS[nearest.id]
            pions[idx] = { ...pions[idx], posId: nearest.id, t: newPos.type, x: newPos.x, y: newPos.y, rIP: ROLES_IP[newPos.type][0], rOOP: ROLES_OOP[newPos.type][0] }
          }
        } else {
          const orig = PITCH_POSITIONS[currentId]
          pions[idx] = { ...pions[idx], x: orig.x, y: orig.y }
        }
        return { [key]: pions }
      }),

      setPionRole: (side, idx, roleType, value) => set(state => {
        const key   = side === 'ip' ? 'pionsIP' : 'pionsOOP'
        const pions = [...state[key]]
        pions[idx]  = { ...pions[idx], [roleType === 'ip' ? 'rIP' : 'rOOP']: value }
        return { [key]: pions }
      }),

      updateTI: (tab, section, key, value) => set(state => ({
        ti: { ...state.ti, [tab]: { ...state.ti[tab], [section]: { ...state.ti[tab][section], [key]: value } } }
      })),

      setTIMentality:  (v) => set(state => ({ ti: { ...state.ti, mentality: v } })),
      setTISelected: (tab, section) => set(state => ({
        ti: { ...state.ti, [tab === 'ip' ? 'ipSelected' : 'oopSelected']: section }
      })),

      loadTemplate: (tpl) => set({
        name:        tpl.name,
        style:       tpl.style,
        teamProfile: tpl.teamProfile,
        formIP:      tpl.formIP,
        formOOP:     tpl.formOOP,
        pionsIP:     tpl.pionsIP,
        pionsOOP:    tpl.pionsOOP,
        ti:          { ...defaultTIValues(), ...tpl.ti },
        selectedPion: null,
        view: 'builder',
      }),

      reset: () => set(defaultState()),
    }),
    { name: 'tacticlab-storage', version: 3 }
  )
)

// ── Store for saved tactics (separate persist key) ────────────────────────
import { create as createSaved } from 'zustand'
import { persist as persistSaved } from 'zustand/middleware'

export const useSavedStore = createSaved(
  persistSaved(
    (set, get) => ({
      saved: [],

      saveTactic: (tactic) => {
        const entry = {
          id:        Date.now().toString(),
          savedAt:   new Date().toISOString(),
          name:      tactic.name,
          style:     tactic.style,
          teamProfile: tactic.teamProfile,
          formIP:    tactic.formIP,
          formOOP:   tactic.formOOP,
          pionsIP:   tactic.pionsIP,
          pionsOOP:  tactic.pionsOOP,
          ti:        tactic.ti,
        }
        set(state => ({ saved: [entry, ...state.saved].slice(0, 20) }))
        return entry.id
      },

      deleteTactic: (id) => set(state => ({ saved: state.saved.filter(t => t.id !== id) })),

      renameTactic: (id, name) => set(state => ({
        saved: state.saved.map(t => t.id === id ? { ...t, name } : t)
      })),

      clearAll: () => set({ saved: [] }),
    }),
    { name: 'tacticlab-saved', version: 1 }
  )
)
