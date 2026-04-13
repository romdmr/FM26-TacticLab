/**
 * Positions fixes sur le terrain FM26
 * Coordonnées [x%, y%] — y=0 but adverse (haut), y=100 but propre (bas)
 * Chaque position a un type de poste associé qui détermine les rôles disponibles
 */

export const PITCH_POSITIONS = {
  // Gardien
  GK:   { x: 50,  y: 91, type: 'GK',   label: 'GK',    name: 'Goalkeeper',               zone: 'defense' },
  // Défenseurs
  FBL:  { x: 10,  y: 74, type: 'FB',   label: 'FBL',   name: 'Full Back Left',            zone: 'defense' },
  CDL:  { x: 30,  y: 70, type: 'CB',   label: 'CDL',   name: 'Centre Back Left',          zone: 'defense' },
  CDC:  { x: 50,  y: 69, type: 'CB',   label: 'CDC',   name: 'Centre Back Centre',        zone: 'defense' },
  CDR:  { x: 70,  y: 70, type: 'CB',   label: 'CDR',   name: 'Centre Back Right',         zone: 'defense' },
  FBR:  { x: 90,  y: 74, type: 'FB',   label: 'FBR',   name: 'Full Back Right',           zone: 'defense' },
  // Wing backs
  WBL:  { x: 8,   y: 58, type: 'WB',   label: 'WBL',   name: 'Wing Back Left',            zone: 'midlow'  },
  WBR:  { x: 92,  y: 58, type: 'WB',   label: 'WBR',   name: 'Wing Back Right',           zone: 'midlow'  },
  // Milieux défensifs
  DML:  { x: 30,  y: 57, type: 'DM',   label: 'DML',   name: 'Defensive Mid Left',        zone: 'midlow'  },
  DMC:  { x: 50,  y: 56, type: 'DM',   label: 'DMC',   name: 'Defensive Mid Centre',      zone: 'midlow'  },
  DMR:  { x: 70,  y: 57, type: 'DM',   label: 'DMR',   name: 'Defensive Mid Right',       zone: 'midlow'  },
  // Milieux larges
  ML:   { x: 8,   y: 46, type: 'MRL',  label: 'ML',    name: 'Midfielder Left',           zone: 'mid'     },
  MR:   { x: 92,  y: 46, type: 'MRL',  label: 'MR',    name: 'Midfielder Right',          zone: 'mid'     },
  // Milieux centraux
  CML:  { x: 30,  y: 46, type: 'CM',   label: 'CML',   name: 'Central Mid Left',          zone: 'mid'     },
  CMC:  { x: 50,  y: 44, type: 'CM',   label: 'CMC',   name: 'Central Mid Centre',        zone: 'mid'     },
  CMR:  { x: 70,  y: 46, type: 'CM',   label: 'CMR',   name: 'Central Mid Right',         zone: 'mid'     },
  // Milieux offensifs larges
  AML:  { x: 8,   y: 32, type: 'AMRL', label: 'AML',   name: 'Attacking Mid Left',        zone: 'midhigh' },
  AMR:  { x: 92,  y: 32, type: 'AMRL', label: 'AMR',   name: 'Attacking Mid Right',       zone: 'midhigh' },
  // Milieux offensifs centraux (CAM)
  CAML: { x: 30,  y: 30, type: 'AMC',  label: 'CAML',  name: 'Central Att. Mid Left',     zone: 'midhigh' },
  CAMC: { x: 50,  y: 28, type: 'AMC',  label: 'CAMC',  name: 'Central Att. Mid Centre',   zone: 'midhigh' },
  CAMR: { x: 70,  y: 30, type: 'AMC',  label: 'CAMR',  name: 'Central Att. Mid Right',    zone: 'midhigh' },
  // Attaquants
  STL:  { x: 25,  y: 14, type: 'ST',   label: 'STL',   name: 'Striker Left',              zone: 'attack'  },
  STC:  { x: 50,  y: 12, type: 'ST',   label: 'STC',   name: 'Striker Centre',            zone: 'attack'  },
  STR:  { x: 75,  y: 14, type: 'ST',   label: 'STR',   name: 'Striker Right',             zone: 'attack'  },
}

// Rayon de snap en % du terrain (distance pour déclencher le lock sur une position)
export const SNAP_RADIUS = 8

// Renvoie la position la plus proche d'un point (x,y) dans le rayon de snap
export function findNearestPosition(x, y, excludePositionId = null) {
  let nearest = null
  let minDist = Infinity

  for (const [id, pos] of Object.entries(PITCH_POSITIONS)) {
    if (id === excludePositionId) continue
    const dx = x - pos.x
    const dy = y - pos.y
    const dist = Math.sqrt(dx * dx + dy * dy)
    if (dist < minDist) {
      minDist = dist
      nearest = { id, pos, dist }
    }
  }

  return nearest && nearest.dist <= SNAP_RADIUS ? nearest : null
}

// Formations prédéfinies : liste de position IDs
export const FORMATIONS_IP = {
  '4-3-3':   ['GK','FBL','CDL','CDR','FBR','CML','CMC','CMR','AML','STC','AMR'],
  '4-2-3-1': ['GK','FBL','CDL','CDR','FBR','DML','DMR','AML','CAMC','AMR','STC'],
  '4-4-2':   ['GK','FBL','CDL','CDR','FBR','ML','CML','CMR','MR','STL','STR'],
  '3-5-2':   ['GK','CDL','CDC','CDR','WBL','DML','CMC','DMR','WBR','STL','STR'],
  '3-4-3':   ['GK','CDL','CDC','CDR','WBL','CML','CMR','WBR','AML','STC','AMR'],
  '4-1-4-1': ['GK','FBL','CDL','CDR','FBR','DMC','ML','CML','CMR','MR','STC'],
  '4-3-2-1': ['GK','FBL','CDL','CDR','FBR','CML','CMC','CMR','CAML','CAMR','STC'],
  '4-2-2-2': ['GK','FBL','CDL','CDR','FBR','DML','DMR','AML','AMR','STL','STR'],
}

export const FORMATIONS_OOP = {
  '4-4-2':   ['GK','FBL','CDL','CDR','FBR','ML','CML','CMR','MR','STL','STR'],
  '4-5-1':   ['GK','FBL','CDL','CDR','FBR','ML','CML','CMC','CMR','MR','STC'],
  '5-4-1':   ['GK','WBL','CDL','CDC','CDR','WBR','ML','CML','CMR','MR','STC'],
  '5-3-2':   ['GK','WBL','CDL','CDC','CDR','WBR','DML','CMC','DMR','STL','STR'],
  '4-3-3':   ['GK','FBL','CDL','CDR','FBR','CML','CMC','CMR','AML','STC','AMR'],
  '4-1-4-1': ['GK','FBL','CDL','CDR','FBR','DMC','ML','CML','CMR','MR','STC'],
  '4-2-3-1': ['GK','FBL','CDL','CDR','FBR','DML','DMR','AML','CAMC','AMR','STC'],
  '4-4-2 (DM)':['GK','FBL','CDL','CDR','FBR','DML','DMR','ML','MR','STL','STR'],
}
