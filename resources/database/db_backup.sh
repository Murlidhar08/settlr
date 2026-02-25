#!/bin/bash

# Configuration
BACKUP_DIR="./backup_db"
mkdir -p "$BACKUP_DIR"

# Timestamp for filename
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Function to display usage
usage() {
    echo "Usage: $0 [database_url]"
    echo "If database_url is not provided, it will attempt to read DATABASE_URL from .env file or environment."
    exit 1
}

set -o pipefail

# Determine Database URL
DB_URL=$1
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [ -z "$DB_URL" ]; then
    if [ -f "$SCRIPT_DIR/../../.env" ]; then
        # Extract DATABASE_URL from .env file (assuming it's in the project root)
        DB_URL=$(grep "^DATABASE_URL=" "$SCRIPT_DIR/../../.env" | cut -d'=' -f2- | tr -d '"')
    elif [ -n "$DATABASE_URL" ]; then
        DB_URL=$DATABASE_URL
    fi
fi

if [ -z "$DB_URL" ]; then
    echo "Error: Database URL not found."
    usage
fi

# Sanitize URL: pg_dump does not support pgbouncer=true query parameter
CLEAN_DB_URL=$(echo "$DB_URL" | sed -e 's/[?&]pgbouncer=true//g')

# Extract host/name for filename (optional, but nice for naming)
DB_HOST=$(echo "$CLEAN_DB_URL" | sed -e 's|.*://[^/]*@\([^:/]*\).*|\1|')
DB_NAME=$(echo "$CLEAN_DB_URL" | sed -e 's|.*/\([^?]*\).*|\1|')

# Backup filename
BACKUP_FILE="$BACKUP_DIR/${DB_HOST}_${DB_NAME}_${TIMESTAMP}.sql.gz"

echo "Starting backup for: $DB_NAME on $DB_HOST"

# Run the backup with compression
# Using the connection string directly with pg_dump
pg_dump --column-inserts --inserts --data-only --exclude-table='*prisma_migration*' "$CLEAN_DB_URL" | gzip > "$BACKUP_FILE"

# Check if backup was successful
if [ $? -eq 0 ]; then
    echo "Backup completed successfully: $BACKUP_FILE"
    
    # Optional: remove backups older than 30 days
    find "$BACKUP_DIR" -type f -name "*.sql.gz" -mtime +30 -delete
else
    echo "Error: Backup failed."
    exit 1
fi
