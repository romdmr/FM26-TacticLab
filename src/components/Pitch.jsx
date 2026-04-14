import { useRef, useCallback, useState, useMemo } from 'react'
import { useStore } from '../store/useTacticStore'
import { POS_TYPES } from '../data/fm26'
import { PITCH_POSITIONS, findNearestPosition } from '../data/positions'
import { computePartnerships, PARTNERSHIP_TYPES, RISK_LEVELS } from '../engine/partnerships'
import { computeCoherence } from '../engine/coherence'

// ── Terrain SVG ────────────────────────────────────────────────────────────
function PitchLines() {
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none"
      style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none' }}>
      <rect x="0" y="0" width="100" height="100" fill="#0d2410" />
      <rect x="5" y="2" width="90" height="96" fill="none" stroke="rgba(255,255,255,.18)" strokeWidth=".6"/>
      <line x1="5" y1="50" x2="95" y2="50" stroke="rgba(255,255,255,.18)" strokeWidth=".5"/>
      <circle cx="50" cy="50" r="12" fill="none" stroke="rgba(255,255,255,.18)" strokeWidth=".5"/>
      <circle cx="50" cy="50" r=".7" fill="rgba(255,255,255,.25)"/>
      <rect x="27" y="2"  width="46" height="17" fill="none" stroke="rgba(255,255,255,.14)" strokeWidth=".5"/>
      <rect x="27" y="81" width="46" height="17" fill="none" stroke="rgba(255,255,255,.14)" strokeWidth=".5"/>
      <rect x="37" y="2"  width="26" height="7"  fill="none" stroke="rgba(255,255,255,.1)"  strokeWidth=".4"/>
      <rect x="37" y="91" width="26" height="7"  fill="none" stroke="rgba(255,255,255,.1)"  strokeWidth=".4"/>
      <circle cx="50" cy="22" r="2.5" fill="none" stroke="rgba(255,255,255,.1)" strokeWidth=".4"/>
      <circle cx="50" cy="78" r="2.5" fill="none" stroke="rgba(255,255,255,.1)" strokeWidth=".4"/>
    </svg>
  )
}

// ── Liens SVG entre pions ─────────────────────────────────────────────────
function PartnershipLinks({ pions, canvasRef }) {
  const links = useMemo(() => computePartnerships(pions), [pions])
  if (!links.length) return null

  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none"
      style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none', zIndex:3 }}>
      {links.map((link, i) => {
        const color   = link.risk.color
        const isDash  = link.type.dash
        const opacity = link.risk.id === 'high' ? 0.65 : link.risk.id === 'medium' ? 0.45 : 0.3
        const width   = link.risk.id === 'high' ? 0.8  : link.risk.id === 'medium' ? 0.6  : 0.5
        return (
          <line
            key={i}
            x1={link.ax} y1={link.ay}
            x2={link.bx} y2={link.by}
            stroke={color}
            strokeWidth={width}
            strokeOpacity={opacity}
            strokeDasharray={isDash ? '2 1.5' : undefined}
          />
        )
      })}
    </svg>
  )
}

