import { useMemo, useState } from 'react'
import { useStore } from '../store/useTacticStore'
import { computeGlobalScore, generateRecommendations } from '../engine/scoring'
import { TEAM_PROFILES } from '../data/teamprofiles'
import { getStyleCompatibility } from '../data/teamprofiles'
import { getStyleRecommendations } from '../engine/profile_scoring'
import {
  computePartnerships, computeForwardMovementScores,
  computePositionalResponsibilities, generatePartnershipSuggestions,
  PARTNERSHIP_TYPES, RISK_LEVELS
} from '../engine/partnerships'

const DIM_META = {
  defense:   { label: 'Bloc défensif',        color: '#9B59B6', desc: 'CBs, couverture latérale, GK' },
  midfield:  { label: 'Milieu de terrain',    color: '#E67E22', desc: 'Écran DM, densité, B2B, Half Back' },
  attack:    { label: 'Puissance offensive',  color: '#FF6619', desc: 'ST, finition, création, style' },
  ip:        { label: 'Cohérence IP',         color: '#26E676', desc: 'Rôles offensifs, style, TI' },
  oop:       { label: 'Solidité OOP',         color: '#378ADD', desc: 'Bloc, ligne, pressing, WB' },
  synergies: { label: 'Synergies de rôles',   color: '#C2185B', desc: 'Paires complémentaires, conflits' },
  profile:   { label: 'Adéquation profil',    color: '#F1C40F', desc: 'Style vs niveau d\'équipe, complexité' },
}

// ── Score ring ──────────────────────────────────────────────────────────
function ScoreRing({ score, color, size = 120 }) {
  const r = size * 0.42, circ = 2 * Math.PI * r
  const fill = (score / 10) * circ
  const c = color || (score >= 8 ? '#26E676' : score >= 6 ? '#378ADD' : score >= 4 ? '#FF6619' : '#E74C3C')
  const label = score >= 8.5 ? 'Excellente' : score >= 7 ? 'Bonne' : score >= 5 ? 'Moyenne' : 'Faible'
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
      <div style={{ position:'relative', width:size, height:size }}>
        <svg width={size} height={size} style={{ transform:'rotate(-90deg)' }}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={size*0.075}/>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={c} strokeWidth={size*0.075}
            strokeDasharray={circ} strokeDashoffset={circ - fill} strokeLinecap="round"
            style={{ transition:'stroke-dashoffset 0.8s ease' }}/>
        </svg>
        <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
          <div style={{ fontSize:size*0.25, fontWeight:800, color:c, lineHeight:1 }}>{score.toFixed(1)}</div>
          <div style={{ fontSize:size*0.075, color:'rgba(255,255,255,0.35)', marginTop:1 }}>/10</div>
        </div>
      </div>
      <div style={{ fontSize:14, fontWeight:700, color:c }}>{label}</div>
    </div>
  )
}

// ── Dimension bar ────────────────────────────────────────────────────────
function DimRow({ dimKey, dim }) {
  const m = DIM_META[dimKey]
  return (
    <div style={{ marginBottom:12 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:3 }}>
        <div>
          <span style={{ fontSize:12, fontWeight:500 }}>{m.label}</span>
          <span style={{ fontSize:9, color:'rgba(255,255,255,0.3)', marginLeft:6 }}>{m.desc}</span>
        </div>
        <span style={{ fontSize:16, fontWeight:700, color:m.color }}>{dim.score.toFixed(1)}</span>
      </div>
      <div style={{ height:5, background:'rgba(255,255,255,0.07)', borderRadius:3 }}>
        <div style={{ height:'100%', width:`${(dim.score/10)*100}%`, background:m.color, borderRadius:3, transition:'width 0.6s ease' }}/>
      </div>
      {dim.issues.length > 0 && (
        <div style={{ marginTop:4, display:'flex', flexDirection:'column', gap:2 }}>
          {dim.issues.slice(0,2).map((iss,i) => (
            <div key={i} style={{ fontSize:10, color:'rgba(231,76,60,0.8)', paddingLeft:8, borderLeft:'2px solid rgba(231,76,60,0.4)' }}>{iss}</div>
          ))}
        </div>
      )}
      {dim.strengths.length > 0 && dim.issues.length === 0 && (
        <div style={{ marginTop:4 }}>
          <div style={{ fontSize:10, color:'rgba(38,230,118,0.7)', paddingLeft:8, borderLeft:'2px solid rgba(38,230,118,0.3)' }}>{dim.strengths[0]}</div>
        </div>
      )}
    </div>
  )
}

