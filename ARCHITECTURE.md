# 🎮 Game Architecture & Flow Diagram

## Complete Game Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    CARYLENE'S VALENTINE GAME                    │
└─────────────────────────────────────────────────────────────────┘

                          START
                            │
                            ▼
                   ┌─────────────────┐
                   │  Code Entry     │
                   │ (Enter: "cryln")│
                   └────────┬────────┘
                            │
                            ▼
                   ┌─────────────────┐
                   │  Game Menu      │
                   │  Instructions   │
                   └────────┬────────┘
                            │
                     ┌──────▼──────┐
                     │   PLAYING   │  ◄─────┐
                     │  Main Game  │        │
                     └──────┬──────┘        │
                            │              │
            ┌───────────────┴───────────────┤
            │                               │
        ┌───▼────┐                      ┌──▼─────┐
        │ Victory│                      │ Lose   │
        │ Reached│                      │ Lives  │
        └───┬────┘                      └──┬─────┘
            │                              │
            │          ┌──────────────────┘
            │          │
            ▼          ▼
        ┌─────────────────────┐
        │  Dialogue Scene     │
        │ with Prince Jacques │
        └──────────┬──────────┘
                   │
                   ▼
        ┌─────────────────────┐
        │  Victory Screen     │
        │ Confession Message  │
        │   (FINAL STAGE) 💕  │
        └──────────┬──────────┘
                   │
                   ▼
              RESTART?
```

---

## Game States

```javascript
gameState = {
    'start': 'Initial load, codename entry',
    'playing': 'Active gameplay',
    'dialogue': 'Pokemon GBA dialogue sequence',
    'victoryScreen': 'Final confession message',
    'gameOver': 'Lost all lives',
    'victory': 'Transition state (internal)
}
```

---

## What Happens on Victory

```
┌──────────────────────────────────────────┐
│ 1. Princess Reaches Prince (Collision)   │
└────────────────┬─────────────────────────┘
                 │
         soundGenerator.victoryFanfare()
         Creates 50 particle explosions
                 │
                 ▼
        ┌─────────────────────┐
        │ Set gameState to    │
        │ 'victory'           │
        │ (1.5 sec delay)     │
        └────────┬────────────┘
                 │
                 ▼
        startVictoryConversation()
        ┌─────────────────────────────┐
        │ Sets gameState = 'dialogue' │
        │ Starts dialogue sequence    │
        │ Shows animated gifts        │
        └────────┬────────────────────┘
                 │
        ┌─── 7 dialogue lines ───┐
        │                        │
        │  "You did it!"         │ ◄─ soundGenerator.jumpSound, etc
        │  "I knew you..."       │
        │  "I have a gift"       │
        │  "These flowers..."    │
        │  "And this scroll..."  │
        │  "My confession"       │
        │  "Happy Valentine's"   │
        │                        │
        └────────┬───────────────┘
                 │
          Press SPACE/ENTER
                 │
                 ▼
        └─────────────────────────┐
        │ gameState = 'victoryScreen'
        │ Show confession screen
        │ Display your message
        └─────────────────────────┘
```

---

## Audio System Architecture

```
┌─ SoundGenerator ──────────────────┐
│                                   │
│  Core Methods:                    │
│  ├─ playNote()                    │
│  │  └─ frequency + duration       │
│  │     + wave type (sine/square)  │
│  │                                │
│  Audio Events:                    │
│  ├─ jumpSound() ─────────────────►│ EVENT: Princess jumps
│  │                                │
│  ├─ collectSound() ───────────────│ EVENT: Collect heart
│  │                                │
│  ├─ hitSound() ────────────────►│ EVENT: Enemy hits
│  │                                │
│  ├─ victoryFanfare() ───────────►│ EVENT: Game won
│  │                                │
│  ├─ gameOverSound() ────────────►│ EVENT: All lives lost
│  │                                │
│  └─ backgroundMusicStart() ──────│ EVENT: Game start
│     └─ playMusicPattern() (loop)  │
│                                   │
└───────────────────────────────────┘
```

---

## Dialogue System Flow

```
┌─ DialogueSystem ──────────────────────────┐
│                                           │
│ start(dialogueArray)                      │
│ ├─ Set currentDialogue = array           │
│ ├─ currentIndex = 0                      │
│ └─ isActive = true                       │
│                                           │
│ update() (called every frame)            │
│ ├─ Advance text char by char             │
│ ├─ Apply charSpeed delay                 │
│ └─ displayedText grows progressively     │
│                                           │
│ skip()                                    │
│ ├─ Show all text immediately             │
│ └─ Or advance to next line               │
│                                           │
│ Properties:                               │
│ ├─ currentDialogue []                    │
│ ├─ displayedText (animated)              │
│ ├─ isActive (bool)                       │
│ ├─ charSpeed (2 frames/char)             │
│ └─ isTextComplete() (bool)               │
│                                           │
└───────────────────────────────────────────┘
        │
        │ Renders in drawDialogueBox()
        │
        ▼
