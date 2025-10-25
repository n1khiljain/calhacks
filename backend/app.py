import os
import uuid
import hashlib
import json
import unicodedata
from datetime import datetime
from urllib.parse import urlparse
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import validators
from database import Database

app = Flask(__name__)

# CORS configuration - restrict to frontend origin in production
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:3000", "http://localhost:5173"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "X-Admin-Token"]
    }
})

# Rate limiting
limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    default_limits=["100 per hour"],
    storage_uri="memory://"
)

# Admin token for dev (in production, use proper auth)
ADMIN_TOKEN = os.getenv("ADMIN_TOKEN", "dev-token-12345")

# Initialize database
db = Database()

def normalize_text(text):
    """Normalize text using NFKC Unicode normalization."""
    if text:
        return unicodedata.normalize('NFKC', text.strip())
    return text

def redact_url(url):
    """Redact URL to hide sensitive parts."""
    try:
        parsed = urlparse(url)
        return f"{parsed.scheme}://redacted.{parsed.netloc.split('.')[-1]}/..."
    except:
        return "https://redacted.example/..."

def hash_string(text):
    """Create SHA-256 hash of a string."""
    if not text:
        return None
    return hashlib.sha256(text.encode('utf-8')).hexdigest()

def is_admin(request):
    """Check if request has valid admin token."""
    token = request.headers.get('X-Admin-Token', '')
    return token == ADMIN_TOKEN

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat() + "Z"
    }), 200

@app.route('/api/submissions', methods=['POST'])
@limiter.limit("10 per minute")
def create_submission():
    """Create a new submission."""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "Invalid JSON"}), 400
        
        # Validate consent (required)
        if not data.get('consent', False):
            return jsonify({"error": "Consent is required"}), 400
        
        # Validate target_url (required)
        target_url = data.get('target_url', '').strip()
        if not target_url:
            return jsonify({"error": "Target URL is required"}), 400
        
        if not validators.url(target_url):
            return jsonify({"error": "Target URL must be a valid http/https URL"}), 400
        
        parsed_url = urlparse(target_url)
        if parsed_url.scheme not in ['http', 'https']:
            return jsonify({"error": "Target URL must use http or https"}), 400
        
        # Validate mission (required, max 2000 chars)
        mission = normalize_text(data.get('mission', ''))
        if not mission:
            return jsonify({"error": "Mission/Purpose is required"}), 400
        
        if len(mission) > 2000:
            return jsonify({"error": "Mission must be 2000 characters or less"}), 400
        
        # Validate known_sensitive (optional, but each item max 300 chars)
        known_sensitive = data.get('known_sensitive', [])
        if not isinstance(known_sensitive, list):
            return jsonify({"error": "Known sensitive must be an array"}), 400
        
        validated_sensitive = []
        for item in known_sensitive:
            if not isinstance(item, str):
                continue
            normalized_item = normalize_text(item)
            if normalized_item and len(normalized_item) <= 300:
                validated_sensitive.append(normalized_item)
        
        # Optional fields with normalization
        target_name = normalize_text(data.get('target_name', ''))
        example_prompt = normalize_text(data.get('example_prompt', ''))
        
        # Handle auth header (never store plaintext)
        auth_header = data.get('auth_header', '').strip()
        has_auth = bool(auth_header)
        auth_hash = hash_string(auth_header) if auth_header else None
        
        # Create submission record
        submission_id = str(uuid.uuid4())
        target_url_redacted = redact_url(target_url)
        target_url_hash = hash_string(target_url)
        
        submission_data = {
            'id': submission_id,
            'target_name': target_name,
            'target_url_redacted': target_url_redacted,
            'target_url_hash': target_url_hash,
            'mission': mission,
            'example_prompt': example_prompt,
            'known_sensitive_json': json.dumps(validated_sensitive),
            'has_auth': has_auth,
            'consent': True,
            'created_at': datetime.utcnow().isoformat() + "Z"
        }
        
        # Store in database
        db.create_submission(submission_data)
        
        # Log to audit trail
        db.log_audit({
            'submission_id': submission_id,
            'action': 'create',
            'ip_address': get_remote_address(),
            'timestamp': submission_data['created_at']
        })
        
        return jsonify({
            "submission_id": submission_id,
            "status": "saved",
            "summary": {
                "target_name": target_name or "Unnamed",
                "mission_excerpt": mission[:100] + "..." if len(mission) > 100 else mission,
                "sensitive_count": len(validated_sensitive)
            }
        }), 201
        
    except Exception as e:
        app.logger.error(f"Error creating submission: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

@app.route('/api/submissions', methods=['GET'])
@limiter.limit("30 per minute")
def list_submissions():
    """List all submissions (admin only, redacted)."""
    if not is_admin(request):
        return jsonify({"error": "Unauthorized"}), 401
    
    try:
        submissions = db.get_all_submissions()
        
        result = []
        for sub in submissions:
            known_sensitive = json.loads(sub['known_sensitive_json'])
            
            result.append({
                "submission_id": sub['id'],
                "target_name": sub['target_name'] or "Unnamed",
                "target_url_redacted": sub['target_url_redacted'],
                "mission_excerpt": sub['mission'][:100] + "..." if len(sub['mission']) > 100 else sub['mission'],
                "sensitive_count": len(known_sensitive),
                "created_at": sub['created_at']
            })
        
        return jsonify(result), 200
        
    except Exception as e:
        app.logger.error(f"Error listing submissions: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

@app.route('/api/submissions/<submission_id>', methods=['GET'])
@limiter.limit("30 per minute")
def get_submission(submission_id):
    """Get a specific submission (authorized only)."""
    if not is_admin(request):
        return jsonify({"error": "Unauthorized"}), 401
    
    try:
        submission = db.get_submission(submission_id)
        
        if not submission:
            return jsonify({"error": "Submission not found"}), 404
        
        known_sensitive = json.loads(submission['known_sensitive_json'])
        
        result = {
            "submission_id": submission['id'],
            "target_name": submission['target_name'] or "Unnamed",
            "target_url_redacted": submission['target_url_redacted'],
            "target_url_hash": submission['target_url_hash'],
            "mission": submission['mission'],
            "example_prompt": submission['example_prompt'],
            "known_sensitive": known_sensitive,
            "has_auth": submission['has_auth'],
            "consent": submission['consent'],
            "created_at": submission['created_at']
        }
        
        return jsonify(result), 200
        
    except Exception as e:
        app.logger.error(f"Error getting submission: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)