// ── Zones snap ───────────────────────────────────────────────────────────
function SnapZones({ hoverPosId }) {
  return (
    <>
      {Object.entries(PITCH_POSITIONS).map(([id, pos]) => {
        const isHover = hoverPosId === id
        return (
          <div key={id} style={{
            position:'absolute', left:`${pos.x}%`, top:`${pos.y}%`,
            transform:'translate(-50%,-50%)', width:34, height:34, borderRadius:'50%',
            border: isHover ? '2px solid rgba(255,255,255,0.9)' : '1.5px dashed rgba(255,255,255,0.2)',
            background: isHover ? 'rgba(255,255,255,0.14)' : 'transparent',
            display:'flex', alignItems:'center', justifyContent:'center',
            pointerEvents:'none', zIndex:2,
          }}>
            <span style={{ fontSize:7, color: isHover ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.25)', fontWeight:600, pointerEvents:'none' }}>
              {pos.label}
            </span>
          </div>
        )
      })}
    </>
  )
}

// ── Pion individuel ───────────────────────────────────────────────────────
function Pion({ pion, idx, side, isSelected, canvasRef, onDragStart, onDragMove, onDragEnd }) {
  const selectPion  = useStore(s => s.selectPion)
  const movePion    = useStore(s => s.movePion)
  const snapPion    = useStore(s => s.snapPion)
  const c           = POS_TYPES[pion.t]
  const dragRef     = useRef({ dragging:false, moved:false })

  // GK est locké — ne peut pas être déplacé
  const isGK = pion.t === 'GK'

  const onMouseDown = useCallback(e => {
    e.preventDefault(); e.stopPropagation()
    if (isGK) {
      // Clic simple = sélection uniquement, pas de drag
      selectPion(side, idx)
      return
    }
    dragRef.current = { dragging:false, moved:false, sx:e.clientX, sy:e.clientY }

    const onMove = ev => {
      const dx = ev.clientX - dragRef.current.sx
      const dy = ev.clientY - dragRef.current.sy
      if (!dragRef.current.dragging && Math.sqrt(dx*dx+dy*dy) > 5) {
        dragRef.current.dragging = true; onDragStart(idx)
      }
      if (dragRef.current.dragging) {
        dragRef.current.moved = true
        const rect = canvasRef.current.getBoundingClientRect()
        const x = Math.max(2,Math.min(98,(ev.clientX-rect.left)/rect.width*100))
        const y = Math.max(2,Math.min(98,(ev.clientY-rect.top)/rect.height*100))
        movePion(side, idx, x, y); onDragMove(x, y)
      }
    }
    const onUp = ev => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
      if (dragRef.current.moved) {
        const rect = canvasRef.current.getBoundingClientRect()
        const x = Math.max(2,Math.min(98,(ev.clientX-rect.left)/rect.width*100))
        const y = Math.max(2,Math.min(98,(ev.clientY-rect.top)/rect.height*100))
        snapPion(side, idx, x, y); onDragEnd()
      } else { selectPion(side, idx); onDragEnd() }
      dragRef.current = { dragging:false, moved:false }
    }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
  }, [side, idx, movePion, snapPion, selectPion, canvasRef, onDragStart, onDragMove, onDragEnd])

  const posLabel  = PITCH_POSITIONS[pion.posId]?.label || pion.posId
  const coherence  = computeCoherence(pion.rIP, pion.rOOP)

  return (
    <div
      style={{
        position:'absolute', left:`${pion.x}%`, top:`${pion.y}%`,
        transform:'translate(-50%,-50%)',
        display:'flex', flexDirection:'column', alignItems:'center', gap:2,
        cursor: isGK ? 'default' : 'grab', zIndex: isSelected ? 20 : 10, userSelect:'none',
      }}
      onMouseDown={onMouseDown}
      onClick={e => e.stopPropagation()}
    >
      <div style={{ fontSize:8, fontWeight:700, color: isSelected ? '#fff' : 'rgba(255,255,255,0.55)', background:'rgba(0,0,0,0.7)', padding:'0 4px', borderRadius:2, pointerEvents:'none' }}>
        {posLabel}
      </div>
      <div style={{
        position:'relative',
        width:32, height:32, borderRadius:'50%',
        background:c.bg, color:c.tx,
        display:'flex', alignItems:'center', justifyContent:'center',
        fontSize:9, fontWeight:700,
        border: isSelected ? '2.5px solid #fff' : '2px solid rgba(255,255,255,0.2)',
        boxShadow: isSelected ? `0 0 0 3px rgba(255,255,255,0.2), 0 0 14px ${c.bg}99` : `0 0 8px ${c.bg}44`,
        transform: isSelected ? 'scale(1.2)' : 'scale(1)',
        transition:'transform 0.1s, border-color 0.1s',
        pointerEvents:'none',
      }}>
        {c.label}
        {isGK && <span style={{ position:'absolute', bottom:-2, right:-2, fontSize:7, background:'rgba(0,0,0,0.8)', borderRadius:2, padding:'0 2px', color:'rgba(255,255,255,0.5)' }}>🔒</span>}
      </div>
      <div style={{ fontSize:8, background:'rgba(0,0,0,0.8)', color:'rgba(255,255,255,0.85)', padding:'1px 4px', borderRadius:2, whiteSpace:'nowrap', maxWidth:68, overflow:'hidden', textOverflow:'ellipsis', pointerEvents:'none' }}>
        {(pion.rIP||'').split(' ').slice(0,2).join(' ')}
      </div>
    </div>
  )
}

