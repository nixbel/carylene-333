// UPDATED script.js - Victory Functions with Backend Integration

// REPLACE: startVictoryConversation() function
// This version uses Flask backend API calls

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
                            document.getElementById('chestPrompt').style.display = 'flex';
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

// REPLACE: showConfirmDialog() function
function showConfirmDialog() {
    document.getElementById('chestPrompt').style.display = 'none';
    
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

// REPLACE: openChestSequence() function
function openChestSequence() {
    // Notify backend that chest is being opened
    fetch('/api/reward/open', { method: 'POST' })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                // Hide all dialogs
                document.getElementById('confirmDialog').style.display = 'none';
                document.getElementById('chestPrompt').style.display = 'none';
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

// KEEP: These functions unchanged
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

function closeChestPrompt() {
    // Don't close - X button just moves
    randomizeCloseButton();
}

function closeConfirmDialog() {
    // Don't close - X button just moves
    randomizeConfirmCloseButton();
}
