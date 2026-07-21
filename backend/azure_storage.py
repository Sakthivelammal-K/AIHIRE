import os
import uuid
from io import BytesIO
from dotenv import load_dotenv

load_dotenv()

AZURE_STORAGE_CONNECTION_STRING = os.getenv("AZURE_STORAGE_CONNECTION_STRING")
AZURE_STORAGE_CONTAINER = os.getenv("AZURE_STORAGE_CONTAINER", "media")
AZURE_CDN_URL = os.getenv("AZURE_CDN_URL", "https://marketingstorein.blob.core.windows.net/media")

blob_service_client = None

if AZURE_STORAGE_CONNECTION_STRING:
    try:
        from azure.storage.blob import BlobServiceClient
        blob_service_client = BlobServiceClient.from_connection_string(AZURE_STORAGE_CONNECTION_STRING)
        # Verify or create container
        try:
            container_client = blob_service_client.get_container_client(AZURE_STORAGE_CONTAINER)
            if not container_client.exists():
                container_client.create_container(public_access="blob")
            print(f"✅ Azure Blob Storage connected to container '{AZURE_STORAGE_CONTAINER}'")
        except Exception as e:
            print(f"⚠️ Azure container check warning: {e}")
    except Exception as e:
        print(f"⚠️ Azure Blob Storage client init failed: {e}")


def upload_file_to_azure(file_bytes: bytes, filename: str, content_type: str = "application/octet-stream", folder: str = "") -> str:
    """
    Uploads a file directly to Azure Blob Storage (container: 'media') and returns the public CDN / Blob URL.
    Falls back to local file storage if Azure is unavailable.
    """
    ext = os.path.splitext(filename)[1]
    unique_filename = f"{uuid.uuid4().hex}{ext}"
    
    blob_path = f"{folder.strip('/')}/{unique_filename}" if folder else unique_filename

    if blob_service_client:
        try:
            from azure.storage.blob import ContentSettings
            blob_client = blob_service_client.get_blob_client(container=AZURE_STORAGE_CONTAINER, blob=blob_path)
            content_settings = ContentSettings(content_type=content_type) if content_type else None
            
            blob_client.upload_blob(file_bytes, overwrite=True, content_settings=content_settings)
            
            # Construct public Azure CDN URL
            if AZURE_CDN_URL:
                cdn_clean = AZURE_CDN_URL.rstrip('/')
                return f"{cdn_clean}/{blob_path}"
            return blob_client.url
        except Exception as e:
            print(f"❌ Azure Blob upload failed ({e}), falling back to local file system...")

    # Fallback to local uploads directory if Azure Blob Storage is unavailable
    upload_dir = os.path.join("uploads", folder) if folder else "uploads"
    os.makedirs(upload_dir, exist_ok=True)
    local_file_path = os.path.join(upload_dir, unique_filename)
    
    with open(local_file_path, "wb") as f:
        f.write(file_bytes)
        
    return f"/uploads/{folder + '/' if folder else ''}{unique_filename}"
