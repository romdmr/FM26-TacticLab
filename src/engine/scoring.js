/**
 * TacticLab FM26 — Moteur d'analyse tactique v2
 *
 * Basé sur :
 * - Jonathan Wilson, "Inverting the Pyramid" (2013)
 * - Données FM26 officielles (rôles, attributs, styles)
 * - Logique footballistique : espace, pressing, équilibre structurel
 */

import { ROLE_PAIRS, ROLE_CONFLICTS, PRESSING_LOGIC } from '../data/tactical_theory.js'
import { PLAY_STYLES } from '../data/playstyles.js'
import { analyseTeamProfile } from './profile_scoring.js'

// ── Helpers ───────────────────────────────────────────────────────────────
const countT  = (p, t)    => p.filter(x => x.t === t).length
const hasIP   = (p, role) => p.some(x => x.rIP  === role)
const hasOOP  = (p, role) => p.some(x => x.rOOP === role)
const byType  = (p, t)    => p.filter(x => x.t === t)
const isLeft  = p => p.x < 35
const isRight = p => p.x > 65

// ── 1. STRUCTURE DÉFENSIVE ────────────────────────────────────────────────
// Wilson: "There is a need always for at least one [CB] who can pass the ball
// or advance with it into midfield."
function analyseDefense(pions) {
  const issues = [], strengths = []
  let score = 10

  const gk   = countT(pions, 'GK')
  const cbs  = countT(pions, 'CB')
  const fbs  = countT(pions, 'FB')
  const wbs  = countT(pions, 'WB')

  if (gk === 0) { score -= 4; issues.push('Pas de gardien — poste indispensable') }

  if (cbs < 2)       { score -= 2.5; issues.push(`${cbs} CB seulement — défense centrale trop vulnérable`) }
  else if (cbs === 2) strengths.push('Défense centrale à 2 CB — formation standard')
  else if (cbs === 3) strengths.push('Bloc à 3 CBs — base solide (3-5-2 / 3-4-3)')
  else if (cbs >= 4)  { score -= 1; issues.push('4 CBs ou plus — secteur offensif sacrifié') }

  // Stopper + Covering pair (Wilson: Nicholson/Ramsey model)
  const hasStopCover =
    (hasOOP(pions,'Stopping CB') && hasOOP(pions,'Covering CB')) ||
    (hasOOP(pions,'Stopping Wide CB') && hasOOP(pions,'Covering Wide CB'))
  if (hasStopCover) {
    strengths.push('Duo stopper/couvrant — modèle Nicholson/Ramsey (Wilson ch.8)')
  }

  // Largeur défensive
  if (fbs >= 2 || wbs >= 2 || (fbs + wbs) >= 2) {
    strengths.push('Couverture des deux flancs défensifs')
  } else {
    score -= 1.5
    issues.push('Flancs défensifs non couverts — latéraux manquants')
  }

  // Sweeper Keeper + ligne haute
  if (hasOOP(pions,'Sweeper Keeper')) {
    strengths.push('Sweeper Keeper — actif derrière la ligne haute')
  }

  return { score: Math.max(0, score), issues, strengths }
}

// ── 2. STRUCTURE DU MILIEU ─────────────────────────────────────────────────
function analyseMidfield(pions) {
  const issues = [], strengths = []
  let score = 10

  const dms  = countT(pions, 'DM')
  const cms  = countT(pions, 'CM')
  const mrls = countT(pions, 'MRL')
  const total = dms + cms + mrls

  if (total === 0) { score -= 3; issues.push('Aucun milieu — impossible de contrôler le jeu') }
  if (total > 6)   { score -= 1.5; issues.push(`${total} milieux — secteur offensif appauvri`) }

  if (dms === 0 && cms < 2) {
    score -= 1.5
    issues.push('Aucun écran défensif en milieu — espace libre entre défense et milieu')
  } else if (dms >= 1) {
    strengths.push(`${dms === 1 ? 'Un' : 'Double'} DM — protection centrale`)
  }

  // Half Back: Wilson ch.8 — drops between CBs to create triangle
  if (hasIP(pions,'Half Back')) {
    if (dms === 0) {
      score -= 1; issues.push('Half Back sans DM partenaire — pivot arrière exposé')
    } else {
      strengths.push('Half Back + DM — build-up à 3 derrière la ligne de milieu (Wilson ch.8)')
    }
  }

  // B2B needs anchor (Wilson: Pirlo/Gattuso archetype)
  const b2bs = pions.filter(p => p.rIP === 'Box-to-Box Mid (2DM)' || p.rIP === 'Box-to-Box Playmaker (2DM)')
  if (b2bs.length > 0) {
    const hasAnchor = pions.some(p =>
      ['Defensive Mid','Deep-Lying Playmaker','Half Back','Screening DM','Dropping DM'].includes(p.rIP)
    )
    if (hasAnchor) strengths.push('Box-to-Box + ancre — duo classique (Gattuso/Pirlo, Wilson ch.17)')
    else { score -= 1; issues.push('Box-to-Box sans ancre — transitions défensives non couvertes') }
  }

  if (mrls >= 2) strengths.push('Milieux larges des deux côtés — largeur assurée')
  else if (mrls === 1) { score -= 0.5; issues.push('Asymétrie large en milieu — un flanc sans couverture') }

  return { score: Math.max(0, score), issues, strengths }
}

