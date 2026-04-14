/**
 * TacticLab FM26 — Moteur d'analyse tactique v3
 *
 * Sources :
 * ─ FM26 officiel : rôles IP/OOP, styles de jeu, TI (Sports Interactive)
 * ─ sortitoutsi.net : attributs par rôle FM26
 * ─ FM-Arena : données empiriques sur 1.4M+ matchs FM26
 *   → double DM OOP supérieur, formations larges + pressing = méta
 *   → position lors de la récupération du ballon cruciale (ZaZ)
 * ─ Principes footballistiques universels (agnostiques du jeu)
 *
 * NOTE : Les leçons FMScout TDW (Piotr Sebastian, 2017-2021) décrivent
 * l'ANCIEN système FM avec duties (Defend/Support/Attack) et rôles
 * aujourd'hui disparus (Regista, Libero, Mezzala, etc.).
 * Ces leçons ne sont PAS appliquées — leurs principes généraux valides
 * sont reformulés dans le contexte FM26 IP/OOP.
 */

import { ROLE_PAIRS, ROLE_CONFLICTS } from '../data/tactical_theory.js'
import { PLAY_STYLES } from '../data/playstyles.js'
import { analyseTeamProfile } from './profile_scoring.js'

// ── Helpers ───────────────────────────────────────────────────────────────
const countT  = (p, t)    => p.filter(x => x.t === t).length
const hasIP   = (p, role) => p.some(x => x.rIP  === role)
const hasOOP  = (p, role) => p.some(x => x.rOOP === role)

// ── Validation structurelle ───────────────────────────────────────────────
function validateStructure(pionsIP, pionsOOP) {
  const issues = []
  if (!pionsIP.some(p => p.t === 'GK'))  issues.push('IP: no goalkeeper')
  if (!pionsOOP.some(p => p.t === 'GK')) issues.push('OOP: no goalkeeper')
  const ipDef  = pionsIP.filter(p  => ['CB','FB','WB'].includes(p.t)).length
  const oopDef = pionsOOP.filter(p => ['CB','FB','WB'].includes(p.t)).length
  if (ipDef < 2)  issues.push(`IP: ${ipDef} defender(s) — minimum 2 required`)
  if (oopDef < 2) issues.push(`OOP: ${oopDef} defender(s) — minimum 2 required`)
  if (pionsIP.length  !== 11) issues.push(`IP: ${pionsIP.length} players instead of 11`)
  if (pionsOOP.length !== 11) issues.push(`OOP: ${pionsOOP.length} players instead of 11`)
  return issues
}

function computeStructuralPenalty(issues) {
  return issues.length * 2.5
}

// ── 1. BLOC DÉFENSIF ──────────────────────────────────────────────────────
// Sources : principes universels + FM26 officiel (rôles CB, GK, WB)
function analyseDefense(pions) {
  const issues = [], strengths = []
  let score = 10

  const gk  = countT(pions, 'GK')
  const cbs = countT(pions, 'CB')
  const fbs = countT(pions, 'FB')
  const wbs = countT(pions, 'WB')

  // GK
  if (gk === 0) { score -= 6; issues.push('No goalkeeper — mandatory position') }
  else if (gk > 1) { score -= 3; issues.push(`${gk} goalkeepers at the same time — impossible`) }

  // CBs
  if (cbs < 2)       { score -= 2.5; issues.push(`Only ${cbs} CB(s) — central defence too vulnerable`) }
  else if (cbs === 2) strengths.push('2-CB block — standard central defence')
  else if (cbs === 3) strengths.push('3-CB block — reinforced central defence')
  else if (cbs >= 4)  { score -= 1; issues.push('4 CBs or more — offensive sector sacrificed') }

  // Couverture latérale
  const hasWidthDef = fbs >= 2 || wbs >= 2 || (fbs + wbs) >= 2
  if (!hasWidthDef) {
    score -= 1.5; issues.push('Defensive flanks uncovered — FB or WB missing')
  } else {
    strengths.push('Both defensive flanks covered')
  }

  // 3 CBs sans WBs = flancs exposés (principe universel)
  if (cbs === 3) {
    const hasWBs = wbs >= 2 || (fbs + wbs) >= 2
    if (!hasWBs) {
      score -= 1.5
      issues.push('3 CBs without WBs — flanks exposed with no wide players to cover')
    } else {
      strengths.push('3 CBs + WBs — flanks covered by the WBs')
    }
  }

  // Sweeper Keeper FM26 : cohérence avec ligne haute (rôle OOP officiel)
  if (hasOOP(pions, 'Sweeper Keeper')) {
    strengths.push('Sweeper Keeper — active behind the defensive line')
  }

  return { score: Math.max(0, score), issues, strengths }
}

