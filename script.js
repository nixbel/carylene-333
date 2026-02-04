const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

// Audio System
class SoundGenerator {
    constructor() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.masterVolume = 0.3;
    }

    playNote(frequency, duration, type = 'sine', volume = 0.3) {
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc.connect(gain);
        gain.connect(this.audioContext.destination);
        
        osc.frequency.value = frequency;
        osc.type = type;
        gain.gain.value = volume * this.masterVolume;
        
        osc.start(this.audioContext.currentTime);
        osc.stop(this.audioContext.currentTime + duration);
        
        // Fade out
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
    }

    jumpSound() {
        this.playNote(400, 0.1, 'square');
        this.playNote(600, 0.15, 'square');
    }

    collectSound() {
        this.playNote(800, 0.1, 'sine');
        this.playNote(1200, 0.15, 'sine');
        this.playNote(1600, 0.2, 'sine');
    }

    hitSound() {
        this.playNote(200, 0.2, 'square');
        this.playNote(150, 0.2, 'square');
    }

    victoryFanfare() {
        setTimeout(() => this.playNote(523.25, 0.2, 'sine'), 0);
        setTimeout(() => this.playNote(659.25, 0.2, 'sine'), 150);
        setTimeout(() => this.playNote(783.99, 0.2, 'sine'), 300);
        setTimeout(() => this.playNote(1046.50, 0.4, 'sine'), 450);
    }

    gameOverSound() {
        this.playNote(400, 0.3, 'square');
        setTimeout(() => this.playNote(300, 0.3, 'square'), 150);
        setTimeout(() => this.playNote(200, 0.5, 'square'), 300);
    }

    backgroundMusicStart() {
        // Simple retro chiptune pattern
        this.playMusicPattern();
    }

    playMusicPattern() {
        if (gameState !== 'playing') return;
        
        const pattern = [523.25, 587.33, 659.25, 783.99, 659.25, 587.33];
        let index = 0;
        
        const playNext = () => {
            if (gameState === 'playing' && index < pattern.length) {
                this.playNote(pattern[index], 0.3, 'square', 0.15);
                index++;
                setTimeout(playNext, 400);
            } else if (gameState === 'playing') {
                index = 0;
                setTimeout(playNext, 800);
            }
        };
        
        playNext();
    }

    summoningSound() {
        // Magical summoning effect with ascending notes
        this.playNote(523.25, 0.1, 'sine', 0.3);
        setTimeout(() => this.playNote(659.25, 0.1, 'sine', 0.3), 80);
        setTimeout(() => this.playNote(783.99, 0.1, 'sine', 0.3), 160);
        setTimeout(() => this.playNote(1046.50, 0.3, 'sine', 0.4), 240);
    }
}

const soundGenerator = new SoundGenerator();

// Dialogue System
class DialogueSystem {
    constructor() {
        this.currentDialogue = [];
        this.currentIndex = 0;
        this.isActive = false;
        this.textQueue = '';
        this.displayedText = '';
        this.charIndex = 0;
        this.charSpeed = 2; // frames per character
        this.charCounter = 0;
    }

    start(dialogueArray) {
        this.currentDialogue = dialogueArray;
        this.currentIndex = 0;
        this.isActive = true;
        this.displayedText = '';
        this.charIndex = 0;
        this.advanceText();
    }

    advanceText() {
        if (this.currentIndex < this.currentDialogue.length) {
            this.textQueue = this.currentDialogue[this.currentIndex].text;
            this.displayedText = '';
            this.charIndex = 0;
            this.charCounter = 0;
            this.currentIndex++;
        } else {
            this.isActive = false;
        }
    }

    update() {
        if (!this.isActive) return;
        
        if (this.charIndex < this.textQueue.length) {
            this.charCounter++;
            if (this.charCounter >= this.charSpeed) {
                this.displayedText += this.textQueue[this.charIndex];
                this.charIndex++;
                this.charCounter = 0;
            }
        }
    }

    skip() {
        if (this.charIndex < this.textQueue.length) {
            this.displayedText = this.textQueue;
            this.charIndex = this.textQueue.length;
        } else {
            this.advanceText();
        }
    }

    getCurrentSpeaker() {
        if (this.currentIndex > 0 && this.currentIndex <= this.currentDialogue.length) {
            return this.currentDialogue[this.currentIndex - 1].speaker;
        }
        return '';
    }

    isTextComplete() {
        return this.charIndex >= this.textQueue.length;
    }
}

const dialogueSystem = new DialogueSystem();

// Gift System with Summoning Animation
class GiftReward {
    constructor() {
        this.showing = false;
        this.gifts = [];
        this.animationFrame = 0;
        this.summoningStarted = false;
        this.summoningDuration = 60; // frames for summoning
        this.letterShown = false;
    }

    show() {
        this.showing = true;
        this.animationFrame = 0;
        this.summoningStarted = false;
        this.letterShown = false;
        this.gifts.forEach(g => {
            g.collected = false;
            g.scale = 0;
            g.angle = 0;
        });
    }

    hide() {
        this.showing = false;
    }

    update() {
        if (this.showing) {
            this.animationFrame++;
            
            // Start summoning after a short delay
            if (this.animationFrame > 20) {
                this.summoningStarted = true;
            }
            
            if (this.summoningStarted) {
                const summonProgress = Math.min((this.animationFrame - 20) / this.summoningDuration, 1);
                
                // Animate each gift
                this.gifts.forEach((gift, index) => {
                    const delay = index * 10;
                    const giftProgress = Math.max(0, (this.animationFrame - 20 - delay) / (this.summoningDuration - delay));
                    
                    if (giftProgress > 0) {
                        // Easing function for smooth pop effect
                        const easeProgress = Math.min(1, giftProgress * 1.2);
                        gift.scale = Math.sin(easeProgress * Math.PI) * (easeProgress > 0.8 ? 0.95 : 1);
                        gift.angle = easeProgress * 360;
                        
                        // Create summoning particles
                        if (giftProgress < 0.5 && Math.random() < 0.3) {
                            const particleAngle = Math.random() * Math.PI * 2;
                            const particleSpeed = Math.random() * 2 + 1;
                            particles.push(new Particle(
                                gift.x,
                                gift.y,
                                Math.cos(particleAngle) * particleSpeed,
                                Math.sin(particleAngle) * particleSpeed,
                                index === 0 ? '#FFB6C1' : '#8B4513'
                            ));
                        }
                    }
                });
            }
        }
    }
}

const giftReward = new GiftReward();

// Game constants
const GRAVITY = 0.6;
const JUMP_POWER = -12;
const MOVE_SPEED = 2;
const MAX_FALL_SPEED = 10;
const FRICTION = 0.85;
const ACCELERATION = 0.3;

// Game state
let gameState = 'start';
let score = 0;
let heartsCollected = 0;
let frameCount = 0;
let lives = 3;

// Show start screen
window.addEventListener('load', () => {
    document.getElementById('startScreen').style.display = 'block';
});

// Enable Enter key for codename input
document.getElementById('codeInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        checkCode();
    }
});

function checkCode() {
    const input = document.getElementById('codeInput').value.trim().toLowerCase();
    const error = document.getElementById('codeError');

    if (input === 'cryln') {
        // Hide codename screen
        document.getElementById('codeScreen').style.display = 'none';

        // Show start screen
        document.getElementById('startScreen').style.display = 'flex';

        // Change text content
        document.getElementById('titleText').textContent = 'HI CARYLENE!';
        document.getElementById('subtitleText').textContent = 'PLEASE PLAY THIS.';

        document.getElementById('objectiveText').innerHTML = `
            <p>OBJECTIVES: </p>
            <p>COLLECT HEARTS</p>
            <p>SAVE THE PRINCE</p>
        `;
    } else {
        error.style.display = 'block';
        error.textContent = 'INVALID CODENAME';
    }
}

function restartGame() {
    // Hide all screens and go directly to game
    document.getElementById('codeScreen').style.display = 'none';
    document.getElementById('startScreen').style.display = 'none';
    document.getElementById('gameOver').style.display = 'none';
    document.getElementById('victory').style.display = 'none';
    document.getElementById('victoryScreen').style.display = 'none';
    
    // Reset victory screen flag
    window.victoryScreenShown = false;
    
    // Start the game directly
    gameState = 'playing';
    lives = 3;
    heartsCollected = 0;
    score = 0;

    // Reset princess
    princess.x = 50;
    princess.y = 450;
    princess.velocityX = 0;
    princess.velocityY = 0;
    princess.jumping = false;
    princess.onGround = false;
    princess.invincible = false;

    // Reset hearts
    hearts.forEach(heart => heart.collected = false);

    // Reset enemies to initial positions and state
    enemies[0].x = 120; enemies[0].y = 510; enemies[0].velocityX = 1.2; enemies[0].alive = true;
    enemies[1].x = 280; enemies[1].y = 510; enemies[1].velocityX = -1; enemies[1].alive = true;
    enemies[2].x = 450; enemies[2].y = 510; enemies[2].velocityX = 1.3; enemies[2].alive = true;
    enemies[3].x = 650; enemies[3].y = 510; enemies[3].velocityX = -1.2; enemies[3].alive = true;
    enemies[4].x = 730; enemies[4].y = 510; enemies[4].velocityX = -1.2; enemies[4].alive = true;
    enemies[5].x = 180; enemies[5].y = 380; enemies[5].velocityX = 0.8; enemies[5].alive = true;
    enemies[6].x = 460; enemies[6].y = 320; enemies[6].velocityX = -0.8; enemies[6].alive = true;

    // Update displays
    document.getElementById('livesCount').textContent = lives;
    updateScore();

    // Clear input field and error
    document.getElementById('codeInput').value = '';
    document.getElementById('codeError').style.display = 'none';
}

function startGame() {
    document.getElementById('startScreen').style.display = 'none';
    gameState = 'playing';
    lives = 3;
    heartsCollected = 0;
    score = 0;
    
    // Reset princess
    princess.x = 50;
    princess.y = 450;
    princess.velocityX = 0;
    princess.velocityY = 0;
    princess.jumping = false;
    princess.onGround = false;
    princess.invincible = false;
    
    // Reset hearts
    hearts.forEach(heart => heart.collected = false);
    
    // Reset enemies
    enemies.forEach(enemy => enemy.alive = true);
    
    // Update displays
    document.getElementById('livesCount').textContent = lives;
    updateScore();
    
    // Hide victory or game over screens
    document.getElementById('victory').style.display = 'none';
    document.getElementById('gameOver').style.display = 'none';
    
    // Start background music
    soundGenerator.backgroundMusicStart();
}

// Particle system
const particles = [];

// Princess (player)
const princess = {
    x: 50,
    y: 450,
    width: 16,
    height: 38,
    velocityX: 0,
    velocityY: 0,
    jumping: false,
    onGround: false,
    direction: 'right',
    animFrame: 0,
    animTimer: 0,
    animSpeed: 8,
    blinkTimer: 0,
    blinkDuration: 0,
    eyesOpen: true,
    dressOffset: 0,
    invincible: false
};

// Prince (goal)
const prince = {
    x: 710,
    y: 510,
    width: 16,
    height: 38,
    blinkTimer: 0,
    blinkDuration: 0,
    eyesOpen: true,
    animFrame: 0,
    animTimer: 0
};

