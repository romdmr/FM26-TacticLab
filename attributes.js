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
  'Goalkeeper': 'Classic goalkeeper. Stops shots, distributes simply. Minimal involvement in build-up.',
  'Ball-Playing GK': 'Participates in build-up. Receives under pressure, relaunches with short or long passes.',
  'No-Nonsense GK': 'Clearances first. No risk-taking. Ideal for low blocks or counter-attacking systems.',
  'Centre-Back': 'Classic central defender. Marks, tackles, holds the line. Defensive system pivot.',
  'Advanced CB': 'Can advance into midfield during transitions. Maintains main defensive role.',
  'Ball-Playing CB': 'Carries the ball from the back, plays incisive passes. Requires technique and composure.',
  'No-Nonsense CB': 'Clears first. Maximum security, zero risk. Perfect for direct football.',
  'Wide CB (3CB)': 'Wide CB in a back-3. Can overlap or cover the flanks depending on the situation.',
  'Overlapping CB (3CB)': 'Pushes forward from the back-3 to create numerical superiority on the flanks.',
  'Full Back': 'Classic full back. Defends first, supports based on role assigned.',
  'Wing Back': 'The standard WB. Attacks and defends on the flank. Behaves like a winger when going forward.',
  'Inside Wing Back': 'Cuts inside instead of crossing. Overloads the midfield. New in FM26.',
  'Inside Full Back': 'Repositions as a CB during attacks to protect against opposition transitions.',
  'Playmaking Wing Back': 'Initiates attacks through passing rather than crossing. Requires vision and passing quality.',
  'Advanced Wing Back': 'Very offensive WB, similar to a wide midfielder. Reduced defensive responsibilities.',
  'Defensive Mid': 'Screen in front of the defence. Protects, recycles, passes simply. No risk-taking.',
  'Deep-Lying Playmaker': 'Organises from deep. Dictates tempo, passes between lines. Vision is paramount.',
  'Half Back': 'Drops between the CBs in build-up. Creates a back-3, breaks opposition presses.',
  'Box-to-Box Mid (2DM)': 'Covers the full pitch length. Breaks up play, advances, supports. Needs a partner.',
  'Box-to-Box Playmaker (2DM)': 'Creative B2B variant. Carries the ball and dictates tempo in transition.',
  'Central Mid': 'Balanced midfielder. Defends the block, links play, arrives late. Pillar of any system.',
  'Attacking Mid': 'Classic number 10. Key passes, arrives in the box. Higher up the pitch when attacking.',
  'Advanced Playmaker': 'Creator between the lines. Dictates tempo, finds incisive passes, creates spaces.',
  'Channel Mid': 'Exploits half-spaces. Creates diagonal passing lanes. CM/winger hybrid. New in FM26.',
  'Midfield Playmaker': 'Central organiser. Combines DLP vision with advanced positioning. New in FM26.',
  'Wide Central Mid (2CM)': 'Starts wide, comes inside. Ideal with narrow attackers. New in FM26.',
  'Winger': 'Traditional winger. Stretches the defence, crosses, isolates the full back. Devastating with an overlapping FB.',
  'Wide Mid': 'Wide midfielder positioned deeper than a winger. Crosses and width in support, offensive push when attacking.',
  'Playmaking Winger': 'Creates from wide rather than dribbling. Cuts inside, dictates tempo. New in FM26.',
  'Inside Winger': 'Starts wide, cuts inside to shoot or attack the central space. New in FM26.',
  'Inside Forward': 'Starts on the flank, dives into the box. Secondary attacker, dangerous when cutting inside.',
  'Wide Forward': 'Winger/attacker hybrid. Attacks the box directly. Goals are the priority. New in FM26.',
  'Second Striker': 'Just behind the main striker. Creator and finisher in one. New in FM26.',
  'Free Role': 'Total freedom of movement. Ideal for a highly intelligent and technical player.',
  'Deep-Lying Forward': 'Drops deep to create. Supports the team rather than pure finishing.',
  'Centre Forward': 'Classic centre-forward. Leads the line, finishes. Holds the ball up when supporting.',
  'Target Forward': 'Physical dominator. Holds the ball, wins aerial duels, creates spaces for others.',
  'Poacher': 'Instinctive finisher. Stays high, hunts rebounds and errors. Maximum efficiency.',
  'Channel Forward': 'Plays in the channel alongside the striker. Winger and attacker mix. New in FM26.',
  'False 9': 'Drops between the lines, drags defenders, creates space for runners. Less of a finisher.',
  'Line-Holding Keeper': 'Slightly higher than normal. Shortens distances without acting as a sweeper. New in FM26.',
  'Sweeper Keeper': 'Aggressively comes out to cut long balls. Essential with a high defensive line.',
  'Stopping CB': 'Steps out to intercept and anticipate. Engages early, stops attacks at the source.',
  'Covering CB': 'Stays deep, reacts to play. Cautious, holds the line, covers advancing partners.',
  'Pressing FB': 'Presses high along the flank. Requires cover behind. New in FM26.',
  'Holding FB': 'Deeper than normal during presses. Protects the flank during transitions. New in FM26.',
  'Dropping DM': 'Slots between the CBs under pressure. Forms a temporary defensive back-3. New in FM26.',
  'Screening DM': 'Central protection through positioning and interceptions. Passive but disciplined. New in FM26.',
  'Pressing DM (2DM)': 'Aggressive DM who steps up to press. Coordinates the collective press. New in FM26.',
  'Wide Covering DM (2DM)': 'Shifts laterally to help full backs or WBs. Wide coverage. New in FM26.',
  'Pressing CM': 'Hunts possession in midfield. Aggressive, committed, disrupts the opposition structure. New in FM26.',
  'Screening CM': 'Deep midfielder who protects the defence. Reads the game, intercepts, offers a safe outlet. New in FM26.',
  'Wide Covering CM (2CM)': 'Shifts to protect the flanks when the full backs push forward. New in FM26.',
  'Tracking Wide Mid': 'Wide midfielder with increased defensive responsibilities. Tracks opposition wingers. New in FM26.',
  'Wide Outlet Mid': 'High and wide for transitions. Minimal defensive duties, first receiver on the counter. New in FM26.',
  'Tracking AM': 'AM with defensive duties. Drops back into midfield, presses, covers. New in FM26.',
  'Central Outlet AM': 'Stays high for counter-attacks. Little involvement in build-up. New in FM26.',
  'Splitting Outlet AM (2AM)': 'Occupies spaces and half-spaces. Stretches the defence, creates diagonal passes. New in FM26.',
  'Tracking Winger': 'Adds defensive duties to the wide game. Tracks full backs, compresses transitions. New in FM26.',
  'Inside Outlet Winger': 'Comes inside during build-up, acts as a playmaker from the flank. New in FM26.',
  'Wide Outlet Winger': 'Stays high and wide for counter-attacks. First receiver on ball recovery. New in FM26.',
  'Tracking CF': 'Defensive centre-forward. Drops back to press or block in defensive phases. New in FM26.',
  'Central Outlet CF': 'Stays high near the opposition defence. Focused on finishing and fast transitions. New in FM26.',
  'Splitting Outlet CF (2ST)': 'Positioned high and wide. Attacks in transition, receives in spaces. New in FM26.',
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
