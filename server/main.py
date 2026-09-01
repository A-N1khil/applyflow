from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from server.core.config import settings
from server.core.exception_handlers import register_exception_handlers
from server.routers import (
    application_router,
    company_router,
    user_router,
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.client_url],
    allow_methods=["GET", "POST", "PATCH", "DELETE"],
    allow_headers=["Accept", "Content-Type"],
)

register_exception_handlers(app)

app.include_router(application_router.router)
app.include_router(company_router.router)
app.include_router(user_router.router)


@app.get("/")
def root():
    return {"message": "Welcome to ApplyFlow"}


@app.get("/healthCheck")
def health_check():
    return {"status": "healthy"}
