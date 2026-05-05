/**
 * FM26 — Attributs clés et préférés par rôle
 * Source: sortitoutsi.net FM26 Important Attributes guide
 */
export const ROLE_ATTRIBUTES = {
  // ── GOALKEEPERS ─────────────────────────────────────────────────────────
  'Goalkeeper': {
    key: ['Aerial Reach','Command of Area','Communication','Handling','Reflexes','Agility','Concentration','Positioning'],
    preferred: ['Kicking','One on Ones','Throwing','Anticipation','Decisions'],
    unnecessary: ['Eccentricity'],
  },
  'Ball-Playing GK': {
    key: ['Aerial Reach','Command of Area','Communication','Handling','Kicking','Reflexes','Agility','Concentration','Positioning'],
    preferred: ['Eccentricity','One on Ones','Throwing','Anticipation','Composure','Decisions','Passing'],
    unnecessary: [],
  },
  'No-Nonsense GK': {
    key: ['Aerial Reach','Command of Area','Communication','Handling','Reflexes','Agility','Concentration','Positioning'],
    preferred: ['One on Ones','Anticipation','Decisions'],
    unnecessary: ['Eccentricity','Passing'],
  },
  'Line-Holding Keeper': {
    key: ['Positioning','Concentration'],
    preferred: [],
    unnecessary: [],
  },
  'Sweeper Keeper': {
    key: ['Rushing Out','Anticipation','Decisions'],
    preferred: [],
    unnecessary: [],
  },

  // ── CENTRE BACKS ─────────────────────────────────────────────────────────
  'Centre-Back': {
    key: ['Heading','Marking','Tackling','Anticipation','Positioning','Jumping','Strength'],
    preferred: ['Aggression','Bravery','Composure','Concentration','Decisions','Pace'],
    unnecessary: ['Passing'],
  },
  'Ball-Playing CB': {
    key: ['Heading','Marking','Passing','Tackling','Anticipation','Composure','Positioning','Jumping','Strength'],
    preferred: ['First Touch','Technique','Aggression','Bravery','Concentration','Decisions','Vision','Pace'],
    unnecessary: [],
  },
  'No-Nonsense CB': {
    key: ['Heading','Marking','Tackling','Anticipation','Positioning','Jumping','Strength'],
    preferred: ['Aggression','Bravery','Concentration','Pace'],
    unnecessary: ['Passing','Composure'],
  },
  'Wide CB (3CB)': {
    key: ['Heading','Marking','Tackling','Anticipation','Positioning','Jumping','Strength'],
    preferred: ['Dribbling','Aggression','Bravery','Composure','Concentration','Decisions','Work Rate','Acceleration','Agility','Pace','Stamina'],
    unnecessary: ['Passing'],
  },
  'Advanced CB': {
    key: ['Heading','Marking','Passing','Tackling','Technique','Anticipation','Composure','Decisions','Positioning','Team Work','Jumping','Strength'],
    preferred: ['Dribbling','First Touch','Aggression','Bravery','Concentration','Vision','Pace','Stamina'],
    unnecessary: [],
  },
  'Overlapping CB (3CB)': {
    key: ['Crossing','Heading','Marking','Tackling','Anticipation','Work Rate','Jumping','Pace','Stamina','Strength'],
    preferred: ['Dribbling','Technique','Aggression','Bravery','Composure','Concentration','Decisions','Off the Ball','Positioning','Acceleration','Agility'],
    unnecessary: [],
  },
  'Centre Back': {
    key: ['Heading','Marking','Tackling','Anticipation','Positioning','Jumping','Strength'],
    preferred: ['Aggression','Bravery','Composure','Concentration','Decisions','Pace'],
    unnecessary: ['Passing'],
  },
  'Covering CB': {
    key: ['Anticipation','Pace','Marking'],
    preferred: [],
    unnecessary: [],
  },
  'Stopping CB': {
    key: ['Aggression','Tackling','Strength'],
    preferred: [],
    unnecessary: [],
  },
  'Covering Wide CB': { key: ['Anticipation','Pace','Marking'], preferred: [], unnecessary: [] },
  'Stopping Wide CB': { key: ['Aggression','Tackling','Strength'], preferred: [], unnecessary: [] },

  // ── FULL BACKS ───────────────────────────────────────────────────────────
  'Full Back': {
    key: ['Marking','Tackling','Anticipation','Concentration','Positioning','Team Work','Acceleration'],
    preferred: ['Crossing','Dribbling','Passing','Technique','Decisions','Work Rate','Agility','Pace','Stamina'],
    unnecessary: [],
  },
  'Inside Full Back': {
    key: ['Heading','Marking','Tackling','Anticipation','Positioning','Strength'],
    preferred: ['Dribbling','Aggression','Bravery','Composure','Concentration','Decisions','Work Rate','Acceleration','Agility','Jumping','Pace','Stamina'],
    unnecessary: [],
  },
  'Holding FB': {
    key: ['Positioning','Concentration','Marking'],
    preferred: [], unnecessary: [],
  },
  'Pressing FB': {
    key: ['Aggression','Work Rate','Anticipation'],
    preferred: [], unnecessary: [],
  },

  // ── WING BACKS ───────────────────────────────────────────────────────────
  'Wing Back': {
    key: ['Crossing','Marking','Tackling','Team Work','Work Rate','Acceleration','Pace','Stamina'],
    preferred: ['Dribbling','First Touch','Passing','Technique','Anticipation','Concentration','Decisions','Off the Ball','Positioning','Agility','Balance'],
    unnecessary: [],
  },
  'Inside Wing Back': {
    key: ['Passing','Tackling','Anticipation','Composure','Decisions','Positioning','Team Work','Acceleration'],
    preferred: ['First Touch','Marking','Technique','Concentration','Work Rate','Agility','Pace','Stamina'],
    unnecessary: [],
  },
  'Playmaking Wing Back': {
    key: ['First Touch','Passing','Tackling','Technique','Composure','Decisions','Positioning','Team Work','Vision','Acceleration'],
    preferred: ['Crossing','Dribbling','Marking','Anticipation','Concentration','Off the Ball','Work Rate','Agility','Pace','Stamina'],
    unnecessary: [],
  },
  'Advanced Wing Back': {
    key: ['Crossing','Dribbling','Technique','Off the Ball','Team Work','Work Rate','Acceleration','Agility','Pace','Stamina'],
    preferred: ['First Touch','Marking','Passing','Tackling','Anticipation','Decisions','Flair','Positioning','Balance'],
    unnecessary: [],
  },
  'Holding WB': { key: ['Positioning','Concentration','Marking'], preferred: [], unnecessary: [] },
  'Pressing WB': { key: ['Aggression','Work Rate','Anticipation'], preferred: [], unnecessary: [] },

  // ── DEFENSIVE MIDS ──────────────────────────────────────────────────────
  'Defensive Mid': {
    key: ['Tackling','Anticipation','Concentration','Positioning','Team Work'],
    preferred: ['First Touch','Marking','Passing','Aggression','Composure','Decisions','Work Rate','Stamina','Strength'],
    unnecessary: [],
  },
  'Box-to-Box Mid (2DM)': {
    key: ['Passing','Tackling','Off the Ball','Team Work','Work Rate','Stamina'],
    preferred: ['Dribbling','Finishing','First Touch','Long Shots','Technique','Aggression','Anticipation','Composure','Decisions','Positioning','Acceleration','Balance','Pace','Strength'],
    unnecessary: [],
  },
  'Box-to-Box Playmaker (2DM)': {
    key: ['First Touch','Passing','Technique','Composure','Decisions','Off the Ball','Team Work','Vision','Work Rate','Stamina'],
    preferred: ['Dribbling','Marking','Tackling','Anticipation','Positioning','Acceleration','Agility','Balance','Pace'],
    unnecessary: [],
  },
  'Deep-Lying Playmaker': {
    key: ['First Touch','Passing','Technique','Composure','Decisions','Off the Ball','Team Work','Vision'],
    preferred: ['Marking','Tackling','Anticipation','Concentration','Positioning','Work Rate','Balance','Stamina'],
    unnecessary: [],
  },
  'Half Back': {
    key: ['Heading','Marking','Tackling','Anticipation','Concentration','Positioning','Team Work','Jumping','Strength'],
    preferred: ['First Touch','Passing','Aggression','Bravery','Composure','Decisions','Work Rate','Stamina'],
    unnecessary: [],
  },
  'Dropping DM': { key: ['Positioning','Decisions','Anticipation'], preferred: [], unnecessary: [] },
  'Pressing DM (2DM)': { key: ['Aggression','Work Rate','Anticipation'], preferred: [], unnecessary: [] },
  'Screening DM': { key: ['Positioning','Concentration','Marking'], preferred: [], unnecessary: [] },
  'Wide Covering DM (2DM)': { key: ['Anticipation','Pace','Work Rate'], preferred: [], unnecessary: [] },

  // ── CENTRAL MIDS ────────────────────────────────────────────────────────
  'Central Mid': {
    key: ['First Touch','Passing','Tackling','Decisions','Team Work'],
    preferred: ['Technique','Anticipation','Composure','Concentration','Off the Ball','Positioning','Vision','Work Rate','Stamina'],
    unnecessary: [],
  },
  'Attacking Mid': {
    key: ['First Touch','Long Shots','Passing','Technique','Composure','Flair','Off the Ball'],
    preferred: ['Crossing','Dribbling','Finishing','Anticipation','Decisions','Vision','Acceleration','Agility'],
    unnecessary: [],
  },
  'Advanced Playmaker': {
    key: ['First Touch','Passing','Technique','Composure','Decisions','Off the Ball','Team Work','Vision'],
    preferred: ['Crossing','Dribbling','Anticipation','Flair','Acceleration','Agility'],
    unnecessary: [],
  },
  'Channel Mid': {
    key: ['Crossing','First Touch','Passing','Technique','Composure','Off the Ball','Work Rate','Acceleration'],
    preferred: ['Dribbling','Long Shots','Anticipation','Decisions','Flair','Vision','Agility','Pace','Stamina'],
    unnecessary: [],
  },
  'Midfield Playmaker': {
    key: ['First Touch','Passing','Technique','Composure','Decisions','Off the Ball','Team Work','Vision'],
    preferred: ['Dribbling','Tackling','Anticipation','Flair','Positioning','Work Rate','Agility','Stamina'],
    unnecessary: [],
  },
  'Wide Central Mid (2CM)': {
    key: ['First Touch','Passing','Tackling','Decisions','Team Work'],
    preferred: ['Crossing','Dribbling','Technique','Anticipation','Composure','Concentration','Off the Ball','Positioning','Vision','Work Rate','Agility','Stamina'],
    unnecessary: [],
  },
  'Pressing CM': { key: ['Aggression','Work Rate','Anticipation'], preferred: [], unnecessary: [] },
  'Screening CM': { key: ['Positioning','Concentration','Marking'], preferred: [], unnecessary: [] },
  'Wide Covering CM (2CM)': { key: ['Anticipation','Pace','Work Rate'], preferred: [], unnecessary: [] },

  // ── WIDE MIDS ───────────────────────────────────────────────────────────
  'Wide Mid': {
    key: ['Crossing','Passing','Technique','Team Work','Work Rate','Pace','Stamina'],
    preferred: ['Dribbling','First Touch','Anticipation','Composure','Off the Ball','Vision','Acceleration','Agility'],
    unnecessary: [],
  },
  'Tracking Wide Mid': { key: ['Marking','Work Rate','Stamina'], preferred: [], unnecessary: [] },
  'Wide Outlet Mid': { key: ['Off the Ball','Pace','Anticipation'], preferred: [], unnecessary: [] },

  // ── WIDE ATTACKERS ──────────────────────────────────────────────────────
  'Winger': {
    key: ['Crossing','Dribbling','Technique','Team Work','Acceleration','Agility','Pace'],
    preferred: ['First Touch','Passing','Anticipation','Flair','Off the Ball','Work Rate','Balance','Stamina'],
    unnecessary: [],
  },
  'Inside Winger': {
    key: ['Dribbling','First Touch','Technique','Composure','Team Work','Acceleration','Agility'],
    preferred: ['Crossing','Long Shots','Passing','Anticipation','Flair','Off the Ball','Vision','Work Rate','Balance','Pace','Stamina'],
    unnecessary: [],
  },
  'Playmaking Winger': {
    key: ['Crossing','Dribbling','First Touch','Passing','Technique','Composure','Decisions','Off the Ball','Team Work','Vision','Acceleration'],
    preferred: ['Anticipation','Flair','Work Rate','Agility','Pace','Stamina'],
    unnecessary: [],
  },
  'Inside Forward': {
    key: ['Dribbling','First Touch','Technique','Anticipation','Composure','Off the Ball','Acceleration','Agility'],
    preferred: ['Crossing','Finishing','Long Shots','Passing','Flair','Vision','Work Rate','Balance','Pace','Stamina'],
    unnecessary: [],
  },
  'Wide Forward': {
    key: ['Dribbling','First Touch','Technique','Anticipation','Off the Ball','Acceleration','Agility','Pace'],
    preferred: ['Crossing','Finishing','Passing','Composure','Flair','Work Rate','Balance','Stamina'],
    unnecessary: [],
  },
  'Tracking Winger': { key: ['Marking','Work Rate','Stamina'], preferred: [], unnecessary: [] },
  'Inside Outlet Winger': { key: ['Off the Ball','Decisions','Anticipation'], preferred: [], unnecessary: [] },
  'Wide Outlet Winger': { key: ['Off the Ball','Pace','Anticipation'], preferred: [], unnecessary: [] },

  // ── ATTACKING MIDS (AMC) ─────────────────────────────────────────────────
  'Second Striker': {
    key: ['Finishing','First Touch','Anticipation','Composure','Off the Ball','Acceleration'],
    preferred: ['Dribbling','Long Shots','Passing','Technique','Concentration','Decisions','Work Rate','Agility','Pace','Stamina'],
    unnecessary: [],
  },
  'Free Role': {
    key: ['Dribbling','First Touch','Long Shots','Passing','Technique','Composure','Flair','Off the Ball','Vision'],
    preferred: ['Crossing','Finishing','Anticipation','Decisions','Acceleration','Agility'],
    unnecessary: [],
  },
  'Tracking AM': { key: ['Marking','Work Rate','Stamina'], preferred: [], unnecessary: [] },
  'Central Outlet AM': { key: ['Off the Ball','Decisions','Anticipation'], preferred: [], unnecessary: [] },
  'Splitting Outlet AM (2AM)': { key: ['Off the Ball','Pace','Anticipation'], preferred: [], unnecessary: [] },

  // ── STRIKERS ────────────────────────────────────────────────────────────
  'Centre Forward': {
    key: ['Finishing','First Touch','Heading','Technique','Composure','Off the Ball','Acceleration','Strength'],
    preferred: ['Dribbling','Passing','Anticipation','Decisions','Agility','Balance','Jumping','Pace'],
    unnecessary: [],
  },
  'Channel Forward': {
    key: ['Dribbling','Finishing','First Touch','Technique','Composure','Off the Ball','Work Rate','Acceleration'],
    preferred: ['Crossing','Heading','Passing','Anticipation','Decisions','Agility','Balance','Pace','Stamina'],
    unnecessary: [],
  },
  'Deep-Lying Forward': {
    key: ['Finishing','First Touch','Technique','Composure','Off the Ball','Strength'],
    preferred: ['Dribbling','Passing','Anticipation','Decisions','Team Work','Vision','Balance'],
    unnecessary: [],
  },
  'False 9': {
    key: ['Dribbling','First Touch','Passing','Technique','Composure','Decisions','Off the Ball','Team Work','Vision','Acceleration'],
    preferred: ['Finishing','Anticipation','Flair','Agility','Balance'],
    unnecessary: [],
  },
  'Poacher': {
    key: ['Finishing','Heading','Anticipation','Composure','Concentration','Off the Ball','Acceleration'],
    preferred: ['First Touch','Technique','Decisions','Balance'],
    unnecessary: [],
  },
  'Target Forward': {
    key: ['Finishing','Heading','Aggression','Bravery','Composure','Off the Ball','Balance','Jumping','Strength'],
    preferred: ['First Touch','Anticipation','Decisions','Team Work'],
    unnecessary: [],
  },
  'Tracking CF': { key: ['Marking','Work Rate','Stamina'], preferred: [], unnecessary: [] },
  'Central Outlet CF': { key: ['Off the Ball','Decisions','Anticipation'], preferred: [], unnecessary: [] },
  'Splitting Outlet CF (2ST)': { key: ['Off the Ball','Pace','Anticipation'], preferred: [], unnecessary: [] },
}
