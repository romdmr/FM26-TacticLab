import { useStore } from '../store/useTacticStore'
import { POS_TYPES, ROLES_IP, ROLES_OOP, ROLE_DESC } from '../data/fm26'
import { PITCH_POSITIONS } from '../data/positions'
import { ROLE_ATTRIBUTES } from '../data/attributes'

const ZONE_STYLES = {
  attack:  { bg:'rgba(255,102,25,0.1)',  border:'rgba(255,102,25,0.3)',  text:'#FF6619', label:'ATTAQUE' },
  midhigh: { bg:'rgba(194,24,91,0.1)',   border:'rgba(194,24,91,0.3)',   text:'#C2185B', label:'MIL. OFF.' },
  mid:     { bg:'rgba(55,138,221,0.1)',  border:'rgba(55,138,221,0.3)',  text:'#378ADD', label:'MILIEU' },
  midlow:  { bg:'rgba(230,126,34,0.1)', border:'rgba(230,126,34,0.3)', text:'#E67E22', label:'MIL. DÉF.' },
  defense: { bg:'rgba(91,45,142,0.1)',   border:'rgba(91,45,142,0.3)',   text:'#9B59B6', label:'DÉFENSE' },
}

function AttributeChips({ role }) {
  const attrs = ROLE_ATTRIBUTES[role]
  if (!attrs) return null
  const { key, preferred } = attrs
  if (!key?.length && !preferred?.length) return null

  return (
    <div>
      {key?.length > 0 && (
        <div style={{ marginBottom: 6 }}>
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>
            Attributs clés
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            {key.map(a => (
              <span key={a} style={{
                fontSize: 9, padding: '2px 6px', borderRadius: 4,
                background: 'rgba(38,230,118,0.12)', color: '#26E676',
                border: '0.5px solid rgba(38,230,118,0.3)',
              }}>
                {a}
              </span>
            ))}
          </div>
        </div>
      )}
      {preferred?.length > 0 && (
        <div>
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>
            Attributs préférés
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            {preferred.map(a => (
              <span key={a} style={{
                fontSize: 9, padding: '2px 6px', borderRadius: 4,
                background: 'rgba(55,138,221,0.1)', color: '#378ADD',
                border: '0.5px solid rgba(55,138,221,0.25)',
              }}>
                {a}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function PlayerPanel() {
  const selectedPion   = useStore(s => s.selectedPion)
  const pionsIP        = useStore(s => s.pionsIP)
  const pionsOOP       = useStore(s => s.pionsOOP)
  const setPionRole    = useStore(s => s.setPionRole)
  const clearSelection = useStore(s => s.clearSelection)

  if (!selectedPion) return null

  const { side, idx } = selectedPion
  const pion    = (side === 'ip' ? pionsIP : pionsOOP)[idx]
  if (!pion) return null

  const c        = POS_TYPES[pion.t]
  const posInfo  = PITCH_POSITIONS[pion.posId]
  const riList   = ROLES_IP[pion.t]  || []
  const roList   = ROLES_OOP[pion.t] || []
  const zs       = ZONE_STYLES[posInfo?.zone] || ZONE_STYLES.defense

  const Sep = () => <div style={{ height: '0.5px', background: 'rgba(255,255,255,0.07)', margin: '10px 0' }} />

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#0f1419' }}>
      {/* Header */}
      <div style={{
        padding: '10px 14px', borderBottom: '0.5px solid rgba(255,255,255,0.08)',
        display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0,
      }}>
        <div style={{
          width: 38, height: 38, borderRadius: '50%',
          background: c.bg, color: c.tx, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 11, fontWeight: 700,
        }}>
          {c.label}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: '-0.3px' }}>
            {posInfo?.label || pion.posId}
          </div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {posInfo?.name || c.name}
          </div>
        </div>
        <div style={{
          fontSize: 8, fontWeight: 700, padding: '3px 7px', borderRadius: 4,
          background: zs.bg, color: zs.text, border: `0.5px solid ${zs.border}`,
        }}>
          {zs.label}
        </div>
      </div>

      {/* Scrollable body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>

        {/* ── IP Role ─────────────────────────── */}
        <div>
          <div style={{ fontSize: 9, fontWeight: 600, color: '#26E676', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 5 }}>
            ▲ Rôle In Possession
          </div>
          <div style={{ background: 'rgba(38,230,118,0.05)', borderRadius: 8, border: '0.5px solid rgba(38,230,118,0.3)', overflow: 'hidden', marginBottom: 6 }}>
            <select
              value={pion.rIP}
              onChange={e => setPionRole(side, idx, 'ip', e.target.value)}
              style={{ width: '100%', padding: '8px 10px', background: 'transparent', border: 'none', color: '#fff', fontSize: 12, fontWeight: 500, cursor: 'pointer', outline: 'none' }}
            >
              {riList.map(r => <option key={r} value={r} style={{ background: '#1a1f2e' }}>{r}</option>)}
            </select>
          </div>
          {ROLE_DESC[pion.rIP] && (
            <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, marginBottom: 8 }}>
              {ROLE_DESC[pion.rIP]}
            </div>
          )}
          <AttributeChips role={pion.rIP} />
        </div>

        <Sep />

        {/* ── OOP Role ────────────────────────── */}
        <div>
          <div style={{ fontSize: 9, fontWeight: 600, color: '#378ADD', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 5 }}>
            ▼ Rôle Out of Possession
          </div>
          <div style={{ background: 'rgba(55,138,221,0.05)', borderRadius: 8, border: '0.5px solid rgba(55,138,221,0.3)', overflow: 'hidden', marginBottom: 6 }}>
            <select
              value={pion.rOOP}
              onChange={e => setPionRole(side, idx, 'oop', e.target.value)}
              style={{ width: '100%', padding: '8px 10px', background: 'transparent', border: 'none', color: '#fff', fontSize: 12, fontWeight: 500, cursor: 'pointer', outline: 'none' }}
            >
              {roList.map(r => <option key={r} value={r} style={{ background: '#1a1f2e' }}>{r}</option>)}
            </select>
          </div>
          {ROLE_DESC[pion.rOOP] && (
            <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, marginBottom: 8 }}>
              {ROLE_DESC[pion.rOOP]}
            </div>
          )}
          <AttributeChips role={pion.rOOP} />
        </div>

        <Sep />

        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', lineHeight: 1.6, fontStyle: 'italic' }}>
          Glisse ce pion vers une autre zone pour changer son poste et ses rôles automatiquement.
        </div>
      </div>
    </div>
  )
}
