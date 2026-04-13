import { useStore } from '../store/useTacticStore'
import { TI_IP, TI_OOP, MENTALITIES } from '../data/fm26'

// Overlap/Underlap mutual exclusion logic
// If you pick overlap LEFT  → cannot pick underlap LEFT
// If you pick overlap RIGHT → cannot pick underlap RIGHT
// If you pick Both Flanks for overlap → underlap stays Balanced
function getDisabledOpts(sectionId, key, allValues) {
  if (sectionId !== 'progression') return []
  const ol = allValues.ol || 'Balanced'
  const ul = allValues.ul || 'Balanced'

  if (key === 'ul') {
    const disabled = []
    if (ol === 'Left'  || ol === 'Both Flanks') disabled.push('Left')
    if (ol === 'Right' || ol === 'Both Flanks') disabled.push('Right')
    if (ol === 'Both Flanks') disabled.push('Both Flanks')
    return disabled
  }
  if (key === 'ol') {
    const disabled = []
    if (ul === 'Left'  || ul === 'Both Flanks') disabled.push('Left')
    if (ul === 'Right' || ul === 'Both Flanks') disabled.push('Right')
    if (ul === 'Both Flanks') disabled.push('Both Flanks')
    return disabled
  }
  return []
}

function SliderOpts({ opts, value, onChange, disabledOpts = [] }) {
  return (
    <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
      {opts.map(o => {
        const isDisabled = disabledOpts.includes(o)
        const isActive   = o === value
        return (
          <button
            key={o}
            onClick={() => !isDisabled && onChange(o)}
            title={isDisabled ? 'Non disponible (conflit avec l\'autre réglage)' : ''}
            style={{
              padding: '2px 6px', borderRadius: 3, fontSize: 9,
              cursor: isDisabled ? 'not-allowed' : 'pointer',
              border: '0.5px solid',
              borderColor: isDisabled ? 'rgba(255,255,255,0.05)' :
                           isActive   ? 'transparent' : 'rgba(255,255,255,0.12)',
              background: isDisabled ? 'rgba(255,255,255,0.03)' :
                          isActive   ? 'rgba(55,138,221,0.25)' : 'transparent',
              color: isDisabled ? 'rgba(255,255,255,0.18)' :
                     isActive   ? '#378ADD' : 'rgba(255,255,255,0.45)',
              fontWeight: isActive ? 600 : 400,
              textDecoration: isDisabled ? 'line-through' : 'none',
              opacity: isDisabled ? 0.5 : 1,
            }}
          >
            {o}
          </button>
        )
      })}
    </div>
  )
}

function ToggleOpts({ opts, value, onChange, disabledOpts = [] }) {
  return (
    <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
      {opts.map(o => {
        const isDisabled = disabledOpts.includes(o)
        const isActive   = o === value
        return (
          <button
            key={o}
            onClick={() => !isDisabled && onChange(o)}
            title={isDisabled ? 'Non disponible (conflit Overlap/Underlap)' : ''}
            style={{
              padding: '2px 7px', borderRadius: 3, fontSize: 9,
              cursor: isDisabled ? 'not-allowed' : 'pointer',
              border: '0.5px solid',
              borderColor: isDisabled ? 'rgba(255,255,255,0.05)' :
                           isActive   ? 'transparent' : 'rgba(255,255,255,0.1)',
              background: isDisabled ? 'rgba(255,255,255,0.03)' :
                          isActive   ? 'rgba(38,230,118,0.2)' : 'transparent',
              color: isDisabled ? 'rgba(255,255,255,0.18)' :
                     isActive   ? '#26E676' : 'rgba(255,255,255,0.4)',
              fontWeight: isActive ? 600 : 400,
              textDecoration: isDisabled ? 'line-through' : 'none',
              opacity: isDisabled ? 0.5 : 1,
            }}
          >
            {o}
          </button>
        )
      })}
    </div>
  )
}