// Level design - Harder Mario-style platforms
const platforms = [
    // Ground - with gaps
    { x: 0, y: 550, width: 200, height: 50, type: 'ground' },
    { x: 250, y: 550, width: 120, height: 50, type: 'ground' },
    { x: 420, y: 550, width: 100, height: 50, type: 'ground' },
    { x: 570, y: 550, width: 230, height: 50, type: 'ground' },
    
    // Floating platforms - harder jumps
    { x: 90, y: 480, width: 80, height: 20, type: 'brick' },
    { x: 180, y: 420, width: 60, height: 20, type: 'brick' },
    { x: 270, y: 360, width: 40, height: 20, type: 'brick' },
    { x: 360, y: 300, width: 60, height: 20, type: 'brick' },
    { x: 460, y: 360, width: 60, height: 20, type: 'brick' },
    { x: 550, y: 420, width: 60, height: 20, type: 'brick' },
    { x: 450, y: 240, width: 80, height: 20, type: 'brick' },
    { x: 300, y: 200, width: 100, height: 20, type: 'brick' },
];

// Enemies (broken hearts) - more enemies, moving platforms
const enemies = [
    { x: 120, y: 510, width: 32, height: 40, velocityX: 1.2, type: 'goomba', alive: true },
    { x: 280, y: 510, width: 32, height: 40, velocityX: -1, type: 'goomba', alive: true },
    { x: 450, y: 510, width: 32, height: 40, velocityX: 1.3, type: 'goomba', alive: true },
    { x: 650, y: 510, width: 32, height: 40, velocityX: -1.2, type: 'goomba', alive: true },
    { x: 730, y: 510, width: 32, height: 40, velocityX: -1.2, type: 'goomba', alive: true },
    { x: 180, y: 380, width: 32, height: 40, velocityX: 0.8, type: 'goomba', alive: true },
    { x: 460, y: 320, width: 32, height: 40, velocityX: -0.8, type: 'goomba', alive: true }
];

// Hearts to collect - harder to reach positions
let hearts = [
    { x: 190, y: 380, width: 28, height: 28, collected: false, float: 0 },
    { x: 370, y: 260, width: 28, height: 28, collected: false, float: 0 },
    { x: 460, y: 320, width: 28, height: 28, collected: false, float: 0 }
];

// Castle
const castle = {
    x: 630,
    y: 270,
    width: 160,
    height: 280
};

// Flag pole
const flagPole = {
    x: 620,
    y: 200,
    width: 10,
    height: 350,
    flagY: 200,
    reached: false
};

// Clouds
const clouds = [
    { x: 80, y: 60, size: 50, speed: 0.2 },
    { x: 280, y: 40, size: 70, speed: 0.15 },
    { x: 520, y: 80, size: 60, speed: 0.25 },
    { x: 180, y: 130, size: 45, speed: 0.18 },
    { x: 700, y: 70, size: 80, speed: 0.22 },
    { x: 400, y: 100, size: 55, speed: 0.2 },
    { x: 600, y: 50, size: 65, speed: 0.16 },
    { x: 750, y: 120, size: 40, speed: 0.19 }
];

// Input
const keys = {};

document.addEventListener('keydown', (e) => {
    // Handle dialogue
    if (gameState === 'dialogue') {
        if (e.key === ' ' || e.key === 'Enter') {
            dialogueSystem.skip();
            if (!dialogueSystem.isActive) {
                gameState = 'victoryScreen';
            }
        }
        return;
    }
    
    if (gameState !== 'playing') return;
    keys[e.key] = true;
    
    if ((e.key === ' ' || e.key === 'ArrowUp') && princess.onGround && !princess.jumping) {
        princess.velocityY = JUMP_POWER;
        princess.jumping = true;
        princess.onGround = false;
        soundGenerator.jumpSound();
    }
    e.preventDefault();
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Particle class
class Particle {
    constructor(x, y, vx, vy, color) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.life = 60;
        this.maxLife = 60;
        this.size = Math.random() * 3 + 2;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.1; // Gravity
        this.life--;
    }

    draw() {
        const alpha = this.life / this.maxLife;
        ctx.fillStyle = this.color.replace('1)', `${alpha})`);
        ctx.fillRect(Math.round(this.x), Math.round(this.y), this.size, this.size);
    }

    isDead() {
        return this.life <= 0;
    }
}

// Create heart particles
function createHeartParticles(x, y, count = 5) {
    for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count;
        const speed = Math.random() * 2 + 1;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed - 2;
        particles.push(new Particle(x, y, vx, vy, 'rgba(255, 20, 147, 1)'));
    }
}

