// ── POSITION TYPES & COLORS ──────────────────────────────────────────────
export const POS_TYPES = {
  GK:   { bg: '#1a1a1a', tx: '#fff', label: 'GK',    name: 'Goalkeeper' },
  CB:   { bg: '#5B2D8E', tx: '#fff', label: 'CB',    name: 'Centre Back' },
  FB:   { bg: '#d0d0d0', tx: '#111', label: 'FB',    name: 'Full Back' },
  WB:   { bg: '#27AE60', tx: '#fff', label: 'WB',    name: 'Wing Back' },
  DM:   { bg: '#E67E22', tx: '#fff', label: 'DM',    name: 'Defensive Mid' },
  CM:   { bg: '#2980B9', tx: '#fff', label: 'CM',    name: 'Central Mid' },
  MRL:  { bg: '#00BCD4', tx: '#111', label: 'ML/R',  name: 'Wide Mid' },
  AMC:  { bg: '#E74C3C', tx: '#fff', label: 'AMC',   name: 'Attacking Mid' },
  AMRL: { bg: '#C2185B', tx: '#fff', label: 'AML/R', name: 'Wide Attacking Mid' },
  ST:   { bg: '#F1C40F', tx: '#111', label: 'ST',    name: 'Striker' },
}

// ── ROLES IN POSSESSION ──────────────────────────────────────────────────
export const ROLES_IP = {
  GK:   ['Goalkeeper', 'Ball-Playing GK', 'No-Nonsense GK'],
  CB:   ['Centre-Back', 'Advanced CB', 'Ball-Playing CB', 'No-Nonsense CB', 'Wide CB (3CB)', 'Overlapping CB (3CB)'],
  FB:   ['Full Back', 'Wing Back', 'Inside Wing Back', 'Inside Full Back', 'Playmaking Wing Back'],
  WB:   ['Wing Back', 'Advanced Wing Back', 'Inside Wing Back', 'Playmaking Wing Back'],
  DM:   ['Defensive Mid', 'Deep-Lying Playmaker', 'Half Back', 'Box-to-Box Mid (2DM)', 'Box-to-Box Playmaker (2DM)'],
  CM:   ['Central Mid', 'Attacking Mid', 'Advanced Playmaker', 'Channel Mid', 'Midfield Playmaker', 'Wide Central Mid (2CM)'],
  MRL:  ['Winger', 'Wide Mid', 'Playmaking Winger', 'Inside Winger'],
  AMC:  ['Attacking Mid', 'Advanced Playmaker', 'Second Striker', 'Free Role', 'Channel Mid'],
  AMRL: ['Winger', 'Inside Forward', 'Inside Winger', 'Playmaking Winger', 'Wide Forward'],
  ST:   ['Deep-Lying Forward', 'Centre Forward', 'Target Forward', 'Poacher', 'Channel Forward', 'False 9'],
}

// ── ROLES OUT OF POSSESSION ──────────────────────────────────────────────
export const ROLES_OOP = {
  GK:   ['Goalkeeper', 'Line-Holding Keeper', 'Sweeper Keeper'],
  CB:   ['Centre Back', 'Stopping CB', 'Covering CB', 'Wide CB (3CB)', 'Stopping Wide CB', 'Covering Wide CB'],
  FB:   ['Full Back', 'Pressing FB', 'Holding FB'],
  WB:   ['Wing Back', 'Pressing WB', 'Holding WB'],
  DM:   ['Defensive Mid', 'Dropping DM', 'Screening DM', 'Pressing DM (2DM)', 'Wide Covering DM (2DM)'],
  CM:   ['Central Mid', 'Pressing CM', 'Screening CM', 'Wide Covering CM (2CM)'],
  MRL:  ['Wide Mid', 'Tracking Wide Mid', 'Wide Outlet Mid'],
  AMC:  ['Attacking Mid', 'Tracking AM', 'Central Outlet AM', 'Splitting Outlet AM (2AM)'],
  AMRL: ['Winger', 'Tracking Winger', 'Inside Outlet Winger', 'Wide Outlet Winger'],
  ST:   ['Centre Forward', 'Tracking CF', 'Central Outlet CF', 'Splitting Outlet CF (2ST)'],
}

