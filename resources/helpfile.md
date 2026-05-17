# Build with env file
`docker compose --env-file .env.production up --build -d`


# Add upstream repo
`git remote add upstream https://github.com/Murlidhar08/next-auth-template.git`

# Disable remote branch push
`git remote set-url --push upstream DISABLE`

# Add from upstream
`git fetch upstream`
`git merge upstream/main --allow-unrelated-histories`