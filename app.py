from flask import Flask, render_template, jsonify, request
import secrets

app = Flask(__name__, template_folder='.', static_folder='.', static_url_path='')
app.secret_key = secrets.token_hex(16)

# Add CORS headers manually for proper API communication
@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS, PUT, DELETE'
    return response

# Handle preflight OPTIONS requests
@app.before_request
def handle_preflight():
    if request.method == 'OPTIONS':
        return '', 200

# ==================== MAIN ROUTE ====================

@app.route('/')
def index():
    """Serve the main game page"""
    return render_template('index.html')

# ==================== CONVERSATION API ====================

@app.route('/api/conversation/start', methods=['POST'])
def start_conversation():
    """
    Start the victory conversation - return dialogue lines
    This triggers after the player reaches the castle and the flag is raised
    """
    conversation_data = {
        'status': 'success',
        'dialogues': [
            {
                'speaker': 'PRINCE ???:',
                'text': 'You did it! You saved me!'
            },
            {
                'speaker': 'PRINCE ???:',
                'text': 'I knew you had it in you...'
            },
            {
                'speaker': 'PRINCE ???:',
                'text': 'I have a gift for you.'
            },
            {
                'speaker': 'JACQUES:',
                'text': 'Please accept these tokens of my affection.'
            }
        ]
    }
    return jsonify(conversation_data)

@app.route('/api/conversation/next', methods=['POST'])
def next_dialogue():
    """Get next dialogue line - legacy endpoint"""
    return jsonify({'status': 'next'})

# ==================== CHEST/REWARD API ====================

@app.route('/api/reward/claim', methods=['POST'])
def claim_reward():
    """
    Return reward claim dialog data
    Called when dialogue ends to show the chest prompt
    """
    reward_data = {
        'status': 'success',
        'title': 'CLAIM YOUR REWARD',
        'message': 'YOU RECEIVE A CHEST',
        'action': 'OPEN NOW'
    }
    return jsonify(reward_data)

@app.route('/api/reward/confirm', methods=['POST'])
def confirm_reward():
    """
    Return confirmation dialog data
    Shows the "OPEN THE CHEST?" dialog
    """
    confirm_data = {
        'status': 'success',
        'title': 'OPEN THE CHEST?',
        'message': 'Claim your special gift inside...',
        'yes_button': 'YES, OPEN IT!',
        'no_button': 'NOT YET'
    }
    return jsonify(confirm_data)

@app.route('/api/reward/open', methods=['POST'])
def open_reward():
    """
    Process chest opening
    Triggered when user clicks "YES, OPEN IT!"
    Returns redirect information for post-chest page
    
    This is where the chest animation plays, followed by flowers,
    then the victory screen with the confession message
    """
    return jsonify({
        'status': 'success',
        'next_page': '/confession',
        'animations': {
            'chest_duration': 240,  # frames (4 seconds at 60 FPS)
            'flower_duration': 200,  # frames minimum
            'transition_delay': 240  # when to show flowers
        }
    })

# ==================== CONFESSION PAGE ====================

@app.route('/confession')
def confession():
    """
    Render the final confession page with love message
    This appears after the flower bouquet animation
    """
    confession_message = """
    <em>My Dearest Carylene,</em><br><br>
    
    Happy Valentine's Day! 💕<br><br>
    
    On this special day, I wanted to tell you something that has been on my heart for so long.
    You mean the world to me, and being able to share this day with you makes me incredibly happy.<br><br>
    
    With all my love,<br>
    Jacques
    """
    return render_template('confession.html', message=confession_message)

# ==================== GAME STATE ENDPOINTS ====================

@app.route('/api/game/status', methods=['GET'])
def game_status():
    """Get current game status - useful for debugging"""
    return jsonify({
        'status': 'running',
        'server': 'Flask',
        'endpoints': [
            '/api/conversation/start',
            '/api/reward/claim',
            '/api/reward/confirm',
            '/api/reward/open',
            '/confession'
        ]
    })

@app.route('/api/game/reset', methods=['POST'])
def game_reset():
    """Reset game state - called when player clicks restart"""
    return jsonify({
        'status': 'reset',
        'message': 'Game reset successfully'
    })

# ==================== ERROR HANDLERS ====================

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Page not found', 'code': 404}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error', 'code': 500}), 500

@app.errorhandler(405)
def method_not_allowed(error):
    return jsonify({'error': 'Method not allowed', 'code': 405}), 405

# ==================== HEALTH CHECK ====================

@app.route('/health')
def health_check():
    """Quick health check endpoint"""
    return jsonify({'status': 'ok', 'server': 'Flask'})

# ==================== MAIN ====================

if __name__ == '__main__':
    print("\n" + "="*70)
    print(" 🎮 CARYLENE'S VALENTINE'S DAY GAME - CHEST EDITION 🎮")
    print("="*70)
    print("\n✨ New Features:")
    print("   • Beautiful chest opening animation")
    print("   • Magical flower bouquet display")
    print("   • Smooth transitions and effects")
    print("   • Interactive confirmation dialogs")
    print("\n📝 API Endpoints:")
    print("   POST /api/conversation/start   - Start victory dialogue")
    print("   POST /api/reward/claim         - Claim reward")
    print("   POST /api/reward/confirm       - Confirm chest opening")
    print("   POST /api/reward/open          - Open chest + show flowers")
    print("   GET  /confession               - Show final message")
    print("   GET  /api/game/status          - Check server status")
    print("   POST /api/game/reset           - Reset game")
    print("\n🌐 Server Information:")
    print("   URL: http://127.0.0.1:5000")
    print("   Browser: Open http://127.0.0.1:5000 to play")
    print("   Debug: " + ("ENABLED" if True else "DISABLED"))
    print("\n⚠️  IMPORTANT: Do NOT close this terminal window!")
    print("="*70 + "\n")
    
    # Run Flask app in debug mode for development
    app.run(debug=True, host='127.0.0.1', port=5000, use_reloader=True)