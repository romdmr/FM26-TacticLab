import { useState } from 'react'
import { useStore } from '../store/useTacticStore'
import { TACTIC_TEMPLATES } from '../data/templates'
import { TEAM_PROFILES } from '../data/teamprofiles'

// ── Mini terrain SVG ───────────────────────────────────────────────────────
function MiniPitch({ pions, color }) {
  const POS_COLORS = {
    GK: '#9B59B6', CB: '#534AB7', FB: '#378ADD', WB: '#378ADD',
    DM: '#E67E22', CM: '#26E676', MRL: '#26E676', AMC: '#FF6619',
    AMRL: '#FF6619', ST: '#E74C3C',
  }
  return (
    <div style={{ position: 'relative', width: '100%', paddingBottom: '140%', borderRadius: 6, overflow: 'hidden' }}>
      {/* Pitch background */}
      <svg viewBox="0 0 100 140" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <rect width="100" height="140" fill="#0d2410" />
        <rect x="5" y="4" width="90" height="132" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
        <line x1="5" y1="70" x2="95" y2="70" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8" />
        <circle cx="50" cy="70" r="14" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.8" />
        <rect x="30" y="4" width="40" height="18" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.6" />
        <rect x="30" y="118" width="40" height="18" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.6" />
      </svg>
      {/* Pions */}
      {pions && pions.map((p, i) => {
        const c = POS_COLORS[p.t] || '#555'
        // Map y from pitch (0-100) to mini pitch (4-136 = top to bottom)
        const py = 4 + (p.y / 100) * 132
        const px = p.x
        return (
          <div key={i} style={{
            position: 'absolute',
            left: `${px}%`, top: `${py * 100 / 140}%`,
            transform: 'translate(-50%,-50%)',
            width: 8, height: 8, borderRadius: '50%',
            background: c,
            border: '1px solid rgba(255,255,255,0.3)',
            zIndex: 2,
          }} />
        )
      })}
      {/* Color overlay */}
      <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, ${color}18 0%, transparent 60%)`, pointerEvents: 'none' }} />
    </div>
  )
}

// ── Template card ─────────────────────────────────────────────────────────
function TemplateCard({ tpl, onLoad }) {
  const [hovered, setHovered] = useState(false)
  const profile = TEAM_PROFILES[tpl.teamProfile]
  const scoreColor = tpl.score >= 9 ? '#26E676' : tpl.score >= 8.5 ? '#378ADD' : '#FF6619'

  return (
    <div
      onClick={onLoad}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
        border: `0.5px solid ${hovered ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.08)'}`,
        borderTop: `2px solid ${tpl.color}`,
        borderRadius: 10, cursor: 'pointer',
        transition: 'all 0.15s', overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div style={{ padding: '14px 14px 10px', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 2, letterSpacing: '-0.2px' }}>
              {tpl.name}
            </div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>
              {tpl.subtitle}
            </div>
          </div>
          {/* Score */}
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: scoreColor, lineHeight: 1 }}>
              {tpl.score.toFixed(1)}
            </div>
            <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.3)', marginTop: 1 }}>/10</div>
          </div>
        </div>

        {/* Meta row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
          <span style={{
            fontSize: 9, padding: '2px 7px', borderRadius: 4, fontWeight: 600,
            background: profile?.bg, color: profile?.color, border: `0.5px solid ${profile?.border}`,
          }}>
            {profile?.emoji} {profile?.label}
          </span>
          <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', padding: '2px 7px', borderRadius: 4, background: 'rgba(255,255,255,0.05)', border: '0.5px solid rgba(255,255,255,0.08)' }}>
            {tpl.formIP}
          </span>
          <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)' }}>⚡ {tpl.style}</span>
        </div>

        {/* Description */}
        <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, marginBottom: 10 }}>
          {tpl.description}
        </div>

        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, marginBottom: 10 }}>
          {tpl.tags.map(tag => (
            <span key={tag} style={{
              fontSize: 9, padding: '2px 6px', borderRadius: 3,
              background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)',
              border: '0.5px solid rgba(255,255,255,0.08)',
            }}>
              {tag}
            </span>
          ))}
        </div>

        {/* Wilson quote */}
        {tpl.reference && (
          <div style={{
            fontSize: 9, color: 'rgba(255,255,255,0.25)', fontStyle: 'italic',
            lineHeight: 1.5, borderLeft: `2px solid ${tpl.color}44`, paddingLeft: 7,
          }}>
            {tpl.reference}
          </div>
        )}
      </div>

      {/* Mini pitch + CTA */}
      <div style={{ display: 'flex', gap: 10, padding: '10px 14px 14px', alignItems: 'flex-end' }}>
        <div style={{ width: 70, flexShrink: 0 }}>
          <MiniPitch pions={tpl.pionsIP} color={tpl.color} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', marginBottom: 6 }}>
            {tpl.pionsIP?.length} pions · Rôles IP/OOP configurés · TI incluses
          </div>
          <div style={{
            padding: '6px 14px', borderRadius: 6, textAlign: 'center',
            background: hovered ? tpl.color : 'rgba(255,255,255,0.07)',
            color: hovered ? '#fff' : 'rgba(255,255,255,0.5)',
            fontSize: 11, fontWeight: 600,
            border: `0.5px solid ${hovered ? tpl.color : 'rgba(255,255,255,0.1)'}`,
            transition: 'all 0.15s',
          }}>
            {hovered ? '→ Charger dans le builder' : 'Charger la tactique'}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Profile filter ─────────────────────────────────────────────────────────
