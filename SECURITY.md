# Security Documentation

## 🔒 Security Features

This document outlines the security measures implemented in the Submission Collector MVP.

## Data Protection

### URL Redaction
- **What**: Target URLs are redacted before display to prevent exposure
- **How**: Uses `redact_url()` function to convert URLs to `https://redacted.{tld}/...`
- **Where**: All public-facing endpoints, logs, and admin views
- **Why**: Prevents accidental exposure of sensitive API endpoints

**Example:**
```
Input:  https://secret-api.company.com/v1/chat/private
Output: https://redacted.com/...
```

### URL Hashing
- **What**: Full URLs are hashed using SHA-256
- **How**: `hash_string()` creates one-way hash
- **Stored**: Only hash in database, not plaintext
- **Purpose**: Allows deduplication without storing full URL

### Authorization Header Handling
- **Never Stored**: Plaintext auth headers are NEVER written to database
- **Options**:
  1. Dropped completely (current implementation)
  2. Store only `has_auth` boolean flag
  3. Store SHA-256 hash for verification (optional)
- **Result**: Database only knows IF auth was provided, not the value

### Text Normalization
- **What**: All text inputs normalized using Unicode NFKC
- **Why**: Prevents Unicode-based injection attacks
- **Applied To**: Mission, target name, sensitive items, example prompts

## Input Validation

### Required Fields
```python
{
  "target_url": "Required, must be valid http/https URL",
  "mission": "Required, max 2000 chars, non-empty",
  "consent": "Required, must be true"
}
```

### Optional Fields
```python
{
  "target_name": "Optional, any length",
  "example_prompt": "Optional, any length",
  "known_sensitive": "Optional array, each item max 300 chars",
  "auth_header": "Optional, never stored"
}
```

### Validation Rules

| Field | Type | Min | Max | Validation |
|-------|------|-----|-----|------------|
| target_url | string | 1 | - | Valid http/https URL |
| mission | string | 1 | 2000 | Non-empty, trimmed |
| known_sensitive[n] | string | 0 | 300 | Each item validated |
| consent | boolean | - | - | Must be true |

## Request Security

### CORS (Cross-Origin Resource Sharing)
```python
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:3000"],  # Restrict in production
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "X-Admin-Token"]
    }
})
```

**Production**: Update `origins` to only include your frontend domain.

### Rate Limiting

Current limits:
- **General**: 100 requests per hour per IP
- **Submissions**: 10 per minute per IP
- **Admin endpoints**: 30 per minute per IP

Implemented using Flask-Limiter with in-memory storage.

**Production**: Consider Redis for distributed rate limiting.

### Admin Authentication

Current: Simple token-based auth (dev only)
```bash
X-Admin-Token: dev-token-12345
```

**Production Requirements**:
- Replace with OAuth2 or JWT
- Use secure token generation
- Implement token rotation
- Add role-based access control (RBAC)
- Use HTTPS only

## Audit Logging

### What is Logged
```python
{
  "submission_id": "uuid",
  "action": "create|view|list",
  "ip_address": "x.x.x.x",
  "timestamp": "ISO 8601"
}
```

### What is NOT Logged
- ❌ Authorization headers
- ❌ Full target URLs
- ❌ User agent strings (currently)
- ❌ Request bodies

### Accessing Audit Logs
```python
from database import Database
db = Database()

# Get all audit entries
conn = db.get_connection()
cursor = conn.cursor()
cursor.execute("SELECT * FROM audit_log ORDER BY timestamp DESC")
logs = cursor.fetchall()
```

## Data Retention

### Automatic Purge
```python
# Delete submissions older than 30 days
db.purge_old_submissions(days=30)
```

### Manual Purge
```bash
cd backend
python3 -c "from database import Database; db = Database(); print(f'Deleted {db.purge_old_submissions(30)} records')"
```

### Recommended Schedule
- Daily: Purge submissions > 30 days
- Weekly: Review audit logs
- Monthly: Backup database before purge

## Database Security

### Schema Design
- No plaintext secrets
- Redacted/hashed sensitive fields
- Foreign key constraints
- Indexed for performance

