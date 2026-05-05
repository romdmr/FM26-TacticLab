import { useState } from 'react'
import { useStore } from '../store/useTacticStore'
import { POS_TYPES } from '../data/fm26'
import { FORMATIONS_IP, FORMATIONS_OOP } from '../data/positions'
import { PLAY_STYLES, PLAY_STYLE_KEYS } from '../data/playstyles'

function StyleTooltip({ styleKey }) {
  const s = PLAY_STYLES[styleKey]
  if (!s) return null
  return (
    <div style={{
      position: 'absolute', left: '100%', top: 0, zIndex: 50,
      width: 260, background: '#1a1f2e',
      border: '0.5px solid rgba(255,255,255,0.12)',
      borderRadius: 8, padding: '10px 12px', marginLeft: 6,
      boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
      pointerEvents: 'none',
    }}>
      <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 5 }}>{s.label}</div>
      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', lineHeight: 1.55, marginBottom: 8 }}>{s.description}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 6 }}>
        {s.feedback.pos.map((f,i) => (
          <div key={i} style={{ fontSize: 9, color: '#26E676' }}>+ {f}</div>
        ))}
        {s.feedback.neg.map((f,i) => (
          <div key={i} style={{ fontSize: 9, color: '#FF6619' }}>− {f}</div>
        ))}
      </div>
      {s.tiIP && Object.keys(s.tiIP).length > 0 && (
        <>
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 3 }}>TI IP par défaut</div>
          {Object.entries(s.tiIP).slice(0, 5).map(([k,v]) => (
            <div key={k} style={{ fontSize: 9, color: 'rgba(255,255,255,0.55)', paddingLeft: 6 }}>• {v}</div>
          ))}
        </>
      )}
    </div>
  )
}

export default function Sidebar() {
  const formIP  = useStore(s => s.formIP)
  const formOOP = useStore(s => s.formOOP)
  const style   = useStore(s => s.style)
  const setFormation = useStore(s => s.setFormation)
  const setStyle     = useStore(s => s.setStyle)
  const [hoveredStyle, setHoveredStyle] = useState(null)

  const Sep  = () => <div style={{ height: '0.5px', background: 'rgba(255,255,255,0.07)', margin: '5px 10px' }} />
  const Sec  = ({ c }) => <div style={{ padding: '4px 10px 2px', fontSize: 9, fontWeight: 600, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.6px', textTransform: 'uppercase' }}>{c}</div>
  const FLbl = ({ side }) => (
    <div style={{ padding: '3px 10px 1px', fontSize: 9, fontWeight: 600, color: side === 'ip' ? '#26E676' : '#378ADD' }}>
      {side === 'ip' ? '▲ In Possession' : '▼ Out of Possession'}
    </div>
  )

  const FItem = ({ name, side }) => {
    const active = side === 'ip' ? formIP === name : formOOP === name
    return (
      <div onClick={() => setFormation(side, name)} style={{
        padding: '3px 10px', cursor: 'pointer', borderRadius: 4, margin: '1px 6px',
        fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: active ? (side === 'ip' ? 'rgba(38,230,118,0.1)' : 'rgba(55,138,221,0.1)') : 'transparent',
        color: active ? (side === 'ip' ? '#26E676' : '#378ADD') : 'rgba(255,255,255,0.45)',
        fontWeight: active ? 600 : 400,
      }}>
        <span>{name}</span>
        {active && <span style={{ fontSize: 9 }}>✓</span>}
      </div>
    )
  }

  return (
    <div style={{ background: '#0f1419', borderRight: '0.5px solid rgba(255,255,255,0.07)', overflowY: 'auto', padding: '6px 0', height: '100%' }}>
      <Sec c="Formations" />
      <FLbl side="ip" />
      {Object.keys(FORMATIONS_IP).map(f => <FItem key={f} name={f} side="ip" />)}
      <Sep />
      <FLbl side="oop" />
      {Object.keys(FORMATIONS_OOP).map(f => <FItem key={f} name={f} side="oop" />)}
      <Sep />

      {/* Styles de jeu with hover tooltips */}
      <Sec c="Style de jeu FM26" />
      <div style={{ position: 'relative' }}>
        {PLAY_STYLE_KEYS.map(sk => {
          const active = style === sk
          return (
            <div
              key={sk}
              onClick={() => setStyle(sk)}
              onMouseEnter={() => setHoveredStyle(sk)}
              onMouseLeave={() => setHoveredStyle(null)}
              style={{
                padding: '3px 10px', cursor: 'pointer', borderRadius: 4,
                margin: '1px 6px', fontSize: 11, position: 'relative',
                background: active ? 'rgba(255,255,255,0.08)' : 'transparent',
                color: active ? '#fff' : 'rgba(255,255,255,0.45)',
                fontWeight: active ? 600 : 400,
                display: 'flex', alignItems: 'center', gap: 4,
              }}
            >
              <span style={{ flex: 1 }}>{sk}</span>
              {active && <span style={{ fontSize: 9 }}>✓</span>}
              <span style={{ fontSize: 8, color: 'rgba(255,255,255,0.2)' }}>ⓘ</span>
              {hoveredStyle === sk && <StyleTooltip styleKey={sk} />}
            </div>
          )
        })}
      </div>

      <Sep />

      {/* Légende */}
      <Sec c="Legend" />
      <div style={{ padding: '4px 10px', display: 'flex', flexWrap: 'wrap', gap: 4 }}>
        {Object.entries(POS_TYPES).map(([key, c]) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 9, color: 'rgba(255,255,255,0.4)' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: c.bg, border: '1px solid rgba(255,255,255,0.12)' }} />
            {key}
          </div>
        ))}
      </div>
    </div>
  )
}
