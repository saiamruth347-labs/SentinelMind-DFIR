from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import investigation, reports, evidence

app = FastAPI(
    title="SentinelMind DFIR Agent Engine",
    description="Autonomous self-correcting incident response multi-agent API.",
    version="1.0.0"
)

# Enable CORS for frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(investigation.router)
app.include_router(reports.router)
app.include_router(evidence.router)

@app.get("/")
def read_root():
    return {
        "status": "online",
        "system": "SentinelMind DFIR Agent Engine",
        "version": "1.0.0"
    }