// ── 3. PUISSANCE OFFENSIVE ─────────────────────────────────────────────────
// Wilson ch.13: "Simply to be a goalscorer is not enough; the best modern
// forwards have at least an element of universality."
function analyseAttack(pions, style) {
  const issues = [], strengths = []
  let score = 10

  const sts   = countT(pions, 'ST')
  const amcs  = countT(pions, 'AMC')
  const amrls = countT(pions, 'AMRL')
  const total = sts + amcs + amrls

  if (total === 0) { score -= 3; issues.push('Aucun attaquant ou milieu offensif') }
  if (sts === 0)   { score -= 1; issues.push('Aucun avant-centre — finition centrale manquante') }

  // False 9 (Wilson ch.13: Hidegkuti 1953 → modern interpretation)
  if (hasIP(pions,'False 9')) {
    const runners = pions.filter(p =>
      ['Inside Forward','Channel Mid','Channel Forward','Advanced Playmaker','Wide Forward'].includes(p.rIP)
    )
    if (runners.length >= 2) {
      strengths.push('False 9 + coureurs dans l\'axe — déséquilibre défensif (Wilson ch.13: Hidegkuti 1953)')
    } else {
      score -= 1.5
      issues.push('False 9 sans coureurs — les espaces créés ne sont pas exploités')
    }
  }

  // Poacher (Wilson ch.17: "sniffer center-forward has all but vanished")
  if (hasIP(pions,'Poacher')) {
    const creators = pions.filter(p =>
      ['Advanced Playmaker','Deep-Lying Playmaker','Midfield Playmaker',
       'Playmaking Winger','Playmaking Wing Back','Ball-Playing CB'].includes(p.rIP)
    )
    if (creators.length === 0) {
      score -= 1.5; issues.push('Poacher sans créateurs — les occasions ne seront pas générées')
    } else {
      strengths.push(`Poacher alimenté par ${creators.length} créateur(s)`)
    }
  }

  // Target Forward + crossers
  if (hasIP(pions,'Target Forward')) {
    const crossers = pions.filter(p =>
      ['Winger','Wide Mid','Playmaking Wing Back','Advanced Wing Back'].includes(p.rIP)
    )
    if (crossers.length >= 2) strengths.push('Target Forward + ailiers centreurs — jeu aérien offensif')
    else if (crossers.length === 0) { score -= 1; issues.push('Target Forward sans centreurs — avantage aérien non exploité') }
  }

  // Style-specific checks
  if (style === 'Route One' || style === 'Direct Counter-Attack') {
    if (!hasIP(pions,'Target Forward')) {
      score -= 1.5; issues.push(`Style ${style} sans Target Forward — les longs ballons n'ont pas de cible`)
    }
  }
  if (style === 'Fluid Counter-Attack' || style === 'Direct Counter-Attack') {
    const transPlayers = pions.filter(p =>
      ['Wide Forward','Channel Forward','Central Outlet CF','Wide Outlet Winger'].includes(p.rIP) ||
      ['Wide Outlet Winger','Central Outlet CF'].includes(p.rOOP)
    )
    if (transPlayers.length < 2) {
      score -= 1.5; issues.push(`${style} sans joueurs de transition — les contre-attaques seront étouffées`)
    } else {
      strengths.push(`${transPlayers.length} joueurs de transition — idéal pour le ${style}`)
    }
  }

  // Asymmetry bonus (Inside Forward + Winger)
  if (pions.some(p => p.rIP === 'Inside Forward') && pions.some(p => p.rIP === 'Winger')) {
    strengths.push('Asymétrie offensive — Inside Forward + Winger, défenses imprévisibles')
  }

  return { score: Math.max(0, score), issues, strengths }
}

