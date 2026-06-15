import sqlite3
import os
import json
from datetime import datetime

DATABASE_PATH = os.path.join(os.path.dirname(__file__), "sentinelmind.db")

def get_db_connection():
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Enable foreign keys
    cursor.execute("PRAGMA foreign_keys = ON;")
    
    # Create investigations table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS investigations (
        id TEXT PRIMARY KEY,
        status TEXT NOT NULL,
        target_host TEXT NOT NULL,
        created_at TEXT NOT NULL,
        completed_at TEXT
    );
    """)
    
    # Create findings table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS findings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        investigation_id TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        confidence REAL NOT NULL,
        severity TEXT NOT NULL,
        status TEXT NOT NULL, -- Confirmed, Probable, Unverified
        evidence_source TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (investigation_id) REFERENCES investigations(id) ON DELETE CASCADE
    );
    """)
    
    # Create audit_logs table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS audit_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        investigation_id TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        agent_name TEXT NOT NULL,
        action TEXT NOT NULL,
        tool_used TEXT NOT NULL,
        command_run TEXT NOT NULL,
        evidence_source TEXT NOT NULL,
        output_summary TEXT NOT NULL,
        confidence_score REAL NOT NULL,
        is_self_correction INTEGER DEFAULT 0,
        FOREIGN KEY (investigation_id) REFERENCES investigations(id) ON DELETE CASCADE
    );
    """)
    
    conn.commit()
    conn.close()

# Initialize database on import
init_db()