// ── ROLE DESCRIPTIONS ─────────────────────────────────────────────────────
export const ROLE_DESC = {
  'Goalkeeper': 'Gardien classique. Arrête les tirs, distribue simplement. Implication minimale en construction.',
  'Ball-Playing GK': 'Participe à la construction. Reçoit sous pression, relance par passes courtes ou longues.',
  'No-Nonsense GK': 'Dégagements prioritaires. Aucune prise de risque. Idéal pour les blocs bas ou le contre.',
  'Centre-Back': 'Défenseur central classique. Marque, tacle, tient la ligne. Pivot du système défensif.',
  'Advanced CB': 'Peut monter en milieu lors des transitions. Conserve son rôle défensif principal.',
  'Ball-Playing CB': 'Porte le ballon depuis l\'arrière, lance des passes tranchantes. Nécessite technique et calme.',
  'No-Nonsense CB': 'Dégage d\'abord. Sécurité maximale, risque zéro. Parfait pour un football direct.',
  'Wide CB (3CB)': 'CB latéral dans un bloc de 3. Peut chevaucher ou couvrir les flancs selon la situation.',
  'Overlapping CB (3CB)': 'Remonte sur les flancs depuis la défense à 3 pour créer la supériorité numérique.',
  'Full Back': 'Arrière latéral classique. Défend en priorité, soutient selon le devoir attribué.',
  'Wing Back': 'Base du WB. Attaque et défend sur le flanc. En Attaque, se comporte comme un ailier.',
  'Inside Wing Back': 'Rentre dans l\'axe au lieu de centrer. Surcharge le milieu. Nouveau dans FM26.',
  'Inside Full Back': 'Se repositionne en CB lors des attaques pour protéger contre les transitions adverses.',
  'Playmaking Wing Back': 'Initie les attaques par des passes plutôt que des centres. Requiert vision et qualité de passe.',
  'Advanced Wing Back': 'WB très offensif, similaire à un milieu large. Responsabilités défensives réduites.',
  'Defensive Mid': 'Écran devant la défense. Protège, recycle, passe simplement. Aucune prise de risque.',
  'Deep-Lying Playmaker': 'Organise depuis les lignes profondes. Dicte le tempo, passe entre les lignes. Vision capitale.',
  'Half Back': 'S\'intercale entre les CBs en construction. Crée un bloc de 3, casse les presses adverses.',
  'Box-to-Box Mid (2DM)': 'Couvre toute la longueur du terrain. Brise, avance, soutient. Nécessite un partenaire.',
  'Box-to-Box Playmaker (2DM)': 'Variante créative du B2B. Porte le ballon et dicte le tempo en transition.',
  'Central Mid': 'Milieu équilibré. Défend le bloc, fait la liaison, arrive en retard. Pilier de tout système.',
  'Attacking Mid': 'Numéro 10 classique. Passe clé, arrive dans la surface. Plus haut sur le terrain en Attaque.',
  'Advanced Playmaker': 'Créateur entre les lignes. Dicte le tempo, trouve les passes tranchantes, crée des espaces.',
  'Channel Mid': 'Exploite les demi-espaces. Crée des lignes de passe diagonales. Hybride CM/ailier. Nouveau FM26.',
  'Midfield Playmaker': 'Organisateur central. Combine vision du DLP et positionnement avancé. Nouveau FM26.',
  'Wide Central Mid (2CM)': 'Démarre large, rentre dans l\'axe. Idéal avec des attaquants étroits. Nouveau FM26.',
  'Winger': 'Ailier traditionnel. Étire la défense, centre, isole le latéral. Dévastateur avec un FB chevauchant.',
  'Wide Mid': 'Milieu large positionné plus bas qu\'un ailier. Crosses et largeur en soutien, poussée offensive en Attaque.',
  'Playmaking Winger': 'Crée depuis le large plutôt que dribbler. Rentre, dicte le tempo. Nouveau FM26.',
  'Inside Winger': 'Démarre large, coupe à l\'intérieur pour tirer ou attaquer l\'espace central. Nouveau FM26.',
  'Inside Forward': 'Démarre sur l\'aile, plonge dans la surface. Attaquant secondaire, dangeureux sur coupe.',
  'Wide Forward': 'Hybride ailier/attaquant. Attaque directement la surface. Priorité aux buts. Nouveau FM26.',
  'Second Striker': 'Juste derrière l\'attaquant principal. Créateur et finisseur à la fois. Nouveau FM26.',
  'Free Role': 'Liberté totale de mouvement. Idéal pour un joueur très intelligent et technique.',
  'Deep-Lying Forward': 'Décroche profond pour créer. Soutien à l\'équipe plutôt que finition pure.',
  'Centre Forward': 'Avant-centre classique. Conduit la ligne, finit. Retient le ballon en Soutien.',
  'Target Forward': 'Dominateur physique. Retient le ballon, gagne les duels aériens, libère des espaces.',
  'Poacher': 'Finisseur instinctif. Reste haut, cherche les rebonds et erreurs. Efficacité maximale.',
  'Channel Forward': 'Joue dans le couloir aux côtés du buteur. Mélange winger et attaquant. Nouveau FM26.',
  'False 9': 'Décroche entre les lignes, attire les défenseurs, crée de l\'espace pour les coureurs. Moins finisseur.',
  'Line-Holding Keeper': 'Légèrement plus haut que la normale. Raccourcit les distances sans sweeper. Nouveau FM26.',
  'Sweeper Keeper': 'Sort agressivement pour couper les longs ballons. Indispensable en ligne haute.',
  'Stopping CB': 'Sort pour intercepter et anticiper. Engages tôt, stoppe les attaques à la source.',
  'Covering CB': 'Reste profond, réagit aux jeux. Prudent, tient la ligne, compense les montées de partenaires.',
  'Pressing FB': 'Presse haut le long du flanc. Requiert couverture derrière. Nouveau FM26.',
  'Holding FB': 'Plus profond que la normale lors des presses. Protège le flanc lors des transitions. Nouveau FM26.',
  'Dropping DM': 'Se glisse entre les CBs sous pression. Forme un bloc de 3 défensif temporaire. Nouveau FM26.',
  'Screening DM': 'Protection centrale par positionnement et interceptions. Passif mais discipliné. Nouveau FM26.',
  'Pressing DM (2DM)': 'DM agressif qui monte pour presser. Coordonne la presse collective. Nouveau FM26.',
  'Wide Covering DM (2DM)': 'Se décale latéralement pour aider les latéraux ou WB. Couverture large. Nouveau FM26.',
  'Pressing CM': 'Chasse la possession en milieu. Agressif, engagé, perturbe la structure adverse. Nouveau FM26.',
  'Screening CM': 'Milieu bas qui protège la défense. Lit le jeu, intercepte, offre une sortie sûre. Nouveau FM26.',
  'Wide Covering CM (2CM)': 'Se décale pour protéger les flancs quand les latéraux montent. Nouveau FM26.',
  'Tracking Wide Mid': 'Milieu large avec responsabilités défensives accrues. Suit les ailiers adverses. Nouveau FM26.',
  'Wide Outlet Mid': 'Haut et large pour les transitions. Peu défensif, premier receveur en contre. Nouveau FM26.',
  'Tracking AM': 'AM avec devoirs défensifs. Replie en milieu, presse, couvre. Nouveau FM26.',
  'Central Outlet AM': 'Reste haut pour les contre-attaques. Peu impliqué en construction. Nouveau FM26.',
  'Splitting Outlet AM (2AM)': 'Occupe les espaces et demi-espaces. Étire la défense, crée des passes diagonales. Nouveau FM26.',
  'Tracking Winger': 'Ajoute des devoirs défensifs au jeu large. Suit les latéraux, compresse les transitions. Nouveau FM26.',
  'Inside Outlet Winger': 'Rentre au centre lors de la construction, agit comme playmaker depuis le flanc. Nouveau FM26.',
  'Wide Outlet Winger': 'Reste haut et large pour les contre-attaques. Premier receveur en récupération. Nouveau FM26.',
  'Tracking CF': 'Avant-centre défensif. Replie pour presser ou bloquer en phases défensives. Nouveau FM26.',
  'Central Outlet CF': 'Reste haut près de la défense adverse. Axé sur la finition et les transitions rapides. Nouveau FM26.',
  'Splitting Outlet CF (2ST)': 'Positionné haut et large. Attaque en transition, reçoit dans les espaces. Nouveau FM26.',
}