// ── 4. COHÉRENCE IP ───────────────────────────────────────────────────────
// Wilson: "Possession football is the thing, not kick and rush" — Buckingham
function analyseIPCohesion(pions, tiIP, style) {
  const issues = [], strengths = []
  let score = 10

  const playmakers = pions.filter(p =>
    ['Deep-Lying Playmaker','Advanced Playmaker','Ball-Playing GK','Ball-Playing CB',
     'Midfield Playmaker','Playmaking Winger','Playmaking Wing Back'].includes(p.rIP)
  )

  // Styles possession-based
  if (['Control Possession','Tiki-Taka','Vertical Tiki-Taka'].includes(style)) {
    if (playmakers.length < 2) {
      score -= 2; issues.push(`${style} avec ${playmakers.length} playmaker(s) — circuit court insuffisant`)
    } else {
      strengths.push(`${playmakers.length} playmakers — style ${style} bien alimenté`)
    }
    if (hasIP(pions,'No-Nonsense GK')) {
      score -= 1; issues.push(`No-Nonsense GK en ${style} — coupe le circuit de build-up`)
    } else if (hasIP(pions,'Ball-Playing GK')) {
      strengths.push('Ball-Playing GK — GK intégré dans la construction (Guardiola)')
    }
    const tempo = tiIP?.overview?.tempo
    if (tempo === 'Much Higher' || tempo === 'Higher') {
      score -= 1; issues.push(`Tempo élevé en ${style} — contradictoire avec la conservation`)
    }
  }

  // Gegenpress / High Press
  if (['Gegenpress','Wing Play'].includes(style)) {
    const pressers = pions.filter(p =>
      ['Box-to-Box Mid (2DM)','Pressing CM','Channel Mid','Inside Forward','Winger'].includes(p.rIP)
    )
    if (pressers.length < 3) {
      score -= 1.5; issues.push(`${style} avec ${pressers.length} profil(s) énergique(s) — pressing inefficace`)
    } else {
      strengths.push(`${pressers.length} joueurs adaptés au ${style}`)
    }
  }

  // Low Block / Park the Bus / Catenaccio
  if (['Park the Bus','Catenaccio','Direct Counter-Attack'].includes(style)) {
    const defRoles = pions.filter(p =>
      ['Holding FB','Holding WB','Covering CB','Screening DM','Dropping DM'].includes(p.rOOP)
    )
    if (defRoles.length < 3) {
      score -= 1.5; issues.push(`${style} avec ${defRoles.length} rôle(s) défensif(s) OOP — bloc poreux`)
    } else {
      strengths.push(`${defRoles.length} rôles défensifs OOP — ${style} structuré`)
    }
  }

  // Free Role abuse (Wilson ch.17: "being beautiful within the system")
  const freeRoles = pions.filter(p => p.rIP === 'Free Role')
  if (freeRoles.length >= 2) {
    score -= 2.5; issues.push('Deux Free Role — déstructuration totale (Wilson ch.17: il faut un système)')
  } else if (freeRoles.length === 1) {
    const disciplined = pions.some(p =>
      ['Defensive Mid','Half Back','Screening DM','Central Mid','Covering CB'].includes(p.rIP)
    )
    if (!disciplined) { score -= 1; issues.push('Free Role sans structure autour — déséquilibre') }
    else strengths.push('Free Role cadré par des rôles disciplinés — utilisation optimale')
  }

  // Inside WB needs wide compensation
  const insideWBs = pions.filter(p => p.rIP === 'Inside Wing Back' || p.rIP === 'Inside Full Back')
  if (insideWBs.length > 0) {
    const hasWide = pions.some(p =>
      !insideWBs.includes(p) && ['Winger','Wide Mid','Wide Forward'].includes(p.rIP)
    )
    if (!hasWide) { score -= 1; issues.push('Inside WB/FB sans ailier — manque de largeur offensive') }
    else strengths.push('Inside WB compensé par ailiers larges — surcharge centrale')
  }

  // Check TI coherence with style preset
  const preset = PLAY_STYLES[style]
  if (preset?.tiIP) {
    let mismatches = 0, total = 0
    Object.entries(preset.tiIP).forEach(([key, val]) => {
      total++
      const sectionMap = {
        passingDirectness:'overview', tempo:'overview', attackingWidth:'overview',
        attackingTransition:'overview', creativeFreedom:'overview', timeWasting:'overview',
        setpieces:'overview', dribbling:'finalThird', patience:'finalThird',
        shotsFromDist:'finalThird', crossingStyle:'finalThird', overlap:'progression',
        underlap:'progression', progressThrough:'progression', passReception:'progression',
        buildupStrategy:'buildup', goalKicks:'buildup', gkSpeed:'buildup', gkTarget:'buildup',
      }
      const sec = sectionMap[key] || 'overview'
      const userVal = tiIP?.[sec]?.[key]
      if (userVal && userVal !== val) mismatches++
    })
    if (total > 0) {
      const pct = mismatches / total
      if (pct < 0.25) strengths.push(`TI alignées avec le style ${style} (${total - mismatches}/${total})`)
      else if (pct > 0.5) { score -= 1; issues.push(`TI peu cohérentes avec ${style} — ${mismatches} contradictions`) }
    }
  }

  return { score: Math.max(0, score), issues, strengths }
}

