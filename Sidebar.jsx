import { useState } from 'react'
import { useStore } from '../store/useTacticStore'
import { TEAM_PROFILES, PROFILE_KEYS } from '../data/teamprofiles'
import ExportButton from './ExportButton'

function ProfileSelector({ onClose }) {
  const teamProfile    = useStore(s => s.teamProfile)
  const setTeamProfile = useStore(s => s.setTeamProfile)

  return (
    <div
      style={{ position:'fixed', inset:0, zIndex:200, display:'flex', alignItems:'flex-start', justifyContent:'center', paddingTop:52 }}
      onClick={e => e.target===e.currentTarget && onClose()}
    >
      <div style={{ background:'#111820', border:'0.5px solid rgba(255,255,255,0.12)', borderRadius:12, padding:'14px 0', width:340, boxShadow:'0 8px 32px rgba(0,0,0,0.5)' }}>
        <div style={{ padding:'0 14px 10px', fontSize:11, fontWeight:600, color:'rgba(255,255,255,0.4)', letterSpacing:'0.5px', textTransform:'uppercase' }}>
          Profil d'équipe
        </div>
        {PROFILE_KEYS.map(key => {
          const p = TEAM_PROFILES[key]
          const isActive = teamProfile === key
          return (
            <div key={key} onClick={() => { setTeamProfile(key); onClose() }}
              style={{
                padding:'10px 14px', cursor:'pointer',
                background: isActive ? p.bg : 'transparent',
                borderLeft: isActive ? `3px solid ${p.color}` : '3px solid transparent',
              }}
              onMouseEnter={e => { if(!isActive) e.currentTarget.style.background='rgba(255,255,255,0.04)' }}
              onMouseLeave={e => { if(!isActive) e.currentTarget.style.background='transparent' }}
            >
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:3 }}>
                <span style={{ fontSize:14 }}>{p.emoji}</span>
                <span style={{ fontSize:13, fontWeight:600, color: isActive ? p.color : '#fff' }}>{p.label}</span>
                {isActive && <span style={{ marginLeft:'auto', fontSize:9, background:p.bg, color:p.color, border:`0.5px solid ${p.border}`, padding:'2px 7px', borderRadius:10, fontWeight:600 }}>Actif</span>}
              </div>
              <div style={{ fontSize:10, color:'rgba(255,255,255,0.45)', lineHeight:1.5, paddingLeft:22 }}>{p.desc}</div>
              <div style={{ fontSize:9, color:'rgba(255,255,255,0.25)', paddingLeft:22, marginTop:2 }}>Ex : {p.examples}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function Navbar({ onSavedClick }) {
  const name    = useStore(s => s.name)
  const formIP  = useStore(s => s.formIP)
  const formOOP = useStore(s => s.formOOP)
  const style   = useStore(s => s.style)
  const view    = useStore(s => s.view)
  const teamProfile = useStore(s => s.teamProfile)
  const setName = useStore(s => s.setName)
  const setView = useStore(s => s.setView)
  const setTIOpen = useStore(s => s.setTIOpen)

  const [editing,      setEditing]      = useState(false)
  const [tempName,     setTempName]     = useState(name)
  const [showProfile,  setShowProfile]  = useState(false)

  const profile = TEAM_PROFILES[teamProfile] || TEAM_PROFILES.top

  const handleNameBlur = () => {
    setEditing(false)
    if (tempName.trim()) setName(tempName.trim())
    else setTempName(name)
  }

  const navLink = (label, target) => (
    <button key={target} onClick={() => setView(target)} style={{
      padding:'3px 10px', borderRadius:5, fontSize:11, cursor:'pointer', border:'none',
      background: view===target ? 'rgba(255,255,255,0.1)' : 'transparent',
      color: view===target ? '#fff' : 'rgba(255,255,255,0.45)',
      fontWeight: view===target ? 600 : 400,
    }}>{label}</button>
  )

  return (
    <>
      <div style={{
        gridColumn:'1 / -1', background:'#111820',
        borderBottom:'0.5px solid rgba(255,255,255,0.07)',
        display:'flex', alignItems:'center', gap:6, padding:'0 14px',
        height:46, flexShrink:0, position:'relative', zIndex:10,
      }}>
        {/* Logo */}
        <div onClick={() => setView('home')} style={{ fontSize:14, fontWeight:700, marginRight:8, letterSpacing:'-0.3px', cursor:'pointer' }}>
          TACTIC<span style={{ color:'#26E676' }}>LAB</span>
        </div>

        {navLink('Home', 'home')}
        {navLink('Builder', 'builder')}
        {navLink('Leaderboard', 'community')}

        {/* Profile pill */}
        <button onClick={() => setShowProfile(v => !v)} style={{
          display:'flex', alignItems:'center', gap:5, padding:'3px 9px', borderRadius:20,
          fontSize:11, cursor:'pointer', border:`0.5px solid ${profile.border}`,
          background:profile.bg, color:profile.color, fontWeight:600, marginLeft:4,
        }}>
          {profile.emoji} {profile.label} ▾
        </button>

        {/* Tactic context */}
        {(view==='builder' || view==='score') && (
          <div style={{ display:'flex', alignItems:'center', gap:6, marginLeft:4 }}>
            <div style={{ width:1, height:16, background:'rgba(255,255,255,0.1)' }} />
            {editing ? (
              <input autoFocus value={tempName} onChange={e => setTempName(e.target.value)}
                onBlur={handleNameBlur} onKeyDown={e => { if(e.key==='Enter') handleNameBlur() }}
                style={{ background:'rgba(255,255,255,0.07)', border:'1px solid rgba(38,230,118,0.4)', borderRadius:20, padding:'2px 10px', fontSize:11, color:'#fff', outline:'none', width:180 }}
              />
            ) : (
              <div onClick={() => { setEditing(true); setTempName(name) }}
                style={{ padding:'2px 9px', borderRadius:20, fontSize:11, cursor:'pointer', background:'rgba(255,255,255,0.05)', border:'0.5px solid rgba(255,255,255,0.1)', color:'rgba(255,255,255,0.65)' }}>
                ✎ {name}
              </div>
            )}
            <div style={{ padding:'2px 8px', borderRadius:20, fontSize:11, border:'0.5px solid rgba(38,230,118,0.4)', color:'#26E676', background:'rgba(38,230,118,0.07)' }}>▲ {formIP}</div>
            <div style={{ padding:'2px 8px', borderRadius:20, fontSize:11, border:'0.5px solid rgba(55,138,221,0.4)', color:'#378ADD', background:'rgba(55,138,221,0.07)' }}>▼ {formOOP}</div>
            <div style={{ padding:'2px 8px', borderRadius:20, fontSize:11, border:'0.5px solid rgba(255,255,255,0.1)', color:'rgba(255,255,255,0.5)' }}>⚡ {style}</div>
          </div>
        )}

        {/* Actions */}
        <div style={{ marginLeft:'auto', display:'flex', gap:6, alignItems:'center' }}>
          {view==='builder' && (
            <>
              <button onClick={() => setTIOpen(true)} style={{ padding:'4px 11px', borderRadius:6, background:'#FF6619', border:'none', color:'#fff', fontSize:11, fontWeight:600, cursor:'pointer' }}>
                ⚙ Team Instructions
              </button>
              <button onClick={() => setView('score')} style={{ padding:'4px 11px', borderRadius:6, background:'#534AB7', border:'none', color:'#fff', fontSize:11, fontWeight:600, cursor:'pointer' }}>
                ★ Analyser
              </button>
              <ExportButton />
            </>
          )}
          {/* Saved tactics button */}
          <button onClick={onSavedClick} style={{
            padding:'4px 11px', borderRadius:6, fontSize:11, fontWeight:600,
            cursor:'pointer', border:'none',
            background:'rgba(255,255,255,0.07)', color:'rgba(255,255,255,0.6)',
            outline:'0.5px solid rgba(255,255,255,0.15)',
          }}>
            📁 Mes tactiques
          </button>
        </div>
      </div>
      {showProfile && <ProfileSelector onClose={() => setShowProfile(false)} />}
    </>
  )
}