// Draw functions
function drawCloud(x, y, size) {
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
    ctx.shadowBlur = 4;
    
    ctx.beginPath();
    ctx.arc(x, y, size * 0.3, 0, Math.PI * 2);
    ctx.arc(x + size * 0.3, y, size * 0.4, 0, Math.PI * 2);
    ctx.arc(x + size * 0.6, y, size * 0.3, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.shadowBlur = 0;
}

function drawPrincess() {
    // Skip drawing if invincible and flash is on
    if (princess.invincible && Math.floor(frameCount / 10) % 2 === 0) {
        return;
    }
    
    const x = Math.round(princess.x);
    const y = Math.round(princess.y);
    const s = 2; // REDUCED FROM 3 TO 2
    const facingRight = princess.direction === 'right';

    // Dress flow animation
    if (!princess.onGround) {
        princess.dressOffset = Math.sin(frameCount * 0.2) * 2;
    } else {
        princess.dressOffset *= 0.9;
    }

    ctx.save();
    
    // Crown (side view) - more detailed
    ctx.fillStyle = '#FFD700';
    if (facingRight) {
        ctx.fillRect(x + s * 3, y - s, s * 5, s * 2.5);
        ctx.fillRect(x + s * 5, y - s * 2, s, s * 2);
        ctx.fillRect(x + s * 7, y - s * 1.5, s, s * 1.5);
    } else {
        ctx.fillRect(x + s * 2, y - s, s * 5, s * 2.5);
        ctx.fillRect(x + s * 2, y - s * 1.5, s, s * 1.5);
        ctx.fillRect(x + s * 4, y - s * 2, s, s * 2);
    }
    
    // Crown jewels - red/pink gems
    ctx.fillStyle = '#FF1493';
    if (facingRight) {
        ctx.fillRect(x + s * 5, y - s, s, s);
        ctx.fillRect(x + s * 7, y - s * 0.5, s * 0.5, s * 0.5);
    } else {
        ctx.fillRect(x + s * 2.5, y - s * 0.5, s * 0.5, s * 0.5);
        ctx.fillRect(x + s * 4, y - s, s, s);
    }
    
    // Crown shading
    ctx.fillStyle = '#FFA500';
    if (facingRight) {
        ctx.fillRect(x + s * 3, y - s, s * 1.5, s);
    } else {
        ctx.fillRect(x + s * 5.5, y - s, s * 1.5, s);
    }
    
    // Hair (long flowing - side view)
    ctx.fillStyle = '#5A2D0C';
    if (facingRight) {
        // Hair back
        ctx.fillRect(x + s * 2, y + s * 2, s * 4, s * 4);
        ctx.fillRect(x + s * 1, y + s * 6, s * 3, s * 8);
        // Hair front
        ctx.fillRect(x + s * 6, y + s * 2, s * 2, s * 3);
    } else {
        // Hair back
        ctx.fillRect(x + s * 4, y + s * 2, s * 4, s * 4);
        ctx.fillRect(x + s * 6, y + s * 6, s * 3, s * 8);
        // Hair front
        ctx.fillRect(x + s * 2, y + s * 2, s * 2, s * 3);
    }
    
    // Hair highlights
    ctx.fillStyle = '#8B4513';
    if (facingRight) {
        ctx.fillRect(x + s * 3, y + s * 3, s * 2, s);
        ctx.fillRect(x + s * 2, y + s * 8, s, s * 2);
        ctx.fillRect(x + s * 6.5, y + s * 4, s, s);
    } else {
        ctx.fillRect(x + s * 5, y + s * 3, s * 2, s);
        ctx.fillRect(x + s * 7, y + s * 8, s, s * 2);
        ctx.fillRect(x + s * 1.5, y + s * 4, s, s);
    }
    
    // Hair shine (lighter highlights)
    ctx.fillStyle = '#D2691E';
    if (facingRight) {
        ctx.fillRect(x + s * 3.5, y + s * 3.5, s * 0.8, s * 0.5);
    } else {
        ctx.fillRect(x + s * 5.5, y + s * 3.5, s * 0.8, s * 0.5);
    }

    // Face (side profile)
    ctx.fillStyle = '#FFD6B0';
    if (facingRight) {
        ctx.fillRect(x + s * 4, y + s * 3, s * 4, s * 6);
        // Nose
        ctx.fillRect(x + s * 8, y + s * 5, s, s * 2);
    } else {
        ctx.fillRect(x + s * 2, y + s * 3, s * 4, s * 6);
        // Nose
        ctx.fillRect(x + s * 1, y + s * 5, s, s * 2);
    }
    
    // Face shading
    ctx.fillStyle = '#FDBCB4';
    if (facingRight) {
        ctx.fillRect(x + s * 4, y + s * 5.5, s, s * 2);
    } else {
        ctx.fillRect(x + s * 5, y + s * 5.5, s, s * 2);
    }

    // Eye (single eye in side view)
    if (princess.eyesOpen) {
        ctx.fillStyle = '#000';
        if (facingRight) {
            ctx.fillRect(x + s * 6, y + s * 4.5, s * 1.5, s * 2);
            // Eye shine
            ctx.fillStyle = '#fff';
            ctx.fillRect(x + s * 6.5, y + s * 4.5, s * 0.5, s);
        } else {
            ctx.fillRect(x + s * 2.5, y + s * 4.5, s * 1.5, s * 2);
            // Eye shine
            ctx.fillStyle = '#fff';
            ctx.fillRect(x + s * 3, y + s * 4.5, s * 0.5, s);
        }
    } else {
        // Closed eye
        ctx.fillStyle = '#000';
        if (facingRight) {
            ctx.fillRect(x + s * 6, y + s * 5.5, s * 1.5, s);
        } else {
            ctx.fillRect(x + s * 2.5, y + s * 5.5, s * 1.5, s);
        }
    }
    
    // Eyelashes
    ctx.fillStyle = '#000';
    if (facingRight) {
        ctx.fillRect(x + s * 6, y + s * 4.2, s * 1.5, s * 0.3);
        ctx.fillRect(x + s * 6, y + s * 6.5, s * 1.5, s * 0.3);
    } else {
        ctx.fillRect(x + s * 2.5, y + s * 4.2, s * 1.5, s * 0.3);
        ctx.fillRect(x + s * 2.5, y + s * 6.5, s * 1.5, s * 0.3);
    }

    // Rosy cheek
    ctx.fillStyle = 'rgba(255, 182, 193, 0.8)';
    if (facingRight) {
        ctx.fillRect(x + s * 5, y + s * 6, s * 2, s * 1.5);
    } else {
        ctx.fillRect(x + s * 3, y + s * 6, s * 2, s * 1.5);
    }

    // Smile (side profile)
    ctx.fillStyle = '#000';
    if (facingRight) {
        ctx.fillRect(x + s * 6.5, y + s * 7.5, s * 1.5, s * 0.5);
        ctx.fillRect(x + s * 7.5, y + s * 7, s * 0.5, s * 0.5);
    } else {
        ctx.fillRect(x + s * 2, y + s * 7.5, s * 1.5, s * 0.5);
        ctx.fillRect(x + s * 2, y + s * 7, s * 0.5, s * 0.5);
    }

    // Neck
    ctx.fillStyle = '#FFD6B0';
    ctx.fillRect(x + s * 4, y + s * 9, s * 2, s * 1.5);

    // Dress with flow
    const dressY = y + s * 10 + princess.dressOffset;
    ctx.fillStyle = '#FF69B4';
    ctx.fillRect(x + s * 2, y + s * 10, s * 6, s * 8);
    
    // Dress details - ruffles
    ctx.fillStyle = '#FFB6C1';
    ctx.fillRect(x + s * 2, y + s * 11, s * 6, s);
    ctx.fillRect(x + s * 2, y + s * 14, s * 6, s);
    
    // Dress side shading
    ctx.fillStyle = '#FF1493';
    ctx.fillRect(x + s * 2, y + s * 10, s * 0.5, s * 8);
    ctx.fillRect(x + s * 7.5, y + s * 10, s * 0.5, s * 8);
    
    // Dress flowing bottom
    ctx.fillStyle = '#FF69B4';
    if (!princess.onGround) {
        ctx.fillRect(x + s * 2 + princess.dressOffset * 0.5, y + s * 17, s * 6, s);
    }

    // Arms (side view)
    ctx.fillStyle = '#FFD6B0';
    if (princess.onGround && Math.abs(princess.velocityX) > 0.5) {
        // Walking - arm swing
        const armSwing = princess.animFrame === 0 ? s : -s;
        if (facingRight) {
            // Front arm
            ctx.fillRect(x + s * 6, y + s * 11 + armSwing, s * 2, s * 5);
            // Back arm hint
            ctx.fillRect(x + s * 3, y + s * 12 - armSwing, s, s * 3);
        } else {
            // Front arm
            ctx.fillRect(x + s * 2, y + s * 11 + armSwing, s * 2, s * 5);
            // Back arm hint
            ctx.fillRect(x + s * 6, y + s * 12 - armSwing, s, s * 3);
        }
    } else {
        // Standing - arms at sides
        if (facingRight) {
            ctx.fillRect(x + s * 7, y + s * 11, s * 1.5, s * 5);
            ctx.fillRect(x + s * 3, y + s * 12, s, s * 3);
        } else {
            ctx.fillRect(x + s * 1.5, y + s * 11, s * 1.5, s * 5);
            ctx.fillRect(x + s * 6, y + s * 12, s, s * 3);
        }
    }
    
    // Hands
    ctx.fillStyle = '#FFD6B0';
    if (facingRight) {
        ctx.fillRect(x + s * 7.5, y + s * 16, s, s);
        ctx.fillRect(x + s * 3, y + s * 14.5, s, s);
    } else {
        ctx.fillRect(x + s * 1.5, y + s * 16, s, s);
        ctx.fillRect(x + s * 7, y + s * 14.5, s, s);
    }

    // Legs (side view walking animation)
    if (princess.onGround && Math.abs(princess.velocityX) > 0.5) {
        ctx.fillStyle = '#FFD6B0';
        
        if (facingRight) {
            if (princess.animFrame === 0) {
                // Front leg forward
                ctx.fillRect(x + s * 5, y + s * 18, s * 2, s * 3);
                // Back leg
                ctx.fillRect(x + s * 3, y + s * 19, s * 2, s * 2);
            } else {
                // Front leg back
                ctx.fillRect(x + s * 5, y + s * 19, s * 2, s * 2);
                // Back leg forward
                ctx.fillRect(x + s * 3, y + s * 18, s * 2, s * 3);
            }
            
            // Shoes
            ctx.fillStyle = '#FF69B4';
            if (princess.animFrame === 0) {
                ctx.fillRect(x + s * 5, y + s * 20.5, s * 2.5, s * 1);
                ctx.fillRect(x + s * 3, y + s * 20.5, s * 2, s * 0.5);
            } else {
                ctx.fillRect(x + s * 5, y + s * 20.5, s * 2, s * 0.5);
                ctx.fillRect(x + s * 3, y + s * 20.5, s * 2.5, s * 1);
            }
        } else {
            if (princess.animFrame === 0) {
                // Front leg forward
                ctx.fillRect(x + s * 3, y + s * 18, s * 2, s * 3);
                // Back leg
                ctx.fillRect(x + s * 5, y + s * 19, s * 2, s * 2);
            } else {
                // Front leg back
                ctx.fillRect(x + s * 3, y + s * 19, s * 2, s * 2);
                // Back leg forward
                ctx.fillRect(x + s * 5, y + s * 18, s * 2, s * 3);
            }
            
            // Shoes
            ctx.fillStyle = '#FF69B4';
            if (princess.animFrame === 0) {
                ctx.fillRect(x + s * 0.5, y + s * 20.5, s * 2.5, s * 1);
                ctx.fillRect(x + s * 5, y + s * 20.5, s * 2, s * 0.5);
            } else {
                ctx.fillRect(x + s * 3, y + s * 20.5, s * 2, s * 0.5);
                ctx.fillRect(x + s * 2.5, y + s * 20.5, s * 2.5, s * 1);
            }
        }
    } else {
        // Standing still
        ctx.fillStyle = '#FFD6B0';
        if (facingRight) {
            ctx.fillRect(x + s * 4, y + s * 18, s * 2, s * 3);
        } else {
            ctx.fillRect(x + s * 4, y + s * 18, s * 2, s * 3);
        }
        
        // Shoes
        ctx.fillStyle = '#FF69B4';
        if (facingRight) {
            ctx.fillRect(x + s * 4, y + s * 20.5, s * 2.5, s * 1);
        } else {
            ctx.fillRect(x + s * 1.5, y + s * 20.5, s * 2.5, s * 1);
        }
    }

    ctx.restore();

    // Heart particles around princess
    if (frameCount % 30 === 0) {
        createHeartParticles(x + princess.width / 2, y + princess.height / 2, 1);
    }
}

function drawPrince() {
    const x = Math.round(prince.x);
    const y = Math.round(prince.y);
    const s = 2; // REDUCED FROM 3 TO 2
    const facingLeft = true; // Prince faces left toward the princess

    // Idle animation with breathing effect
    prince.animTimer++;
    if (prince.animTimer > 60) {
        prince.animFrame = (prince.animFrame + 1) % 2;
        prince.animTimer = 0;
    }
    
    // Breathing/bobbing animation
    const breathOffset = Math.sin(frameCount * 0.05) * s * 0.5;

    // Crown (side view) - more detailed
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(x + s * 2, y - s + breathOffset, s * 5, s * 2.5);
    ctx.fillRect(x + s * 2, y - s * 1.5 + breathOffset, s, s * 1.5);
    ctx.fillRect(x + s * 4, y - s * 2 + breathOffset, s, s * 2);
    
    // Crown shading
    ctx.fillStyle = '#FFA500';
    ctx.fillRect(x + s * 2, y - s + breathOffset, s * 1.5, s);
    
    // Crown jewels - blue sapphires
    ctx.fillStyle = '#4169E1';
    ctx.fillRect(x + s * 2.5, y - s * 0.5 + breathOffset, s * 0.5, s * 0.5);
    ctx.fillRect(x + s * 4, y - s + breathOffset, s, s);
    
    // Hair (styled - side view)
    ctx.fillStyle = '#3B1F0B';
    // Hair back
    ctx.fillRect(x + s * 4, y + s * 2 + breathOffset, s * 4, s * 4);
    // Hair front styled up
    ctx.fillRect(x + s * 2, y + s * 2 + breathOffset, s * 2, s * 3);
    ctx.fillRect(x + s * 2, y + s * 1 + breathOffset, s * 2, s);
    
    // Hair texture
    ctx.fillStyle = '#654321';
    ctx.fillRect(x + s * 5, y + s * 2.5 + breathOffset, s, s);
    ctx.fillRect(x + s * 6.5, y + s * 2.5 + breathOffset, s, s);
    
    // Hair highlights
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(x + s * 2.5, y + s * 2 + breathOffset, s * 1.5, s);
    
    // Hair shine
    ctx.fillStyle = '#A0522D';
    ctx.fillRect(x + s * 3, y + s * 2.5 + breathOffset, s, s * 0.5);

    // Face (side profile)
    ctx.fillStyle = '#FFD6B0';
    ctx.fillRect(x + s * 2, y + s * 3 + breathOffset, s * 4, s * 6);
    // Nose
    ctx.fillRect(x + s * 1, y + s * 5 + breathOffset, s, s * 2);
    
    // Face shading
    ctx.fillStyle = '#FDBCB4';
    ctx.fillRect(x + s * 2, y + s * 5.5 + breathOffset, s, s * 2);

    // Eye (single eye in side view)
    if (prince.eyesOpen) {
        ctx.fillStyle = '#000';
        ctx.fillRect(x + s * 2.5, y + s * 4.5 + breathOffset, s * 1.5, s * 2);
        // Eye shine
        ctx.fillStyle = '#fff';
        ctx.fillRect(x + s * 3, y + s * 4.5 + breathOffset, s * 0.5, s);
    } else {
        // Closed eye
        ctx.fillStyle = '#000';
        ctx.fillRect(x + s * 2.5, y + s * 5.5 + breathOffset, s * 1.5, s);
    }
    
    // Eyelashes
    ctx.fillStyle = '#000';
    ctx.fillRect(x + s * 2.5, y + s * 4.2 + breathOffset, s * 1.5, s * 0.3);

    // Rosy cheek
    ctx.fillStyle = 'rgba(255, 182, 193, 0.7)';
    ctx.fillRect(x + s * 3, y + s * 6 + breathOffset, s * 2, s * 1.5);

    // Smile (side profile)
    ctx.fillStyle = '#000';
    ctx.fillRect(x + s * 2, y + s * 7.5 + breathOffset, s * 1.5, s * 0.5);
    ctx.fillRect(x + s * 2, y + s * 7 + breathOffset, s * 0.5, s * 0.5);

    // Neck
    ctx.fillStyle = '#FFD6B0';
    ctx.fillRect(x + s * 3.5, y + s * 9 + breathOffset, s * 2, s * 1.5);

    // Tunic (side view) - more detailed
    ctx.fillStyle = '#4169E1';
    ctx.fillRect(x + s * 2, y + s * 10 + breathOffset, s * 6, s * 6);

    // Tunic details - trim
    ctx.fillStyle = '#27408B';
    ctx.fillRect(x + s * 2, y + s * 14 + breathOffset, s * 6, s);
    ctx.fillRect(x + s * 2, y + s * 11 + breathOffset, s * 6, s * 0.5);
    
    // Tunic shading
    ctx.fillStyle = '#315A9D';
    ctx.fillRect(x + s * 2, y + s * 10 + breathOffset, s * 0.5, s * 6);

    // Belt
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(x + s * 2, y + s * 13 + breathOffset, s * 6, s);
    
    // Belt buckle - ornate
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(x + s * 4, y + s * 13 + breathOffset, s, s);
    ctx.fillStyle = '#FFA500';
    ctx.fillRect(x + s * 4.3, y + s * 13.3 + breathOffset, s * 0.4, s * 0.4);

    // Arms (side view with idle animation)
    ctx.fillStyle = '#FFD6B0';
    const armOffset = prince.animFrame === 1 ? s * 0.5 : 0;
    // Front arm
    ctx.fillRect(x + s * 2, y + s * 11 + armOffset + breathOffset, s * 2, s * 5);
    // Back arm hint
    ctx.fillRect(x + s * 6, y + s * 12 - armOffset + breathOffset, s, s * 3);
    
    // Hands
    ctx.fillStyle = '#FFD6B0';
    ctx.fillRect(x + s * 2, y + s * 15.5 + armOffset + breathOffset, s, s);
    ctx.fillRect(x + s * 6, y + s * 14.5 - armOffset + breathOffset, s, s);

    // Pants (side view)
    ctx.fillStyle = '#DC143C';
    ctx.fillRect(x + s * 3, y + s * 16 + breathOffset, s * 4, s * 4);
    
    // Pants shading
    ctx.fillStyle = '#B22222';
    ctx.fillRect(x + s * 3, y + s * 16 + breathOffset, s * 0.5, s * 4);

    // Legs (idle animation - alternating)
    const frontLegY = prince.animFrame === 0 ? y + s * 20 + breathOffset : y + s * 20.5 + breathOffset;
    const backLegY = prince.animFrame === 0 ? y + s * 20.5 + breathOffset : y + s * 20 + breathOffset;
    
    ctx.fillStyle = '#FFD6B0';
    // Front leg
    ctx.fillRect(x + s * 3, y + s * 18 + breathOffset, s * 2, s * 3);
    // Back leg hint
    ctx.fillRect(x + s * 5.5, y + s * 19 + breathOffset, s * 1.5, s * 2);
    
    // Boots
    ctx.fillStyle = '#5A2D0C';
    ctx.fillRect(x + s * 3, frontLegY, s * 2.5, s * 2);
    ctx.fillRect(x + s * 5.5, backLegY, s * 1.5, s * 1.5);
    
    // Boot details - metal studs
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(x + s * 3, frontLegY, s * 2.5, s * 0.5);
    
    // Boot shine
    ctx.fillStyle = '#654321';
    ctx.fillRect(x + s * 3.5, frontLegY + s * 0.5, s, s * 0.5);

    // Heart particles around prince
    if (frameCount % 35 === 0) {
        createHeartParticles(x + prince.width / 2, y + prince.height / 2, 1);
    }
}

function drawPlatform(platform) {
    const x = Math.round(platform.x);
    const y = Math.round(platform.y);
    
    if (platform.type === 'ground') {
        // Dirt/soil
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(x, y, platform.width, platform.height);
        
        // Darker dirt patches
        ctx.fillStyle = '#654321';
        for (let i = 0; i < platform.width; i += 30) {
            ctx.fillRect(x + i + 5, y + 15, 10, 8);
            ctx.fillRect(x + i + 18, y + 28, 8, 6);
        }
        
        // Grass layer - vibrant green
        const grassGradient = ctx.createLinearGradient(0, y, 0, y + 12);
        grassGradient.addColorStop(0, '#32CD32');
        grassGradient.addColorStop(1, '#228B22');
        ctx.fillStyle = grassGradient;
        ctx.fillRect(x, y, platform.width, 12);
        
        // Grass blades
        ctx.fillStyle = '#228B22';
        for (let i = 0; i < platform.width; i += 8) {
            // Tall grass blades
            ctx.fillRect(x + i, y - 3, 2, 5);
            ctx.fillRect(x + i + 4, y - 2, 2, 4);
            ctx.fillRect(x + i + 6, y - 4, 2, 6);
        }
        
        // Dark grass details
        ctx.fillStyle = '#006400';
        for (let i = 0; i < platform.width; i += 12) {
            ctx.fillRect(x + i + 2, y - 2, 1, 3);
        }
        
        // Flowers on grass
        for (let i = 0; i < platform.width; i += 45) {
            // Pink flower
            ctx.fillStyle = '#FF69B4';
            ctx.fillRect(x + i + 10, y - 3, 3, 3);
            ctx.fillRect(x + i + 9, y - 2, 1, 1);
            ctx.fillRect(x + i + 13, y - 2, 1, 1);
            
            // Yellow center
            ctx.fillStyle = '#FFD700';
            ctx.fillRect(x + i + 11, y - 2, 1, 1);
            
            // Stem
            ctx.fillStyle = '#228B22';
            ctx.fillRect(x + i + 11, y, 1, 3);
            
            // White flower
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(x + i + 30, y - 2, 2, 2);
            ctx.fillRect(x + i + 29, y - 1, 1, 1);
            ctx.fillRect(x + i + 32, y - 1, 1, 1);
            
            // Yellow center
            ctx.fillStyle = '#FFD700';
            ctx.fillRect(x + i + 30, y - 1, 1, 1);
            
            // Stem
            ctx.fillStyle = '#228B22';
            ctx.fillRect(x + i + 30, y + 1, 1, 2);
        }
        
        // Brick/dirt pattern with depth
        ctx.strokeStyle = '#654321';
        ctx.lineWidth = 2;
        const blockSize = 25;
        for (let i = 0; i < platform.width; i += blockSize) {
            for (let j = 12; j < platform.height; j += blockSize) {
                ctx.strokeRect(x + i, y + j, blockSize, blockSize);
                
                // Add some texture dots
                ctx.fillStyle = '#5A2D0C';
                ctx.fillRect(x + i + 8, y + j + 8, 2, 2);
                ctx.fillRect(x + i + 15, y + j + 12, 1, 1);
            }
        }
    } else {
        // Floating brick - enhanced
        // Base brick color with gradient
        const brickGradient = ctx.createLinearGradient(0, y, 0, y + platform.height);
        brickGradient.addColorStop(0, '#D2691E');
        brickGradient.addColorStop(0.5, '#CD853F');
        brickGradient.addColorStop(1, '#A0522D');
        ctx.fillStyle = brickGradient;
        ctx.fillRect(x, y, platform.width, platform.height);
        
        // Individual bricks with detail
        ctx.fillStyle = '#8B4513';
        const bw = 20;
        for (let i = 0; i < platform.width; i += bw) {
            ctx.fillRect(x + i + 2, y + 2, bw - 4, platform.height - 4);
            
            // Brick texture
            ctx.fillStyle = '#A0522D';
            ctx.fillRect(x + i + 4, y + 4, 2, 2);
            ctx.fillRect(x + i + 10, y + 7, 1, 1);
            ctx.fillStyle = '#8B4513';
        }
        
        // Highlight on top
        ctx.fillStyle = '#F4A460';
        ctx.fillRect(x + 2, y + 2, platform.width - 4, 3);
        
        // Shadow on bottom
        ctx.fillStyle = '#654321';
        ctx.fillRect(x + 2, y + platform.height - 4, platform.width - 4, 2);
        
        // Outline
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, platform.width, platform.height);
        
        // Small moss/grass on some bricks
        if (Math.random() > 0.7) {
            ctx.fillStyle = '#228B22';
            ctx.fillRect(x + 2, y - 1, 3, 2);
        }
    }
}