// ── Profile card ─────────────────────────────────────────────────────────
function ProfileCard({ profile, styleCompat, style }) {
  const recs = getStyleRecommendations(profile.key)
  return (
    <div style={{ background:'#111820', borderRadius:12, padding:'16px 18px', border:`0.5px solid ${profile.border}` }}>
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
        <span style={{ fontSize:22 }}>{profile.emoji}</span>
        <div>
          <div style={{ fontSize:14, fontWeight:700, color:profile.color }}>{profile.label}</div>
          <div style={{ fontSize:10, color:'rgba(255,255,255,0.4)', marginTop:1 }}>{profile.desc}</div>
        </div>
        <div style={{
          marginLeft:'auto', fontSize:10, fontWeight:600, padding:'3px 10px', borderRadius:20,
          background: styleCompat.level==='ideal' ? profile.bg : styleCompat.level==='poor' ? 'rgba(231,76,60,0.1)' : 'rgba(255,255,255,0.05)',
          color: styleCompat.level==='ideal' ? profile.color : styleCompat.level==='poor' ? '#E74C3C' : 'rgba(255,255,255,0.5)',
          border:`0.5px solid ${styleCompat.level==='ideal' ? profile.border : styleCompat.level==='poor' ? 'rgba(231,76,60,0.3)' : 'rgba(255,255,255,0.1)'}`,
        }}>
          {styleCompat.label} — {style}
        </div>
      </div>
      <div style={{ fontSize:9, color:'rgba(255,255,255,0.3)', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:6 }}>
        Compatibilité des styles
      </div>
      <div style={{ display:'flex', flexWrap:'wrap', gap:4, marginBottom:12 }}>
        {recs.map(r => (
          <span key={r.style} style={{
            fontSize:9, padding:'2px 7px', borderRadius:4,
            background: r.level==='ideal' ? profile.bg : r.level==='poor' ? 'rgba(231,76,60,0.08)' : 'rgba(255,255,255,0.04)',
            color: r.level==='ideal' ? profile.color : r.level==='poor' ? '#E74C3C' : 'rgba(255,255,255,0.35)',
            border:`0.5px solid ${r.level==='ideal' ? profile.border : r.level==='poor' ? 'rgba(231,76,60,0.2)' : 'rgba(255,255,255,0.08)'}`,
            fontWeight: r.style===style ? 700 : 400,
            outline: r.style===style ? `1px solid ${r.level==='ideal' ? profile.color : '#E74C3C'}` : 'none',
          }}>
            {r.style}
          </span>
        ))}
      </div>
      {profile.advice.map((a,i) => (
        <div key={i} style={{ fontSize:10.5, color:'rgba(255,255,255,0.5)', lineHeight:1.6, marginBottom:5, paddingLeft:8, borderLeft:`2px solid ${profile.color}44` }}>
          {a}
        </div>
      ))}
    </div>
  )
}