// ── FORMATIONS PREDEFINIES ────────────────────────────────────────────────
export const FORMATIONS_IP = {
  '4-3-3':   [
    {t:'GK',x:50,y:91},{t:'FB',x:12,y:73},{t:'CB',x:35,y:70},{t:'CB',x:65,y:70},{t:'FB',x:88,y:73},
    {t:'CM',x:22,y:49},{t:'CM',x:50,y:45},{t:'CM',x:78,y:49},
    {t:'AMRL',x:16,y:24},{t:'ST',x:50,y:14},{t:'AMRL',x:84,y:24}
  ],
  '4-2-3-1': [
    {t:'GK',x:50,y:91},{t:'FB',x:12,y:73},{t:'CB',x:35,y:70},{t:'CB',x:65,y:70},{t:'FB',x:88,y:73},
    {t:'DM',x:36,y:54},{t:'DM',x:64,y:54},
    {t:'AMRL',x:18,y:32},{t:'AMC',x:50,y:29},{t:'AMRL',x:82,y:32},
    {t:'ST',x:50,y:13}
  ],
  '4-4-2':   [
    {t:'GK',x:50,y:91},{t:'FB',x:12,y:73},{t:'CB',x:35,y:70},{t:'CB',x:65,y:70},{t:'FB',x:88,y:73},
    {t:'MRL',x:12,y:49},{t:'CM',x:35,y:47},{t:'CM',x:65,y:47},{t:'MRL',x:88,y:49},
    {t:'ST',x:34,y:18},{t:'ST',x:66,y:18}
  ],
  '3-5-2':   [
    {t:'GK',x:50,y:91},{t:'CB',x:25,y:71},{t:'CB',x:50,y:68},{t:'CB',x:75,y:71},
    {t:'WB',x:10,y:51},{t:'CM',x:30,y:48},{t:'CM',x:50,y:44},{t:'CM',x:70,y:48},{t:'WB',x:90,y:51},
    {t:'ST',x:34,y:18},{t:'ST',x:66,y:18}
  ],
  '3-4-3':   [
    {t:'GK',x:50,y:91},{t:'CB',x:25,y:71},{t:'CB',x:50,y:68},{t:'CB',x:75,y:71},
    {t:'WB',x:10,y:51},{t:'CM',x:36,y:48},{t:'CM',x:64,y:48},{t:'WB',x:90,y:51},
    {t:'AMRL',x:16,y:24},{t:'ST',x:50,y:14},{t:'AMRL',x:84,y:24}
  ],
  '4-1-4-1': [
    {t:'GK',x:50,y:91},{t:'FB',x:12,y:73},{t:'CB',x:35,y:70},{t:'CB',x:65,y:70},{t:'FB',x:88,y:73},
    {t:'DM',x:50,y:55},
    {t:'MRL',x:12,y:42},{t:'CM',x:36,y:40},{t:'CM',x:64,y:40},{t:'MRL',x:88,y:42},
    {t:'ST',x:50,y:14}
  ],
  '4-3-2-1': [
    {t:'GK',x:50,y:91},{t:'FB',x:12,y:73},{t:'CB',x:35,y:70},{t:'CB',x:65,y:70},{t:'FB',x:88,y:73},
    {t:'CM',x:22,y:52},{t:'DM',x:50,y:56},{t:'CM',x:78,y:52},
    {t:'AMC',x:34,y:32},{t:'AMC',x:66,y:32},
    {t:'ST',x:50,y:14}
  ],
}

