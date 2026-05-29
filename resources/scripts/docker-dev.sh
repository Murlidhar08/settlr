# Navigate to the project root
cd "$(dirname "$0")/../.."

docker compose -f ./docker-compose-with-pg.yml down -v
docker compose -f ./docker-compose-with-pg.yml build --no-cache
docker compose -f ./docker-compose-with-pg.yml up