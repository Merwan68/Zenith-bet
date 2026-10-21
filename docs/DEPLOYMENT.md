# Production Deployment Guide

## Production Architecture

Zenith Arena can be deployed on any modern container runtime or cloud infrastructure (e.g. Google Cloud Run, AWS ECS, DigitalOcean App Platform, or Kubernetes).

### Cloud Run Deployment
```bash
# Build production Docker image
docker build -t gcr.io/$PROJECT_ID/zenith-arena:latest .

# Push to Container Registry
docker push gcr.io/$PROJECT_ID/zenith-arena:latest

# Deploy to Cloud Run
gcloud run deploy zenith-arena \
  --image gcr.io/$PROJECT_ID/zenith-arena:latest \
  --platform managed \
  --port 3000 \
  --set-env-vars NODE_ENV=production,PORT=3000
```

### Environment Configuration Checklist
- `DATABASE_URL`: Connection string to production PostgreSQL instance.
- `REDIS_URL`: Connection string to managed Redis cache for session storage.
- `SPORTRADAR_API_KEY`: Production unified odds feed key.
- `TELEBIRR_SANDBOX_ENDPOINT`: Switch to `https://api.telebirr.et` once commercial merchant agreement is executed.
