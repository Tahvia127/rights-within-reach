from fastapi import FastAPI       # 1. import
app = FastAPI()                   # 2. app instance
@app.get("/health")               # 3. GET route
def health():
    return {"status": "ok", "version": "0.1.0"}