export const FORMATIONS_OOP = {
  '4-4-2':   [
    {t:'GK',x:50,y:91},{t:'FB',x:12,y:73},{t:'CB',x:35,y:70},{t:'CB',x:65,y:70},{t:'FB',x:88,y:73},
    {t:'MRL',x:12,y:51},{t:'CM',x:35,y:49},{t:'CM',x:65,y:49},{t:'MRL',x:88,y:51},
    {t:'ST',x:34,y:20},{t:'ST',x:66,y:20}
  ],
  '4-5-1':   [
    {t:'GK',x:50,y:91},{t:'FB',x:12,y:73},{t:'CB',x:35,y:70},{t:'CB',x:65,y:70},{t:'FB',x:88,y:73},
    {t:'MRL',x:12,y:49},{t:'CM',x:30,y:47},{t:'CM',x:50,y:44},{t:'CM',x:70,y:47},{t:'MRL',x:88,y:49},
    {t:'ST',x:50,y:16}
  ],
  '5-4-1':   [
    {t:'GK',x:50,y:91},{t:'WB',x:10,y:73},{t:'CB',x:28,y:70},{t:'CB',x:50,y:67},{t:'CB',x:72,y:70},{t:'WB',x:90,y:73},
    {t:'MRL',x:16,y:51},{t:'CM',x:38,y:49},{t:'CM',x:62,y:49},{t:'MRL',x:84,y:51},
    {t:'ST',x:50,y:16}
  ],
  '5-3-2':   [
    {t:'GK',x:50,y:91},{t:'WB',x:10,y:73},{t:'CB',x:28,y:70},{t:'CB',x:50,y:67},{t:'CB',x:72,y:70},{t:'WB',x:90,y:73},
    {t:'CM',x:26,y:49},{t:'CM',x:50,y:45},{t:'CM',x:74,y:49},
    {t:'ST',x:34,y:20},{t:'ST',x:66,y:20}
  ],
  '4-3-3':   [
    {t:'GK',x:50,y:91},{t:'FB',x:12,y:73},{t:'CB',x:35,y:70},{t:'CB',x:65,y:70},{t:'FB',x:88,y:73},
    {t:'CM',x:22,y:49},{t:'CM',x:50,y:45},{t:'CM',x:78,y:49},
    {t:'AMRL',x:16,y:26},{t:'ST',x:50,y:16},{t:'AMRL',x:84,y:26}
  ],
  '4-1-4-1': [
    {t:'GK',x:50,y:91},{t:'FB',x:12,y:73},{t:'CB',x:35,y:70},{t:'CB',x:65,y:70},{t:'FB',x:88,y:73},
    {t:'DM',x:50,y:57},
    {t:'MRL',x:12,y:44},{t:'CM',x:36,y:42},{t:'CM',x:64,y:42},{t:'MRL',x:88,y:44},
    {t:'ST',x:50,y:16}
  ],
  '4-2-3-1': [
    {t:'GK',x:50,y:91},{t:'FB',x:12,y:73},{t:'CB',x:35,y:70},{t:'CB',x:65,y:70},{t:'FB',x:88,y:73},
    {t:'DM',x:36,y:54},{t:'DM',x:64,y:54},
    {t:'AMRL',x:18,y:34},{t:'AMC',x:50,y:31},{t:'AMRL',x:82,y:34},
    {t:'ST',x:50,y:15}
  ],
}

