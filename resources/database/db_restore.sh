#!/bin/bash

# Usage:
#   ./db_restore.sh backupfile.sql

# Check if filename is provided
if [ -z "$1" ]; then
  echo "Usage: $0 <sql_filename>"
  exit 1
fi

SQL_FILE="$1"

# Check if the file exists
if [ ! -f "$SQL_FILE" ]; then
  echo "Error: File '$SQL_FILE' not found!"
  exit 1
fi

# PostgreSQL connection details
PGUSER="root"
PGHOST="localhost"
PGPORT="5432"
PGDB="postgres"

export "root"

echo "Restoring database '$PGDB' from '$SQL_FILE'..."

psql \
  -U "$PGUSER" \
  -h "$PGHOST" \
  -p "$PGPORT" \
  -d "$PGDB" \
  -f "$SQL_FILE"

# Capture exit status
if [ $? -eq 0 ]; then
  echo "✅ Restore completed successfully!"
else
  echo "❌ Restore failed!"
fi