// ── 2. MILIEU DE TERRAIN ──────────────────────────────────────────────────
// Source FM-Arena FM26 : double DM en OOP empiriquement supérieur
// Source FM26 officiel : rôles DM (Screening, Pressing, Dropping, Wide Covering)
function analyseMidfield(pions) {
  const issues = [], strengths = []
  let score = 10

  const dmsIP  = pions.filter(p => p.t === 'DM')
  const cmsIP  = pions.filter(p => p.t === 'CM')
  const mrlsIP = pions.filter(p => p.t === 'MRL')
  const total  = dmsIP.length + cmsIP.length + mrlsIP.length

  if (total === 0) { score -= 3; issues.push('No midfielders — impossible to control the game') }
  if (total > 6)   { score -= 1.5; issues.push(`${total} midfielders — offensive sector weakened`) }

  // ── Double DM : avantage empirique FM-Arena (confirmé ZaZ, Gerrard, CBP87)
  const dmCountOOP = pions.filter(p => ['DM'].includes(p.t) &&
    ['Screening DM','Pressing DM (2DM)','Dropping DM','Wide Covering DM (2DM)','Defensive Mid'].includes(p.rOOP)
  ).length
  const dmCountIP = dmsIP.length

  if (dmCountOOP >= 2) {
    strengths.push('Double DM in OOP — empirical superiority confirmed by FM-Arena (1.4M FM26 matches)')
    score = Math.min(10, score + 0.5)
  } else if (dmCountIP >= 2) {
    strengths.push('Double DM in IP — central protection in possession')
  } else if (dmCountIP === 0 && cmsIP.length < 2) {
    score -= 1.5
    issues.push('No defensive screen in midfield — gap between defence and midfield uncovered')
  } else if (dmCountIP === 1) {
    strengths.push('One DM — central protection in possession')
  }

  // Half Back FM26 : se positionne entre les CBs en build-up
  if (hasIP(pions, 'Half Back')) {
    if (dmCountIP >= 1) {
      strengths.push('Half Back + DM — structured build-up from defence')
    } else {
      score -= 0.8
      issues.push('Half Back alone without a DM partner — isolated defensive pivot')
    }
  }

  // Box-to-Box sans ancre (valide en FM26 : B2B monte et descend)
  const b2bs = pions.filter(p =>
    ['Box-to-Box Mid (2DM)', 'Box-to-Box Playmaker (2DM)'].includes(p.rIP)
  )
  if (b2bs.length > 0) {
    const hasAnchor = pions.some(p =>
      ['Defensive Mid','Deep-Lying Playmaker','Half Back','Screening DM','Dropping DM'].includes(p.rIP)
    )
    if (hasAnchor) strengths.push('Box-to-Box + anchor — transition coverage')
    else { score -= 0.8; issues.push('Box-to-Box without anchor — defensive transitions exposed') }
  }

  // Largeur milieu
  if (mrlsIP.length >= 2) strengths.push('Wide midfielders on both sides — width guaranteed in IP')
  else if (mrlsIP.length === 1) { score -= 0.3; issues.push('Wide midfield asymmetry — one flank uncovered') }

  return { score: Math.max(0, score), issues, strengths }
}

