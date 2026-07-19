FROM python:3.12-slim

WORKDIR /app

# Install dependencies first for better layer caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code (NOT .env — it's excluded via .dockerignore)
COPY app/ ./app/

# AWS App Runner / Elastic Beanstalk provide PORT via env; default to 8000 locally
ENV PORT=8000
EXPOSE 8000

# API keys/secrets are injected at runtime as environment variables —
# never baked into the image.
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT}"]
