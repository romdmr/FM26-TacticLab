import { useState } from 'react'
import { useStore } from '../store/useTacticStore'
import { useSavedStore } from '../store/useTacticStore'
import { TEAM_PROFILES } from '../data/teamprofiles'

function formatDate(iso) {
  const d = new Date(iso)
  return d.toLocaleDateString('fr-FR', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' })
}

export default function SavedPanel({ onClose }) {
  const state       = useStore(s => s)
  const saved       = useSavedStore(s => s.saved)
  const saveTactic  = useSavedStore(s => s.saveTactic)
  const deleteTactic= useSavedStore(s => s.deleteTactic)
  const renameTactic= useSavedStore(s => s.renameTactic)
  const loadTemplate= useStore(s => s.loadTemplate)
  const setView     = useStore(s => s.setView)

  const [editingId,  setEditingId]  = useState(null)
  const [editName,   setEditName]   = useState('')
  const [justSaved,  setJustSaved]  = useState(false)

  const handleSave = () => {
    saveTactic({
      name:        state.name,
      style:       state.style,
      teamProfile: state.teamProfile,
      formIP:      state.formIP,
      formOOP:     state.formOOP,
      pionsIP:     state.pionsIP,
      pionsOOP:    state.pionsOOP,
      ti:          state.ti,
    })
    setJustSaved(true)
    setTimeout(() => setJustSaved(false), 2000)
  }

  const handleLoad = (tpl) => {
    loadTemplate(tpl)
    setView('builder')
    onClose()
  }

  return (
    <div
      style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', zIndex:200, display:'flex', justifyContent:'flex-end' }}
      onClick={e => e.target===e.currentTarget && onClose()}
    >
      <div style={{ width:360, background:'#0f1419', borderLeft:'0.5px solid rgba(255,255,255,0.08)', display:'flex', flexDirection:'column', overflow:'hidden' }}>

        {/* Header */}
        <div style={{ padding:'12px 16px', borderBottom:'0.5px solid rgba(255,255,255,0.08)', display:'flex', alignItems:'center', gap:10, flexShrink:0 }}>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:14, fontWeight:600 }}>Mes tactiques</div>
            <div style={{ fontSize:10, color:'rgba(255,255,255,0.35)', marginTop:1 }}>{saved.length}/20 sauvegardées en local</div>
          </div>
          <button onClick={handleSave} style={{
            padding:'5px 12px', borderRadius:6, fontSize:11, fontWeight:600, cursor:'pointer', border:'none',
            background: justSaved ? '#26E676' : 'rgba(38,230,118,0.15)',
            color: justSaved ? '#0D1014' : '#26E676',
            outline:'1px solid rgba(38,230,118,0.4)',
            transition:'all 0.2s',
          }}>
            {justSaved ? '✓ Sauvegardé !' : '+ Sauvegarder'}
          </button>
          <button onClick={onClose} style={{ width:26, height:26, borderRadius:5, background:'rgba(255,255,255,0.06)', border:'0.5px solid rgba(255,255,255,0.1)', color:'rgba(255,255,255,0.5)', cursor:'pointer', fontSize:12, display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>
        </div>

        {/* List */}
        <div style={{ flex:1, overflowY:'auto', padding:'8px 10px' }}>
          {saved.length === 0 ? (
            <div style={{ textAlign:'center', padding:'48px 20px', color:'rgba(255,255,255,0.25)', fontSize:12, lineHeight:1.8 }}>
              Aucune tactique sauvegardée.<br />
              <span style={{ fontSize:10 }}>Clique sur "+ Sauvegarder" pour enregistrer ta tactique actuelle.</span>
            </div>
          ) : (
            saved.map(tpl => {
              const profile = TEAM_PROFILES[tpl.teamProfile] || TEAM_PROFILES.top
              const isEditing = editingId === tpl.id

              return (
                <div key={tpl.id} style={{
                  background:'rgba(255,255,255,0.03)', borderRadius:8, padding:'10px 12px',
                  border:'0.5px solid rgba(255,255,255,0.07)', marginBottom:6,
                  borderLeft:`3px solid ${profile.color}`,
                }}>
                  {/* Name row */}
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:5 }}>
                    {isEditing ? (
                      <input
                        autoFocus value={editName}
                        onChange={e => setEditName(e.target.value)}
                        onBlur={() => { renameTactic(tpl.id, editName||tpl.name); setEditingId(null) }}
                        onKeyDown={e => { if(e.key==='Enter') { renameTactic(tpl.id, editName||tpl.name); setEditingId(null) }}}
                        style={{ flex:1, background:'rgba(255,255,255,0.07)', border:'1px solid rgba(38,230,118,0.4)', borderRadius:4, padding:'3px 8px', fontSize:12, color:'#fff', outline:'none' }}
                      />
                    ) : (
                      <div
                        style={{ flex:1, fontSize:12, fontWeight:600, cursor:'text' }}
                        onClick={() => { setEditingId(tpl.id); setEditName(tpl.name) }}
                        title="Cliquer pour renommer"
                      >
                        {tpl.name}
                      </div>
                    )}
                    <button onClick={() => deleteTactic(tpl.id)} style={{ width:20, height:20, borderRadius:4, background:'rgba(231,76,60,0.12)', border:'0.5px solid rgba(231,76,60,0.25)', color:'#E74C3C', cursor:'pointer', fontSize:10, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>✕</button>
                  </div>

                  {/* Meta */}
                  <div style={{ display:'flex', flexWrap:'wrap', gap:4, marginBottom:8 }}>
                    <span style={{ fontSize:9, padding:'2px 6px', borderRadius:3, background:profile.bg, color:profile.color, border:`0.5px solid ${profile.border}` }}>{profile.emoji} {profile.label}</span>
                    <span style={{ fontSize:9, padding:'2px 6px', borderRadius:3, background:'rgba(255,255,255,0.05)', color:'rgba(255,255,255,0.5)', border:'0.5px solid rgba(255,255,255,0.08)' }}>▲ {tpl.formIP}</span>
                    <span style={{ fontSize:9, padding:'2px 6px', borderRadius:3, background:'rgba(255,255,255,0.05)', color:'rgba(255,255,255,0.5)', border:'0.5px solid rgba(255,255,255,0.08)' }}>▼ {tpl.formOOP}</span>
                    <span style={{ fontSize:9, padding:'2px 6px', borderRadius:3, background:'rgba(255,255,255,0.05)', color:'rgba(255,255,255,0.4)', border:'0.5px solid rgba(255,255,255,0.08)' }}>⚡ {tpl.style}</span>
                  </div>

                  {/* Date + load */}
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                    <div style={{ fontSize:9, color:'rgba(255,255,255,0.25)' }}>{formatDate(tpl.savedAt)}</div>
                    <button
                      onClick={() => handleLoad(tpl)}
                      style={{ padding:'3px 10px', borderRadius:5, fontSize:10, fontWeight:600, cursor:'pointer', background:'rgba(255,255,255,0.07)', border:'0.5px solid rgba(255,255,255,0.12)', color:'rgba(255,255,255,0.6)' }}
                    >
                      Charger →
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