// ── 3. PUISSANCE OFFENSIVE ────────────────────────────────────────────────
// Source FM26 officiel : rôles ST et AMRL, logique de finition
function analyseAttack(pions, style) {
  const issues = [], strengths = []
  let score = 10

  const sts   = countT(pions, 'ST')
  const amcs  = countT(pions, 'AMC')
  const amrls = countT(pions, 'AMRL')
  const total = sts + amcs + amrls

  if (total === 0) { score -= 3; issues.push('No attackers or offensive midfielders') }
  if (sts === 0)   { score -= 1; issues.push('No centre-forward — central finishing missing') }

  // False 9 FM26 : crée des espaces, nécessite des coureurs
  if (hasIP(pions, 'False 9')) {
    const runners = pions.filter(p =>
      ['Inside Forward','Channel Mid','Channel Forward','Advanced Playmaker','Wide Forward'].includes(p.rIP)
    )
    if (runners.length >= 2) {
      strengths.push('False 9 + runners in depth — defensive imbalance')
    } else {
      score -= 1.5
      issues.push('False 9 without runners — created spaces go unexploited')
    }
  }

  // Poacher FM26 : finisseur pur, dépend des créateurs
  if (hasIP(pions, 'Poacher')) {
    const creators = pions.filter(p =>
      ['Advanced Playmaker','Deep-Lying Playmaker','Midfield Playmaker',
       'Playmaking Winger','Playmaking Wing Back','Ball-Playing CB'].includes(p.rIP)
    )
    if (creators.length === 0) {
      score -= 1.5; issues.push('Poacher without creators — lack of chance supply')
    } else {
      strengths.push(`Poacher supplied by ${creators.length} creator(s)`)
    }
  }

  // Target Forward FM26 : nécessite des centreurs
  if (hasIP(pions, 'Target Forward')) {
    const crossers = pions.filter(p =>
      ['Winger','Wide Mid','Playmaking Wing Back','Advanced Wing Back'].includes(p.rIP)
    )
    if (crossers.length >= 2) strengths.push('Target Forward + crossing wingers — aerial offensive play')
    else if (crossers.length === 0) { score -= 1; issues.push('Target Forward without crossers — aerial advantage unexploited') }
  }

  // Styles nécessitant un Target Forward (FM26 officiel : Route One, Direct)
  if (['Route One','Direct Counter-Attack'].includes(style)) {
    if (!hasIP(pions, 'Target Forward')) {
      score -= 1.5; issues.push(`Style "${style}" without Target Forward — long balls have no target`)
    }
  }

  // Styles counter nécessitant des joueurs de transition FM26
  if (['Fluid Counter-Attack','Direct Counter-Attack'].includes(style)) {
    const transPlayers = pions.filter(p =>
      ['Wide Forward','Channel Forward','Wide Outlet Winger','Central Outlet CF'].includes(p.rIP) ||
      ['Wide Outlet Winger','Central Outlet CF'].includes(p.rOOP)
    )
    if (transPlayers.length < 2) {
      score -= 1.5; issues.push(`${style} without transition profiles — counter-attacks stifled`)
    } else {
      strengths.push(`${transPlayers.length} transition players — structured ${style}`)
    }
  }

  // Asymétrie offensive FM26 (Inside Forward + Winger côtés opposés)
  const hasIF = pions.some(p => p.rIP === 'Inside Forward')
  const hasW  = pions.some(p => p.rIP === 'Winger')
  if (hasIF && hasW) {
    strengths.push('Offensive asymmetry — Inside Forward + Winger, complementary profiles')
  }

  return { score: Math.max(0, score), issues, strengths }
}

