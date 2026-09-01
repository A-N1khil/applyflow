from fastapi import FastAPI

from server.core.exception_handlers import register_exception_handlers
from server.routers import (
    application_router,
    company_router,
    interviews_router,
    status_router,
    user_router,
)

app = FastAPI()

register_exception_handlers(app)

app.include_router(application_router.router)
app.include_router(company_router.router)
app.include_router(status_router.router)
app.include_router(interviews_router.router)
app.include_router(user_router.router)


@app.get("/")
def root():
    return {"message": "Welcome to ApplyFlow"}


@app.get("/healthCheck")
def health_check():
    return {"status": "healthy"}
