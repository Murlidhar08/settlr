#!/bin/bash

# Exit if any command fails
set -e

# Check if version argument is provided
if [ -z "$1" ]; then
  echo "Usage: ./docker-release.sh <version>"
  echo "Example: ./docker-release.sh 0.0.2"
  exit 1
fi

VERSION=$1
IMAGE="chavda2772/settlr"

echo "🚀 Building Docker image with tag $VERSION..."

docker build -t $IMAGE:$VERSION .

echo "🔖 Tagging image as latest..."
docker tag $IMAGE:$VERSION $IMAGE:latest

echo "📤 Pushing version tag..."
docker push $IMAGE:$VERSION

echo "📤 Pushing latest tag..."
docker push $IMAGE:latest

echo "✅ Docker image $IMAGE:$VERSION successfully pushed!"