// ── 4. COHÉRENCE IP ───────────────────────────────────────────────────────
// Source FM26 officiel : styles de jeu + TI associées
// Source FM-Arena : rôles milieux centraux = principaux déterminants du style
// NOTE : La largeur et longueur des passes TI ne DÉFINISSENT PAS le style
// → ce sont les rôles des milieux qui définissent 80% du comportement en IP
function analyseIPCohesion(pions, tiIP, style) {
  const issues = [], strengths = []
  let score = 10

  // ── Rôles milieux : déterminants principaux du style IP ────────────────
  // FM26 : DLP, Advanced Playmaker, Midfield Playmaker = créateurs centraux
  const centralCreators = pions.filter(p =>
    ['Deep-Lying Playmaker','Advanced Playmaker','Midfield Playmaker',
     'Ball-Playing CB','Ball-Playing GK'].includes(p.rIP)
  )
  const pressers = pions.filter(p =>
    ['Box-to-Box Mid (2DM)','Box-to-Box Playmaker (2DM)','Pressing CM',
     'Channel Mid','Inside Winger','Inside Forward','Winger'].includes(p.rIP)
  )

  // Styles possession (FM26 : Tiki-Taka, VTT, Control Possession)
  if (['Control Possession','Tiki-Taka','Vertical Tiki-Taka'].includes(style)) {
    if (centralCreators.length < 2) {
      score -= 2
      issues.push(`${style} with ${centralCreators.length} central creator(s) — short-passing circuit insufficient`)
    } else {
      strengths.push(`${centralCreators.length} central creators — ${style} style well structured`)
    }
    if (hasIP(pions, 'No-Nonsense GK')) {
      score -= 1
      issues.push(`No-Nonsense GK in ${style} — cuts the build-up circuit from the goalkeeper`)
    } else if (hasIP(pions, 'Ball-Playing GK')) {
      strengths.push('Ball-Playing GK — integrated in build-up from the back')
    }
    // Tempo trop élevé = contradictoire avec la conservation (FM26 officiel)
    const tempo = tiIP?.overview?.tempo
    if (['Much Higher','Higher'].includes(tempo)) {
      score -= 1
      issues.push(`High tempo in ${style} — contradicts possession retention`)
    }
    // Bypass Press = renonce à la construction (incompatible possession)
    if (tiIP?.buildup?.buildupStrategy === 'Bypass Press') {
      score -= 0.8
      issues.push(`Bypass Press in ${style} — abandons playing from the back, incoherent`)
    }
  }

  // Styles pressing (FM26 : Gegenpress)
  if (style === 'Gegenpress') {
    if (pressers.length < 3) {
      score -= 1.5
      issues.push(`Gegenpress with ${pressers.length} active profile(s) — pressing intensity insufficient`)
    } else {
      strengths.push(`${pressers.length} profiles suited to Gegenpress — intense pressing`)
    }
    // Tempo bas = contradictoire avec le Gegenpress
    const tempo = tiIP?.overview?.tempo
    if (['Lower','Much Lower'].includes(tempo)) {
      score -= 0.8
      issues.push('Low tempo in Gegenpress — contradicts quick ball recovery')
    }
  }

  // Styles Wing Play (FM26 : jeu large, centrage)
  if (style === 'Wing Play') {
    const wideRoles = pions.filter(p =>
      ['Winger','Wide Mid','Advanced Wing Back','Playmaking Wing Back'].includes(p.rIP)
    )
    if (wideRoles.length < 3) {
      score -= 1.5
      issues.push(`Wing Play with ${wideRoles.length} wide player(s) — flanks are under-exploited`)
    } else {
      strengths.push(`${wideRoles.length} wide players — structured Wing Play`)
    }
  }

  // Styles défensifs (FM26 : Catenaccio, Park the Bus)
  if (['Park the Bus','Catenaccio'].includes(style)) {
    const defOOPRoles = pions.filter(p =>
      ['Holding FB','Holding WB','Covering CB','Screening DM','Dropping DM'].includes(p.rOOP)
    )
    if (defOOPRoles.length < 3) {
      score -= 1.5
      issues.push(`${style} with ${defOOPRoles.length} OOP defensive role(s) — block too porous`)
    } else {
      strengths.push(`${defOOPRoles.length} OOP defensive roles — structured ${style} block`)
    }
  }

  // Free Role FM26 : nécessite une structure disciplinée autour
  const freeRoles = pions.filter(p => p.rIP === 'Free Role')
  if (freeRoles.length >= 2) {
    score -= 2.5; issues.push('Two simultaneous Free Roles — total structural disorganisation')
  } else if (freeRoles.length === 1) {
    const hasDiscipline = pions.some(p =>
      ['Defensive Mid','Half Back','Screening DM','Central Mid','Covering CB'].includes(p.rIP)
    )
    if (!hasDiscipline) { score -= 1; issues.push('Free Role without a disciplined structure around it') }
    else strengths.push('Free Role framed by a disciplined structure')
  }

  // Inside WB / Inside FB FM26 : nécessite largeur compensatoire
  const insideWBs = pions.filter(p =>
    ['Inside Wing Back','Inside Full Back'].includes(p.rIP)
  )
  if (insideWBs.length > 0) {
    const hasWide = pions.some(p =>
      !insideWBs.includes(p) && ['Winger','Wide Mid','Wide Forward'].includes(p.rIP)
    )
    if (!hasWide) {
      score -= 1; issues.push('Inside WB/FB without a winger — lack of offensive width')
    } else {
      strengths.push('Inside WB/FB + wide wingers — central overload well compensated')
    }
  }

  // ── Cohérence TI avec le style FM26 officiel ──────────────────────────
  // NOTE : les TI CONFIRMENT le style mais ne le DÉFINISSENT PAS
  // → les rôles des milieux (ci-dessus) sont la vérification principale
  const preset = PLAY_STYLES[style]
  if (preset?.tiIP) {
    let mismatches = 0, total = 0
    const sectionMap = {
      passingDirectness:'overview', tempo:'overview', attackingWidth:'overview',
      attackingTransition:'overview', creativeFreedom:'overview',
      buildupStrategy:'buildup', goalKicks:'buildup', gkTarget:'buildup',
    }
    Object.entries(preset.tiIP).forEach(([key, val]) => {
      if (!sectionMap[key]) return // Ignore TI non critiques
      total++
      const userVal = tiIP?.[sectionMap[key]]?.[key]
      if (userVal && userVal !== val) mismatches++
    })
    if (total > 0) {
      const pct = mismatches / total
      if (pct < 0.3) strengths.push(`Team Instructions aligned with style "${style}"`)
      else if (pct > 0.6) {
        score -= 0.8
        issues.push(`TI not coherent with style "${style}" — ${mismatches}/${total} key parameters contradictory`)
      }
    }
  }

  // ── Bonus FM-Arena : formations larges = meilleures performances ───────
  // Source : "wide player positions like 4-2-4, 4-2-3-1 still the way to go"
  const wideIPPlayers = pions.filter(p =>
    ['AML','AMR','MRL'].some(zone => p.posId?.startsWith(zone.slice(0,2))) ||
    ['WBL','WBR'].includes(p.posId)
  )
  if (wideIPPlayers.length >= 3) {
    strengths.push('Wide formation — confirmed superior in FM26 (FM-Arena)')
    score = Math.min(10, score + 0.3)
  }

  return { score: Math.max(0, score), issues, strengths }
}