function drawEnemy(enemy) {
    if (!enemy.alive) return;

    const x = Math.round(enemy.x);
    const y = Math.round(enemy.y);
    const s = 4;
    
    // Sword swing animation
    const swordAngle = Math.sin(frameCount * 0.1) * 15; // oscillate sword

    // === Shadow ===
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.fillRect(x + s, y + s * 11, s * 6, s);

    // === Royal Guard Pixelated (Gray Armor) ===
    
    // Crown (gold)
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(x + s * 1, y, s * 2, s); // left crown point
    ctx.fillRect(x + s * 3, y - s, s * 2, s); // middle crown point
    ctx.fillRect(x + s * 5, y, s * 2, s); // right crown point
    ctx.fillRect(x + s * 1, y + s, s * 6, s); // crown band
    
    // Head (tan)
    ctx.fillStyle = '#DEB887';
    ctx.fillRect(x + s * 1.5, y + s * 2, s * 5, s * 2);
    
    // Face details
    // Eyes (white)
    ctx.fillStyle = '#FFF';
    ctx.fillRect(x + s * 2, y + s * 2.5, s, s);
    ctx.fillRect(x + s * 5, y + s * 2.5, s, s);
    
    // Eyes pupils (black)
    ctx.fillStyle = '#000';
    ctx.fillRect(x + s * 2.3, y + s * 2.7, s * 0.6, s * 0.6);
    ctx.fillRect(x + s * 5.3, y + s * 2.7, s * 0.6, s * 0.6);
    
    // Stern mouth (red)
    ctx.fillStyle = '#8B0000';
    ctx.fillRect(x + s * 3, y + s * 3.5, s * 2, s * 0.5);
    
    // Body - Armor (gray/silver)
    ctx.fillStyle = '#A9A9A9';
    ctx.fillRect(x + s * 1, y + s * 4, s * 6, s * 4);
    
    // Armor plates (darker gray pattern)
    ctx.fillStyle = '#696969';
    ctx.fillRect(x + s * 1.5, y + s * 4.5, s * 1.5, s * 1.5);
    ctx.fillRect(x + s * 4, y + s * 4.5, s * 1.5, s * 1.5);
    ctx.fillRect(x + s * 1.5, y + s * 6.5, s * 1.5, s * 1.5);
    ctx.fillRect(x + s * 4, y + s * 6.5, s * 1.5, s * 1.5);
    
    // Light highlight on armor
    ctx.fillStyle = '#E8E8E8';
    ctx.fillRect(x + s * 1, y + s * 4, s * 6, s * 0.5);
    ctx.fillRect(x + s * 1, y + s * 7.5, s * 6, s * 0.5);
    
    // Arms (tan)
    ctx.fillStyle = '#DEB887';
    ctx.fillRect(x - s, y + s * 4, s, s * 3);
    ctx.fillRect(x + s * 7, y + s * 4, s, s * 3);
    
    // Gauntlets (armor, dark gray)
    ctx.fillStyle = '#696969';
    ctx.fillRect(x - s, y + s * 7, s, s);
    ctx.fillRect(x + s * 7, y + s * 7, s, s);
    
    // Legs (dark gray)
    ctx.fillStyle = '#696969';
    ctx.fillRect(x + s * 1.5, y + s * 8, s * 1.5, s * 3);
    ctx.fillRect(x + s * 4, y + s * 8, s * 1.5, s * 3);
    
    // Boots (black)
    ctx.fillStyle = '#000';
    ctx.fillRect(x + s * 1.5, y + s * 10.8, s * 1.5, s * 0.5);
    ctx.fillRect(x + s * 4, y + s * 10.8, s * 1.5, s * 0.5);
    
    // Sword with animation
    ctx.save();
    ctx.translate(x + s * 8.5, y + s * 5);
    ctx.rotate((swordAngle * Math.PI) / 180);
    
    // Sword handle (brown)
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(0, 0, s * 0.8, s * 2);
    
    // Guard (gold)
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(-s * 1.2, s * 1.8, s * 3, s * 0.4);
    
    // Blade (silver)
    ctx.fillStyle = '#C0C0C0';
    ctx.fillRect(s * 0.1, -s * 4, s * 0.6, s * 5);
    
    // Blade edge (bright)
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(s * 0.15, -s * 4, s * 0.2, s * 5);
    
    ctx.restore();
}

