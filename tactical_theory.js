import { useState } from 'react'
import { useStore } from '../store/useTacticStore'

const TACTICS_DB = [
  { id:1, name:'Tiki-Taka Total',       formation:'4-3-3',   formOOP:'4-5-1',   style:'Possession', score:9.2, votes:1847, author:'TacticoMaster', tags:['DLP','Half Back','Ball-Playing CB'], ip:'Possession dominante avec circuits courts. Ball-Playing GK + DLP + Half Back pour construire.', oop:'Compact mid block. Structured wide pressing.' },
  { id:2, name:'Gegenpress Engine',      formation:'4-2-3-1', formOOP:'4-2-3-1', style:'Gegenpress', score:9.1, votes:1523, author:'PressingKing',   tags:['B2B','False 9','Pressing CM'], ip:'Double Box-to-Box DM + False 9 to disrupt the opposition defence.', oop:'Coordinated high press. Tracking CF + Pressing CM + Pressing DM.' },
  { id:3, name:'False 9 Overload',       formation:'4-3-3',   formOOP:'4-4-2',   style:'Possession', score:9.1, votes:1201, author:'FalseNineFan',   tags:['False 9','Channel Mid','Inside WB'], ip:'False 9 + deux Channel Mids pour exploiter les demi-espaces. Inside WBs pour surcharger le centre.', oop:'Bloc 4-4-2 compact avec Tracking Wingers.' },
  { id:4, name:'High Line Blitz',        formation:'3-4-3',   formOOP:'3-4-3',   style:'High Press', score:8.9, votes:987,  author:'HighLineHero',  tags:['Sweeper Keeper','WB','Pressing DM'], ip:'3 CBs with offensive WBs. Sweeper Keeper behind the high line.', oop:'Pressing WBs + Pressing DM to close wide spaces.' },
  { id:5, name:'Low Block Counter',      formation:'5-4-1',   formOOP:'5-4-1',   style:'Counter',    score:8.7, votes:876,  author:'CounterKing',   tags:['Central Outlet CF','Wide Outlet Mid','Holding WB'], ip:'Disciplined 5-4-1. Central Outlet CF + Wide Outlet Mids for fast transitions.', oop:'Very compact low block. Holding WBs to secure the flanks.' },
  { id:6, name:'Direct Power Play',      formation:'4-4-2',   formOOP:'4-5-1',   style:'Direct',     score:8.4, votes:743,  author:'DirectFootball', tags:['Target Forward','Wide Mid','Stopping CB'], ip:'Double ST with Target Forward. Wide Mids crossing early for aerial duels.', oop:'Defensive 5-man midfield. Tracking Wide Mids + Screening DM.' },
  { id:7, name:'Asymetric Press',        formation:'4-3-3',   formOOP:'4-2-3-1', style:'Gegenpress', score:8.3, votes:612,  author:'AsymFM',        tags:['Inside Forward','Playmaking WB','B2B Playmaker'], ip:'Asymmetry: Inside Forward left, Winger right. Playmaking WB to create.', oop:'Double DM with Pressing and Screening to protect on the counter.' },
  { id:8, name:'3-5-2 Domination',       formation:'3-5-2',   formOOP:'5-3-2',   style:'Possession', score:8.1, votes:534,  author:'ThreeCBFan',    tags:['Overlapping CB','Box-to-Box','Target Forward'], ip:'Overlapping CBs pour la largeur. Double ST avec jeu de combinaisons.', oop:'5-3-2 with defensive WBs. Covering CBs.' },
]

const STYLE_COLORS = {
  Possession: '#26E676', Gegenpress: '#E74C3C', Counter: '#378ADD',
  Direct: '#FF6619', 'High Press': '#C2185B', 'Low Block': '#F1C40F', 'Tiki-Taka': '#26E676',
}