export const PLAY_STYLES = ['Possession', 'Gegenpress', 'Low Block', 'Direct', 'Counter', 'High Press', 'Tiki-Taka']

// ── TEAM INSTRUCTIONS ─────────────────────────────────────────────────────
export const MENTALITIES = ['Very Defensive', 'Defensive', 'Cautious', 'Balanced', 'Positive', 'Offensive', 'Very Offensive']

export const TI_IP = {
  overview: {
    label: 'Overview',
    params: [
      { key: 'passingDirectness', label: 'Passing Directness', opts: ['Much Shorter','Shorter','Standard','More Direct','Much More Direct'], type: 'slider' },
      { key: 'tempo',             label: 'Tempo',              opts: ['Much Lower','Lower','Standard','Higher','Much Higher'], type: 'slider' },
      { key: 'attackingWidth',    label: 'Attacking Width',    opts: ['Much Narrower','Narrower','Normal','Wider','Much Wider'], type: 'slider' },
      { key: 'attackingTransition', label: 'Attacking Transition', opts: ['Hold Shape','Standard','Counter Attack'], type: 'toggle' },
      { key: 'creativeFreedom',   label: 'Creative Freedom',   opts: ['More Disciplined','Balanced','More Expressive'], type: 'toggle' },
      { key: 'timeWasting',       label: 'Time Wasting',       opts: ['Less Often','Standard','More Often'], type: 'toggle' },
      { key: 'setpieces',         label: 'Play For Set Pieces', opts: ['Keep Ball in Play','Play for Set Pieces'], type: 'toggle' },
    ],
    defaults: { passingDirectness:'Standard', tempo:'Standard', attackingWidth:'Normal', attackingTransition:'Standard', creativeFreedom:'Balanced', timeWasting:'Standard', setpieces:'Keep Ball in Play' }
  },
  finalThird: {
    label: 'Final Third',
    params: [
      { key: 'dribbling',        label: 'Dribbling',           opts: ['Discourage','Balanced','Encourage'], type: 'toggle' },
      { key: 'patience',         label: 'Patience',            opts: ['Hit Early Crosses','Standard','Work Ball Into Box'], type: 'toggle' },
      { key: 'shotsFromDist',    label: 'Shots from Distance', opts: ['Discourage','Balanced','Encourage'], type: 'toggle' },
      { key: 'crossingStyle',    label: 'Crossing Style',      opts: ['Balanced','Floated','Whipped','Low'], type: 'toggle' },
    ],
    defaults: { dribbling:'Balanced', patience:'Standard', shotsFromDist:'Balanced', crossingStyle:'Balanced' }
  },
  progression: {
    label: 'Progression',
    params: [
      { key: 'overlap',       label: 'Overlap',         opts: ['Balanced','Left','Right','Both Flanks'], type: 'toggle' },
      { key: 'underlap',      label: 'Underlap',        opts: ['Balanced','Left','Right','Both Flanks'], type: 'toggle' },
      { key: 'progressThrough', label: 'Progress Through', opts: ['Balanced','Left','Middle','Right','Both Flanks'], type: 'toggle' },
      { key: 'passReception', label: 'Pass Reception',  opts: ['Pass to Feet','Balanced','Pass Into Space'], type: 'toggle' },
    ],
    defaults: { overlap:'Balanced', underlap:'Balanced', progressThrough:'Balanced', passReception:'Balanced' }
  },
  buildup: {
    label: 'Buildup',
    params: [
      { key: 'buildupStrategy', label: 'Build-Up Strategy',    opts: ['Play Through Press','Balanced','Bypass Press'], type: 'toggle' },
      { key: 'goalKicks',       label: 'Goal Kicks',           opts: ['Short','Mixed','Long'], type: 'toggle' },
      { key: 'gkSpeed',         label: 'GK Distribution Speed', opts: ['Slow Pace Down','Balanced','Distribute Quickly'], type: 'toggle' },
      { key: 'gkTarget',        label: 'GK Distribution',      opts: ['Over Opp. Defence','Target Forward','Playmaker','Flanks','Centre-Backs','Full Backs','Balanced'], type: 'select' },
    ],
    defaults: { buildupStrategy:'Balanced', goalKicks:'Mixed', gkSpeed:'Balanced', gkTarget:'Balanced' }
  },
}