// ── Légende des liens ─────────────────────────────────────────────────────
function LinksLegend() {
  return (
    <div style={{
      position:'absolute', bottom:8, right:8, zIndex:30,
      background:'rgba(0,0,0,0.75)', borderRadius:7, padding:'7px 10px',
      border:'0.5px solid rgba(255,255,255,0.1)',
      display:'flex', flexDirection:'column', gap:4,
    }}>
      {[
        { color:'#26E676', label:'Direct', dash:false },
        { color:'#378ADD', label:'Chevauchement', dash:false },
        { color:'#FF6619', label:'Interchange', dash:true },
        { color:'#C2185B', label:'Sous-croisement', dash:true },
      ].map(item => (
        <div key={item.label} style={{ display:'flex', alignItems:'center', gap:6 }}>
          <svg width="20" height="6">
            <line x1="0" y1="3" x2="20" y2="3" stroke={item.color} strokeWidth="1.5"
              strokeDasharray={item.dash ? '3 2' : undefined} strokeOpacity="0.8"/>
          </svg>
          <span style={{ fontSize:9, color:'rgba(255,255,255,0.6)' }}>{item.label}</span>
        </div>
      ))}
      <div style={{ height:'0.5px', background:'rgba(255,255,255,0.1)', margin:'2px 0' }}/>
      {[RISK_LEVELS.HIGH, RISK_LEVELS.MEDIUM, RISK_LEVELS.LOW].map(r => (
        <div key={r.id} style={{ display:'flex', alignItems:'center', gap:6 }}>
          <div style={{ width:8, height:8, borderRadius:'50%', background:r.color, opacity:0.8 }}/>
          <span style={{ fontSize:9, color:'rgba(255,255,255,0.6)' }}>Risque {r.label}</span>
        </div>
      ))}
    </div>
  )
}

// ── Composant principal ───────────────────────────────────────────────────
export default function Pitch({ side, showLinks = false }) {
  const pionsIP        = useStore(s => s.pionsIP)
  const pionsOOP       = useStore(s => s.pionsOOP)
  const selectedPion   = useStore(s => s.selectedPion)
  const clearSelection = useStore(s => s.clearSelection)

  const pions = side === 'ip' ? pionsIP : pionsOOP
  const ref   = useRef(null)

  const [isDragging, setIsDragging] = useState(false)
  const [hoverPosId, setHoverPosId] = useState(null)

  const onDragStart = useCallback(() => { setIsDragging(true); setHoverPosId(null) }, [])
  const onDragMove  = useCallback((x,y) => { const n=findNearestPosition(x,y); setHoverPosId(n?n.id:null) }, [])
  const onDragEnd   = useCallback(() => { setIsDragging(false); setHoverPosId(null) }, [])

  const color    = side === 'ip' ? '#26E676' : '#378ADD'
  const bgHeader = side === 'ip' ? 'rgba(38,230,118,0.1)' : 'rgba(55,138,221,0.1)'
  const bdColor  = side === 'ip' ? 'rgba(38,230,118,0.22)' : 'rgba(55,138,221,0.22)'
  const label    = side === 'ip' ? '▲ IN POSSESSION' : '▼ OUT OF POSSESSION'

  return (
    <div style={{ width:'100%', height:'100%', display:'flex', flexDirection:'column', background:'#0d2410' }}>
      <div style={{ height:24, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:600, color, background:bgHeader, borderBottom:`1px solid ${bdColor}` }}>
        {label}
      </div>
      <div ref={ref} style={{ flex:1, position:'relative', overflow:'hidden', minHeight:0 }} onClick={clearSelection}>
        <PitchLines />
        {showLinks && !isDragging && <PartnershipLinks pions={pions} canvasRef={ref} />}
        {isDragging && <SnapZones hoverPosId={hoverPosId} />}
        {pions.map((p,i) => (
          <Pion key={`${p.posId}-${i}`} pion={p} idx={i} side={side}
            isSelected={selectedPion?.side===side && selectedPion?.idx===i}
            canvasRef={ref} onDragStart={onDragStart} onDragMove={onDragMove} onDragEnd={onDragEnd}
          />
        ))}
        {showLinks && !isDragging && <LinksLegend />}
      </div>
    </div>
  )
}