// ── 5. SOLIDITÉ OOP ───────────────────────────────────────────────────────
// Source FM26 officiel : rôles OOP, TI défensives
// Source FM-Arena : position des joueurs lors de la récupération = clé
function analyseOOPBlock(pions, tiOOP) {
  const issues = [], strengths = []
  let score = 10

  const lineEng    = tiOOP?.overview?.lineEngagement || 'Mid Block'
  const defLine    = tiOOP?.overview?.defensiveLine  || 'Standard'
  const isHighLine  = ['Higher','Much Higher'].includes(defLine)
  const triggerPress = tiOOP?.overview?.triggerPress || 'Standard'

  // Sweeper Keeper FM26 : cohérence avec ligne haute
  if (hasOOP(pions, 'Sweeper Keeper')) {
    if (isHighLine) {
      strengths.push('Sweeper Keeper + high line — coverage behind the defenders')
    } else {
      score -= 1.5
      issues.push('Sweeper Keeper without a high line — his forays create unnecessary spaces')
    }
  } else if (isHighLine) {
    score -= 2
    issues.push('High line without Sweeper Keeper — vulnerable to balls in behind')
  }

  // High Press FM26 : nécessite Tracking CF pour initier depuis la première ligne
  if (lineEng === 'High Press') {
    if (!hasOOP(pions, 'Tracking CF')) {
      score -= 1.5
      issues.push('High Press without Tracking CF — press does not start from the striker')
    } else {
      strengths.push('Tracking CF + High Press — pressing initiated from the first line')
    }
    // DM de couverture derrière la presse
    const hasPressScreen = pions.some(p =>
      ['Pressing DM (2DM)','Screening DM','Dropping DM'].includes(p.rOOP)
    )
    if (!hasPressScreen) {
      score -= 0.8
      issues.push('High Press without covering DM behind — midfield exposed on quick outlets')
    }
    // TI cohérente : Trigger Press doit être élevé
    if (!['More Often','Much More Often'].includes(triggerPress)) {
      score -= 0.5
      issues.push('High Press with insufficient Trigger Press — inconsistent pressing')
    }
    // FM-Arena : Wide players en High Press = bien
    const widePressers = pions.filter(p =>
      ['Pressing WB','Pressing FB','Tracking Winger','Tracking Wide Mid'].includes(p.rOOP)
    )
    if (widePressers.length >= 2) {
      strengths.push(`${widePressers.length} wide pressing players — pressing across the full width`)
    }
  }

  // Low Block FM26 : nécessite défenseurs latéraux
  if (lineEng === 'Low Block') {
    const blockDefenders = pions.filter(p =>
      ['Tracking Winger','Tracking Wide Mid','Holding WB','Holding FB'].includes(p.rOOP)
    )
    if (blockDefenders.length < 2) {
      score -= 1.5
      issues.push('Low Block without wide defenders — flanks exposed in the low block')
    } else {
      strengths.push(`${blockDefenders.length} wide defenders — compact low block`)
    }
    // Trigger Press élevé = contradiction avec Low Block
    if (['More Often','Much More Often'].includes(triggerPress)) {
      score -= 0.8
      issues.push('High Trigger Press in Low Block — contradicts the passive defensive posture')
    }
    // Dropping DM en Low Block = très cohérent
    if (hasOOP(pions, 'Dropping DM')) {
      strengths.push('Dropping DM in Low Block — extra protection in front of the CBs')
    }
  }

  // Mid Block FM26 : configuration équilibrée
  if (lineEng === 'Mid Block') {
    const screenDMs = pions.filter(p => p.rOOP === 'Screening DM').length
    if (screenDMs >= 1) {
      strengths.push('Screening DM in Mid Block — central midfield well protected')
    }
  }

  // Pressing WBs FM26 : besoin de couverture latérale
  if (pions.some(p => p.rOOP === 'Pressing WB' || p.rOOP === 'Pressing FB')) {
    const hasCover = pions.some(p =>
      ['Wide Covering DM (2DM)','Covering CB','Covering Wide CB'].includes(p.rOOP)
    )
    if (!hasCover) {
      score -= 0.8; issues.push('Pressing WB/FB without lateral cover behind')
    } else {
      strengths.push('Pressing WB/FB with cover — secured lateral pressure')
    }
  }

  // Dropping DM FM26 : redondant avec 3+ CBs
  if (hasOOP(pions, 'Dropping DM') && countT(pions, 'CB') >= 3) {
    score -= 0.3
    issues.push('Dropping DM in a 3-CB system — creates a back-4 already covered')
  }

  // ── FM-Arena : position lors de récupération = clé ─────────────────────
  // "The position of players when you recover the ball has great influence
  //  on how counter-attacks develop" — ZaZ, FM-Arena FM26
  const outletPlayers = pions.filter(p =>
    ['Wide Outlet Winger','Central Outlet CF','Wide Outlet Mid',
     'Central Outlet AM','Inside Outlet Winger'].includes(p.rOOP)
  )
  if (outletPlayers.length >= 2) {
    strengths.push(`${outletPlayers.length} outlet players in counter position — fast offensive transitions`)
  }

  return { score: Math.max(0, score), issues, strengths }
}

