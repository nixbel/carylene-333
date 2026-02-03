// INSTRUCTION: Find this function in script.js and add your confession message

function showVictoryScreen() {
    document.getElementById('victoryScreen').style.display = 'flex';
    
    // ============================================================
    // 👇 REPLACE THIS WITH YOUR OWN CONFESSION MESSAGE 👇
    // ============================================================
    
    const confessionText = `[Your Custom Message Here]

Edit this text to add your Valentine's confession!

Include:
- Why she's special
- Your feelings
- A heartfelt message
- Your name/signature

Line breaks help with readability!`;
    
    // ============================================================
    // ☝️ THAT'S WHERE YOUR MESSAGE GOES ☝️
    // ============================================================
    
    document.getElementById('confessionMessage').textContent = confessionText;
}


// EXAMPLE: Here's a complete example you can copy and customize:

function showVictoryScreen() {
    document.getElementById('victoryScreen').style.display = 'flex';
    
    const confessionText = `Dear Carylene,

You've helped me find my way through the castle,
just like you've helped me find my way in life.

Your kindness, strength, and beauty inspire me every day.
These flowers represent my admiration for you,
and this scroll contains everything I feel.

Will you spend Valentine's Day with me?

With all my heart,
Jacques 💕`;
    
    document.getElementById('confessionMessage').textContent = confessionText;
}


// TIPS:
// 1. Keep the backticks (`) at the start and end
// 2. Use \n for line breaks or just press Enter inside the backticks
// 3. Emojis work! Try: 💕 🌹 ✨ 💖 💐
// 4. You can reference her name directly in the message
// 5. Keep it between 200-400 words for best display
// 6. Test it by playing the game and winning!

// LOCATIONS TO FIND THIS FUNCTION:
// File: script.js
// Search for: "function showVictoryScreen()"
// It should be around line 1887
