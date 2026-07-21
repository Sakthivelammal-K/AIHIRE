from main import app as fastapi_app

# This entry point enables Azure App Service auto-detection for Python applications
# a2wsgi provides compatibility when Azure defaults to synchronous Gunicorn WSGI workers
try:
    from a2wsgi import ASGItoWSGI
    app = ASGItoWSGI(fastapi_app)
except Exception as e:
    print(f"a2wsgi wrapper warning: {e}")
    app = fastapi_app
