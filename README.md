# GPT Wrapper Submission Collector - MVP 1

A secure web application for collecting and storing information about GPT wrapper targets for authorized security testing.

## ⚠️ Legal Warning

**IMPORTANT:** This tool is for authorized security testing ONLY. You must:
- Own the target system, OR
- Have explicit written permission from the target owner

Unauthorized security testing may violate:
- Computer Fraud and Abuse Act (CFAA) in the United States
- Computer Misuse Act in the United Kingdom
- Similar laws in other jurisdictions

**Unauthorized access to computer systems is illegal and may result in criminal prosecution.**

## 🎯 What This MVP Does

This is a **submission collector only** - it does NOT perform any testing or injection:

- ✅ Collects target information (URL, mission, known sensitivities)
- ✅ Validates and sanitizes all inputs
- ✅ Redacts/hashes sensitive data (URLs, auth headers)
- ✅ Stores submissions securely in SQLite
- ✅ Provides admin interface to view submissions
- ❌ Does NOT perform any testing or attacks
- ❌ Does NOT store plaintext credentials

## 🏗️ Architecture

### Backend (Flask)
- REST API with input validation
- SQLite database with audit logging
- Security features: URL redaction, credential hashing, CORS, rate limiting

### Frontend (React + Vite)
- Single-page form with inline validation
- Confirmation page after submission
- Admin view for all submissions

### Database (SQLite)
- `submissions` table with redacted data
- `audit_log` table for tracking activity

## 📋 Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn

## 🚀 Setup Instructions

### 1. Clone and Navigate

```bash
cd /Users/ajay/Desktop/CSProjects/hackathon
```

### 2. Backend Setup

```bash
# Install Python dependencies
pip install -r requirements.txt

# Navigate to backend directory
cd backend

# Database will be created automatically on first run
# Run the Flask server
python app.py
```

The backend will start on `http://localhost:5000`

### 3. Frontend Setup

Open a new terminal:

```bash
# Navigate to frontend directory
cd /Users/ajay/Desktop/CSProjects/hackathon/frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will start on `http://localhost:3000`

### 4. Access the Application

Open your browser and navigate to:
- **Main Form**: http://localhost:3000
- **View Submissions** (Admin): http://localhost:3000/submissions

## 🔑 Admin Access

For development, the admin token is: `dev-token-12345`

The frontend automatically includes this token when viewing submissions.

**In production**: Replace with proper authentication system.

## 📡 API Endpoints

### `POST /api/submissions`
Create a new submission.

**Request Body:**
```json
{
  "target_name": "Optional name",
  "target_url": "https://example.com/api/chat",
  "mission": "Describe the target's purpose...",
  "known_sensitive": ["item1", "item2"],
  "example_prompt": "Optional example",
  "auth_header": "Bearer token (never stored)",
  "consent": true
}
```

**Response:**
```json
{
  "submission_id": "uuid-1234",
  "status": "saved",
  "summary": {
    "target_name": "Name",
    "mission_excerpt": "First 100 chars...",
    "sensitive_count": 2
  }
}
```

### `GET /api/submissions`
List all submissions (admin only).

**Headers:**
```
X-Admin-Token: dev-token-12345
```

### `GET /api/submissions/<id>`
Get a specific submission (admin only).

### `GET /api/health`
Health check endpoint.

## 🔒 Security Features

### Data Protection
- ✅ Target URLs redacted to hide specific paths
- ✅ Authorization headers hashed (SHA-256), never stored plaintext
- ✅ Consent required and validated
- ✅ Text normalized using NFKC Unicode normalization
- ✅ Input length limits enforced

### Request Security
- ✅ CORS restricted to frontend origin
- ✅ Rate limiting (10 submissions/min, 100 requests/hour)
- ✅ Input validation and sanitization
- ✅ Admin endpoints protected by token

### Audit Trail
- ✅ All submissions logged with timestamp and IP
- ✅ Audit log stored in database
- ✅ Automatic purge after 30 days (configurable)

## 📊 Database Schema

### submissions table
```sql
id TEXT PRIMARY KEY
target_name TEXT
target_url_redacted TEXT
target_url_hash TEXT
mission TEXT
example_prompt TEXT
known_sensitive_json TEXT
has_auth BOOLEAN
consent BOOLEAN
created_at TEXT
```

### audit_log table
```sql
id INTEGER PRIMARY KEY
submission_id TEXT
action TEXT
ip_address TEXT
timestamp TEXT
```

## 🧪 Testing the Application

### Manual Testing Workflow

1. **Submit a form**:
   - Fill out all required fields
   - Check the consent box
   - Click "Submit Mission"

2. **Verify confirmation**:
   - Should show submission ID
   - Should display summary
   - Should show sensitive item count

