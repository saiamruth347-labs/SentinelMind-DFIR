from fastapi import APIRouter, BackgroundTasks, HTTPException
from pydantic import BaseModel
import uuid
from datetime import datetime
from ..database.db import get_db_connection
from ..agents.engine import InvestigationEngine

router = APIRouter(prefix="/api/investigation", tags=["investigation"])

class StartRequest(BaseModel):
    target_host: str

@router.post("/start")
def start_investigation(payload: StartRequest, background_tasks: BackgroundTasks):
    investigation_id = str(uuid.uuid4())[:8]
    created_at = datetime.utcnow().isoformat() + "Z"
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO investigations (id, status, target_host, created_at)
        VALUES (?, 'Pending', ?, ?)
    """, (investigation_id, payload.target_host, created_at))
    conn.commit()
    conn.close()
    
    # Start the engine asynchronously
    engine = InvestigationEngine(investigation_id, payload.target_host)
    background_tasks.add_task(engine.run)
    
    return {"investigation_id": investigation_id, "status": "Pending"}

@router.get("/list")
def list_investigations():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM investigations ORDER BY created_at DESC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

@router.get("/{id}/status")
def get_status(id: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM investigations WHERE id = ?", (id,))
    row = cursor.fetchone()
    conn.close()
    if not row:
        raise HTTPException(status_code=404, detail="Investigation not found")
    return dict(row)

@router.get("/{id}/logs")
def get_logs(id: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM audit_logs WHERE investigation_id = ? ORDER BY id ASC", (id,))
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

@router.get("/{id}/findings")
def get_findings(id: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM findings WHERE investigation_id = ? ORDER BY id ASC", (id,))
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]
