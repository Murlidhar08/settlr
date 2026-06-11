# Build with env file
`docker compose --env-file .env.production up --build -d`
`docker compose --file docker-compose-with-db.yml --env-file .env.production up --build -d`

# Docker Release
`./resources/scripts/docker-release.sh <version>`
`ex: ./resources/scripts/docker-release.sh 0.0.2`

# Add upstream repo
`git remote add upstream https://github.com/Murlidhar08/next-auth-template.git`

# Disable remote branch push
`git remote set-url --push upstream DISABLE`
`git remote -v`

# Add from upstream
`git fetch upstream`
`git merge upstream/main --allow-unrelated-histories` # Only first time
`git merge upstream/main` # After first time
`git push origin main`