3. **View submissions** (admin):
   - Click "View All Submissions"
   - Verify URLs are redacted
   - Click on a submission to expand details

4. **Verify security**:
   - Check that auth headers are never displayed
   - Verify URLs show as "https://redacted.example/..."
   - Confirm sensitive data is stored but redacted in list view

### Testing API Directly

```bash
# Health check
curl http://localhost:5000/api/health

# Create submission
curl -X POST http://localhost:5000/api/submissions \
  -H "Content-Type: application/json" \
  -d '{
    "target_url": "https://example.com/api",
    "mission": "Test mission for math tutor",
    "known_sensitive": ["final answer"],
    "consent": true
  }'

# List submissions (admin)
curl http://localhost:5000/api/submissions \
  -H "X-Admin-Token: dev-token-12345"
```

## 🗑️ Data Cleanup

To purge old submissions (older than 30 days):

```python
from database import Database
db = Database()
deleted = db.purge_old_submissions(days=30)
print(f"Deleted {deleted} submissions")
```

## 🎨 UI Features

### Main Form
- Real-time validation with error messages
- Character counters for text fields
- Dynamic list management for sensitive items
- Warning banners about legal/ethical use
- Secure handling of auth header (password field)

### Confirmation Page
- Success indicator
- Submission summary
- Security information
- Links to view submissions or submit another

### View Submissions (Admin)
- List of all submissions with redacted URLs
- Click to expand and view full details
- Security metadata (URL hash, auth status)
- Formatted dates and excerpts

## 📝 Form Validation Rules

| Field | Required | Max Length | Validation |
|-------|----------|------------|------------|
| Target Name | No | - | - |
| Target URL | Yes | - | Valid http/https URL |
| Mission | Yes | 2000 chars | Non-empty |
| Known Sensitive Items | No | 300 chars each | - |
| Example Prompt | No | - | - |
| Auth Header | No | - | Never stored plaintext |
| Consent | Yes | - | Must be checked |

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the `backend/` directory:

```env
ADMIN_TOKEN=your-secure-token-here
FLASK_ENV=development
```

### Rate Limiting

Modify in `backend/app.py`:
```python
limiter = Limiter(
    app=app,
    default_limits=["100 per hour"],
    # Adjust as needed
)
```

### CORS Origins

Update in `backend/app.py`:
```python
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:3000", "https://your-frontend.com"],
        # Add your production URLs
    }
})
```

## 🚨 Production Deployment Checklist

Before deploying to production:

- [ ] Replace `ADMIN_TOKEN` with strong secret
- [ ] Implement proper authentication (OAuth, JWT, etc.)
- [ ] Use HTTPS only (no HTTP)
- [ ] Update CORS to restrict to production domain
- [ ] Set up proper database backups
- [ ] Configure production-grade database (PostgreSQL)
- [ ] Enable logging to external service
- [ ] Set up monitoring and alerts
- [ ] Review and adjust rate limits
- [ ] Add CSRF protection
- [ ] Implement session management
- [ ] Set up automated data purging
- [ ] Add input sanitization for XSS
- [ ] Configure firewall rules
- [ ] Review security headers

## 📦 Project Structure

```
hackathon/
├── backend/
│   ├── app.py              # Flask application & API endpoints
│   ├── database.py         # Database models & operations
│   └── submissions.db      # SQLite database (auto-created)
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── SubmissionForm.jsx
│   │   │   ├── SubmissionForm.css
│   │   │   ├── ConfirmationPage.jsx
│   │   │   ├── ConfirmationPage.css
│   │   │   ├── ViewSubmissions.jsx
│   │   │   └── ViewSubmissions.css
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── requirements.txt        # Python dependencies
└── README.md              # This file
```

## 🤝 Contributing

This is an MVP for educational purposes. Future versions may include:
- Actual testing/injection logic
- More sophisticated authentication
- Export functionality
- Advanced filtering and search
- API key management
- Webhook notifications

## 📄 License

This project is for educational and authorized security testing purposes only.

## 💡 Support

For issues or questions:
1. Check the troubleshooting section
2. Review the API documentation
3. Check browser console for frontend errors
4. Check Flask logs for backend errors

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check Python version
python --version  # Should be 3.8+

# Reinstall dependencies
pip install --upgrade -r requirements.txt
```

### Frontend won't start
```bash
# Check Node version
node --version  # Should be 16+

# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### CORS errors
- Verify backend is running on port 5000
- Check CORS configuration in `backend/app.py`
- Ensure frontend is on port 3000

### Database errors
- Delete `backend/submissions.db` and restart backend
- Database will be recreated automatically

---

**Remember: Only test systems you own or have explicit permission to test.**

