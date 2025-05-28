# BFRPG Solo Game App

A solo Basic Fantasy Role-Playing Game (BFRPG) app with MUNE integration, built using HTML, JavaScript modules, and Node.js with Express.

---

## Features
- Fully codified BFRPG Beginner's Essentials rules
- Character generator with race/class eligibility and stat modifiers
- Dynamic AC, HP, gold, and gear calculations
- MUNE-based oracle tools: Fate rolls and plot twists
- Modular rule logic with utility functions for spells, combat, XP, and more

---

## Requirements
- Node.js (v16 or newer recommended)
- npm

---

## Setup
1. Clone or download the project folder
2. Install dependencies:

```bash
npm install
```

3. Start the local server:

```bash
npm start
```

4. Open your browser to:

```
http://localhost:3000
```

---

## Project Structure
```
/project-root
├── server.js                # Express server
├── package.json             # Node config
├── /public                  # Static assets
│   ├── index.html           # Main UI
│   ├── main.js              # Frontend logic
│   ├── rules-utils.js       # Ability/modifier/class logic
│   ├── magic-xp-turn.js     # Spell, XP, Turn Undead logic
│   ├── combat-movement-utils.js  # Combat & movement helpers
│   ├── bfrpg_beginner_essentials_compact.json  # Ruleset data
│   └── styles.css           # Optional styling
```

---

## Future Improvements
- Spellbook UI and spell slot management
- Combat log and initiative tracker
- Inventory system with encumbrance
- Save/load party via localStorage or JSON

---

## License
MIT

---

## Author
Matt (developer, musician, artist, metalhead, and RPG enthusiast)
