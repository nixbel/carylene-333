# Valentine's Day Confession Setup

## How to Add Your Confession Message

The game now has a complete dialogue and confession system! Here's how to customize it with your message:

### Step 1: Edit the Confession Message

Open `script.js` and find the `showVictoryScreen()` function (around line 1887).

Replace the placeholder with your actual confession message:

```javascript
function showVictoryScreen() {
    document.getElementById('victoryScreen').style.display = 'flex';
    
    // Add your custom confession message here
    const confessionText = `Dear Carylene,

During this quest to find you and save the prince, I realized something.
Every moment with you is an adventure worth taking.

You are brave, kind, and truly special.
I hope these flowers and this scroll remind you how much you mean to me.

Will you be my Valentine?

With all my heart,
Jacques`;
    
    document.getElementById('confessionMessage').textContent = confessionText;
}
```

### Step 2: How the Game Flow Works

1. **Start Game** → Code Entry (enter "cryln")
2. **Play Game** → Collect hearts, reach the prince
3. **Victory** → Automatic conversation with Jacques
4. **Dialogue** → Press SPACE/ENTER to advance text
5. **Confession Screen** → Your custom message with gifts shown

### Step 3: Customize the Dialogue

You can also modify the conversation with Jacques in the `startVictoryConversation()` function (line 1870):

```javascript
function startVictoryConversation() {
    const victoryDialogue = [
        { speaker: 'JACQUES', text: 'You did it! You saved me!' },
        { speaker: 'JACQUES', text: 'I knew you had it in you...' },
        { speaker: 'JACQUES', text: 'I have a gift for you.' },
        { speaker: 'JACQUES', text: 'These flowers are for you.' },
        { speaker: 'JACQUES', text: 'And this scroll...' },
        { speaker: 'JACQUES', text: 'It contains my confession.' },
        { speaker: 'JACQUES', text: 'Happy Valentine\'s Day.' }
    ];
    
    gameState = 'dialogue';
    dialogueSystem.start(victoryDialogue);
    giftReward.show();
}
```

### Gift Display

The game shows:
- **🌹 Flowers** (left side) - representing your affection
- **📜 Scroll** (right side) - containing your confession message

Both items pulse and animate beautifully during the conversation!

### Tips

- Keep dialogue lines short for better pacing
- Use line breaks in your confession message for readability
- The system will automatically wrap long text in the confession screen
- Players can press SPACE/ENTER to skip through dialogue

## Game Features

✅ Sound effects (jump, collect, hit, victory fanfare)
✅ Pokemon GBA-style dialogue system
✅ Animated gift display
✅ Custom confession message
✅ Beautiful Valentine's theme
✅ Prince named "Jacques"
✅ Codename entry system

Good luck with your confession! 💕
