from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.auth import router as auth_router
from routes.users import router as user_router
from routes.jobs import router as job_router
from routes.applications import router as application_router
from routes.interviews import router as interview_router
from routes.resumes import router as resume_router
from routes.organizations import router as organization_router


app = FastAPI()


# CORS MUST come before routes
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(
    auth_router,
    prefix="/auth"
)


app.include_router(
    user_router,
    prefix="/users"
)

app.include_router(
    job_router,
    prefix="/jobs"
)

app.include_router(
    application_router,
    prefix="/applications"
)

app.include_router(
    interview_router,
    prefix="/interviews"
)

app.include_router(
    resume_router,
    prefix="/resumes"
)

app.include_router(
    organization_router,
    prefix="/organizations"
)

@app.get("/")
def home():
    return {
        "message":"Backend working"
    }