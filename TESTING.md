# Testing Guide for Submission Collector MVP

This guide helps you verify that all acceptance criteria are met.

## ✅ Acceptance Criteria Checklist

### 1. User can fill and submit the form successfully

**Steps:**
1. Navigate to http://localhost:3000
2. Fill in the form:
   - Target Name: "Test Math Tutor"
   - Target URL: "https://example.com/api/chat"
   - Mission: "Helps students learn math without giving direct answers"
   - Add sensitive items: "final numeric answer", "step-by-step solution"
   - Example Prompt: "What is 5 + 3?"
   - Auth Header: "Bearer test-token-123"
   - Check consent checkbox
3. Click "Submit Mission"

**Expected Result:**
- ✅ Form validates successfully
- ✅ No error messages
- ✅ Redirects to confirmation page

### 2. Valid submissions create a DB record with submission_id

**Steps:**
1. After submitting form, note the submission_id on confirmation page
2. Check the database:
```bash
cd backend
sqlite3 submissions.db "SELECT id, target_name, mission FROM submissions;"
```

**Expected Result:**
- ✅ Submission_id is displayed on confirmation page
- ✅ Record exists in database with matching UUID
- ✅ All fields are populated

### 3. Consent enforced; invalid submissions rejected

**Test Case A: No Consent**
1. Fill out form but don't check consent checkbox
2. Click Submit

**Expected Result:**
- ✅ Error message: "You must confirm consent to proceed"
- ✅ Form does not submit

**Test Case B: Invalid URL**
1. Fill out form with URL: "not-a-valid-url"
2. Check consent
3. Click Submit

**Expected Result:**
- ✅ Error message: "Please enter a valid URL"
- ✅ Form does not submit

**Test Case C: Empty Mission**
1. Fill out form but leave mission empty
2. Check consent
3. Click Submit

**Expected Result:**
- ✅ Error message: "Mission/Purpose is required"
- ✅ Form does not submit

**Test Case D: Mission Too Long**
1. Fill mission with > 2000 characters
2. Check consent
3. Click Submit

**Expected Result:**
- ✅ Error message: "Mission must be 2000 characters or less"
- ✅ Form does not submit

### 4. GET /api/submissions shows redacted summaries only

**Steps:**
1. Submit 2-3 test submissions via the form
2. Navigate to http://localhost:3000/submissions
3. Or test via curl:
```bash
curl http://localhost:5000/api/submissions \
  -H "X-Admin-Token: dev-token-12345"
```

**Expected Result:**
- ✅ List shows all submissions
- ✅ URLs are redacted (e.g., "https://redacted.com/...")
- ✅ Mission excerpts limited to ~100 chars
- ✅ Shows sensitive item count
- ✅ Shows creation timestamp
- ✅ Full URLs never displayed

### 5. No plaintext secrets in logs or DB

**Steps:**
1. Submit a form with auth header: "Bearer secret-token-123"
2. Check database:
```bash
cd backend
sqlite3 submissions.db "SELECT id, target_url_redacted, has_auth, known_sensitive_json FROM submissions;"
```
3. Check Flask logs in terminal

**Expected Result:**
- ✅ Database shows `has_auth = 1` but no plaintext auth header
- ✅ `target_url_redacted` shows redacted URL, not full URL
- ✅ Logs don't contain auth tokens
- ✅ Logs don't contain full target URLs

### 6. Logs include timestamp + submission_id

**Steps:**
1. Submit a form
2. Check audit_log table:
```bash
cd backend
sqlite3 submissions.db "SELECT * FROM audit_log;"
```

**Expected Result:**
- ✅ Each submission has audit_log entry
- ✅ Contains submission_id
- ✅ Contains timestamp
- ✅ Contains IP address
- ✅ Contains action ('create')

## 🧪 Additional Test Cases

### Security Tests

**Test: Admin Token Required**
```bash
# Try to access without token
curl http://localhost:5000/api/submissions

# Expected: 401 Unauthorized
```

**Test: Rate Limiting**
```bash
# Submit 15 requests rapidly
for i in {1..15}; do
  curl -X POST http://localhost:5000/api/submissions \
    -H "Content-Type: application/json" \
    -d '{"target_url": "https://test.com", "mission": "test", "consent": true}'
done

# Expected: After 10 requests, should get rate limit error
```

