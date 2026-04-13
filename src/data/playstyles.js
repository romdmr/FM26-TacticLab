/**
 * FM26 — Styles de jeu officiels
 * Source: captures d'écran FM26 in-game
 * Chaque style a : description, staff feedback +/-, TI IP par défaut, TI OOP par défaut
 */
export const PLAY_STYLES = {
  'Control Possession': {
    label: 'Control Possession',
    description: 'Se concentre sur la conservation du ballon et la récupération rapide. Joue depuis la défense et crée des occasions par une construction patiente en passes courtes.',
    feedback: {
      pos: ['Conserve le ballon.', 'Joue sur l\'avant du pied.'],
      neg: ['Sortie de défense risquée.', 'Tempo plus lent vers l\'attaque.'],
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
    description: 'S\'appuie sur un travail intense de tous les joueurs. Condition physique et mobilité sont primordiales pour presser immédiatement après avoir perdu le ballon.',
    feedback: {
      pos: ['Récupère le ballon haut sur le terrain.', 'L\'intensité haute peut déstabiliser l\'adversaire.'],
      neg: ['Très éprouvant pour les joueurs.', 'Approche axée sur les turnovers = moins de contrôle.'],
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
    description: 'Domine le match par une combinaison de pressing intense et d\'une approche offensive très patiente en passes courtes. Variante plus extrême du Control Possession.',
    feedback: {
      pos: ['Domine la possession.', 'Récupère le ballon haut.'],
      neg: ['Tempo plus lent vers l\'attaque.', 'Requiert un très haut niveau technique.'],
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
    description: 'Domine le match par pressing intense et passes courtes. Joue étroit en attaque, créant des triangles et des jeux de combinaison fluides dans des espaces restreints.',
    feedback: {
      pos: ['Conserve la possession.', 'Plus de jeux de combinaison.'],
      neg: ['Le jeu offensif peut se congestionner dans des espaces serrés.', 'Requiert un très haut niveau technique.'],
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
    description: 'Cherche à se créer des positions de centre en haute qualité. Les joueurs font des chevauchements réguliers pour surcharger les flancs en attaque.',
    feedback: {
      pos: ['Évite de jouer dans des zones centrales congestionnées.', 'Les centres peuvent être une source fiable d\'occasions.'],
      neg: ['Plus de pertes de balle en attaque.', 'Moins efficace contre les défenses fortes dans les airs.'],
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
    description: 'Cherche à envoyer le ballon en zone adverse le plus rapidement possible. Évite les risques dans sa propre moitié en jouant des passes longues vers les attaquants.',
    feedback: {
      pos: ['Moins de pertes de balle près de son propre but.', 'Met une pression immédiate sur la défense adverse.'],
      neg: ['Moins de possession.', 'Dépend de la supériorité physique en attaque.'],
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
    description: 'Attire l\'adversaire pour le laisser vulnérable sur le break. Les joueurs seront expressifs sur le contre, cherchant à combiner et jouer à travers l\'adversaire.',
    feedback: {
      pos: ['Attire l\'opposition.', 'Imprévisible sur le contre.'],
      neg: ['Moins efficace contre les adversaires défensifs.', 'Moins de possession.'],
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
    description: 'Attire l\'adversaire pour le laisser vulnérable sur le break. Les joueurs envoient le ballon vers l\'avant le plus rapidement possible pour créer des occasions.',
    feedback: {
      pos: ['Attire l\'opposition.', 'Attaque avec vitesse et directness.'],
      neg: ['Moins efficace contre les adversaires défensifs.', 'Moins de possession.'],
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
    description: 'Style axé sur la défense visant à priver l\'adversaire d\'occasions. Utilise traditionnellement 3 CBs pour une couverture et une stabilité accrues en défense.',
    feedback: {
      pos: ['Minimise l\'espace offensif pour l\'adversaire.', 'Moins vulnérable aux contre-attaques.'],
      neg: ['Crée moins d\'occasions offensives.', 'Beaucoup moins de possession.'],
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
    description: 'Approche défense-d\'abord cherchant à restreindre les occasions adverses. Cède la possession et exploite les contre-attaques et coups de pied arrêtés.',
    feedback: {
      pos: ['Minimise l\'espace offensif pour l\'adversaire.', 'Moins vulnérable aux contre-attaques.'],
      neg: ['Crée moins d\'occasions offensives.', 'Beaucoup moins de possession.'],
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