export default function CommunityView() {
  const setView = useStore(s => s.setView)
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState('score')
  const [selected, setSelected] = useState(null)

  const styles = ['all', 'Possession', 'Gegenpress', 'Counter', 'Direct', 'High Press']

  const filtered = TACTICS_DB
    .filter(t => filter === 'all' || t.style === filter)
    .sort((a, b) => sort === 'score' ? b.score - a.score : b.votes - a.votes)

  const scoreColor = (s) => s >= 9 ? '#26E676' : s >= 8 ? '#378ADD' : s >= 7 ? '#FF6619' : '#E74C3C'

  const sel = selected !== null ? TACTICS_DB.find(t => t.id === selected) : null

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden', gridColumn: '1 / -1' }}>
      {/* Main list */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{
          padding: '14px 20px', borderBottom: '0.5px solid rgba(255,255,255,0.08)',
          display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0,
          background: '#111820',
        }}>
          <button onClick={() => setView('home')} style={{
            padding: '4px 10px', borderRadius: 6, background: 'transparent',
            border: '0.5px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.6)',
            fontSize: 11, cursor: 'pointer',
          }}>◀ Accueil</button>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Classement communautaire</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>{TACTICS_DB.length} tactiques · FM26</div>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
            <button onClick={() => setView('builder')} style={{
              padding: '4px 12px', borderRadius: 6, background: '#26E676',
              border: 'none', color: '#0D1014', fontSize: 11, fontWeight: 700, cursor: 'pointer',
            }}>
              + Créer ma tactique
            </button>
          </div>
        </div>

        {/* Filters */}
        <div style={{
          padding: '10px 20px', borderBottom: '0.5px solid rgba(255,255,255,0.07)',
          display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0,
        }}>
          <div style={{ display: 'flex', gap: 5 }}>
            {styles.map(s => (
              <button key={s} onClick={() => setFilter(s)} style={{
                padding: '3px 10px', borderRadius: 20, fontSize: 10, cursor: 'pointer',
                background: filter === s ? (s === 'all' ? 'rgba(255,255,255,0.15)' : `${STYLE_COLORS[s]}22`) : 'transparent',
                border: filter === s ? `0.5px solid ${s === 'all' ? 'rgba(255,255,255,0.3)' : STYLE_COLORS[s]}` : '0.5px solid rgba(255,255,255,0.1)',
                color: filter === s ? (s === 'all' ? '#fff' : STYLE_COLORS[s]) : 'rgba(255,255,255,0.4)',
                fontWeight: filter === s ? 600 : 400,
              }}>
                {s === 'all' ? 'Tous' : s}
              </button>
            ))}
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 5, alignItems: 'center' }}>
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>Trier par</span>
            {['score', 'votes'].map(s => (
              <button key={s} onClick={() => setSort(s)} style={{
                padding: '3px 9px', borderRadius: 4, fontSize: 10, cursor: 'pointer',
                background: sort === s ? 'rgba(255,255,255,0.1)' : 'transparent',
                border: '0.5px solid rgba(255,255,255,0.1)',
                color: sort === s ? '#fff' : 'rgba(255,255,255,0.4)',
              }}>
                {s === 'score' ? '★ Score' : '👍 Votes'}
              </button>
            ))}
          </div>
        </div>

        {/* Table header */}
        <div style={{
          padding: '6px 20px', borderBottom: '0.5px solid rgba(255,255,255,0.07)',
          display: 'grid', gridTemplateColumns: '36px 1fr 90px 80px 80px 70px',
          gap: 8, fontSize: 9, color: 'rgba(255,255,255,0.3)',
          textTransform: 'uppercase', letterSpacing: '0.5px',
        }}>
          <div>#</div><div>Tactique</div><div>Formation</div><div>Style</div><div>Score</div><div>Votes</div>
        </div>

        {/* Rows */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {filtered.map((t, i) => {
            const rank = i + 1
            const isSelected = selected === t.id
            const rankColor = rank === 1 ? '#F1C40F' : rank === 2 ? '#d0d0d0' : rank === 3 ? '#E67E22' : 'rgba(255,255,255,0.3)'
            return (
              <div
                key={t.id}
                onClick={() => setSelected(isSelected ? null : t.id)}
                style={{
                  padding: '10px 20px',
                  display: 'grid', gridTemplateColumns: '36px 1fr 90px 80px 80px 70px',
                  gap: 8, alignItems: 'center', cursor: 'pointer',
                  borderBottom: '0.5px solid rgba(255,255,255,0.05)',
                  background: isSelected ? 'rgba(255,255,255,0.06)' : 'transparent',
                  borderLeft: isSelected ? `3px solid ${scoreColor(t.score)}` : '3px solid transparent',
                }}
                onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}
                onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'transparent' }}
              >
                <div style={{ fontSize: 13, fontWeight: 700, color: rankColor }}>
                  {rank <= 3 ? ['🥇','🥈','🥉'][rank-1] : rank}
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 500 }}>{t.name}</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginTop: 1 }}>
                    par @{t.author}
                  </div>
                </div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)' }}>
                  {t.formation} / {t.formOOP}
                </div>
                <div>
                  <span style={{
                    fontSize: 9, padding: '2px 7px', borderRadius: 3,
                    background: `${STYLE_COLORS[t.style] || '#888'}18`,
                    color: STYLE_COLORS[t.style] || '#888',
                    border: `0.5px solid ${STYLE_COLORS[t.style] || '#888'}44`,
                  }}>
                    {t.style}
                  </span>
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: scoreColor(t.score) }}>
                  {t.score.toFixed(1)}
                </div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
                  {t.votes.toLocaleString()}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Detail panel */}
      {sel && (
        <div style={{
          width: 320, flexShrink: 0,
          background: '#0f1419', borderLeft: '0.5px solid rgba(255,255,255,0.08)',
          overflowY: 'auto', padding: '16px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{sel.name}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 3 }}>par @{sel.author}</div>
            </div>
            <button onClick={() => setSelected(null)} style={{
              background: 'none', border: '0.5px solid rgba(255,255,255,0.1)',
              borderRadius: 4, width: 24, height: 24, cursor: 'pointer',
              fontSize: 12, color: 'rgba(255,255,255,0.4)',
            }}>✕</button>
          </div>

          {/* Score ring mini */}
          <div style={{
            display: 'flex', gap: 12, marginBottom: 16,
            background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: '12px 14px',
            border: '0.5px solid rgba(255,255,255,0.07)',
          }}>
            <div style={{ fontSize: 36, fontWeight: 800, color: scoreColor(sel.score), lineHeight: 1 }}>
              {sel.score.toFixed(1)}
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 500 }}>Score global</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>
                {sel.votes.toLocaleString()} votes
              </div>
              <div style={{ fontSize: 10, color: STYLE_COLORS[sel.style], marginTop: 2 }}>
                {sel.style}
              </div>
            </div>
          </div>

          {/* Formations */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
            <div style={{ background: 'rgba(38,230,118,0.07)', border: '0.5px solid rgba(38,230,118,0.2)', borderRadius: 8, padding: '8px 10px' }}>
              <div style={{ fontSize: 9, color: '#26E676', marginBottom: 3 }}>▲ IP</div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{sel.formation}</div>
            </div>
            <div style={{ background: 'rgba(55,138,221,0.07)', border: '0.5px solid rgba(55,138,221,0.2)', borderRadius: 8, padding: '8px 10px' }}>
              <div style={{ fontSize: 9, color: '#378ADD', marginBottom: 3 }}>▼ OOP</div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{sel.formOOP}</div>
            </div>
          </div>

          {/* Rôles clés */}
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>
            Rôles clés
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 14 }}>
            {sel.tags.map(tag => (
              <span key={tag} style={{
                fontSize: 9, padding: '3px 7px', borderRadius: 4,
                background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)',
                border: '0.5px solid rgba(255,255,255,0.1)',
              }}>
                {tag}
              </span>
            ))}
          </div>

          {/* Description IP */}
          <div style={{ fontSize: 10, color: '#26E676', marginBottom: 4, fontWeight: 600 }}>▲ In Possession</div>
          <div style={{
            fontSize: 11, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, marginBottom: 12,
            background: 'rgba(38,230,118,0.04)', borderRadius: 8, padding: '8px 10px',
            border: '0.5px solid rgba(38,230,118,0.1)',
          }}>
            {sel.ip}
          </div>

          {/* Description OOP */}
          <div style={{ fontSize: 10, color: '#378ADD', marginBottom: 4, fontWeight: 600 }}>▼ Out of Possession</div>
          <div style={{
            fontSize: 11, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, marginBottom: 16,
            background: 'rgba(55,138,221,0.04)', borderRadius: 8, padding: '8px 10px',
            border: '0.5px solid rgba(55,138,221,0.1)',
          }}>
            {sel.oop}
          </div>

          {/* Rate */}
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>
            Noter cette tactique
          </div>
          <div style={{ display: 'flex', gap: 4, marginBottom: 12 }}>
            {[1,2,3,4,5,6,7,8,9,10].map(n => (
              <button key={n} style={{
                flex: 1, padding: '5px 2px', borderRadius: 4, fontSize: 10,
                background: n <= Math.round(sel.score) ? 'rgba(38,230,118,0.2)' : 'rgba(255,255,255,0.05)',
                border: n <= Math.round(sel.score) ? '0.5px solid rgba(38,230,118,0.4)' : '0.5px solid rgba(255,255,255,0.08)',
                color: n <= Math.round(sel.score) ? '#26E676' : 'rgba(255,255,255,0.3)',
                cursor: 'pointer', fontWeight: n <= Math.round(sel.score) ? 700 : 400,
              }}>
                {n}
              </button>
            ))}
          </div>
          <button style={{
            width: '100%', padding: 9, borderRadius: 8, background: '#26E676',
            border: 'none', color: '#0D1014', fontSize: 12, fontWeight: 700, cursor: 'pointer',
          }}>
            Soumettre ma note
          </button>
        </div>
      )}
    </div>
  )
}
