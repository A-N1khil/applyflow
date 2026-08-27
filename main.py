from fastapi import FastAPI

app = FastAPI()

@app.get("/")


@app.get("/healthCheck")
def health_check():
    return {"status": "healthy"}