**Test: URL Redaction**
1. Submit with URL: "https://secret-api.mycompany.com/v1/chat/private"
2. View in submissions list
3. Expected: Shows "https://redacted.com/..."

**Test: Sensitive Item Validation**
1. Try to add sensitive item with > 300 characters
2. Expected: Button disabled, won't add to list

### UI/UX Tests

**Test: Inline Validation**
1. Start typing invalid URL
2. Tab out of field
3. Expected: Error message appears immediately

**Test: Character Counter**
1. Type in mission field
2. Expected: Character count updates in real-time
3. Try to exceed 2000 chars
4. Expected: Warning appears

**Test: Sensitive Items Management**
1. Add 3 sensitive items
2. Click remove on middle item
3. Expected: Item removed, others remain
4. Press Enter in input field
5. Expected: Adds item (same as clicking + Add)

**Test: Responsive Design**
1. Resize browser to mobile width (< 768px)
2. Expected: Form adapts, remains usable
3. All buttons accessible

**Test: Navigation**
1. Submit form → goes to confirmation
2. Click "Submit Another" → goes to form
3. Click "View All Submissions" → goes to list
4. Click browser back → goes to previous page

### Data Validation Tests

**Test: Unicode Normalization**
```bash
curl -X POST http://localhost:5000/api/submissions \
  -H "Content-Type: application/json" \
  -d '{
    "target_url": "https://test.com",
    "mission": "Test with special chars: é café",
    "known_sensitive": ["naïve", "résumé"],
    "consent": true
  }'

# Expected: 201 Created, text normalized properly
```

**Test: XSS Prevention**
```bash
curl -X POST http://localhost:5000/api/submissions \
  -H "Content-Type: application/json" \
  -d '{
    "target_url": "https://test.com",
    "mission": "<script>alert('xss')</script>",
    "consent": true
  }'

# Expected: Stored safely, not executed
```

**Test: Empty Arrays**
```bash
curl -X POST http://localhost:5000/api/submissions \
  -H "Content-Type: application/json" \
  -d '{
    "target_url": "https://test.com",
    "mission": "Test",
    "known_sensitive": [],
    "consent": true
  }'

# Expected: 201 Created, empty array stored as []
```

## 📊 Test Results Template

Use this template to track your testing:

```
| Test Case | Status | Notes |
|-----------|--------|-------|
| Form submission works | ⬜ | |
| Submission creates DB record | ⬜ | |
| Consent enforced | ⬜ | |
| Invalid URL rejected | ⬜ | |
| Empty mission rejected | ⬜ | |
| Mission length validated | ⬜ | |
| Submissions list shows redacted data | ⬜ | |
| No plaintext auth in DB | ⬜ | |
| URLs redacted | ⬜ | |
| Audit log has timestamps | ⬜ | |
| Audit log has submission_id | ⬜ | |
| Admin token required | ⬜ | |
| Rate limiting works | ⬜ | |
| Inline validation works | ⬜ | |
| Character counter works | ⬜ | |
| Sensitive items add/remove | ⬜ | |
| Responsive design | ⬜ | |
| Navigation works | ⬜ | |
```

## 🔍 Debugging Tips

### Backend Issues
```bash
# Enable debug mode
cd backend
FLASK_ENV=development python app.py

# Check database contents
sqlite3 submissions.db ".schema"
sqlite3 submissions.db "SELECT * FROM submissions;"
```

### Frontend Issues
```bash
# Check browser console (F12)
# Look for network errors
# Verify API calls going to http://localhost:5000

# Check React errors
cd frontend
npm run dev
```

### Database Issues
```bash
# Reset database
cd backend
rm submissions.db
python app.py  # Will recreate tables
```

## ✅ Final Verification

Before considering the MVP complete, verify:

- [ ] All 6 acceptance criteria pass
- [ ] No console errors in browser
- [ ] No Flask errors in terminal
- [ ] Database schema is correct
- [ ] URLs are always redacted
- [ ] Auth headers never appear
- [ ] Consent is enforced
- [ ] Rate limiting works
- [ ] CORS configured correctly
- [ ] README is accurate and complete

---

**All tests passing? Congratulations! 🎉 Your MVP is ready.**