function Section({ id, conf, tab, isSelected, onSelect }) {
  const ti       = useStore(s => s.ti)
  const updateTI = useStore(s => s.updateTI)
  const values   = (ti[tab] && ti[tab][id]) ? ti[tab][id] : (conf.defaults || {})

  // When a constrained param changes, auto-fix the other if needed
  const handleChange = (key, val) => {
    updateTI(tab, id, key, val)

    // Auto-clear conflicting Overlap/Underlap selection
    if (id === 'progression') {
      if (key === 'ol') {
        const curUL = values.ul || 'Balanced'
        if (val === 'Both Flanks') {
          updateTI(tab, id, 'ul', 'Balanced')
        } else if (val === 'Left'  && curUL === 'Left')  updateTI(tab, id, 'ul', 'Balanced')
        else if   (val === 'Right' && curUL === 'Right') updateTI(tab, id, 'ul', 'Balanced')
      }
      if (key === 'ul') {
        const curOL = values.ol || 'Balanced'
        if (val === 'Both Flanks') {
          updateTI(tab, id, 'ol', 'Balanced')
        } else if (val === 'Left'  && curOL === 'Left')  updateTI(tab, id, 'ol', 'Balanced')
        else if   (val === 'Right' && curOL === 'Right') updateTI(tab, id, 'ol', 'Balanced')
      }
    }
  }

  return (
    <div style={{ marginBottom: 6, border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: 8, overflow: 'hidden' }}>
      <div style={{
        display: 'flex', alignItems: 'center', padding: '7px 10px',
        background: 'rgba(255,255,255,0.04)',
        borderBottom: '0.5px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ flex: 1, fontSize: 12, fontWeight: 600 }}>{conf.label}</div>
        {isSelected ? (
          <span style={{ background: '#534AB7', color: '#CECBF6', fontSize: 9, padding: '2px 8px', borderRadius: 10 }}>
            Sélectionné
          </span>
        ) : (
          <button
            onClick={() => onSelect(id)}
            style={{
              background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)',
              fontSize: 9, padding: '2px 8px', borderRadius: 10,
              border: '0.5px solid rgba(255,255,255,0.1)', cursor: 'pointer',
            }}
          >
            Sélectionner
          </button>
        )}
      </div>

      <div style={{ padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 7 }}>
        {conf.params.map(p => {
          const disabledOpts = getDisabledOpts(id, p.key, values)
          const ctrl = () => {
            if (p.type === 'select') return (
              <select
                value={values[p.key] || p.opts[0]}
                onChange={e => handleChange(p.key, e.target.value)}
                style={{ fontSize: 10, padding: '3px 6px', width: '100%' }}
              >
                {p.opts.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            )
            if (p.type === 'toggle') return (
              <ToggleOpts
                opts={p.opts}
                value={values[p.key] || p.opts[0]}
                onChange={v => handleChange(p.key, v)}
                disabledOpts={disabledOpts}
              />
            )
            return (
              <SliderOpts
                opts={p.opts}
                value={values[p.key] || p.opts[0]}
                onChange={v => handleChange(p.key, v)}
                disabledOpts={disabledOpts}
              />
            )
          }

          return (
            <div key={p.key} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <div style={{
                fontSize: 11, color: 'rgba(255,255,255,0.5)',
                width: 148, flexShrink: 0, paddingTop: 3,
              }}>
                {p.label}
                {(p.key === 'ol' || p.key === 'ul') && (
                  <span style={{ fontSize: 8, color: 'rgba(255,102,25,0.7)', marginLeft: 4 }}>⚠</span>
                )}
              </div>
              <div style={{ flex: 1 }}>{ctrl()}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function TeamInstructions() {
  const tiOpen  = useStore(s => s.tiOpen)
  const tiTab   = useStore(s => s.tiTab)
  const ti      = useStore(s => s.ti)
  const setTIOpen      = useStore(s => s.setTIOpen)
  const setTITab       = useStore(s => s.setTITab)
  const setTIMentality = useStore(s => s.setTIMentality)
  const setTISelected  = useStore(s => s.setTISelected)

  if (!tiOpen) return null

  const sections = tiTab === 'ip' ? TI_IP : TI_OOP
  const selected = tiTab === 'ip' ? (ti.ipSelected || 'overview') : (ti.oopSelected || 'overview')

  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
        zIndex: 100, display: 'flex',
      }}
      onClick={e => e.target === e.currentTarget && setTIOpen(false)}
    >
      <div style={{
        width: 480, maxWidth: '100%', background: '#0f1419',
        borderRight: '0.5px solid rgba(255,255,255,0.08)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          padding: '10px 14px 8px',
          borderBottom: '0.5px solid rgba(255,255,255,0.08)',
          position: 'sticky', top: 0, background: '#0f1419', zIndex: 1, flexShrink: 0,
        }}>
          <button
            onClick={() => setTIOpen(false)}
            style={{
              position: 'absolute', right: 14, top: 10,
              background: 'none', border: '0.5px solid rgba(255,255,255,0.15)',
              borderRadius: 4, width: 26, height: 26, cursor: 'pointer',
              fontSize: 12, color: 'rgba(255,255,255,0.5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >✕</button>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#FF6619', marginBottom: 8 }}>
            ⚙ Team Instructions
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {['ip','oop'].map(t => (
              <button
                key={t}
                onClick={() => setTITab(t)}
                style={{
                  padding: '4px 14px', borderRadius: 20, fontSize: 10, cursor: 'pointer',
                  background: tiTab === t ? '#FF6619' : 'transparent',
                  border: tiTab === t ? '1px solid #FF6619' : '0.5px solid rgba(255,255,255,0.15)',
                  color: tiTab === t ? '#fff' : 'rgba(255,255,255,0.5)',
                  fontWeight: tiTab === t ? 600 : 400,
                }}
              >
                {t === 'ip' ? '▲ In Possession' : '▼ Out of Possession'}
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '10px 14px' }}>
          {/* Mentality */}
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 4 }}>
            Mentality
          </div>
          <div style={{
            display: 'flex', background: 'rgba(255,255,255,0.05)',
            borderRadius: 8, overflow: 'hidden',
            border: '0.5px solid rgba(255,255,255,0.08)', marginBottom: 12,
          }}>
            {MENTALITIES.map(m => (
              <button
                key={m}
                onClick={() => setTIMentality(m)}
                style={{
                  flex: 1, padding: '5px 2px', textAlign: 'center', fontSize: 9,
                  cursor: 'pointer', border: 'none',
                  background: ti.mentality === m ? '#FF6619' : 'transparent',
                  color: ti.mentality === m ? '#fff' : 'rgba(255,255,255,0.45)',
                  fontWeight: ti.mentality === m ? 600 : 400,
                }}
              >
                {m.replace('Very Defensive','V.Déf').replace('Defensive','Déf')
                  .replace('Very Offensive','V.Off').replace('Offensive','Off')}
              </button>
            ))}
          </div>

          {/* Overlap/Underlap note */}
          {tiTab === 'ip' && (
            <div style={{
              fontSize: 9, color: 'rgba(255,102,25,0.7)', marginBottom: 8,
              padding: '5px 8px', background: 'rgba(255,102,25,0.06)',
              borderRadius: 5, border: '0.5px solid rgba(255,102,25,0.2)',
            }}>
              ⚠ Overlap et Underlap sont mutuellement exclusifs par côté. Sélectionner le même côté sur les deux désactive l'option.
            </div>
          )}

          {Object.entries(sections).map(([id, conf]) => (
            <Section
              key={id} id={id} conf={conf} tab={tiTab}
              isSelected={selected === id}
              onSelect={s => setTISelected(tiTab, s)}
            />
          ))}

          <button
            onClick={() => setTIOpen(false)}
            style={{
              width: '100%', marginTop: 8, padding: 10,
              background: '#FF6619', border: 'none', borderRadius: 8,
              color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer',
            }}
          >
            Appliquer ✓
          </button>
        </div>
      </div>
    </div>
  )
}
