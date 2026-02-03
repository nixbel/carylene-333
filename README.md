# 💕 Carylene's Valentine's Day Game 💕

A charming pixel-art platformer game with a special surprise at the end!

## 🎮 Game Overview

Help the princess (you!) collect 3 hearts, avoid broken hearts (enemies), and reach the castle to save Prince Jacques! Along the way, experience a beautiful Pokemon GBA-style dialogue system and a heartfelt Valentine's Day confession.

## ✨ Features

### Gameplay
- ⬅️➡️ Move with arrow keys
- ⬆️ or SPACEBAR to jump
- Collect 3 hearts to unlock the castle
- Avoid enemies (broken hearts)
- Navigate challenging platforms
- Reach Prince Jacques

### Audio System
- 🔊 Jump sound effects
- 🎵 Heart collection chimes
- 💥 Hit warning sounds
- 🎺 Victory fanfare
- 🎶 Looping background music (plays during gameplay)

### Story
- 📝 Codename entry system (code: "cryln")
- 💬 Pokemon GBA-style dialogue with Jacques
- 🎁 Animated gift presentation (flowers 🌹 and scroll 📜)
- 💌 Custom Valentine's confession message

### Visuals
- 🎨 Retro pixel art style
- ☁️ Animated clouds
- 🏰 Detailed castle with flag
- 👸 Animated princess character
- 💔 Enemy heart animations
- ✨ Particle effects

## 🚀 How to Run

### Requirements
- Python with Flask installed (`pip install flask`)
- A modern web browser

### Steps
1. Open terminal in the game folder
2. Run: `python app.py`
3. Open browser to: `http://localhost:5000`
4. Enter codename: `cryln`
5. Play and win!

## 🎯 Customization

### Add Your Confession Message

1. Open `script.js`
2. Find the function `showVictoryScreen()` (line ~1887)
3. Replace the placeholder text with your message:

```javascript
function showVictoryScreen() {
    document.getElementById('victoryScreen').style.display = 'flex';
    
    const confessionText = `Your heartfelt message here!
    
Keep it sincere and personal.
Include why she's special to you.

Happy Valentine's Day! 💕`;
    
    document.getElementById('confessionMessage').textContent = confessionText;
}
```

### Customize Dialogue

Find `startVictoryConversation()` (line ~1870) to change what Jacques says.

## 📁 File Structure

```
├── app.py                    # Flask server
├── index.html               # Main HTML
├── script.js                # Game logic & systems
├── style.css                # Styling
├── pixel-flower-icon.png    # Favicon
├── SETUP_GUIDE.md          # Detailed setup
├── ADD_YOUR_MESSAGE_HERE.js # Message template
└── README.md               # This file
```

## 🎮 Game Controls

| Key | Action |
|-----|--------|
| ← → | Move left/right |
| ↑ | Jump |
| SPACE | Jump |
| SPACE/ENTER | Advance dialogue |

## 🏆 Winning the Game

1. Collect all 3 hearts (strategic jumping needed!)
2. Reach the castle on the right
3. Get to Prince Jacques
4. Watch the dialogue scene with animated gifts
5. Read your custom Valentine's message

## 🎵 Sound Features

All sounds are generated using Web Audio API - no external files needed!
- Master volume: 30% (adjustable in code)
- Retro chiptune style
- Sound triggers:
  - Jump: Two ascending tones
  - Collect: Three chiming tones
  - Hit: Warning tones
  - Victory: Triumphant chord
  - Game Over: Descending fade

## 💡 Tips for Success

- Practice the jumping mechanics first
- Use the progress bar at the bottom to track distance to castle
- Some platforms require precise jumps
- You have 3 lives
- Respawn at the start if hit by enemy
- Enemies patrol in predictable patterns

## 🎨 Visual Customization

- Colors are in `style.css`
- Character designs are in `script.js`
- Canvas size is 800x600px
- Retro pixel art style with smooth animations

## 📱 Browser Compatibility

- Chrome/Chromium ✅
- Firefox ✅
- Safari ✅
- Edge ✅
- Mobile browsers ✅ (works but gameplay is better on desktop)

## 🔧 Technical Stack

- **Frontend**: HTML5 Canvas + JavaScript
- **Audio**: Web Audio API
- **Server**: Python Flask
- **Fonts**: Press Start 2P (Google Fonts)

## 💬 Dialogue System

- Character-by-character animation
- Automatic text wrapping
- Skippable with SPACE/ENTER
- Multiple speakers (supports more than just Jacques)
- Smooth typing animation

## 🎁 Victory Flow

1. Game completed → Victory condition met
2. Fanfare plays → 1.5 second delay
3. Dialogue begins → Pokemon GBA style
4. Gifts animate → Flowers and scroll pulse
5. Last dialogue line appears
6. Player presses SPACE → Victory screen
7. Custom message displayed → Read confession
8. Play Again → Resets to menu

## 🐛 Troubleshooting

**No sound?**
- Check browser volume
- Check OS volume
- Some browsers require user interaction first
- Try clicking the canvas before playing

**Dialogue not advancing?**
- Press SPACE or ENTER
- Make sure you're pressing during dialogue state

**Game not loading?**
- Verify `python app.py` is running
- Check browser console for errors
- Clear browser cache

**Confession message not showing?**
- Verify you edited `showVictoryScreen()` correctly
- Check for syntax errors (missing quotes/backticks)
- Use backticks (\`) not regular quotes

## 🎓 Learning Resources

This game demonstrates:
- HTML5 Canvas drawing
- JavaScript class systems
- State management
- Web Audio API
- Collision detection
- Animation loops
- Event handling
- Responsive game architecture

## 📄 License

Made with ❤️ for Carylene's Valentine's Day

---

**Ready to confess your feelings? Good luck! 💕**