// ── 6. SYNERGIES & CONFLITS ───────────────────────────────────────────────
// Source : ROLE_PAIRS et ROLE_CONFLICTS (tactical_theory.js)
// Basés sur rôles FM26 officiels
function analyseSynergies(pions) {
  const issues = [], strengths = []
  let score = 10

  // Paires positives
  ROLE_PAIRS.forEach(pair => {
    const hasA = pions.some(p => p.rIP === pair.a || p.rOOP === pair.a)
    const hasB = pions.some(p => p.rIP === pair.b || p.rOOP === pair.b)
    if (hasA && hasB) {
      strengths.push(pair.desc)
      score = Math.min(10, score + pair.score * 0.12)
    }
  })

  // Conflits
  ROLE_CONFLICTS.forEach(conflict => {
    if (conflict.roles) {
      const allPresent = conflict.roles.every(r =>
        pions.some(p => p.rIP === r || p.rOOP === r)
      )
      if (allPresent) {
        issues.push(conflict.desc)
        score -= conflict.penalty
      }
    } else if (conflict.trigger) {
      const hasTrigger = pions.some(p => p.rIP === conflict.trigger)
      if (hasTrigger && conflict.missing) {
        const hasAny = conflict.missing.some(r => pions.some(p => p.rIP === r))
        if (!hasAny) { issues.push(conflict.desc); score -= conflict.penalty }
      }
    }
  })

  // Synergies FM26 spécifiques (rôles actuels)
  // Ball-Playing GK + Half Back + DLP = build-up à 3 phases (FM26 confirmé)
  if (hasIP(pions,'Ball-Playing GK') && hasIP(pions,'Half Back') && hasIP(pions,'Deep-Lying Playmaker')) {
    strengths.push('3-phase build-up GK→Half Back→DLP — complete build-up from the back')
    score = Math.min(10, score + 0.4)
  }
  // Double DM OOP (FM-Arena : supérieur empiriquement sur FM26)
  const doubleDMOOP = pions.filter(p =>
    ['Screening DM','Pressing DM (2DM)','Dropping DM','Wide Covering DM (2DM)'].includes(p.rOOP)
  ).length
  if (doubleDMOOP >= 2) {
    strengths.push('Double DM OOP — empirical superiority confirmed in FM26 (FM-Arena, 1.4M matches)')
    score = Math.min(10, score + 0.4)
  }
  // Sweeper Keeper + Covering CB (FM26)
  if (hasOOP(pions,'Sweeper Keeper') && hasOOP(pions,'Covering CB')) {
    strengths.push('Sweeper Keeper + Covering CB — secured defensive depth')
    score = Math.min(10, score + 0.2)
  }
  // WBs offensifs + 3 CBs = structure viable (FM26 officiel : 3-4-3, 3-5-2)
  if (countT(pions,'WB') >= 2 && countT(pions,'CB') === 3) {
    strengths.push('WBs + 3 CBs — 3-x-x formation: WBs provide IP width')
    score = Math.min(10, score + 0.3)
  }
  // Channel Mid + Inside Winger (FM26 : demi-espaces exploités)
  if (hasIP(pions,'Channel Mid') && hasIP(pions,'Inside Winger')) {
    strengths.push('Channel Mid + Inside Winger — double half-space exploitation')
    score = Math.min(10, score + 0.2)
  }

  return { score: Math.max(0, score), issues, strengths }
}

