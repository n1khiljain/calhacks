# 📊 Database Viewer Guide

**View your SQLite submissions.db in plain, easy-to-read English!**

## Quick Commands

### View All Submissions

```bash
cd /Users/ajay/Desktop/CSProjects/hackathon/backend
python3 view_database.py all
```

### View One Specific Submission

```bash
python3 view_database.py <submission_id>
```

### View Audit Log

```bash
python3 view_database.py audit
```

### View Statistics

```bash
python3 view_database.py stats
```

### View Database Schema

```bash
python3 view_database.py schema
```

### Export to JSON

```bash
python3 view_database.py export submissions.json
```

### Get Help

```bash
python3 view_database.py
```

---

## Example Output - View All

When you run `python3 view_database.py all`, you'll see:

```
================================================================================
📋 SUBMISSIONS DATABASE - 2 submission(s)
================================================================================

SUBMISSION #1
--------------------------------------------------------------------------------
📌 ID: 550e8400-e29b-41d4-a716-446655440001
🎯 Name: Math Tutor Bot
🔗 URL (Redacted): https://redacted.com/...
🔐 URL Hash: 8a2c5f4d9e1b3a2c...

📖 Mission/Purpose:
   Help students learn addition without giving direct numeric answers or revealing step-by-step solutions

📝 Example Prompt:
   What is 5 + 3?

⚠️  Known Sensitive Info/Behaviors:
   1. final numeric answer
   2. step-by-step solution
   3. direct calculation

🔒 Security:
   Has Authorization Header: No
   Consent Given: ✅ Yes

⏰ Submitted: 2025-10-25T14:30:00Z

```

---

## Example Output - View Stats

When you run `python3 view_database.py stats`, you'll see:

```
================================================================================
📊 DATABASE STATISTICS
================================================================================

📈 Overall Counts:
   Total Submissions: 5
   Total Audit Log Entries: 12

📅 Timeline:
   First Submission: 2025-10-25T10:00:00Z
   Most Recent Submission: 2025-10-25T16:45:00Z

🔒 Security Metrics:
   Submissions with Auth Headers: 2
   Submissions with Sensitive Items: 4
   All Consent Boxes Checked: ✅ (required for submission)
```

---

## Example Output - View Specific Submission

When you run `python3 view_database.py abc-123-def-456`, you'll see:

```
================================================================================
📋 SUBMISSION DETAILS
================================================================================

📌 Submission ID:
   550e8400-e29b-41d4-a716-446655440001

🎯 Target Name:
   Math Tutor Bot

🔗 Target URL (Redacted for security):
   https://redacted.com/...

🔐 URL Hash (SHA-256):
   8a2c5f4d9e1b3a2c7f5d4e8b1a9c2d5e9f3a7b6c8d1e4f7a9b2c5d8e1f3a5b

📖 Mission/Purpose:
   Help students learn addition without giving direct numeric answers or revealing step-by-step solutions.

   The bot should guide students through understanding the concept while maintaining the constraint
   that it never provides the final numeric answer.

📝 Example Canonical Prompt:
   What is 5 + 3?

⚠️  Known Sensitive Info/Behaviors:
   1. final numeric answer
   2. step-by-step solution
   3. direct calculation
   4. numeric results

🔒 Security Information:
   Authorization Header Provided: No
   Consent Checkbox: ✅ Confirmed

⏰ Submission Timeline:
   Submitted: 2025-10-25T14:30:00Z
```

---

## Example Output - View Audit Log

When you run `python3 view_database.py audit`, you'll see:

```
================================================================================
📋 AUDIT LOG - 5 most recent entries
================================================================================

LOG ENTRY #1
--------------------------------------------------------------------------------
⏰ Timestamp: 2025-10-25T16:45:00Z
📌 Submission ID: 550e8400-e29b-41d4-a716-446655440005
🎬 Action: create
🌐 IP Address: 127.0.0.1

LOG ENTRY #2
--------------------------------------------------------------------------------
⏰ Timestamp: 2025-10-25T15:20:00Z
📌 Submission ID: 550e8400-e29b-41d4-a716-446655440004
🎬 Action: create
🌐 IP Address: 127.0.0.1

LOG ENTRY #3
--------------------------------------------------------------------------------
⏰ Timestamp: 2025-10-25T14:30:00Z
📌 Submission ID: 550e8400-e29b-41d4-a716-446655440001
🎬 Action: create
🌐 IP Address: 127.0.0.1
```

---