// ── 5. BLOC DÉFENSIF OOP ──────────────────────────────────────────────────
// Wilson ch.12: "Pressing was the key" — but requires correct structure
function analyseOOPBlock(pions, tiOOP) {
  const issues = [], strengths = []
  let score = 10

  const lineEng   = tiOOP?.overview?.lineEngagement || 'Mid Block'
  const defLine   = tiOOP?.overview?.defensiveLine  || 'Standard'
  const isHighLine = ['Higher','Much Higher'].includes(defLine)
  const isLowLine  = ['Lower','Much Lower'].includes(defLine)

  // Sweeper Keeper logic (Wilson: Michels/Ajax — high line requires aggressive GK)
  if (hasOOP(pions,'Sweeper Keeper')) {
    if (isHighLine) strengths.push('Sweeper Keeper + ligne haute — couverture systémique (Ajax 1972, Wilson ch.12)')
    else { score -= 1.5; issues.push('Sweeper Keeper sans ligne haute — sorties inutilement risquées') }
  } else if (isHighLine) {
    score -= 2; issues.push('Ligne haute sans Sweeper Keeper — les ballons dans le dos seront fatals')
  }

  // High Press requirements (Wilson ch.12: pressing needs whole team)
  if (lineEng === 'High Press') {
    if (!hasOOP(pions,'Tracking CF')) {
      score -= 1.5; issues.push('High Press sans Tracking CF — la presse ne débute pas dès la première ligne')
    } else {
      strengths.push('Tracking CF + High Press — presse initiée dès l\'attaquant (Wilson ch.12)')
    }
    const hasPressScreen = pions.some(p =>
      ['Pressing DM (2DM)','Screening DM','Dropping DM'].includes(p.rOOP)
    )
    if (!hasPressScreen) {
      score -= 1; issues.push('High Press sans DM de couverture — milieu exposé aux sorties rapides')
    }
    const triggerPress = tiOOP?.overview?.triggerPress || 'Standard'
    if (!['More Often','Much More Often'].includes(triggerPress)) {
      score -= 0.5; issues.push('High Press avec Trigger Press trop faible — presse inconstante')
    }
  }

  // Low Block (Catenaccio-style)
  if (lineEng === 'Low Block') {
    const trackingWingers = pions.filter(p =>
      ['Tracking Winger','Tracking Wide Mid','Holding WB','Holding FB'].includes(p.rOOP)
    )
    if (trackingWingers.length < 2) {
      score -= 1.5; issues.push('Low Block sans ailiers/WBs défensifs — flancs exposés')
    } else {
      strengths.push(`Low Block + ${trackingWingers.length} défenseurs latéraux — bloc compact (Catenaccio)`)
    }
    const trigger = tiOOP?.overview?.triggerPress || 'Standard'
    if (['More Often','Much More Often'].includes(trigger)) {
      score -= 1; issues.push('Trigger Press élevé en Low Block — contradiction défensive')
    }
  }

  // Pressing WBs need cover
  if (pions.some(p => p.rOOP === 'Pressing WB' || p.rOOP === 'Pressing FB')) {
    const hasCover = pions.some(p =>
      ['Wide Covering DM (2DM)','Covering CB','Wide Centre Back (3CB)'].includes(p.rOOP)
    )
    if (!hasCover) { score -= 1; issues.push('Pressing WB/FB sans couverture latérale') }
    else strengths.push('Pressing WB/FB avec couverture — pression latérale sécurisée')
  }

  // Dropping DM in 4-back = redundant
  if (hasOOP(pions,'Dropping DM')) {
    if (countT(pions,'CB') >= 3) { score -= 0.5; issues.push('Dropping DM dans un système à 3 CBs — redondant') }
    else strengths.push('Dropping DM — forme un bloc de 3 défensif sous pression')
  }

  return { score: Math.max(0, score), issues, strengths }
}

