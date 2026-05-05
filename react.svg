import { useState, useRef, useCallback } from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Pitch from './components/Pitch'
import PlayerPanel from './components/PlayerPanel'
import TeamInstructions from './components/TeamInstructions'
import ScoreView from './components/ScoreView'
import HomeView from './components/HomeView'
import CommunityView from './components/CommunityView'
import SavedPanel from './components/SavedPanel'
import { useStore } from './store/useTacticStore'

function BuilderView() {
  const [activeSide, setActiveSide] = useState('ip')
  const [showLinks,  setShowLinks]  = useState(false)
  const [splitView,  setSplitView]  = useState(false)
  const selectedPion   = useStore(s => s.selectedPion)
  const clearSelection = useStore(s => s.clearSelection)
  const hasSelection   = selectedPion !== null

  return (
    <div style={{ display:'flex', width:'100%', height:'100%', overflow:'hidden' }}>

      {/* Sidebar */}
      <div style={{ width:190, flexShrink:0, background:'#0f1419', borderRight:'0.5px solid rgba(255,255,255,0.07)', overflowY:'auto' }}>
        <Sidebar />
      </div>

      {/* Centre */}
      <div style={{ flex:1, minWidth:0, display:'flex', flexDirection:'column', overflow:'hidden' }}>

        {/* Toolbar */}
        <div style={{
          height:44, flexShrink:0,
          display:'flex', alignItems:'center', gap:6, padding:'0 12px',
          background:'#0f1419', borderBottom:'0.5px solid rgba(255,255,255,0.08)',
        }}>
          {/* IP/OOP toggle (only in single view) */}
          {!splitView && ['ip','oop'].map(s => (
            <button key={s} onClick={() => setActiveSide(s)} style={{
              padding:'4px 14px', borderRadius:6, fontSize:11, fontWeight:600,
              cursor:'pointer', border:'none',
              background: activeSide===s ? (s==='ip' ? 'rgba(38,230,118,0.15)' : 'rgba(55,138,221,0.15)') : 'rgba(255,255,255,0.05)',
              color: activeSide===s ? (s==='ip' ? '#26E676' : '#378ADD') : 'rgba(255,255,255,0.4)',
              outline: activeSide===s ? `1.5px solid ${s==='ip' ? 'rgba(38,230,118,0.5)' : 'rgba(55,138,221,0.5)'}` : '1.5px solid transparent',
            }}>
              {s==='ip' ? '▲ In Possession' : '▼ Out of Possession'}
            </button>
          ))}

          {splitView && (
            <span style={{ fontSize:11, color:'rgba(255,255,255,0.4)' }}>▲ IP &nbsp;|&nbsp; ▼ OOP</span>
          )}

          {/* Divider */}
          <div style={{ width:1, height:18, background:'rgba(255,255,255,0.1)', margin:'0 2px' }} />

          {/* Split view toggle */}
          <button onClick={() => setSplitView(v => !v)} style={{
            padding:'4px 10px', borderRadius:6, fontSize:10, fontWeight:600,
            cursor:'pointer', border:'none',
            background: splitView ? 'rgba(241,196,15,0.15)' : 'rgba(255,255,255,0.05)',
            color: splitView ? '#F1C40F' : 'rgba(255,255,255,0.4)',
            outline: splitView ? '1.5px solid rgba(241,196,15,0.4)' : '1.5px solid transparent',
          }}>
            ⊞ Vue IP+OOP
          </button>

          {/* Links toggle */}
          <button onClick={() => setShowLinks(v => !v)} style={{
            padding:'4px 10px', borderRadius:6, fontSize:10, fontWeight:600,
            cursor:'pointer', border:'none',
            background: showLinks ? 'rgba(55,138,221,0.15)' : 'rgba(255,255,255,0.05)',
            color: showLinks ? '#378ADD' : 'rgba(255,255,255,0.4)',
            outline: showLinks ? '1.5px solid rgba(55,138,221,0.4)' : '1.5px solid transparent',
          }}>
            🔗 Liens
          </button>

          <span style={{ marginLeft:'auto', fontSize:10, color:'rgba(255,255,255,0.25)', fontStyle:'italic' }}>
            Clique · Glisse vers une zone
          </span>
          {hasSelection && (
            <button onClick={clearSelection} style={{ padding:'3px 8px', borderRadius:5, fontSize:10, background:'rgba(255,255,255,0.06)', border:'0.5px solid rgba(255,255,255,0.12)', color:'rgba(255,255,255,0.5)', cursor:'pointer' }}>
              ✕
            </button>
          )}
        </div>

        {/* Pitch area */}
        <div style={{ flex:1, minHeight:0, display:'flex', overflow:'hidden' }}>
          {splitView ? (
            <>
              <div style={{ flex:1, minWidth:0 }}><Pitch side="ip"  showLinks={showLinks} /></div>
              <div style={{ width:'0.5px', background:'rgba(255,255,255,0.08)', flexShrink:0 }} />
              <div style={{ flex:1, minWidth:0 }}><Pitch side="oop" showLinks={showLinks} /></div>
            </>
          ) : (
            <div data-export-pitch style={{flex:1, minWidth:0, minHeight:0, overflow:"hidden"}}><Pitch side={activeSide} showLinks={showLinks} /></div>
          )}
        </div>
      </div>

      {/* Player panel */}
      {hasSelection && !splitView && (
        <div style={{ width:300, flexShrink:0, borderLeft:'0.5px solid rgba(255,255,255,0.08)', overflowY:'auto', background:'#0f1419' }}>
          <PlayerPanel />
        </div>
      )}
    </div>
  )
}

export default function App() {
  const view = useStore(s => s.view)
  const [showSaved, setShowSaved] = useState(false)

  return (
    <div style={{ display:'grid', gridTemplateRows:'46px 1fr', width:'100vw', height:'100vh', overflow:'hidden', background:'#0D1014' }}>
      <Navbar onSavedClick={() => setShowSaved(v => !v)} />
      <div style={{ overflow:'hidden', height:'100%' }}>
        {view === 'home'      && <HomeView />}
        {view === 'builder'   && <BuilderView />}
        {view === 'score'     && <ScoreView />}
        {view === 'community' && <CommunityView />}
      </div>
      <TeamInstructions />
      {showSaved && <SavedPanel onClose={() => setShowSaved(false)} />}
    </div>
  )
}
