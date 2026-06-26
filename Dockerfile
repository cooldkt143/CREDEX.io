# Stage 1: Build the frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Setup Python backend & copy built assets
FROM python:3.11-slim
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install
COPY BackEnd/requirements.txt ./BackEnd/requirements.txt
RUN pip install --no-cache-dir -r BackEnd/requirements.txt

# Copy built assets from Stage 1
COPY --from=frontend-builder /app/dist ./dist

# Copy backend code
COPY BackEnd ./BackEnd

# Ensure uploads directory is created
RUN mkdir -p BackEnd/uploads

EXPOSE 8000

ENV PYTHONUNBUFFERED=1

WORKDIR /app/BackEnd
CMD ["python", "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
