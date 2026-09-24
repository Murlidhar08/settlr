#!/bin/bash

# Exit on error
set -e

IMAGE="chavda2772/settlr:latest"

echo "🚀 Stopping existing container..."
docker compose down

echo "🗑️ Removing current latest image ($IMAGE)..."
docker rmi -f $IMAGE 2>/dev/null || true

echo "📥 Downloading/pulling latest image..."
docker compose pull settlr

echo "🔄 Starting updated container..."
docker compose up -d

echo "🧹 Cleaning up dangling images..."
docker image prune -f

echo "✅ Update complete! Container is running the latest version."