// ── Zone score bar ────────────────────────────────────────────────────────
function ZoneScoreBar({ label, value, max = 20, color = '#26E676' }) {
  const pct = Math.min(100, (value / max) * 100)
  const isWeak = value < 8
  return (
    <div style={{ marginBottom:8 }}>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:3 }}>
        <span style={{ fontSize:11, color:'rgba(255,255,255,0.6)' }}>{label}</span>
        <span style={{ fontSize:13, fontWeight:700, color: isWeak ? '#FF6619' : color }}>{value}</span>
      </div>
      <div style={{ height:4, background:'rgba(255,255,255,0.07)', borderRadius:2 }}>
        <div style={{ height:'100%', width:`${pct}%`, background: isWeak ? '#FF6619' : color, borderRadius:2, transition:'width 0.5s ease' }}/>
      </div>
    </div>
  )
}

// ── Partnerships tab ──────────────────────────────────────────────────────
function PartnershipsTab({ pionsIP, pionsOOP }) {
  const links     = useMemo(() => computePartnerships(pionsIP), [pionsIP])
  const fwdScores = useMemo(() => computeForwardMovementScores(pionsIP), [pionsIP])
  const respons   = useMemo(() => computePositionalResponsibilities(pionsIP, pionsOOP), [pionsIP, pionsOOP])
  const suggestions = useMemo(() => generatePartnershipSuggestions(fwdScores, links, pionsIP), [fwdScores, links, pionsIP])

  // Count by type
  const byType = {}
  links.forEach(l => {
    const k = l.type.id
    byType[k] = (byType[k] || 0) + 1
  })
  const byRisk = {}
  links.forEach(l => {
    const k = l.risk.id
    byRisk[k] = (byRisk[k] || 0) + 1
  })

  const ZONE_LABELS = { left: 'Flanc gauche', central: 'Milieu central', right: 'Flanc droit', defense: 'Défense', attack: 'Attaque' }

  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:14 }}>

      {/* Col 1 — Forward movement scores */}
      <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
        <div style={{ background:'#111820', borderRadius:12, padding:'16px 18px', border:'0.5px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontSize:13, fontWeight:600, marginBottom:4 }}>Scores de mouvement offensif</div>
          <div style={{ fontSize:10, color:'rgba(255,255,255,0.35)', marginBottom:14 }}>Analyse IP — par zone du terrain</div>
          {[
            { label:'Pénétration — Gauche', val:fwdScores.left.penetration },
            { label:'Pénétration — Centre', val:fwdScores.central.penetration },
            { label:'Pénétration — Droite', val:fwdScores.right.penetration },
          ].map(s => <ZoneScoreBar key={s.label} label={s.label} value={s.val} color='#FF6619'/>)}
          <div style={{ height:'0.5px', background:'rgba(255,255,255,0.07)', margin:'10px 0' }}/>
          {[
            { label:'Support — Gauche', val:fwdScores.left.support },
            { label:'Support — Centre', val:fwdScores.central.support },
            { label:'Support — Droite', val:fwdScores.right.support },
          ].map(s => <ZoneScoreBar key={s.label} label={s.label} value={s.val} color='#378ADD'/>)}
          <div style={{ height:'0.5px', background:'rgba(255,255,255,0.07)', margin:'10px 0' }}/>
          {[
            { label:'Solidité — Gauche', val:fwdScores.left.solidity },
            { label:'Solidité — Centre', val:fwdScores.central.solidity },
            { label:'Solidité — Droite', val:fwdScores.right.solidity },
          ].map(s => <ZoneScoreBar key={s.label} label={s.label} value={s.val} color='#9B59B6'/>)}
        </div>

        {/* Partnership summary */}
        <div style={{ background:'#111820', borderRadius:12, padding:'16px 18px', border:'0.5px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontSize:13, fontWeight:600, marginBottom:12 }}>
            Liens détectés <span style={{ fontSize:11, color:'rgba(255,255,255,0.35)', fontWeight:400 }}>({links.length})</span>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
            {Object.values(PARTNERSHIP_TYPES).map(t => (
              <div key={t.id} style={{ display:'flex', alignItems:'center', gap:8 }}>
                <svg width="22" height="6">
                  <line x1="0" y1="3" x2="22" y2="3" stroke={t.color} strokeWidth="1.5"
                    strokeDasharray={t.dash ? '3 2' : undefined} strokeOpacity="0.85"/>
                </svg>
                <span style={{ fontSize:11, flex:1, color:'rgba(255,255,255,0.55)' }}>{t.label}</span>
                <span style={{ fontSize:14, fontWeight:700, color:t.color }}>{byType[t.id] || 0}</span>
              </div>
            ))}
          </div>
          <div style={{ height:'0.5px', background:'rgba(255,255,255,0.07)', margin:'10px 0' }}/>
          {Object.values(RISK_LEVELS).reverse().map(r => (
            <div key={r.id} style={{ display:'flex', alignItems:'center', gap:8, marginBottom:5 }}>
              <div style={{ width:8, height:8, borderRadius:'50%', background:r.color, flexShrink:0 }}/>
              <span style={{ fontSize:11, flex:1, color:'rgba(255,255,255,0.55)' }}>Risque {r.label}</span>
              <span style={{ fontSize:14, fontWeight:700, color:r.color }}>{byRisk[r.id] || 0}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Col 2 — Responsabilités positionnelles */}
      <div style={{ background:'#111820', borderRadius:12, padding:'16px 18px', border:'0.5px solid rgba(255,255,255,0.08)' }}>
        <div style={{ fontSize:13, fontWeight:600, marginBottom:4 }}>Responsabilités positionnelles</div>
        <div style={{ fontSize:10, color:'rgba(255,255,255,0.35)', marginBottom:14 }}>IP (a) = avec ballon · OOP (a) = sans ballon</div>

        {Object.keys(respons).length === 0 && (
          <div style={{ color:'rgba(255,255,255,0.25)', fontSize:12, textAlign:'center', padding:'30px 0' }}>
            Aucune responsabilité détectée
          </div>
        )}

        {Object.entries(respons).map(([zone, resps]) => (
          <div key={zone} style={{ marginBottom:16 }}>
            <div style={{ fontSize:11, fontWeight:600, color:'rgba(255,255,255,0.7)', marginBottom:6, display:'flex', alignItems:'center', gap:6 }}>
              <div style={{ width:3, height:14, borderRadius:2, background:'#FF6619' }}/>
              {ZONE_LABELS[zone] || zone}
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr auto auto', gap:'3px 10px', fontSize:10 }}>
              <div style={{ color:'rgba(255,255,255,0.3)', fontSize:9 }}>Responsabilité</div>
              <div style={{ color:'#26E676', fontSize:9, fontWeight:600, textAlign:'center' }}>IP</div>
              <div style={{ color:'#378ADD', fontSize:9, fontWeight:600, textAlign:'center' }}>OOP</div>
              {Object.entries(resps).map(([resp, counts]) => (
                <>
                  <div key={resp+'l'} style={{ color:'rgba(255,255,255,0.55)', paddingLeft:8 }}>{resp}</div>
                  <div key={resp+'ip'} style={{ color:counts.ip > 0 ? '#26E676' : 'rgba(255,255,255,0.2)', textAlign:'center', fontWeight:counts.ip > 0 ? 600 : 400 }}>
                    {counts.ip > 0 ? counts.ip : '—'}
                  </div>
                  <div key={resp+'oop'} style={{ color:counts.oop > 0 ? '#378ADD' : 'rgba(255,255,255,0.2)', textAlign:'center', fontWeight:counts.oop > 0 ? 600 : 400 }}>
                    {counts.oop > 0 ? counts.oop : '—'}
                  </div>
                </>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Col 3 — Suggestions */}
      <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
        <div style={{ background:'#111820', borderRadius:12, padding:'16px 18px', border:'0.5px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontSize:13, fontWeight:600, marginBottom:12 }}>
            Suggestions
            <span style={{ fontSize:11, color:'rgba(255,255,255,0.35)', fontWeight:400, marginLeft:6 }}>({suggestions.length})</span>
          </div>
          {suggestions.length === 0 ? (
            <div style={{ color:'rgba(38,230,118,0.6)', fontSize:11, padding:'16px 0', textAlign:'center' }}>
              ✓ Aucun problème de partnership détecté
            </div>
          ) : suggestions.map((s, i) => {
            const isWarn = s.type === 'warning'
            return (
              <div key={i} style={{
                padding:'8px 12px', borderRadius:8, marginBottom:8,
                background: isWarn ? 'rgba(255,102,25,0.08)' : 'rgba(55,138,221,0.08)',
                border:`0.5px solid ${isWarn ? 'rgba(255,102,25,0.25)' : 'rgba(55,138,221,0.2)'}`,
                display:'flex', gap:10,
              }}>
                <span style={{ color: isWarn ? '#FF6619' : '#378ADD', fontSize:12, flexShrink:0, marginTop:1 }}>
                  {isWarn ? '⚠' : 'i'}
                </span>
                <span style={{ fontSize:11, color:'rgba(255,255,255,0.65)', lineHeight:1.55 }}>{s.text}</span>
              </div>
            )
          })}
        </div>

        {/* Partnership description */}
        <div style={{ background:'#111820', borderRadius:12, padding:'16px 18px', border:'0.5px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontSize:13, fontWeight:600, marginBottom:10 }}>Légende des types</div>
          {Object.values(PARTNERSHIP_TYPES).map(t => (
            <div key={t.id} style={{ marginBottom:10 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:3 }}>
                <svg width="20" height="6">
                  <line x1="0" y1="3" x2="20" y2="3" stroke={t.color} strokeWidth="1.5"
                    strokeDasharray={t.dash ? '3 2' : undefined} strokeOpacity="0.9"/>
                </svg>
                <span style={{ fontSize:11, fontWeight:600, color:t.color }}>{t.label}</span>
              </div>
              <div style={{ fontSize:10, color:'rgba(255,255,255,0.4)', paddingLeft:28, lineHeight:1.5 }}>{t.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Issue / Strength / Rec items ─────────────────────────────────────────
const IssueItem = ({ text }) => (
  <div style={{ display:'flex', gap:8, padding:'6px 10px', background:'rgba(231,76,60,0.07)', borderRadius:6, border:'0.5px solid rgba(231,76,60,0.2)', marginBottom:4 }}>
    <span style={{ color:'#E74C3C', fontSize:11, flexShrink:0 }}>⚠</span>
    <span style={{ fontSize:11, color:'rgba(255,255,255,0.65)', lineHeight:1.5 }}>{text}</span>
  </div>
)
const StrengthItem = ({ text }) => (
  <div style={{ display:'flex', gap:8, padding:'6px 10px', background:'rgba(38,230,118,0.06)', borderRadius:6, border:'0.5px solid rgba(38,230,118,0.18)', marginBottom:4 }}>
    <span style={{ color:'#26E676', fontSize:11, flexShrink:0 }}>✓</span>
    <span style={{ fontSize:11, color:'rgba(255,255,255,0.65)', lineHeight:1.5 }}>{text}</span>
  </div>
)
const RecItem = ({ rec }) => {
  const map = {
    success:{ bg:'rgba(38,230,118,0.08)', border:'rgba(38,230,118,0.22)', icon:'✓', c:'#26E676' },
    info:   { bg:'rgba(55,138,221,0.08)', border:'rgba(55,138,221,0.22)', icon:'i', c:'#378ADD' },
    warning:{ bg:'rgba(255,102,25,0.08)', border:'rgba(255,102,25,0.22)', icon:'!', c:'#FF6619' },
    danger: { bg:'rgba(231,76,60,0.08)',  border:'rgba(231,76,60,0.22)', icon:'✕', c:'#E74C3C' },
  }
  const s = map[rec.type] || map.info
  return (
    <div style={{ display:'flex', gap:10, padding:'8px 12px', background:s.bg, borderRadius:8, border:`0.5px solid ${s.border}`, marginBottom:6 }}>
      <div style={{ width:18, height:18, borderRadius:'50%', border:`1px solid ${s.c}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, color:s.c, fontWeight:700, flexShrink:0 }}>{s.icon}</div>
      <span style={{ fontSize:11.5, color:'rgba(255,255,255,0.75)', lineHeight:1.55 }}>{rec.text}</span>
    </div>
  )
}

// ── Main ScoreView ────────────────────────────────────────────────────────
export default function ScoreView() {
  const pionsIP     = useStore(s => s.pionsIP)
  const pionsOOP    = useStore(s => s.pionsOOP)
  const ti          = useStore(s => s.ti)
  const style       = useStore(s => s.style)
  const name        = useStore(s => s.name)
  const teamProfile = useStore(s => s.teamProfile)
  const setView     = useStore(s => s.setView)

  const [activeTab, setActiveTab] = useState('analysis')
  const profile = TEAM_PROFILES[teamProfile] || TEAM_PROFILES.top

  const result = useMemo(() =>
    computeGlobalScore(pionsIP, pionsOOP, ti.ip, ti.oop, style, teamProfile),
    [pionsIP, pionsOOP, ti, style, teamProfile]
  )
  const recs = useMemo(() =>
    generateRecommendations(result, pionsIP, pionsOOP, ti.oop, style, teamProfile),
    [result, pionsIP, pionsOOP, ti.oop, style, teamProfile]
  )
  const styleCompat = getStyleCompatibility(teamProfile, style)

  const tabs = [
    { id:'analysis',     label:'Analyse',        icon:'★' },
    { id:'partnerships', label:'Partnerships',   icon:'🔗' },
    { id:'strengths',    label:'Points forts',   icon:'✓' },
  ]

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', overflow:'hidden' }}>
      {/* Header */}
      <div style={{ padding:'10px 20px', borderBottom:'0.5px solid rgba(255,255,255,0.08)', display:'flex', alignItems:'center', gap:12, flexShrink:0, background:'#111820' }}>
        <button onClick={() => setView('builder')} style={{ padding:'4px 12px', borderRadius:6, background:'transparent', border:'0.5px solid rgba(255,255,255,0.15)', color:'rgba(255,255,255,0.6)', fontSize:11, cursor:'pointer' }}>
          ◀ Retour
        </button>
        <div>
          <div style={{ fontSize:15, fontWeight:600 }}>Analyse tactique</div>
          <div style={{ fontSize:10, color:'rgba(255,255,255,0.4)' }}>
            {name} · {style} · <span style={{ color:profile.color }}>{profile.emoji} {profile.label}</span>
          </div>
        </div>
        {/* Tabs */}
        <div style={{ display:'flex', gap:4, marginLeft:20 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
              padding:'5px 14px', borderRadius:6, fontSize:11, fontWeight:600, cursor:'pointer', border:'none',
              background: activeTab===t.id ? 'rgba(255,255,255,0.1)' : 'transparent',
              color: activeTab===t.id ? '#fff' : 'rgba(255,255,255,0.4)',
              borderBottom: activeTab===t.id ? '2px solid #26E676' : '2px solid transparent',
            }}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>
        <div style={{ marginLeft:'auto', fontSize:11, color:'rgba(255,255,255,0.35)' }}>
          {result.allIssues.length} problème(s) · {result.allStrengths.length} point(s) fort(s)
        </div>
      </div>

      {/* Body */}
      <div style={{ flex:1, overflowY:'auto', padding:20 }}>

        {/* ── Tab : Analyse ────────────────────────────── */}
        {activeTab === 'analysis' && (
          <div style={{ display:'grid', gridTemplateColumns:'260px 1fr 1fr', gap:16, maxWidth:1200 }}>
            {/* Score + dims */}
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <div style={{ background:'#111820', borderRadius:12, padding:'20px 16px', border:`0.5px solid ${profile.border}`, display:'flex', flexDirection:'column', alignItems:'center', gap:12 }}>
                <ScoreRing score={result.global} color={profile.color}/>
                <div style={{ display:'flex', alignItems:'center', gap:6, padding:'4px 12px', borderRadius:20, background:profile.bg, border:`0.5px solid ${profile.border}` }}>
                  <span style={{ fontSize:12 }}>{profile.emoji}</span>
                  <span style={{ fontSize:11, fontWeight:600, color:profile.color }}>{profile.label}</span>
                </div>
                <div style={{ fontSize:10, color:'rgba(255,255,255,0.35)', textAlign:'center', lineHeight:1.6 }}>
                  7 dimensions · logique FM26<br/>contextualisé par le profil d'équipe
                </div>
              </div>
              <div style={{ background:'#111820', borderRadius:12, padding:'14px 16px', border:'0.5px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontSize:9, color:'rgba(255,255,255,0.3)', textTransform:'uppercase', letterSpacing:'0.6px', marginBottom:14 }}>Détail</div>
                {Object.entries(result.dimensions).map(([key, dim]) => (
                  <DimRow key={key} dimKey={key} dim={dim}/>
                ))}
              </div>
            </div>
            {/* Recs + issues */}
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <div style={{ background:'#111820', borderRadius:12, padding:'16px 18px', border:'0.5px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontSize:13, fontWeight:600, marginBottom:12 }}>Recommandations</div>
                {recs.map((r,i) => <RecItem key={i} rec={r}/>)}
              </div>
              {result.allIssues.length > 0 && (
                <div style={{ background:'#111820', borderRadius:12, padding:'16px 18px', border:'0.5px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ fontSize:13, fontWeight:600, marginBottom:12 }}>
                    Problèmes <span style={{ fontSize:11, color:'#E74C3C', fontWeight:400 }}>({result.allIssues.length})</span>
                  </div>
                  {result.allIssues.map((s,i) => <IssueItem key={i} text={s}/>)}
                </div>
              )}
            </div>
            {/* Profile */}
            <div>
              <ProfileCard profile={profile} styleCompat={styleCompat} style={style}/>
            </div>
          </div>
        )}

        {/* ── Tab : Partnerships ───────────────────────── */}
        {activeTab === 'partnerships' && (
          <PartnershipsTab pionsIP={pionsIP} pionsOOP={pionsOOP}/>
        )}

        {/* ── Tab : Points forts ──────────────────────── */}
        {activeTab === 'strengths' && (
          <div style={{ maxWidth:900 }}>
            {result.allStrengths.length === 0 ? (
              <div style={{ color:'rgba(255,255,255,0.3)', fontSize:13, padding:'40px 0', textAlign:'center' }}>
                Aucun point fort détecté — analyser une tactique complète.
              </div>
            ) : (
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                {['synergies','ip','oop','defense','midfield','attack','profile'].map(dimKey => {
                  const dim = result.dimensions[dimKey]
                  if (!dim?.strengths?.length) return null
                  const m = DIM_META[dimKey]
                  return (
                    <div key={dimKey} style={{ background:'#111820', borderRadius:12, padding:'14px 16px', border:`0.5px solid ${m.color}22` }}>
                      <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:10 }}>
                        <div style={{ width:3, height:16, borderRadius:2, background:m.color, flexShrink:0 }}/>
                        <span style={{ fontSize:12, fontWeight:600, color:m.color }}>{m.label}</span>
                        <span style={{ marginLeft:'auto', fontSize:15, fontWeight:700, color:m.color }}>{dim.score.toFixed(1)}</span>
                      </div>
                      {dim.strengths.map((s,i) => <StrengthItem key={i} text={s}/>)}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
