// combat-movement-utils.js

// Get saving throw target by class and save type
export function getSavingThrow(rules, className, level = 1, saveType) {
  return rules.classes[className]?.saving_throws?.[saveType] ?? null;
}

// Calculate initiative modifier
export function getInitiativeModifier(stats, race, isDeaf = false, isBlinded = false) {
  let mod = getModifier(stats.DEX || 10);
  if (isDeaf) mod -= 1;
  if (isBlinded) mod -= 2;
  return mod;
}

// Check if surprise is triggered (returns true if surprised)
export function checkSurprise(race, isDeaf = false, isBlinded = false) {
  const roll = Math.floor(Math.random() * 6) + 1;
  const elfMods = { normal: 1, deaf: 2, blind: 3 };
  if (race === "Elf") {
    if (isBlinded) return roll <= elfMods.blind;
    if (isDeaf) return roll <= elfMods.deaf;
    return roll <= elfMods.normal;
  }
  if (isBlinded) return roll <= 4;
  if (isDeaf) return roll <= 3;
  return roll <= 2;
}

// Get movement rate based on armor and encumbrance
export function getMovementRate(rules, armor, loadType = 'light') {
  return rules.movement_encumbrance.movement_by_armor[armor]?.[loadType] || '30\'';
}

// Get wilderness travel distance based on encounter movement
export function getWildernessTravel(rules, encounterMove) {
  return rules.movement_encumbrance.wilderness_movement[encounterMove] || 0;
}

// Helper: Basic stat modifier logic (used in initiative)
export function getModifier(score) {
  if (score <= 3) return -3;
  if (score <= 5) return -2;
  if (score <= 8) return -1;
  if (score <= 12) return 0;
  if (score <= 15) return 1;
  if (score <= 17) return 2;
  return 3;
}


