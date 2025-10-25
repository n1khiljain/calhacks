#!/usr/bin/env python3
"""
Database Viewer - Display submissions.db in plain English
Makes SQLite data human-readable and easy to understand
"""

import sqlite3
import json
from datetime import datetime
from typing import List, Dict, Any

class DatabaseViewer:
    def __init__(self, db_path='submissions.db'):
        self.db_path = db_path
    
    def _connect(self):
        """Create database connection."""
        try:
            conn = sqlite3.connect(self.db_path)
            conn.row_factory = sqlite3.Row
            return conn
        except sqlite3.Error as e:
            print(f"❌ Error connecting to database: {e}")
            return None
    
    def view_all_submissions(self):
        """Display all submissions in readable format."""
        conn = self._connect()
        if not conn:
            return
        
        try:
            cursor = conn.cursor()
            cursor.execute('SELECT * FROM submissions ORDER BY created_at DESC')
            submissions = cursor.fetchall()
            
            if not submissions:
                print("📭 No submissions found in database\n")
                return
            
            print("\n" + "="*80)
            print(f"📋 SUBMISSIONS DATABASE - {len(submissions)} submission(s)")
            print("="*80 + "\n")
            
            for idx, sub in enumerate(submissions, 1):
                print(f"SUBMISSION #{idx}")
                print("-" * 80)
                
                print(f"📌 ID: {sub['id']}")
                print(f"🎯 Name: {sub['target_name'] or '(No name provided)'}")
                print(f"🔗 URL (Redacted): {sub['target_url_redacted']}")
                print(f"🔐 URL Hash: {sub['target_url_hash'][:16]}...")
                
                print(f"\n📖 Mission/Purpose:")
                # Print mission with proper formatting
                mission = sub['mission']
                if len(mission) > 150:
                    print(f"   {mission[:150]}...")
                    print(f"\n   Full Mission:")
                    for line in mission.split('\n'):
                        print(f"   {line}")
                else:
                    print(f"   {mission}")
                
                print(f"\n📝 Example Prompt:")
                if sub['example_prompt']:
                    print(f"   {sub['example_prompt']}")
                else:
                    print(f"   (No example prompt provided)")
                
                print(f"\n⚠️  Known Sensitive Info/Behaviors:")
                try:
                    sensitive = json.loads(sub['known_sensitive_json'])
                    if sensitive:
                        for i, item in enumerate(sensitive, 1):
                            print(f"   {i}. {item}")
                    else:
                        print(f"   (No sensitive items listed)")
                except json.JSONDecodeError:
                    print(f"   (Error parsing sensitive items)")
                
                print(f"\n🔒 Security:")
                print(f"   Has Authorization Header: {'Yes (never stored)' if sub['has_auth'] else 'No'}")
                print(f"   Consent Given: {'✅ Yes' if sub['consent'] else '❌ No'}")
                
                print(f"\n⏰ Submitted: {sub['created_at']}")
                print()
        
        except sqlite3.Error as e:
            print(f"❌ Error reading submissions: {e}")
        finally:
            conn.close()
    
    def view_submission_by_id(self, submission_id: str):
        """Display a specific submission in detail."""
        conn = self._connect()
        if not conn:
            return
        
        try:
            cursor = conn.cursor()
            cursor.execute('SELECT * FROM submissions WHERE id = ?', (submission_id,))
            sub = cursor.fetchone()
            
            if not sub:
                print(f"❌ Submission {submission_id} not found\n")
                return
            
            print("\n" + "="*80)
            print(f"📋 SUBMISSION DETAILS")
            print("="*80 + "\n")
            
            print(f"📌 Submission ID:\n   {sub['id']}\n")
            
            print(f"🎯 Target Name:\n   {sub['target_name'] or '(Not provided)'}\n")
            
            print(f"🔗 Target URL (Redacted for security):\n   {sub['target_url_redacted']}\n")
            
            print(f"🔐 URL Hash (SHA-256):\n   {sub['target_url_hash']}\n")
            
            print(f"📖 Mission/Purpose:\n")
            for line in sub['mission'].split('\n'):
                print(f"   {line}")
            print()
            
            print(f"📝 Example Canonical Prompt:\n")
            if sub['example_prompt']:
                for line in sub['example_prompt'].split('\n'):
                    print(f"   {line}")
            else:
                print(f"   (No example prompt provided)")
            print()
            
            print(f"⚠️  Known Sensitive Info/Behaviors:\n")
            try:
                sensitive = json.loads(sub['known_sensitive_json'])
                if sensitive:
                    for i, item in enumerate(sensitive, 1):
                        print(f"   {i}. {item}")
                else:
                    print(f"   (No sensitive items listed)")
            except json.JSONDecodeError:
                print(f"   (Error parsing sensitive items)")
            print()
            
            print(f"🔒 Security Information:\n")
            print(f"   Authorization Header Provided: {'Yes (hashed, never stored)' if sub['has_auth'] else 'No'}")
            print(f"   Consent Checkbox: {'✅ Confirmed' if sub['consent'] else '❌ Not confirmed'}")
            print()
            
            print(f"⏰ Submission Timeline:\n")
            print(f"   Submitted: {sub['created_at']}\n")
        
        except sqlite3.Error as e:
            print(f"❌ Error reading submission: {e}")
        finally:
            conn.close()
    
    def view_audit_log(self):
        """Display audit log entries."""
        conn = self._connect()
        if not conn:
            return
        
        try:
            cursor = conn.cursor()
            cursor.execute('SELECT * FROM audit_log ORDER BY timestamp DESC LIMIT 50')
            logs = cursor.fetchall()
            
            if not logs:
                print("📭 No audit log entries found\n")
                return
            
            print("\n" + "="*80)
            print(f"📋 AUDIT LOG - {len(logs)} most recent entries")
            print("="*80 + "\n")
            
            for idx, log in enumerate(logs, 1):
                print(f"LOG ENTRY #{idx}")
                print("-" * 80)
                print(f"⏰ Timestamp: {log['timestamp']}")
                print(f"📌 Submission ID: {log['submission_id']}")
                print(f"🎬 Action: {log['action']}")
                print(f"🌐 IP Address: {log['ip_address'] or '(Unknown)'}")
                print()
        
        except sqlite3.Error as e:
            print(f"❌ Error reading audit log: {e}")
        finally:
            conn.close()
    
    def view_statistics(self):
        """Display database statistics."""
        conn = self._connect()
        if not conn:
            return
        
        try:
            cursor = conn.cursor()
            
            # Count submissions
            cursor.execute('SELECT COUNT(*) as count FROM submissions')
            total_submissions = cursor.fetchone()['count']
            
            # Count audit logs
            cursor.execute('SELECT COUNT(*) as count FROM audit_log')
            total_logs = cursor.fetchone()['count']
            
            # Get oldest and newest submissions
            cursor.execute('SELECT created_at FROM submissions ORDER BY created_at ASC LIMIT 1')
            oldest = cursor.fetchone()
            
            cursor.execute('SELECT created_at FROM submissions ORDER BY created_at DESC LIMIT 1')
            newest = cursor.fetchone()
            
            # Count submissions with auth headers
            cursor.execute('SELECT COUNT(*) as count FROM submissions WHERE has_auth = 1')
            with_auth = cursor.fetchone()['count']
            
            # Count with sensitive data
            cursor.execute('SELECT COUNT(*) as count FROM submissions WHERE known_sensitive_json != "[]"')
            with_sensitive = cursor.fetchone()['count']
            
            print("\n" + "="*80)
            print(f"📊 DATABASE STATISTICS")
            print("="*80 + "\n")
            
            print(f"📈 Overall Counts:")
            print(f"   Total Submissions: {total_submissions}")
            print(f"   Total Audit Log Entries: {total_logs}")
            print()
            
            print(f"📅 Timeline:")
            if oldest:
                print(f"   First Submission: {oldest['created_at']}")
            if newest:
                print(f"   Most Recent Submission: {newest['created_at']}")
            print()
            
            print(f"🔒 Security Metrics:")
            print(f"   Submissions with Auth Headers: {with_auth}")
            print(f"   Submissions with Sensitive Items: {with_sensitive}")
            print(f"   All Consent Boxes Checked: ✅ (required for submission)")
            print()
        
        except sqlite3.Error as e:
            print(f"❌ Error reading statistics: {e}")
        finally:
            conn.close()
    
    def export_as_json(self, output_file: str):
        """Export all submissions as JSON."""
        conn = self._connect()
        if not conn:
            return
        
        try:
            cursor = conn.cursor()
            cursor.execute('SELECT * FROM submissions ORDER BY created_at DESC')
            submissions = cursor.fetchall()
            
            # Convert to dicts
            data = []
            for sub in submissions:
                data.append({
                    'id': sub['id'],
                    'target_name': sub['target_name'],
                    'target_url_redacted': sub['target_url_redacted'],
                    'target_url_hash': sub['target_url_hash'],
                    'mission': sub['mission'],
                    'example_prompt': sub['example_prompt'],
                    'known_sensitive': json.loads(sub['known_sensitive_json']),
                    'has_auth': bool(sub['has_auth']),
                    'consent': bool(sub['consent']),
                    'created_at': sub['created_at']
                })
            
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            
            print(f"✅ Exported {len(data)} submission(s) to {output_file}\n")
        
        except (sqlite3.Error, IOError) as e:
            print(f"❌ Error exporting: {e}")
        finally:
            conn.close()
    
    def view_table_schema(self):
        """Display database schema."""
        conn = self._connect()
        if not conn:
            return
        
        try:
            cursor = conn.cursor()
            
            print("\n" + "="*80)
            print(f"🗄️  DATABASE SCHEMA")
            print("="*80 + "\n")
            
            # Submissions table
            print("TABLE: submissions")
            print("-" * 80)
            cursor.execute("PRAGMA table_info(submissions)")
            columns = cursor.fetchall()
            for col in columns:
                col_name = col[1]
                col_type = col[2]
                col_notnull = "NOT NULL" if col[3] else "NULLABLE"
                print(f"   {col_name:<25} {col_type:<10} {col_notnull}")
            print()
            
            # Audit log table
            print("TABLE: audit_log")
            print("-" * 80)
            cursor.execute("PRAGMA table_info(audit_log)")
            columns = cursor.fetchall()
            for col in columns:
                col_name = col[1]
                col_type = col[2]
                col_notnull = "NOT NULL" if col[3] else "NULLABLE"
                print(f"   {col_name:<25} {col_type:<10} {col_notnull}")
            print()
        
        except sqlite3.Error as e:
            print(f"❌ Error reading schema: {e}")
        finally:
            conn.close()


def main():
    """CLI interface."""
    import sys
    
    viewer = DatabaseViewer()
    
    if len(sys.argv) < 2:
        print("\n🗄️  Database Viewer - View submissions.db in Plain English\n")
        print("Usage:")
        print("  python3 view_database.py all              - View all submissions")
        print("  python3 view_database.py <submission_id>  - View specific submission")
        print("  python3 view_database.py audit            - View audit log")
        print("  python3 view_database.py stats            - View statistics")
        print("  python3 view_database.py schema           - View database schema")
        print("  python3 view_database.py export <file>    - Export to JSON")
        print()
        return
    
    command = sys.argv[1]
    
    if command == 'all':
        viewer.view_all_submissions()
    
    elif command == 'audit':
        viewer.view_audit_log()
    
    elif command == 'stats':
        viewer.view_statistics()
    
    elif command == 'schema':
        viewer.view_table_schema()
    
    elif command == 'export':
        if len(sys.argv) < 3:
            print("Usage: python3 view_database.py export <output_file>")
            return
        output_file = sys.argv[2]
        viewer.export_as_json(output_file)
    
    else:
        # Assume it's a submission ID
        viewer.view_submission_by_id(command)


if __name__ == '__main__':
    main()
