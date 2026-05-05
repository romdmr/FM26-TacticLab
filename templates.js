import { useRef } from 'react'
import { useStore } from '../store/useTacticStore'
import { TEAM_PROFILES } from '../data/teamprofiles'

export default function ExportButton() {
  const name    = useStore(s => s.name)
  const style   = useStore(s => s.style)
  const formIP  = useStore(s => s.formIP)
  const formOOP = useStore(s => s.formOOP)
  const teamProfile = useStore(s => s.teamProfile)
  const pionsIP  = useStore(s => s.pionsIP)
  const pionsOOP = useStore(s => s.pionsOOP)

  const profile = TEAM_PROFILES[teamProfile] || TEAM_PROFILES.top

  const handleExport = async () => {
    const html2canvas = (await import('html2canvas')).default

    // Trouver le canvas du terrain actif dans le DOM
    const pitchEl = document.querySelector('[data-export-pitch]')
    if (!pitchEl) return

    try {
      const canvas = await html2canvas(pitchEl, {
        backgroundColor: '#0d2410',
        scale: 2,
        useCORS: true,
        logging: false,
      })

      // Créer le canvas final avec header et footer
      const finalCanvas  = document.createElement('canvas')
      const paddingH     = 40
      const headerHeight = 90
      const footerHeight = 40
      finalCanvas.width  = canvas.width + paddingH * 2
      finalCanvas.height = canvas.height + headerHeight + footerHeight

      const ctx = finalCanvas.getContext('2d')

      // Background
      ctx.fillStyle = '#0D1014'
      ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height)

      // Header gradient
      const grad = ctx.createLinearGradient(0, 0, finalCanvas.width, 0)
      grad.addColorStop(0, `${profile.color}22`)
      grad.addColorStop(1, 'transparent')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, finalCanvas.width, headerHeight)

      // Tactic name
      ctx.fillStyle = '#ffffff'
      ctx.font      = 'bold 28px Inter, sans-serif'
      ctx.fillText(name, paddingH, 42)

      // Meta line
      ctx.fillStyle = 'rgba(255,255,255,0.5)'
      ctx.font      = '14px Inter, sans-serif'
      ctx.fillText(`${profile.emoji} ${profile.label}  ·  ▲ ${formIP}  ▼ ${formOOP}  ·  ⚡ ${style}`, paddingH, 68)

      // Pitch image
      ctx.drawImage(canvas, paddingH, headerHeight, canvas.width, canvas.height)

      // Footer
      ctx.fillStyle = 'rgba(255,255,255,0.2)'
      ctx.font      = '11px Inter, sans-serif'
      ctx.fillText('TacticLab FM26', paddingH, finalCanvas.height - 14)
      ctx.textAlign = 'right'
      ctx.fillText(new Date().toLocaleDateString('fr-FR'), finalCanvas.width - paddingH, finalCanvas.height - 14)

      // Download
      const link   = document.createElement('a')
      link.download = `${name.replace(/\s+/g,'_')}_FM26.png`
      link.href     = finalCanvas.toDataURL('image/png')
      link.click()
    } catch (err) {
      console.error('Export failed:', err)
    }
  }

  return (
    <button onClick={handleExport} style={{
      padding:'4px 11px', borderRadius:6, fontSize:11, fontWeight:600,
      cursor:'pointer', border:'none',
      background:'rgba(255,255,255,0.07)',
      color:'rgba(255,255,255,0.6)',
      outline:'0.5px solid rgba(255,255,255,0.15)',
    }}>
      ↓ Export
    </button>
  )
}