// ── 6. SYNERGIES & CONFLITS (ROLE_PAIRS + ROLE_CONFLICTS) ─────────────────
function analyseSynergies(pions) {
  const issues = [], strengths = []
  let score = 10

  // Check positive pairs
  ROLE_PAIRS.forEach(pair => {
    const hasA = hasIP(pions, pair.a) || hasOOP(pions, pair.a)
    const hasB = hasIP(pions, pair.b) || hasOOP(pions, pair.b)
    if (hasA && hasB) {
      strengths.push(pair.desc)
      score = Math.min(10, score + pair.score * 0.15)
    }
  })

  // Check conflicts
  ROLE_CONFLICTS.forEach(conflict => {
    if (conflict.roles) {
      // Pair conflict
      const allPresent = conflict.roles.every(r =>
        pions.some(p => p.rIP === r || p.rOOP === r)
      )
      if (allPresent) {
        issues.push(conflict.desc)
        score -= conflict.penalty
      }
    } else if (conflict.trigger) {
      // Trigger + missing
      const hasTrigger = hasIP(pions, conflict.trigger)
      if (hasTrigger && conflict.missing) {
        const hasAny = conflict.missing.some(r => pions.some(p => p.rIP === r))
        if (!hasAny) {
          issues.push(conflict.desc)
          score -= conflict.penalty
        }
      }
    }
  })

  // Additional FM26-specific synergies
  if (hasIP(pions,'Ball-Playing GK') && hasIP(pions,'Ball-Playing CB') && hasIP(pions,'Deep-Lying Playmaker')) {
    strengths.push('Build-up à 3 phases GK→CB→DLP — circuit possession total (Guardiola/Pep)')
    score = Math.min(10, score + 0.5)
  }
  if (hasIP(pions,'Channel Mid') && hasIP(pions,'Inside Winger')) {
    strengths.push('Channel Mid + Inside Winger — exploitation double des demi-espaces')
    score = Math.min(10, score + 0.3)
  }
  if (hasOOP(pions,'Sweeper Keeper') && hasOOP(pions,'Covering CB')) {
    strengths.push('Sweeper Keeper + Covering CB — profondeur défensive sécurisée')
    score = Math.min(10, score + 0.2)
  }
  // Wide CB pair needs WBs (Wilson: 3-back needs wing-backs)
  const hasWideCB = hasIP(pions,'Wide CB (3CB)') || hasIP(pions,'Overlapping CB (3CB)')
  if (hasWideCB && countT(pions,'WB') >= 1) {
    strengths.push('Wide CB + WBs — triangle défensif-offensif dans le système à 3 (Wilson ch.16)')
    score = Math.min(10, score + 0.3)
  }

  return { score: Math.max(0, score), issues, strengths }
}

// ── SCORE GLOBAL ──────────────────────────────────────────────────────────
export function computeGlobalScore(pionsIP, pionsOOP, tiIP, tiOOP, style, teamProfile = 'top') {
  const allPions = [...pionsIP, ...pionsOOP]

  const def  = analyseDefense(allPions)
  const mid  = analyseMidfield(allPions)
  const att  = analyseAttack(allPions, style)
  const ip   = analyseIPCohesion(allPions, tiIP, style)
  const oop  = analyseOOPBlock(allPions, tiOOP)
  const syn  = analyseSynergies(allPions)
  const prof = analyseTeamProfile(allPions, style, teamProfile)

  // Profile has significant weight — it contextualises everything else
  const W = { defense: 0.18, midfield: 0.13, attack: 0.13, ip: 0.18, oop: 0.18, synergies: 0.09, profile: 0.11 }
  const global = Math.round(
    (def.score  * W.defense   +
     mid.score  * W.midfield  +
     att.score  * W.attack    +
     ip.score   * W.ip        +
     oop.score  * W.oop       +
     syn.score  * W.synergies +
     prof.score * W.profile) * 10
  ) / 10

  return {
    global,
    dimensions: { defense: def, midfield: mid, attack: att, ip, oop, synergies: syn, profile: prof },
    allIssues:    [...def.issues, ...mid.issues, ...att.issues, ...ip.issues, ...oop.issues, ...syn.issues, ...prof.issues],
    allStrengths: [...def.strengths,...mid.strengths,...att.strengths,...ip.strengths,...oop.strengths,...syn.strengths,...prof.strengths],
    profileAdvice: prof.advice,
    profileData:   prof.profile,
  }
}

