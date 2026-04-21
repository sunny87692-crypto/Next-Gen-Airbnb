# AI Service

Python FastAPI AI/ML service for the NWXT roadmap application.

## Usage

1. Install dependencies: `pip install -r requirements.txt` or use `python -m pip install fastapi uvicorn`
2. Run: `uvicorn app.main:app --reload --host 0.0.0.0 --port 5003`
3. Health endpoint: `GET /health`
