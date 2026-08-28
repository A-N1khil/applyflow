from fastapi import FastAPI

from server.routers import application, company, interviews, status, user

app = FastAPI()

app.include_router(application.router)
app.include_router(company.router)
app.include_router(status.router)
app.include_router(interviews.router)
app.include_router(user.router)


@app.get("/")
def root():
    return {"message": "Welcome to ApplyFlow"}


@app.get("/healthCheck")
def health_check():
    return {"status": "healthy"}
