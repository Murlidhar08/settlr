@echo off
set IMAGE=chavda2772/settlr:latest

echo Stopping existing container...
docker compose down

echo Removing current latest image (%IMAGE%)...
docker rmi -f %IMAGE% 2>nul || (call )

echo Downloading/pulling latest image...
docker compose pull settlr

echo Starting updated container...
docker compose up -d

echo Cleaning up dangling images...
docker image prune -f

echo Update complete! 
echo Container is running the latest version.

pause