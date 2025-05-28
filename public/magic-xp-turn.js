// magic-xp-turn.js

// Retrieve all first-level spells for a given class
export function getFirstLevelSpells(rules, className) {
  return rules.spells[className]?.["1"] || [];
}

// Format spell description for tooltip or display
export function formatSpell(spell) {
  return `${spell.name} [${spell.range}, ${spell.duration}]: ${spell.description}`;
}

// Get XP needed for next level
export function getXPThreshold(rules, className, level = 2) {
  return rules.experience[className]?.[`level_${level}`] || null;
}

// Check if current XP meets the threshold for level-up
export function checkLevelUp(currentXP, rules, className, currentLevel = 1) {
  const threshold = getXPThreshold(rules, className, currentLevel + 1);
  return threshold ? currentXP >= threshold : false;
}

// Turn Undead table lookup
export function getTurnUndeadTargetNumber(rules, clericLevel, undeadType) {
  const undeadList = rules.turn_undead.levels;
  const levelKey = `Cleric_Level_${clericLevel}`;
  if (!rules.turn_undead[levelKey]) return null;
  const index = undeadList.indexOf(undeadType);
  return index >= 0 ? rules.turn_undead[levelKey][index] : null;
}

