import json
import os
import time
from datetime import datetime, timedelta
from ..database.db import get_db_connection

# Helper to read dataset files
def read_dataset_file(filename):
    data_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")
    filepath = os.path.join(data_dir, filename)
    if os.path.exists(filepath):
        with open(filepath, "r") as f:
            return json.load(f)
    return {}

class InvestigationEngine:
    def __init__(self, investigation_id: str, target_host: str):
        self.investigation_id = investigation_id
        self.target_host = target_host
        self.logs = []
        self.findings = []
        
        # Load sample datasets
        self.memory_dump = read_dataset_file("memory_dump.json")
        self.auth_logs = read_dataset_file("auth_logs.json")
        self.registry_keys = read_dataset_file("registry_keys.json")

    def _write_log(self, agent: str, action: str, tool: str, command: str, source: str, summary: str, confidence: float, is_correction: bool = False):
        conn = get_db_connection()
        cursor = conn.cursor()
        now_str = datetime.utcnow().isoformat() + "Z"
        
        cursor.execute("""
            INSERT INTO audit_logs (investigation_id, timestamp, agent_name, action, tool_used, command_run, evidence_source, output_summary, confidence_score, is_self_correction)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (self.investigation_id, now_str, agent, action, tool, command, source, summary, confidence, 1 if is_correction else 0))
        
        conn.commit()
        conn.close()
        # Sleep briefly to simulate execution speed
        time.sleep(1.5)

    def _write_finding(self, title: str, description: str, confidence: float, severity: str, status: str, source: str):
        conn = get_db_connection()
        cursor = conn.cursor()
        now_str = datetime.utcnow().isoformat() + "Z"
        
        cursor.execute("""
            INSERT INTO findings (investigation_id, title, description, confidence, severity, status, evidence_source, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (self.investigation_id, title, description, confidence, severity, status, source, now_str, now_str))
        
        conn.commit()
        conn.close()

    def run(self):
        # Set status to running
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("UPDATE investigations SET status = 'Running' WHERE id = ?", (self.investigation_id,))
        conn.commit()
        conn.close()

        # Step 1: Evidence Collector Agent
        self._write_log(
            agent="Evidence Collector Agent",
            action="initialize_investigation",
            tool="SIFT Acquisition Loader",
            command="sift mount /data/forensics/disk.raw /mnt/sift",
            source="disk.raw",
            summary="Mounted host disk image. Verified SHA-256 hashes of disk and raw memory dumps. Evidence inventory created (3 primary artifacts ingested).",
            confidence=1.0
        )
        
        self._write_log(
            agent="Evidence Collector Agent",
            action="metadata_extraction",
            tool="SIFT File Analyzer",
            command="sha256sum /mnt/sift/Windows/System32/config/SYSTEM",
            source="SYSTEM_registry_hive, memdump.raw, Security.evtx",
            summary=f"Extracted integrity hashes. Memory Dump: {self.memory_dump.get('integrity_hash')[:16]}... Registry Hive: {self.registry_keys.get('integrity_hash')[:16]}... Security Logs: {self.auth_logs.get('integrity_hash')[:16]}... All evidence set to read-only mode.",
            confidence=1.0
        )

        # Step 2: Memory Analysis Agent (Forming Initial Incorrect Hypothesis)
        self._write_log(
            agent="Memory Analysis Agent",
            action="process_scanning",
            tool="Volatility 3 (windows.pslist)",
            command="vol -f memdump.raw windows.pslist",
            source="memdump.raw",
            summary="Scanned active processes. Detected svchost.exe (PID 4920) running from C:\\Users\\Public\\Downloads\\svchost.exe parented by svchost.exe (PID 3204). Typically, svchost.exe is spawned by services.exe.",
            confidence=0.75
        )

        self._write_log(
            agent="Memory Analysis Agent",
            action="network_correlation",
            tool="Volatility 3 (windows.netscan)",
            command="vol -f memdump.raw windows.netscan",
            source="memdump.raw",
            summary="Detected active TCP connection from svchost.exe (PID 4920) to 185.220.101.44:443 (ESTABLISHED).",
            confidence=0.8
        )

        # Write Initial Incorrect Hypothesis
        initial_hypothesis_desc = (
            "Detected a non-standard svchost.exe process running from a public download directory. "
            "However, based on its parent PID and lack of direct admin privilege escalation logs, "
            "it is initially hypothesized to be a temporary network diagnostics service manually run "
            "by a system administrator to trace network traffic."
        )
        self._write_finding(
            title="Suspicious System Utility execution (svchost.exe)",
            description=initial_hypothesis_desc,
            confidence=0.60,
            severity="Medium",
            status="Probable",
            source="memdump.raw"
        )

        # Step 3: Timeline Analyst Agent
        self._write_log(
            agent="Timeline Analyst Agent",
            action="event_log_parsing",
            tool="Plaso / log2timeline",
            command="log2timeline.py --source /mnt/sift/Windows/System32/winevt/Logs/Security.evtx timeline.db",
            source="Security.evtx",
            summary="Parsed Security logs. Detected brute-force attempts on Administrator account from IP 185.220.101.44. Two failures followed by a successful Event ID 4624 (Logon Type 3) on 2026-06-15T23:31:02Z.",
            confidence=0.9
        )

        self._write_log(
            agent="Timeline Analyst Agent",
            action="service_creation_audit",
            tool="EvtxParser",
            command="evtx_dump.py --id 7045 /mnt/sift/Windows/System32/winevt/Logs/System.evtx",
            source="System.evtx",
            summary="Service creation audit: Event ID 7045 shows installation of service 'WinSecurityAgent' pointing to C:\\Users\\Public\\Downloads\\svchost.exe at 2026-06-15T23:34:45Z, minutes after successful remote administrator logon.",
            confidence=0.95
        )

        # Step 4: Correlation Agent
        self._write_log(
            agent="Correlation Agent",
            action="cross_evidence_correlation",
            tool="SentinelMind Correlation Engine",
            command="sentinelmind-correlate --process 4920 --logs Security.evtx",
            source="memdump.raw, Security.evtx",
            summary="Correlated memory network connections with Security logs: The outbound C2 connection from svchost.exe (PID 4920) maps to the same remote IP 185.220.101.44 that brute-forced the Administrator login. The binary was installed as service 'WinSecurityAgent' 3 minutes after the breach.",
            confidence=0.9
        )

        # Step 5: Skeptic Agent (Challenges Hypothesis and Triggers Self-Correction)
        self._write_log(
            agent="Skeptic Agent",
            action="challenge_conclusions",
            tool="Hypothesis Evaluator",
            command="sentinelmind-skeptic --validate-hypothesis \"System Admin manual diagnostics\"",
            source="memdump.raw, Security.evtx",
            summary="CRITICAL CHALLENGE: Hypothesis rejected. A legitimate administrator does not brute-force their own machine from 185.220.101.44 (known Tor exit node). Legitimate svchost.exe binaries never run from User folders. Yara check: CobaltStrike_Beacon triggered on PID 4920 memory space. Confidence dropped to 0.15. Triggering self-correction loop.",
            confidence=0.15,
            is_correction=True
        )

        # Update finding status to 'Unverified' or flag as rejected
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            UPDATE findings 
            SET status = 'Unverified', confidence = 0.15, description = '[REJECTED HYPOTHESIS] ' || description, updated_at = ?
            WHERE title = 'Suspicious System Utility execution (svchost.exe)' AND investigation_id = ?
        """, (datetime.utcnow().isoformat() + "Z", self.investigation_id))
        conn.commit()
        conn.close()

        # Step 6: Self-Correction Loop / Launching Registry & Task Persistence Scan
        self._write_log(
            agent="Evidence Collector Agent",
            action="collect_persistence_evidence",
            tool="SIFT Registry Dumper (Rip.pl)",
            command="rip.pl -r /mnt/sift/Windows/System32/config/SOFTWARE -f Run",
            source="SOFTWARE_registry_hive",
            summary="SELF-CORRECTION ITERATION 2: Ingested Registry Run keys to identify persistence mechanisms. Found 'WindowsUpdateAgent' registry key pointing to C:\\Users\\Public\\Downloads\\svchost.exe --silent.",
            confidence=0.98,
            is_correction=True
        )

        self._write_log(
            agent="Memory Analysis Agent",
            action="yara_signature_verification",
            tool="Volatility 3 (windows.vadyarascan)",
            command="vol -f memdump.raw windows.vadyarascan --rules CobaltStrike",
            source="memdump.raw",
            summary="SELF-CORRECTION ITERATION 3: Performed VAD Yara scan on PID 4920. Verified presence of active Cobalt Strike Beacon payload inside PAGE_EXECUTE_READWRITE protected segment at address 0x0000021c3fa10000.",
            confidence=1.0,
            is_correction=True
        )

        # Step 7: Final Correlation & Confirmed Finding
        self._write_log(
            agent="Correlation Agent",
            action="finalize_threat_reconstruction",
            tool="SentinelMind Threat Reconstructor",
            command="sentinelmind-correlate --build-attack-chain",
            source="memdump.raw, Security.evtx, SOFTWARE_registry_hive",
            summary="SELF-CORRECTION ITERATION 4: Combined memory C2 connection, brute force logs, service registration, registry persistence, and Yara signatures. Established fully validated Cobalt Strike Beacon intrusion chain.",
            confidence=1.0,
            is_correction=True
        )

        # Write corrected findings
        self._write_finding(
            title="Cobalt Strike C2 Beacon Active Persistence",
            description="Autonomous correlation verified that the process svchost.exe (PID 4920) running from the Public Downloads folder is a Cobalt Strike Beacon payload. The attacker brute-forced the Administrator account from 185.220.101.44, installed a custom service 'WinSecurityAgent', and registered registry Run key 'WindowsUpdateAgent' for persistence. The beacon communicates with external command-and-control server 185.220.101.44 on port 443.",
            confidence=0.98,
            severity="Critical",
            status="Confirmed",
            source="memdump.raw, Security.evtx, registry_keys.json"
        )

        # Step 8: Report Agent
        self._write_log(
            agent="Report Agent",
            action="compile_incident_report",
            tool="SentinelMind Reporter",
            command="sentinelmind-report --generate --id " + self.investigation_id,
            source="database",
            summary="Synthesized findings, attack timelines, evidence integrity manifests, and audit logs into the final executive incident report. Labeled threats appropriately.",
            confidence=1.0
        )

        # Mark investigation as completed
        conn = get_db_connection()
        cursor = conn.cursor()
        now_str = datetime.utcnow().isoformat() + "Z"
        cursor.execute("UPDATE investigations SET status = 'Completed', completed_at = ? WHERE id = ?", (now_str, self.investigation_id))
        conn.commit()
        conn.close()
