
// main.js

import { getModifier, calculateAC, getEligibleClasses, applyRacialBonuses, applyTwoToOne, rollHP } from './rules-utils.js';
import { getFirstLevelSpells, formatSpell, getXPThreshold, checkLevelUp, getTurnUndeadTargetNumber } from './magic-xp-turn.js';
import { getSavingThrow, getInitiativeModifier, checkSurprise, getMovementRate, getWildernessTravel } from './combat-movement-utils.js';

let rules = {};
let currentGold = 0;

const log = document.getElementById('log');
const charStats = document.getElementById('charStats');
const raceSelect = document.getElementById('raceSelect');
const classSelect = document.getElementById('classSelect');
const hpDisplay = document.getElementById('hpDisplay');
const acDisplay = document.getElementById('acDisplay');
const goldDisplay = document.getElementById('goldDisplay');
const gearDisplay = document.getElementById('gearDisplay');

fetch('./bfrpg_beginner_essentials_compact.json')
  .then(res => res.json())
  .then(data => {
    rules = data;
    populateRaceOptions();
  });

function logMessage(msg) {
  const p = document.createElement('p');
  p.textContent = msg;
  log.appendChild(p);
  log.scrollTop = log.scrollHeight;
}

function roll3d6() {
  return Array.from({ length: 3 }, () => Math.floor(Math.random() * 6) + 1).reduce((a, b) => a + b);
}

function rollDice(notation) {
  const [num, die] = notation.toLowerCase().split('d').map(Number);
  const rolls = Array.from({ length: num }, () => Math.floor(Math.random() * die) + 1);
  const total = rolls.reduce((a, b) => a + b, 0);
  logMessage(`${notation} result: [${rolls.join(', ')}] = ${total}`);
  }

function muneFateRoll() {
  const roll = Math.floor(Math.random() * 6) + 1;
  const result = roll <= 1 ? 'Strong No' : roll <= 3 ? 'No' : roll <= 5 ? 'Yes' : 'Strong Yes';
  logMessage(`MUNE Fate Roll: ${roll} → ${result}`);
}

function generateTwist() {
  const subject = ["an NPC", "a location", "a goal", "a clue", "a monster", "the environment"][Math.floor(Math.random() * 6)];
  const action = ["appears unexpectedly", "changes meaning", "becomes dangerous", "reveals a secret", "alters the plan", "draws attention"][Math.floor(Math.random() * 6)];
  logMessage(`Twist: ${subject} ${action}.`);
}

function populateRaceOptions() {
  raceSelect.innerHTML = '';
  Object.keys(rules.races).forEach(race => {
    const opt = document.createElement('option');
    opt.value = race;
    opt.textContent = race;
    raceSelect.appendChild(opt);
  });
  
  raceSelect.onchange = () => {
  if (document.getElementById("stat-STR")) {
    applyRaceModifiers();
  }
  };
}

function applyRaceModifiers() {
  const stats = {};
  ['STR', 'INT', 'WIS', 'DEX', 'CON', 'CHA'].forEach(stat => {
    stats[stat] = parseInt(document.getElementById(`stat-${stat}`)?.getAttribute('data-base') || '10');
  });

  const raceData = rules.races[raceSelect.value];
  const adjusted = applyRacialBonuses(stats, raceData);

  for (const stat in adjusted) {
    const input = document.getElementById(`stat-${stat}`);
    const modSpan = document.getElementById(`mod-${stat}`);
    if (input) {
    input.value = adjusted[stat];
    input.style.color = adjusted[stat] > stats[stat] ? 'lightgreen' : adjusted[stat] < stats[stat] ? 'salmon' : '';
    }
    if (modSpan) {
    modSpan.textContent = `(${getModifier(adjusted[stat]) >= 0 ? '+' : ''}${getModifier(adjusted[stat])})`;
    }  
  }

  updateClassOptions(adjusted);
}

function updateClassOptions(stats) {
  classSelect.innerHTML = '';
  const eligible = getEligibleClasses(rules, stats, raceSelect.value);

  eligible.forEach(cls => {
    const opt = document.createElement('option');
    opt.value = cls;
    opt.textContent = cls;
    classSelect.appendChild(opt);
  });

  if (eligible.length > 0) {
    classSelect.value = eligible[0];
    updateDerived(stats);
  } else {
    logMessage("[WARN] No valid classes. Try adjusting stats or rerolling.");
  }
}

function updateDerived(stats) {
  const cls = classSelect.value;
  const conMod = getModifier(stats.CON);
  const hitDie = parseInt(rules.classes[cls].hit_die.slice(1));
  const hp = rollHP(hitDie, conMod);
  const eq = rules.equipment.armor[rules.classes[cls].armor] || { ac: 11, weight: 0 };
  const dexMod = getModifier(stats.DEX);

  const gear = { armor: rules.classes[cls].armor, shield: rules.classes[cls].shields_allowed };
  const ac = calculateAC(rules, gear, dexMod);

  if (currentGold === 0) currentGold = roll3d6() * 10;
  const cost = 50;
  const remaining = Math.max(0, currentGold - cost);

  hpDisplay.textContent = `HP: ${hp}`;
  acDisplay.textContent = `AC: ${ac}`;
  goldDisplay.textContent = `Gold Left: ${remaining}`;
  gearDisplay.textContent = `Gear: ${gear.armor}${gear.shield ? ' + Shield' : ''}`;
}

window.generateCharacter = function () {
  charStats.innerHTML = '';
  const stats = ['STR', 'INT', 'WIS', 'DEX', 'CON', 'CHA'];
  const values = {};
  stats.forEach(stat => {
    const value = roll3d6();
    values[stat] = value;

    const row = document.createElement('div');
    row.className = 'stat-row';

    const label = document.createElement('label');
    label.textContent = `${stat}:`;

    const input = document.createElement('input');
    input.type = 'number';
    input.id = `stat-${stat}`;
    input.setAttribute('data-base', value);
    input.value = value;

    const modSpan = document.createElement('span');
    modSpan.id = `mod-${stat}`;

    row.appendChild(label);
    row.appendChild(input);
    row.appendChild(modSpan);
    charStats.appendChild(row);
  });

  logMessage("Rolled stats: " + JSON.stringify(values));
  applyRaceModifiers();
};

window.rollDice = rollDice;
window.muneFateRoll = muneFateRoll;
window.generateTwist = generateTwist;
window.switchView = function (view) {
  document.getElementById('gameWindow').style.display = view === 'game' ? 'block' : 'none';
  document.getElementById('characterGenerator').style.display = view === 'character' ? 'block' : 'none';
};

window.onerror = function (msg, url, lineNo, columnNo, error) {
  logMessage(`[EXCEPTION] ${msg} at ${url}:${lineNo}:${columnNo}`);
};

window.onunhandledrejection = function (event) {
  logMessage(`[UNHANDLED PROMISE] ${event.reason}`);
};

const originalLog = console.log;
console.log = function (...args) {
  originalLog(...args);
  logMessage('[LOG] ' + args.join(' '));
};

const originalError = console.error;
console.error = function (...args) {
  originalError(...args);
  logMessage('[ERROR] ' + args.join(' '));
};