function ProfileFilter({ active, onChange }) {
  const filters = [
    { key: 'all', label: 'Toutes', emoji: '🏆' },
    ...Object.values(TEAM_PROFILES).map(p => ({ key: p.key, label: p.label, emoji: p.emoji, color: p.color })),
  ]
  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
      {filters.map(f => (
        <button
          key={f.key}
          onClick={() => onChange(f.key)}
          style={{
            padding: '4px 12px', borderRadius: 20, fontSize: 11, cursor: 'pointer',
            border: '0.5px solid',
            borderColor: active === f.key
              ? (f.color || 'rgba(255,255,255,0.5)')
              : 'rgba(255,255,255,0.1)',
            background: active === f.key
              ? (f.color ? `${f.color}18` : 'rgba(255,255,255,0.08)')
              : 'transparent',
            color: active === f.key
              ? (f.color || '#fff')
              : 'rgba(255,255,255,0.4)',
            fontWeight: active === f.key ? 600 : 400,
          }}
        >
          {f.emoji} {f.label}
        </button>
      ))}
    </div>
  )
}

// ── Main HomeView ──────────────────────────────────────────────────────────
export default function HomeView() {
  const setView        = useStore(s => s.setView)
  const loadTemplate   = useStore(s => s.loadTemplate)
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all'
    ? TACTIC_TEMPLATES
    : TACTIC_TEMPLATES.filter(t => t.teamProfile === filter)

  return (
    <div style={{ overflowY: 'auto', height: '100%' }}>

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <div style={{
        padding: '40px 60px 36px',
        borderBottom: '0.5px solid rgba(255,255,255,0.07)',
        background: 'linear-gradient(135deg, rgba(38,230,118,0.06) 0%, transparent 60%)',
      }}>
        <div style={{ maxWidth: 700 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(38,230,118,0.1)', border: '0.5px solid rgba(38,230,118,0.3)',
            borderRadius: 20, padding: '3px 10px', fontSize: 10, color: '#26E676',
            marginBottom: 16, fontWeight: 600,
          }}>
            ⚽ Football Manager 26 · Basé sur Inverting the Pyramid
          </div>

          <h1 style={{ fontSize: 40, fontWeight: 800, lineHeight: 1.1, margin: '0 0 14px', letterSpacing: '-1px' }}>
            Crée.<br />
            <span style={{ color: '#26E676' }}>Analyse.</span>{' '}
            <span style={{ color: '#FF6619' }}>Domine.</span>
          </h1>

          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, margin: '0 0 24px', maxWidth: 520 }}>
            Builder FM26 avec rôles IP/OOP officiels, Team Instructions complètes
            et analyse tactique sur 7 dimensions selon la théorie de Jonathan Wilson.
          </p>

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={() => setView('builder')}
              style={{ padding: '9px 22px', borderRadius: 8, background: '#26E676', border: 'none', color: '#0D1014', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
            >
              Créer une tactique →
            </button>
            <button
              onClick={() => setView('community')}
              style={{ padding: '9px 22px', borderRadius: 8, background: 'transparent', border: '0.5px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.7)', fontSize: 13, cursor: 'pointer' }}
            >
              Voir le classement
            </button>
          </div>
        </div>
      </div>

      {/* ── Stats ──────────────────────────────────────────────────── */}
      <div style={{ padding: '20px 60px', borderBottom: '0.5px solid rgba(255,255,255,0.07)' }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {[
            { v: '10',  l: 'Types de postes',     c: '#26E676' },
            { v: '80+', l: 'FM26 IP/OOP Roles',   c: '#378ADD' },
            { v: '7',   l: 'Scored Dimensions',  c: '#FF6619' },
            { v: '10',  l: 'Styles FM26 officiels',c: '#C2185B' },
            { v: '4',   l: 'Profils d\'team',   c: '#F1C40F' },
          ].map(s => (
            <div key={s.l} style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.07)', borderRadius: 8, padding: '10px 18px', textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: s.c, lineHeight: 1 }}>{s.v}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 3 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Tactiques de référence ──────────────────────────────────── */}
      <div style={{ padding: '28px 60px 48px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 4 }}>
              Tactiques de référence
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
              7 systèmes historiques — rôles IP/OOP, TI et profil préconfigurés. Clique pour charger.
            </div>
          </div>
          <ProfileFilter active={filter} onChange={setFilter} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 14, maxWidth: 1100 }}>
          {filtered.map(tpl => (
            <TemplateCard
              key={tpl.id}
              tpl={tpl}
              onLoad={() => loadTemplate(tpl)}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, padding: '40px 0', textAlign: 'center' }}>
            Aucune tactique pour ce profil.
          </div>
        )}
      </div>

      {/* ── Features ───────────────────────────────────────────────── */}
      <div style={{ padding: '0 60px 48px', borderTop: '0.5px solid rgba(255,255,255,0.07)' }}>
        <div style={{ paddingTop: 28, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18, maxWidth: 900 }}>
          {[
            { icon: '⚽', title: 'Builder dual IP/OOP', desc: 'Fixed positions with smart snap. Each piece locks to its zone and shows FM26 roles. Drag to change position.' },
            { icon: '⚙', title: 'Team Instructions FM26', desc: '8 complete IP/OOP panels with all official TIs. Overlap/Underlap mutually exclusive per side.' },
            { icon: '★', title: 'Analyse 7 dimensions', desc: 'Defence, midfield, attack, IP coherence, OOP solidity, synergies, profile fit. Based on official FM26 data.'' },
          ].map((f, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '16px 18px' }}>
              <div style={{ fontSize: 18, marginBottom: 8 }}>{f.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 5 }}>{f.title}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', lineHeight: 1.65 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
