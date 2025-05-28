
/**
 * rules-utils.js - Applies hardcoded BFRPG racial bonuses without altering the JSON.
 */

// Modifier from score (standard BFRPG scale)
export function getModifier(score) {
  if (score <= 3) return -3;
  if (score <= 5) return -2;
  if (score <= 8) return -1;
  if (score <= 12) return 0;
  if (score <= 15) return 1;
  if (score <= 17) return 2;
  return 3;
}

// Calculate AC based on gear, DEX mod, and shield use
export function calculateAC(rules, gear, dexMod = 0) {
  const armorData = rules.equipment.armor[gear.armor] || { ac: 11, weight: 0 };
  const shieldBonus = gear.shield ? (rules.equipment.armor["Shield"]?.ac_bonus || 0) : 0;
  return armorData.ac + shieldBonus + dexMod;
}

// Generate list of valid classes for a character given stats and race
export function getEligibleClasses(rules, stats, raceName) {
  const race = rules.races[raceName];
  if (!race) return [];
  return race.classes.filter(cls => {
    const clsData = rules.classes[cls];
    if (!clsData || !clsData.prime_requisite || !clsData.min_score) return false;
    return stats[clsData.prime_requisite] >= clsData.min_score;
  });
}

// Apply racial bonuses using hardcoded BFRPG logic
export function applyRacialBonuses(stats, raceData) {
  const adjusted = { ...stats };
  const raceName = raceData.name || raceData.title || 'Unknown';

  const racialLogic = {
    Dwarf: { CON: 1, CHA: -1 },
    Elf: { INT: 1, CON: -1 },
    Halfling: { DEX: 1, STR: -1 },
    Human: {}
  };

  const bonuses = racialLogic[raceName] || {};
  for (const [stat, mod] of Object.entries(bonuses)) {
    adjusted[stat] += mod;
  }

  return adjusted;
}

// Perform 2:1 stat trade to reach minimum 9 in prime requisites
export function applyTwoToOne(stats, primeStats) {
  const adjusted = { ...stats };
  for (const prime of primeStats) {
    while (adjusted[prime] < 9) {
      const donors = Object.keys(adjusted)
        .filter(stat => !primeStats.includes(stat) && adjusted[stat] > 9)
        .sort((a, b) => adjusted[b] - adjusted[a]);
      if (donors.length === 0) return null;
      const donor = donors[0];
      adjusted[donor] -= 2;
      adjusted[prime] += 1;
    }
  }
  return adjusted;
}

// Compute base HP with Constitution modifier
export function rollHP(hitDie, conMod) {
  const roll = Math.floor(Math.random() * hitDie) + 1;
  return Math.max(1, roll + conMod);
}