// ── RECOMMANDATIONS TEXTUELLES ────────────────────────────────────────────
export function generateRecommendations(result, pionsIP, pionsOOP, tiOOP, style, teamProfile = 'top') {
  const recs = []
  const { global, dimensions: d } = result
  const allPions = [...pionsIP, ...pionsOOP]

  // Verdict global
  if (global >= 8.5)      recs.push({ type: 'success', text: `Tactique très cohérente (${global}/10). Les interactions entre lignes sont solides.` })
  else if (global >= 7.0) recs.push({ type: 'info',    text: `Bonne base tactique (${global}/10). Des ajustements amélioreront la cohérence.` })
  else if (global >= 5.0) recs.push({ type: 'warning', text: `Tactique déséquilibrée (${global}/10). Plusieurs incohérences structurelles.` })
  else                    recs.push({ type: 'danger',  text: `Tactique problématique (${global}/10). Corrections majeures nécessaires.` })

  // Dimension la plus faible
  const dims = ['defense','midfield','attack','ip','oop'].map(k => ({ k, s: d[k].score }))
  const worst = dims.sort((a,b) => a.s - b.s)[0]
  const dimLabels = { defense:'défense', midfield:'milieu', attack:'attaque', ip:'cohérence IP', oop:'bloc OOP' }
  if (worst.s < 6) {
    recs.push({ type:'warning', text:`Point critique : ${dimLabels[worst.k]} (${worst.s.toFixed(1)}/10). Corriger en priorité.` })
  }

  // Recommandations contextuelles Wilson-based
  const lineEng = tiOOP?.overview?.lineEngagement || 'Mid Block'

  if (['Control Possession','Tiki-Taka'].includes(style) && !allPions.some(p => p.rIP === 'Ball-Playing GK')) {
    recs.push({ type:'info', text: 'Pour la possession : un Ball-Playing GK intègrerait le gardien dans la construction (Guardiola, Wilson ch.17).' })
  }
  if (style === 'Gegenpress' && !allPions.some(p => p.rOOP === 'Tracking CF')) {
    recs.push({ type:'info', text: 'Gegenpress : un Tracking CF est indispensable pour initier la presse dès la première ligne (Wilson ch.12).' })
  }
  if (lineEng === 'High Press' && !allPions.some(p => p.rOOP === 'Sweeper Keeper')) {
    recs.push({ type:'warning', text: 'High Press avec ligne haute : sans Sweeper Keeper, les ballons dans le dos seront problématiques (Wilson ch.12 : Ajax 1972).' })
  }
  if (['Fluid Counter-Attack','Direct Counter-Attack'].includes(style) && lineEng !== 'Low Block') {
    recs.push({ type:'info', text: 'Counter-Attack : un Low Block OOP permet de mieux absorber avant de transitionner rapidement.' })
  }
  if (countT(allPions,'DM') === 0 && countT(allPions,'CM') >= 2) {
    recs.push({ type:'info', text: 'Sans DM, utiliser un rôle OOP Screening CM pour protéger la défense (Wilson : midfielders multi-fonctionnels).' })
  }
  // Wilson: "It is very rare to find a top side that plays with two stopper central defenders."
  const cbsOOP = allPions.filter(p => p.t === 'CB')
  const allStoppers = cbsOOP.every(p => p.rOOP === 'Stopping CB')
  if (cbsOOP.length >= 2 && allStoppers) {
    recs.push({ type:'info', text: 'Deux Stopping CBs : Wilson note qu\'il est rare de voir une grande équipe sans au moins un CB couvrant. Envisager Stopping + Covering.' })
  }

  return recs
}
