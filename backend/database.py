import sqlite3
import os
from contextlib import contextmanager

class Database:
    def __init__(self, db_path='submissions.db'):
        self.db_path = db_path
        self.init_db()
    
    @contextmanager
    def get_connection(self):
        """Context manager for database connections."""
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        try:
            yield conn
            conn.commit()
        except Exception as e:
            conn.rollback()
            raise e
        finally:
            conn.close()
    
    def init_db(self):
        """Initialize database tables."""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            
            # Submissions table
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS submissions (
                    id TEXT PRIMARY KEY,
                    target_name TEXT,
                    target_url_redacted TEXT NOT NULL,
                    target_url_hash TEXT NOT NULL,
                    mission TEXT NOT NULL,
                    example_prompt TEXT,
                    known_sensitive_json TEXT NOT NULL,
                    has_auth BOOLEAN NOT NULL,
                    consent BOOLEAN NOT NULL,
                    created_at TEXT NOT NULL
                )
            ''')
            
            # Audit log table
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS audit_log (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    submission_id TEXT NOT NULL,
                    action TEXT NOT NULL,
                    ip_address TEXT,
                    timestamp TEXT NOT NULL,
                    FOREIGN KEY (submission_id) REFERENCES submissions(id)
                )
            ''')
            
            # Create indexes for performance
            cursor.execute('''
                CREATE INDEX IF NOT EXISTS idx_submissions_created_at 
                ON submissions(created_at DESC)
            ''')
            
            cursor.execute('''
                CREATE INDEX IF NOT EXISTS idx_audit_log_submission_id 
                ON audit_log(submission_id)
            ''')
    
    def create_submission(self, data):
        """Create a new submission."""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO submissions (
                    id, target_name, target_url_redacted, target_url_hash,
                    mission, example_prompt, known_sensitive_json,
                    has_auth, consent, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                data['id'],
                data['target_name'],
                data['target_url_redacted'],
                data['target_url_hash'],
                data['mission'],
                data['example_prompt'],
                data['known_sensitive_json'],
                data['has_auth'],
                data['consent'],
                data['created_at']
            ))
    
    def get_submission(self, submission_id):
        """Get a specific submission by ID."""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                SELECT * FROM submissions WHERE id = ?
            ''', (submission_id,))
            row = cursor.fetchone()
            return dict(row) if row else None
    
    def get_all_submissions(self):
        """Get all submissions ordered by created_at DESC."""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                SELECT * FROM submissions ORDER BY created_at DESC
            ''')
            rows = cursor.fetchall()
            return [dict(row) for row in rows]
    
    def log_audit(self, data):
        """Log an audit entry."""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO audit_log (
                    submission_id, action, ip_address, timestamp
                ) VALUES (?, ?, ?, ?)
            ''', (
                data['submission_id'],
                data['action'],
                data['ip_address'],
                data['timestamp']
            ))
    
    def purge_old_submissions(self, days=30):
        """Purge submissions older than specified days."""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                DELETE FROM submissions 
                WHERE datetime(created_at) < datetime('now', '-' || ? || ' days')
            ''', (days,))
            deleted_count = cursor.rowcount
            return deleted_count

