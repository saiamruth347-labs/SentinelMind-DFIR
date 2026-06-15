from fastapi import APIRouter
from ..agents.engine import read_dataset_file

router = APIRouter(prefix="/api/evidence", tags=["evidence"])

@router.get("/inventory")
def get_evidence_inventory():
    memory = read_dataset_file("memory_dump.json")
    auth = read_dataset_file("auth_logs.json")
    registry = read_dataset_file("registry_keys.json")
    
    return [
        {
            "id": "ev_01",
            "name": "memdump.raw",
            "type": "Raw Physical Memory Image",
            "size": "16.0 GB",
            "hash": memory.get("integrity_hash", "N/A"),
            "acquired_at": memory.get("acquired_at", "N/A"),
            "status": "Verified / Read-Only",
            "summary": "Full physical memory dump capturing running processes, active connections, and memory space allocations at the time of isolation."
        },
        {
            "id": "ev_02",
            "name": "Security.evtx",
            "type": "Windows Event Log Hive",
            "size": "24.5 MB",
            "hash": auth.get("integrity_hash", "N/A"),
            "acquired_at": auth.get("acquired_at", "N/A"),
            "status": "Verified / Read-Only",
            "summary": "Windows security event log hive capturing user authentication logs, remote logon attempts, and local logon events."
        },
        {
            "id": "ev_03",
            "name": "SYSTEM_registry_hive",
            "type": "Windows Registry Hive",
            "size": "8.2 MB",
            "hash": registry.get("integrity_hash", "N/A"),
            "acquired_at": registry.get("acquired_at", "N/A"),
            "status": "Verified / Read-Only",
            "summary": "System software and security registry hives containing startup execution configurations, registered services, and schedule logs."
        }
    ]

@router.get("/details/{type}")
def get_evidence_details(type: str):
    if type == "memory":
        return read_dataset_file("memory_dump.json")
    elif type == "auth":
        return read_dataset_file("auth_logs.json")
    elif type == "registry":
        return read_dataset_file("registry_keys.json")
    else:
        return {"error": "Invalid evidence type"}
