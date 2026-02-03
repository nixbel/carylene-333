# ⚡ QUICK START - 3 Steps to Victory

## Step 1️⃣: Add Your Confession Message (2 minutes)

Open `script.js` and find this function (around line 1887):

```javascript
function showVictoryScreen() {
    document.getElementById('victoryScreen').style.display = 'flex';
    // Add your confession message here
}
```

Replace it with:

```javascript
function showVictoryScreen() {
    document.getElementById('victoryScreen').style.display = 'flex';
    
    const confessionText = `Dear Carylene,

Every moment with you is an adventure. 
These flowers are just a small token of my affection.

You make my heart beat like the princess's feet on these platforms -
constantly moving forward, never giving up.

Will you be my Valentine?

With all my love,
Jacques 💕`;
    
    document.getElementById('confessionMessage').textContent = confessionText;
}
```

## Step 2️⃣: Run the Game (1 minute)

```bash
# In terminal, go to the game folder
cd "d:\For Carylene (333\carylene"

# Start the Flask server
python app.py

# Open browser to
http://localhost:5000
```

## Step 3️⃣: Test & Play! (5-10 minutes)

1. Enter codename: **cryln**
2. Click START
3. Collect all 3 ❤️ hearts
4. Reach the castle 🏰
5. Save the prince!
6. Watch the dialogue
7. See your confession message

---

## 🎮 Game Controls

| Press | Action |
|-------|--------|
| **← →** | Move |
| **↑ Space** | Jump |
| **Space/Enter** | Skip dialogue |

---

## 📝 Message Tips

- Make it **personal** - mention things special about her
- Keep **2-4 paragraphs** max
- Add **emojis** for personality 💕🌹✨
- Be **sincere** - this is your confession!
- Sign with your **name** or just "Jacques"

---

## ✅ Checklist Before Showing Her

- [ ] Customized confession message
- [ ] Tested the game end-to-end
- [ ] Verified confession displays correctly
- [ ] Sound is working (helps with immersion!)
- [ ] Controls feel responsive
- [ ] Victory dialogue makes sense

---

## 🆘 Stuck?

**Game won't run?**
- Make sure Flask is installed: `pip install flask`
- Check Python version: `python --version`
- Try different port: Edit `app.py`, change `port=5000`

**Confession not showing?**
- Check you're in the right function
- Verify backticks (\`) not quotes ("")
- Reload browser after saving

**Dialogue skipping too fast?**
- This is normal - press SPACE slower
- You can adjust speed in `dialogueSystem.charSpeed`

---

## 🎁 What She'll See

1. **Load Screen** → "Your Codename" prompt
2. **Menu** → Game instructions
3. **Gameplay** → Beautiful pixel platformer
4. **Victory** → Dialogue with Prince Jacques
5. **Gifts** → Animated flowers & scroll
6. **Confession** → Your heartfelt message 💌

---

## 💡 Pro Tips

- **Practice first!** The game has challenging sections
- **Don't rush the confession** - let her read it slowly
- **The music adds atmosphere** - make sure sound is on
- **Each death is cinematic** - respawn is fun
- **The dialogue pacing is Pokemon-perfect** - it sets the mood

---

## 🎉 You've Got This!

Your custom Valentine's Day game is ready. The code handles all the hard parts:
- ✅ Dialogue system
- ✅ Sound effects  
- ✅ Gift animations
- ✅ Victory flow

All you need to do is **add your message** and hit play!

---

**Questions? Check SETUP_GUIDE.md for detailed instructions**

**Ready? Good luck, lover! 💕**
