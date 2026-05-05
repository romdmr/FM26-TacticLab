/**
 * FM26 — Official Playing Styles
 * Source: FM26 in-game screenshots
 * Each style has: description, staff feedback +/-, default IP TI, default OOP TI
 */
export const PLAY_STYLES = {
  'Control Possession': {
    label: 'Control Possession',
    description: 'Focuses on retaining the ball and winning it back quickly. Plays out from defence and creates chances through patient build-up with short passes.',
    feedback: {
      pos: ['Retains the ball well.', 'Plays on the front foot.'],
      neg: ['Risky build-up from defence.', 'Slower tempo in transition to attack.'],
    },
    tiIP: {
      passingDirectness: 'Shorter', tempo: 'Lower', buildupStrategy: 'Play Through Press',
      gkTarget: 'Centre-Backs', goalKicks: 'Short', attackingTransition: 'Standard',
    },
    tiOOP: {
      defensiveLine: 'Higher', lineEngagement: 'High Press',
      triggerPress: 'More Often', shortGKDistr: 'Yes', defensiveTransition: 'Counter Press',
    },
    keyRoles: { ip: ['Deep-Lying Playmaker','Ball-Playing CB','Ball-Playing GK'], oop: ['Pressing CM','Tracking CF'] },
  },

  'Gegenpress': {
    label: 'Gegenpress',
    description: 'Relies on intense work from all players. Fitness and mobility are paramount to press immediately after losing the ball.',
    feedback: {
      pos: ['Wins the ball high up the pitch.', 'High intensity can unsettle the opposition.'],
      neg: ['Very demanding on players.', 'Turnover-based approach means less control.'],
    },
    tiIP: {
      passingDirectness: 'Standard', tempo: 'Much Higher', buildupStrategy: 'Play Through Press',
      gkTarget: 'Centre-Backs', attackingWidth: 'Narrower', attackingTransition: 'Counter Attack',
    },
    tiOOP: {
      defensiveLine: 'Higher', lineEngagement: 'High Press',
      triggerPress: 'Much More Often', shortGKDistr: 'Yes',
      defensiveTransition: 'Counter Press', defLineBehaviour: 'Step Up More',
    },
    keyRoles: { ip: ['Box-to-Box Mid (2DM)','Box-to-Box Playmaker (2DM)','Channel Mid'], oop: ['Tracking CF','Pressing CM','Pressing DM (2DM)'] },
  },

  'Tiki-Taka': {
    label: 'Tiki-Taka',
    description: 'Dominates the match through a combination of intense pressing and a very patient short-passing offensive approach. A more extreme variant of Control Possession.',
    feedback: {
      pos: ['Dominates possession.', 'Wins the ball high up.'],
      neg: ['Slower tempo in transition to attack.', 'Requires very high technical quality.'],
    },
    tiIP: {
      passingDirectness: 'Much Shorter', passReception: 'Pass to Feet',
      buildupStrategy: 'Play Through Press', crossingStyle: 'Low',
      gkTarget: 'Centre-Backs', gkSpeed: 'Distribute Quickly',
      goalKicks: 'Short', tempo: 'Much Lower', attackingTransition: 'Hold Shape',
    },
    tiOOP: {
      defensiveLine: 'Higher', lineEngagement: 'High Press',
      triggerPress: 'More Often', shortGKDistr: 'Yes', defensiveTransition: 'Counter Press',
    },
    keyRoles: { ip: ['Deep-Lying Playmaker','Ball-Playing GK','Ball-Playing CB','Midfield Playmaker'], oop: ['Pressing CM','Tracking CF'] },
  },

  'Vertical Tiki-Taka': {
    label: 'Vertical Tiki-Taka',
    description: 'Dominates the match through intense pressing and short passes. Plays narrow in attack, creating triangles and fluid combination play in tight spaces.',
    feedback: {
      pos: ['Retains possession.', 'More combination play.'],
      neg: ['Offensive play can get congested in tight spaces.', 'Requires very high technical quality.'],
    },
    tiIP: {
      passingDirectness: 'Shorter', buildupStrategy: 'Play Through Press',
      crossingStyle: 'Low', creativeFreedom: 'More Expressive',
      progressThrough: 'Middle', gkTarget: 'Centre-Backs',
      goalKicks: 'Short', tempo: 'Lower', attackingWidth: 'Much Narrower', attackingTransition: 'Counter Attack',
    },
    tiOOP: {
      defensiveLine: 'Higher', lineEngagement: 'High Press',
      triggerPress: 'More Often', shortGKDistr: 'Yes', defensiveTransition: 'Counter Press',
    },
    keyRoles: { ip: ['Inside Winger','Channel Mid','Midfield Playmaker'], oop: ['Pressing CM','Tracking CF'] },
  },

  'Wing Play': {
    label: 'Wing Play',
    description: 'Looks to create high-quality crossing positions. Players make regular overlapping runs to overload the flanks in attack.',
    feedback: {
      pos: ['Avoids congested central zones.', 'Crosses can be a reliable source of chances.'],
      neg: ['More turnovers in attack.', 'Less effective against strong aerial defences.'],
    },
    tiIP: {
      passingDirectness: 'More Direct', progressThrough: 'Both Flanks',
      gkTarget: 'Full Backs', tempo: 'Higher', attackingWidth: 'Much Wider',
      attackingTransition: 'Counter Attack',
    },
    tiOOP: {
      lineEngagement: 'Mid Block', triggerPress: 'More Often', pressingTrap: 'Trap Outside',
    },
    keyRoles: { ip: ['Winger','Playmaking Wing Back','Advanced Wing Back'], oop: ['Tracking Wide Mid','Tracking Winger'] },
  },

  'Route One': {
    label: 'Route One',
    description: 'Looks to send the ball into the opposition half as quickly as possible. Avoids risk in own half by playing long balls to attackers.',
    feedback: {
      pos: ['Fewer turnovers near own goal.', 'Puts immediate pressure on the opposition defence.'],
      neg: ['Less possession.', 'Relies on physical superiority in attack.'],
    },
    tiIP: {
      passingDirectness: 'Much More Direct', buildupStrategy: 'Bypass Press',
      patience: 'Hit Early Crosses', setpieces: 'Play for Set Pieces',
      creativeFreedom: 'More Disciplined', goalKicks: 'Long',
      tempo: 'Higher', attackingTransition: 'Counter Attack',
    },
    tiOOP: {
      defensiveLine: 'Lower', lineEngagement: 'Mid Block',
      defensiveTransition: 'Regroup', tackling: 'Get Stuck In', pressingTrap: 'Trap Outside',
    },
    keyRoles: { ip: ['Target Forward','Winger','Wide Mid'], oop: ['Covering CB','Screening DM'] },
  },

  'Fluid Counter-Attack': {
    label: 'Fluid Counter-Attack',
    description: 'Draws the opposition in to leave them vulnerable on the break. Players are expressive on the counter, looking to combine and play through the opposition.',
    feedback: {
      pos: ['Draws the opposition in.', 'Unpredictable on the counter.'],
      neg: ['Less effective against defensive opponents.', 'Less possession.'],
    },
    tiIP: {
      passingDirectness: 'Shorter', passReception: 'Pass Into Space',
      gkSpeed: 'Distribute Quickly', tempo: 'Higher', attackingTransition: 'Counter Attack',
    },
    tiOOP: {
      defensiveLine: 'Lower', lineEngagement: 'Mid Block',
      triggerPress: 'More Often', defensiveTransition: 'Counter Press',
      tackling: 'Get Stuck In', defLineBehaviour: 'Drop Off More',
    },
    keyRoles: { ip: ['Wide Forward','Channel Forward','Inside Forward'], oop: ['Wide Outlet Winger','Central Outlet CF','Wide Outlet Mid'] },
  },

  'Direct Counter-Attack': {
    label: 'Direct Counter-Attack',
    description: 'Draws the opposition in to leave them vulnerable on the break. Players move the ball forward as quickly as possible to create chances.',
    feedback: {
      pos: ['Draws the opposition in.', 'Attacks with pace and directness.'],
      neg: ['Less effective against defensive opponents.', 'Less possession.'],
    },
    tiIP: {
      passingDirectness: 'More Direct', passReception: 'Pass Into Space',
      buildupStrategy: 'Bypass Press', gkSpeed: 'Distribute Quickly',
      tempo: 'Higher', attackingTransition: 'Counter Attack',
    },
    tiOOP: {
      defensiveLine: 'Lower', lineEngagement: 'Low Block',
      triggerPress: 'More Often', tackling: 'Get Stuck In', defLineBehaviour: 'Drop Off More',
    },
    keyRoles: { ip: ['Channel Forward','Wide Outlet Winger','Central Outlet CF'], oop: ['Central Outlet CF','Wide Outlet Winger'] },
  },

  'Catenaccio': {
    label: 'Catenaccio',
    description: 'A defence-focused style aimed at denying the opposition goalscoring opportunities. Traditionally uses 3 CBs for increased coverage and stability in defence.',
    feedback: {
      pos: ['Minimises offensive space for the opposition.', 'Less vulnerable to counter-attacks.'],
      neg: ['Creates fewer offensive chances.', 'Much less possession.'],
    },
    tiIP: {
      passingDirectness: 'More Direct', buildupStrategy: 'Bypass Press',
      setpieces: 'Play for Set Pieces', creativeFreedom: 'More Disciplined',
      gkSpeed: 'Slow Pace Down', tempo: 'Lower', attackingWidth: 'Narrower',
      attackingTransition: 'Counter Attack',
    },
    tiOOP: {
      defensiveLine: 'Lower', lineEngagement: 'Low Block', triggerPress: 'Less Often',
      defensiveTransition: 'Regroup',
    },
    keyRoles: { ip: ['No-Nonsense CB','No-Nonsense GK','Deep-Lying Forward'], oop: ['Covering CB','Screening DM','Holding WB'] },
  },

  'Park the Bus': {
    label: 'Park the Bus',
    description: 'A defence-first approach looking to restrict opposition chances. Concedes possession and looks to exploit counter-attacks and set pieces.',
    feedback: {
      pos: ['Minimises offensive space for the opposition.', 'Less vulnerable to counter-attacks.'],
      neg: ['Creates fewer offensive chances.', 'Much less possession.'],
    },
    tiIP: {
      passingDirectness: 'More Direct', passReception: 'Pass Into Space',
      buildupStrategy: 'Bypass Press', patience: 'Hit Early Crosses',
      setpieces: 'Play for Set Pieces', creativeFreedom: 'More Disciplined',
      gkSpeed: 'Slow Pace Down', goalKicks: 'Long',
      tempo: 'Lower', attackingWidth: 'Narrower',
    },
    tiOOP: {
      defensiveLine: 'Lower', lineEngagement: 'Low Block',
      triggerPress: 'Less Often', defensiveTransition: 'Regroup',
      tackling: 'Get Stuck In', defLineBehaviour: 'Drop Off More',
    },
    keyRoles: { ip: ['Central Outlet CF','Wide Outlet Winger'], oop: ['Covering CB','Holding WB','Holding FB','Screening DM'] },
  },
}

export const PLAY_STYLE_KEYS = Object.keys(PLAY_STYLES)