## Example Output - View Schema

When you run `python3 view_database.py schema`, you'll see:

```
================================================================================
🗄️  DATABASE SCHEMA
================================================================================

TABLE: submissions
--------------------------------------------------------------------------------
   id                       TEXT       NOT NULL
   target_name              TEXT       NULLABLE
   target_url_redacted      TEXT       NOT NULL
   target_url_hash          TEXT       NOT NULL
   mission                  TEXT       NOT NULL
   example_prompt           TEXT       NULLABLE
   known_sensitive_json     TEXT       NOT NULL
   has_auth                 BOOLEAN    NOT NULL
   consent                  BOOLEAN    NOT NULL
   created_at               TEXT       NOT NULL

TABLE: audit_log
--------------------------------------------------------------------------------
   id                       INTEGER    NOT NULL
   submission_id            TEXT       NOT NULL
   action                   TEXT       NOT NULL
   ip_address               TEXT       NULLABLE
   timestamp                TEXT       NOT NULL
```

---

## Understanding the Output

### 📌 ID

The unique identifier for the submission. Use this to view a specific submission.

### 🎯 Name

The target name you provided (optional).

### 🔗 URL (Redacted)

The target URL is **redacted for security** - it shows `https://redacted.{tld}/...`

### 🔐 URL Hash

SHA-256 hash of the actual URL. This is used to verify the URL without storing it plaintext.

### 📖 Mission/Purpose

Full description of what the target does.

### 📝 Example Prompt

Example of a canonical prompt for the target.

### ⚠️ Known Sensitive Info/Behaviors

List of sensitive strings or behaviors the target should protect.

### 🔒 Security

- **Has Authorization Header**: Whether auth was provided (never stored)
- **Consent Given**: Whether user checked the consent checkbox

### ⏰ Submitted

When the submission was created (ISO 8601 format).

---

## Practical Use Cases

### 1. List All Your Submissions

```bash
python3 view_database.py all
```

See all targets you've submitted.

### 2. Check a Specific Target Before Testing

```bash
python3 view_database.py abc-123-def-456
```

Review all details before running security tests.

### 3. Get Statistics

```bash
python3 view_database.py stats
```

See summary: how many submissions, when first/last submitted, security metrics.

### 4. Verify Audit Trail

```bash
python3 view_database.py audit
```

See who submitted what and when (timestamps + IPs).

### 5. Check Database Structure

```bash
python3 view_database.py schema
```

Understand the database tables and columns.

### 6. Export All Data

```bash
python3 view_database.py export my_submissions.json
```

Get JSON file with all submissions for backup or analysis.

---

## Tips & Tricks

### Copy a Submission ID

When you run `view_database.py all`, you see IDs. Copy one and use it:

```bash
python3 view_database.py 550e8400-e29b-41d4-a716-446655440001
```

### Export for Backup

```bash
python3 view_database.py export backup_$(date +%Y%m%d).json
```

Creates timestamped backup file.

### Check What Got Submitted

After using the web UI, run:

```bash
python3 view_database.py all
```

See your submission immediately!

### Verify No Plaintext Secrets

Look at `Has Authorization Header` field:

- ✅ Says "Yes (never stored)" - Your auth header was NOT stored
- Shows `Consent Given: ✅ Yes` - User confirmed consent

### Track Growth

Run stats regularly:

```bash
python3 view_database.py stats
```

See how many submissions you have over time.

---

## What Data is Stored vs Hidden

### ✅ Stored (but redacted/hashed)

- Target URLs → Stored as redacted + hash
- Authorization headers → Hash only, never plaintext
- Mission text → Stored plaintext (you chose this)
- Sensitive items → Stored plaintext (you provided these)

### ❌ Never Stored

- Plaintext auth header value
- User passwords
- Raw target URLs (only hash stored)

---

## Database Files Location

```
/Users/ajay/Desktop/CSProjects/hackathon/backend/
├── submissions.db       ← MVP 1 submissions and audit log
└── test_results.db      ← MVP 2 test results
```

Use `view_database.py` for submissions.db.
Use `test_engine.py results` for test_results.db.

---

## Quick Reference

```bash
# Show help/usage
python3 view_database.py

# View all
python3 view_database.py all

# View one
python3 view_database.py <id>

# View audit
python3 view_database.py audit

# View stats
python3 view_database.py stats

# View schema
python3 view_database.py schema

# Export
python3 view_database.py export <file.json>
```

---

**Happy viewing! 📊✨**