function drawHeart(heart) {
    if (heart.collected) return;
    
    const x = Math.round(heart.x);
    const y = Math.round(heart.y + Math.sin(heart.float) * 5);
    const s = 3.5;
    
    // Outer glow - multiple layers
    ctx.shadowColor = '#FF1493';
    ctx.shadowBlur = 20;
    
    // Outer pink glow
    ctx.fillStyle = 'rgba(255, 105, 180, 0.4)';
    ctx.beginPath();
    ctx.arc(x + s * 2.5, y + s * 2, s * 2.2, 0, Math.PI * 2);
    ctx.arc(x + s * 5.5, y + s * 2, s * 2.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(x + s * 0.5, y + s * 2, s * 7, s * 4);
    ctx.beginPath();
    ctx.moveTo(x + s * 0.5, y + s * 3);
    ctx.lineTo(x + s * 4, y + s * 8);
    ctx.lineTo(x + s * 7.5, y + s * 3);
    ctx.closePath();
    ctx.fill();
    
    ctx.shadowBlur = 15;
    
    // Main heart body - bright pink
    ctx.fillStyle = '#FF1493';
    
    // Top left circle
    ctx.beginPath();
    ctx.arc(x + s * 2.5, y + s * 2, s * 1.8, 0, Math.PI * 2);
    ctx.fill();
    
    // Top right circle
    ctx.beginPath();
    ctx.arc(x + s * 5.5, y + s * 2, s * 1.8, 0, Math.PI * 2);
    ctx.fill();
    
    // Center rectangle
    ctx.fillRect(x + s * 0.8, y + s * 2, s * 6.4, s * 3.5);
    
    // Bottom triangle (heart point)
    ctx.beginPath();
    ctx.moveTo(x + s * 0.8, y + s * 4);
    ctx.lineTo(x + s * 4, y + s * 8);
    ctx.lineTo(x + s * 7.2, y + s * 4);
    ctx.closePath();
    ctx.fill();
    
    ctx.shadowBlur = 0;
    
    // Highlight/shine on heart
    ctx.fillStyle = '#FFB6C1';
    ctx.beginPath();
    ctx.arc(x + s * 2.8, y + s * 1.8, s * 0.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(x + s * 2, y + s * 2, s * 1.5, s * 1);
    
    // Bright shine spot
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(x + s * 2.5, y + s * 1.5, s * 0.8, s * 0.8);
    ctx.fillRect(x + s * 3, y + s * 2, s * 0.5, s * 0.5);
    
    // Dark outline for definition
    ctx.strokeStyle = '#C71585';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.arc(x + s * 2.5, y + s * 2, s * 1.8, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x + s * 5.5, y + s * 2, s * 1.8, 0, Math.PI * 2);
    ctx.stroke();
    
    // Animated sparkles around heart
    const sparkleOffset = Math.sin(heart.float * 2) * 2;
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(x - s, y + s * 3 + sparkleOffset, s * 0.5, s * 0.5);
    ctx.fillRect(x + s * 8, y + s * 3 - sparkleOffset, s * 0.5, s * 0.5);
    ctx.fillRect(x + s * 4, y - s + sparkleOffset, s * 0.5, s * 0.5);
    ctx.fillRect(x + s * 4, y + s * 8 - sparkleOffset, s * 0.5, s * 0.5);
    
    // White sparkles
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(x + s * 1, y + s * 1 - sparkleOffset, s * 0.4, s * 0.4);
    ctx.fillRect(x + s * 6.5, y + s * 6 + sparkleOffset, s * 0.4, s * 0.4);
    
    heart.float += 0.08;
    
    // More sparkle particles
    if (frameCount % 15 === 0) {
        createHeartParticles(x + s * 4, y + s * 4, 2);
    }
}

function drawCastle() {
    const x = Math.round(castle.x);
    const y = Math.round(castle.y);
    const s = 10;
    
    // Main castle walls - stone gradient effect
    ctx.fillStyle = '#6B7280';
    ctx.fillRect(x, y + s*2, s*16, s*26);
    
    // Stone pattern on walls
    ctx.fillStyle = '#4B5563';
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 13; j++) {
            ctx.fillRect(x + i * s * 2.66, y + s * 2 + j * s * 2, s * 2.2, s * 1.8);
        }
    }
    
    // Left tower
    ctx.fillStyle = '#6B7280';
    ctx.fillRect(x, y, s*4, s*28);
    
    // Right tower
    ctx.fillStyle = '#6B7280';
    ctx.fillRect(x + s*12, y, s*4, s*28);
    
    // Tower crenellations (battlements) - left
    ctx.fillStyle = '#808080';
    for (let i = 0; i < 5; i++) {
        ctx.fillRect(x + i * s * 0.8, y - s, s * 0.6, s * 1.2);
        // Darker shading
        ctx.fillStyle = '#505050';
        ctx.fillRect(x + i * s * 0.8, y - s * 0.5, s * 0.3, s * 0.5);
        ctx.fillStyle = '#808080';
    }
    
    // Tower crenellations (battlements) - right
    ctx.fillStyle = '#808080';
    for (let i = 0; i < 5; i++) {
        ctx.fillRect(x + s*12 + i * s * 0.8, y - s, s * 0.6, s * 1.2);
        // Darker shading
        ctx.fillStyle = '#505050';
        ctx.fillRect(x + s*12 + i * s * 0.8, y - s * 0.5, s * 0.3, s * 0.5);
        ctx.fillStyle = '#808080';
    }
    
    // Castle door - ornate
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(x + s*6, y + s*17, s*4, s*9);
    
    // Door details - wooden planks
    ctx.fillStyle = '#654321';
    ctx.fillRect(x + s*6, y + s*17, s*4, s*1);
    ctx.fillRect(x + s*6, y + s*20, s*4, s*1);
    ctx.fillRect(x + s*6, y + s*23, s*4, s*1);
    
    // Door handle
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(x + s*8.5, y + s*20, s*0.6, s*0.6);
    
    // Door knocker
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(x + s*8.2, y + s*19, s*0.4, 0, Math.PI * 2);
    ctx.fill();
    
    // Wooden door frame
    ctx.fillStyle = '#654321';
    ctx.strokeStyle = '#3D2817';
    ctx.lineWidth = 2;
    ctx.strokeRect(x + s*6, y + s*17, s*4, s*9);
    
    // Windows - left tower (lower)
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(x + s*0.5, y + s*10, s*2, s*2);
    
    // Windows - left tower (middle)
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(x + s*0.5, y + s*16, s*2, s*2);
    
    // Windows - left tower (upper)
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(x + s*0.5, y + s*22, s*2, s*2);
    
    // Windows - right tower (lower)
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(x + s*13.5, y + s*10, s*2, s*2);
    
    // Windows - right tower (middle)
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(x + s*13.5, y + s*16, s*2, s*2);
    
    // Windows - right tower (upper)
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(x + s*13.5, y + s*22, s*2, s*2);
    
    // Window panes - left tower lower
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x + s*1.5, y + s*10);
    ctx.lineTo(x + s*1.5, y + s*12);
    ctx.moveTo(x + s*0.5, y + s*11);
    ctx.lineTo(x + s*2.5, y + s*11);
    ctx.stroke();
    
    // Window panes - left tower middle
    ctx.beginPath();
    ctx.moveTo(x + s*1.5, y + s*16);
    ctx.lineTo(x + s*1.5, y + s*18);
    ctx.moveTo(x + s*0.5, y + s*17);
    ctx.lineTo(x + s*2.5, y + s*17);
    ctx.stroke();
    
    // Window panes - left tower upper
    ctx.beginPath();
    ctx.moveTo(x + s*1.5, y + s*22);
    ctx.lineTo(x + s*1.5, y + s*24);
    ctx.moveTo(x + s*0.5, y + s*23);
    ctx.lineTo(x + s*2.5, y + s*23);
    ctx.stroke();
    
    // Window panes - right tower lower
    ctx.beginPath();
    ctx.moveTo(x + s*14.5, y + s*10);
    ctx.lineTo(x + s*14.5, y + s*12);
    ctx.moveTo(x + s*13.5, y + s*11);
    ctx.lineTo(x + s*15.5, y + s*11);
    ctx.stroke();
    
    // Window panes - right tower middle
    ctx.beginPath();
    ctx.moveTo(x + s*14.5, y + s*16);
    ctx.lineTo(x + s*14.5, y + s*18);
    ctx.moveTo(x + s*13.5, y + s*17);
    ctx.lineTo(x + s*15.5, y + s*17);
    ctx.stroke();
    
    // Window panes - right tower upper
    ctx.beginPath();
    ctx.moveTo(x + s*14.5, y + s*22);
    ctx.lineTo(x + s*14.5, y + s*24);
    ctx.moveTo(x + s*13.5, y + s*23);
    ctx.lineTo(x + s*15.5, y + s*23);
    ctx.stroke();
    
    // Central tower window - large
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(x + s*7, y + s*7, s*2, s*3);
    
    // Central tower window panes
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x + s*8, y + s*7);
    ctx.lineTo(x + s*8, y + s*10);
    ctx.moveTo(x + s*7, y + s*8.5);
    ctx.lineTo(x + s*9, y + s*8.5);
    ctx.stroke();
    
    // Castle flags on towers - left
    ctx.fillStyle = '#FF1493';
    ctx.fillRect(x + s*0.5, y - s*1.5, s*0.6, s*2);
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.moveTo(x + s*1.1, y - s*1.5);
    ctx.lineTo(x + s*2.2, y - s*0.8);
    ctx.lineTo(x + s*1.1, y - s*0.1);
    ctx.closePath();
    ctx.fill();
    
    // Castle flags on towers - right
    ctx.fillStyle = '#FF1493';
    ctx.fillRect(x + s*15.4, y - s*1.5, s*0.6, s*2);
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.moveTo(x + s*16, y - s*1.5);
    ctx.lineTo(x + s*15, y - s*0.8);
    ctx.lineTo(x + s*16, y - s*0.1);
    ctx.closePath();
    ctx.fill();
    
    // Castle shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fillRect(x, y + s*28, s*16, s*1.5);
}

