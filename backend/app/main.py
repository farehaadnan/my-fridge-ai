from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import API_TITLE, API_DESCRIPTION, API_VERSION
from app.api import detect
from app.api import detect, recipes  # Add recipes import


app = FastAPI(
    title=API_TITLE,
    description=API_DESCRIPTION,
    version=API_VERSION
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to specific domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(detect.router, prefix="/api", tags=["Detection"])
@app.get("/")
def root():
    return {
        "message": "My Fridge AI API",
        "status": "running",
        "version": API_VERSION
    }
@app.get("/health")
def health():
    return {"status": "healthy"}
# Include both routers
app.include_router(recipes.router, prefix="/api", tags=["Recipes"])  # Add this