export const TI_OOP = {
  overview: {
    label: 'Overview',
    params: [
      { key: 'lineEngagement',      label: 'Line of Engagement',      opts: ['Low Block','Mid Block','High Press'], type: 'toggle' },
      { key: 'defensiveLine',       label: 'Defensive Line',          opts: ['Much Lower','Lower','Standard','Higher','Much Higher'], type: 'slider' },
      { key: 'defLineBehaviour',    label: 'Def. Line Behaviour',     opts: ['Step Up More','Balanced','Drop Off More'], type: 'toggle' },
      { key: 'triggerPress',        label: 'Trigger Press',           opts: ['Much Less Often','Less Often','Standard','More Often','Much More Often'], type: 'slider' },
      { key: 'defensiveTransition', label: 'Def. Transition',         opts: ['Regroup','Standard','Counter Press'], type: 'toggle' },
      { key: 'tackling',            label: 'Tackling',                opts: ['Stay On Feet','Standard','Get Stuck In'], type: 'toggle' },
    ],
    defaults: { lineEngagement:'Mid Block', defensiveLine:'Standard', defLineBehaviour:'Balanced', triggerPress:'Standard', defensiveTransition:'Standard', tackling:'Standard' }
  },
  highPress: {
    label: 'High Press',
    params: [
      { key: 'pressingTrap', label: 'Pressing Trap',             opts: ['Trap Inside','Balanced','Trap Outside'], type: 'toggle' },
      { key: 'shortGKDistr', label: 'Short GK Distribution',     opts: ['Yes','No'], type: 'toggle' },
    ],
    defaults: { pressingTrap:'Balanced', shortGKDistr:'No' }
  },
  midBlock: {
    label: 'Mid Block',
    params: [
      { key: 'pressingTrap', label: 'Pressing Trap', opts: ['Trap Inside','Balanced','Trap Outside'], type: 'toggle' },
    ],
    defaults: { pressingTrap:'Balanced' }
  },
  lowBlock: {
    label: 'Low Block',
    params: [
      { key: 'crossEngagement', label: 'Cross Engagement', opts: ['Stop Crosses','Balanced','Invite Crosses'], type: 'toggle' },
    ],
    defaults: { crossEngagement:'Balanced' }
  },
}

export const defaultTIValues = () => ({
  mentality: 'Balanced',
  ip: Object.fromEntries(Object.entries(TI_IP).map(([k,v]) => [k, {...v.defaults}])),
  oop: Object.fromEntries(Object.entries(TI_OOP).map(([k,v]) => [k, {...v.defaults}])),
  ipSelected: 'overview',
  oopSelected: 'overview',
})
