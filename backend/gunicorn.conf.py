import os

# Gunicorn configuration file for FastAPI on Azure App Service
bind = f"0.0.0.0:{os.environ.get('PORT', '8000')}"
workers = int(os.environ.get('WEB_CONCURRENCY', 4))
worker_class = "uvicorn.workers.UvicornWorker"
timeout = 120
keepalive = 5