// ── SCORE GLOBAL ──────────────────────────────────────────────────────────
export function computeGlobalScore(pionsIP, pionsOOP, tiIP, tiOOP, style, teamProfile = 'top') {
  const allPions = [...pionsIP, ...pionsOOP]

  // Validation structurelle préalable
  const structIssues  = validateStructure(pionsIP, pionsOOP)
  const structPenalty = computeStructuralPenalty(structIssues)

  const def  = analyseDefense(allPions)
  const mid  = analyseMidfield(allPions)
  const att  = analyseAttack(allPions, style)
  const ip   = analyseIPCohesion(allPions, tiIP, style)
  const oop  = analyseOOPBlock(allPions, tiOOP)
  const syn  = analyseSynergies(allPions)
  const prof = analyseTeamProfile(allPions, style, teamProfile)

  if (structIssues.length > 0) {
    def.issues.push(...structIssues)
    def.score = Math.max(0, def.score - structPenalty)
  }

  const W = { defense:0.18, midfield:0.13, attack:0.13, ip:0.18, oop:0.18, synergies:0.09, profile:0.11 }
  const raw = (
    def.score  * W.defense   +
    mid.score  * W.midfield  +
    att.score  * W.attack    +
    ip.score   * W.ip        +
    oop.score  * W.oop       +
    syn.score  * W.synergies +
    prof.score * W.profile
  )

  // Plafonds structurels
  const hasNoGK   = !pionsIP.some(p => p.t === 'GK') || !pionsOOP.some(p => p.t === 'GK')
  const tooFewDef = pionsIP.filter(p => ['CB','FB','WB'].includes(p.t)).length < 2
  const wrongCount = pionsIP.length !== 11 || pionsOOP.length !== 11

  let cap = 10
  if (hasNoGK)    cap = Math.min(cap, 4.0)
  if (tooFewDef)  cap = Math.min(cap, 5.0)
  if (wrongCount) cap = Math.min(cap, 6.0)

  const global = Math.round(Math.min(cap, raw) * 10) / 10

  return {
    global,
    dimensions: { defense: def, midfield: mid, attack: att, ip, oop, synergies: syn, profile: prof },
    allIssues:    [...def.issues,...mid.issues,...att.issues,...ip.issues,...oop.issues,...syn.issues,...prof.issues],
    allStrengths: [...def.strengths,...mid.strengths,...att.strengths,...ip.strengths,...oop.strengths,...syn.strengths,...prof.strengths],
    profileAdvice: prof.advice,
    profileData:   prof.profile,
  }
}

