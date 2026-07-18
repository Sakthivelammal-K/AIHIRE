from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.auth import router as auth_router
from routes.users import router as user_router
from routes.jobs import router as job_router
from routes.applications import router as application_router
from routes.interviews import router as interview_router
from routes.resumes import router as resume_router
from routes.organizations import router as organization_router
from routes.ai_interview import router as ai_router
from routes.video_interview import router as videoInterview_router
from routes.assessment import router as assessment_router
from routes.messages import router as message_router
from routes.settings import router as setting_router
from routes.notifications import router as notification_router
from routes.templates import router as template_router
from routes import ai_prompts

from fastapi.staticfiles import StaticFiles



app = FastAPI()



# ==========================
# CORS CONFIGURATION
# ==========================

app.add_middleware(

    CORSMiddleware,

    allow_origins=[

        "http://localhost:5173",

        "http://127.0.0.1:5173",

        "https://aihire-eahrhrdwhdd6c7ad.southindia-01.azurewebsites.net"

    ],

    allow_credentials=True,

    allow_methods=[

        "GET",
        "POST",
        "PUT",
        "DELETE",
        "OPTIONS"

    ],

    allow_headers=[

        "*"

    ],

)





# ==========================
# ROUTES
# ==========================


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


app.include_router(
    ai_router
)


app.include_router(
    videoInterview_router
)


app.include_router(
    assessment_router
)

app.include_router(
    message_router,
    prefix="/messages",
    tags=["Messages"]
)

app.include_router(
    setting_router
)

app.include_router(
    notification_router,
    prefix="/notifications"
)

app.include_router(
    template_router,
    prefix="/templates"
)

app.include_router(
    ai_prompts.router,
    prefix="/ai-prompts"
)

# ==========================
# STATIC & UPLOADS FILES
# ==========================
import os
from fastapi.responses import FileResponse

# Ensure uploads directory exists
if not os.path.exists("uploads"):
    os.makedirs("uploads")

app.mount(
    "/uploads",
    StaticFiles(directory="uploads"),
    name="uploads"
)

# Serve React static files if static directory exists
if os.path.exists("static"):
    app.mount(
        "/assets",
        StaticFiles(directory=os.path.join("static", "assets")),
        name="assets"
    )

    @app.get("/{fallback_path:path}")
    async def serve_spa(fallback_path: str):
        # Allow API routes, docs, and uploads to pass through without catching them
        if fallback_path.startswith(("auth", "users", "jobs", "applications", "interviews", "resumes", "organizations", "messages", "uploads", "docs", "redoc", "openapi.json")):
            return None
        
        # Check if requested file exists in static folder
        file_path = os.path.join("static", fallback_path)
        if os.path.isfile(file_path):
            return FileResponse(file_path)
            
        # Default to index.html for SPA routing
        return FileResponse(os.path.join("static", "index.html"))
else:
    @app.get("/")
    def home():
        return {
            "message": "Backend working"
        }