function drawFlagPole() {
    const x = Math.round(flagPole.x);
    const y = Math.round(flagPole.y);
    
    // Pole (white)
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(x, y, flagPole.width, flagPole.height);
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fillRect(x + 2, y, 3, flagPole.height);
    
    const flagY = flagPole.reached ? y + flagPole.height - 60 : flagPole.flagY;
    
    // Flag wave animation
    const waveOffset = Math.sin(frameCount * 0.08) * 5;
    
    // Flag pole attachment (wood)
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(x - 8, flagY, 8, 3);
    
    // Flag body - Larger Triangular with White and Blue
    const flagWidth = 70;
    const flagHeight = 40;
    const poleOffsetX = -35; // Center the flag on the pole
    
    // White triangle base
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.moveTo(x + poleOffsetX + 35, flagY); // point at pole (centered)
    ctx.lineTo(x + poleOffsetX + 35 + flagWidth + waveOffset, flagY - flagHeight/2); // top point
    ctx.lineTo(x + poleOffsetX + 35 + flagWidth + waveOffset, flagY + flagHeight/2); // bottom point
    ctx.closePath();
    ctx.fill();
    
    // Blue stripes (vertical sections)
    ctx.fillStyle = '#0052CC';
    
    // First stripe
    ctx.beginPath();
    ctx.moveTo(x + poleOffsetX + 35, flagY);
    ctx.lineTo(x + poleOffsetX + 35 + flagWidth/3 + waveOffset, flagY - flagHeight/6);
    ctx.lineTo(x + poleOffsetX + 35 + flagWidth/3 + waveOffset, flagY + flagHeight/6);
    ctx.closePath();
    ctx.fill();
    
    // Second stripe
    ctx.beginPath();
    ctx.moveTo(x + poleOffsetX + 35 + flagWidth/3 + waveOffset, flagY - flagHeight/6);
    ctx.lineTo(x + poleOffsetX + 35 + 2*flagWidth/3 + waveOffset, flagY - flagHeight/3);
    ctx.lineTo(x + poleOffsetX + 35 + 2*flagWidth/3 + waveOffset, flagY + flagHeight/3);
    ctx.lineTo(x + poleOffsetX + 35 + flagWidth/3 + waveOffset, flagY + flagHeight/6);
    ctx.closePath();
    ctx.fill();
    
    // Third stripe
    ctx.beginPath();
    ctx.moveTo(x + poleOffsetX + 35 + 2*flagWidth/3 + waveOffset, flagY - flagHeight/3);
    ctx.lineTo(x + poleOffsetX + 35 + flagWidth + waveOffset, flagY - flagHeight/2);
    ctx.lineTo(x + poleOffsetX + 35 + flagWidth + waveOffset, flagY + flagHeight/2);
    ctx.lineTo(x + poleOffsetX + 35 + 2*flagWidth/3 + waveOffset, flagY + flagHeight/3);
    ctx.closePath();
    ctx.fill();
    
    // Flag border (darker blue)
    ctx.strokeStyle = '#0052CC';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x + poleOffsetX + 35, flagY);
    ctx.lineTo(x + poleOffsetX + 35 + flagWidth + waveOffset, flagY - flagHeight/2);
    ctx.lineTo(x + poleOffsetX + 35 + flagWidth + waveOffset, flagY + flagHeight/2);
    ctx.closePath();
    ctx.stroke();
    
    // Crown on flag (gold) - in the center area
    ctx.fillStyle = '#FFD700';
    // Crown points
    ctx.fillRect(x + poleOffsetX + 35 + flagWidth/3 + waveOffset, flagY - flagHeight/4, 6, 3);
    ctx.fillRect(x + poleOffsetX + 35 + flagWidth/2 + waveOffset, flagY - flagHeight/2.8, 6, 5);
    ctx.fillRect(x + poleOffsetX + 35 + 2*flagWidth/3 + waveOffset, flagY - flagHeight/4, 6, 3);
    // Crown band
    ctx.fillRect(x + poleOffsetX + 35 + flagWidth/3 + waveOffset, flagY - flagHeight/5, flagWidth/3, 2);
    
    // Decorative blue dots on white sections
    ctx.fillStyle = '#0052CC';
    ctx.fillRect(x + poleOffsetX + 35 + flagWidth/6 + waveOffset, flagY, 3, 3);
    ctx.fillRect(x + poleOffsetX + 35 + flagWidth/2 + waveOffset, flagY + flagHeight/8, 3, 3);
    
    // Top ornament (golden circle)
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(x + flagPole.width/2, y - 5, 8, 0, Math.PI * 2);
    ctx.fill();
}

function updateBlinking() {
    // Princess blinking
    princess.blinkTimer++;
    if (princess.blinkTimer > 180 && princess.blinkDuration === 0) {
        princess.blinkDuration = 10;
        princess.eyesOpen = false;
        princess.blinkTimer = 0;
    }
    if (princess.blinkDuration > 0) {
        princess.blinkDuration--;
        if (princess.blinkDuration === 0) {
            princess.eyesOpen = true;
        }
    }

    // Prince blinking
    prince.blinkTimer++;
    if (prince.blinkTimer > 200 && prince.blinkDuration === 0) {
        prince.blinkDuration = 10;
        prince.eyesOpen = false;
        prince.blinkTimer = 0;
    }
    if (prince.blinkDuration > 0) {
        prince.blinkDuration--;
        if (prince.blinkDuration === 0) {
            prince.eyesOpen = true;
        }
    }
}

function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        if (particles[i].isDead()) {
            particles.splice(i, 1);
        }
    }
}

function drawParticles() {
    particles.forEach(particle => particle.draw());
}

function updatePrincess() {
    // Horizontal movement with acceleration (Super Mario style)
    if (keys['ArrowLeft']) {
        if (princess.velocityX > -MOVE_SPEED) {
            princess.velocityX -= ACCELERATION;
        }
        if (princess.velocityX < -MOVE_SPEED) {
            princess.velocityX = -MOVE_SPEED;
        }
        princess.direction = 'left';
        princess.animTimer++;
    } else if (keys['ArrowRight']) {
        if (princess.velocityX < MOVE_SPEED) {
            princess.velocityX += ACCELERATION;
        }
        if (princess.velocityX > MOVE_SPEED) {
            princess.velocityX = MOVE_SPEED;
        }
        princess.direction = 'right';
        princess.animTimer++;
    } else {
        // Apply friction when not moving
        princess.velocityX *= FRICTION;
        if (Math.abs(princess.velocityX) < 0.1) princess.velocityX = 0;
    }

    // Apply gravity
    princess.velocityY += GRAVITY;
    if (princess.velocityY > MAX_FALL_SPEED) {
        princess.velocityY = MAX_FALL_SPEED;
    }

    // Update position
    princess.x += princess.velocityX;
    princess.y += princess.velocityY;

    // Animation
    if (Math.abs(princess.velocityX) > 0.5) {
        if (princess.animTimer > princess.animSpeed) {
            princess.animFrame = (princess.animFrame + 1) % 2;
            princess.animTimer = 0;
        }
    } else {
        princess.animFrame = 0;
    }

    // Platform collision
    princess.onGround = false;
    platforms.forEach(platform => {
        if (checkCollision(princess, platform)) {
            // Landing on top
            if (princess.velocityY > 0 && 
                princess.y + princess.height - princess.velocityY <= platform.y + 5) {
                princess.y = platform.y - princess.height;
                princess.velocityY = 0;
                princess.jumping = false;
                princess.onGround = true;
            }
            // Hit from below
            else if (princess.velocityY < 0 && 
                     princess.y - princess.velocityY >= platform.y + platform.height - 5) {
                princess.y = platform.y + platform.height;
                princess.velocityY = 0;
            }
        }
    });

    // Boundary check
    if (princess.x < 0) princess.x = 0;
    if (princess.x > canvas.width - princess.width) {
        princess.x = canvas.width - princess.width;
    }

    // Fall off screen
    if (princess.y > canvas.height) {
        gameOver();
    }
}

function updateEnemies() {
    enemies.forEach(enemy => {
        if (!enemy.alive) return;

        enemy.x += enemy.velocityX;

        // Check if enemy is on a platform and near edge
        let onPlatform = false;
        let nearEdge = false;
        
        platforms.forEach(platform => {
            // Check if on platform
            if (enemy.x + enemy.width > platform.x && 
                enemy.x < platform.x + platform.width &&
                enemy.y + enemy.height >= platform.y - 5 &&
                enemy.y + enemy.height <= platform.y + 10) {
                onPlatform = true;
                
                // Check if near left edge
                if (enemy.x <= platform.x + 5 && enemy.velocityX < 0) {
                    nearEdge = true;
                }
                // Check if near right edge
                if (enemy.x + enemy.width >= platform.x + platform.width - 5 && enemy.velocityX > 0) {
                    nearEdge = true;
                }
            }
        });

        // Turn around at edges or walls (smarter AI)
        if (nearEdge || enemy.x <= 0 || enemy.x + enemy.width >= canvas.width) {
            enemy.velocityX *= -1;
        }

        // Check collision with princess (only if not invincible)
        if (checkCollision(princess, enemy) && !princess.invincible) {
            // Jump on enemy (stomp)
            if (princess.velocityY > 0 && 
                princess.y + princess.height - princess.velocityY <= enemy.y + 10) {
                enemy.alive = false;
                princess.velocityY = -8; // Bounce
                score += 200;
                updateScore();
                createHeartParticles(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 8);
            } else {
                // Hit from side - lose life
                gameOver();
            }
        }
    });
}

function updateHearts() {
    hearts.forEach(heart => {
        if (!heart.collected && checkCollision(princess, heart)) {
            heart.collected = true;
            heartsCollected++;
            score += 500;
            updateScore();
            createHeartParticles(heart.x + heart.width / 2, heart.y + heart.height / 2, 15);
            soundGenerator.collectSound();
        }
    });
}

function updateClouds() {
    clouds.forEach(cloud => {
        cloud.x += cloud.speed;
        if (cloud.x > canvas.width) {
            cloud.x = -cloud.size;
        }
    });
}

function checkWinCondition() {
    if (heartsCollected < 3) return;

    if (checkCollision(princess, flagPole)) {
        flagPole.reached = true;
        flagPole.flagY += 2;
        if (flagPole.flagY >= flagPole.y + flagPole.height - 60) {
            flagPole.flagY = flagPole.y + flagPole.height - 60;
        }
    }

    const castleDoor = {
        x: castle.x + 45,
        y: castle.y + 110,
        width: 30,
        height: 60
    };

    if (flagPole.reached && checkCollision(princess, castleDoor)) {
        victory();
    }
}

function checkCollision(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}

function updateScore() {
    // Update visual heart display
    for (let i = 1; i <= 3; i++) {
        const heartIcon = document.getElementById(`heart${i}`);
        if (i <= heartsCollected) {
            heartIcon.className = 'heart-icon collected';
        } else {
            heartIcon.className = 'heart-icon uncollected';
        }
    }
}

function gameOver() {
    if (gameState !== 'playing') return;
    
    lives--;
    document.getElementById('livesCount').textContent = lives;
    soundGenerator.hitSound();
    
    if (lives <= 0) {
        gameState = 'gameOver';
        document.getElementById('gameOver').style.display = 'block';
        soundGenerator.gameOverSound();
    } else {
        // Respawn princess at start
        princess.x = 50;
        princess.y = 450;
        princess.velocityX = 0;
        princess.velocityY = 0;
        princess.jumping = false;
        
        // Flash effect
        let flashCount = 0;
        const flashInterval = setInterval(() => {
            princess.invincible = !princess.invincible;
            flashCount++;
            if (flashCount > 10) {
                clearInterval(flashInterval);
                princess.invincible = false;
            }
        }, 200);
    }
}