// ── RECOMMANDATIONS ────────────────────────────────────────────────────────
export function generateRecommendations(result, pionsIP, pionsOOP, tiOOP, style, teamProfile = 'top') {
  const recs = []
  const { global, dimensions: d } = result
  const allPions = [...pionsIP, ...pionsOOP]

  // Verdict global
  if      (global >= 8.5) recs.push({ type:'success', text:`Very coherent tactic (${global}/10). Inter-line interactions are solid.` })
  else if (global >= 7.0) recs.push({ type:'info', text:`Good tactical foundation (${global}/10). Adjustments will improve coherence.` })
  else if (global >= 5.0) recs.push({ type:'warning', text:`Unbalanced tactic (${global}/10). Several structural incoherences.` })
  else                    recs.push({ type:'danger', text:`Problematic tactic (${global}/10). Major corrections needed.` })

  // Dimension la plus faible
  const dims = ['defense','midfield','attack','ip','oop'].map(k => ({ k, s: d[k].score }))
  const worst = dims.sort((a,b) => a.s - b.s)[0]
  const dimLabels = { defense:'defence', midfield:'midfield', attack:'attack', ip:'IP coherence', oop:'OOP block' }
  if (worst.s < 6) {
    recs.push({ type:'warning', text:`Critical point: ${dimLabels[worst.k]} (${worst.s.toFixed(1)}/10). Fix this first.` })
  }

  const lineEng = tiOOP?.overview?.lineEngagement || 'Mid Block'

  // Recommandations FM26 basées sur données FM-Arena
  const dmCountOOP = allPions.filter(p =>
    ['Screening DM','Pressing DM (2DM)','Dropping DM'].includes(p.rOOP)
  ).length
  if (dmCountOOP < 2) {
    recs.push({ type:'info', text:`FM-Arena (1.4M FM26 matches) confirms that double DM in OOP yields superior results. Consider 2 OOP DMs.` })
  }

  // Wide players manquants
  const wideCount = allPions.filter(p =>
    ['AML','AMR','WBL','WBR'].includes(p.posId)
  ).length
  if (wideCount < 2) {
    recs.push({ type:'info', text:`Top FM26 tactics use wide players (AML/AMR or offensive WBs). Wide formations score better (FM-Arena).` })
  }

  // Recommandations contextuelles par style
  if (['Control Possession','Tiki-Taka'].includes(style) && !allPions.some(p => p.rIP === 'Ball-Playing GK')) {
    recs.push({ type:'info', text:`${style}: a Ball-Playing GK would integrate the goalkeeper into build-up from the back.` })
  }
  if (style === 'Gegenpress' && !allPions.some(p => p.rOOP === 'Tracking CF')) {
    recs.push({ type:'info', text:`Gegenpress: a Tracking CF is essential to initiate the press from the first line.` })
  }
  if (lineEng === 'High Press' && !allPions.some(p => p.rOOP === 'Sweeper Keeper')) {
    recs.push({ type:'warning', text:`High Press + high line without Sweeper Keeper — balls in behind will be fatal.` })
  }
  if (['Fluid Counter-Attack','Direct Counter-Attack'].includes(style) && lineEng !== 'Low Block' && lineEng !== 'Mid Block') {
    recs.push({ type:'info', text:`${style}: pair with a Low Block or Mid Block in OOP to better absorb before transitioning.` })
  }

  return recs
}
