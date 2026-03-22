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

# If not provided as argument, prompt the user
if [ -z "$DB_URL" ]; then
    echo -n "Enter the Database Connection String (URL): "
    read -r DB_URL
fi

if [ -z "$DB_URL" ]; then
    echo "Error: Database URL not found."
    usage
fi

# Sanitize URL: pg_dump does not support pgbouncer, pool, or direct query parameters
CLEAN_DB_URL=$(echo "$DB_URL" | \
    sed -E 's/([?&])(pgbouncer|pool|direct)=[^&]*(&)?/\1/g' | \
    sed -E 's/\?&/?/g' | \
    sed -E 's/[?&]$//g')

# Extract host/name for filename (optional, but nice for naming)
DB_HOST=$(echo "$CLEAN_DB_URL" | sed -e 's|.*://[^/]*@\([^:/]*\).*|\1|')
DB_NAME=$(echo "$CLEAN_DB_URL" | sed -e 's|.*/\([^?]*\).*|\1|')

# Backup filename
BACKUP_FILE="$BACKUP_DIR/${DB_HOST}_${DB_NAME}_${TIMESTAMP}.sql"

echo "Starting backup for: $DB_NAME on $DB_HOST"

# Run the backup (No compression, include all schema/data, exclude migration metadata)
pg_dump --column-inserts --inserts --data-only --exclude-table='_prisma_migrations' "$CLEAN_DB_URL" > "$BACKUP_FILE"

# Check if backup was successful
if [ $? -eq 0 ]; then
    echo "Backup completed successfully: $BACKUP_FILE"
    
    # Optional: remove backups older than 30 days
    find "$BACKUP_DIR" -type f -name "*.sql" -mtime +30 -delete
else
    echo "Error: Backup failed."
    exit 1
fi
