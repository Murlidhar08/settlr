#!/bin/bash

# PostgreSQL credentials
export PGPASSWORD="root"

# Database details
DB_NAME="settlr"
DB_USER="root"
DB_HOST="localhost"
DB_PORT="5432"

# Backup destination
BACKUP_DIR="./backup_db"      # change this
mkdir -p "$BACKUP_DIR"

# Timestamp for filename
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Backup filename
BACKUP_FILE="$BACKUP_DIR/${DB_HOST}_${DB_NAME}_${TIMESTAMP}.sql.gz"

# Run the backup with compression
pg_dump --column-inserts --inserts --data-only --exclude-table='*prisma_migration*' -h  "$DB_HOST" -U "$DB_USER" -p "$DB_PORT" -d "$DB_NAME" | gzip > "$BACKUP_FILE"

# Optional: remove backups older than 30 days
find "$BACKUP_DIR" -type f -name "*.sql.gz" -mtime +30 -delete

echo "Backup completed: $BACKUP_FILE"