┌──────────────────────────────┐
│   DIALOGUE BOX UI            │
├──────────────────────────────┤
│  JACQUES                     │
│                              │
│  Your custom text here,      │
│  animated character by       │
│  character...                │
│                              │
│              ▼ Continue ▼    │
└──────────────────────────────┘
```

---

## Gift Animation System

```
┌─ GiftReward ──────────────────┐
│                               │
│ Properties:                   │
│ ├─ showing: bool              │
│ ├─ animationFrame: counter    │
│ └─ gifts: [                   │
│     { name: 'FLOWERS' },      │
│     { name: 'SCROLL' }        │
│   ]                           │
│                               │
│ Methods:                      │
│ ├─ show()                     │
│ ├─ hide()                     │
│ └─ update()                   │
│                               │
└───────────────────────────────┘
         │
         │ Renders with
         │ pulsing animation:
         │ scale = 1 + sin(frameCount * 0.05)
         │
         ▼
    ┌─────────────────────────┐
    │     🌹        📜        │
    │  FLOWERS    SCROLL      │
    │                         │
    │  (Pulsing/Breathing)    │
    └─────────────────────────┘
```

---

## Input Handling

```
┌─ Keyboard Events ────────────────────┐
│                                      │
│ gameState === 'playing':             │
│  ├─ ← → : Move princess left/right   │
│  ├─ ↑ or SPACE: Jump                 │
│  └─ → triggers soundGenerator.jump   │
│                                      │
│ gameState === 'dialogue':            │
│  └─ SPACE or ENTER:                  │
│     └─ dialogueSystem.skip()         │
│        └─ If not isActive:           │
│           └─ gameState = 'victory'   │
│                                      │
│ gameState === other:                 │
│  └─ Ignore input (UI buttons only)   │
│                                      │
└──────────────────────────────────────┘
```

---

## Rendering Pipeline (draw())

```
1. Clear canvas
   │
2. Draw background + gradient
   │
3. Draw brick pattern
   │
4. Draw clouds (animated)
   │
5. Draw platforms
   │
6. Draw castle
   │
7. Draw flag pole
   │
8. Draw prince
   │
9. Draw enemies
   │
10. Draw hearts (collectibles)
    │
11. Draw princess (with animation)
    │
12. Draw particles (collision effects)
    │
13. If gameState === 'dialogue':
    ├─ drawDialogueBox()
    └─ drawGifts()
    │
14. If gameState === 'playing':
    └─ Draw progress bar
```

---

## Victory Message Customization

```javascript
// Step 1: Find this function in script.js
function showVictoryScreen() {
    document.getElementById('victoryScreen').style.display = 'flex';
    
    // Step 2: Create your confession text
    const confessionText = `[YOUR MESSAGE HERE]`;
    
    // Step 3: Display it
    document.getElementById('confessionMessage').textContent = confessionText;
}

// The message appears in a beautiful box:
// ┌─────────────────────────────────────┐
// │           THANK YOU!                │
// ├─────────────────────────────────────┤
// │                                     │
// │    [Your custom message appears]    │
// │                                     │
// │    From: JACQUES 💕                │
// │                                     │
// │         [BACK TO MENU]              │
// └─────────────────────────────────────┘
```

---

## Performance & Optimization

```
Game Loop: requestAnimationFrame
├─ Runs ~60 FPS
├─ Calls update() → draw() per frame
│
update() optimizations:
├─ Only updates particles if needed
├─ Only updates enemies if playing
├─ Only updates dialogue if active
│
draw() optimizations:
├─ Image rendering: crisp-edges (pixelated)
├─ Context smoothing: disabled
├─ Canvas cleared once per frame
└─ Only renders active game elements
```

---

## Key Files & Responsibilities

```
📁 Project
├── 📄 app.py (Flask server)
│   └─ Serves HTML on localhost:5000
│
├── 📄 index.html (Structure)
│   ├─ Canvas element (800x600)
│   ├─ HTML screens (menus, victory)
│   └─ Script imports
│
├── 📄 script.js (Game Logic) ⭐
│   ├─ SoundGenerator class
│   ├─ DialogueSystem class
│   ├─ GiftReward class
│   ├─ Game state management
│   ├─ Update loop
│   ├─ Drawing functions
│   └─ Event handlers
│
└── 📄 style.css (Styling)
    ├─ Press Start 2P font
    ├─ Golden theme colors
    ├─ Retro pixel styling
    └─ Victory screen design
```

---

**This architecture creates a complete, immersive Valentine's Day gaming experience!** 💕