function victory() {
    if (gameState !== 'playing') return;
    gameState = 'victory';
    score += 1000;
    updateScore();
    soundGenerator.victoryFanfare();
    
    // Victory heart explosion
    for (let i = 0; i < 50; i++) {
        const angle = (Math.PI * 2 * i) / 50;
        const speed = Math.random() * 5 + 2;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed - 3;
        particles.push(new Particle(
            princess.x + princess.width / 2,
            princess.y + princess.height / 2,
            vx, vy, 'rgba(255, 20, 147, 1)'
        ));
    }
    
    // Start victory conversation after a delay
    setTimeout(() => {
        startVictoryConversation();
    }, 1500);
}

function startVictoryConversation() {
    // Fetch conversation data from Flask backend
    fetch('/api/conversation/start', { method: 'POST' })
        .then(response => response.json())
        .then(data => {
            gameState = 'dialogue';
            dialogueSystem.start(data.dialogues);
            giftReward.show();
            
            // Trigger summoning sound when gifts appear
            setTimeout(() => {
                if (giftReward.summoningStarted && gameState === 'dialogue') {
                    soundGenerator.summoningSound();
                }
            }, 500);

            // Check every 500ms if dialogue has ended
            function waitForDialogueEnd() {
                if (!dialogueSystem.isActive && gameState === 'dialogue') {
                    gameState = 'victory';
                    
                    // Claim reward from backend
                    fetch('/api/reward/claim', { method: 'POST' })
                        .then(response => response.json())
                        .then(claimData => {
                            document.getElementById('closeBtn').style.transform = 'translate(0, 0)';
                        });
                } else if (gameState === 'dialogue') {
                    setTimeout(waitForDialogueEnd, 500);
                }
            }
            
            waitForDialogueEnd();
        })
        .catch(error => console.error('Error fetching conversation:', error));
}

function showVictoryScreen() {
    document.getElementById('victoryScreen').style.display = 'flex';
    
    // Display confession message from the letter
    const confessionMessage = document.getElementById('confessionMessage');
    confessionMessage.innerHTML = `
        <em>My Dearest Carylene,</em><br><br>
        
        Happy Valentine's Day! 💕<br><br>
        
        On this special day, I wanted to tell you something that has been on my heart for so long.
        You mean the world to me, and being able to share this day with you makes me incredibly happy.<br><br>
        
        With all my love,<br>
        Jacques
    `;
}

function update() {
    if (gameState === 'dialogue') {
        dialogueSystem.update();
        giftReward.update();
        updateParticles();
        return;
    }
    
    if (gameState === 'victoryScreen') {
        // Show victory screen once
        if (!window.victoryScreenShown) {
            window.victoryScreenShown = true;
            showVictoryScreen();
        }
        updateParticles();
        return;
    }
    
    if (gameState !== 'playing') {
        updateParticles();
        return;
    }

    frameCount++;
    updatePrincess();
    updateEnemies();
    updateHearts();
    updateClouds();
    updateBlinking();
    updateParticles();
    checkWinCondition();
}

function draw() {
    // Hide score display during dialogue and victory screen
    const scoreDisplay = document.getElementById('score');
    if (gameState === 'dialogue' || gameState === 'victoryScreen') {
        scoreDisplay.style.display = 'none';
    } else {
        scoreDisplay.style.display = 'block';
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 0.7);
    skyGradient.addColorStop(0, '#5c94fc');
    skyGradient.addColorStop(1, '#87CEEB');
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height * 0.7);

    // Brown background with brick texture
    const brownGradient = ctx.createLinearGradient(0, canvas.height * 0.7, 0, canvas.height);
    brownGradient.addColorStop(0, '#d4561f');
    brownGradient.addColorStop(1, '#a84512');
    ctx.fillStyle = brownGradient;
    ctx.fillRect(0, canvas.height * 0.7, canvas.width, canvas.height * 0.3);
    
    // Draw brick pattern on brown background
    const brickWidth = 35;
    const brickHeight = 22;
    const bgStartY = canvas.height * 0.7;
    const bgHeight = canvas.height * 0.3;
    
    ctx.strokeStyle = '#8B4513';
    ctx.lineWidth = 1.5;
    
    // Draw bricks in staggered pattern
    for (let row = 0; row < Math.ceil(bgHeight / brickHeight) + 1; row++) {
        const offset = (row % 2) * (brickWidth / 2);
        for (let col = -1; col < Math.ceil((canvas.width + brickWidth) / brickWidth); col++) {
            const x = col * brickWidth + offset;
            const y = bgStartY + row * brickHeight;
            
            ctx.strokeRect(x, y, brickWidth, brickHeight);
            
            // Add subtle shading to bricks
            if ((row + col) % 2 === 0) {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
                ctx.fillRect(x + 1, y + 1, brickWidth - 2, brickHeight - 2);
            } else {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
                ctx.fillRect(x + 1, y + 1, brickWidth - 2, brickHeight - 2);
            }
        }
    }
    
    // Add mortar (grout) lines highlight
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 0.5;
    for (let row = 0; row < Math.ceil(bgHeight / brickHeight) + 1; row++) {
        const offset = (row % 2) * (brickWidth / 2);
        for (let col = -1; col < Math.ceil((canvas.width + brickWidth) / brickWidth); col++) {
            const x = col * brickWidth + offset;
            const y = bgStartY + row * brickHeight;
            
            ctx.strokeRect(x, y, brickWidth, brickHeight);
        }
    }

    clouds.forEach(cloud => drawCloud(cloud.x, cloud.y, cloud.size));

    platforms.forEach(platform => drawPlatform(platform));
    drawCastle();
    drawFlagPole();
    drawPrince();
    enemies.forEach(enemy => drawEnemy(enemy));
    hearts.forEach(heart => drawHeart(heart));
    drawPrincess();
    drawParticles();

    // Draw focus overlay during dialogue/victory
    if (gameState === 'dialogue' || gameState === 'victoryScreen') {
        ctx.fillStyle = 'rgba(60, 60, 60, 0.85)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    if (gameState === 'dialogue') {
        drawDialogueBox();
        if (giftReward.showing) {
            drawGifts();
        }
    }

    if (gameState === 'victory') {
        ctx.font = '30px Arial';
        ctx.fillText('💕', princess.x + 10, princess.y - 20);
        ctx.fillText('💕', prince.x + 10, prince.y - 20);
    }

    // Adventure mode progress indicator
    if (gameState === 'playing' && gameState !== 'dialogue' && gameState !== 'victoryScreen') {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(10, canvas.height - 30, 200, 20);
        
        const progress = (princess.x / (castle.x - 50)) * 200;
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(10, canvas.height - 30, Math.min(progress, 200), 20);
        
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.strokeRect(10, canvas.height - 30, 200, 20);
        
        ctx.fillStyle = '#fff';
        ctx.font = '10px "Press Start 2P"';
        ctx.fillText('🏰', 215, canvas.height - 16);
    }
}

function drawDialogueBox() {
    const boxY = canvas.height - 150;
    const boxHeight = 140;
    const padding = 20;
    
    // Dialogue box background - darker
    ctx.fillStyle = 'rgba(0, 0, 0, 0.95)';
    ctx.fillRect(10, boxY, canvas.width - 20, boxHeight);
    
    // Dialogue box border
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 3;
    ctx.strokeRect(10, boxY, canvas.width - 20, boxHeight);
    
    // Speaker name - proper alignment
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 16px "Press Start 2P"';
    ctx.textAlign = 'left';
    ctx.fillText(dialogueSystem.getCurrentSpeaker(), padding + 15, boxY + 28);
    
    // Dialogue text - better alignment
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '11px "Press Start 2P"';
    const textStartX = padding + 15;
    const textStartY = boxY + 55;
    const maxWidth = canvas.width - 80;
    const lineHeight = 20;
    
    // Better text wrapping with improved alignment
    const words = dialogueSystem.displayedText.split(' ');
    let line = '';
    let currentY = textStartY;
    
    for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + ' ';
        const metrics = ctx.measureText(testLine);
        
        if (metrics.width > maxWidth && i > 0) {
            ctx.textAlign = 'left';
            ctx.fillText(line.trim(), textStartX, currentY);
            line = words[i] + ' ';
            currentY += lineHeight;
        } else {
            line = testLine;
        }
    }
    ctx.textAlign = 'left';
    ctx.fillText(line.trim(), textStartX, currentY);
    
    // Continue indicator (blinking arrow) - better positioned
    if (dialogueSystem.isTextComplete() && Math.floor(frameCount / 15) % 2 === 0) {
        ctx.fillStyle = '#FFD700';
        ctx.font = '14px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.fillText('▼', canvas.width / 2, canvas.height - 18);
    }
}

function drawGifts() {
    if (!giftReward.showing) return;
    
    ctx.save();
    
    // Draw summoning effect/portal
    if (giftReward.summoningStarted) {
        drawSummoningPortal();
    }
    
    // Draw gifts with animation
    giftReward.gifts.forEach((gift, index) => {
        if (gift.scale > 0) {
            ctx.save();
            
            // Translate to gift position
            ctx.translate(gift.x, gift.y);
            
            // Rotation effect
            ctx.rotate((gift.angle * Math.PI) / 180);
            
            // Scale effect
            ctx.scale(gift.scale, gift.scale);
            
            // Draw emoji (flowers)
            ctx.font = 'bold 60px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            // Add glow effect
            if (gift.scale > 0.5) {
                ctx.globalAlpha = 0.3;
                ctx.fillStyle = '#FFB6C1';
                for (let i = 0; i < 3; i++) {
                    ctx.globalAlpha = 0.1;
                    ctx.fillText(gift.emoji, i * 2, 0);
                }
                ctx.globalAlpha = 1;
            }
            
            ctx.fillStyle = '#FFFFFF';
            ctx.fillText(gift.emoji, 0, 0);
            
            ctx.restore();
            
            // Draw label when fully appeared
            if (gift.scale > 0.8) {
                ctx.fillStyle = '#FFFFFF';
                ctx.font = '12px "Press Start 2P"';
                ctx.textAlign = 'center';
                ctx.fillText(gift.name, gift.x, gift.y + 60);
            }
        }
    });
    
    ctx.restore();
}

function showConfessionLetter() {
    // This will be called when the chest opens
    // The confession message will be displayed in a letter-like format
}

// Flower bouquet animation variables
let bouquetCtx = null;
let bouquetAnimationFrame = 0;
let flowers = [];
let bouquetParticles = [];
let bouquetStartTime = 0;

class BouquetFlower {
    constructor(x, y, color, type) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.type = type; // 'rose', 'tulip', 'daisy'
        this.rotation = Math.random() * Math.PI * 2;
        this.scale = 0;
        this.targetScale = 0.8 + Math.random() * 0.4;
        this.wobbleAmount = Math.random() * 0.05;
        this.wobbleSpeed = Math.random() * 0.05 + 0.02;
        this.baseY = y;
    }

    update(frame) {
        // Grow flowers
        if (this.scale < this.targetScale) {
            this.scale += 0.02;
        }

        // Wobble movement
        this.y = this.baseY + Math.sin(frame * this.wobbleSpeed) * this.wobbleAmount * 20;

        // Gentle rotation
        this.rotation += 0.01 * (Math.random() - 0.5);
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.scale(this.scale, this.scale);

        if (this.type === 'rose') {
            drawRose(ctx, this.color);
        } else if (this.type === 'tulip') {
            drawTulip(ctx, this.color);
        } else if (this.type === 'daisy') {
            drawDaisy(ctx, this.color);
        }

        ctx.restore();
    }
}

