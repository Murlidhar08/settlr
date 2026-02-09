#!/bin/bash

# Usage:
#   ./restore.sh backupfile.sql

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

# PostgreSQL credentials
PGUSER="root"
PGHOST="localhost"
PGDB="settlr_bkp"

# Prompt for password
echo "Restoring database '$PGDB' from '$SQL_FILE' ..."
psql -U "$PGUSER" -h "$PGHOST" -d "$PGDB" -f "$SQL_FILE"

# Print completion message
if [ $? -eq 0 ]; then
  echo "✅ Restore completed successfully!"
else
  echo "❌ Restore failed!"
fi
