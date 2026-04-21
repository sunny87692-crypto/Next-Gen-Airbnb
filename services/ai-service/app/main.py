from fastapi import FastAPI

app = FastAPI(title="NWXT Gen AI Service")

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/chat")
def chat(payload: dict):
    return {"message": "This endpoint will return AI chat responses."}