function drawRose(ctx, color) {
    // Draw rose petals
    ctx.fillStyle = color;
    for (let i = 0; i < 8; i++) {
        ctx.save();
        ctx.rotate((i / 8) * Math.PI * 2);
        ctx.fillRect(-3, -15, 6, 20);
        ctx.restore();
    }
    // Center
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(0, 0, 4, 0, Math.PI * 2);
    ctx.fill();
}

function drawTulip(ctx, color) {
    // Draw tulip petals
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(-5, 0);
    ctx.quadraticCurveTo(-8, -15, -2, -20);
    ctx.quadraticCurveTo(0, -18, 2, -20);
    ctx.quadraticCurveTo(8, -15, 5, 0);
    ctx.quadraticCurveTo(0, 5, -5, 0);
    ctx.fill();
    // Stem
    ctx.strokeStyle = '#228B22';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(3, 10, 2, 25);
    ctx.stroke();
}

function drawDaisy(ctx, color) {
    // Draw daisy petals
    ctx.fillStyle = color;
    for (let i = 0; i < 6; i++) {
        ctx.save();
        ctx.rotate((i / 6) * Math.PI * 2);
        ctx.beginPath();
        ctx.ellipse(0, -10, 3, 8, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
    // Center
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(0, 0, 3, 0, Math.PI * 2);
    ctx.fill();
}

function randomizeCloseButton() {
    const closeBtn = document.getElementById('closeBtn');
    const randomX = Math.random() * 300 - 150;
    const randomY = Math.random() * 300 - 150;
    closeBtn.style.transform = `translate(${randomX}px, ${randomY}px)`;
}

function randomizeConfirmCloseButton() {
    const confirmCloseBtn = document.getElementById('confirmCloseBtn');
    const randomX = Math.random() * 300 - 150;
    const randomY = Math.random() * 300 - 150;
    confirmCloseBtn.style.transform = `translate(${randomX}px, ${randomY}px)`;
}

function randomizeNoButton() {
    const noBtn = document.getElementById('noBtn');
    if (noBtn) {
        const randomX = Math.random() * 300 - 150;
        const randomY = Math.random() * 300 - 150;
        noBtn.style.transform = `translate(${randomX}px, ${randomY}px)`;
    }
}

function showConfirmDialog() {
    // Fetch confirmation dialog from backend
    fetch('/api/reward/confirm', { method: 'POST' })
        .then(response => response.json())
        .then(data => {
            document.getElementById('confirmDialog').style.display = 'flex';
            // Reset button positions
            document.getElementById('confirmCloseBtn').style.transform = 'translate(0, 0)';
            document.getElementById('noBtn').style.transform = 'translate(0, 0)';
        })
        .catch(error => console.error('Error fetching confirm dialog:', error));
}

function closeConfirmDialog() {
    // Don't close - X button just moves
    randomizeConfirmCloseButton();
}

function openChestSequence() {
    // Notify backend that chest is being opened
    fetch('/api/reward/open', { method: 'POST' })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                // Hide all dialogs
                document.getElementById('confirmDialog').style.display = 'none';
                document.getElementById('gameCanvas').style.display = 'none';
                document.getElementById('flowerBouquetScreen').style.display = 'block';

                // Initialize bouquet animation
                bouquetCtx = document.getElementById('bouquetCanvas').getContext('2d');
                bouquetAnimationFrame = 0;
                flowers = [];
                bouquetParticles = [];
                bouquetStartTime = Date.now();
                gameState = 'flowerBouquet';

                // Create beautiful bouquet
                createFlowerBouquet();
                animateBouquet();

                // After 5 seconds, redirect to confession page
                setTimeout(() => {
                    window.location.href = data.next_page;
                }, 5000);
            }
        })
        .catch(error => console.error('Error opening chest:', error));
}

function createFlowerBouquet() {
    const centerX = 400;
    const centerY = 350;

    // Create main bouquet structure
    const roses = [
        { x: centerX, y: centerY - 50, color: '#FF1493', type: 'rose' },
        { x: centerX - 30, y: centerY - 30, color: '#FF69B4', type: 'rose' },
        { x: centerX + 30, y: centerY - 30, color: '#FF1493', type: 'rose' },
        { x: centerX - 50, y: centerY + 10, color: '#FF69B4', type: 'rose' },
        { x: centerX + 50, y: centerY + 10, color: '#FF1493', type: 'rose' },
    ];

    const tulips = [
        { x: centerX - 20, y: centerY - 60, color: '#FFB6C1', type: 'tulip' },
        { x: centerX + 20, y: centerY - 60, color: '#FFB6C1', type: 'tulip' },
        { x: centerX - 60, y: centerY - 10, color: '#FFB6C1', type: 'tulip' },
        { x: centerX + 60, y: centerY - 10, color: '#FFB6C1', type: 'tulip' },
    ];

    const daisies = [
        { x: centerX - 40, y: centerY - 40, color: '#FFE4E1', type: 'daisy' },
        { x: centerX + 40, y: centerY - 40, color: '#FFE4E1', type: 'daisy' },
        { x: centerX - 70, y: centerY + 20, color: '#FFE4E1', type: 'daisy' },
        { x: centerX + 70, y: centerY + 20, color: '#FFE4E1', type: 'daisy' },
    ];

    flowers = [...roses, ...tulips, ...daisies].map(f => new BouquetFlower(f.x, f.y, f.color, f.type));
}

function animateBouquet() {
    if (!bouquetCtx) return;

    bouquetAnimationFrame++;

    // Clear canvas with gradient
    const gradient = bouquetCtx.createLinearGradient(0, 0, 0, 600);
    gradient.addColorStop(0, '#1a0033');
    gradient.addColorStop(1, '#2d0845');
    bouquetCtx.fillStyle = gradient;
    bouquetCtx.fillRect(0, 0, 800, 600);

    // Draw stars in background
    drawBouquetStars(bouquetCtx, bouquetAnimationFrame);

    // Update and draw flowers
    flowers.forEach((flower, index) => {
        flower.update(bouquetAnimationFrame + index * 5);
        flower.draw(bouquetCtx);
    });

    // Create falling particles
    if (bouquetAnimationFrame % 5 === 0) {
        for (let i = 0; i < 3; i++) {
            const flowerIndex = Math.floor(Math.random() * flowers.length);
            const flower = flowers[flowerIndex];
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 2 + 1;
            bouquetParticles.push({
                x: flower.x,
                y: flower.y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 1,
                color: flower.color,
                life: 100,
                size: Math.random() * 3 + 1
            });
        }
    }

    // Update and draw particles
    bouquetParticles = bouquetParticles.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05; // gravity
        p.life--;

        bouquetCtx.globalAlpha = p.life / 100;
        bouquetCtx.fillStyle = p.color;
        bouquetCtx.beginPath();
        bouquetCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        bouquetCtx.fill();
        bouquetCtx.globalAlpha = 1;

        return p.life > 0;
    });

    // Draw text after flowers are visible
    if (bouquetAnimationFrame > 40) {
        bouquetCtx.fillStyle = '#FFB6C1';
        bouquetCtx.font = 'bold 24px "Press Start 2P"';
        bouquetCtx.textAlign = 'center';
        bouquetCtx.globalAlpha = Math.min((bouquetAnimationFrame - 40) / 30, 1);
        bouquetCtx.fillText('HAPPY VALENTINE\'S DAY', 400, 80);
        bouquetCtx.globalAlpha = 1;
    }

    // Show "Continue" button after animation
    if (bouquetAnimationFrame > 120) {
        bouquetCtx.fillStyle = '#FFD700';
        bouquetCtx.font = '16px "Press Start 2P"';
        bouquetCtx.textAlign = 'center';
        if (Math.floor(bouquetAnimationFrame / 20) % 2 === 0) {
            bouquetCtx.fillText('CLICK TO CONTINUE', 400, 550);
        }
    }

    // Continue animation or handle click
    if (bouquetAnimationFrame < 200) {
        requestAnimationFrame(animateBouquet);
    } else {
        // Setup click handler for continuation
        document.getElementById('bouquetCanvas').onclick = () => {
            document.getElementById('flowerBouquetScreen').style.display = 'none';
            gameState = 'victoryScreen';
            showVictoryScreen();
        };
    }
}

function drawBouquetStars(ctx, frame) {
    ctx.fillStyle = '#FFFFFF';
    for (let i = 0; i < 50; i++) {
        const x = (i * 157 + frame * 0.5) % 800;
        const y = (i * 73 + Math.sin(frame * 0.01 + i) * 10) % 600;
        const size = Math.sin(frame * 0.02 + i) * 0.5 + 0.5;
        ctx.globalAlpha = size * 0.6;
        ctx.fillRect(x, y, 1, 1);
    }
    ctx.globalAlpha = 1;
}

// Draw summoning portal effect
function drawSummoningPortal() {
    const centerX = 400;
    const centerY = 280;
    const portalProgress = Math.min((giftReward.animationFrame - 20) / 30, 1);
    
    // Pixelated portal rings
    for (let ring = 0; ring < 3; ring++) {
        ctx.save();
        
        const radius = 40 + ring * 30;
        const alpha = (1 - portalProgress) * (0.6 - ring * 0.15);
        const rotation = (frameCount * 0.1) + ring * (Math.PI / 1.5);
        
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = ring === 0 ? '#FFB6C1' : '#FFD700';
        ctx.lineWidth = 2;
        
        // Draw pixelated circle using lines instead of arc for retro feel
        ctx.beginPath();
        const pixelSize = 8;
        const segments = Math.ceil((radius * 2 * Math.PI) / pixelSize);
        
        for (let i = 0; i < segments; i++) {
            const angle = (i / segments) * Math.PI * 2 + rotation;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            
            // Draw small squares for pixelated effect
            const pixelX = Math.round(x / pixelSize) * pixelSize;
            const pixelY = Math.round(y / pixelSize) * pixelSize;
            
            if (i === 0) {
                ctx.moveTo(pixelX, pixelY);
            } else {
                ctx.lineTo(pixelX, pixelY);
            }
        }
        ctx.closePath();
        ctx.stroke();
        
        ctx.restore();
    }
    
    // Center summoning burst
    ctx.save();
    ctx.globalAlpha = Math.sin(frameCount * 0.1) * 0.5;
    ctx.fillStyle = '#FFFFFF';
    
    for (let i = 0; i < 4; i++) {
        const angle = (i / 4) * Math.PI * 2;
        const burstX = centerX + Math.cos(angle) * 20 * portalProgress;
        const burstY = centerY + Math.sin(angle) * 20 * portalProgress;
        
        ctx.fillRect(burstX - 3, burstY - 3, 6, 6);
    }
    
    ctx.restore();
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();