### File Permissions
```bash
# Set restrictive permissions on database
chmod 600 backend/submissions.db

# Ensure backend directory is protected
chmod 755 backend
```

### Backup Strategy
```bash
# Backup database (excludes plaintext secrets that don't exist)
sqlite3 backend/submissions.db ".backup 'backup.db'"

# Automated backup script (recommended)
#!/bin/bash
BACKUP_DIR="./backups"
mkdir -p $BACKUP_DIR
DATE=$(date +%Y%m%d_%H%M%S)
sqlite3 backend/submissions.db ".backup '$BACKUP_DIR/submissions_$DATE.db'"
```

## Known Limitations (MVP)

### Current Limitations
1. ❌ No encryption at rest
2. ❌ No HTTPS enforcement in dev mode
3. ❌ Simple token auth (not production-ready)
4. ❌ In-memory rate limiting (not distributed)
5. ❌ No CSRF protection
6. ❌ No input sanitization for XSS (React provides some protection)
7. ❌ No SQL injection protection beyond parameterized queries
8. ❌ No session management
9. ❌ No MFA (multi-factor authentication)

### Production Upgrades Required

#### Critical (Must Have)
- [ ] HTTPS only (TLS 1.3)
- [ ] Replace token auth with OAuth2/JWT
- [ ] Database encryption at rest
- [ ] Move to PostgreSQL or similar
- [ ] Implement CSRF tokens
- [ ] Add security headers (CSP, HSTS, etc.)
- [ ] Input sanitization for XSS
- [ ] Enable SQL injection protection
- [ ] Add WAF (Web Application Firewall)

#### High Priority
- [ ] Redis for distributed rate limiting
- [ ] Implement MFA for admin access
- [ ] Add session management
- [ ] Implement RBAC (Role-Based Access Control)
- [ ] Add API key management
- [ ] Enable request signing
- [ ] Implement audit log export
- [ ] Add intrusion detection

#### Medium Priority
- [ ] Add file upload validation (if needed)
- [ ] Implement request throttling per user
- [ ] Add webhook validation
- [ ] Enable automated security scanning
- [ ] Add secrets rotation
- [ ] Implement data classification

## Security Headers

### Recommended Headers (Add in Production)
```python
@app.after_request
def add_security_headers(response):
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'DENY'
    response.headers['X-XSS-Protection'] = '1; mode=block'
    response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
    response.headers['Content-Security-Policy'] = "default-src 'self'"
    return response
```

## Incident Response

### If Credentials are Exposed
1. Immediately rotate `ADMIN_TOKEN`
2. Review audit logs for unauthorized access
3. Purge affected submissions
4. Notify affected parties
5. Update security documentation

### If Database is Compromised
1. Take system offline
2. Restore from clean backup
3. Review all audit logs
4. Rotate all credentials
5. Implement additional monitoring
6. File security incident report

### Contact
For security issues:
- 🚨 Do NOT file public issues
- 📧 Contact security team directly
- 🔒 Use encrypted communication

## Security Checklist

Before deployment:
- [ ] All secrets in environment variables (not code)
- [ ] HTTPS enforced
- [ ] CORS restricted to production domain
- [ ] Rate limiting configured
- [ ] Admin auth replaced with OAuth2/JWT
- [ ] Database encrypted at rest
- [ ] Database backups automated
- [ ] Audit logging enabled
- [ ] Security headers added
- [ ] Input validation comprehensive
- [ ] Error messages don't leak info
- [ ] Dependencies updated and scanned
- [ ] Penetration testing completed
- [ ] Security documentation reviewed
- [ ] Incident response plan documented

## Compliance

### GDPR Considerations
- ✅ Users provide explicit consent
- ✅ Data retention policy defined (30 days)
- ✅ Audit trail maintained
- ⚠️ No right to erasure implemented (add if needed)
- ⚠️ No data export implemented (add if needed)

### CCPA Considerations
- Similar to GDPR
- May need "Do Not Sell" disclosure

### Industry Standards
- OWASP Top 10 mitigations
- CIS Controls alignment
- NIST Cybersecurity Framework

---

**Remember**: This is an MVP. Production deployment requires significant security enhancements. Consult with security professionals before deploying.

